"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface SkillRadialChartProps {
  skillName: string;
  percentage: number; // 0-100
  color: string; // e.g., "hsl(var(--primary))"
}

export function SkillRadialChart({ skillName, percentage, color }: SkillRadialChartProps) {
  const chartData = [
    { browser: "safari", visitors: percentage, fill: color },
  ];

  const chartConfig = {
    visitors: {
      label: "Percentuale",
    },
    safari: {
      label: skillName || "",
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto w-full h-[180px] max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + (percentage / 100) * 360}
        innerRadius="55%"
        outerRadius="85%"
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[90, 72]}
        />
        <RadialBar
          dataKey="visitors"
          cornerRadius={10}
          background
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {percentage}%
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
