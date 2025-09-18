type BestEffort = {
  date: string;
  type: 'run';
  label: string; // e.g., 5k
  dist_km: number;
  time_s: number;
  pace_s_per_km: number;
};

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.round(s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
}

export function BestEffortsList({ efforts }: { efforts: BestEffort[] }) {
  if (!efforts?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm font-medium mb-2">Best efforts (run)</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        {efforts.map((e, i) => (
          <div key={i} className="rounded-md border border-border/50 bg-background/50 p-2">
            <div className="text-xs text-muted-foreground">{e.label} • {e.date}</div>
            <div className="font-mono">{fmtTime(e.time_s)} ({fmtTime(e.pace_s_per_km)}/km)</div>
          </div>
        ))}
      </div>
    </div>
  );
}
