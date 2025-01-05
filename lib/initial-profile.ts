import { currentUser } from "@clerk/nextjs/server"; //importing the currentUser function
import {db} from "@/lib/db"; //importing our db instance
import { redirect } from "next/navigation";

export const initialProfile = async () => {
    const user = await currentUser(); //get the current user

    if(!user) {
        redirect('/sign-in'); //redirect to sign in if there is no user
    }

    //get the profile of the user by finding the user id
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    //if the profile exists, return the profile
    if(profile) {
        return profile;
    }

    //if the profile does not exist, create a new profile
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        }
    });

    return newProfile;
};

