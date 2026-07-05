import WeekTrendAreaChart from "@/components/charts/week-trend-area-chart";
import InfoBox from "@/components/info-box";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { completionRatePerRange } from "@/lib/utils";
import { subDays, startOfDay, format, subMonths } from "date-fns";
import { TrendingUp, Flame, Medal, Check } from "lucide-react";
import { CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import { toast } from "sonner";

export default async function StatsPage() {
    const resHab = await getHabitsForCurrentUser();
    const resEntr = await getEntriesForCurrentUser()
    if (!resHab.success || !resEntr.success)
        return toast.error("Error while loading resources.");

    const habits = resHab.data, entries = resEntr.data;
    const date = new Date();

    const lastMonthCompletionRate = completionRatePerRange(subDays(date, 30), 30, entries, habits.length),
        lastWeekCompletionRate = completionRatePerRange(subDays(date, 7), 7, entries, habits.length),
        bestStreak = entries.reduce((acc, curr) =>
            curr.streak > acc.streak ? { streak: curr.streak, name: curr.habitId } : acc,
            { streak: 0, name: -1 });

    const infoBoxes = [
        {
            title: "30 days",
            icon: TrendingUp,
            iconColor: "text-[#6ec58e]",
            text: `${lastMonthCompletionRate}%`,
            description: "Completion rate"
        },
        {
            title: "This week",
            icon: Flame,
            iconColor: "text-[#fa914a]",
            text: `${lastWeekCompletionRate}%`,
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
    const chartData = (() => {
        let data: { date: string, completion: number }[] = [];

        for (let i = 12; i >= 1; i--)
            data.push({
                date: format(subDays(startOfDay(date), 7 * i), "dd LLL"),
                completion: completionRatePerRange(subDays(date, 7 * i), 7, entries, habits.length)
            })

        return data;
    })()

    const chartConfig = {
        mobile: {
            label: "Desktop",
            color: "#2563eb",
        },
    } satisfies ChartConfig

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
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="w-2/3 space-y-8 border rounded-lg p-6">
                    <div className="">
                        <h2 className="font-medium">Week trend</h2>
                        <p className="text-muted-foreground text-sm">Completion percent in rect weeks</p>
                    </div>
                    <WeekTrendAreaChart chartConfig={chartConfig} chartData={chartData} dataKeyChart="completion" dataKeyXAxis="date" />
                </div>
            </div>

        </>
    )
}