import { useMemo } from "react";

type ActivityTotal = {
  count: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
  achievement_count: number;
};

type AthleteStats = {
  biggest_ride_distance?: number;
  biggest_climb_elevation_gain?: number;
  recent_ride_totals?: ActivityTotal;
  recent_run_totals?: ActivityTotal;
  recent_swim_totals?: ActivityTotal;
  ytd_ride_totals?: ActivityTotal;
  ytd_run_totals?: ActivityTotal;
  ytd_swim_totals?: ActivityTotal;
  all_ride_totals?: ActivityTotal;
  all_run_totals?: ActivityTotal;
  all_swim_totals?: ActivityTotal;
};

export type { AthleteStats };

export function AthleteStatsKPI({ stats }: { stats: AthleteStats | null }) {
  const cards = useMemo(() => {
    if (!stats) return [] as Array<{ label: string; value: string; sub?: string }>;
    const fmtKm = (m?: number) => (m ? (m / 1000).toFixed(1) + " km" : "-");
    const fmtH = (s?: number) => (s ? (s / 3600).toFixed(1) + " h" : "-");
    return [
      { label: "Ride 4w", value: fmtKm(stats.recent_ride_totals?.distance), sub: fmtH(stats.recent_ride_totals?.moving_time) },
      { label: "Run 4w", value: fmtKm(stats.recent_run_totals?.distance), sub: fmtH(stats.recent_run_totals?.moving_time) },
      { label: "Swim 4w", value: fmtKm(stats.recent_swim_totals?.distance), sub: fmtH(stats.recent_swim_totals?.moving_time) },
      { label: "YTD Ride", value: fmtKm(stats.ytd_ride_totals?.distance) },
      { label: "YTD Run", value: fmtKm(stats.ytd_run_totals?.distance) },
      { label: "YTD Swim", value: fmtKm(stats.ytd_swim_totals?.distance) },
    ];
  }, [stats]);

  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl bg-black/20 border border-white/5 p-3.5 hover:bg-white/5 transition-colors">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{c.label}</div>
          <div className="text-xl font-bold text-white mt-1">{c.value}</div>
          {c.sub ? <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div> : null}
        </div>
      ))}
    </div>
  );
}
