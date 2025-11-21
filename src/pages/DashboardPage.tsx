"use client";

import { useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import TrafficLight, { type Direction } from '@/components/dashboard/TrafficLight';
import { ActivityAreaChart } from '@/components/charts/ActivityAreaChart';
import { lttb } from '@/lib/downsample';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { WeeklyAggregatesChart } from '@/components/charts/WeeklyAggregatesChart';
import { AthleteStatsKPI, type AthleteStats } from '@/components/dashboard/AthleteStatsKPI';
import { ZonesDonut } from '@/components/charts/ZonesDonut';
import { GdCard } from '@/components/ui/GdCard';
import { SwimPacesTable } from '@/components/dashboard/SwimPacesTable';

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
  const [swimPaces, setSwimPaces] = useState<Array<{ id: number; date: string; totalMeters: number; movingSeconds: number; pace100m: number; paceFormatted: string }>>([]);
  const [timeRange, setTimeRange] = useState<FilterPeriod>('90d');
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [selectedDirection, setSelectedDirection] = useState<Direction>('default'); // Stato iniziale per TrafficLight

  useEffect(() => {
    // Cache-busting query param per forzare aggiornamento
  fetch(`/strava-data.json?t=${Date.now()}`, { cache: 'no-store' })
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
  fetch(`/strava-aggregates.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setWeeklyData(Array.isArray(d) ? d : []))
      .catch(() => setWeeklyData([]));
    // Fetch athlete stats (optional)
  fetch(`/athlete-stats.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((d) => setAthleteStats(d))
      .catch(() => setAthleteStats(null));
    // Fetch best efforts (optional)
  fetch(`/best-efforts.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setBestEfforts(Array.isArray(d) ? d : []))
      .catch(() => setBestEfforts([]));
    // Fetch zones summary (optional)
    fetch(`/zones-summary.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setZonesSummary(Array.isArray(d) ? d : []))
      .catch(() => setZonesSummary([]));
    // Fetch swim paces (optional)
    fetch(`/swim-paces.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then((d) => setSwimPaces(Array.isArray(d) ? d : []))
      .catch(() => setSwimPaces([]));
  }, []);

  // Debounce dei filtri per ridurre i re-render
  const [debounced, setDebounced] = useState({ timeRange, activityType });
  useEffect(() => {
    const id = setTimeout(() => setDebounced({ timeRange, activityType }), 200);
    return () => clearTimeout(id);
  }, [timeRange, activityType]);

  const filteredData = useMemo(() => {
    const referenceDate = new Date();
    // Normalizziamo la data di riferimento a mezzanotte per evitare problemi di orario
    referenceDate.setHours(0, 0, 0, 0);

    let daysToSubtract = 90;
    if (debounced.timeRange === '30d') daysToSubtract = 30;
    else if (debounced.timeRange === '7d') daysToSubtract = 7;
    else if (debounced.timeRange === '6months') daysToSubtract = 180;
    else if (debounced.timeRange === '1year') daysToSubtract = 365;
    else if (debounced.timeRange === 'all') daysToSubtract = 3650; // 10 anni

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return stravaData.filter(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0); // Assicuriamoci che anche la data dell'item sia a mezzanotte
      
      const isInTimeRange = itemDate >= startDate;
      
      if (debounced.activityType === 'all') return isInTimeRange;
      return isInTimeRange && item[debounced.activityType] !== undefined && Number(item[debounced.activityType]) > 0;
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
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - 6); // Ultimi 7 giorni inclusi oggi
    
    const windowData = stravaData.filter(d => {
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
      sessions: windowData.length,
    };
  }, [stravaData]);

  return (
    <div className="container max-w-[1600px] mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-background text-foreground min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Panoramica delle attività sportive</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-full bg-gd-main border border-white/10 shadow-sm flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Sessioni</span>
                <span className="font-semibold">{kpi.sessions}</span>
             </div>
             <div className="px-4 py-2 rounded-full bg-gd-main border border-white/10 shadow-sm flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Totale Km</span>
                <span className="font-semibold">{(kpi.distance + kpi.walk).toFixed(1)}</span>
             </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Chart Section (2 cols) */}
          <div className="xl:col-span-2">
            <GdCard className="h-full" contentClassName="p-0 flex flex-col h-full">
               <Tab.Group>
                 {/* Card Header with Controls */}
                 <div className="p-4 md:p-6 border-b border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <h2 className="text-lg font-semibold">Performance</h2>
                       <Tab.List className="flex bg-black/20 rounded-lg p-1">
                          {['Giornaliero', 'Settimanale'].map(label => (
                             <Tab key={label} className={({ selected }) => `px-3 py-1 text-xs font-medium rounded-md transition-all focus:outline-none ${selected ? 'bg-gd-magenta-2 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}>
                                {label}
                             </Tab>
                          ))}
                       </Tab.List>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex gap-2">
                       <Listbox value={activityType} onChange={setActivityType}>
                          <div className="relative w-32 md:w-40">
                             <Listbox.Button className="w-full bg-black/20 border border-white/5 rounded-lg py-1.5 px-3 text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between">
                                <span className="block truncate">{typeOptions.find(o => o.id === activityType)?.name}</span>
                                <ChevronUpDownIcon className="h-4 w-4 text-muted-foreground" />
                             </Listbox.Button>
                             <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1f2023] border border-white/10 py-1 text-sm shadow-xl focus:outline-none">
                                {typeOptions.map((opt) => (
                                   <Listbox.Option key={opt.id} value={opt.id} className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-white/5 text-white' : 'text-gray-300'}`}>
                                      {opt.name}
                                   </Listbox.Option>
                                ))}
                             </Listbox.Options>
                          </div>
                       </Listbox>

                       <Listbox value={timeRange} onChange={setTimeRange}>
                          <div className="relative w-36 md:w-44">
                             <Listbox.Button className="w-full bg-black/20 border border-white/5 rounded-lg py-1.5 px-3 text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between">
                                <span className="block truncate">{timeOptions.find(o => o.id === timeRange)?.name}</span>
                                <ChevronUpDownIcon className="h-4 w-4 text-muted-foreground" />
                             </Listbox.Button>
                             <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1f2023] border border-white/10 py-1 text-sm shadow-xl focus:outline-none">
                                {timeOptions.map((opt) => (
                                   <Listbox.Option key={opt.id} value={opt.id} className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-white/5 text-white' : 'text-gray-300'}`}>
                                      {opt.name}
                                   </Listbox.Option>
                                ))}
                             </Listbox.Options>
                          </div>
                       </Listbox>
                    </div>
                 </div>

                 {/* Chart Content */}
                 <div className="p-4 md:p-6 flex-1 min-h-[350px]">
                    <Tab.Panels className="h-full">
                       <Tab.Panel className="h-full">
                          {downsampled.length > 0 ? (
                            <ActivityAreaChart
                              data={downsampled}
                              series={chartConfig}
                              keys={visibleAreas}
                              animationKey={`${debounced.timeRange}-${debounced.activityType}-${downsampled.length}`}
                              animate={true}
                              animationDuration={500}
                            />
                          ) : (
                            <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-2">
                              <p>Nessuna attività trovata in questo periodo.</p>
                              <p className="text-xs opacity-50">Prova a selezionare un intervallo più ampio.</p>
                            </div>
                          )}
                       </Tab.Panel>
                       <Tab.Panel className="h-full">
                          {weeklyFiltered.length ? (
                            <WeeklyAggregatesChart data={weeklyFiltered} keys={["corsa","nuoto","ciclismo","camminata"]} series={chartConfig} />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">Nessun dato settimanale disponibile</div>
                          )}
                       </Tab.Panel>
                    </Tab.Panels>
                 </div>

                 {/* Footer Metrics (Last 7 Days) */}
                 <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 divide-x divide-white/5 bg-black/10">
                    <div className="p-4 text-center md:text-left">
                       <div className="text-xs text-muted-foreground mb-1">Corsa (7g)</div>
                       <div className="text-xl font-bold text-white">{Number.isFinite(last7.run) ? last7.run.toFixed(1) : '0.0'} <span className="text-xs font-normal text-muted-foreground">km</span></div>
                    </div>
                    <div className="p-4 text-center md:text-left">
                       <div className="text-xs text-muted-foreground mb-1">Ciclismo (7g)</div>
                       <div className="text-xl font-bold text-white">{Number.isFinite(last7.ride) ? last7.ride.toFixed(1) : '0.0'} <span className="text-xs font-normal text-muted-foreground">km</span></div>
                    </div>
                    <div className="p-4 text-center md:text-left">
                       <div className="text-xs text-muted-foreground mb-1">Nuoto (7g)</div>
                       <div className="text-xl font-bold text-white">{Number.isFinite(last7.swim) ? last7.swim.toFixed(1) : '0.0'} <span className="text-xs font-normal text-muted-foreground">km</span></div>
                    </div>
                    <div className="p-4 text-center md:text-left">
                       <div className="text-xs text-muted-foreground mb-1">Camminata (7g)</div>
                       <div className="text-xl font-bold text-white">{Number.isFinite(last7.walk) ? last7.walk.toFixed(1) : '0.0'} <span className="text-xs font-normal text-muted-foreground">km</span></div>
                    </div>
                 </div>
               </Tab.Group>
            </GdCard>
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
             {/* Athlete Stats */}
             {athleteStats && (
                <GdCard contentClassName="p-6">
                   <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Statistiche Atleta</h3>
                   <AthleteStatsKPI stats={athleteStats} />
                </GdCard>
             )}

             {/* Best Efforts */}
             <GdCard contentClassName="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Record Personali</h3>
                <div className="space-y-3">
                  {(() => {
                    const want = ['400m','1k','5k','10k','21k'];
                    const pick = (label: string) => (bestEfforts || []).filter(e => e.label === label).sort((a,b) => a.time_s - b.time_s)[0];
                    const items = want.map(l => ({ label: l, entry: pick(l) })).filter(x => x.entry);
                    
                    if (!items.length) return <div className="text-sm text-muted-foreground">Nessun record trovato</div>;
                    
                    return items.map(({ label, entry }, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground font-medium uppercase">{label}</span>
                           <span className="text-xs text-muted-foreground/60">{new Date(entry!.date).toLocaleDateString('it-IT')}</span>
                        </div>
                        <div className="text-lg font-bold font-mono text-white">
                          {(() => {
                            const m = Math.floor(entry!.time_s / 60);
                            const s = Math.round(entry!.time_s % 60).toString().padStart(2,'0');
                            return `${m}:${s}`;
                          })()}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
             </GdCard>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Swim Paces */}
           <GdCard contentClassName="p-0 overflow-hidden h-full">
              <div className="p-4 border-b border-white/5 bg-black/10">
                 <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Ultime Nuotate</h3>
              </div>
              <div className="p-4">
                 <SwimPacesTable swimPaces={swimPaces} />
              </div>
           </GdCard>

           {/* Zones */}
           <GdCard contentClassName="p-6 h-full">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Zone Cardiache / Potenza</h3>
              {zonesSummary?.length ? (
                (() => {
                  const total = (zonesSummary || []).reduce((acc, z) => {
                    const hr = z.hr || [];
                    hr.forEach((sec, i) => { acc[i] = (acc[i] || 0) + (sec || 0); });
                    return acc;
                  }, [] as number[]);
                  const data = (total.length ? total : [0,0,0,0,0]).slice(0,5).map((s, i) => ({ zone: `Z${i+1}`, seconds: s }));
                  return <ZonesDonut data={data} />;
                })()
              ) : (
                <div className="text-muted-foreground text-sm">Nessun dato zone disponibile</div>
              )}
           </GdCard>
        </div>
        
        {/* Debug / Extra */}
        <div className="flex justify-center pt-8 opacity-50 hover:opacity-100 transition-opacity">
           <TrafficLight selectedDirection={selectedDirection} onDirectionChange={setSelectedDirection} />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
