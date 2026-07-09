import { authClient } from "@/lib/auth-client";
import { LoginSchema, RegisterSchema } from "@/lib/validations";
import { useRouter } from "next/navigation"
import { useTransition } from "react";
import { toast } from "sonner";

export const useAuth = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const credentialsRegister = (values: RegisterSchema) => {
        startTransition(async () => {
            const { error } = await authClient.signUp.email({
                ...values,
            });

            if (error) {
                console.error("BETTER AUTH REGISTER ERROR: ", error);
                toast.error(error.message ?? "Internal server error.");
                return
            }

            toast.success("Registered successfully.");
            router.push('/')
        })
    }

    const credentialsLogin = (values: LoginSchema) => {
        startTransition(async () => {
            const { error } = await authClient.signIn.email({
                ...values,
            });

            if (error) {
                console.error("BETTER AUTH LOGIN ERROR: ", error);
                toast.error(error.message ?? "Internal server error.");
                return
            }

            toast.success("Logged in successfully.");
            router.push('/')
        });
    }

    const signOut = () => {
        startTransition(async () => {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message ?? "Internal server error.")
                return;
            }

            toast.success("Signed out successfully.")
            router.push('/login');
        })
    }

    return { isPending, credentialsRegister, credentialsLogin, signOut };
}