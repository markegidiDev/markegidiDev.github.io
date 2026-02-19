"use client";

import { useEffect, useMemo, useState } from 'react';
import { Listbox, Tab } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ActivityAreaChart } from '@/components/charts/ActivityAreaChart';
import { WeeklyAggregatesChart } from '@/components/charts/WeeklyAggregatesChart';
import { AthleteStatsKPI, type AthleteStats } from '@/components/dashboard/AthleteStatsKPI';
import { ZonesDonut } from '@/components/charts/ZonesDonut';
import { SwimPacesTable } from '@/components/dashboard/SwimPacesTable';
import { lttb } from '@/lib/downsample';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SaaSCard, SaaSEmptyState, SaaSHeader, SaaSPage, SaaSSkeleton } from '@/components/ui/saas';
import {
  Activity,
  BarChart3,
  Heart,
  Loader2,
  RefreshCw,
  Timer,
  Trophy,
  TrendingUp,
  Waves,
} from 'lucide-react';

interface DataPoint {
  date: string;
  corsa?: number;
  nuoto?: number;
  ciclismo?: number;
  camminata?: number;
  [key: string]: string | number | undefined;
}

export type FilterPeriod = '7d' | '30d' | '90d' | '6months' | '1year' | 'all';
export type ActivityType = 'all' | 'corsa' | 'nuoto' | 'ciclismo' | 'camminata';

const timeOptions: Array<{ id: FilterPeriod; name: string }> = [
  { id: '1year', name: 'Ultimo anno' },
  { id: '6months', name: 'Ultimi 6 mesi' },
  { id: '90d', name: 'Ultimi 90 giorni' },
  { id: '30d', name: 'Ultimi 30 giorni' },
  { id: '7d', name: 'Ultimi 7 giorni' },
  { id: 'all', name: 'Tutte le attivita' },
];

const typeOptions: Array<{ id: ActivityType; name: string }> = [
  { id: 'all', name: 'Tutte le attivita' },
  { id: 'corsa', name: 'Corsa' },
  { id: 'nuoto', name: 'Nuoto' },
  { id: 'ciclismo', name: 'Ciclismo' },
  { id: 'camminata', name: 'Camminata' },
];
const cardInsetStyle = { paddingInline: '1.75rem', paddingBlock: '1.5rem' } as const;

