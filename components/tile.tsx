"use client"

import { Entry, Habit } from "@/generated/prisma/client"
import { useHandleCheck } from "@/lib/hooks/use-handle-check"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Check, X } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface TileProps {
    entryId: Entry['id'] | null,
    day: string,
    isOutOfRange: boolean
    date: Date
    habitId: Habit['id']
    onResult: Dispatch<SetStateAction<Entry[]>>
    currentEntriesSnapshot: Entry[]
}

export default function Tile({ entryId, day, isOutOfRange, date, habitId, onResult, currentEntriesSnapshot }: TileProps) {
    const { isPending, isChecked,  handleCheck } = useHandleCheck(currentEntriesSnapshot, onResult, habitId, entryId);

    return (
        <div
            aria-disabled={isOutOfRange}
            className={cn("border flex flex-col min-w-12 flex-1 gap-4 items-center rounded-lg p-2 pb-4 text-xs aria-disabled:opacity-60 aria-disabled:text-muted-foreground",
                isChecked && "bg-primary border-primary text-white",
                day === format(new Date(), 'EEEEEE') && "outline-2 outline-primary outline-offset-2",
                !isOutOfRange && !isPending ? "cursor-pointer" : ""
            )}
            onClick={() => {
                if(!isOutOfRange && !isPending)
                    handleCheck(date)
            }}
        >
            {day}
            {isChecked ? <Check className="size-4" /> : <X className="size-4 text-muted-foreground" />}
        </div>
    )
}
