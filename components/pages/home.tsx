"use client"
import Link from 'next/link';
import HabitBar from '../habit-bar';
import InfoBox from '../info-box';
import { ProgressU } from '../ui/progress-updated';
import UpsertHabitBtn from '../upsert-habit-btn';
import { formatEntriesByDate } from '@/lib/utils';
import { endOfWeek, format, startOfWeek, subDays, subWeeks } from 'date-fns';
import { pl } from 'date-fns/locale';
import { sort } from 'fast-sort';
import { Target, Flame, Medal, TrendingUp, Plus } from 'lucide-react';
import { Entry, Habit } from '@/generated/prisma/client';
import { useState } from 'react';
import WeekTiles from '../week-tiles';
import HeatMap from '../heat-map';
import { Button } from '../ui/button';

interface HomePageCientProps {
    userName: string
    entries: Entry[]
    habits: Habit[]
}

export default function HomePageClient({ userName, entries: se, habits: sh }: HomePageCientProps) {
    const [entries, setEntries] = useState(se);
    const [habits, setHabits] = useState(sh);
    const entriesThisWeek = formatEntriesByDate(entries, startOfWeek(new Date, { locale: pl })),
        entriesToday = entriesThisWeek[format(new Date, "yyyy-MM-dd")];
    
    const progress = habits.length > 0 ? Number(((entriesToday.length ?? 0) * 100 / habits.length).toFixed()) : 0,
        bestStreak = sort(entries).desc(e => e.streak)?.[0]?.streak ?? 0,
        trendWeek = (() => {
            let sum = 0, sumOfHabits = 0;
            for (const key in entriesThisWeek) {
                sum += entriesThisWeek[key].length ?? 0;
                sumOfHabits += habits.length
            }
            return sumOfHabits > 0 ? (sum * 100 / sumOfHabits).toFixed() : 0.00
        })()
    const infoBoxes = [
        {
            title: "Today",
            icon: Target,
            iconColor: "text-[#6ec58e]",
            text: `${progress}%`,
            description: `${entriesToday.length} out of ${habits.length} habits`
        },
        {
            title: "Active streaks",
            icon: Flame,
            iconColor: "text-[#fa914a]",
            text: `${entriesToday.filter(val => val.streak > 0).length ?? 0}`,
            description: "running streaks",
        },
        {
            title: "Best streak",
            icon: Medal,
            iconColor: "text-[#a176f1]",
            text: `${bestStreak} ${bestStreak === 1 ? "day" : "days"}`,
            description: `All-time record`
        },
        {
            title: "This week",
            icon: TrendingUp,
            iconColor: "text-[#4cbaed]",
            text: `${trendWeek}%`,
            description: "Average completion"
        },

    ]
    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium">Hi, {userName} 👋</h1>
                    <p className="text-sm text-muted-foreground">{format(new Date(), "eeee, d MMMM", { locale: pl })} · You have {habits.length - entriesToday.length} habits left today</p>
                </div>
                <UpsertHabitBtn currentHabitsSnapshot={habits} onResult={setHabits}>
                    <Button className='p-5 px-8 w-full'> <Plus /> Add habit</Button>
                </UpsertHabitBtn>
            </div>
            <div className="w-full space-y-4 border rounded-lg p-6">
                <div className="flex justify-between items-center">
                    <h2 className="font-medium">Progress for today</h2>
                    <p className="text-muted-foreground text-sm">{entriesToday.length}/{habits.length} completed</p>
                </div>
                <ProgressU value={progress} max={100} />
                <p className="text-sm text-muted-foreground">
                    {progress !== 100 
                    ? `${progress}% of the day is behind you - keep it up!`
                    : "🎉 Congratulations! All today's habits are completed."
                    }
                    
                </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4 w-full">
                {infoBoxes.map((val, i) =>
                    <InfoBox
                        key={i}
                        Icon={val.icon}
                        description={val.description}
                        text={val.text}
                        title={val.title}
                        iconColor={val.iconColor}
                    />
                )}
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-3/5 space-y-4 border rounded-lg p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium">Habits today</h2>
                        <Link href="/habits" className="text-primary text-sm">See all</Link>
                    </div>
                    {habits.map((hab, i) => {
                        const entryId = entriesToday.find(en => en.habitId === hab.id)?.id ?? null,
                            streakYesterday = entriesThisWeek[format(subDays(new Date(), 1), 'yyyy-MM-dd')].find(en => en.habitId === hab.id)?.streak ?? 0
                        return <HabitBar
                            key={i}
                            habit={hab}
                            entryId={entryId}
                            streakYesterday={streakYesterday}
                            onResult={setEntries}
                            currentEntriesSnapshot={entries}
                        />
                    })}
                </div>
                <div className='space-y-8 lg:w-2/5'>
                    <WeekTiles currentEntriesSnapshot={entries} habitsNum={habits.length} habitId={null} />
                    <div className="w-full space-y-4 border rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-medium">Activity</h2>
                            <p className="text-muted-foreground text-sm">Last 20 weeks</p>
                        </div>
                        <HeatMap startDate={subWeeks(new Date(),20)} endDate={endOfWeek(new Date(), {locale: pl})} entries={entries} habitsNum={habits.length}  />
                    </div>
                </div>
            </div>
        </>
    );
}
