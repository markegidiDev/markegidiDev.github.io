import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

type ZoneSlice = {
  zone: string; // Z1..Z5
  seconds: number;
  color?: string;
};

export function ZonesDonut({ data, colors }: { data: ZoneSlice[]; colors?: string[] }) {
  const total = data.reduce((a, b) => a + b.seconds, 0) || 1;
  const palette = colors ?? ['#60a5fa', '#34d399', '#fbbf24', '#f97316', '#ef4444'];
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="seconds" nameKey="zone" cx="50%" cy="50%" innerRadius={60} outerRadius={90} strokeWidth={2}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${Math.round((v / total) * 100)}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
