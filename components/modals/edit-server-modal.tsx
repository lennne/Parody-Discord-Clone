"use client"; // Add this at the top of the file

import axios from "axios";
import * as z from "zod";
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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";


//zod schema for the form validation
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
})

export const EditServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter();
    const isModalOpen = isOpen && type === "editServer";   
    const { server } = data;

      //reacts hook form which is used to manage the form state
      const form = useForm({
        resolver: zodResolver(formSchema), //use the zod schema for validation
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    useEffect(() => {
        if(server){
            //this will update the z form's name, image field to the name of the server and image of the server
           form.setValue("name", server.name); 
           form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form]); //we put in form and server so that it can track that when there's a new value this useEffect should run again once

  

    const isLoading = form.formState.isSubmitting; //check if the form is submitting so that we can disable the inputs and buttons

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/servers/${server?.id}`, values); //target a specific server to send the request
            form.reset();
            router.refresh();
            onClose();
        }catch(error){
            console.log(error);
        }

    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return  <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl font-bold text-center ">
                    Customize your profile.
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    Give your a server a personality with a name and an Image. You can always change this later.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center text-center justify-center ">
                            <FormField 
                            control={form.control}
                            name="imageUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload 
                                            endpoint="serverImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField 
                        control={form.control}
                        name = "name"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel
                                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                >
                                    Server name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                    disabled={isLoading}
                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Edit Server"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button 
                        variant={"primary"}
                        disabled={isLoading}
                        >
                            Save
                        </Button>

                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    
}