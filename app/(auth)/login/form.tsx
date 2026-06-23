"use client"
import { FormCheckBox } from '@/components/inputs/form-checkbox';
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
            password: "",
            rememberMe: false
        }
    })

    const onSubmit = async (values: LoginType) => {
        const { data, error } = await authClient.signIn.email({
            ...values
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
                    <FormCheckBox name="rememberMe" label="Remember me" description="Keep me logged in on this device." defaultChecked={form.watch("rememberMe")} />
                    <Button
                        type="submit"
                        form="login-form"
                        className="p-5 w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">Don't have an account? <Link href="/register" className="text-primary underline cursor-pointer">Register</Link></p>
                </FieldGroup>
            </form>
        </FormProvider>
    )
}
