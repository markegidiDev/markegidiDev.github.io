/**
 * @fileoverview World Aquatics Points calculations and swim race utilities
 * Official formula: P = 1000 × (B/T)³
 * where B = base time for 1000 points, T = time swum
 */

import baseTimesData from '@/data/worldAquaticsBaseTimes.json';

export type Course = 'SCM' | 'LCM';
export type Sex = 'M' | 'F';
export type EventKey = string; // e.g., "50_FREE", "100_BREAST"

interface BaseTimesStructure {
  baseTimes: {
    [course in Course]: {
      [sex in Sex]: {
        [eventKey: string]: number;
      };
    };
  };
}

const baseTimes = baseTimesData as BaseTimesStructure;

/**
 * Parse time string to seconds
 * Accepts formats: "ss.hh", "mm:ss.hh", "h:mm:ss.hh"
 */
export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(':');
  let seconds = 0;

  if (parts.length === 1) {
    // Just seconds: "31.45"
    seconds = parseFloat(parts[0]);
  } else if (parts.length === 2) {
    // Minutes and seconds: "1:31.45"
    const mins = parseInt(parts[0], 10);
    const secs = parseFloat(parts[1]);
    seconds = mins * 60 + secs;
  } else if (parts.length === 3) {
    // Hours, minutes, seconds: "1:05:31.45"
    const hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    const secs = parseFloat(parts[2]);
    seconds = hours * 3600 + mins * 60 + secs;
  } else {
    throw new Error(`Invalid time format: ${timeStr}`);
  }

  if (isNaN(seconds) || seconds <= 0) {
    throw new Error(`Invalid time value: ${timeStr}`);
  }

  return seconds;
}

/**
 * Format seconds to time string (mm:ss.hh or h:mm:ss.hh)
 */
export function formatSecondsToTime(seconds: number, includeHours = false): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (includeHours || hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toFixed(2).padStart(5, '0')}`;
  } else {
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
  }
}

/**
 * Get base time for an event
 */
export function getBaseTime(course: Course, sex: Sex, eventKey: EventKey): number {
  const baseTime = baseTimes.baseTimes[course]?.[sex]?.[eventKey];
  if (baseTime === undefined) {
    throw new Error(`Base time not found for ${course} ${sex} ${eventKey}`);
  }
  return baseTime;
}

/**
 * Compute World Aquatics Points
 * Formula: P = 1000 × (B/T)³
 * Points are TRUNCATED (not rounded) to integer
 */
export function computeWorldAquaticsPoints(time: number, baseTime: number): number {
  if (time <= 0 || baseTime <= 0) {
    throw new Error('Time and base time must be positive');
  }
  const points = 1000 * Math.pow(baseTime / time, 3);
  return Math.trunc(points); // Truncate, don't round
}

/**
 * Invert World Aquatics Points to get time
 * Initial calculation: T = B × (1000/P)^(1/3)
 * Then reduce by 0.01s until recalculation gives the desired points
 */
export function invertWorldAquaticsPoints(points: number, baseTime: number): number {
  if (points <= 0 || baseTime <= 0) {
    throw new Error('Points and base time must be positive');
  }

  // Initial calculation
  let time = baseTime * Math.pow(1000 / points, 1 / 3);

  // Refine by reducing 0.01s until we get the exact points
  let calculatedPoints = computeWorldAquaticsPoints(time, baseTime);
  
  while (calculatedPoints < points && time > 0.01) {
    time -= 0.01;
    calculatedPoints = computeWorldAquaticsPoints(time, baseTime);
  }

  return time;
}

/**
 * Segment data structure
 */
export interface Segment {
  startDistance: number; // meters
  endDistance: number;   // meters
  splitTime?: number;    // seconds for this segment
  cumulativeTime?: number; // total time to this point
  strokeCount?: number;  // cycles in this segment
  notes?: string;        // e.g., "turn zone", "underwater"
}

/**
 * Computed segment metrics
 */
export interface SegmentMetrics {
  segment: string;        // "0-15m"
  distance: number;       // meters
  splitTime: number;      // seconds
  cumulativeTime: number; // seconds
  velocity: number;       // m/s
  strokeCount?: number;
  strokeRate?: number;    // cycles/min
  strokeTempo?: number;   // s/cycle
  dps?: number;           // cm/cycle (distance per stroke)
  strokeIndex?: number;   // velocity * DPS(m)
  notes?: string;
}

/**
 * Normalize and validate segments
 * Fill in missing cumulative times or split times
 */
export function normalizeSegments(segments: Segment[], totalTime?: number): Segment[] {
  const normalized: Segment[] = [];
  let lastCumulative = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = { ...segments[i] };

    // If split is provided but not cumulative
    if (seg.splitTime !== undefined && seg.cumulativeTime === undefined) {
      seg.cumulativeTime = lastCumulative + seg.splitTime;
    }
    // If cumulative is provided but not split
    else if (seg.cumulativeTime !== undefined && seg.splitTime === undefined) {
      seg.splitTime = seg.cumulativeTime - lastCumulative;
    }
    // Both missing: error
    else if (seg.splitTime === undefined && seg.cumulativeTime === undefined) {
      throw new Error(`Segment ${i} missing both split and cumulative time`);
    }

    if (seg.cumulativeTime !== undefined) {
      lastCumulative = seg.cumulativeTime;
    }

    normalized.push(seg);
  }

  // Validate total time if provided
  if (totalTime !== undefined && normalized.length > 0) {
    const lastSeg = normalized[normalized.length - 1];
    if (lastSeg.cumulativeTime && Math.abs(lastSeg.cumulativeTime - totalTime) > 0.05) {
      throw new Error(
        `Segment times don't match total: ${lastSeg.cumulativeTime.toFixed(2)}s vs ${totalTime.toFixed(2)}s`
      );
    }
  }

  return normalized;
}

