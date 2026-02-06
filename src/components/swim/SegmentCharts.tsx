import React from 'react';
import type { SegmentMetrics } from '@/lib/swimMath';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SegmentChartsProps {
  segments: SegmentMetrics[];
}

const SegmentCharts: React.FC<SegmentChartsProps> = ({ segments }) => {
  // Prepare data for velocity chart
  const velocityData = segments.map((seg) => ({
    segment: seg.segment,
    distance: seg.cumulativeTime, // x-axis: cumulative time
    velocity: seg.velocity,
  }));

  // Prepare data for cumulative time chart
  const cumulativeData = segments.map((seg) => ({
    segment: seg.segment,
    distance: (seg.segment.split('-')[1] || '').replace('m', ''),
    time: seg.cumulativeTime,
  }));

  // Prepare stroke metrics data (only if strokes present)
  const hasStrokes = segments.some((s) => s.strokeRate !== undefined);
  const strokeData = segments
    .filter((s) => s.strokeRate !== undefined)
    .map((seg) => ({
      segment: seg.segment,
      strokeRate: seg.strokeRate,
      dps: seg.dps,
      strokeIndex: seg.strokeIndex,
    }));

  return (
    <div className="space-y-8">
      {/* Velocity vs Distance */}
      <div className="rounded-lg border border-border p-4 bg-card">
        <h3 className="text-lg font-semibold mb-4">Velocity vs Distance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="distance"
              label={{ value: 'Cumulative Time (s)', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis
              label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="velocity"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Velocity (m/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Time vs Distance */}
      <div className="rounded-lg border border-border p-4 bg-card">
        <h3 className="text-lg font-semibold mb-4">Cumulative Time vs Distance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="distance"
              label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis
              label={{ value: 'Cumulative Time (s)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="time"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-2))' }}
              name="Cumulative Time (s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stroke Metrics (if available) */}
      {hasStrokes && (
        <>
          <div className="rounded-lg border border-border p-4 bg-card">
            <h3 className="text-lg font-semibold mb-4">Stroke Rate & DPS</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={strokeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="segment" className="text-xs" />
                <YAxis
                  yAxisId="left"
                  label={{ value: 'Stroke Rate (c/min)', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'DPS (cm/cycle)', angle: 90, position: 'insideRight' }}
                  className="text-xs"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="strokeRate"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Stroke Rate"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="dps"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="DPS"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border p-4 bg-card">
            <h3 className="text-lg font-semibold mb-4">Stroke Index</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={strokeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="segment" className="text-xs" />
                <YAxis
                  label={{ value: 'Stroke Index', angle: -90, position: 'insideLeft' }}
                  className="text-xs"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="strokeIndex"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-5))' }}
                  name="Stroke Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default SegmentCharts;
