import InfoBox from "@/components/info-box";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { subDays, startOfDay, format } from "date-fns";
import { TrendingUp, Flame, Medal, Check } from "lucide-react";
import { toast } from "sonner";

export default async function StatsPage() {
    const resHab = await getHabitsForCurrentUser();
    const resEntr = await getEntriesForCurrentUser()
    if (!resHab.success || !resEntr.success)
        return toast.error("Error while loading resources.");

    const habits = resHab.data, entries = resEntr.data;
    const date = new Date();

    const { last30DaysPercent, lastWeekPercent } = (() => {
        let entries30 = 0, entries7 = 0;

        for (let i = 0; i < 30; i++) {
            entries30 += entries.filter(e => e.date === format(subDays(startOfDay(date), i), 'yyyy-MM-dd')).length;
            if (i == 6)
                entries7 = entries30;
        }

        return { last30DaysPercent: ((entries30 * 100) / (30 * habits.length)).toFixed(0), lastWeekPercent: ((entries7 * 100) / (7 * habits.length)).toFixed(0) };
    })(),
        bestStreak = entries.reduce((acc, curr) =>
            curr.streak > acc.streak ? { streak: curr.streak, name: curr.habitId } : acc,
            { streak: 0, name: -1 });

    const infoBoxes = [
        {
            title: "30 days",
            icon: TrendingUp,
            iconColor: "text-[#6ec58e]",
            text: `${last30DaysPercent}%`,
            description: "Completion rate"
        },
        {
            title: "This week",
            icon: Flame,
            iconColor: "text-[#fa914a]",
            text: `${lastWeekPercent}%`,
            description: "Completion rate",
        },
        {
            title: "Best streak",
            icon: Medal,
            iconColor: "text-[#a176f1]",
            text: `${bestStreak.streak} ${bestStreak.streak === 1 ? "day" : "days"}`,
            description: `${habits.find(h => h.id === bestStreak.name)?.name ?? "Unknown habit"}`
        },
        {
            title: "All-together",
            icon: Check,
            iconColor: "text-[#4cbaed]",
            text: `${entries.length}`,
            description: "Total completions"
        },

    ]

    return (
        <>
            <div>
                <h1 className="text-2xl font-medium">Statistics</h1>
                <p className="text-sm text-muted-foreground">Your progress in time and results analysis</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4 w-full">
                {infoBoxes.map((val, i) =>
                    <InfoBox
                        key={i}
                        Icon={val.icon}
                        description={val.description}
                        text={val.text}
                        title={val.title}
                        iconColor={val.iconColor}
                    />
                )}
            </div>
        </>
    )
}