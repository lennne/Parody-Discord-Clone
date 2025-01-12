import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";


export async function POST(req: Request){
    try{
        //Since this is our backend we will get the name and imageUrl from the request body
        const { name, imageUrl } = await req.json();
        //get the current profile of the user from the currentProfile file in the lib folder we created earlier
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        //after validation create a new server with the profileId, name, imageUrl and a unique invite code
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {name: "general", profileId: profile.id},   
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        });
        
        //After this server API route handles the "create a server request" 
        //it returns to the front-end a response with the object "server"
        return NextResponse.json(server);
    }catch(error){
        console.log("[SERVERS_POST]", error);        
        return new NextResponse("Internal Error", { status: 500 });
    }
}
