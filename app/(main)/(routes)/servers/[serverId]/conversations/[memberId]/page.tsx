import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

/**
 * This page is responsible for displaying a conversation between the current user and another member within a server.
 * It fetches the current user's profile, and then the member they are trying to converse with.
 * If the user is not a member of the server, it redirects them to the homepage.
 * If the conversation does not exist, it redirects them to the server's page.
 * It then renders a chat header with the other member's information, and a chat input component with the necessary props.
 */
const MemberIdPage = async ({
    params,
    searchParams,
}: MemberIdPageProps) => {
    const profile = await currentProfile();
    searchParams = await searchParams;
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
            {searchParams.video && (
                <MediaRoom
                chatId={conversation.id}
                video={true}
                audio={true}
                />
            )}
          {!searchParams.video && (
            <>
            <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
                conversationId: conversation.id
            }}
            />
            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl
                ="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id
                }}
            /> 
            </>
          )}
     
        </div>
    )
}

export default MemberIdPage;