import { Entry, Habit } from "@/generated/prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { switchEntry } from "../dal/entries";
import { format,  isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";

export const useHandleCheck = (
    currentEntriesSnapshot: Entry[],
    onResult: Dispatch<SetStateAction<Entry[]>>,
    habit: Habit,
    entryId: Entry['id'] | null,
) => {
    const [isPending, setIsPending] = useState(false)

    const handleCheck = async (date: Date = new Date()) => {
        console.log(date, habit.createdAt);
        
        if(isPending || isBefore(date, startOfDay(habit.createdAt)))
            return;
        const snapshot = [...currentEntriesSnapshot],
            mockId = -Date.now();
        
        if (entryId)
            onResult(currentEntriesSnapshot.filter(e => e.id !== entryId));
        else
            onResult([...currentEntriesSnapshot, {
                id: mockId,
                date: format(date, 'yyyy-MM-dd'),
                habitId: habit.id,
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
    return { isPending, isChecked: !!entryId, handleCheck };
}