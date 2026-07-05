import CustomAreaChart from "@/components/charts/area-chart";
import CustomBarChart from "@/components/charts/bar-char";
import CustomRadarChart from "@/components/charts/radar-chart";
import InfoBox from "@/components/info-box";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { completionRatePerRange } from "@/lib/utils";
import { subDays, startOfDay, format, isAfter } from "date-fns";
import { sort } from "fast-sort";
import { TrendingUp, Flame, Medal, Check, TrendingDown } from "lucide-react";
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

        for (let i = 12; i >= 1; i--) // Keep in sync with the chart's footer description
            data.push({
                date: format(subDays(startOfDay(date), 7 * i), "dd LLL"),
                completion: completionRatePerRange(subDays(date, 7 * i), 7, entries, habits.length)
            })

        return data;
    })()

    const areaChartConfig = {
        completion: {
            label: "Completion % per week",
            color: "var(--primary)",
        },
    } satisfies ChartConfig

    const radarChartData = (() => {
        let data: { name: string, completion: number }[] = [];

        for (const val of habits)
            data.push({
                name: `${val.icon} ${val.name}`,
                completion: completionRatePerRange(subDays(date, 7), 7, entries.filter(e => e.habitId === val.id), 1)
            })

        return data;
    })()

    const radarChartConfig = {
        completion: {
            label: "Completion % per habit",
            color: "var(--primary)"
        },
    } satisfies ChartConfig

    const barChartData = habits.map(h => ({
        name: h.icon,
        entries: entries.filter(e => e.habitId === h.id && isAfter(e.date, subDays(date, 31))).length
    }))

    const barChartConfig = {
        entries: {
            label: "Entries ",
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
                <Card className="lg:w-2/3 pt-0">
                    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>Week trend</CardTitle>
                            <CardDescription>
                                Completion percent in the last 12 weeks
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                        <CustomAreaChart chartConfig={areaChartConfig} chartData={areaChartData} dataKeyChart="completion" dataKeyXAxis="date" className="w-full max-h-75! max-sm:h-64!" />
                    </CardContent>
                    <CardFooter className="h-24">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                {
                                    areaChartData[areaChartData.length - 1].completion > areaChartData[areaChartData.length - 2].completion
                                        ? <>
                                            Trending up by <span className="font-semibold text-primary">{areaChartData[areaChartData.length - 1].completion - areaChartData[areaChartData.length - 2].completion}%</span> this month <TrendingUp className="h-4 w-4" />
                                        </>
                                        : <>
                                            Trending down by <span className="font-semibold text-destructive">{areaChartData[areaChartData.length - 2].completion - areaChartData[areaChartData.length - 1].completion}%</span> this month <TrendingDown className="h-4 w-4 rotate-180" />
                                        </>
                                }
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                {format(subDays(date, 7 * 12), "dd LLL yyyy")} - {format(date, "dd LLL yyyy")}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="lg:w-1/3 pt-0 justify-between">
                    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>Completion Rate per Habit</CardTitle>
                            <CardDescription>
                                Completion percent per each habit this month
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                        <CustomRadarChart chartConfig={radarChartConfig} chartData={radarChartData} dataKeyChart="completion" labels="name" className="mx-auto w-full max-h-62.5!" />
                    </CardContent>
                    <CardFooter className="h-24">
                        <div className="grid gap-2">
                            <p>
                                <span className="font-semibold text-foreground">
                                    {sort(radarChartData).desc((d) => d.completion)[0].name}
                                </span> {" "}
                                has the highest completion rate this month
                            </p>
                            <div className="text-muted-foreground">
                                {format(date, "LLL yyyy")}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <Card className="lg:w-1/2">
                    <CardHeader>
                        <CardTitle>lorem</CardTitle>
                        <CardDescription>lorem</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CustomBarChart chartConfig={barChartConfig} chartData={barChartData} dataKeyChart="entries" labels="name" className="w-full" />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 leading-none font-medium">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing total visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}