"use client";

import { useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import TrafficLight, { type Direction } from '@/components/dashboard/TrafficLight';
import { ActivityAreaChart } from '@/components/charts/ActivityAreaChart';
import { lttb } from '@/lib/downsample';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { WeeklyAggregatesChart } from '@/components/charts/WeeklyAggregatesChart';
import { AthleteStatsKPI, type AthleteStats } from '@/components/dashboard/AthleteStatsKPI';
import { ZonesDonut } from '@/components/charts/ZonesDonut';
import { GdCard } from '@/components/ui/GdCard';

// TypeScript interface for chart data points
interface DataPoint {
  date: string; // Format: "YYYY-MM-DD"
  corsa?: number;  // Kilometers
  nuoto?: number;  // Kilometers
  ciclismo?: number; // Kilometers
  camminata?: number; // Kilometers (Walk/Hike)
  // Add other potential activities if needed
  [key: string]: string | number | undefined;
}

export type FilterPeriod = '7d' | '30d' | '90d' | '6months' | '1year' | 'all';

// Tipo di attività disponibili
export type ActivityType = 'all' | 'corsa' | 'nuoto' | 'ciclismo' | 'camminata';

const DashboardPage = () => {
  const [stravaData, setStravaData] = useState<DataPoint[]>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{ week: string; corsa?: number; nuoto?: number; ciclismo?: number; camminata?: number }>>([]);
  const [athleteStats, setAthleteStats] = useState<AthleteStats | null>(null);
  const [bestEfforts, setBestEfforts] = useState<Array<{ date: string; type: 'run'; label: string; dist_km: number; time_s: number; pace_s_per_km: number }>>([]);
  const [zonesSummary, setZonesSummary] = useState<Array<{ id: number; sport: string; hr?: number[]; power?: number[] }>>([]);
  const [timeRange, setTimeRange] = useState<FilterPeriod>('90d');
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [selectedDirection, setSelectedDirection] = useState<Direction>('default'); // Stato iniziale per TrafficLight

  useEffect(() => {
    // Cache-busting query param per forzare aggiornamento
    fetch(`/strava-data.json?t=${Date.now()}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: DataPoint[]) => {
        const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setStravaData(sortedData);
      })
      .catch(error => {
        console.error("Could not fetch Strava data:", error);
        setStravaData([]);
      });
    // Fetch weekly aggregates (optional)
    fetch(`/strava-aggregates.json?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setWeeklyData(Array.isArray(d) ? d : []))
      .catch(() => setWeeklyData([]));
    // Fetch athlete stats (optional)
    fetch(`/athlete-stats.json?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : null))
      .then((d) => setAthleteStats(d))
      .catch(() => setAthleteStats(null));
    // Fetch best efforts (optional)
    fetch(`/best-efforts.json?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setBestEfforts(Array.isArray(d) ? d : []))
      .catch(() => setBestEfforts([]));
    // Fetch zones summary (optional)
    fetch(`/zones-summary.json?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setZonesSummary(Array.isArray(d) ? d : []))
      .catch(() => setZonesSummary([]));
  }, []);

  // Debounce dei filtri per ridurre i re-render
  const [debounced, setDebounced] = useState({ timeRange, activityType });
  useEffect(() => {
    const id = setTimeout(() => setDebounced({ timeRange, activityType }), 200);
    return () => clearTimeout(id);
  }, [timeRange, activityType]);

  const filteredData = useMemo(() => {
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (debounced.timeRange === '30d') daysToSubtract = 30;
    else if (debounced.timeRange === '7d') daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return stravaData.filter(item => {
      // Filtra per data
      const isInTimeRange = new Date(item.date) >= startDate;
      // Se l'utente ha selezionato "all", non filtriamo per tipo di attività
      if (debounced.activityType === 'all') return isInTimeRange;
      // Altrimenti, verifichiamo che il tipo di attività selezionato abbia valore > 0 in quel giorno
      return isInTimeRange && item[debounced.activityType] !== undefined && item[debounced.activityType]! > 0;
    });
  }, [stravaData, debounced]);

  const chartConfig = useMemo(() => ({
    corsa: { label: "Corsa", color: "hsl(215, 100%, 60%)" },
    nuoto: { label: "Nuoto", color: "hsl(140, 100%, 40%)" },
    ciclismo: { label: "Ciclismo", color: "hsl(40, 100%, 50%)" },
    camminata: { label: "Camminata", color: "hsl(290, 70%, 55%)" },
  }), []);

  const visibleAreas = useMemo(() => {
    if (debounced.activityType === 'all') {
      return Object.keys(chartConfig) as Array<keyof typeof chartConfig>;
    } else {
      return [debounced.activityType] as Array<keyof typeof chartConfig>;
    }
  }, [debounced.activityType, chartConfig]);

  // Precalcolo dei dati campionati per performance (utilizza algoritmo LTTB)
  const downsampled = useMemo(() => lttb(filteredData, 600), [filteredData]);

  // Weekly view: optionally filter to last ~26 weeks if timeRange is not 'all'
  const weeklyFiltered = useMemo(() => {
    if (!weeklyData?.length) return [] as typeof weeklyData;
    if (timeRange === 'all') return weeklyData;
    const max = 26;
    return weeklyData.slice(-max);
  }, [weeklyData, timeRange]);

  const timeOptions = [
    { id: '1year', name: 'Ultimo anno' },
    { id: '6months', name: 'Ultimi 6 mesi' },
    { id: '90d', name: 'Ultimi 90 giorni' },
    { id: '30d', name: 'Ultimi 30 giorni' },
    { id: '7d', name: 'Ultimi 7 giorni' },
    { id: 'all', name: 'Tutte le attività' },
  ];

  const typeOptions = [
    { id: 'all', name: 'Tutte le attività' },
    { id: 'corsa', name: 'Corsa' },
    { id: 'nuoto', name: 'Nuoto' },
    { id: 'ciclismo', name: 'Ciclismo' },
    { id: 'camminata', name: 'Camminata' },
  ];

  // Calcolo KPI (metriche totali sul range filtrato)
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

  // Totali ultimi 7 giorni per "mini tiles" della card performance
  const last7 = useMemo(() => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 7);
    const windowData = stravaData.filter(d => new Date(d.date) >= start);
    const sum = (key: keyof DataPoint) => windowData.reduce((s, x) => s + (Number(x[key]) || 0), 0);
    return {
      run: sum('corsa'),
      swim: sum('nuoto'),
      ride: sum('ciclismo'),
      walk: sum('camminata'),
      sessions: windowData.length,
    };
  }, [stravaData]);

  return (
    <div className="container max-w-[1400px] mx-auto px-4 py-6 sm:px-6 sm:py-8 md:py-12 bg-background text-foreground">
      <div className="space-y-6 md:space-y-8">
        {/* Top header KPI bar */}
        <GdCard contentClassName="p-4 md:p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-medium">Dashboard Attività Sportive</h2>
            <div className="flex gap-3 text-sm">
              <div className="px-3 py-1 rounded-full bg-gd-main neumorphism-border-1">Sessioni: {kpi.sessions}</div>
              <div className="px-3 py-1 rounded-full bg-gd-main neumorphism-border-1">Totale: {(kpi.distance + kpi.walk).toFixed(1)} km</div>
            </div>
          </div>
        </GdCard>

        {/* Main two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left: Summary + Filters + Athlete Stats */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            <GdCard className="overflow-visible" contentClassName="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-muted-foreground text-sm md:text-base">
                  Filtra per intervallo di tempo e tipo
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-end">
                  <div className="relative w-[200px]">
                    <Listbox value={activityType} onChange={setActivityType}>
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gd-main border border-transparent neumorphism-border-1 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d55]/60">
                        <span className="block truncate">{typeOptions.find((opt) => opt.id === activityType)?.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gd-main border border-transparent neumorphism-border-2 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                        {typeOptions.map((opt) => (
                          <Listbox.Option key={opt.id} className={({ active }) => `relative cursor-default select-none py-1.5 pl-8 pr-4 ${active ? 'bg-gd-divider text-foreground' : 'text-foreground'}`} value={opt.id}>
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{opt.name}</span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                  <div className="relative w-[200px]">
                    <Listbox value={timeRange} onChange={setTimeRange}>
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gd-main border border-transparent neumorphism-border-1 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d55]/60">
                        <span className="block truncate">{timeOptions.find((opt) => opt.id === timeRange)?.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gd-main border border-transparent neumorphism-border-2 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                        {timeOptions.map((opt) => (
                          <Listbox.Option key={opt.id} className={({ active }) => `relative cursor-default select-none py-1.5 pl-8 pr-4 ${active ? 'bg-gd-divider text-foreground' : 'text-foreground'}`} value={opt.id}>
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{opt.name}</span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                </div>
              </div>
            </GdCard>
            {athleteStats ? <GdCard contentClassName="p-4"><AthleteStatsKPI stats={athleteStats} /></GdCard> : null}
          </div>

          {/* Right: Performance by type with segmented tabs */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            <GdCard contentClassName="p-4">
              <Tab.Group>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-base md:text-lg font-medium">Performance per tipo</div>
                  <Tab.List className="flex gap-2">
                    {['Giornaliero', 'Settimanale'].map(label => (
                      <Tab key={label} className={({ selected }) => `px-3 py-1.5 text-sm font-medium rounded-full focus:outline-none transition-colors ${selected ? 'bg-gd-magenta-2 text-white shadow-magenta-btn' : 'bg-gd-main text-muted-foreground hover:bg-gd-divider'}`}>
                        {label}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels>
                  <Tab.Panel>
                    <ActivityAreaChart
                      data={downsampled}
                      series={chartConfig}
                      keys={visibleAreas}
                      animationKey={`${debounced.timeRange}-${debounced.activityType}-${downsampled.length}`}
                      animate={true}
                      animationDuration={500}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    {weeklyFiltered.length ? (
                      <WeeklyAggregatesChart data={weeklyFiltered} keys={["corsa","nuoto","ciclismo","camminata"]} series={chartConfig} />
                    ) : (
                      <div className="text-muted-foreground">Nessun dato settimanale disponibile</div>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>

              {/* Mini tiles - last 7 days */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gd-main neumorphism-border-1 p-3">
                  <div className="text-xs text-muted-foreground">Corsa (7g)</div>
                  <div className="text-lg font-semibold">{Number.isFinite(last7.run) ? last7.run.toFixed(1) : '0.0'} km</div>
                </div>
                <div className="rounded-xl bg-gd-main neumorphism-border-1 p-3">
                  <div className="text-xs text-muted-foreground">Ciclismo (7g)</div>
                  <div className="text-lg font-semibold">{Number.isFinite(last7.ride) ? last7.ride.toFixed(1) : '0.0'} km</div>
                </div>
                <div className="rounded-xl bg-gd-main neumorphism-border-1 p-3">
                  <div className="text-xs text-muted-foreground">Nuoto (7g)</div>
                  <div className="text-lg font-semibold">{Number.isFinite(last7.swim) ? last7.swim.toFixed(1) : '0.0'} km</div>
                </div>
                <div className="rounded-xl bg-gd-main neumorphism-border-1 p-3">
                  <div className="text-xs text-muted-foreground">Camminata (7g)</div>
                  <div className="text-lg font-semibold">{Number.isFinite(last7.walk) ? last7.walk.toFixed(1) : '0.0'} km</div>
                </div>
              </div>
            </GdCard>
          </div>
        </div>

        {/* Bottom: Records + Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div>
            {(() => {
              const want = ['400m','1k','5k','10k','21k'];
              const pick = (label: string) => (bestEfforts || []).filter(e => e.label === label).sort((a,b) => a.time_s - b.time_s)[0];
              const items = want.map(l => ({ label: l, entry: pick(l) })).filter(x => x.entry);
              if (!items.length) return null;
              return (
                <GdCard contentClassName="p-4">
                  <div className="text-sm font-medium mb-2">Best Times</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {items.map(({ label, entry }, idx) => (
                      <div key={idx} className="rounded-xl bg-gd-main neumorphism-border-1 p-3">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="text-lg font-semibold">
                          {(() => {
                            const m = Math.floor(entry!.time_s / 60);
                            const s = Math.round(entry!.time_s % 60).toString().padStart(2,'0');
                            return `${m}:${s}`;
                          })()}
                        </div>
                        <div className="text-xs text-muted-foreground">{new Date(entry!.date).toLocaleDateString('it-IT')}</div>
                      </div>
                    ))}
                  </div>
                </GdCard>
              );
            })()}
          </div>
          <div>
            {zonesSummary?.length ? (
              <GdCard contentClassName="p-4">
                <div className="text-sm font-medium mb-2">Distribuzione zone (ultime attività)</div>
                {(() => {
                  const total = (zonesSummary || []).reduce((acc, z) => {
                    const hr = z.hr || [];
                    hr.forEach((sec, i) => { acc[i] = (acc[i] || 0) + (sec || 0); });
                    return acc;
                  }, [] as number[]);
                  const data = (total.length ? total : [0,0,0,0,0]).slice(0,5).map((s, i) => ({ zone: `Z${i+1}`, seconds: s }));
                  return <ZonesDonut data={data} />;
                })()}
              </GdCard>
            ) : null}
          </div>
        </div>

        {/* Optional: TrafficLight demo */}
        <GdCard className="max-w-[600px] mx-auto" contentClassName="p-4">
          <TrafficLight selectedDirection={selectedDirection} onDirectionChange={setSelectedDirection} />
        </GdCard>
      </div>
    </div>
  );
};

export default DashboardPage;
