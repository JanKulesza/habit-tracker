"use client"
import { Entry, Habit } from '@/generated/prisma/client'
import { Checkbox } from './ui/checkbox'
import { ChevronRight, Flame } from 'lucide-react'
import Link from 'next/link'
import { Dispatch, SetStateAction, useState } from 'react'
import { useHandleCheck } from '@/lib/hooks/use-handle-check'

interface HabitBarProps {
    entryId: number | null
    streakYesterday: number,
    habit: Habit,
    onResult: Dispatch<SetStateAction<Entry[]>>
    currentEntriesSnapshot: Entry[]
}

export default function HabitBar({ habit, entryId, streakYesterday, onResult, currentEntriesSnapshot }: HabitBarProps) {
    const { isPending, isChecked, handleCheck } = useHandleCheck(currentEntriesSnapshot, onResult, habit.id, entryId, streakYesterday);
    const streak = isChecked ? streakYesterday + 1 : streakYesterday;

    return (
        <div className='flex py-4 items-center border-b gap-4'>
            <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheck}
                className="rounded-xl size-7 cursor-pointer"
                disabled={isPending}
            />
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
