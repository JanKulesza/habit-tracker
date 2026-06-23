"use client"
import { FormCheckBox } from '@/components/inputs/form-checkbox';
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
            name: "",
            rememberMe: false,
            acceptTerms: false
        }
    })

    const onSubmit = async (values: RegisterType) => {
        const { data, error } = await authClient.signUp.email({
            ...values
        });
        if(error)
            console.log(error);
        else 
            console.log(data);
    }
    return (
        <FormProvider {...form}>
            <form id="login-form"  onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FormInput label="Name" placeholder="John Smith" name="name" />
                    <FormInput label="Email" placeholder="johnsmith@example.com" name="email" />
                    <FormInput label="Password" name="password" type="password" placeholder="pAssword123_" />
                    <FormCheckBox name="rememberMe" label="Remember me" defaultChecked={form.watch("rememberMe")} />
                    <FormCheckBox name="acceptTerms" label="Accept Terms and Conditions" description="I agree to the terms and conditions." defaultChecked={form.watch("acceptTerms")} link="/terms" />
                    <Button
                        type="submit"
                        form="login-form"
                        className="p-5 w-full"
                        disabled={form.formState.isSubmitting}
                        onClick={() => {console.log(form.getValues())}}
                    >
                        {form.formState.isSubmitting ? "Registerring..." : "Register"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">Already have an account? <Link href="/login" className="text-primary underline cursor-pointer">Log in</Link></p>
                </FieldGroup>
            </form>
        </FormProvider>
    )
}
