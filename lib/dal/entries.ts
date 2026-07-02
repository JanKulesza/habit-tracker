"use server"
import { prisma } from "../prisma"
import { ServerActionResponse } from "../types/response"
import { requireSession } from "./session"
import { Entry, Habit } from "@/generated/prisma/browser"
import { format, isAfter, isBefore, subDays } from "date-fns"
import { cache } from "react"

export const getEntriesForCurrentUser = cache(async (habitId?: Habit['id']): Promise<ServerActionResponse<Entry[]>> => {
    'use server'
    const { user } = await requireSession()

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
})

export async function createEntry(habitId: Habit['id'], date: Date): Promise<ServerActionResponse<Entry>> {
    'use server'
    const { user } = await requireSession()

    if (isAfter(date, new Date()))
        return { success: false, error: "Unable to create entry in future." }

    const habit = await prisma.habit.findFirst({
        where: {
            userId: user.id,
            id: habitId
        }
    })

    if (!habit) {
        return { success: false, error: "Habit not found" }
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

    const entryDayBefore = await prisma.entry.findFirst({
        where: {
            habitId,
            date: format(subDays(date, 1), 'yyyy-MM-dd')
        }
    });

    const entry = await prisma.entry.create({
        data: {
            habitId,
            date: format(date, 'yyyy-MM-dd'),
            streak: entryDayBefore ? entryDayBefore.streak + 1 : 1
        }
    });

    return {
        success: true, data: entry
    }
}

export async function deleteEntry(entryId: Entry['id']): Promise<ServerActionResponse<null>> {
    'use server'
    const { user } = await requireSession()

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

    const deletedEntry = await prisma.entry.delete({
        where: {
            id: entryId
        }
    });
    if (isBefore(deletedEntry.date, format(new Date(), 'yyyy-MM-dd'))) {
        await prisma.entry.updateMany({
            where: {
                habitId: deletedEntry.habitId,
                date: {
                    gt: format(deletedEntry.date, 'yyyy-MM-dd')
                }
            },
            data: {
                streak: { decrement: 1 }
            }
        });
    }

    return {
        success: true, data: null
    }
}

export async function switchEntry(habitId: Habit['id'], date: Date): Promise<ServerActionResponse<Entry | null>> {
    'use server'
    const { user } = await requireSession()

    const entry = await prisma.entry.findFirst({
        where: {
            habitId,
            date: format(date, 'yyyy-MM-dd')
        }
    })

    if (!entry)
        return createEntry(habitId, date);

    return deleteEntry(entry.id)
}
