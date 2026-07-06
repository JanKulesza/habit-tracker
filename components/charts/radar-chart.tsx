"use client"

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { ChartData } from "recharts/types/state/chartDataSlice";

interface CustomRadarChartProps {
    chartData: ChartData;
    chartConfig: ChartConfig;
    dataKeyChart: string;
    labels: string;
    className?: string
}

export default function CustomRadarChart({ chartData, chartConfig, dataKeyChart, labels, className }: CustomRadarChartProps) {
    return (
        <ChartContainer
            config={chartConfig}
            className={className}
        >
            <RadarChart data={chartData}>
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
                <PolarAngleAxis dataKey={labels} />
                <PolarGrid />
                <Radar
                    dataKey={dataKeyChart}
                    fill="var(--color-completion)"
                    fillOpacity={0.2}
                    stroke="var(--color-completion)"
                    strokeWidth={2}
                />
            </RadarChart>
        </ChartContainer>
    )
}
