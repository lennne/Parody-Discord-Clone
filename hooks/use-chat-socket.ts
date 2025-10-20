import { useSocket } from "@/components/providers/socket-provider";
import { Member, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "postcss";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export const useChatSocket = ({
    addKey, 
    updateKey,
    queryKey
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        //use socket to listen for messages
        //"updateKey" is the event name
        //messageWithMemberWithProfile is the type of message we're listening for
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            //queryClient is the react query client that is used to update the cache in real time
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0 ) {
                    return oldData;
                }

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            //if the id of the message is the same as the id of the message we're listening for then return the message
                            if (item.id === message.id) {
                                return message;
                            }
                            //if the id of the message is not the same as the id of the message we're listening for then return the message
                            return item;
                        })
                    }
                })

                return {
                    ...oldData, 
                    pages: newData
                }


            })
        })

        //use socket to listen for new messages
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }]
                    }
                }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items,
                    ]
                }

                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        //return a function that will be called when the component is unmounted
        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [queryClient, addKey, queryKey, socket, updateKey ])
}