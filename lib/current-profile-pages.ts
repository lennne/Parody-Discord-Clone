import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import { redirect } from "next/navigation";

export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId }  =  getAuth(req);

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