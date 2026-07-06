"use client"

import { CartesianGrid, XAxis, Area, AreaChart, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { ChartData } from "recharts/types/state/chartDataSlice";

interface CustomAreaChartProps {
    chartData: ChartData;
    chartConfig: ChartConfig;
    dataKeyChart: string;
    dataKeyXAxis: string;
    className?: string
}

export default function CustomAreaChart({ chartData, chartConfig, dataKeyChart, dataKeyXAxis, className }: CustomAreaChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={dataKeyXAxis}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip cursor={false} content={
                    <ChartTooltipContent formatter={(value, name) => (
                        <>
                            <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                                style={
                                    {
                                        "--color-bg": `var(--color-${name})`,
                                    } as React.CSSProperties
                                }
                            />
                            {chartConfig[name as keyof typeof chartConfig]?.label ||
                                name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                                {value}
                                <span className="font-normal text-muted-foreground">
                                    %
                                </span>
                            </div>
                        </>
                    )}
                    />
                } />
                <defs>
                    <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-completion)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-completion)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey={dataKeyChart}
                    type="natural"
                    fill="url(#fillGradient)"
                    fillOpacity={0.4}
                    stroke="var(--color-completion)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}
