import { PrismaClient } from "@prisma/client";

declare global {
    var prisma : PrismaClient | undefined;
};

// Create a new PrismaClient instance if it doesn't exist
// Otherwise, use the existing one
//this is because when our project is in development mode it'll try to initialize a new PrismaClient instance every time
//we refresh our project, so what we did is we appended our prismaclient to globalThis because globalThis is not affected by the hot reload
//
export const db = globalThis.prisma || new PrismaClient(); 

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;