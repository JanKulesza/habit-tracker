"use client"

import { RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts"
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
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey={labels} domain={[0,100]} />
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
