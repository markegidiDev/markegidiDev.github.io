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
  if (!streams?.time?.data || !streams?.distance?.data) return null;
  
  const time = streams.time.data;
  const dist = streams.distance.data;
  const moving = streams.moving?.data || [];
  const cadence = streams.cadence?.data || [];
  
  const n = time.length;
  const active = new Array(n).fill(false);
  
  // Identifica i secondi di movimento attivo
  for (let i = 0; i < n; i++) {
    const distIncrease = i > 0 ? (dist[i] - dist[i-1]) : 0;
    const isMoving = (moving[i] === true) || (distIncrease > 0.1) || ((cadence[i] || 0) > 0);
    active[i] = !!isMoving;
  }
  
  // Chiudi gap piccoli (≤2s) e richiedi pause minime (≥5s)
  const closeGaps = 2;
  const minPause = 5;
  
  // Chiudi gap brevi
  for (let i = 1; i < n - 1; i++) {
    if (!active[i]) {
      let left = i - 1;
      let right = i + 1;
      let gap = 1;
      
      while (right < n && !active[right] && gap <= closeGaps) {
        right++;
        gap++;
      }
      
      if (active[left] && right < n && active[right] && gap <= closeGaps) {
        for (let k = i; k < right; k++) {
          active[k] = true;
        }
      }
    }
  }
  
  // Filtra pause troppo brevi
  let i = 0;
  while (i < n) {
    if (!active[i]) {
      let j = i;
      while (j < n && !active[j]) j++;
      if ((j - i) < minPause) {
        for (let k = i; k < j; k++) {
          active[k] = true;
        }
      }
      i = j;
    } else {
      i++;
    }
  }
  
  return active;
}

// Calcola il passo reale per un'attività di nuoto
function calculateRealSwimPace(streams) {
  const movingMask = calculateMovingMask(streams);
  if (!movingMask || !streams?.distance?.data) return null;
  
  const dist = streams.distance.data;
  const totalMeters = dist[dist.length - 1] || 0;
  const movingSeconds = movingMask.filter(Boolean).length;
  
  if (totalMeters <= 0 || movingSeconds <= 0) return null;
  
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
    
    const recentRunIds = (rawActivities || [])
      .filter((a) => ['Run', 'TrailRun', 'VirtualRun'].includes(a.type))
      .slice(0, BEST_LIMIT)
      .map((a) => a.id);
    const recentForZones = (rawActivities || []).slice(0, ZONES_LIMIT).map((a) => ({ id: a.id, type: a.type }));
    
    // Ultime nuotate per calcolare il passo reale
    const recentSwimActivities = (rawActivities || [])
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
    fs.writeFileSync(path.join(publicDir, 'best-efforts.json'), JSON.stringify(bestEfforts, null, 2));

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
        const streams = await getActivityStreams(accessToken, swim.id, ["time", "distance", "moving", "cadence"]);
        if (streams) {
          const paceData = calculateRealSwimPace(streams);
          if (paceData) {
            swimPaces.push({
              id: swim.id,
              date: swim.date,
              ...paceData
            });
            console.log(`Activity ${swim.id} (${swim.date}): ${paceData.paceFormatted}/100m`);
          }
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
