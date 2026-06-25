import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZodErrors(err: ZodError) {
  return err.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(". \n");
}