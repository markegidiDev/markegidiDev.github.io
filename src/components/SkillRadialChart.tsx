"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import type { ChartConfig } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"

interface SkillRadialChartProps {
  skillName: string;
  percentage: number; // 0-100
  color: string; // e.g., "hsl(var(--primary))"
  description?: string;
  size?: number; // Optional size for the chart container
}

export function SkillRadialChart({ skillName, percentage, color, description, size = 200 }: SkillRadialChartProps) {
  const chartData = [
    { name: skillName, value: percentage, fill: color },
  ];

  const chartConfig = {
    value: { 
      label: skillName,
    },
    [skillName]: { // Dynamic key based on skillName
      label: skillName,
      color: color,
    },
  } satisfies ChartConfig;  return (
    <div className="flex flex-col items-center justify-start text-center h-full w-full">
      <div className="items-center pb-2 w-full border-b border-border/10 p-6" style={{
        backgroundColor: "rgba(12, 12, 13, 0.05)"
      }}>
        <div className="text-lg font-medium text-foreground capitalize">{skillName}</div>
        {description && <div className="text-center text-sm text-muted-foreground mt-2">{description}</div>}
      </div><div className="flex-1 pb-0 flex items-center justify-center pt-4" style={{ padding: "1.5rem" }}>
        <ChartContainer
          config={chartConfig}
          className={`mx-auto aspect-square`}
          style={{ height: `${size}px`, width: `${size}px` }}
        >
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%" // Adjust for thickness
            outerRadius="80%" // Adjust for thickness
            barSize={20} // Adjust bar thickness if needed, or remove for auto
            startAngle={90} // Start from the top
            endAngle={90 + (percentage / 100) * 360} // Make the bar fill according to percentage
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
            />
            <RadialBar
              dataKey="value"
              background={{ fill: "hsl(var(--muted) / 0.3)" }}
              cornerRadius={10}
              className={chartData[0].fill} // Use the fill from data for the bar color
            />
            <PolarRadiusAxis 
              tick={false} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]} // Set domain for percentage
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold"
                        >
                          {percentage.toFixed(0)}%
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
