import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatSecondsToTime, type Course, type Sex, type EventKey } from '@/lib/swimMath';
import masterTimesData from '@/data/masterTimes.json';
import { BarChart3, Users } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────
interface MasterTimesStructure {
  [course: string]: {
    [sex: string]: {
      [category: string]: {
        [event: string]: number[];
      };
    };
  };
}

const masterTimes = masterTimesData as MasterTimesStructure;

const AGE_GROUPS = ['20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90'];

interface GaussianChartProps {
  event: EventKey;
  course: Course;
  sex: Sex;
  userTime: number | null;
  predictionTime?: number | null;
}

// ── Gaussian math ──────────────────────────────────────────
function computeStats(times: number[]): { mean: number; std: number } {
  const n = times.length;
  const mean = times.reduce((a, b) => a + b, 0) / n;
  const variance = times.reduce((a, t) => a + (t - mean) ** 2, 0) / n;
  return { mean, std: Math.sqrt(variance) };
}

function gaussianPDF(x: number, mean: number, std: number): number {
  if (std === 0) return x === mean ? 1 : 0;
  const exp = -0.5 * ((x - mean) / std) ** 2;
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(exp);
}

function computePercentile(value: number, times: number[]): number {
  const sorted = [...times].sort((a, b) => a - b);
  // In swimming, lower time = better, so percentile = % of people SLOWER than you
  const count = sorted.filter((t) => t >= value).length;
  return Math.round((count / sorted.length) * 100);
}

