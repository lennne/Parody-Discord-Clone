import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;  

export async function GET(req: Request){
    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!channelId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let messages: Message[] = []; 


        if(cursor){
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                //start from the id for that message we're passing in cursor
                //essentially cursor serves as the id for our current message
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc", 
                }
            })
        }else{
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            });
        }

        let nextCursor = null;

        //if there are still more messages tenSTACKQUERY will update and get more data starting from the end of the previous messages
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH -1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });




    }catch(error){
        console.log("[MESSAGES_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}