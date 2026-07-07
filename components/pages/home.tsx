"use client"
import Link from 'next/link';
import HabitBar from '../habit-bar';
import InfoBox from '../info-box';
import { ProgressU } from '../ui/progress-updated';
import UpsertHabitBtn from '../upsert-habit-btn';
import { formatEntriesByDate, getBestStreak, getStreakLog } from '@/lib/utils';
import { endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { pl } from 'date-fns/locale';
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
    const date = new Date(), formattedDate = format(date, "yyyy-MM-dd");
    const entriesThisWeek = formatEntriesByDate(entries, startOfWeek(date, { locale: pl })),
        entriesToday = entriesThisWeek[formattedDate];

    const progress = habits.length > 0 ? Number(((entriesToday.length ?? 0) * 100 / habits.length).toFixed()) : 0,
        trendWeek = (() => {
            let sum = 0, sumOfHabits = 0;
            for (const key in entriesThisWeek) {
                sum += entriesThisWeek[key].length ?? 0;
                sumOfHabits += habits.length
            }
            return sumOfHabits > 0 ? (sum * 100 / sumOfHabits).toFixed() : 0.00
        })();

    const habitStreakLogs = new Map<Habit['id'], Map<string, number>>();
    let runningStreaks = 0;
    for (const h of habits) {
        const streakLog = getStreakLog(h, entries);
        if (streakLog.get(formattedDate) ?? 0 > 0)
            runningStreaks++;
        habitStreakLogs.set(h.id, streakLog);
    }
    const bestStreak = getBestStreak(habitStreakLogs);

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
            text: `${runningStreaks} ${runningStreaks === 1 ? "day" : "days"}`,
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
                    <p className="text-sm text-muted-foreground">{format(date, "eeee, d MMMM")} · You have {habits.length - entriesToday.length} habits left today</p>
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
                    {habits.map((h, i) => {
                        const entryId = entriesToday.find(en => en.habitId === h.id)?.id ?? null
                        return <HabitBar
                            key={h.id}
                            habit={h}
                            entryId={entryId}
                            streak={habitStreakLogs.get(h.id)!.get(formattedDate)!}
                            onResult={setEntries}
                            currentEntriesSnapshot={entries}
                        />
                    })}
                </div>
                <div className='space-y-8 lg:w-2/5'>
                    <div className='w-full space-y-4 border rounded-lg p-6'>
                        <h2 className="font-medium">This week</h2>
                        <WeekTiles currentEntriesSnapshot={entries} habitsNum={habits.length} />
                    </div>
                    <div className="w-full space-y-4 border rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="font-medium">Activity</h2>
                            <p className="text-muted-foreground text-sm">Last 20 weeks</p>
                        </div>
                        <HeatMap startDate={subWeeks(date, 20)} endDate={endOfWeek(date, { locale: pl })} entries={entries} habitsCreationDates={habits.map(val => val.createdAt)} />
                    </div>
                </div>
            </div>
        </>
    );
}
