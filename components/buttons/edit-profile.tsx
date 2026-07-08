"use client"

import { Edit } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { User } from '@/generated/prisma/client'
import FormInput from '../inputs/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSchema, userSchema } from '@/lib/validations'
import { updateUser } from '@/lib/dal/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EditProfileBtnProps {
    user: User,
    onResult: (user: User) => void;
}

export default function EditProfileBtn({ user, onResult }: EditProfileBtnProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            ...user
        }
    });

    const onSubmit = async (values: UserSchema) => {
        const name = values.name.trim()
        const formData = new FormData();
        formData.append('name', name);

        const snapshot = { ...user };
        onResult({
            ...user,
            name,
            updatedAt: new Date()
        });
        setOpen(false)

        try {
            const res = await updateUser(formData);

            if (!res.success) {
                onResult(snapshot);
                setOpen(true);
                return toast.error(res.error)
            }
                
            onResult(res.data);
            form.reset();
            toast.success("Profile updated successfully.");
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <FormProvider {...form}>
                <form id="add-habit-form" onSubmit={form.handleSubmit(onSubmit)} className='sm:w-auto w-full'>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className='w-full'>
                            <Edit /> Edit profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Edit your profile details below
                            </DialogDescription>
                        </DialogHeader>
                        <FormInput label='Name' name='name' placeholder={user.name} />
                        <DialogFooter className='flex bg-background border-t-0'>
                            <DialogClose asChild>
                                <Button size="lg" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button disabled={form.formState.isSubmitting} size="lg" className='min-w-48' type="submit" form='add-habit-form'>{form.formState.isSubmitting ? <Spinner /> : "Edit profile"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </FormProvider>
        </Dialog>
    )
}
