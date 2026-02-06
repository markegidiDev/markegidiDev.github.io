import React from 'react';
import type { SegmentMetrics } from '@/lib/swimMath';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SegmentTableProps {
  segments: SegmentMetrics[];
}

const SegmentTable: React.FC<SegmentTableProps> = ({ segments }) => {
  const formatValue = (value: number | undefined, decimals = 2, unit = ''): string => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(decimals)}${unit}`;
  };

  const getKeyZoneBadge = (segment: string): React.ReactNode => {
    if (segment.startsWith('0-') || segment.includes('-15m')) {
      return <Badge variant="secondary" className="ml-2 text-xs">Start</Badge>;
    }
    if (segment.includes('-25m') && !segment.startsWith('0-')) {
      return <Badge variant="secondary" className="ml-2 text-xs">Turn</Badge>;
    }
    const match = segment.match(/(\d+)m$/);
    if (match) {
      const end = parseInt(match[1]);
      if (end === 50 || end === 100 || end === 200 || end === 400) {
        return <Badge variant="secondary" className="ml-2 text-xs">Finish</Badge>;
      }
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Segment</TableHead>
              <TableHead className="text-right">Distance (m)</TableHead>
              <TableHead className="text-right">Split (s)</TableHead>
              <TableHead className="text-right">Cumul. (s)</TableHead>
              <TableHead className="text-right">Velocity (m/s)</TableHead>
              <TableHead className="text-right">Strokes</TableHead>
              <TableHead className="text-right">SR (c/min)</TableHead>
              <TableHead className="text-right">Tempo (s/c)</TableHead>
              <TableHead className="text-right">DPS (cm/c)</TableHead>
              <TableHead className="text-right">SI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((seg, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {seg.segment}
                  {getKeyZoneBadge(seg.segment)}
                  {seg.notes && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      {seg.notes}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatValue(seg.distance, 0)}</TableCell>
                <TableCell className="text-right">{formatValue(seg.splitTime)}</TableCell>
                <TableCell className="text-right">{formatValue(seg.cumulativeTime)}</TableCell>
                <TableCell className="text-right">{formatValue(seg.velocity)}</TableCell>
                <TableCell className="text-right">
                  {seg.strokeCount !== undefined ? seg.strokeCount : 'N/A'}
                </TableCell>
                <TableCell className="text-right">{formatValue(seg.strokeRate, 1)}</TableCell>
                <TableCell className="text-right">{formatValue(seg.strokeTempo)}</TableCell>
                <TableCell className="text-right">{formatValue(seg.dps, 1)}</TableCell>
                <TableCell className="text-right">{formatValue(seg.strokeIndex)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SegmentTable;
