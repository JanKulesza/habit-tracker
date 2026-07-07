import CustomAreaChart from "@/components/charts/area-chart";
import CustomBarChart from "@/components/charts/bar-char";
import CustomRadarChart from "@/components/charts/radar-chart";
import InfoBox from "@/components/info-box";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { ProgressU } from "@/components/ui/progress-updated";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Habit } from "@/generated/prisma/client";
import { getEntriesForCurrentUser } from "@/lib/dal/entries";
import { getHabitsForCurrentUser } from "@/lib/dal/habits";
import { completionRatePerRange, getBestStreak, getStreakLog } from "@/lib/utils";
import { subDays, startOfDay, format, isAfter } from "date-fns";
import { sort } from "fast-sort";
import { TrendingUp, Flame, Medal, Check, TrendingDown } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

export default async function StatsPage() {
    const resHab = await getHabitsForCurrentUser();
    const resEntr = await getEntriesForCurrentUser()
    if (!resHab.success || !resEntr.success)
        return toast.error("Error while loading resources.");

    const habits = resHab.data, entries = resEntr.data;
    const date = new Date();

    const lastMonthCompletionRate = completionRatePerRange(subDays(date, 30), 30, entries, habits.length),
        lastWeekCompletionRate = completionRatePerRange(subDays(date, 7), 7, entries, habits.length);

    const habitStreakLogs = new Map<Habit['id'], Map<string, number>>();
    for (const h of habits) {
        habitStreakLogs.set(h.id, getStreakLog(h, entries));
    }
    const bestStreak = getBestStreak(habitStreakLogs);

    const infoBoxes = [
        {
            title: "30 days",
            icon: TrendingUp,
            iconColor: "text-[#6ec58e]",
            text: `${lastMonthCompletionRate}%`,
            description: "Completion rate"
        },
        {
            title: "Last week",
            icon: Flame,
            iconColor: "text-[#fa914a]",
            text: `${lastWeekCompletionRate}%`,
            description: "Completion rate",
        },
        {
            title: "Best streak",
            icon: Medal,
            iconColor: "text-[#a176f1]",
            text: `${bestStreak} ${bestStreak === 1 ? "day" : "days"}`,
            description: "All-time record"
        },
        {
            title: "All-together",
            icon: Check,
            iconColor: "text-[#4cbaed]",
            text: `${entries.length}`,
            description: "Total completions"
        },
    ]

    // Area chart data describes weekly completion rate during AreaChartTimespan weeks time span
    const AreaChartTimespan = 12 // weeks
    const areaChartData = (() => {
        let data: { date: string, completion: number }[] = [];

        for (let i = AreaChartTimespan; i >= 1; i--) // Keep in sync with the chart's footer description
            data.push({
                date: format(subDays(startOfDay(date), 7 * i), "dd LLL"),
                completion: completionRatePerRange(subDays(date, 7 * i), 7, entries, habits.length)
            })

        return data;
    })()

    const areaChartConfig = {
        completion: {
            label: "Completion ",
            color: "var(--primary)",
        },
    } satisfies ChartConfig

    const areaChartDesc = areaChartData[areaChartData.length - 1].completion > areaChartData[areaChartData.length - 2].completion
        ? <>
            Trending up by <span className="font-semibold text-primary">{areaChartData[areaChartData.length - 1].completion - areaChartData[areaChartData.length - 2].completion}%</span> this month <TrendingUp className="h-4 w-4" />
        </>
        : <>
            Trending down by <span className="font-semibold text-destructive">{areaChartData[areaChartData.length - 2].completion - areaChartData[areaChartData.length - 1].completion}%</span> this month <TrendingDown className="h-4 w-4 rotate-180" />
        </>

    // Radar chart, data represents completion rate per habit in the last 30 days
    const RadarChartTimespan = 30 // days
    const radarChartData = (() => {
        let data: { name: string, completion: number }[] = [];

        for (const val of habits)
            data.push({
                name: `${val.icon} ${val.name}`,
                completion: completionRatePerRange(subDays(date, RadarChartTimespan), RadarChartTimespan, entries.filter(e => e.habitId === val.id), 1)
            })

        return data;
    })()

    const radarChartConfig = {
        completion: {
            label: "Completion",
            color: "var(--primary)"
        },
    } satisfies ChartConfig

    // Bar chart
    const BarCharTimespan = 30 // days
    const barChartData = habits.map(h => ({
        name: h.name,
        icon: h.icon,
        entries: entries.filter(e => e.habitId === h.id && isAfter(e.date, subDays(date, BarCharTimespan + 1))).length
    }))

    const barChartConfig = {
        entries: {
            label: "Entries ",
            color: "var(--primary)"
        },
    } satisfies ChartConfig

    const totalCompletionInLast30Days = barChartData.reduce((acc, val) => acc += val.entries, 0);
    const rankedHabits = sort(radarChartData).desc(val => val.completion);

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
                    <CardHeader className="flex items-center flex-col justify-between gap-4 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>Week trend</CardTitle>
                            <CardDescription>
                                Completion percent in the last {AreaChartTimespan} weeks
                            </CardDescription>
                        </div>
                        <div className="bg-primary/20 rounded-xl p-1 px-6 text-primary text-sm font-semibold">Currently at {areaChartData[areaChartData.length - 1].completion}%</div>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                        <CustomAreaChart chartConfig={areaChartConfig} chartData={areaChartData} dataKeyChart="completion" dataKeyXAxis="date" className="w-full max-h-75! max-sm:h-64!" />
                    </CardContent>
                    <CardFooter className="h-24">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2  font-medium">
                                {areaChartDesc}
                            </div>
                            <div className="flex items-center gap-2  text-muted-foreground">
                                {format(subDays(date, 7 * AreaChartTimespan), "d LLL yyyy")} - {format(date, "d LLL yyyy")}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="lg:w-1/3 pt-0 justify-between">
                    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>Completion Rate per Habit</CardTitle>
                            <CardDescription>
                                Completion percent per each habit in last {RadarChartTimespan} days
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                        <CustomRadarChart chartConfig={radarChartConfig} chartData={radarChartData} dataKeyChart="completion" labels="name" className="mx-auto w-full max-h-62.5!" />
                    </CardContent>
                    <CardFooter className="h-24">
                        <div className="grid gap-2">
                            <div className=" font-medium">
                                <span className="font-semibold text-foreground">
                                    {rankedHabits[rankedHabits.length - 1].name}
                                </span> has the lowest completion rate, sitting at <span className="font-semibold text-destructive">{rankedHabits[rankedHabits.length - 1].completion}%</span>
                            </div>
                            <div className="text-muted-foreground">
                                {format(subDays(date, RadarChartTimespan), "d LLL yyyy")} - {format(date, "d LLL yyyy")}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <Card className="lg:w-1/2 h-fit">
                    <CardHeader>
                        <CardTitle>Habit Performance</CardTitle>
                        <CardDescription>Number of completions by habit in the last {BarCharTimespan} days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="lg:h-80">
                            <CustomBarChart chartConfig={barChartConfig} chartData={barChartData} dataKeyChart="entries" labels="icon" className="w-full" />
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className=" font-medium">
                            <span className="text-primary font-semibold">{totalCompletionInLast30Days} completions</span> recorded in the last {BarCharTimespan} days.
                        </div>
                        <div className=" text-muted-foreground">
                            Average of {(totalCompletionInLast30Days / BarCharTimespan).toFixed(1)} per day
                        </div>
                    </CardFooter>
                </Card>
                <Card className="lg:w-1/2 h-fit">
                    <CardHeader>
                        <CardTitle>Habit ranking</CardTitle>
                        <CardDescription>Ranked by completion rate over the last {RadarChartTimespan} days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="lg:h-80">
                            {rankedHabits.map((val, idx) => {
                                return (
                                    <Fragment key={idx}>
                                        <div className="flex justify-between items-center gap-2 px-0 py-4 sm:px-4 mb-2">
                                            <div className="flex items-center">
                                                <span className="text-muted-foreground mr-4 text-sm">{idx + 1}</span>
                                                {val.name}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <ProgressU value={val.completion} className="w-16 sm:w-32" max={100} />
                                                <span className="text-muted-foreground mr-4">{val.completion}%</span>
                                            </div>
                                        </div>
                                        <Separator className="mb-2" />
                                    </Fragment>
                                )
                            })}
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className=" font-medium">
                            <span className="font-semibold">{rankedHabits[0].name}</span> remains the top-performing habit at <span className="text-primary font-semibold">{rankedHabits[0].completion}%</span>
                        </div>
                        <div className=" text-muted-foreground">
                            Higher completion rate means better consistency.
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}