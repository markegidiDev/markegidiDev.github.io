import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

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

// Function to fetch activities
async function getActivities(token) {
  try {
    // Calculate the timestamp for one year ago from today
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearAgoTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

    console.log(`Fetching activities since: ${oneYearAgo.toISOString().split('T')[0]}`);
    
    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        after: oneYearAgoTimestamp, // Fetch activities after this timestamp
        per_page: 200, // Fetch up to 200 activities
        page: 1
      }
    });
    console.log(`Fetched ${response.data.length} activities from Strava.`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    throw error; // Re-throw
  }
}

// Function to process activities into the desired chart format
function processActivitiesForChart(activities) {
  const aggregatedData = {}; // Use an object for easier aggregation by date

  activities.forEach(act => {
    // Ensure start_date_local exists and is a string
    if (!act.start_date_local || typeof act.start_date_local !== 'string') {
        console.warn('Skipping activity due to missing or invalid start_date_local:', act.id, act.name);
        return; // Skip this activity
    }
    const date = act.start_date_local.split('T')[0]; // "YYYY-MM-DD"
    const distanceKm = parseFloat((act.distance / 1000).toFixed(2)); // Distance in km

    if (!aggregatedData[date]) {
      aggregatedData[date] = {
        date: date,
        corsa: 0,
        nuoto: 0,
        ciclismo: 0,
      };
    }
    
    const activityType = act.type;
    // Strava activity types: https://developers.strava.com/docs/reference/#api-models-ActivityType
    if (['Run', 'VirtualRun', 'TrailRun', 'Walk', 'Hike'].includes(activityType)) { // Consider Walk/Hike as Corsa too
      aggregatedData[date].corsa += distanceKm;
    } else if (activityType === 'Swim') {
      aggregatedData[date].nuoto += distanceKm;
    } else if (['Ride', 'VirtualRide', 'EBikeRide', 'Handcycle', 'Velomobile'].includes(activityType)) {
      aggregatedData[date].ciclismo += distanceKm;
    }
    // Other activity types are ignored for this chart
  });

  // Convert aggregatedData object to an array
  let chartData = Object.values(aggregatedData);
  
  // Round the aggregated distances to 2 decimal places
  chartData.forEach(dataPoint => {
    dataPoint.corsa = parseFloat(dataPoint.corsa.toFixed(2));
    dataPoint.nuoto = parseFloat(dataPoint.nuoto.toFixed(2));
    dataPoint.ciclismo = parseFloat(dataPoint.ciclismo.toFixed(2));
  });

  // Sort by date in ascending order
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log(`Processed ${chartData.length} daily data points for the chart.`);
  return chartData;
}

// Main execution block
(async () => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      console.error('Missing Strava API credentials in .env file. Please set CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN.');
      return; // Exit if credentials are not set
    }

    const accessToken = await getAccessToken();
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
    
    if (chartData.length > 0) {
      console.log(`✅ strava-data.json successfully created/updated at ${outputPath} with ${chartData.length} data points.`);
    } else {
      console.log(`✅ Empty strava-data.json created/updated at ${outputPath} as no relevant activities were processed.`);
    }

  } catch (error) {
    // Error already logged by the function that threw it
    console.error('Failed to fetch and process Strava data. See error messages above.');
  }
})();
