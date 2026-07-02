"use client"
import { Entry, Habit } from '@/generated/prisma/client'
import { Checkbox } from './ui/checkbox'
import { createEntry, deleteEntry, switchEntry } from '@/lib/dal/entries'
import { format } from 'date-fns'
import { ChevronRight, Flame } from 'lucide-react'
import Link from 'next/link'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'

interface HabitBarProps {
    entryId: number | null
    streakYesterday: number,
    habit: Habit,
    onResult: Dispatch<SetStateAction<Entry[]>>
    currentEntriesSnapshot: Entry[]
}

export default function HabitBar({ habit, entryId, streakYesterday, onResult, currentEntriesSnapshot }: HabitBarProps) {
    const [isPending, setIsPending] = useState(false)
    const isChecked = !!entryId, streak = isChecked ? streakYesterday + 1 : streakYesterday;

    const handleCheck = async () => {
        const snapshot = [...currentEntriesSnapshot];
        if (isPending || habit.id === -1)
            return
        console.log(habit.name, currentEntriesSnapshot);

        if (isChecked)
            onResult(currentEntriesSnapshot.filter(e => e.id !== entryId && e.habitId !== habit.id));
        else
            onResult([...currentEntriesSnapshot, {
                id: -1,
                date: format(new Date(), 'yyyy-MM-dd'),
                habitId: habit.id,
                streak: streakYesterday + 1
            }])
        setIsPending(true);

        try {
            const res = await switchEntry(habit.id, new Date());

            if (!res?.success) {
                toast.error(res.error);
                onResult(snapshot)
            } else if (res.data) {
                onResult(prevEntries => {
                    const filtered = prevEntries.filter(e => e.habitId !== habit.id);
                    return [...filtered, res.data!];
                });
                toast.success("Completed habit!")
            } else
                toast.success("Unchecked habit.")
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
            onResult(snapshot);
        } finally {
            setIsPending(false);
        }
    }
    return (
        <div className='flex py-4 items-center border-b gap-4'>
            <Checkbox checked={isChecked} onCheckedChange={handleCheck} className="rounded-xl size-7 cursor-pointer" />
            <Link href={`/habits/${habit.id}`} className='flex flex-1 justify-between items-center'>
                <div className='flex gap-4 items-center h-full'>
                    <span className='text-xl'>{habit.icon}</span>
                    <div className='text-sm'>
                        <h3 className={`font-medium ${isChecked && "line-through"}`}>{habit.name}</h3>
                        <p className='text-muted-foreground'>{habit.goal} · {habit.frequency}</p>
                    </div>
                </div>
                <div className='flex gap-4 items-center h-full'>
                    <div className={`flex text-xs font-medium items-center gap-1 rounded-xl py-1.5 px-3 ${isChecked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Flame className="size-3.5" /> {streak === 1 ? `${streak} days` : `${streak} days`}
                    </div>
                    <ChevronRight />
                </div>
            </Link>
        </div>
    )
}
