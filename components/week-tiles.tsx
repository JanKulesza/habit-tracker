"use client"
import { Entry, Habit } from "@/generated/prisma/client"
import { switchEntry } from "@/lib/dal/entries";
import { cn } from "@/lib/utils";
import { addDays, endOfWeek, format, isBefore, startOfWeek } from "date-fns";
import { pl } from "date-fns/locale";
import { Check, X } from "lucide-react";
import {  useState } from "react";

type WeekTilesProps =
    | {
        entriesThisWeek: Record<string, Entry[]>
        habitsNum: number
        habitId: null
    }
    | {
        entriesThisWeek: Record<string, Entry[]>
        habitsNum: number
        habitId: Habit['id']
        streakYesterday: number
        onResult: (result: Entry[]) => void
        currentEntriesSnapshot: Entry[]
    };

export default function WeekTiles(props: WeekTilesProps) {
    const { entriesThisWeek, habitsNum, habitId } = props
    let entriesArr: {
        date: Date,
        day: string,
        checked: boolean,
        ofr: boolean
    }[] = [];

    for (let i = startOfWeek(new Date(), { locale: pl }); isBefore(i, endOfWeek(new Date(), { locale: pl })); i = addDays(i, 1)) {
        if (entriesThisWeek[format(i, 'yyyy-MM-dd')])
            entriesArr.push({
                date: i,
                day: format(i, 'EEEEEE'),
                checked: !habitId
                    ? entriesThisWeek[format(i, 'yyyy-MM-dd')].length === habitsNum
                    : entriesThisWeek[format(i, 'yyyy-MM-dd')].some(val => val.habitId === habitId),
                ofr: false
            })
        else
            entriesArr.push({
                date: i,
                day: format(i, 'EEEEEE'),
                checked: false,
                ofr: true
            })
    }

    const [isPending, setIsPending] = useState(false)
    const handleCheck = async (date: Date, checked: boolean) => {
        // If HABITID isn't null then all undefined values are defined
        if (!habitId || isPending)
            return
        const { currentEntriesSnapshot, onResult, streakYesterday } = props
        const snapshot = [...currentEntriesSnapshot];
        const action: "Remove" | "Create" = 
        currentEntriesSnapshot.some(en => en.date === format(new Date(), 'yyyy-MM-dd') && en.habitId === habitId) ? "Remove" : "Create"

        if (action === "Remove")
            onResult([...currentEntriesSnapshot.filter(en => !(en.date === format(new Date(), 'yyyy-MM-dd') && en.habitId === habitId))])
        else
            onResult([...currentEntriesSnapshot, {
                id: -1,
                date: format(new Date(), 'yyyy-MM-dd'),
                habitId,
                streak: streakYesterday + 1
            }])

        setIsPending(true);
        const res = await switchEntry(habitId, date)
        if (!res?.success) {
            console.log(res.error);
            onResult(snapshot)
        } else if (res.data)
            onResult([...snapshot, res.data])

        setIsPending(false);
    }

    return (
        <div className='w-full space-y-4 border rounded-lg p-6'>
            <h2 className="font-medium">This week</h2>
            <div className="flex gap-2">
                {entriesArr.map((entry, i) =>
                    <div
                        key={i}
                        aria-disabled={entry.ofr}
                        className={cn("border flex flex-col flex-1 gap-4 items-center rounded-lg p-2 pb-4 text-xs aria-disabled:opacity-60 aria-disabled:text-muted-foreground",
                            entry.checked && "bg-primary border-primary text-white",
                            entry.day === format(new Date(), 'EEEEEE') && "outline-2 outline-primary outline-offset-2",
                            habitId && !entry.ofr && "cursor-pointer"
                        )}
                        onClick={() => {
                            if (!entry.ofr)
                                handleCheck(entry.date, entry.checked);
                        }}
                    >
                        {entry.day}
                        {entry.checked ? <Check className="size-4" /> : <X className="size-4 " />}
                    </div>
                )}
            </div>
        </div>
    )
}