"use client";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";


interface FileData {
    url?: string;
    type?: string;
}

interface FileUploadProps {
    onChange: (fileData: FileData) => void;
    endpoint: "messageFile" | "serverImage";
    value: FileData | undefined;
}

//type declaration for the FileUpload component, whose type is of React.FC and takes in the FileUploadProps as a generic type
const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    
    
    if(value && value.type === "images"){
       return (
        <div className="relative h-20 w-20">
            <Image 
            fill
            src={value.url as string}
            alt="Upload"
            className="rounded-full"
            />
        <button onClick={()=> onChange({url:""})}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
            >
            <X className="h-4 w-4 "/>
        </button>
        </div>
        )
    }

    if(value && value.type === "pdf"){
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                <a 
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 w-[300px] break-words dark:text-indigo-400 hover:underline">
                    {value.url}
                </a>
                <button 
                onClick={()=> onChange({url:""})}
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
            const url = res?.[0].url
            let type = res?.[0].type;
            if(type === "application/pdf"){
                onChange({url, type: "pdf"});
            }else{
                type = "images";
                onChange({url, type: "images"});
            }
            
           }}
           onUploadError={(error: Error)=> {
            console.log(error);
           } }
           />
        
     );
}
 
export default FileUpload;