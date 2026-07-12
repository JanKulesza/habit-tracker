import { Habit } from "@/generated/prisma/client";
import { useEntries, useHabits } from "@/lib/store/habit-store";
import { getBestStreak, getStreakLog } from "@/lib/utils";
import { format } from "date-fns";
import { useMemo } from "react";

export function useStreakData() {
    const habits = useHabits() as Habit[]
    const entries = useEntries();

    return useMemo(() => {
        const formattedDate = format(new Date(), "yyyy-MM-dd");
        const streakLogs = new Map<Habit['id'], Map<string, number>>();
        const bestStreaks = new Map<Habit['id'], number>();
        let runningStreaks = 0;

        for (const h of habits) {
            streakLogs.set(h.id, getStreakLog(h, entries));
            if ((streakLogs.get(h.id)?.get(formattedDate) ?? 0) > 0) 
                runningStreaks++;
            bestStreaks.set(h.id, streakLogs.has(h.id) ? getBestStreak(streakLogs.get(h.id)!) : 0)
        }

        return { streakLogs, runningStreaks, bestStreaks };
    }, [habits, entries]);
}