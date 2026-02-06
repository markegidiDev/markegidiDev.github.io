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

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  };

  return (
    <div className="space-y-8 min-w-0">
      {/* Velocity vs Distance */}
      <div className="min-w-0">
        <h3 className="text-base font-semibold mb-4">Velocity vs Distance</h3>
        <div className="w-full min-w-0" style={{ height: 'clamp(200px, 40vw, 280px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={velocityData} margin={{ top: 5, right: 5, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="distance"
                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{ value: 'm/s', angle: -90, position: 'insideLeft', fontSize: 10 }}
                tick={{ fontSize: 10 }}
                width={40}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="velocity"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                name="Velocity (m/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Time vs Distance */}
      <div className="min-w-0">
        <h3 className="text-base font-semibold mb-4">Cumulative Time vs Distance</h3>
        <div className="w-full min-w-0" style={{ height: 'clamp(200px, 40vw, 280px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData} margin={{ top: 5, right: 5, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="distance"
                label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{ value: 'Time (s)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                tick={{ fontSize: 10 }}
                width={40}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="time"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
                name="Cumulative Time (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stroke Metrics (if available) */}
      {hasStrokes && (
        <>
          <div className="min-w-0">
            <h3 className="text-base font-semibold mb-4">Stroke Rate & DPS</h3>
            <div className="w-full min-w-0" style={{ height: 'clamp(200px, 40vw, 280px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strokeData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="segment" tick={{ fontSize: 10 }} />
                  <YAxis
                    yAxisId="left"
                    label={{ value: 'SR', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                    width={35}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'DPS', angle: 90, position: 'insideRight', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                    width={35}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
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
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold mb-4">Stroke Index</h3>
            <div className="w-full min-w-0" style={{ height: 'clamp(200px, 40vw, 280px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strokeData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="segment" tick={{ fontSize: 10 }} />
                  <YAxis
                    label={{ value: 'SI', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    tick={{ fontSize: 10 }}
                    width={40}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="strokeIndex"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-5))', r: 3 }}
                    name="Stroke Index"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SegmentCharts;
