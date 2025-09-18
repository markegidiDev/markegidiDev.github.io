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
  try {
    // Assicuriamoci che la data sia in formato valido
    const dt = new Date(d)
    // Verifichiamo che la data sia valida
    if (isNaN(dt.getTime())) {
      console.warn('Invalid date:', d)
      return d // Ritorna la stringa originale se la data non è valida
    }
    return dt.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })
  } catch (error) {
    console.error('Error parsing date:', d, error)
    return d // Ritorna la stringa originale in caso di errore
  }
}

export const ActivityAreaChart = memo(function ActivityAreaChart({ data, series, keys, animationKey, animate = true, animationDuration = 500 }: Props) {
  const processed = useMemo(() => {
    const result = data.map((r) => {
      // Keep date as-is; coerce only numeric-like string values for other keys
      const coercedEntries = Object.entries(r).map(([k, v]) => {
        if (k === 'date') return [k, v]
        if (typeof v === 'string') {
          const maybeNum = Number(v)
          return [k, Number.isFinite(maybeNum) ? maybeNum : v]
        }
        return [k, v]
      })
      return Object.fromEntries(coercedEntries) as typeof r
    })

    // Debug: stampa i primi 3 elementi per vedere il formato
    if (result.length > 0) {
      console.log('First 3 data points:', result.slice(0, 3))
    }

    return result
  }, [data])

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
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="hsl(var(--muted-foreground))" minTickGap={12} />
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