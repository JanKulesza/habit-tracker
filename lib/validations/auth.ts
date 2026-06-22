import * as z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const loginSchema = z.object({
    email: z.email("Invalid email address!"),
    password: z.string().regex(passwordRegex, 
        "Password must contain at least 8 characters, an upper case letter, a lower case letter, a digit and a special character (!@#$%^&*)"
    )
});

export type LoginType = z.infer<typeof loginSchema>

export const registerSchema = loginSchema.extend({
    name: z.string("Invalid name!").min(3,"Name is too short, minimum 3!")
})

export type RegisterType = z.infer<typeof registerSchema>