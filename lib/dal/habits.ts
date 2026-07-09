"use server"
import { Habit } from "@/generated/prisma/client"
import { prisma } from "../prisma"
import { ServerActionResponse } from "../types/response"
import { habitsSchema } from "../validations"
import { requireSession } from "./session"
import { formatZodErrors } from "../utils"
import { cache } from "react"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"

export const getHabitsForCurrentUser = cache(async (): Promise<ServerActionResponse<Habit[]>> => {
    const session = await requireSession();

    try {
        return {
            success: true, data: await prisma.habit.findMany({
                where: { userId: session.user.id },
                orderBy: {
                    createdAt: "asc"
                }
            })
        };
    } catch (error) {
        console.error("Error fetching habits:", error);
        return { success: false, error: "Failed to fetch habits." }
    }
});

export const getHabit = cache(async (habitId: Habit['id']): Promise<ServerActionResponse<Habit>> => {
    const session = await requireSession();

    try {
        const habit = await prisma.habit.findUnique({
            where: { userId: session.user.id, id: habitId },
        });

        if (!habit)
            return { success: false, error: "Habit not found." }

        return { success: true, data: habit };
    } catch (error) {
        console.error("Error fetching habit:", error);
        return { success: false, error: "Failed to fetch habit." }
    }
})

export async function createHabit(formData: FormData): Promise<ServerActionResponse<Habit>> {
    const { user } = await requireSession();

    const { success, error, data } = await habitsSchema.safeParseAsync({
        name: formData.get('name')?.toString(),
        goal: formData.get('goal')?.toString(),
        icon: formData.get('icon')?.toString()
    });

    if (!success)
        return { success: false, error: formatZodErrors(error) };

    try {
        const habit = await prisma.habit.create({
            data: {
                name: data.name,
                goal: data.goal,
                icon: data.icon,
                userId: user.id,
                createdAt: new Date()
            }
        })
        return { success: true, data: habit };
    } catch (error) {
        console.error("Error creating habit:", error);
        return { success: false, error: "Failed to create habit." }
    }
}

export const updateHabit = async (habitId: Habit['id'], formData: FormData): Promise<ServerActionResponse<Habit>> => {
    const { user } = await requireSession();
    try {
        const { success, error, data } = await habitsSchema.partial().safeParseAsync({
            name: formData.get('name')?.toString(),
            goal: formData.get('goal')?.toString(),
            icon: formData.get('icon')?.toString()
        });

        if (!success)
            return { success: false, error: formatZodErrors(error) };

        const habit = await prisma.habit.update({
            where: {
                id: habitId,
                userId: user.id
            },
            data
        })
        return { success: true, data: habit };
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025")
            return { success: false, error: "Habit not found." }
        console.error("Error updating habit:", error);
        return { success: false, error: "Failed to update habit." }
    }
}

export async function deleteHabit(habitId: Habit['id']): Promise<ServerActionResponse<null>> {
    const { user } = await requireSession();
    try {
        await prisma.habit.delete({
            where: {
                id: habitId,
                userId: user.id
            },
        })
        return { success: true, data: null };
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025")
            return { success: false, error: "Habit not found." }
        console.error("Error deleting habit:", error);
        return { success: false, error: "Failed to delete habit." }
    }
}