const DashboardPage = () => {
  const [stravaData, setStravaData] = useState<DataPoint[]>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{ week: string; corsa?: number; nuoto?: number; ciclismo?: number; camminata?: number }>>([]);
  const [athleteStats, setAthleteStats] = useState<AthleteStats | null>(null);
  const [bestEfforts, setBestEfforts] = useState<Array<{ date: string; type: 'run'; label: string; dist_km: number; time_s: number; pace_s_per_km: number }>>([]);
  const [zonesSummary, setZonesSummary] = useState<Array<{ id: number; sport: string; hr?: number[]; power?: number[] }>>([]);
  const [swimPaces, setSwimPaces] = useState<Array<{ id: number; date: string; totalMeters: number; movingSeconds: number; pace100m: number; paceFormatted: string }>>([]);
  const [timeRange, setTimeRange] = useState<FilterPeriod>('90d');
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [hasPrimaryError, setHasPrimaryError] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    const fetchJson = async <T,>(
      path: string,
      fallback: T,
      options?: { critical?: boolean; errorTitle?: string }
    ): Promise<T> => {
      try {
        const response = await fetch(`${path}?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as T;
      } catch (error) {
        if (!cancelled && options?.critical) {
          setHasPrimaryError(true);
          toast({
            variant: 'error',
            title: options.errorTitle ?? 'Impossibile caricare i dati',
            description: 'Controlla il file JSON o riprova tra poco.',
          });
        }
        if (process.env.NODE_ENV !== 'production') {
          console.debug('dashboard:fetch failed', path, error);
        }
        return fallback;
      }
    };

    const load = async () => {
      setIsLoading(true);
      setHasPrimaryError(false);

      const [activities, weekly, stats, efforts, zones, paces] = await Promise.all([
        fetchJson<DataPoint[]>('/strava-data.json', [], {
          critical: true,
          errorTitle: 'Dati Strava non disponibili',
        }),
        fetchJson<Array<{ week: string; corsa?: number; nuoto?: number; ciclismo?: number; camminata?: number }>>('/strava-aggregates.json', []),
        fetchJson<AthleteStats | null>('/athlete-stats.json', null),
        fetchJson<Array<{ date: string; type: 'run'; label: string; dist_km: number; time_s: number; pace_s_per_km: number }>>('/best-efforts.json', []),
        fetchJson<Array<{ id: number; sport: string; hr?: number[]; power?: number[] }>>('/zones-summary.json', []),
        fetchJson<Array<{ id: number; date: string; totalMeters: number; movingSeconds: number; pace100m: number; paceFormatted: string }>>('/swim-paces.json', []),
      ]);

      if (cancelled) return;

      const sorted = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setStravaData(sorted);
      setWeeklyData(Array.isArray(weekly) ? weekly : []);
      setAthleteStats(stats);
      setBestEfforts(Array.isArray(efforts) ? efforts : []);
      setZonesSummary(Array.isArray(zones) ? zones : []);
      setSwimPaces(Array.isArray(paces) ? paces : []);
      setIsLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const [debounced, setDebounced] = useState({ timeRange, activityType });
  useEffect(() => {
    const id = setTimeout(() => setDebounced({ timeRange, activityType }), 180);
    return () => clearTimeout(id);
  }, [timeRange, activityType]);

  const filteredData = useMemo(() => {
    const referenceDate = new Date();
    referenceDate.setHours(0, 0, 0, 0);

    let daysToSubtract = 90;
    if (debounced.timeRange === '30d') daysToSubtract = 30;
    else if (debounced.timeRange === '7d') daysToSubtract = 7;
    else if (debounced.timeRange === '6months') daysToSubtract = 180;
    else if (debounced.timeRange === '1year') daysToSubtract = 365;
    else if (debounced.timeRange === 'all') daysToSubtract = 3650;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return stravaData.filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      const isInTimeRange = itemDate >= startDate;

      if (debounced.activityType === 'all') return isInTimeRange;
      return isInTimeRange && item[debounced.activityType] !== undefined && Number(item[debounced.activityType]) > 0;
    });
  }, [stravaData, debounced]);

  const chartConfig = useMemo(
    () => ({
      corsa: { label: 'Corsa', color: 'hsl(198 78% 46%)' },
      nuoto: { label: 'Nuoto', color: 'hsl(var(--primary))' },
      ciclismo: { label: 'Ciclismo', color: 'hsl(43 93% 52%)' },
      camminata: { label: 'Camminata', color: 'hsl(262 58% 58%)' },
    }),
    []
  );

  const visibleAreas = useMemo(() => {
    if (debounced.activityType === 'all') {
      return Object.keys(chartConfig) as Array<keyof typeof chartConfig>;
    }
    return [debounced.activityType] as Array<keyof typeof chartConfig>;
  }, [debounced.activityType, chartConfig]);

  const downsampled = useMemo(() => lttb(filteredData, 600), [filteredData]);

  const weeklyFiltered = useMemo(() => {
    if (!weeklyData?.length) return [] as typeof weeklyData;
    if (timeRange === 'all') return weeklyData;
    return weeklyData.slice(-26);
  }, [weeklyData, timeRange]);

  const kpi = useMemo(() => {
    const sum = (key: keyof DataPoint) => filteredData.reduce((s, d) => s + (Number(d[key]) || 0), 0);
    return {
      distance: sum('corsa') + sum('nuoto') + sum('ciclismo'),
      run: sum('corsa'),
      swim: sum('nuoto'),
      ride: sum('ciclismo'),
      walk: sum('camminata'),
      sessions: filteredData.length,
    };
  }, [filteredData]);

  const last7 = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const windowData = stravaData.filter((d) => {
      const dDate = new Date(d.date);
      dDate.setHours(0, 0, 0, 0);
      return dDate >= start;
    });

    const sum = (key: keyof DataPoint) => windowData.reduce((s, x) => s + (Number(x[key]) || 0), 0);

    return {
      run: sum('corsa'),
      swim: sum('nuoto'),
      ride: sum('ciclismo'),
      walk: sum('camminata'),
    };
  }, [stravaData]);

  const hasNoActivities = !isLoading && stravaData.length === 0;

  return (
    <SaaSPage>
      <div className="mx-auto flex w-full flex-col gap-6">
        <SaaSHeader
          badge="Strava Connect"
          icon={<Activity className="h-3.5 w-3.5" />}
          title="Training Dashboard"
          subtitle="Panoramica multisport con trend, volumi e metriche recenti"
          actions={
            <>
              <HeaderMetric
                icon={<BarChart3 className="h-3.5 w-3.5" />}
                label="Sessioni"
                value={isLoading ? '...' : String(kpi.sessions)}
              />
              <HeaderMetric
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                label="Totale"
                value={isLoading ? '...' : `${(kpi.distance + kpi.walk).toFixed(1)} km`}
                highlight
              />
            </>
          }
        />

        {isLoading ? (
          <DashboardSkeleton />
        ) : hasNoActivities ? (
          <SaaSCard>
            <SaaSEmptyState
              icon={<Activity className="h-8 w-8" />}
              title="Nessuna attivita disponibile"
              description={
                hasPrimaryError
                  ? 'Il file dati principale non e stato caricato correttamente.'
                  : 'Non ci sono attivita da mostrare con i filtri correnti.'
              }
            />
            <div className="mt-4 flex justify-center">
              <Button variant="secondary" onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Ricarica
              </Button>
            </div>
          </SaaSCard>
        ) : (
          <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <SaaSCard className="overflow-visible" contentClassName="p-0">
                <Tab.Group>
                  <div
                    className="border-b border-border/70 px-5 pb-4 pt-5 sm:px-6 sm:pt-6"
                    style={cardInsetStyle}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="flex items-center gap-2 text-base font-semibold">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Performance
                        </h2>
                        <Tab.List className="inline-flex rounded-xl border border-border/70 bg-muted/70 p-1">
                          {['Giornaliero', 'Settimanale'].map((label) => (
                            <Tab
                              key={label}
                              className={({ selected }) =>
                                cn(
                                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none',
                                  selected
                                    ? 'bg-card text-foreground shadow-soft'
                                    : 'text-muted-foreground hover:text-foreground'
                                )
                              }
                            >
                              {label}
                            </Tab>
                          ))}
                        </Tab.List>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <FilterSelect<ActivityType>
                          value={activityType}
                          options={typeOptions}
                          onChange={setActivityType}
                          widthClassName="w-40"
                        />
                        <FilterSelect<FilterPeriod>
                          value={timeRange}
                          options={timeOptions}
                          onChange={setTimeRange}
                          widthClassName="w-44"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="min-h-[350px] p-4 sm:p-6" style={cardInsetStyle}>
                    <Tab.Panels className="h-full">
                      <Tab.Panel className="h-full">
                        {downsampled.length > 0 ? (
                          <ActivityAreaChart
                            data={downsampled}
                            series={chartConfig}
                            keys={visibleAreas}
                            animationKey={`${debounced.timeRange}-${debounced.activityType}-${downsampled.length}`}
                            animate
                            animationDuration={520}
                          />
                        ) : (
                          <SaaSEmptyState
                            icon={<Loader2 className="h-5 w-5" />}
                            title="Nessun dato nel periodo"
                            description="Prova a selezionare un intervallo temporale piu ampio."
                            className="min-h-[300px]"
                          />
                        )}
                      </Tab.Panel>

                      <Tab.Panel className="h-full">
                        {weeklyFiltered.length ? (
                          <WeeklyAggregatesChart
                            data={weeklyFiltered}
                            keys={['corsa', 'nuoto', 'ciclismo', 'camminata']}
                            series={chartConfig}
                          />
                        ) : (
                          <SaaSEmptyState
                            title="Nessun aggregato settimanale"
                            description="Il file aggregato non contiene settimane valide."
                            className="min-h-[300px]"
                          />
                        )}
                      </Tab.Panel>
                    </Tab.Panels>
                  </div>

                  <div className="grid grid-cols-2 border-t border-border/70 sm:grid-cols-4">
                    <BottomMetric label="Corsa (7g)" value={last7.run} color="hsl(198 78% 46%)" />
                    <BottomMetric label="Ciclismo (7g)" value={last7.ride} color="hsl(43 93% 52%)" />
                    <BottomMetric label="Nuoto (7g)" value={last7.swim} color="hsl(var(--primary))" />
                    <BottomMetric label="Camminata (7g)" value={last7.walk} color="hsl(262 58% 58%)" />
                  </div>
                </Tab.Group>
              </SaaSCard>
            </div>

            <div className="space-y-6 xl:col-span-4">
              {athleteStats ? (
                <SaaSCard contentClassName="p-0">
                  <div className="border-b border-border/70 px-5 pb-3 pt-5" style={cardInsetStyle}>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Timer className="h-4 w-4 text-primary" />
                      Statistiche atleta
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">Ultime 4 settimane e anno in corso</p>
                  </div>
                  <div className="p-5" style={cardInsetStyle}>
                    <AthleteStatsKPI stats={athleteStats} />
                  </div>
                </SaaSCard>
              ) : null}

              <SaaSCard contentClassName="p-0">
                <div className="border-b border-border/70 px-5 pb-3 pt-5" style={cardInsetStyle}>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Record personali
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">Migliori tempi recenti di corsa</p>
                </div>

                <div className="space-y-3 p-5" style={cardInsetStyle}>
                  {(() => {
                    const wanted = ['400m', '1k', '5k', '10k', '21k'];
                    const pick = (label: string) =>
                      (bestEfforts || []).filter((entry) => entry.label === label).sort((a, b) => a.time_s - b.time_s)[0];
                    const items = wanted.map((label) => ({ label, entry: pick(label) })).filter((item) => item.entry);

                    if (!items.length) {
                      return (
                        <SaaSEmptyState
                          title="Nessun record disponibile"
                          description="Carica il file best-efforts per vedere i migliori tempi."
                          className="min-h-[180px]"
                        />
                      );
                    }

                    return items.map(({ label, entry }) => (
                      <div
                        key={`${label}-${entry?.date}`}
                        className="flex items-center justify-between rounded-xl border border-border/70 bg-card/70 px-3 py-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-foreground">{label}</div>
                          <div className="text-xs text-muted-foreground">{new Date(entry!.date).toLocaleDateString('it-IT')}</div>
                        </div>
                        <div className="text-lg font-bold tracking-tight text-foreground">
                          {(() => {
                            const mins = Math.floor(entry!.time_s / 60);
                            const secs = Math.round(entry!.time_s % 60).toString().padStart(2, '0');
                            return `${mins}:${secs}`;
                          })()}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </SaaSCard>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SaaSCard contentClassName="p-0">
              <div className="border-b border-border/70 px-5 pb-3 pt-5" style={cardInsetStyle}>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Waves className="h-4 w-4 text-primary" />
                  Ultime nuotate
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Passo reale su 100m, pause escluse</p>
              </div>
              <div className="p-5" style={cardInsetStyle}>
                <SwimPacesTable swimPaces={swimPaces} />
              </div>
            </SaaSCard>

            <SaaSCard contentClassName="p-0">
              <div className="border-b border-border/70 px-5 pb-3 pt-5" style={cardInsetStyle}>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Heart className="h-4 w-4 text-red-500" />
                  Zone cardiache
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Distribuzione del tempo per zona HR</p>
              </div>
              <div className="p-5" style={cardInsetStyle}>
                {zonesSummary.length ? (
                  (() => {
                    const total = zonesSummary.reduce((acc, zone) => {
                      (zone.hr || []).forEach((sec, i) => {
                        acc[i] = (acc[i] || 0) + (sec || 0);
                      });
                      return acc;
                    }, [] as number[]);
                    const data = (total.length ? total : [0, 0, 0, 0, 0])
                      .slice(0, 5)
                      .map((seconds, index) => ({ zone: `Z${index + 1}`, seconds }));
                    return <ZonesDonut data={data} />;
                  })()
                ) : (
                  <SaaSEmptyState
                    title="Nessuna zona disponibile"
                    description="Aggiungi file zone-summary per visualizzare la distribuzione."
                    className="min-h-[220px]"
                  />
                )}
              </div>
            </SaaSCard>
          </div>
          </div>
        )}
      </div>
    </SaaSPage>
  );
};

type HeaderMetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
};

function HeaderMetric({ icon, label, value, highlight = false }: HeaderMetricProps) {
  return (
    <div
      className={cn(
        'min-w-[120px] rounded-xl border px-3 py-2.5',
        highlight ? 'border-primary/30 bg-primary/12' : 'border-border/70 bg-card/70'
      )}
    >
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className={cn('text-base font-bold tracking-tight', highlight ? 'text-primary' : 'text-foreground')}>{value}</div>
    </div>
  );
}

type BottomMetricProps = {
  label: string;
  value: number;
  color: string;
};

function BottomMetric({ label, value, color }: BottomMetricProps) {
  return (
    <div className="border-border/70 px-4 py-3 sm:[&:not(:last-child)]:border-r">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </div>
      <div className="text-lg font-semibold text-foreground">
        {Number.isFinite(value) ? value.toFixed(1) : '0.0'}
        <span className="ml-1 text-xs font-normal text-muted-foreground">km</span>
      </div>
    </div>
  );
}

type FilterSelectProps<T extends string> = {
  value: T;
  options: Array<{ id: T; name: string }>;
  onChange: (value: T) => void;
  widthClassName?: string;
};

function FilterSelect<T extends string>({ value, options, onChange, widthClassName }: FilterSelectProps<T>) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={cn('relative', widthClassName)}>
        <Listbox.Button className="flex h-10 w-full items-center justify-between rounded-xl border border-border/70 bg-card/80 px-3 text-left text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-ring/30">
          <span className="truncate">{options.find((option) => option.id === value)?.name}</span>
          <ChevronUpDownIcon className="h-4 w-4 text-muted-foreground" />
        </Listbox.Button>

        <Listbox.Options className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border/70 bg-popover/95 p-1 shadow-soft backdrop-blur-md focus:outline-none">
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option.id}
              className={({ active, selected }) =>
                cn(
                  'cursor-pointer rounded-lg px-3 py-2 text-sm',
                  active && 'bg-accent/15',
                  selected ? 'font-semibold text-foreground' : 'text-muted-foreground'
                )
              }
            >
              {option.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <SaaSCard className="xl:col-span-8" contentClassName="space-y-4">
          <SaaSSkeleton className="h-6 w-44" />
          <SaaSSkeleton className="h-[320px] w-full" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SaaSSkeleton className="h-16 w-full" />
            <SaaSSkeleton className="h-16 w-full" />
            <SaaSSkeleton className="h-16 w-full" />
            <SaaSSkeleton className="h-16 w-full" />
          </div>
        </SaaSCard>

        <div className="space-y-6 xl:col-span-4">
          <SaaSCard contentClassName="space-y-3">
            <SaaSSkeleton className="h-6 w-40" />
            <SaaSSkeleton className="h-28 w-full" />
          </SaaSCard>
          <SaaSCard contentClassName="space-y-3">
            <SaaSSkeleton className="h-6 w-36" />
            <SaaSSkeleton className="h-16 w-full" />
            <SaaSSkeleton className="h-16 w-full" />
            <SaaSSkeleton className="h-16 w-full" />
          </SaaSCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SaaSCard>
          <SaaSSkeleton className="h-56 w-full" />
        </SaaSCard>
        <SaaSCard>
          <SaaSSkeleton className="h-56 w-full" />
        </SaaSCard>
      </div>
    </div>
  );
}

export default DashboardPage;
