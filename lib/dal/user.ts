"use server"

import { User } from "@/generated/prisma/client";
import { requireSession } from "./session";
import { prisma } from "../prisma";
import { userSchema } from "../validations";
import { ServerActionResponse } from "../types/response";
import { formatZodErrors } from "../utils";

export async function updateUser(formData: FormData): Promise<ServerActionResponse<User>> {
    'use server'
    const { user } = await requireSession();

    const { success, data, error } = await userSchema.partial().safeParseAsync({
        name: formData.get("name")
    })
    
    if (!success)
        return { success: false, error: formatZodErrors(error) }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            ...data,
            updatedAt: new Date()
        }
    })

    return {success: true, data: updatedUser}
}