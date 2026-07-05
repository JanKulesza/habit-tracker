import CustomAreaChart from "@/components/charts/area-chart";
import CustomRadarChart from "@/components/charts/radar-chart";
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
    const areaChartData = (() => {
        let data: { date: string, completion: number }[] = [];

        for (let i = 12; i >= 1; i--)
            data.push({
                date: format(subDays(startOfDay(date), 7 * i), "dd LLL"),
                completion: completionRatePerRange(subDays(date, 7 * i), 7, entries, habits.length)
            })

        return data;
    })()

    const areaChartConfig = {
        completion: {
            label: "Completion %",
            color: "var(--primary)",
        },
    } satisfies ChartConfig

    const radarChartData = (() => {
        let data: { icon: string, completion: number }[] = [];

        for(const val of habits)
                data.push({
                icon: val.icon,
                completion: completionRatePerRange(subDays(date, 7), 7, entries.filter(e => e.habitId === val.id), 1)
            })

        return data;
    })()

    const radarChartConfig = { 
        completion: {
            label: "Completion %",
            color: "var(--primary)"
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
                <div className="lg:w-2/3 space-y-8 border rounded-lg p-6">
                    <div className="">
                        <h2 className="font-medium">Week trend</h2>
                        <p className="text-muted-foreground text-sm">Completion percent in recent weeks</p>
                    </div>
                    <CustomAreaChart chartConfig={areaChartConfig} chartData={areaChartData} dataKeyChart="completion" dataKeyXAxis="date" className="w-full max-h-75! max-sm:h-64!" />
                </div>
                <div className="lg:w-1/3 space-y-8 border rounded-lg p-6">
                    <div className="">
                        <h2 className="font-medium">Completion Rate per Habit</h2>
                        <p className="text-muted-foreground text-sm">Completion percent per each habit this month</p>
                    </div>
                    <CustomRadarChart chartConfig={radarChartConfig} chartData={radarChartData} dataKeyChart="completion" labels="icon" className="mx-auto aspect-square max-h-62.5!" />
                </div>
            </div>
        </>
    )
}