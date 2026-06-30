"use client"
import { Entry, Habit } from '@/generated/prisma/client'
import { Checkbox } from './ui/checkbox'
import { createEntry, deleteEntry, switchEntry } from '@/lib/dal/entries'
import { format } from 'date-fns'
import { ChevronRight, Flame } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface HabitBarProps {
    entryId: number | null
    streakYesterday: number,
    habit: Habit,
    onResult: (result: Entry[]) => void
    currentEntriesSnapshot: Entry[]
}

export default function HabitBar({ habit, entryId, streakYesterday, onResult, currentEntriesSnapshot }: HabitBarProps) {
    const [isPending, setIsPending] = useState(false)
    const isChecked = !!entryId

    const handleCheck = async () => {
        const snapshot = [...currentEntriesSnapshot];
        if (isPending || habit.id === -1)
            return

        if (isChecked)
            onResult(currentEntriesSnapshot.filter(e => e.id !== entryId));
        else
            onResult([...currentEntriesSnapshot, {
                id: -1,
                date: format(new Date(), 'yyyy-MM-dd'),
                habitId: habit.id,
                streak: streakYesterday + 1
            }])
        setIsPending(true);

        const res = await switchEntry(habit.id, new Date());

        if (!res?.success) {
            console.log(res.error);
            onResult(snapshot)
        } else if (res.data)
            onResult([...snapshot, res.data])
        setIsPending(false);
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
                    <div className={`${isChecked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} rounded-xl flex items-center px-2 p-1 text-xs gap-2`}>
                        <Flame className='size-4' /> {isChecked ? streakYesterday + 1 : streakYesterday}
                    </div>
                    <ChevronRight />
                </div>
            </Link>
        </div>
    )
}
