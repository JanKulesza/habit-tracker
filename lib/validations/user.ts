import z from "zod";

// For now only these are required for update
export const userSchema = z.object({
    name: z.string("Name is required.").min(1,"Name is required."),
})

export type UserSchema = z.infer<typeof userSchema>