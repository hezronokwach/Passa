

'use client';

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
    name: string;
    value: number;
    fill: string;
}

interface SubmissionsChartProps {
    data: ChartData[];
}

export function SubmissionsChart({ data }: SubmissionsChartProps) {

  return (
    <div className="flex items-center justify-center py-4">
        <ChartContainer
            config={{
                value: {
                    label: "Submissions",
                },
            }}
            className="mx-auto aspect-square h-[250px]"
            >
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  )
}
