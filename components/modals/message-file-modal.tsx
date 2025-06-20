"use client"; // Add this at the top of the file

import axios from "axios";
import * as z from "zod";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,

} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";


//zod schema for the form validation
const formSchema = z.object({
    fileUrl:  z.string().min(1,{
            message: "Attachment is required"
    }),
})

const MessageFileModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();  

    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data;
    

    //reacts hook form which is used to manage the form state
    const form = useForm({
        resolver: zodResolver(formSchema), //use the zod schema for validation
        defaultValues: {
            fileUrl: ""
        }
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const isLoading = form.formState.isSubmitting; //check if the form is submitting so that we can disable the inputs and buttons

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            console.log("why arent you running")
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query, 
            });
            console.log("are you even tryiing",)
            
            await axios.post(url,{
                 ...values,
                    content: values.fileUrl }    
                );
            form.reset();
            router.refresh();
            handleClose();    
        }catch(error){
            console.log("error at ",error);
        }

    }

    return  (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden"> 
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl font-bold text-center ">
                    Add an attachment
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    Send a file as a message
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center text-center justify-center ">
                            <FormField 
                            control={form.control}
                            name="fileUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload 
                                            endpoint="messageFile"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>
                       
                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button
                        variant={"primary"}
                        disabled={isLoading}
                        >
                            Send
                       </Button>

                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    );
}
 
export default MessageFileModal;