/**
 * Compute metrics for all segments
 */
export function computeSegmentMetrics(segments: Segment[]): SegmentMetrics[] {
  const normalized = normalizeSegments(segments);
  
  return normalized.map((seg) => {
    const distance = seg.endDistance - seg.startDistance;
    const splitTime = seg.splitTime!;
    const velocity = distance / splitTime;

    const metrics: SegmentMetrics = {
      segment: `${seg.startDistance}-${seg.endDistance}m`,
      distance,
      splitTime,
      cumulativeTime: seg.cumulativeTime!,
      velocity,
      notes: seg.notes,
    };

    // Stroke-based metrics
    if (seg.strokeCount !== undefined && seg.strokeCount > 0) {
      metrics.strokeCount = seg.strokeCount;
      metrics.strokeRate = (seg.strokeCount / splitTime) * 60; // cycles/min
      metrics.strokeTempo = splitTime / seg.strokeCount; // s/cycle
      metrics.dps = (distance / seg.strokeCount) * 100; // cm/cycle
      metrics.strokeIndex = velocity * (distance / seg.strokeCount); // velocity * DPS(m)
    }

    return metrics;
  });
}

/**
 * Generate default segments for Quick mode
 * Creates estimated segments based on event distance and typical race profiles
 */
export function generateDefaultSegments(
  eventDistance: number,
  totalTime: number
): Segment[] {
  const segments: Segment[] = [];

  // Sprint events (50m): 0-15 (start), 15-45 (swim), 45-50 (finish)
  if (eventDistance === 50) {
    const startSplit = totalTime * 0.30; // ~30% for start phase
    const midSplit = totalTime * 0.60;   // ~60% for mid
    const finishSplit = totalTime * 0.10; // ~10% for finish

    segments.push(
      { startDistance: 0, endDistance: 15, splitTime: startSplit, notes: 'Start + breakout' },
      { startDistance: 15, endDistance: 45, splitTime: midSplit, notes: 'Main swim' },
      { startDistance: 45, endDistance: 50, splitTime: finishSplit, notes: 'Finish' }
    );
  }
  // 100m: 0-15, 15-50, 50-65 (turn), 65-100
  else if (eventDistance === 100) {
    const split1 = totalTime * 0.28;
    const split2 = totalTime * 0.34;
    const split3 = totalTime * 0.12;
    const split4 = totalTime * 0.26;

    segments.push(
      { startDistance: 0, endDistance: 15, splitTime: split1, notes: 'Start' },
      { startDistance: 15, endDistance: 50, splitTime: split2, notes: 'First length' },
      { startDistance: 50, endDistance: 65, splitTime: split3, notes: 'Turn + push' },
      { startDistance: 65, endDistance: 100, splitTime: split4, notes: 'Second length' }
    );
  }
  // 200m: each 50m split
  else if (eventDistance === 200) {
    const split50 = totalTime / 4;
    for (let i = 0; i < 4; i++) {
      segments.push({
        startDistance: i * 50,
        endDistance: (i + 1) * 50,
        splitTime: split50 * (i === 0 ? 0.95 : i === 3 ? 1.05 : 1.0), // slight variation
        notes: i === 0 ? 'First 50' : i === 3 ? 'Last 50' : undefined,
      });
    }
  }
  // 400m: each 100m split
  else if (eventDistance === 400) {
    const split100 = totalTime / 4;
    for (let i = 0; i < 4; i++) {
      segments.push({
        startDistance: i * 100,
        endDistance: (i + 1) * 100,
        splitTime: split100,
      });
    }
  }
  // Longer events: every 100m
  else {
    const numSegments = Math.ceil(eventDistance / 100);
    const splitAvg = totalTime / numSegments;
    for (let i = 0; i < numSegments; i++) {
      const start = i * 100;
      const end = Math.min((i + 1) * 100, eventDistance);
      segments.push({
        startDistance: start,
        endDistance: end,
        splitTime: splitAvg * (end - start) / 100,
      });
    }
  }

  return normalizeSegments(segments, totalTime);
}

