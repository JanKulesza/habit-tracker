"use server"

import { User } from "@/generated/prisma/client";
import { requireSession } from "./session";
import { prisma } from "../prisma";
import { userSchema } from "../validations";
import { ServerActionResponse } from "../types/response";
import { formatZodErrors } from "../utils";

export async function updateUser(formData: FormData): Promise<ServerActionResponse<User>> {
    const { user } = await requireSession();

    const { success, data, error } = await userSchema.partial().safeParseAsync({
        name: formData.get("name")?.toString()
    })

    if (!success)
        return { success: false, error: formatZodErrors(error) }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data,
        })
        
        return { success: true, data: updatedUser }
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: "Failed to update user." }
    }
}