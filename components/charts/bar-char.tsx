"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { ChartData } from "recharts/types/state/chartDataSlice";

interface CustomBarChartProps {
    chartData: ChartData;
    chartConfig: ChartConfig;
    dataKeyChart: string;
    labels: string;
    className?: string
}

export default function CustomBarChart({ chartData, chartConfig, dataKeyChart, labels, className }: CustomBarChartProps) {
    return (
        <ChartContainer config={chartConfig} className={className}>
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                    left: -20,
                }}
            >
                <XAxis type="number" dataKey={dataKeyChart} hide />
                <YAxis
                    dataKey={labels}
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey={dataKeyChart} fill="var(--primary)" radius={5} barSize={15} />
            </BarChart>
        </ChartContainer>
    )
}
