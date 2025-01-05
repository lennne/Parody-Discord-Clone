import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
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
        redirect(`/server/${server.id}`)
    }
    return <div>Create a Server!</div>;
}
 
export default SetupPage;