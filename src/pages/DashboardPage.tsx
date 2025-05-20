"use client";

import { AreaChart, Area, XAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, YAxis } from 'recharts';
import { useState, useMemo, useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TypeScript interface for chart data points
interface DataPoint {
  date: string; // Format: "YYYY-MM-DD"
  corsa?: number;  // Kilometers
  nuoto?: number;  // Kilometers
  ciclismo?: number; // Kilometers
  // Add other potential activities if needed
}

export type FilterPeriod = '7days' | '30days' | '90days' | '6months' | '1year' | 'all';

// Tipo di attività disponibili
export type ActivityType = 'all' | 'corsa' | 'nuoto' | 'ciclismo';

const DashboardPage = () => {
  console.log("DashboardPage: Rendering start");
  const [stravaData, setStravaData] = useState<DataPoint[]>([]);
  const [timeRange, setTimeRange] = useState("90d");
  const [activityType, setActivityType] = useState<ActivityType>("all");

  useEffect(() => {
    console.log("DashboardPage: Fetching Strava data");
    // Cache-busting query param to force fresh data
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
        console.log("DashboardPage: Strava data fetch failed, set to empty array");
      });
  }, []);

  const filteredData = useMemo(() => {
    console.log("DashboardPage: Calculating filteredData");
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return stravaData.filter(item => {
      // Filtra prima per data
      const isInTimeRange = new Date(item.date) >= startDate;
      
      // Se l'utente ha selezionato "all", non filtriamo per tipo di attività
      if (activityType === "all") return isInTimeRange;
      
      // Altrimenti, verifichiamo che il tipo di attività selezionato abbia un valore maggiore di 0
      return isInTimeRange && item[activityType] !== undefined && item[activityType]! > 0;
    });
  }, [stravaData, timeRange, activityType]);

  const chartConfig = {
    corsa: { label: "Corsa", color: "hsl(215, 100%, 60%)" },
    nuoto: { label: "Nuoto", color: "hsl(140, 100%, 40%)" },
    ciclismo: { label: "Ciclismo", color: "hsl(40, 100%, 50%)" },
  };
  
  // Aggiungo una funzione per determinare quali aree visualizzare in base al tipo di attività
  const visibleAreas = useMemo(() => {
    if (activityType === "all") {
      return Object.keys(chartConfig) as Array<keyof typeof chartConfig>;
    } else {
      return [activityType] as Array<keyof typeof chartConfig>;
    }
  }, [activityType, chartConfig]);
  
  // Debug: Check if we have data to display
  useEffect(() => {
    console.log("DashboardPage: Debug useEffect - Filtered Data:", filteredData);
    console.log("DashboardPage: Debug useEffect - Chart Config:", chartConfig);
    console.log("DashboardPage: Debug useEffect - Visible Areas:", visibleAreas);
  }, [filteredData, chartConfig, visibleAreas]);

  console.log("DashboardPage: Before return statement");
  return (
    <div className="container max-w-[1400px] mx-auto px-2 py-6 sm:px-4 sm:py-8 md:py-12 bg-background text-foreground animate-in fade-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-8">
        <div className="xl:col-span-12">
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-1">Dashboard Attività Sportive</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <p className="text-muted-foreground">Filtra le attività per intervallo di tempo e tipo</p>
              <div className="flex flex-wrap gap-3 items-center justify-end">
                <Select value={activityType} onValueChange={(value) => setActivityType(value as ActivityType)}>
                  <SelectTrigger className="w-[160px] rounded-lg" aria-label="Seleziona tipo di attività">
                    <SelectValue placeholder="Tutte le attività" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="rounded-lg">Tutte le attività</SelectItem>
                    <SelectItem value="corsa" className="rounded-lg">Corsa</SelectItem>
                    <SelectItem value="nuoto" className="rounded-lg">Nuoto</SelectItem>
                    <SelectItem value="ciclismo" className="rounded-lg">Ciclismo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[160px] rounded-lg" aria-label="Seleziona periodo">
                    <SelectValue placeholder="Last 3 months" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
                    <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                    <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <div className="aspect-auto h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(key => (
                        <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.1} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      minTickGap={32} 
                      tickFormatter={value => new Date(value).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      tickFormatter={value => `${value} km`}
                    />
                    <Tooltip 
                      labelFormatter={value => new Date(value).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      formatter={(value, name) => {
                        const keyName = name as keyof typeof chartConfig;
                        return [`${value} km`, chartConfig[keyName]?.label || name];
                      }}
                    />
                    <Legend 
                      formatter={(value) => {
                        const keyName = value as keyof typeof chartConfig;
                        return chartConfig[keyName]?.label || value;
                      }}
                    />
                    {visibleAreas.map(key => (
                      <Area 
                        key={key}
                        type="monotone"
                        dataKey={key}
                        strokeWidth={2}
                        stroke={chartConfig[key].color}
                        fillOpacity={1}
                        fill={`url(#fill${key})`}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
