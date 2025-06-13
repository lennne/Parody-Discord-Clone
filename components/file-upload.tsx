"use client";
import {  UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";


interface FileUploadProps {
    onChange: (url: string) => void;
    endpoint: "messageFile" | "serverImage";
    value: string
}

//type declaration for the FileUpload component, whose type is of React.FC and takes in the FileUploadProps as a generic type
const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    
    const type = value.split('/').pop();
    value = value.split('/').slice(0, -1).join('/');
  
    if(type === "images"){
       return (
        <div className="relative h-20 w-20">
            <Image 
            fill
            src={value as string}
            alt="Upload"
            className="rounded-full"
            />
        <button onClick={()=> onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
            >
            <X className="h-4 w-4 "/>
        </button>
        </div>
        )
    }

    if(type === "pdf"){
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                <a 
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 w-[300px] break-words dark:text-indigo-400 hover:underline">
                    {value}
                </a>
                <button 
                onClick={()=> onChange("")}
                className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                type="button"
                >
                <X className="h-4 w-4 "/>
            </button>
            </div>
        )
    }
    
    return ( 
           <UploadDropzone
           
           endpoint={endpoint}
           onClientUploadComplete={(res)=>{
            console.log("i'm here now")
            const url = res?.[0].url
            let type = res?.[0].type;
            
            if(type === "application/pdf"){
                onChange(url + "/pdf");
            }else{
                type = "images";
                onChange(url + "/images");
            }
            console.log("the type is", type);
            console.log("end of execution")
            return;
           }}
           onUploadError={(error: Error)=> {
            console.log("was there an error",error);
           } }
           />
        
     );
}
 
export default FileUpload;