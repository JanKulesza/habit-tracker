import { Entry, Habit } from "@/generated/prisma/client";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type HabitState = {
    habits: Habit[];
    entries: Entry[];
}

type HabitActions = {
    setHabits: (habits: Habit[]) => void;
    updateHabit: (habit: Habit) => void;
    removeHabit: (id: Habit['id']) => void
    setEntries: (entries: Entry[] | ((prev: Entry[]) => Entry[])) => void
}

type HabitStore = HabitState & { actions: HabitActions }

const useHabitStore = create<HabitStore>((set) => ({
    habits: [] as Habit[],
    entries: [] as Entry[],
    actions: {
        setHabits: value => set({ habits: value }),
        updateHabit: value => set(state => ({ habits: [...state.habits.filter(h => h.id !== value.id), value] })),
        removeHabit: id => set(state => ({ habits: [...state.habits.filter(h => h.id !== id)] })),
        setEntries: value => set(state => ({ entries: typeof value === 'function' ? value(state.entries) : value })),
    }
}))

export const useHabits = () => useHabitStore(
    useShallow((state) => state.habits)
)
export const useHabit = (habitId: Habit['id']) => useHabitStore(
    useShallow((state) => state.habits.find(h => h.id === habitId))
)

export const useEntries = (habitId?: Habit['id']) => useHabitStore(
    useShallow((state) => habitId ? state.entries.filter(e => e.habitId === habitId) : state.entries)
)

export const useHabitActions = () => useHabitStore((state) => state.actions)