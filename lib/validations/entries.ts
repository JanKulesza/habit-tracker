import { format, isValid } from "date-fns";
import z from "zod";
import { isFutureDate, isValidTimeZone } from "./helpers";

export const entrySchema = z.object({
    habitId: z.number("Habit id is required.").min(0, "Provide correct habit id."),
    date: z.object({
        dateStr: z
            .string("Date is required")
            .regex(
                /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
                "Invalid date format."
            )
            .refine(val => {
                const d = new Date(val)
                return isValid(d) && format(d, 'yyyy-MM-dd') === val
            }, "Invalid date string."),
        timeZone: z
            .string()
            .refine(tz => isValidTimeZone(tz), "Invalid timezone.")
    }).refine(({ dateStr, timeZone }) => !isFutureDate(dateStr, timeZone), "Unable to create an entry in future.")
})