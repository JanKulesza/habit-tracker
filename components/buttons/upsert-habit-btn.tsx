"use client"
import { Button } from '../ui/button'
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Dialog } from '../ui/dialog'
import { FormProvider, useForm } from 'react-hook-form'
import { HabitsSchema, habitsSchema, Icon } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from '../inputs/form-input'
import { createHabit, updateHabit } from '@/lib/dal/habits'
import { useState } from 'react'
import { Spinner } from '../ui/spinner'
import FormSelect from '../inputs/form-select'
import { Habit } from '@/generated/prisma/client'
import { toast } from 'sonner'
import { useHabit, useHabitActions, useHabits } from '@/lib/store/habit-store'

type UpsertHabitProps =
    | {
        habitId?: undefined
        children: React.ReactNode
    }
    | {
        habitId: Habit['id']
        children: React.ReactNode
    }

export default function UpsertHabitBtn({ habitId, children }: UpsertHabitProps) {
    const [open, setOpen] = useState(false);

    const habit = habitId ? useHabit(habitId) : null
    const currentHabitsSnapshot = useHabits() as Habit[];
    const { updateHabit: updateHabitAction, setHabits } = useHabitActions();

    const form = useForm<HabitsSchema>({
        resolver: zodResolver(habitsSchema),
        defaultValues: habit ? {
            icon: habit.icon as Icon,
            name: habit.name,
            goal: habit.goal
        } : {
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

        const mockHabit: Habit = {
            ...values,
            frequency: "daily",
            id: habit ? habit.id : -Date.now(),
            userId: habit ? habit.userId : "mock",
            createdAt: new Date()
        };

        const snapshot = [...currentHabitsSnapshot];
        try {
            if (!habit) {
                // Create mode (habit is undefined)

                setHabits([...snapshot, mockHabit]);
                setOpen(false);

                const res = await createHabit(formData);

                if (!res.success) {
                    toast.error(res.error);
                    setHabits(snapshot);
                    setOpen(true);
                    return;
                }

                toast.success("Habit created successfully!");
                setHabits([...snapshot, res.data]);
                form.reset();

            } else {
                // Edit mode (habit is defined)

                updateHabitAction(mockHabit);
                setOpen(false);

                const res = await updateHabit(habit.id, formData);

                if (!res.success) {
                    toast.error(res.error);
                    setHabits(snapshot);
                    setOpen(true);
                    return;
                }

                toast.success("Habit updated successfully!");
                updateHabitAction(res.data);
                form.reset();
            }
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
            setHabits(snapshot)
            setOpen(true);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <FormProvider {...form}>
                <form id="add-habit-form" onSubmit={form.handleSubmit(onSubmit)} className='sm:w-auto w-full'>
                    <DialogTrigger asChild>
                        {children}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>{habit ? "Edit Habit" : "Add Habit"}</DialogTitle>
                            <DialogDescription>
                                {habit ? "Edit your habit details below." : "Fill in the details for your new habit."}
                            </DialogDescription>
                        </DialogHeader>
                        <FormSelect name="icon" label='Icon' array={iconOptions} />
                        < FormInput label='Name' name='name' placeholder='eg. Morning meditation' />
                        <FormInput label='Goal' name='goal' placeholder='eg. 10 minutes' />
                        <DialogFooter className='flex bg-background border-t-0'>
                            <DialogClose asChild>
                                <Button size="lg" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button disabled={form.formState.isSubmitting} size="lg" className='min-w-48' type="submit" form='add-habit-form'>{form.formState.isSubmitting ? <Spinner /> : `${habit ? "Update habit" : "Create habit"}`}</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </FormProvider>
        </Dialog>
    )
}
