import { Entry } from "@/generated/prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZodErrors(err: ZodError) {
  return err.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(". \n");
}

export function formatEntriesByDate(entries: Entry[]): Record<string, Entry[]> {
  return entries.reduce((acc, cur) => {
    acc[cur.date].push(cur)
    return acc;
  }, {} as Record<string, Entry[]>)
}