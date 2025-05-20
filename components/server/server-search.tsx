"use client"

import { Search } from "lucide-react";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CommandGroup } from "cmdk";

interface ServerSearchProps {    
    data: {
        label: string;
        type: "channel" | "member";
        data?: {
            icon: React.ReactNode;
            name: string;
            id: string; 
        }[] | undefined ,
    }[]
}

export const ServerSearch = ({data}: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    return (
       <>
        { /* Search Button which calls the Search Bar UI */}  
        <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-sm flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        >
            <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400"/>
            <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                Search
            </p>
            <kbd className="pointer-events-none inline-flex  h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                <span className="text-sm" 
                >CMD</span>K
            </kbd>
        </button>
        {/* Search Bar UI containing the list of members data, channels data */}
        <CommandDialog open={open} onOpenChange={setOpen}  >
            <CommandInput placeholder="Search all channels and members"/>
            <CommandList>
                {/* When there are no results */}
                <CommandEmpty>
                    No Results found
                </CommandEmpty>
                {/* This data is an array containing the list of members, channels -> [ memberslist, audioChannelsList, videoChannelsList, chatChannelsList ] */}
                {data.map(({ label, type, data}) => {
                    if (!data?.length) return null;
                    return (
                     
                        <CommandGroup key={label} heading={label}>
                            {data?.map(({id, icon, name }) => {
                                return (
                                    <CommandItem key={id} >
                                        {icon} <span>{name}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )
                }
                )}
            </CommandList>
        </CommandDialog>
       </>
    )
}