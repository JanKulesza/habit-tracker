"use client"

import { Entry, Habit } from "@/generated/prisma/client"
import { useHabitActions } from "@/lib/store/habit-store"
import { useEffect } from "react"

interface HabitStoreStateLoaderProps {
    habits: Habit[],
    entries: Entry[]
}

const HabitStoreStateLoader = ({ habits, entries }: HabitStoreStateLoaderProps) => {
    const { setHabits, setEntries } = useHabitActions();

    useEffect(() => {
        setHabits(habits);
        setEntries(entries);
    }, [entries, habits]);

    return null;
}

export default HabitStoreStateLoader