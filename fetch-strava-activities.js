import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;       
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET; 
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN; 

// Function to get a new access token
async function getAccessToken() {
  try {
    console.log('Requesting new access token from Strava...');
    const response = await axios.post('https://www.strava.com/api/v3/oauth/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token'
    });
    console.log('Access token received.');
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    throw error; // Re-throw to be caught by the main execution block
  }
}

// Function to fetch activities (paginated)
async function getActivities(token) {
  // Calculate the timestamp for one year ago from today
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

  console.log(`Fetching activities since: ${oneYearAgo.toISOString().split('T')[0]}`);

  const perPage = 200;
  let page = 1;
  const all = [];
  while (true) {
    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: { Authorization: `Bearer ${token}` },
      params: { after: oneYearAgoTimestamp, per_page: perPage, page },
    });
    const batch = response.data || [];
    console.log(`Fetched page ${page} with ${batch.length} activities.`);
    all.push(...batch);
    if (batch.length < perPage) break; // last page
    page += 1;
  }
  console.log(`Total fetched activities: ${all.length}`);
  return all;
}

// Process raw activities into daily stacked series for chart
function processActivitiesForChart(activities) {
  const aggregatedData = {}; // Use an object for easier aggregation by date

  (activities || []).forEach((act) => {
    if (!act.start_date_local || typeof act.start_date_local !== 'string') {
      console.warn('Skipping activity due to missing or invalid start_date_local:', act?.id, act?.name);
      return; // Skip this activity
    }
    const date = act.start_date_local.split('T')[0]; // "YYYY-MM-DD"
    const distanceKm = parseFloat(((act.distance || 0) / 1000).toFixed(2)); // Distance in km

    if (!aggregatedData[date]) {
      aggregatedData[date] = { date, corsa: 0, nuoto: 0, ciclismo: 0, camminata: 0 };
    }

    const activityType = act.type;
    // Strava activity types: https://developers.strava.com/docs/reference/#api-models-ActivityType
    if (['Run', 'VirtualRun', 'TrailRun'].includes(activityType)) {
      aggregatedData[date].corsa += distanceKm;
    } else if (['Walk', 'Hike'].includes(activityType)) {
      aggregatedData[date].camminata += distanceKm;
    } else if (activityType === 'Swim') {
      aggregatedData[date].nuoto += distanceKm;
    } else if (['Ride', 'VirtualRide', 'EBikeRide', 'Handcycle', 'Velomobile'].includes(activityType)) {
      aggregatedData[date].ciclismo += distanceKm;
    }
  });

  // Convert aggregatedData object to an array
  const chartData = Object.values(aggregatedData);

  // Round the aggregated distances to 2 decimal places
  chartData.forEach((dataPoint) => {
    dataPoint.corsa = parseFloat(dataPoint.corsa.toFixed(2));
    dataPoint.nuoto = parseFloat(dataPoint.nuoto.toFixed(2));
    dataPoint.ciclismo = parseFloat(dataPoint.ciclismo.toFixed(2));
    dataPoint.camminata = parseFloat(dataPoint.camminata.toFixed(2));
  });

  // Sort by date in ascending order
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log(`Processed ${chartData.length} daily data points for the chart.`);
  return chartData;
}

// Build weekly aggregates by ISO week (YYYY-Www)
function isoWeekKey(dateStr) {
  const d = new Date(dateStr);
  // copy date and set to Thursday in current week according to ISO
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7; // Mon=0..Sun=6
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3);
  const week = 1 + Math.round((target - firstThursday) / (7 * 24 * 3600 * 1000));
  const yyyy = target.getFullYear();
  const ww = String(week).padStart(2, '0');
  return `${yyyy}-W${ww}`;
}

function buildWeeklyAggregates(daily) {
  const weeks = {};
  for (const row of daily) {
    const key = isoWeekKey(row.date);
    if (!weeks[key]) weeks[key] = { week: key, corsa: 0, ciclismo: 0, nuoto: 0, camminata: 0 };
    weeks[key].corsa += row.corsa || 0;
    weeks[key].ciclismo += row.ciclismo || 0;
    weeks[key].nuoto += row.nuoto || 0;
    weeks[key].camminata += row.camminata || 0;
  }
  return Object.values(weeks).sort((a,b) => a.week.localeCompare(b.week));
}

