"use server"
import { prisma } from "../prisma"
import { ServerActionResponse } from "../types/response"
import { requireSession } from "./session"
import { Entry, Habit } from "@/generated/prisma/browser"
import { format, isAfter, isBefore, startOfDay } from "date-fns"
import { cache } from "react"

export const getEntriesForCurrentUser = cache(async (habitId?: Habit['id']): Promise<ServerActionResponse<Entry[]>> => {
    'use server'
    const { user } = await requireSession()

    try {
        return {
            success: true, data: await prisma.entry.findMany({
                where: {
                    habitId,
                    habit: {
                        userId: user.id
                    },
                },
                orderBy: {
                    date: "asc"
                }
            })
        }
    } catch (error) {
        console.error("Error fetching entries:", error);
        return { success: false, error: "Failed to fetch entries." }
    }
})

export async function createEntry(habitId: Habit['id'], date: Date): Promise<ServerActionResponse<Entry>> {
    'use server'
    const { user } = await requireSession()

    if (isAfter(date, new Date()))
        return { success: false, error: "Unable to create entry in future." }

    try {
        const habit = await prisma.habit.findFirst({
            where: {
                userId: user.id,
                id: habitId
            }
        })

        if (!habit) {
            return { success: false, error: "Habit not found" }
        }

        if(isBefore(date, startOfDay(habit.createdAt))) {
            return { success: false, error: "Unable to create an entry before habit creation day." }
        }

        const existingEntry = await prisma.entry.findFirst({
            where: {
                date: format(date, 'yyyy-MM-dd'),
                habitId
            }
        });

        if (existingEntry) {
            return { success: false, error: "Entry already exists for this date" }
        }

        const entry = await prisma.entry.create({
            data: {
                habitId,
                date: format(date, 'yyyy-MM-dd'),
            }
        });

        return {
            success: true, data: entry
        }
    } catch (error) {
        console.error("Error creating entry:", error);
        return { success: false, error: "Failed to create entry." }
    }
}

export async function deleteEntry(entryId: Entry['id']): Promise<ServerActionResponse<null>> {
    'use server'
    const { user } = await requireSession()

    try {
        const entry = await prisma.entry.findFirst({
            where: {
                id: entryId,
                habit: {
                    userId: user.id
                }
            }
        })

        if (!entry) {
            return { success: false, error: "Entry not found" }
        }

        await prisma.entry.delete({
            where: {
                id: entryId
            }
        });

        return {
            success: true, data: null
        }
    } catch (error) {
        console.error("Error deleting entry:", error);
        return { success: false, error: "Failed to delete entry." }
    }
}

export async function switchEntry(habitId: Habit['id'], date: Date): Promise<ServerActionResponse<Entry | null>> {
    'use server'
    const { user } = await requireSession()

    const entry = await prisma.entry.findFirst({
        where: {
            habitId,
            habit: {
                userId: user.id
            },
            date: format(date, 'yyyy-MM-dd')
        }
    })

    if (!entry)
        return createEntry(habitId, date);

    return deleteEntry(entry.id)
}
