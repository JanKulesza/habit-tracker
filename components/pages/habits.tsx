"use client"
import { Entry, Habit } from '@/generated/prisma/client'
import { format, subDays } from 'date-fns';
import { useState } from 'react'
import AddHabitBtn from '../add-habit-btn';
import HabitBox from '../habit-box';

interface HabitsPageCientProps {
    entries: Entry[]
    habits: Habit[]
}

export default function HabitsPageClient({ entries: se, habits: sh }: HabitsPageCientProps) {
    const [entries, setEntries] = useState(se);
    const [habits, setHabits] = useState(sh);
    const entriesToday = entries.filter(e => e.date === format(new Date(), "yyyy-MM-dd"));
    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium">Habits</h1>
                    <p className="text-sm text-muted-foreground">{habits.length} habits · You have {entriesToday.length} habits completed today</p>
                </div>
                <AddHabitBtn currentHabitsSnapshot={habits} onResult={(result) => { setHabits(result) }} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                {habits.map((h, idx) => {
                    // unique
                    const streakYesterday = entries.filter(e => e.date === format(subDays(new Date(), 1), "yyyy-MM-dd") && e.habitId === h.id)?.[0]?.streak ?? 0
                    const entryId = entriesToday.filter(e => e.habitId === h.id)?.[0]?.id ?? null
                    return <HabitBox
                        key={idx}
                        habit={h}
                        entryId={entryId}
                        streakYesterday={streakYesterday}
                        currentEntriesSnapshot={entries}
                        onResult={setEntries}
                    />
                })}
            </div>
        </>
    )
}
