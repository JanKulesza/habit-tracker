"use client"
import { Button } from './ui/button'
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Dialog } from './ui/dialog'
import { FormProvider, useForm } from 'react-hook-form'
import { HabitsSchema, habitsSchema, Icon } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from './inputs/form-input'
import { createHabit, updateHabit } from '@/lib/dal/habits'
import { Dispatch, SetStateAction, useState } from 'react'
import { Spinner } from './ui/spinner'
import FormSelect from './inputs/form-select'
import { Habit } from '@/generated/prisma/client'
import { toast } from 'sonner'

type UpsertHabitProps =
    | {
        habit?: null
        currentHabitsSnapshot: Habit[]
        onResult: Dispatch<SetStateAction<Habit[]>>
        children: React.ReactNode
    }
    | {
        habit: Habit
        currentHabitsSnapshot?: null
        onResult: Dispatch<SetStateAction<Habit>>
        children: React.ReactNode
    }

export default function UpsertHabitBtn({ currentHabitsSnapshot, onResult, habit, children }: UpsertHabitProps) {
    const [open, setOpen] = useState(false);
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

        try {
            if (!habit) {
                // Create mode (habit is undefined)
                const snapshot = [...currentHabitsSnapshot];
                
                onResult([...currentHabitsSnapshot, mockHabit]);
                setOpen(false);

                const res = await createHabit(formData);

                if (!res.success) {
                    toast.error(res.error);
                    onResult(snapshot);
                    setOpen(true);
                    return;
                }

                toast.success("Habit created successfully!");
                onResult([...snapshot, res.data]);
                form.reset();

            } else {
                // Edit mode (habit is defined)
                const snapshot = { ...habit };
                
                onResult(mockHabit);
                setOpen(false);

                const res = await updateHabit(habit.id, formData);

                if (!res.success) {
                    toast.error(res.error);
                    onResult(snapshot);
                    setOpen(true);
                    return;
                }

                toast.success("Habit updated successfully!");
                onResult(res.data); 
                form.reset();
            }
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
            if (!habit) {
                onResult([...currentHabitsSnapshot]);
            } else {
                onResult(habit);
            }
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
