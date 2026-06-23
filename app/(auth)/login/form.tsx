"use client"
import FormInput from '@/components/inputs/form-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { LoginType, loginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';

export default function LoginForm() {
    const form = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: LoginType) => {
        const { email, password } = values
        const { data, error } = await authClient.signIn.email({
            email, 
            password,
        });
        if(error)
            console.log(error);
        else 
            console.log(data);
    }
    return (
        <FormProvider {...form}>
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FormInput label="Email" placeholder="johnsmith@example.com" name="email" />
                    <FormInput label="Password" name="password" type="password" placeholder="pAssword123_" />
                    <Button
                        type="submit"
                        form="login-form"
                        className="p-5 w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">Don't have an account? <Link href="/register" className="text-primary underline cursor-pointer">Sign up</Link></p>
                </FieldGroup>
            </form>
        </FormProvider>
    )
}
