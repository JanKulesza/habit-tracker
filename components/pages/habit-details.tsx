"use client"
import { Entry, Habit } from "@/generated/prisma/client"
import { Icon, ICON_COLORS } from "@/lib/validations";
import { useState } from "react";
import { Button } from "../ui/button";
import { format, startOfDay, startOfWeek, subDays, subYears } from "date-fns";
import { formatEntriesByDate } from "@/lib/utils";
import { pl } from "date-fns/locale";
import { Calendar, Check, Edit, Flame, Medal, Target } from "lucide-react";
import { useHandleCheck } from "@/lib/hooks/use-handle-check";
import WeekTiles from "../week-tiles";
import InfoBox from "../info-box";
import HeatMap from "../heat-map";
import UpsertHabitBtn from "../upsert-habit-btn";
import DeleteHabitBtn from "../delete-habit-btn";

interface HabitDetailsClientPageProps {
    habit: Habit
    habitEntries: Entry[]
}

export default function HabitDetailsClientPage({ habit: h, habitEntries }: HabitDetailsClientPageProps) {
    const [habit, setHabit] = useState(h);
    const [entries, setEntries] = useState(habitEntries); // Entries for this habit only
    const date = new Date(),
        entriesThisWeek = formatEntriesByDate(entries, startOfWeek(date, { locale: pl })),
        entryId = entriesThisWeek[format(date, 'yyyy-MM-dd')]?.[0]?.id ?? null,
        streakYesterday = entriesThisWeek[format(subDays(date, 1), 'yyyy-MM-dd')]?.[0]?.streak ?? 0,
        rgbColor = ICON_COLORS[habit.icon as Icon] ?? ICON_COLORS["default"];

    const { isPending, isChecked, handleCheck } = useHandleCheck(entries, setEntries, habit.id, entryId, streakYesterday);

    const last30DaysPercent = (() => {
        let daysDone = 0;

        for (let i = 0; i < 30; i++) {
            if (entries.some(
                e => e.habitId === habit.id && e.date === format(subDays(startOfDay(date), i), 'yyyy-MM-dd')
            ))
                daysDone++;
        }

        return (daysDone * 100) / 30;
    })().toFixed(0),
        bestStreak = entries.reduce((acc, curr) => curr.streak > acc ? curr.streak : acc, 0);

    const infoBoxes = [
        {
            title: "Current streak",
            icon: Flame,
            iconColor: "text-[#fa914a]",
            text: `${entriesThisWeek[format(date, 'yyyy-MM-dd')]?.[0]?.streak ?? 0}`,
            description: "runs nonstop",
        },
        {
            title: "Best streak",
            icon: Medal,
            iconColor: "text-[#a176f1]",
            text: `${bestStreak} ${bestStreak === 1 ? "day" : "days"}`,
            description: `All-time record`
        },
        {
            title: "30 days",
            icon: Target,
            iconColor: "text-[#6ec58e]",
            text: `${last30DaysPercent}%`,
            description: "Completion rate"
        },
        {
            title: "All-together",
            icon: Check,
            iconColor: "text-[#4cbaed]",
            text: `${entries.length}%`,
            description: "Total completions"
        },

    ]
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center leading-5">
                    <div className="size-15 bg-primary/15 rounded-lg p-2 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `rgba(${rgbColor}, 0.15)` }}>
                        {habit.icon}
                    </div>
                    <div>
                        <h2 className="text-lg font-medium">{habit.name}</h2>
                        <div className="flex gap-2 items-center text-xs">
                            <div className="flex items-center gap-2 rounded-xl py-1 px-5 bg-muted">
                                <Target className="size-3.5" /> {habit.goal}
                            </div>
                            <div className="flex items-center gap-2 rounded-xl py-1 px-5 bg-muted">
                                <Calendar className="size-3.5" /> {habit.frequency}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <Button onClick={() => handleCheck()} variant={!isChecked ? "default" : "secondary"} disabled={isPending} size="lg" className="font-normal p-5">
                        <Check /> {isChecked ? "Completed for today" : "Check for today"}
                    </Button>
                    <UpsertHabitBtn habit={habit} onResult={setHabit}>
                        <Button variant="outline" className="font-normal p-5"><Edit /></Button>
                    </UpsertHabitBtn>
                    <DeleteHabitBtn habitId={habit.id} />
                </div>
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
            <WeekTiles
                currentEntriesSnapshot={entries}
                habitId={habit.id}
                onResult={setEntries}
                streakYesterday={streakYesterday}
            />
            <div className='space-y-8'>
                <div className="w-full space-y-4 border rounded-lg p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium">Activity</h2>
                        <p className="text-muted-foreground text-sm">Last year</p>
                    </div>
                    <HeatMap
                        startDate={subYears(date, 1)}
                        endDate={date}
                        entries={entries}
                        habitsNum={1}
                    />
                </div>
            </div>
        </>
    )
}
