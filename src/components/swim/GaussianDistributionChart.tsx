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
import { formatSecondsToTime, parseTimeToSeconds, type Course, type Sex, type EventKey } from '@/lib/swimMath';
import masterTimesData from '@/data/masterTimes.json';
import { BarChart3, Users, Globe } from 'lucide-react';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
const cardInsetStyle = { paddingInline: '1.75rem', paddingBlock: '1.5rem' } as const;

// â”€â”€ World Records â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Structure: WORLD_RECORDS[course][sex][eventKey] = seconds
const WORLD_RECORDS: Record<string, Record<string, Record<string, { time: number; holder: string }>>> = {
  LCM: {
    M: {
      '50_FREE':   { time: parseTimeToSeconds('20.91'),   holder: 'CÃ©sar Cielo' },
      '100_FREE':  { time: parseTimeToSeconds('46.40'),   holder: 'Pan Zhanle' },
      '200_FREE':  { time: parseTimeToSeconds('1:42.00'), holder: 'Paul Biedermann' },
      '400_FREE':  { time: parseTimeToSeconds('3:39.96'), holder: 'Lukas MÃ¤rtens' },
      '800_FREE':  { time: parseTimeToSeconds('7:32.12'), holder: 'Zhang Lin' },
      '1500_FREE': { time: parseTimeToSeconds('14:30.67'),holder: 'Bobby Finke' },
      '50_BACK':   { time: parseTimeToSeconds('23.55'),   holder: 'Kliment Kolesnikov' },
      '100_BACK':  { time: parseTimeToSeconds('51.60'),   holder: 'Thomas Ceccon' },
      '200_BACK':  { time: parseTimeToSeconds('1:51.92'), holder: 'Aaron Peirsol' },
      '50_BREAST': { time: parseTimeToSeconds('25.95'),   holder: 'Adam Peaty' },
      '100_BREAST':{ time: parseTimeToSeconds('56.88'),   holder: 'Adam Peaty' },
      '200_BREAST':{ time: parseTimeToSeconds('2:05.48'), holder: 'Qin Haiyang' },
      '50_FLY':    { time: parseTimeToSeconds('22.27'),   holder: 'Andriy Govorov' },
      '100_FLY':   { time: parseTimeToSeconds('49.45'),   holder: 'Caeleb Dressel' },
      '200_FLY':   { time: parseTimeToSeconds('1:50.34'), holder: 'KristÃ³f MilÃ¡k' },
      '200_IM':    { time: parseTimeToSeconds('1:52.69'), holder: 'LÃ©on Marchand' },
      '400_IM':    { time: parseTimeToSeconds('4:02.50'), holder: 'LÃ©on Marchand' },
    },
    F: {
      '50_FREE':   { time: parseTimeToSeconds('23.61'),   holder: 'Sarah SjÃ¶strÃ¶m' },
      '100_FREE':  { time: parseTimeToSeconds('51.71'),   holder: 'Sarah SjÃ¶strÃ¶m' },
      '200_FREE':  { time: parseTimeToSeconds('1:52.23'), holder: 'Ariarne Titmus' },
      '400_FREE':  { time: parseTimeToSeconds('3:54.18'), holder: 'Summer McIntosh' },
      '800_FREE':  { time: parseTimeToSeconds('8:04.12'), holder: 'Katie Ledecky' },
      '1500_FREE': { time: parseTimeToSeconds('15:20.48'),holder: 'Katie Ledecky' },
      '50_BACK':   { time: parseTimeToSeconds('26.86'),   holder: 'Kaylee McKeown' },
      '100_BACK':  { time: parseTimeToSeconds('57.13'),   holder: 'Regan Smith' },
      '200_BACK':  { time: parseTimeToSeconds('2:03.14'), holder: 'Kaylee McKeown' },
      '50_BREAST': { time: parseTimeToSeconds('29.16'),   holder: 'RÅ«ta MeilutytÄ—' },
      '100_BREAST':{ time: parseTimeToSeconds('1:04.13'), holder: 'Lilly King' },
      '200_BREAST':{ time: parseTimeToSeconds('2:17.55'), holder: 'Evgeniia Chikunova' },
      '50_FLY':    { time: parseTimeToSeconds('24.43'),   holder: 'Sarah SjÃ¶strÃ¶m' },
      '100_FLY':   { time: parseTimeToSeconds('54.60'),   holder: 'Gretchen Walsh' },
      '200_FLY':   { time: parseTimeToSeconds('2:01.81'), holder: 'Liu Zige' },
      '200_IM':    { time: parseTimeToSeconds('2:05.70'), holder: 'Summer McIntosh' },
      '400_IM':    { time: parseTimeToSeconds('4:23.65'), holder: 'Summer McIntosh' },
    },
  },
  SCM: {
    M: {
      '50_FREE':   { time: parseTimeToSeconds('19.90'),   holder: 'Jordan Crooks' },
      '100_FREE':  { time: parseTimeToSeconds('44.84'),   holder: 'Kyle Chalmers' },
      '200_FREE':  { time: parseTimeToSeconds('1:38.61'), holder: 'Luke Hobson' },
      '400_FREE':  { time: parseTimeToSeconds('3:32.25'), holder: 'Yannick Agnel' },
      '800_FREE':  { time: parseTimeToSeconds('7:20.46'), holder: 'Daniel Wiffen' },
      '1500_FREE': { time: parseTimeToSeconds('14:06.88'),holder: 'Florian Wellbrock' },
      '50_BACK':   { time: parseTimeToSeconds('22.11'),   holder: 'Kliment Kolesnikov' },
      '100_BACK':  { time: parseTimeToSeconds('48.16'),   holder: 'Hubert KÃ³s' },
      '200_BACK':  { time: parseTimeToSeconds('1:45.12'), holder: 'Hubert KÃ³s' },
      '50_BREAST': { time: parseTimeToSeconds('24.95'),   holder: 'Emre SakÃ§Ä±' },
      '100_BREAST':{ time: parseTimeToSeconds('55.28'),   holder: 'Ilya Shymanovich' },
      '200_BREAST':{ time: parseTimeToSeconds('1:59.52'), holder: 'Caspar Corbeau' },
      '50_FLY':    { time: parseTimeToSeconds('21.32'),   holder: 'NoÃ¨ Ponti' },
      '100_FLY':   { time: parseTimeToSeconds('47.68'),   holder: 'Joshua Liendo' },
      '200_FLY':   { time: parseTimeToSeconds('1:46.85'), holder: 'Tomoru Honda' },
      '100_IM':    { time: parseTimeToSeconds('49.28'),   holder: 'Caeleb Dressel' },
      '200_IM':    { time: parseTimeToSeconds('1:48.88'), holder: 'LÃ©on Marchand' },
      '400_IM':    { time: parseTimeToSeconds('3:54.81'), holder: 'Daiya Seto' },
    },
    F: {
      '50_FREE':   { time: parseTimeToSeconds('22.83'),   holder: 'Gretchen Walsh' },
      '100_FREE':  { time: parseTimeToSeconds('49.93'),   holder: 'Kate Douglass' },
      '200_FREE':  { time: parseTimeToSeconds('1:49.36'), holder: 'Mollie O\'Callaghan' },
      '400_FREE':  { time: parseTimeToSeconds('3:50.25'), holder: 'Summer McIntosh' },
      '800_FREE':  { time: parseTimeToSeconds('7:54.00'), holder: 'Lani Pallister' },
      '1500_FREE': { time: parseTimeToSeconds('15:08.24'),holder: 'Katie Ledecky' },
      '50_BACK':   { time: parseTimeToSeconds('25.23'),   holder: 'Regan Smith' },
      '100_BACK':  { time: parseTimeToSeconds('54.02'),   holder: 'Regan Smith' },
      '200_BACK':  { time: parseTimeToSeconds('1:57.33'), holder: 'Kaylee McKeown' },
      '50_BREAST': { time: parseTimeToSeconds('28.37'),   holder: 'RÅ«ta MeilutytÄ—' },
      '100_BREAST':{ time: parseTimeToSeconds('1:02.36'), holder: 'RÅ«ta MeilutytÄ— / Alia Atkinson' },
      '200_BREAST':{ time: parseTimeToSeconds('2:12.50'), holder: 'Kate Douglass' },
      '50_FLY':    { time: parseTimeToSeconds('23.72'),   holder: 'Gretchen Walsh' },
      '100_FLY':   { time: parseTimeToSeconds('52.71'),   holder: 'Gretchen Walsh' },
      '200_FLY':   { time: parseTimeToSeconds('1:59.32'), holder: 'Summer McIntosh' },
      '100_IM':    { time: parseTimeToSeconds('55.11'),   holder: 'Gretchen Walsh' },
      '200_IM':    { time: parseTimeToSeconds('2:01.63'), holder: 'Kate Douglass' },
      '400_IM':    { time: parseTimeToSeconds('4:15.48'), holder: 'Summer McIntosh' },
    },
  },
};

