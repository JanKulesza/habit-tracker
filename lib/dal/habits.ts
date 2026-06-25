"use server"
import { Habit } from "@/generated/prisma/client"
import { prisma } from "../prisma"
import { ServerActionResponse } from "../types/response"
import { habitsSchema } from "../validations"
import { requireSession } from "./session"
import { formatZodErrors } from "../utils"

export async function getHabits() {
    'use server'
    const { user } = await requireSession()

    return await prisma.habit.findMany({
        where: {
            userId: user.id
        }
    });
}

export async function createHabit(formData: FormData): Promise<ServerActionResponse<Habit>> {
    'use server'
    const { user } = await requireSession();

    const { success, error, data } = await habitsSchema.safeParseAsync({ 
        name: formData.get('name')?.toString(), 
        goal: formData.get('goal')?.toString(), 
        icon: formData.get('icon')?.toString() 
    });

    if (!success) 
        return { success: false, error: formatZodErrors(error) };


    const habit = await prisma.habit.create({
        data: {
            name: data.name,
            goal: data.goal,
            icon: data.icon,
            userId: user.id,
        }
    })
    return { success: true, data: habit };
}