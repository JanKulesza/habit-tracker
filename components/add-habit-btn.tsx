"use client"
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Dialog } from './ui/dialog'
import { FormProvider, useForm } from 'react-hook-form'
import { HabitsSchema, habitsSchema, Icon } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './inputs/form-input'
import { createHabit } from '@/lib/dal/habits'
import { useState } from 'react'
import { Spinner } from './ui/spinner'
import FormSelect from './inputs/form-select'
import { Habit } from '@/generated/prisma/client'
import { toast } from 'sonner'

interface AddHabitProps {
    currentHabitsSnapshot: Habit[]
    onResult: (result: Habit[]) => void
}

export default function AddHabitBtn({ currentHabitsSnapshot, onResult }: AddHabitProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<HabitsSchema>({
        resolver: zodResolver(habitsSchema),
        defaultValues: {
            icon: Icon.Check,
            name: "",
            goal: ""
        }
    });

    const iconOptions = Object.values(Icon).map(val => ({ label: val, value: val }));

    const onSubmit = async (values: HabitsSchema) => {
        const { name, goal, icon } = values
        const formData = new FormData();
        formData.append('name', name);
        formData.append('goal', goal);
        formData.append('icon', icon);

        const snapshot = [...currentHabitsSnapshot];
        onResult([...currentHabitsSnapshot, { name, goal, icon, frequency: "daily", id: -1, userId: "mock" }])
        setOpen(false)
        try {
            const res = await createHabit(formData);

            if (!res.success) {
                toast.error(res.error);
                onResult(snapshot);
                setOpen(true);
                return;
            }
            toast.success("Habit created successfully!")
            onResult([...snapshot, res.data])
            form.reset();
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
            onResult(snapshot);
            setOpen(true);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <FormProvider {...form}>
                <form id="add-habit-form" onSubmit={form.handleSubmit(onSubmit)} className='sm:w-auto w-full'>
                    <DialogTrigger asChild>
                        <Button className='p-5 px-8 w-full'><Plus /> Add habit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>New habit</DialogTitle>
                            <DialogDescription>
                                Create new habit and jumpstart your self-improvement.
                            </DialogDescription>
                        </DialogHeader>
                        <FormSelect name="icon" label='Icon' array={iconOptions} />
                        < FormInput label='Name' name='name' placeholder='eg. Morning meditation' />
                        <FormInput label='Goal' name='goal' placeholder='eg. 10 minutes' />
                        <DialogFooter className='flex bg-background border-t-0'>
                            <DialogClose asChild>
                                <Button size="lg" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button disabled={form.formState.isSubmitting} size="lg" className='min-w-48' type="submit" form='add-habit-form'>{form.formState.isSubmitting ? <Spinner /> : "Create habit"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </FormProvider>
        </Dialog>
    )
}
