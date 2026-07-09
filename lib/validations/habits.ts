import z from "zod";
import { Icon } from "./helpers";

export const habitsSchema = z.object({
    name: z.string("Invalid name.").min(2, "Name is too short, minimum 2."),
    goal: z.string("Invalid name.").min(1, "Invalid name."),
    icon: z.enum(Icon, "Invalid icon. Please select a valid icon from the list."),
})

export type HabitsSchema = z.infer<typeof habitsSchema>;