import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mask(str, visible = 4) {
  if (!str) return '';
  const len = str.length;
  if (len <= visible) return '*'.repeat(len);
  return str.slice(0, visible) + '*'.repeat(len - visible);
}

function parseInput(arg) {
  if (!arg) return { code: null };
  try {
    if (arg.startsWith('http')) {
      const url = new URL(arg);
      return { code: url.searchParams.get('code'), scope: url.searchParams.get('scope') };
    }
  } catch {}
  return { code: arg };
}

async function main() {
  const input = process.argv[2];
  const { code, scope } = parseInput(input);
  const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
  const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
  const REDIRECT_URI = process.env.STRAVA_REDIRECT_URI || 'http://localhost/exchange_token';

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing STRAVA_CLIENT_ID or STRAVA_CLIENT_SECRET in .env');
    process.exit(1);
  }
  if (!code) {
    console.error('Usage: node exchange-strava-code.js <CODE or REDIRECT_URL_WITH_CODE>');
    process.exit(1);
  }

  console.log('Exchanging authorization code for tokens...');
  try {
    const resp = await axios.post('https://www.strava.com/oauth/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    });

    const { access_token, refresh_token, expires_at, athlete, token_type } = resp.data || {};
    console.log('Token type:', token_type);
    console.log('Scope:', scope || '(provided by redirect)');
    console.log('Access token (masked):', mask(access_token));
    console.log('Refresh token (masked):', mask(refresh_token));

    // Update .env with new refresh token
    const envPath = path.join(__dirname, '.env');
    let envText = '';
    try { envText = fs.readFileSync(envPath, 'utf8'); } catch { envText = ''; }

    if (envText.includes('STRAVA_REFRESH_TOKEN=')) {
      envText = envText.replace(/STRAVA_REFRESH_TOKEN=.*/g, `STRAVA_REFRESH_TOKEN=${refresh_token}`);
    } else {
      if (envText && !envText.endsWith('\n')) envText += '\n';
      envText += `STRAVA_REFRESH_TOKEN=${refresh_token}\n`;
    }

    if (!envText.includes('STRAVA_REDIRECT_URI=')) {
      envText += `STRAVA_REDIRECT_URI=${REDIRECT_URI}\n`;
    }

    fs.writeFileSync(envPath, envText, 'utf8');
    console.log('Updated .env with new STRAVA_REFRESH_TOKEN and STRAVA_REDIRECT_URI.');

    console.log('Exchange complete. You can now run: node fetch-strava-activities.js');
  } catch (err) {
    if (err.response) {
      console.error('Exchange failed:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Exchange failed:', err.message);
    }
    process.exit(1);
  }
}

main();