function getWorldRecord(course: Course, sex: Sex, event: EventKey): { time: number; holder: string } | null {
  return WORLD_RECORDS[course]?.[sex]?.[event] ?? null;
}

interface GaussianChartProps {
  event: EventKey;
  course: Course;
  sex: Sex;
  userTime: number | null;
  predictionTime?: number | null;
}

// â”€â”€ Gaussian math â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GaussianDistributionChart: React.FC<GaussianChartProps> = ({
  event,
  course,
  sex,
  userTime,
  predictionTime,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showWorldRecord, setShowWorldRecord] = useState<boolean>(false);

  // Get world record for this event/course/sex
  const worldRecord = useMemo(() => getWorldRecord(course, sex, event), [course, sex, event]);

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
    const padding = range * 0.15;

    // When WR toggle is ON, extend the range left to always include the world record line
    let start: number;
    if (showWorldRecord && worldRecord) {
      const wrFloor = worldRecord.time * 0.97; // small margin below WR
      start = Math.min(wrFloor, minTime - padding);
    } else {
      // Natural range: just use data bounds with padding, clamped to best master time
      start = Math.max(times[0] * 0.95, minTime - padding);
    }
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
  }, [times, userTime, predictionTime, worldRecord, showWorldRecord]);

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
        <div className="px-6 sm:px-10 pt-7 sm:pt-10 pb-5 border-b border-border/40" style={cardInsetStyle}>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Distribuzione Tempi Master
          </h2>
        </div>
        <div className="px-6 sm:px-10 py-10 text-center text-muted-foreground" style={cardInsetStyle}>
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
      <div className="px-6 sm:px-10 pt-7 sm:pt-10 pb-5 border-b border-border/40" style={cardInsetStyle}>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Distribuzione Tempi Master
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Campionati Italiani Master ({course === 'SCM' ? 'Vasca Corta 25m' : 'Vasca Lunga 50m'})
        </p>
      </div>

      <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-6" style={cardInsetStyle}>
        {/* Category selector + World Record toggle */}
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

          {/* World Record toggle */}
          {worldRecord && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWorldRecord(!showWorldRecord)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  showWorldRecord
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted/60'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                WR {showWorldRecord ? 'ON' : 'OFF'}
              </button>
              {showWorldRecord && (
                <span className="text-xs text-muted-foreground">
                  {formatSecondsToTime(worldRecord.time)} â€” {worldRecord.holder}
                </span>
              )}
            </div>
          )}

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
                    value: 'DensitÃ ',
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

                {/* World Record marker */}
                {showWorldRecord && worldRecord && (
                  <ReferenceLine
                    x={worldRecord.time}
                    stroke="hsl(40 90% 50%)"
                    strokeWidth={2.5}
                    strokeDasharray="8 4"
                    label={{
                      value: `WR: ${formatSecondsToTime(worldRecord.time)}`,
                      position: 'top',
                      fill: 'hsl(40 90% 50%)',
                      fontSize: 12,
                      fontWeight: 600,
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
              <div className="p-4 rounded-xl border border-border/70 bg-card/70">
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
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/12">
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
          {showWorldRecord && worldRecord && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 rounded" style={{ backgroundColor: 'hsl(40 90% 50%)' }} />
              Record del Mondo
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
