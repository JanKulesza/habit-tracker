import { Entry, Habit } from "@/generated/prisma/client";
import { clsx, type ClassValue } from "clsx"
import { addDays, format, isAfter, isBefore, isWithinInterval } from "date-fns";
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(val: string) {
    return val.charAt(0).toUpperCase() + val.slice(1);
}

export function formatZodErrors(err: ZodError) {
  return err.issues.map(err => capitalizeFirstLetter(`${err.path.join('.')}: ${err.message}`)).join("\n");
}

export function formatEntriesByDate(entries: Entry[], startDate: Date): Record<string, Entry[]> {
  const formatted = entries.reduce((acc, cur) => {
    if (!startDate || isAfter(cur.date, startDate)) {
      if (!acc[cur.date]) {
        acc[cur.date] = [];
      }
      acc[cur.date].push(cur)
    }
    return acc;
  }, {} as Record<string, Entry[]>)

  while (!isAfter(startDate, new Date())) {
    if (!formatted[format(startDate, 'yyyy-MM-dd')]) {
      formatted[format(startDate, 'yyyy-MM-dd')] = [];
    }
    startDate = addDays(startDate, 1);
  }

  return formatted
}

// Returns completion rate within specified range [startDate, startDate + numberOfDays], using formula (total entries / (habitsNum * (numberOfDays + 1)))
export function completionRatePerRange(startDate: Date, numberOfDays: number, entries: Entry[], habitsNum: number) {
  return (
    Number(
      (entries.reduce((acc, cur) =>
        isWithinInterval(cur.date, { start: startDate, end: addDays(startDate, numberOfDays) }) ? acc + 1 : acc
        , 0) / (habitsNum * (numberOfDays + 1)) * 100).toFixed(0))
  );
}

// Returns Map containing information about a streak in a given date from range [habit.createdAt - now]
export function getStreakLog(habit: Habit, entries: Entry[]): Map<string, number> {
  const entriesSet = new Set<string>();
  for (const e of entries.filter(i => i.habitId === habit.id)) {
    entriesSet.add(e.date);
  }

  const streakLog = new Map<string, number>();
  let date = format(habit.createdAt, 'yyyy-MM-dd'), previousStreak = entriesSet.has(date) ? 1 : 0;
  streakLog.set(date, previousStreak);

  while (isBefore(date, format(new Date(), 'yyyy-MM-dd'))) {
    date = format(addDays(date, 1), 'yyyy-MM-dd');
    if (!entriesSet.has(date))
      previousStreak = 0;
    else previousStreak++;
    streakLog.set(date, previousStreak);
  }

  return streakLog
}

// Takes streakLogs for every habit and returns the best streak out of all
export function getBestStreak(streakLogs: Map<Habit['id'], Map<string, number>>) {
  let best = 0;
  streakLogs.forEach((s => {
    s.forEach((val) => {
      if (val > best)
        best = val;
    })
  }))

  return best;
}