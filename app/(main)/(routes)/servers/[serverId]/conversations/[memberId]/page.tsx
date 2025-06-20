import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({params}: MemberIdPageProps) => {
    const profile = await currentProfile();
    params = await params;
    if(!profile){
        return RedirectToSignIn
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }, 
        include: {
            profile: true,
        }, 
    });

    if(!currentMember){
        return redirect("/"); 
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
    if(!conversation){
        return redirect(`/servers/${params.serverId}`);
    }

    //memberOne and membertwo are returned when a conversation is found or created
    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
          <ChatHeader 
            imageUrl={otherMember.profile.imageUrl}
            name={otherMember.profile.name}
            serverId={params.serverId}
            type="conversation" 
            /> 
            <div className="flex-1">Future Messages</div>
         <ChatInput
            apiUrl="/api/socket/messages"
            type="conversation"
            name={memberTwo.profile.name} 
            query={{
                channelId: memberTwo.id,
                serverId: memberTwo.serverId,
            }}
        /> 
        </div>
    )
}

export default MemberIdPage;