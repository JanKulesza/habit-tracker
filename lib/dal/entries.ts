"use server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"
import { prisma } from "../prisma"
import { ServerActionResponse } from "../types/response"
import { formatZodErrors } from "../utils"
import { entrySchema, toZonedDateStr } from "../validations"
import { requireSession } from "./session"
import { Entry, Habit } from "@/generated/prisma/browser"
import { isBefore } from "date-fns"
import { cache } from "react"

export const getEntriesForCurrentUser = cache(async (habitId?: Habit['id']): Promise<ServerActionResponse<Entry[]>> => {
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

// Fix: edge case client and server date difference
export async function toggleEntry(habitId: Habit['id'], date: { dateStr: string, timeZone: string }): Promise<ServerActionResponse<Entry | null>> {
    const { user } = await requireSession()

    try {
        const { dateStr, timeZone } = date;
        const { success, error } = await entrySchema.safeParseAsync({ habitId, date })
        if (!success)
            return { success: false, error: formatZodErrors(error) };

        const existingEntry = await prisma.entry.findUnique({
            where: {
                habitId_date: {
                    habitId: habitId,
                    date: dateStr
                },
                habit: {
                    userId: user.id
                }
            },
            select: { id: true }
        })

        if (!existingEntry) {
            const habit = await prisma.habit.findUnique({
                where: {
                    userId: user.id,
                    id: habitId
                },
                select: { createdAt: true }
            })

            if (!habit) {
                return { success: false, error: "Habit not found" }
            }

            if (isBefore(dateStr, toZonedDateStr(habit.createdAt, timeZone))) 
                return { success: false, error: "Unable to create an entry before habit creation day." }

            const entry = await prisma.entry.upsert({
                where: {
                    habitId_date: {
                        habitId,
                        date: dateStr,
                    }
                },
                create: {
                    habitId,
                    date: dateStr,
                },
                update: {}, // update parameter empty for findOrCreate behaviour
            });

            return { success: true, data: entry }
        }

        await prisma.entry.delete({
            where: {
                id: existingEntry.id
            }
        });

        return { success: true, data: null }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025")
            return { success: false, error: "Entry has already been deleted." }
        console.error("Error switching entry:", error);
        return { success: false, error: "Failed to toggle entry." }
    }
}
