import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json(); //destructure the request data

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.update({
            where: { //for the server where id is params.serverId
                id: params.serverId,
                profileId: profile.id, //this is to only allow the current profile that was able to access this route to be an admin 
                                        // since only admins have the options in their server side bar header 
            },
            data: {//outside the where block because we're editing the server itself and not table(object) within server
                name, 
                imageUrl
            }
            
        });

        return NextResponse.json(server); //after updating, return the server object data
    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });

    }
}