import { Entry } from "@/generated/prisma/client";
import { clsx, type ClassValue } from "clsx"
import { addDays, format, isAfter } from "date-fns";
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZodErrors(err: ZodError) {
  return err.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(". \n");
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
    startDate = addDays(startDate, 1), 'yyyy-MM-dd';
  }

  return formatted
}