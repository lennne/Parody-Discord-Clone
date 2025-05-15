import { currentProfile } from "@/lib/current-profile";  
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";

interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({serverId}: ServerSidebarProps) => {
    const profile = await currentProfile();
    
    if(!profile){
        redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels:{
                orderBy: {
                    createdAt: "asc"
                },
            },
            members: {
                 include:{
                    profile:true,
                 },
                 orderBy:{
                    role:"asc"
                 }
            }
        }
    });


    //store the various channels in their respective variables
    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    //filter the current users profile out and retrieve all other profiles
    const members = server?.members.filter((member) => member.profile.id !== profile.id);

    if(!server){
        return redirect("/");
    }

    //find the users role in the server
    const role = server.members.find((member) => member.profileId === profile.id)?.role;


    return (
        //If we are in dark mode select the dark color and if not select the grey color
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
            server={server}
            role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch />
                </div>
            </ScrollArea>
        </div>
    )
}