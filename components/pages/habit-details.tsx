"use client"
import { Entry, Habit } from "@/generated/prisma/client"
import { Icon, ICON_COLORS } from "@/lib/validations";
import { useState } from "react";
import { Button } from "../ui/button";
import { format, startOfWeek, subDays } from "date-fns";
import { formatEntriesByDate } from "@/lib/utils";
import { pl } from "date-fns/locale";
import { Calendar, Check, Edit, Target, Trash2 } from "lucide-react";
import { useHandleCheck } from "@/lib/hooks/use-handle-check";
import WeekTiles from "../week-tiles";

interface HabitDetailsClientPageProps {
    habit: Habit
    habitEntries: Entry[]
}

export default function HabitDetailsClientPage({ habit: h, habitEntries }: HabitDetailsClientPageProps) {
    const [habit, setHabit] = useState(h);
    const [entries, setEntries] = useState(habitEntries);
    const date = new Date(),
        entriesThisWeek = formatEntriesByDate(entries, startOfWeek(date, { locale: pl })),
        entryId = entriesThisWeek[format(date, 'yyyy-MM-dd')]?.[0]?.id ?? null,
        streakYesterday = entriesThisWeek[format(subDays(date, 1), 'yyyy-MM-dd')]?.[0]?.streak ?? 0,
        rgbColor = ICON_COLORS[habit.icon as Icon] ?? ICON_COLORS["default"];

    const { isPending, isChecked, handleCheck } = useHandleCheck(entries, setEntries, habit.id, entryId, streakYesterday);
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
                    <Button onClick={() => handleCheck()} variant={isChecked ? "default" : "secondary"} disabled={isPending} size="lg" className="font-normal p-5">
                        <Check /> {isChecked ? "Completed for today" : "Check for today"}
                    </Button>
                    <Button variant="outline" className="font-normal p-5"><Edit /></Button>
                    <Button variant="destructive" className="font-normal p-5"><Trash2 /></Button>
                </div>
            </div>
            <WeekTiles
                currentEntriesSnapshot={entries}
                habitId={habit.id}
                onResult={setEntries}
                streakYesterday={streakYesterday}
            />
        </>
    )
}
