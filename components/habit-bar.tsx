"use client"
import { Habit } from '@/generated/prisma/client'
import { Checkbox } from './ui/checkbox'
import { ChevronRight, Flame } from 'lucide-react'
import Link from 'next/link'
import { useHandleCheck } from '@/hooks/use-handle-check'
import { useStreakData } from '@/hooks/use-streak-data'
import { format } from 'date-fns'
import { useHabit } from '@/lib/store/habit-store'

interface HabitBarProps {
    entryId: number | null
    habitId: Habit['id'],
}

export default function HabitBar({ habitId, entryId }: HabitBarProps) {
    const streak = useStreakData().streakLogs.get(habitId)?.get(format(new Date(), "yyyy-MM-dd")) ?? 0;
    const habit = useHabit(habitId) as Habit;
    const { isChecked, handleCheck } = useHandleCheck(habit.id, entryId);

    return (
        <div className='flex py-4 items-center border-b gap-4'>
            <Checkbox
                checked={isChecked}
                onCheckedChange={() => handleCheck()}
                className="rounded-xl size-7 cursor-pointer"
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
                        <Flame className="size-3.5" /> {streak === 1 ? `${streak} day` : `${streak} days`}
                    </div>
                    <ChevronRight />
                </div>
            </Link>
        </div>
    )
}
