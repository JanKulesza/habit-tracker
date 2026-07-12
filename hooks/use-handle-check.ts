import { Entry, Habit } from "@/generated/prisma/client";
import { useTransition } from "react";
import { toggleEntry } from "@/lib/dal/entries";
import { format, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import { useEntries, useHabit, useHabitActions } from "@/lib/store/habit-store";

export const useHandleCheck = (
    habitId: Habit['id'],
    entryId: Entry['id'] | null,
) => {
    const [isPending, startTransition] = useTransition()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { setEntries } = useHabitActions()
    const currentEntriesSnapshot = useEntries();
    const habit = useHabit(habitId)!;

    const handleCheck = (date: Date = new Date()) => {
        if (isPending || isBefore(date, startOfDay(habit.createdAt)))
            return;

        if (habitId < 0) {
            toast.warning("Wait until the habit is created before checking it.")
            return;
        }

        startTransition(async () => {
            const snapshot = [...currentEntriesSnapshot],
                mockId = -Date.now();

            if (entryId)
                setEntries(currentEntriesSnapshot.filter(e => e.id !== entryId));
            else
                setEntries([...currentEntriesSnapshot, {
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
                    setEntries(snapshot)
                }
                else if (res.data) {
                    setEntries(prevEntries => {
                        const filtered = prevEntries.filter(e => e.id !== mockId);
                        return [...filtered, res.data!];
                    });
                    toast.success("Completed habit!")
                }
                else
                    toast.success("Unchecked habit.")
            } catch {
                toast.error("Network error. Please check your connection and try again.");
                setEntries(snapshot);
            }
        })
    }
    return { isChecked: !!entryId, handleCheck };
}