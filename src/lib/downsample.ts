// Simple Largest-Triangle-Three-Buckets (LTTB) downsampling for time-series
// Accepts array of { date: string, ...metrics }
export function lttb<T extends { date: string }>(data: T[], threshold = 500): T[] {
  const n = data.length;
  if (threshold >= n || threshold === 0) return data;
  const sampled: T[] = [];
  let a = 0;
  const bucketSize = (n - 2) / (threshold - 2);
  sampled.push(data[a]);
  for (let i = 0; i < threshold - 2; i++) {
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const avgRangeEndClamped = Math.min(avgRangeEnd, n);
    let avgX = 0, avgY = 0, count = 0;
    for (let j = avgRangeStart; j < avgRangeEndClamped; j++) {
      avgX += new Date(data[j].date).getTime();
      // sum all numeric keys for a combined magnitude (approximation for multi-series)
      const vals = Object.values(data[j]).filter(v => typeof v === 'number') as number[];
      avgY += vals.reduce((s, v) => s + v, 0);
      count++;
    }
    avgX /= count || 1;
    avgY /= count || 1;
    const rangeOffs = Math.floor(i * bucketSize) + 1;
    const rangeTo = Math.floor((i + 1) * bucketSize) + 1;
    let maxArea = -1;
    let nextA = rangeOffs;
    for (let j = rangeOffs; j < rangeTo; j++) {
      const ax = new Date(data[a].date).getTime();
      const ay = (Object.values(data[a]).filter(v => typeof v === 'number') as number[]).reduce((s, v) => s + v, 0);
      const bx = new Date(data[j].date).getTime();
      const by = (Object.values(data[j]).filter(v => typeof v === 'number') as number[]).reduce((s, v) => s + v, 0);
      const area = Math.abs((ax - avgX) * (by - ay) - (ax - bx) * (avgY - ay)) * 0.5;
      if (area > maxArea) {
        maxArea = area;
        nextA = j;
      }
    }
    sampled.push(data[nextA]);
    a = nextA;
  }
  sampled.push(data[n - 1]);
  return sampled;
}
