"use client"

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CommandGroup } from "cmdk";

import { useParams, useRouter } from "next/navigation";


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


    const router = useRouter();
    const params = useParams();

    //this is a useEffect made to run everytime the application opens
    useEffect(()=>{

        //this function listens for keyboard events, specifically, the k and ctrl or command key
        const down = (e: KeyboardEvent) => {
            if( e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setOpen((open) => !open);
            }
        }

        //attach the event listener to the specified html component
        document.addEventListener("keydown", down);

        //make sure to return a remove listener since this will execute only when the component is removed from the DOM tree
        return () => document.removeEventListener("keydown", down);
    },[])


    const onClick = ({ id, type} : {id : string, type: "channel" | "member"}) => {
        setOpen(false);
            if(type === "channel"){
                router.push(`/servers/${params?.serverId}/conversations/${id}`)
            }
            if(type === "member"){
                router.push(`/servers/${params?.serverId}/channels/${id}`)
            }
    }

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
                                    <CommandItem key={id} onSelect={() => onClick({id, type})}>
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