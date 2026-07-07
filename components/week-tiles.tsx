"use client"
import { Entry, Habit } from "@/generated/prisma/client"
import { cn, formatEntriesByDate } from "@/lib/utils";
import { addDays, endOfWeek, format, isBefore, startOfWeek } from "date-fns";
import { pl } from "date-fns/locale";
import { Check, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Tile from "./tile";

type WeekTilesProps =
    | {
        habitsNum: number
        habit?: null
        currentEntriesSnapshot: Entry[]
    }
    | {
        habitsNum?: 1
        habit: Habit
        onResult: Dispatch<SetStateAction<Entry[]>>
        currentEntriesSnapshot: Entry[]
    };

export default function WeekTiles(props: WeekTilesProps) {
    const { habitsNum, habit } = props,
        entriesThisWeek = formatEntriesByDate(props.currentEntriesSnapshot, startOfWeek(new Date(), { locale: pl }));
    let entriesArr: {
        date: Date,
        entryId: Entry['id'] | null,
        day: string,
        checked: boolean,
        ofr: boolean
    }[] = [];

    for (let i = startOfWeek(new Date(), { locale: pl }); isBefore(i, endOfWeek(new Date(), { locale: pl })); i = addDays(i, 1)) {
        const entriesThisDay = entriesThisWeek[format(i, 'yyyy-MM-dd')]
        if (entriesThisDay && entriesThisDay.length > 0)
            entriesArr.push({
                date: i,
                entryId: habit ? entriesThisDay.find(val => val.habitId === habit.id)?.id ?? null : null,
                day: format(i, 'EEEEEE'),
                checked: !habit
                    ? entriesThisDay.length === habitsNum
                    : entriesThisDay.some(val => val.habitId === habit.id),
                ofr: false
            })
        else
            entriesArr.push({
                date: i,
                entryId: null,
                day: format(i, 'EEEEEE'),
                checked: false,
                ofr: !entriesThisDay
            })
    }

    return (

        <ScrollArea>
            <div className="flex gap-2 p-1">
                {entriesArr.map((entry, i) => {
                    if (!habit)
                        return (
                            <div
                                key={i}
                                aria-disabled={entry.ofr}
                                className={cn("border flex flex-col min-w-12 flex-1 gap-4 items-center rounded-lg p-2 pb-4 text-xs aria-disabled:opacity-60 aria-disabled:text-muted-foreground",
                                    entry.checked && "bg-primary border-primary text-white",
                                    entry.day === format(new Date(), 'EEEEEE') && "outline-2 outline-primary outline-offset-2",
                                )}
                            >
                                {entry.day}
                                {entry.checked ? <Check className="size-4" /> : <X className="size-4 text-muted-foreground" />}
                            </div>
                        )
                    return <Tile
                        key={i}
                        entryId={entry.entryId}
                        day={entry.day}
                        isOutOfRange={entry.ofr}
                        date={entry.date}
                        habit={habit}
                        onResult={props.onResult}
                        currentEntriesSnapshot={props.currentEntriesSnapshot}
                    />
                }
                )}
            </div>
            <ScrollBar orientation="horizontal" className="mt-4" />
        </ScrollArea>
    )
}