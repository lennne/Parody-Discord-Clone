import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


interface InviteCodePageProps {
    params: {
         inviteCode : string
    };
};


const InviteCodePage = async (
    { params } : InviteCodePageProps
) => {

    const profile = await currentProfile();
    
    if(!profile){
        return RedirectToSignIn;
    }

    if(!params.inviteCode){
        return redirect("/");
    }

    //check if the person trying to join is already in the server
    //if user is already a member redirect them to the server's page
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params?.inviteCode,
            members: {
                some: { 
                    profileId: profile.id
                }
            }
        }
    });

    if(existingServer){
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        //create a new member
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id, //there's no need to assign role cause all profiles are guests by default
                    }
                ]
            }
        }
    });

    if(server){
        return redirect(`/servers/${server.id}`)
    }

    return null;
}
 
export default InviteCodePage;