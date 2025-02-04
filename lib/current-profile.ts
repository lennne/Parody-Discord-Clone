import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

export const currentProfile = async () => {
    const userId  = await (await auth()).userId;

    //if the userId is not available, return null
    if(!userId){
        return redirect("/");
    }

    //connects to the database and finds the profile of the user with the userId 
    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    return profile;
}