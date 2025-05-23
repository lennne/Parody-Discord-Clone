import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params } : {params: { channelId: string}}
){
    try{
        const profile = await currentProfile();
        params = await params;

        //this is the query body from your url
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId){
            return new NextResponse("Server ID missing", {status: 400});
        }

        if(!params.channelId){
            return new NextResponse("Channel ID missing", { status: 400});
        }

        const server = await db.server.update({
            //similar to MYSQL "select something where " => we use this to identify what data in the database we're trying to access, like a search query
            where: {
                //search for the server data with this particular id
                id: serverId,
                //when you find the server with this id, search through its members for the member that has this particular profile id
                //when you find that member, make sure his role matches the data in roles[array] we're looking for, just either one
                members: {
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            //NB: although on the front end, the delete option has been removed, the front end validation can still be bypassed so it's best to protect it here also
            //the data or process being performed
            data: {
                //once the channel has been found
                channels: {
                    //delete the channel that has the following information
                    delete: {
                        //has the following id
                        id: params?.channelId,
                        //and it's name is not general
                        name: {
                            not: "general",
                        }
                    }
                }
            }
        });

        //return the server whose channel we operated on
        return NextResponse.json(server);

    }catch(error){
         console.log("[CHANNEL_ID_DELETE]", error);
         return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    {params}: {params: { channelId: string }}
){
    try{
        const profile = await currentProfile();
        params = await params;

        const {searchParams} = new URL((req.url));
        const serverId = searchParams.get("serverId");

        const {name, type} = await req.json();

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!params.channelId){
            return new NextResponse("Channel ID missing", {status : 400});
        }

        if(!serverId){
            return new NextResponse("Server ID missing", {status: 400});
        }

        if(name === "general"){
            return new NextResponse("Name cannot be found", {status: 400});
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels:{
                    update:{
                        where:{
                            id: params?.channelId,
                            NOT: {
                                name: "general"
                            },
                        },
                        data: {
                            name,
                            type,
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    }catch(error){
        console.log("[CHANNEL_ID_PATCH]", error);
    }
}