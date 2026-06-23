"use client"
import FormInput from '@/components/inputs/form-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { authClient } from '@/lib/auth-client';
import { RegisterType, registerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';

export default function LoginForm() {
    const form = useForm<RegisterType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    })

    const onSubmit = async (values: RegisterType) => {
        const {email,name,password} = values;
        const { data, error } = await authClient.signUp.email({
            name, 
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
                    <FormInput label="Name" placeholder="John Smith" name="name" />
                    <FormInput label="Email" placeholder="johnsmith@example.com" name="email" />
                    <FormInput label="Password" name="password" type="password" placeholder="pAssword123_" />
                    <Button
                        type="submit"
                        form="login-form"
                        className="p-5 w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Registerring..." : "Register"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">Already have an account? <Link href="/login" className="text-primary underline cursor-pointer">Log in</Link></p>
                </FieldGroup>
            </form>
        </FormProvider>
    )
}
