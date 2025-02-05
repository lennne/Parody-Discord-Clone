"use client"; // Add this at the top of the file
import { Check, Copy, RefreshCw } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";




export const MembersModal = () => {
    const {onOpen, isOpen, onClose, type, data } = useModal();
    
    const isModalOpen = isOpen && type === "members";   
    const { server } = data as { server: ServerWithMembersWithProfiles};

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 


    

    return  <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black overflow-hidden"> 
            <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl font-bold text-center ">
                    Manage Members
                </DialogTitle> 
                <DialogDescription
            className="text-center text-zinc-500"
            >
                {server?.members?.length} Members
            </DialogDescription>
            </DialogHeader>
            <ScrollArea 
            className="mt-8 max-h-[420px] pr-6"
            >
                {server?.members?.map((member) => (
                    <div key={member.id} className="flex items-center
                    gap-x-2 mb-6
                    ">
                        <UserAvatar src={member.profile.imageUrl} />
                        <div className="flex flex-col gap-y-1">
                            <div className="text-xs font-semibold flex items-center">
                                {member.profile.name}
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea>
            <div className="p-6">
                hello members

            </div>
        </DialogContent>
    </Dialog>
    
}