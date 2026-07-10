import { Entry, Habit } from "@/generated/prisma/client";
import { Dispatch, SetStateAction, useTransition } from "react";
import { toggleEntry } from "@/lib/dal/entries";
import { format, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";

export const useHandleCheck = (
    currentEntriesSnapshot: Entry[],
    onResult: Dispatch<SetStateAction<Entry[]>>,
    habit: Habit,
    entryId: Entry['id'] | null,
) => {
    const [isPending, startTransition] = useTransition()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleCheck = (date: Date = new Date()) => {
        if (isPending || isBefore(date, startOfDay(habit.createdAt)))
            return;

        startTransition(async () => {
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
            try {
                const res = await toggleEntry(
                    habit.id,
                    {
                        dateStr: format(date, 'yyyy-MM-dd'),
                        timeZone
                    }
                );

                if (!res?.success) {
                    toast.error(res.error);
                    onResult(snapshot)
                }
                else if (res.data) {
                    onResult(prevEntries => {
                        const filtered = prevEntries.filter(e => e.id !== mockId);
                        return [...filtered, res.data!];
                    });
                    toast.success("Completed habit!")
                }
                else
                    toast.success("Unchecked habit.")
            } catch {
                toast.error("Network error. Please check your connection and try again.");
                onResult(snapshot);
            }
        })
    }
    return { isChecked: !!entryId, handleCheck };
}