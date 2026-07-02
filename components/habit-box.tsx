"use client"

import { Entry, Habit } from "@/generated/prisma/client"
import Link from "next/link"
import { Checkbox } from "./ui/checkbox"
import { switchEntry } from "@/lib/dal/entries"
import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "sonner"
import { addDays, endOfWeek, format, isBefore, startOfDay, startOfWeek, subDays } from "date-fns"
import { Icon, ICON_COLORS } from "@/lib/validations"
import { pl } from "date-fns/locale"
import { Flame } from "lucide-react"
import { Separator } from "./ui/separator"

interface HabitBoxProps {
    habit: Habit
    entryId: Entry['id'] | null
    streakYesterday: number
    currentEntriesSnapshot: Entry[]
    onResult: Dispatch<SetStateAction<Entry[]>>
}

export default function HabitBox({ habit, entryId, streakYesterday, currentEntriesSnapshot, onResult }: HabitBoxProps) {
    const [isPending, setIsPending] = useState(false)
    const isChecked = !!entryId,
        streak = isChecked ? streakYesterday + 1 : streakYesterday,
        date = new Date();
    const rgbColor = ICON_COLORS[habit.icon as Icon] ?? ICON_COLORS["default"];

    let entriesArr: {
        day: string,
        checked: boolean,
    }[] = [];

    for (let i = startOfWeek(date, { locale: pl }); isBefore(i, endOfWeek(date, { locale: pl })); i = addDays(i, 1))
        entriesArr.push({ day: format(i, "EEEEEE"), checked: currentEntriesSnapshot.some(e => e.habitId === habit.id && e.date === format(i, 'yyyy-MM-dd')) })

    const last30DaysPercent = (() => {
        let daysDone = 0;

        for (let i = 0; i < 30; i++) {
            if (currentEntriesSnapshot.some(
                e => e.habitId === habit.id && e.date === format(subDays(startOfDay(date), i), 'yyyy-MM-dd')
            ))
                daysDone++;
        }

        return (daysDone * 100) / 30;
    })().toFixed(0);

    const handleCheck = async () => {
        const snapshot = [...currentEntriesSnapshot];
        if (isPending || habit.id === -1)
            return

        const mockId = date.getUTCMilliseconds()
        if (isChecked)
            onResult(currentEntriesSnapshot.filter(e => e.id !== entryId));
        else
            onResult([...currentEntriesSnapshot, {
                id: mockId,
                date: format(date, 'yyyy-MM-dd'),
                habitId: habit.id,
                streak: streakYesterday + 1
            }])
        setIsPending(true);

        try {
            const res = await switchEntry(habit.id, date);

            if (!res?.success) {
                toast.error(res.error);
                onResult(snapshot)
            } else if (res.data) {
                onResult(prevEntries => {
                    const filtered = prevEntries.filter(e => e.id !== mockId);
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
        <Link href={`/habits/${habit.id}`} className="rounded-lg border hover:border-primary p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center leading-5">
                    <div className="size-11 bg-primary/15 rounded-lg p-2 flex items-center justify-center text-xl"
                        style={{ backgroundColor: `rgba(${rgbColor}, 0.15)` }}>
                        {habit.icon}
                    </div>
                    <div>
                        <h2 className="font-medium">{habit.name}</h2>
                        <span className="text-xs text-muted-foreground">{habit.frequency}</span>
                    </div>
                </div>
                <Checkbox onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCheck();
                }} checked={isChecked} className="rounded-xl size-7 cursor-pointer" />
            </div>
            <div className="flex justify-between gap-2">
                {entriesArr.map((entry, i) =>
                    <div key={i} className="flex flex-col items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className={`rounded-xl size-2 bg-muted ${format(date, "EEEEEE") === entry.day ? "border-black/90 border" : ""}`} style={{ backgroundColor: entry.checked ? `rgb(${rgbColor})` : "" }} />
                        {entry.day}
                    </div>
                )}
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <div className={`flex text-xs font-medium items-center gap-1 rounded-xl py-1.5 px-3 ${isChecked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Flame className="size-3.5" /> {streak === 1 ? `${streak} days` : `${streak} days`}
                </div>
                <span className="text-muted-foreground text-sm">{last30DaysPercent}% in 30 days</span>
            </div>
        </Link>
    )
}
