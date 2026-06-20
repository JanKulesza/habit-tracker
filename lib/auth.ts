import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

if(!process.env["AUTH_GOOGLE_ID"] || ! process.env["AUTH_GOOGLE_SECRET"])
    throw new Error("Auth enviromental variables are not defined.");

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env["AUTH_GOOGLE_ID"],
            clientSecret: process.env["AUTH_GOOGLE_SECRET"]
        }
    }
});