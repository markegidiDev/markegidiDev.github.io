import { memo, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type WeeklyRow = {
  week: string; // e.g., 2025-W37
  corsa?: number;
  ciclismo?: number;
  nuoto?: number;
  camminata?: number;
};

export interface WeeklySeriesConfig {
  [key: string]: { label: string; color?: string };
}

interface Props {
  data: WeeklyRow[];
  keys: string[]; // which series to render
  series: WeeklySeriesConfig;
}

function formatWeek(w: string) {
  // render like W37
  const m = /W(\d{2})$/.exec(w);
  return m ? `W${m[1]}` : w;
}

export const WeeklyAggregatesChart = memo(function WeeklyAggregatesChart({ data, keys, series }: Props) {
  const chartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {};
    keys.forEach((k, idx) => {
      cfg[k] = {
        label: series[k]?.label ?? k,
        color: series[k]?.color ?? `hsl(var(--chart-${(idx % 5) + 1}))`,
      };
    });
    return cfg;
  }, [keys, series]);

  return (
    <div className="w-full h-[280px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.4)" />
          <XAxis dataKey="week" tickFormatter={formatWeek} stroke="hsl(var(--muted-foreground))" minTickGap={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <ChartTooltip content={<ChartTooltipContent />} />
          {keys.map((k) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              name={chartConfig[k].label}
              stroke={chartConfig[k].color}
              fillOpacity={0.25}
              fill={chartConfig[k].color}
              dot={false}
              connectNulls
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  );
});
