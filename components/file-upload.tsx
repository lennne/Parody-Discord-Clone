"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";


interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: "messageFile" | "serverImage";
    value: string;
}

//type declaration for the FileUpload component, whose type is of React.FC and takes in the FileUploadProps as a generic type
const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    
    const fileType = value?.split(".").pop();
    
    if(value && fileType !== "pdf"){
       return (
        <div className="relative h-20 w-20">
            <Image 
            fill
            src={value}
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
    
    return ( 
           <UploadDropzone 
           
           endpoint={endpoint}
           onClientUploadComplete={(res)=>{
            onChange(res?.[0].url);
           }}
           onUploadError={(error: Error)=> {
            console.log(error);
           } }
           />
        
     );
}
 
export default FileUpload;