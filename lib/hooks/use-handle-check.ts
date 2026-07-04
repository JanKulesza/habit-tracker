import { Entry, Habit } from "@/generated/prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { switchEntry } from "../dal/entries";
import { format } from "date-fns";
import { toast } from "sonner";

export const useHandleCheck = (
    currentEntriesSnapshot: Entry[],
    onResult: Dispatch<SetStateAction<Entry[]>>,
    habitId: Habit['id'],
    entryId: Entry['id'] | null,
    streakYesterday: number
) => {
    const [isPending, setIsPending] = useState(false)

    const handleCheck = async (date: Date = new Date()) => {
        const snapshot = [...currentEntriesSnapshot],
            mockId = -Date.now();
        
        if (entryId)
            onResult(currentEntriesSnapshot.filter(e => e.id !== entryId));
        else
            onResult([...currentEntriesSnapshot, {
                id: mockId,
                date: format(date, 'yyyy-MM-dd'),
                habitId: habitId,
                streak: streakYesterday + 1
            }])
        setIsPending(true);

        try {
            const res = await switchEntry(habitId, date);

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
    return { isPending, isChecked: !!entryId, handleCheck };
}