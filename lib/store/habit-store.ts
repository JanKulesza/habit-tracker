import { Entry, Habit } from "@/generated/prisma/client";
import { create } from "zustand";

type HabitState = {
    habits: Habit[];
    entries: Entry[];
}

type HabitActions = {
    setHabits: (habits: Habit[]) => void;
    setEntries: (entries: Entry[] | ((prev: Entry[]) => Entry[])) => void
}

type HabitStore = HabitState & { actions: HabitActions }

const useHabitStore = create<HabitStore>((set) => ({
    habits: [] as Habit[],
    entries: [] as Entry[],
    actions: {
        setEntries: value => set(state => ({ entries: typeof value === 'function' ? value(state.entries) : value })),
        setHabits: value => set({ habits: value })
    }
}))

export const useHabits = (habitId?: Habit['id']) => useHabitStore(
    (state) => habitId ? state.habits.filter(h => h.id === habitId)[0] : state.habits
)

export const useEntries = (habitId?: Habit['id']) => useHabitStore(
    (state) => habitId ? state.entries.filter(e => e.habitId === habitId) : state.entries
)

export const useHabitActions = () => useHabitStore((state) => state.actions)