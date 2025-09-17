import { memo, useMemo } from 'react'
import { AreaChart, Area, XAxis, CartesianGrid, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartRow = { date: string } & Record<string, number | string | undefined>

export interface SeriesConfig {
  [key: string]: { label: string; color?: string }
}

interface Props {
  data: ChartRow[]
  series: SeriesConfig
  keys: string[] // series to render
  /** Optional key that forces a remount when it changes to replay animations (e.g., timeframe) */
  animationKey?: string
  /** Enable/disable Recharts animations */
  animate?: boolean
  /** Duration of the line/area animation in ms */
  animationDuration?: number
}

function formatDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })
}

export const ActivityAreaChart = memo(function ActivityAreaChart({ data, series, keys, animationKey, animate = true, animationDuration = 500 }: Props) {
  const processed = useMemo(() => data.map(r => ({
    ...r,
    // ensure numeric
    ...Object.fromEntries(Object.entries(r).map(([k,v]) => [k, typeof v === 'string' ? Number(v) : v]))
  })), [data])

  // Generate chart config based on series
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    keys.forEach((key, idx) => {
      config[key] = {
        label: series[key]?.label ?? key,
        color: series[key]?.color ?? `hsl(var(--chart-${(idx%5)+1}))`
      }
    })
    return config
  }, [keys, series])

  return (
    <div className="w-full h-[320px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart key={animationKey} data={processed} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted)/0.5)" />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <ChartTooltip content={<ChartTooltipContent />} />
          {keys.map((k) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              name={series[k]?.label ?? k}
              stroke={chartConfig[k].color}
              fillOpacity={0.2}
              fill={chartConfig[k].color}
              isAnimationActive={animate}
              animationBegin={0}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
              dot={false}
              connectNulls
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  )
})