function deriveRunBestEffortsFromSplits(activity) {
  // 1. Try to use Strava's native "best_efforts" if available (much more accurate)
  if (activity.best_efforts && Array.isArray(activity.best_efforts) && activity.best_efforts.length > 0) {
    const mapped = [];
    const date = (activity.start_date_local || activity.start_date || '').slice(0,10);
    
    activity.best_efforts.forEach(be => {
      let label = null;
      // Normalize Strava labels to our dashboard format
      if (be.name === '400m') label = '400m';
      else if (be.name === '1k' || be.name === '1 km') label = '1k';
      else if (be.name === '5k' || be.name === '5 km') label = '5k';
      else if (be.name === '10k' || be.name === '10 km') label = '10k';
      else if (be.name === 'Half-Marathon' || be.name === '21k') label = '21k';
      else if (be.name === 'Marathon' || be.name === '42k') label = '42k';

      if (label) {
        mapped.push({
          date: date,
          type: 'run',
          label: label,
          dist_km: be.distance / 1000,
          time_s: be.moving_time, // Use moving_time for consistency
          pace_s_per_km: be.moving_time / (be.distance / 1000)
        });
      }
    });
    
    if (mapped.length > 0) return mapped;
  }

  // 2. Fallback: Calculate from splits if native data is missing
  const out = [];
  const splits = activity.splits_metric || [];
  const kmSplits = splits.filter(s => Math.abs((s.distance || 0) - 1000) < 80);
  const sum = (arr, k, from, to) => arr.slice(from, to).reduce((a, s) => a + (s[k] || 0), 0);
  const windows = [1, 5, 10, 21];
  windows.forEach(km => {
    if (kmSplits.length >= km) {
      let best = null;
      for (let i = 0; i <= kmSplits.length - km; i++) {
        const dist = sum(kmSplits, 'distance', i, i + km);
        const time = sum(kmSplits, 'moving_time', i, i + km);
        if (dist >= km * 900 && time > 0) { // allow small tolerance
          const pace = time / (dist / 1000);
          if (!best || pace < best.pace_s_per_km) best = { dist_km: dist / 1000, time_s: time, pace_s_per_km: pace };
        }
      }
      if (best) out.push({ date: (activity.start_date_local || activity.start_date || '').slice(0,10), type: 'run', label: `${km}k`, ...best });
    }
  });
  return out;
}

function summarizeZones(zones, sport, id) {
  const out = { id, sport, hr: null, power: null };
  for (const z of zones || []) {
    if (z.type === 'heartrate') {
      out.hr = (z.distribution_buckets || []).map(b => b.time || 0);
    }
    if (z.type === 'power') {
      out.power = (z.distribution_buckets || []).map(b => b.time || 0);
    }
  }
  return out;
}