// ── Component ──────────────────────────────────────────────
const GaussianDistributionChart: React.FC<GaussianChartProps> = ({
  event,
  course,
  sex,
  userTime,
  predictionTime,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get available categories for this course/sex/event combo
  const availableCategories = useMemo(() => {
    const courseData = masterTimes[course]?.[sex];
    if (!courseData) return [];
    return AGE_GROUPS.filter(
      (cat) => courseData[cat]?.[event] && courseData[cat][event].length > 0
    );
  }, [course, sex, event]);

  // Collect times based on selected category
  const times = useMemo(() => {
    const courseData = masterTimes[course]?.[sex];
    if (!courseData) return [];

    if (selectedCategory === 'all') {
      // Merge all categories
      const all: number[] = [];
      for (const cat of Object.keys(courseData)) {
        const eventTimes = courseData[cat]?.[event];
        if (eventTimes) all.push(...eventTimes);
      }
      return all.sort((a, b) => a - b);
    }

    return courseData[selectedCategory]?.[event]?.slice().sort((a, b) => a - b) || [];
  }, [course, sex, event, selectedCategory]);

  // Generate the Gaussian curve data
  const { chartData, stats, userPercentile, predictionPercentile } = useMemo(() => {
    if (times.length < 3) {
      return { chartData: [], stats: null, userPercentile: null, predictionPercentile: null };
    }

    const stats = computeStats(times);
    const minTime = Math.min(...times, userTime ?? Infinity, predictionTime ?? Infinity);
    const maxTime = Math.max(...times, userTime ?? -Infinity, predictionTime ?? -Infinity);
    const range = maxTime - minTime;
    const padding = range * 0.2;
    const start = Math.max(0, minTime - padding);
    const end = maxTime + padding;
    const step = (end - start) / 120;

    // Generate smooth curve points
    const chartData = [];
    for (let x = start; x <= end; x += step) {
      chartData.push({
        time: x,
        density: gaussianPDF(x, stats.mean, stats.std),
      });
    }

    // Compute percentiles
    const userPercentile = userTime ? computePercentile(userTime, times) : null;
    const predictionPercentile = predictionTime ? computePercentile(predictionTime, times) : null;

    return { chartData, stats, userPercentile, predictionPercentile };
  }, [times, userTime, predictionTime]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { time?: number } }> }) => {
    if (!active || !payload?.length) return null;
    const time = payload[0]?.payload?.time;
    if (!time) return null;
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
        <span className="font-medium">{formatSecondsToTime(time)}</span>
      </div>
    );
  };

  if (availableCategories.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Distribuzione Tempi Master
          </h2>
        </div>
        <div className="px-4 sm:px-8 py-10 text-center text-muted-foreground">
          Nessun dato Master disponibile per {event.replace('_', ' ')} {course} {sex === 'M' ? 'Maschi' : 'Femmine'}
        </div>
      </div>
    );
  }

  const categoryLabel =
    selectedCategory === 'all'
      ? 'Tutte le categorie'
      : `Master ${selectedCategory}`;

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Distribuzione Tempi Master
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Campionati Italiani Master ({course === 'SCM' ? 'Vasca Corta 25m' : 'Vasca Lunga 50m'})
        </p>
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Category selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="space-y-1.5 flex-1 max-w-xs">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              Categoria Master
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    Master {cat} ({masterTimes[course]?.[sex]?.[cat]?.[event]?.length ?? 0} atleti)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats summary */}
          {stats && (
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40">
                <span className="text-muted-foreground">Atleti: </span>
                <span className="font-semibold">{times.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40">
                <span className="text-muted-foreground">Media: </span>
                <span className="font-semibold">{formatSecondsToTime(stats.mean)}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40">
                <span className="text-muted-foreground">Best: </span>
                <span className="font-semibold">{formatSecondsToTime(times[0])}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="w-full h-[320px] sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="gaussianFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(v: number) => formatSecondsToTime(v)}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  stroke="hsl(var(--border))"
                  label={{
                    value: 'Tempo',
                    position: 'insideBottom',
                    offset: -10,
                    style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                  }}
                />
                <YAxis
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: 'Densità',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#gaussianFill)"
                  animationDuration={800}
                />

                {/* User time marker */}
                {userTime && (
                  <ReferenceLine
                    x={userTime}
                    stroke="hsl(var(--chart-1, 220 70% 50%))"
                    strokeWidth={2.5}
                    strokeDasharray="6 3"
                    label={{
                      value: `Il tuo tempo: ${formatSecondsToTime(userTime)}`,
                      position: 'top',
                      fill: 'hsl(var(--chart-1, 220 70% 50%))',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                )}

                {/* Prediction time marker */}
                {predictionTime && (
                  <ReferenceLine
                    x={predictionTime}
                    stroke="hsl(var(--chart-2, 160 60% 45%))"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    label={{
                      value: `Target: ${formatSecondsToTime(predictionTime)}`,
                      position: 'top',
                      fill: 'hsl(var(--chart-2, 160 60% 45%))',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                )}

                {/* Mean marker */}
                {stats && (
                  <ReferenceLine
                    x={stats.mean}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    label={{
                      value: 'Media',
                      position: 'insideTopRight',
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 11,
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            Dati insufficienti per generare la distribuzione (min. 3 tempi)
          </div>
        )}

        {/* Percentile cards */}
        {(userPercentile !== null || predictionPercentile !== null) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userPercentile !== null && userTime && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  La tua posizione
                </div>
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(var(--chart-1, 220 70% 50%))' }}>
                  Top {100 - userPercentile}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Meglio del <strong>{userPercentile}%</strong> degli atleti master ({categoryLabel})
                </p>
              </div>
            )}
            {predictionPercentile !== null && predictionTime && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Target position
                </div>
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(var(--chart-2, 160 60% 45%))' }}>
                  Top {100 - predictionPercentile}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Meglio del <strong>{predictionPercentile}%</strong> degli atleti master ({categoryLabel})
                </p>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary rounded" />
            Distribuzione tempi
          </div>
          {userTime && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 rounded" style={{ backgroundColor: 'hsl(220 70% 50%)' }} />
              Il tuo tempo
            </div>
          )}
          {predictionTime && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 rounded" style={{ backgroundColor: 'hsl(160 60% 45%)' }} />
              Target
            </div>
          )}
          {stats && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-muted-foreground/50 rounded" style={{ borderTop: '1px dashed' }} />
              Media
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground italic">
          Dati: Campionati Italiani Master {course === 'SCM' ? '(Torino 2025, vasca 25m)' : '(Riccione 2025, vasca 50m)'}. Distribuzione gaussiana stimata sui tempi reali di gara.
        </p>
      </div>
    </div>
  );
};

export default GaussianDistributionChart;
