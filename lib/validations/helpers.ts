import { isAfter } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

export function isFutureDate(dateStr: string, timeZone: string): boolean {
    const inZoneToday = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd')
    return isAfter(dateStr, inZoneToday)
}

export function isValidTimeZone(timeZone: string) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw new Error('Time zones are not available in this environment');
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone });
        return true;
    }
    catch (ex) {
        return false;
    }
}

export enum Icon {
    Check = "✅",
    Cross = "❌",
    Star = "⭐",
    Fire = "🔥",
    Meditation = "🧘",
    Reading = "📚",
    Running = "🏃",
    Water = "💧",
    Strength = "💪",
    Sleep = "😴",
    Brain = "🧠",
    Target = "🎯",
    Guitar = "🎸",
    Plant = "🌱",
    Meal = "🍽️",
}

export const ICON_COLORS: Record<Icon | "default", string> = {
    [Icon.Check]: "34, 197, 94",
    [Icon.Plant]: "34, 197, 94",

    [Icon.Cross]: "239, 68, 68",
    [Icon.Fire]: "239, 68, 68",
    [Icon.Target]: "239, 68, 68",

    [Icon.Star]: "234, 179, 8",
    [Icon.Guitar]: "234, 179, 8",

    [Icon.Water]: "14, 165, 233",
    [Icon.Running]: "14, 165, 233",
    [Icon.Strength]: "14, 165, 233",

    [Icon.Meditation]: "168, 85, 247",
    [Icon.Reading]: "168, 85, 247",
    [Icon.Brain]: "168, 85, 247",

    [Icon.Sleep]: "107, 114, 128",
    [Icon.Meal]: "107, 114, 128",

    default: "107, 114, 128",
};