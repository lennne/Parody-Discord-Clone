//Functionality Components
import { currentProfile } from "@/lib/current-profile";  
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";


//UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"  
import { Hash, Mic, ShieldAlert, ShieldCheck, Videotape } from "lucide-react";

//Custom UI Components
import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { text } from "stream/consumers";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";


interface ServerSidebarProps {
    serverId: string;
}

const iconMap =  {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/> ,
    [ChannelType.VIDEO]: <Videotape className="mr-2 h-4 w-4"/> 
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
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
                    {/* Component which displays the server search dialog */}
                    <ServerSearch data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                name: channel.name,
                                id: channel.id,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Audio Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                name: channel.name,
                                id: channel.id,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                name: channel.name,
                                id: channel.id,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Members Channels",
                            type: "member",
                            data: members?.map((member) => ({
                                name: member.profile.name,
                                id: member.profile.id,
                                icon: roleIconMap[member.role]
                            }))
                        }
                    ]
                    }
                    />
                    
                    {/* Separator for separating UIs */}
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2 "/>

                    {/* UI for separating the text Channels */}
                    {!!textChannels?.length && ( 
                        <div className="mb-2">
                               {/* Beggining of the text channels section for the server sidebar */}
                            <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                            />
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    )}

                    {/* UI for separating the audio Channels */}
                     {!!audioChannels?.length && ( 
                        <div className="mb-2">
                               {/* Beggining of the audio channels section for the server sidebar */}
                            <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                            />
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    )}

                    {/* UI for separating the video Channels */}
                       {!!videoChannels?.length && ( 
                        <div className="mb-2">
                            {/* Beggining of the video channels section for the server sidebar */}
                            <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                            />
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    )}

                      {/* UI for separating the members Channels */}
                       {!!members?.length && ( 
                        <div className="mb-2">
                            {/* Beggining of the video channels section for the server sidebar */}
                            <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                            />
                            {members.map((member) => (
                                <ServerMember
                                   key={member.id}
                                   member={member}
                                   server={server}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}