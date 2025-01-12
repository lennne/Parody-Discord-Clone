import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();

//middleware to handle authentication
const handleAuth = async () => {
    const {userId}:{userId: string | null} = await auth(); //get the userId from the auth function by destructuring it from the auth object
    if(!userId) throw new Error("Unauthorized");
    return {userId: userId};
}


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({image: {maxFileSize: "4MB", maxFileCount: 1} }) //accepts only one image file with a maximum size of 4MB when uploading the server image
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

    messageFile: f(['image', 'pdf']) //accepts both image and pdf files when uploading in the chats
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