// Lightweight athlete and activity helpers
async function getAthlete(token) {
  const r = await axios.get('https://www.strava.com/api/v3/athlete', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return r.data;
}

async function getAthleteStats(token, athleteId) {
  const r = await axios.get(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return r.data;
}

async function getDetailedActivity(token, id) {
  const r = await axios.get(`https://www.strava.com/api/v3/activities/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { include_all_efforts: false },
  });
  return r.data;
}

async function getActivityZones(token, id) {
  const r = await axios.get(`https://www.strava.com/api/v3/activities/${id}/zones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return r.data;
}

async function getActivityStreams(token, id, streamTypes = ["time", "distance", "moving", "cadence"]) {
  try {
    const r = await axios.get(`https://www.strava.com/api/v3/activities/${id}/streams`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        keys: streamTypes.join(','),
        key_by_type: true
      }
    });
    return r.data;
  } catch (e) {
    console.warn(`Could not fetch streams for activity ${id}:`, e?.response?.data || e?.message);
    return null;
  }
}

// Calcola la maschera di movimento reale per escludere le pause
function calculateMovingMask(streams) {
  if (!streams) return null;

  const timeData = streams.time?.data;
  const distData = streams.distance?.data;
  const cadenceData = streams.cadence?.data;
  const movingData = streams.moving?.data;

  const n = (timeData || distData || cadenceData || movingData || []).length;
  if (n === 0) return null;

  const active = new Array(n).fill(false);
  const speedThreshold = 0.25;  // m/s ~ 8:20/100m, sotto questo consideriamo fermo
  const cadenceThreshold = 1;   // >1 bracciata significa movimento

  for (let i = 0; i < n; i++) {
    const dt = (i > 0 && timeData) ? Math.max(1, timeData[i] - timeData[i - 1]) : 1;
    const distIncrease = distData && i > 0 ? Math.max(0, distData[i] - distData[i - 1]) : 0;
    const speed = dt > 0 ? distIncrease / dt : 0;
    const cadenceActive = cadenceData ? ((cadenceData[i] || 0) > cadenceThreshold) : false;
    const stravaMoving = movingData ? !!movingData[i] : false;

    active[i] = stravaMoving || speed > speedThreshold || cadenceActive;
  }

  // Chiudi solo drop-out di 1s (rumore), non le soste
  const closeGaps = 1;
  for (let i = 1; i < n - 1; i++) {
    if (!active[i] && active[i - 1] && active[i + 1]) {
      const gapSeconds = timeData ? (timeData[i + 1] - timeData[i - 1]) : 2;
      if (gapSeconds <= closeGaps + 1) active[i] = true;
    }
  }

  // Considera pause reali >=2s come stop
  const minPause = 2;
  let i = 0;
  while (i < n) {
    if (!active[i]) {
      let j = i;
      while (j < n && !active[j]) j++;
      if ((j - i) < minPause) {
        for (let k = i; k < j; k++) active[k] = true;
      }
      i = j;
    } else {
      i++;
    }
  }

  return active;
}

// Calcola il passo reale per un'attività di nuoto
function calculateRealSwimPace(streams, activityId, totalDistanceOverride = 0) {
  let movingMask = calculateMovingMask(streams);
  
  // Tenta di raffinare il calcolo usando la cadenza (bracciate) per escludere le pause a bordo vasca
  // Strava a volte considera "moving" anche le pause se non si preme il tasto lap.
  if (movingMask && streams.cadence?.data && streams.cadence.data.length > 0) {
    const cadenceData = streams.cadence.data;
    const n = cadenceData.length;
    
    if (n === movingMask.length) {
      const cadenceMask = new Array(n).fill(false);
      
      // 1. Segna i momenti con bracciate attive
      for (let i = 0; i < n; i++) {
        if (cadenceData[i] > 0) cadenceMask[i] = true;
      }
      
      // 2. Riempi i gap (virate/scivolamento) - tolleranza corta ~6s
      // (Una virata lenta + scivolamento puo durare alcuni secondi, ma non vogliamo inglobare le pause a bordo)
      const MAX_GLIDE_GAP = 6;
      
      for (let i = 0; i < n; i++) {
        if (cadenceMask[i]) {
          let j = i + 1;
          // Cerca la prossima bracciata
          while (j < n && !cadenceMask[j] && (j - i) <= MAX_GLIDE_GAP) {
            j++;
          }
          // Se trovata entro il gap, riempi tutto lo spazio in mezzo (è nuoto continuo)
          if (j < n && cadenceMask[j]) {
            for (let k = i + 1; k < j; k++) cadenceMask[k] = true;
          }
        }
      }

      // 3. Usa questa maschera raffinata se ha senso
      const originalSeconds = movingMask.filter(Boolean).length;
      const refinedSeconds = cadenceMask.filter(Boolean).length;
      
      // Usa il calcolo basato sulla cadenza solo se riduce il tempo (quindi rimuove pause)
      // ma non è troppo drastico (es. sensore rotto che dà 0 bracciate)
      if (refinedSeconds > 0 && refinedSeconds < originalSeconds && refinedSeconds > (originalSeconds * 0.1)) {
           console.log(`[Swim Debug] Activity ${activityId}: Refined moving time using cadence (${refinedSeconds}s vs Strava ${originalSeconds}s)`);
           movingMask = cadenceMask;
      }
    }
  }

  if (!movingMask) {
    console.log(`[Swim Debug] Activity ${activityId}: No moving mask (missing moving/distance streams?)`);
    return null;
  }
  
  let totalMeters = 0;
  if (streams.distance?.data) {
    const dist = streams.distance.data;
    totalMeters = dist[dist.length - 1] || 0;
  } else {
    // Fallback to activity summary distance if stream is missing
    totalMeters = totalDistanceOverride;
  }
  
  const movingSeconds = movingMask.filter(Boolean).length;
  
  if (totalMeters <= 0 || movingSeconds <= 0) {
    console.log(`[Swim Debug] Activity ${activityId}: Zero meters (${totalMeters}) or zero moving seconds (${movingSeconds})`);
    return null;
  }
  
  // Passo in secondi per 100m
  const pace100m = (movingSeconds / totalMeters) * 100;
  
  return {
    totalMeters: Math.round(totalMeters),
    movingSeconds,
    pace100m,
    paceFormatted: formatPace(pace100m)
  };
}

function formatPace(paceSeconds) {
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.round(paceSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Main execution block
(async () => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      console.error('Missing Strava API credentials in .env file. Please set CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN.');
      return; // Exit if credentials are not set
    }

    const accessToken = await getAccessToken();
    // Athlete and stats (cheap)
    let athlete = null;
    let athleteStats = null;
    try {
      athlete = await getAthlete(accessToken);
      if (athlete && athlete.id) {
        athleteStats = await getAthleteStats(accessToken, athlete.id);
      }
    } catch (e) {
      console.warn('Warning: could not fetch athlete or stats:', e?.response?.data || e?.message);
    }
    const rawActivities = await getActivities(accessToken);
    
    // Create a sorted copy (Newest -> Oldest) for selecting "recent" items
    const sortedActivities = [...(rawActivities || [])].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    let chartData = [];
    if (rawActivities && rawActivities.length > 0) {
      chartData = processActivitiesForChart(rawActivities);
    } else {
      console.log('No activities found in the last year to process for the chart.');
    }
    
  // Ensure the /public directory exists
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir, { recursive: true });
        console.log(`Created directory: ${publicDir}`);
    }

    const outputPath = path.join(publicDir, 'strava-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(chartData, null, 2));
    // Weekly aggregates
    const weekly = buildWeeklyAggregates(chartData);
    fs.writeFileSync(path.join(publicDir, 'strava-aggregates.json'), JSON.stringify(weekly, null, 2));
    // Athlete stats
    if (athleteStats) {
      fs.writeFileSync(path.join(publicDir, 'athlete-stats.json'), JSON.stringify(athleteStats, null, 2));
    }

    // Best efforts (runs) and zones summary for a limited subset to respect rate limits
    const BEST_LIMIT = Number(process.env.BEST_EFFORTS_LIMIT || 24); // ~24 detailed calls max
    const ZONES_LIMIT = Number(process.env.ZONES_LIMIT || 24);      // ~24 zone calls max
    const SWIM_PACE_LIMIT = Number(process.env.SWIM_PACE_LIMIT || 8); // ~8 swim streams calls max
    
    // Use sortedActivities to get the MOST RECENT activities
    const recentRunIds = sortedActivities
      .filter((a) => ['Run', 'TrailRun', 'VirtualRun'].includes(a.type))
      .slice(0, BEST_LIMIT)
      .map((a) => a.id);
      
    const recentForZones = sortedActivities.slice(0, ZONES_LIMIT).map((a) => ({ id: a.id, type: a.type }));
    
    // Ultime nuotate per calcolare il passo reale (Most recent first)
    const recentSwimActivities = sortedActivities
      .filter((a) => a.type === 'Swim')
      .slice(0, SWIM_PACE_LIMIT)
      .map((a) => ({ 
        id: a.id, 
        date: (a.start_date_local || a.start_date || '').slice(0, 10),
        distance: a.distance || 0
      }));

    const bestEfforts = [];
    console.log(`Fetching best efforts for ${recentRunIds.length} runs...`);
    for (const id of recentRunIds) {
      try {
        const det = await getDetailedActivity(accessToken, id);
        bestEfforts.push(...deriveRunBestEffortsFromSplits(det));
      } catch (e) { 
        if (e?.response?.status === 429) {
          console.warn(`Rate limit hit while fetching run ${id}, stopping best efforts fetch.`);
          break;
        }
      }
    }
    // Merge with existing best efforts to preserve history
    let existingBestEfforts = [];
    const bestEffortsPath = path.join(publicDir, 'best-efforts.json');
    if (fs.existsSync(bestEffortsPath)) {
      try {
        existingBestEfforts = JSON.parse(fs.readFileSync(bestEffortsPath, 'utf8'));
        if (!Array.isArray(existingBestEfforts)) existingBestEfforts = [];
      } catch (e) {
        console.warn('Could not read existing best-efforts.json, starting fresh.');
      }
    }

    // Combine and deduplicate (keep the best time for each label/date combination or just append?)
    // Strategy: Append new ones, then filter to keep only the absolute best for each label?
    // Or just keep all and let frontend sort? Frontend sorts by time_s.
    // Let's just append and deduplicate by (date + label) to avoid duplicates if script runs again.
    const combinedEfforts = [...existingBestEfforts];
    
    bestEfforts.forEach(newEffort => {
      const exists = combinedEfforts.some(e => e.date === newEffort.date && e.label === newEffort.label);
      if (!exists) {
        combinedEfforts.push(newEffort);
      } else {
        // If exists, update if this one is better (or just different? Strava native is better than split calc)
        // Since we switched to native, we should prefer the new one if the old one was split-based.
        // Simple logic: replace if date/label matches.
        const idx = combinedEfforts.findIndex(e => e.date === newEffort.date && e.label === newEffort.label);
        combinedEfforts[idx] = newEffort;
      }
    });

    fs.writeFileSync(bestEffortsPath, JSON.stringify(combinedEfforts, null, 2));

    const zonesSummary = [];
    console.log(`Fetching zones for ${recentForZones.length} activities...`);
    for (const a of recentForZones) {
      try {
        const z = await getActivityZones(accessToken, a.id);
        zonesSummary.push(summarizeZones(z, a.type, a.id));
      } catch (e) { 
        if (e?.response?.status === 429) {
          console.warn(`Rate limit hit while fetching zones for ${a.id}, stopping zones fetch.`);
          break;
        }
      }
    }
    fs.writeFileSync(path.join(publicDir, 'zones-summary.json'), JSON.stringify(zonesSummary, null, 2));
    
    // Calcola i passi reali per le ultime nuotate
    const swimPaces = [];
    console.log(`Calculating real pace for ${recentSwimActivities.length} recent swim activities...`);
    for (const swim of recentSwimActivities) {
      try {
        // Try fetching 'distance' stream specifically, as 'time' might be implicit or missing for swims
        const streams = await getActivityStreams(accessToken, swim.id, ["distance", "moving", "cadence"]);
        
        if (streams) {
          // Debug: print available stream keys
          console.log(`[Swim Debug] Activity ${swim.id} streams keys:`, Object.keys(streams));
          
          const paceData = calculateRealSwimPace(streams, swim.id, swim.distance);
          if (paceData) {
            swimPaces.push({
              id: swim.id,
              date: swim.date,
              ...paceData
            });
            console.log(`Activity ${swim.id} (${swim.date}): ${paceData.paceFormatted}/100m`);
          }
        } else {
          console.log(`[Swim Debug] Activity ${swim.id}: No streams returned`);
        }
      } catch (e) {
        if (e?.response?.status === 429) {
          console.warn(`Rate limit hit while fetching streams for swim ${swim.id}, stopping swim pace calculation.`);
          break;
        } else {
          console.warn(`Could not calculate pace for swim ${swim.id}:`, e?.message);
        }
      }
    }
    fs.writeFileSync(path.join(publicDir, 'swim-paces.json'), JSON.stringify(swimPaces, null, 2));
    console.log(`✅ Generated swim-paces.json with ${swimPaces.length} entries.`);
    
    if (chartData.length > 0) {
      console.log(`✅ strava-data.json successfully created/updated at ${outputPath} with ${chartData.length} data points.`);
    } else {
      console.log(`✅ Empty strava-data.json created/updated at ${outputPath} as no relevant activities were processed.`);
    }

  } catch (error) {
    // Check if it's a rate limit error
    if (error?.response?.status === 429) {
      console.warn('⚠️ Rate limit exceeded. Partial data may have been saved.');
      console.warn('Rate limit info:', error?.response?.headers?.['x-ratelimit-usage']);
      console.warn('Consider reducing BEST_EFFORTS_LIMIT, ZONES_LIMIT, SWIM_PACE_LIMIT or increasing schedule frequency.');
      // Don't exit with error code for rate limits - we want to deploy partial data
      process.exit(0);
    }
    // Ensure the CI step fails and doesn't deploy stale data for other errors
    const details = error?.response?.data ? JSON.stringify(error.response.data) : (error?.message || 'Unknown error');
    console.error('Failed to fetch and process Strava data. See error messages above. Details:', details);
    // Non-zero exit code to signal failure in CI
    process.exit(1);
  }
})();
