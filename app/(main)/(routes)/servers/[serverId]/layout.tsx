import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import  { RedirectToSignIn }  from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
        children,
        params
    }:{ 
        children: React.ReactNode;
        params: { serverId: string};
    }) => {
        const profile = await currentProfile();
        const { serverId } = await params;
        if(!profile){
            return RedirectToSignIn;
        }

        const server = await db.server.findUnique({
            where: {
                //it's not enough that we're geting only the serverId, someone that knows the serverId
                //someone that knows the serverId can load all the channels and messages for that server
                //we need to confirm that inside the members of the server we have a matching profile with the current profileId
                id: serverId, 
                members: {
                    some: {
                        profileId: profile.id
                    }
                }

            }
        });

        if(!server){
            return redirect("/");
        }
     return ( 
        <div className="h-full">
            <div className=" md:flex fixed h-full w-60 z-20 flex-col inset-y-0">
                <ServerSidebar serverId={serverId}/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
     );
}
 
export default ServerIdLayout;