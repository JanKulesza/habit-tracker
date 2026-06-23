import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { ZodObject } from "zod";
import { loginSchema, registerSchema } from "./validations";
import { APIError } from "better-auth/api";
import type { HookEndpointContext } from "better-auth"; 

if (!process.env["AUTH_GOOGLE_ID"] || !process.env["AUTH_GOOGLE_SECRET"])
    throw new Error("Auth enviromental variables are not defined.");

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        hooks: {
            before: async (request: HookEndpointContext) => {
                let validator: ZodObject = loginSchema;
                if(!request.path) 
                    throw new APIError("INTERNAL_SERVER_ERROR", {
                        message: "No path provided."
                    });

                if (request.path.endsWith("/sign-up/email"))
                    validator = registerSchema

                const { success, error } = await validator.safeParseAsync({
                    ...request.body
                })
                
                if (!success) {
                    const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(", ");
                    throw new APIError("BAD_REQUEST", {
                        message: `Validation Error: ${errorMessages}`
                    });
                }
            }
        }
    },
    socialProviders: {
        google: {
            clientId: process.env["AUTH_GOOGLE_ID"],
            clientSecret: process.env["AUTH_GOOGLE_SECRET"]
        }
    }
});