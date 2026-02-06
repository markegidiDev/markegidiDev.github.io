/**
 * Unit tests for swimMath.ts
 * Run with: npm test (if you have a test runner configured)
 * Or manually verify the calculations
 */

import {
  parseTimeToSeconds,
  formatSecondsToTime,
  computeWorldAquaticsPoints,
  invertWorldAquaticsPoints,
  getBaseTime,
  normalizeSegments,
  computeSegmentMetrics,
  generateDefaultSegments,
  calculateDifficulty,
} from '../src/lib/swimMath';

// Test parseTimeToSeconds
console.log('Testing parseTimeToSeconds...');
console.assert(parseTimeToSeconds('31.45') === 31.45, 'Failed: 31.45');
console.assert(parseTimeToSeconds('1:05.30') === 65.30, 'Failed: 1:05.30');
console.assert(Math.abs(parseTimeToSeconds('15:32.18') - 932.18) < 0.01, 'Failed: 15:32.18');
console.log('✓ parseTimeToSeconds tests passed');

// Test formatSecondsToTime
console.log('\nTesting formatSecondsToTime...');
console.assert(formatSecondsToTime(31.45) === '0:31.45', 'Failed: 31.45');
console.assert(formatSecondsToTime(65.30) === '1:05.30', 'Failed: 65.30');
console.assert(formatSecondsToTime(3732.18, true) === '1:02:12.18', 'Failed: 3732.18 with hours');
console.log('✓ formatSecondsToTime tests passed');

// Test World Aquatics Points calculation
console.log('\nTesting World Aquatics Points...');
// Example: 50m Free SCM Men, base time = 20.16s
const baseTime50Free = 20.16;

// Test 1: Exactly 1000 points (time = base time)
const points1000 = computeWorldAquaticsPoints(20.16, baseTime50Free);
console.assert(points1000 === 1000, `Failed: Expected 1000, got ${points1000}`);

// Test 2: Faster time should give more points
const points21s = computeWorldAquaticsPoints(21.00, baseTime50Free);
console.assert(points21s < 1000, `Failed: Slower time should have fewer points, got ${points21s}`);
console.log(`21.00s = ${points21s} points (should be < 1000)`);

// Test 3: Verify truncation (not rounding)
const points20_5 = computeWorldAquaticsPoints(20.50, baseTime50Free);
console.log(`20.50s = ${points20_5} points (truncated)`);

// Test 4: Invert points to time
const time1000 = invertWorldAquaticsPoints(1000, baseTime50Free);
console.assert(Math.abs(time1000 - baseTime50Free) < 0.01, 'Failed: Invert 1000 points');
console.log(`1000 points → ${time1000.toFixed(2)}s (should be ~20.16)`);

const time950 = invertWorldAquaticsPoints(950, baseTime50Free);
console.log(`950 points → ${time950.toFixed(2)}s`);
const verifyPoints = computeWorldAquaticsPoints(time950, baseTime50Free);
console.assert(verifyPoints === 950, `Failed: Round-trip 950 points, got ${verifyPoints}`);

console.log('✓ World Aquatics Points tests passed');

// Test getBaseTime
console.log('\nTesting getBaseTime...');
const bt = getBaseTime('SCM', 'M', '50_FREE');
console.assert(bt === 20.16, `Failed: Expected 20.16, got ${bt}`);
console.log('✓ getBaseTime tests passed');

// Test normalizeSegments
console.log('\nTesting normalizeSegments...');
const segments = [
  { startDistance: 0, endDistance: 15, splitTime: 5.0 },
  { startDistance: 15, endDistance: 50, splitTime: 10.5 },
];
const normalized = normalizeSegments(segments);
console.assert(normalized[0].cumulativeTime === 5.0, 'Failed: cumulative time seg 1');
console.assert(normalized[1].cumulativeTime === 15.5, 'Failed: cumulative time seg 2');
console.log('✓ normalizeSegments tests passed');

// Test computeSegmentMetrics
console.log('\nTesting computeSegmentMetrics...');
const metrics = computeSegmentMetrics(segments);
console.assert(metrics[0].velocity === 15 / 5.0, 'Failed: velocity calculation');
console.assert(metrics[1].distance === 35, 'Failed: distance calculation');
console.log('✓ computeSegmentMetrics tests passed');

// Test generateDefaultSegments
console.log('\nTesting generateDefaultSegments...');
const defaultSegs = generateDefaultSegments(50, 25.0);
console.assert(defaultSegs.length > 0, 'Failed: should generate segments');
const totalTime = defaultSegs.reduce((sum, seg) => sum + (seg.splitTime || 0), 0);
console.assert(Math.abs(totalTime - 25.0) < 0.01, `Failed: total time should be 25.0, got ${totalTime}`);
console.log('✓ generateDefaultSegments tests passed');

// Test calculateDifficulty
console.log('\nTesting calculateDifficulty...');
const currentPoints = 950;
const targetPoints = 1000;
const currentTime = 20.50;
const difficulty = calculateDifficulty(currentPoints, targetPoints, currentTime, baseTime50Free);
console.assert(difficulty.deltaPoints === 50, 'Failed: deltaPoints');
console.assert(difficulty.percentImprovement > 0, 'Failed: percentImprovement should be positive');
console.log(`Difficulty: ${difficulty.difficulty}, Δ${difficulty.deltaPoints} points, ${difficulty.percentImprovement.toFixed(2)}%`);
console.log('✓ calculateDifficulty tests passed');

console.log('\n✅ All tests passed!');

export {};