/**
 * Calculate difficulty level based on points gap
 * Returns qualitative assessment
 */
export function calculateDifficulty(
  currentPoints: number,
  targetPoints: number,
  currentTime: number,
  baseTime: number
): {
  deltaPoints: number;
  percentImprovement: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  description: string;
} {
  const deltaPoints = targetPoints - currentPoints;
  const targetTime = invertWorldAquaticsPoints(targetPoints, baseTime);
  const percentImprovement = ((currentTime - targetTime) / currentTime) * 100;

  let difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  let description: string;

  if (deltaPoints < 20) {
    difficulty = 'easy';
    description = 'Obiettivo raggiungibile con allenamento costante';
  } else if (deltaPoints < 50) {
    difficulty = 'medium';
    description = 'Richiede miglioramenti tecnici e fisici significativi';
  } else if (deltaPoints < 100) {
    difficulty = 'hard';
    description = 'Obiettivo ambizioso, richiede ciclo di allenamento lungo';
  } else {
    difficulty = 'very-hard';
    description = 'Miglioramento estremo, possibile solo con cambiamenti radicali';
  }

  // Add diminishing returns note for high-level swimmers
  if (currentPoints > 900) {
    description += '. Attenzione: diminishing returns significativi a questo livello.';
  }

  return {
    deltaPoints,
    percentImprovement,
    difficulty,
    description,
  };
}

/**
 * Performance data point for historical tracking
 */
export interface PerformancePoint {
  date: string; // ISO date
  time: number; // seconds
  points?: number;
  context?: string; // e.g., "taper", "training", "competition"
}

/**
 * Simple exponential decay model for time prediction
 * T(t) = T_infinity + (T_0 - T_infinity) * e^(-k*t)
 * where t is in days since first data point
 */
export function fitExponentialModel(
  history: PerformancePoint[],
  baseTime: number
): {
  T_infinity: number;
  T_0: number;
  k: number;
  r_squared: number;
} | null {
  if (history.length < 3) {
    return null; // Not enough data
  }

  // Sort by date
  const sorted = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Convert dates to days since first point
  const firstDate = new Date(sorted[0].date).getTime();
  const data = sorted.map((p) => ({
    t: (new Date(p.date).getTime() - firstDate) / (1000 * 60 * 60 * 24), // days
    time: p.time,
  }));

  // Initial guesses
  const T_0 = data[0].time;
  const T_infinity = baseTime * 1.05; // Start with 5% above base time
  
  // Simple gradient descent to fit k
  let k = 0.01; // initial guess
  let bestK = k;
  let bestSSE = Infinity;

  for (let iter = 0; iter < 100; iter++) {
    let sse = 0;
    for (const point of data) {
      const predicted = T_infinity + (T_0 - T_infinity) * Math.exp(-k * point.t);
      sse += Math.pow(point.time - predicted, 2);
    }

    if (sse < bestSSE) {
      bestSSE = sse;
      bestK = k;
    }

    // Try adjusting k
    k += 0.001;
    if (k > 0.5) break; // reasonable limit
  }

  // Calculate R²
  const meanTime = data.reduce((sum, d) => sum + d.time, 0) / data.length;
  const sst = data.reduce((sum, d) => sum + Math.pow(d.time - meanTime, 2), 0);
  const r_squared = 1 - (bestSSE / sst);

  return {
    T_infinity,
    T_0,
    k: bestK,
    r_squared,
  };
}

/**
 * Predict time to reach target based on historical data
 */
export function predictTimeToTarget(
  history: PerformancePoint[],
  targetTime: number,
  baseTime: number
): {
  estimatedDays: number;
  confidence: 'low' | 'medium' | 'high';
  model: ReturnType<typeof fitExponentialModel>;
} | null {
  const model = fitExponentialModel(history, baseTime);
  
  if (!model || model.r_squared < 0.5) {
    return null; // Model doesn't fit well
  }

  // Solve for t when T(t) = targetTime
  // targetTime = T_infinity + (T_0 - T_infinity) * e^(-k*t)
  // e^(-k*t) = (targetTime - T_infinity) / (T_0 - T_infinity)
  // -k*t = ln((targetTime - T_infinity) / (T_0 - T_infinity))
  // t = -ln((targetTime - T_infinity) / (T_0 - T_infinity)) / k

  if (targetTime < model.T_infinity) {
    // Target is faster than predicted limit
    return null;
  }

  const ratio = (targetTime - model.T_infinity) / (model.T_0 - model.T_infinity);
  if (ratio <= 0) {
    return null;
  }

  const estimatedDays = -Math.log(ratio) / model.k;

  let confidence: 'low' | 'medium' | 'high';
  if (model.r_squared > 0.9) {
    confidence = 'high';
  } else if (model.r_squared > 0.7) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    estimatedDays,
    confidence,
    model,
  };
}
