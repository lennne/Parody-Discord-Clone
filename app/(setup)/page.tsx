import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import InitialModal from "@/components/modals/initial-modals";
import { redirect } from "next/navigation";




const SetupPage = async () => {
    const profile = await initialProfile(); //get the profile

    //find the server where the profile is a member
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    //if the server exists, redirect to the server
    if(server) {
        redirect(`/servers/${server.id}`)
    }

    return <InitialModal />;
}
 
export default SetupPage;