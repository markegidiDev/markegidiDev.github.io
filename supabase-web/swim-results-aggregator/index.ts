declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const NUOTOMASTER_BASE_URLS = [
  "https://www.nuotomaster.it/NUOTO",
  "http://www.nuotomaster.it/NUOTO",
];

const FINVENETO_BASE_URL = "https://www.finveneto.org/";
const FINVENETO_INDEX_URLS = [
  `${FINVENETO_BASE_URL}master_gp_veneto_categoria_classifica.php?sesso=M`,
  `${FINVENETO_BASE_URL}master_gp_veneto_categoria_classifica.php?sesso=F`,
];

const BROWSER_HEADERS = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
};

const ALLOWED_SOURCES = ["nuotomaster", "natatoria", "finveneto", "federnuoto"] as const;
type Source = typeof ALLOWED_SOURCES[number];

type Athlete = {
  code: string;
  name: string | null;
  club: string | null;
  category: string | null;
  birthYear: number | null;
  natatoriaId?: string | null;
  finvenetoAthleteId?: string | null;
};

type AthleteSourceMap = {
  athlete_code: string;
  natatoria_id: string | null;
  finveneto_athlete_id: string | null;
  athlete_name: string | null;
  athlete_name_normalized: string | null;
  birth_year: number | null;
  club: string | null;
  updated_at?: string;
};

type FinvenetoIndexCandidate = {
  finvenetoAthleteId: string;
  name: string;
  club: string | null;
};

type NationalEvent = {
  id: string;
  name: string;
  base_url: string;
  results_url: string | null;
  start_date: string;
  end_date: string;
  season: number;
  pool: 25 | 50;
  enabled: boolean;
};

type Race = {
  id: string;
  source: Source;
  sourceType: "official" | "unofficial" | "summary" | "unknown";
  circuit: "grand_prix_master" | "campionati_italiani" | "regionale" | "acquasport" | "unknown";
  date: string | null;
  season: number | null;
  meet: string | null;
  location: string | null;
  event: string;
  distance: number;
  style: string;
  pool: 25 | 50 | null;
  chrono: "A" | "M" | null;
  time: string;
  timeSeconds: number;
  position: number | null;
  points: number | null;
  category: string | null;
  club: string | null;
  sourceUrl: string | null;
  raw?: Record<string, unknown>;
};

type SourceStatus = {
  ok: boolean;
  fromCache?: boolean;
  count?: number;
  error?: string;
  warnings?: string[];
};

type DebugInfo = {
  fetchedUrls: string[];
  warnings: string[];
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

type ResultCacheRow<T> = {
  payload: T;
  fetched_at: string;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const FINVENETO_CACHE_TTL_SECONDS = 12 * 60 * 60;
const FEDERNUOTO_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

class AthleteAmbiguousError extends Error {
  candidates: Athlete[];

  constructor(candidates: Athlete[]) {
    super("Trovati piu atleti con lo stesso nome: inserisci anche il codice FIN");
    this.name = "AthleteAmbiguousError";
    this.candidates = candidates;
  }
}

function hasPersistentCache() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function databaseHeaders(extra: Record<string, string> = {}) {
  return {
    "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    ...extra,
  };
}

async function databaseSelect<T>(
  table: string,
  searchParams: Record<string, string>,
  debug: DebugInfo,
) {
  if (!hasPersistentCache()) return [] as T[];

  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(searchParams)) url.searchParams.set(key, value);

  try {
    const response = await fetch(url, { headers: databaseHeaders() });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    return await response.json() as T[];
  } catch (error) {
    debug.warnings.push(
      `Cache Supabase non leggibile (${table}): ${error instanceof Error ? error.message : String(error)}`,
    );
    return [] as T[];
  }
}

async function databaseUpsert(
  table: string,
  payload: Record<string, unknown>,
  conflictColumn: string,
  debug: DebugInfo,
) {
  if (!hasPersistentCache()) return;

  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", conflictColumn);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: databaseHeaders({
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  } catch (error) {
    debug.warnings.push(
      `Cache Supabase non aggiornabile (${table}): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function stripAccents(value: string) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeName(value: string) {
  return stripAccents(value).toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();
}

function normalizePersonName(value: string) {
  return normalizeName(value).split(" ").filter(Boolean).sort().join(" ");
}

function cleanText(value: string) {
  return decodeEntities(
    String(value || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\u00a0/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function decodeEntities(value: string) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function detectCharset(contentType: string | null) {
  const match = String(contentType || "").match(/charset=([^;]+)/i);
  return match?.[1]?.trim() || null;
}

function decodeHtml(bytes: ArrayBuffer, contentType: string | null) {
  const candidates = [
    detectCharset(contentType),
    "utf-8",
    "windows-1252",
    "iso-8859-1",
  ].filter(Boolean) as string[];

  for (const charset of [...new Set(candidates)]) {
    try {
      return new TextDecoder(charset, { fatal: charset === "utf-8" }).decode(bytes);
    } catch {
      // Try the next legacy charset.
    }
  }

  return new TextDecoder("windows-1252").decode(bytes);
}

function splitCookies(raw: string | null) {
  if (!raw) return "";
  return raw
    .split(/,(?=\s*[^;=]+?=)/)
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

async function fetchHtml(url: string, init: RequestInit = {}, retries = 1) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(url, {
        ...init,
        redirect: "follow",
        signal: controller.signal,
      });
      const bytes = await response.arrayBuffer();
      return {
        response,
        html: decodeHtml(bytes, response.headers.get("content-type")),
      };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function cacheGet<T>(key: string, refresh: boolean) {
  if (refresh) return null;
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry || entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function cacheSet<T>(key: string, value: T, ttlSeconds: number) {
  memoryCache.set(key, {
    expiresAt: Date.now() + ttlSeconds * 1000,
    value,
  });
}

async function findAthleteMappings(
  code: string,
  name: string,
  debug: DebugInfo,
) {
  if (code) {
    return await databaseSelect<AthleteSourceMap>("swim_athlete_source_map", {
      select: "*",
      athlete_code: `eq.${code}`,
      limit: "5",
    }, debug);
  }

  const normalizedName = normalizePersonName(name);
  if (!normalizedName) return [];
  return await databaseSelect<AthleteSourceMap>("swim_athlete_source_map", {
    select: "*",
    athlete_name_normalized: `eq.${normalizedName}`,
    limit: "10",
  }, debug);
}

async function saveAthleteMapping(athlete: Athlete, debug: DebugInfo) {
  if (!athlete.code || (!athlete.natatoriaId && !athlete.finvenetoAthleteId)) return;
  const payload: Record<string, unknown> = {
    athlete_code: athlete.code,
    athlete_name: athlete.name,
    athlete_name_normalized: normalizePersonName(athlete.name || ""),
    birth_year: athlete.birthYear,
    club: athlete.club,
    updated_at: new Date().toISOString(),
  };
  if (athlete.natatoriaId) payload.natatoria_id = athlete.natatoriaId;
  if (athlete.finvenetoAthleteId) payload.finveneto_athlete_id = athlete.finvenetoAthleteId;
  await databaseUpsert("swim_athlete_source_map", payload, "athlete_code", debug);
}

async function readFinvenetoResultCache(
  finvenetoAthleteId: string,
  refresh: boolean,
  debug: DebugInfo,
) {
  if (refresh) return null;
  const fetchedAfter = new Date(Date.now() - FINVENETO_CACHE_TTL_SECONDS * 1000).toISOString();
  const rows = await databaseSelect<ResultCacheRow<{ athlete: Athlete; races: Race[] }>>(
    "swim_results_cache",
    {
      select: "payload,fetched_at",
      season: "eq.0",
      source: "eq.finveneto",
      cache_key: `eq.${finvenetoAthleteId}`,
      fetched_at: `gte.${fetchedAfter}`,
      order: "fetched_at.desc",
      limit: "1",
    },
    debug,
  );
  return rows[0]?.payload || null;
}

async function saveFinvenetoResultCache(
  value: { athlete: Athlete; races: Race[] },
  debug: DebugInfo,
) {
  if (!value.athlete.code || !value.athlete.finvenetoAthleteId) return;
  await databaseUpsert("swim_results_cache", {
    athlete_code: value.athlete.code,
    season: 0,
    source: "finveneto",
    cache_key: value.athlete.finvenetoAthleteId,
    payload: value,
    fetched_at: new Date().toISOString(),
  }, "athlete_code,season,source,cache_key", debug);
}

function normalizeTime(raw: string) {
  const value = String(raw || "").trim().replace(",", ".");
  let match = value.match(/^(\d{1,2})[':.](\d{2})\.(\d{1,2})$/);
  if (match) {
    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const fraction = match[3].padEnd(2, "0");
    return minutes > 0
      ? `${minutes}:${String(seconds).padStart(2, "0")}.${fraction}`
      : `${seconds}.${fraction}`;
  }

  match = value.match(/^(\d{1,3})\.(\d{1,2})$/);
  return match ? `${Number(match[1])}.${match[2].padEnd(2, "0")}` : null;
}

function timeToSeconds(raw: string) {
  const normalized = normalizeTime(raw);
  if (!normalized) return null;
  if (!normalized.includes(":")) return Number(normalized);
  const [minutes, seconds] = normalized.split(":");
  return Number(minutes) * 60 + Number(seconds);
}

function parseEvent(raw: string) {
  const compact = String(raw || "").trim().match(/^(\d{2,4})(SL|RA|DO|FA|MI)$/i);
  if (compact) return { distance: Number(compact[1]), style: compact[2].toUpperCase() };

  const text = stripAccents(String(raw || "")).toUpperCase();
  const distance = Number(text.match(/\b(\d{2,4})\b/)?.[1]);
  const styles: Array<[RegExp, string]> = [
    [/\b(STILE LIBERO|STILE|SL)\b/, "SL"],
    [/\b(RANA|RA)\b/, "RA"],
    [/\b(DORSO|DO)\b/, "DO"],
    [/\b(FARFALLA|DELFINO|FA)\b/, "FA"],
    [/\b(MISTI|MISTO|MI)\b/, "MI"],
  ];
  const style = styles.find(([pattern]) => pattern.test(text))?.[1];
  return distance && style ? { distance, style } : null;
}

function eventLabel(distance: number, style: string) {
  const styleName = {
    SL: "Stile libero",
    RA: "Rana",
    DO: "Dorso",
    FA: "Farfalla",
    MI: "Misti",
  }[style] || style;
  return `${distance} ${styleName}`;
}

function seasonDate(dayMonth: string, season: number) {
  const match = dayMonth.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const calendarYear = Number(match[2]) >= 10 ? season - 1 : season;
  return `${calendarYear}-${match[2]}-${match[1]}`;
}

function italianDate(raw: string) {
  const match = String(raw || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function seasonFromDate(date: string | null) {
  if (!date) return null;
  const match = date.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!match) return null;
  const year = Number(match[1]);
  return Number(match[2]) >= 10 ? year + 1 : year;
}

function makeRaceId(race: Omit<Race, "id">) {
  const input = [
    race.source,
    race.date || "",
    race.distance,
    race.style,
    race.timeSeconds.toFixed(2),
    race.pool || "",
    normalizeName(race.meet || ""),
  ].join("|");
  let hash = 2166136261;
  for (const character of input) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${race.source}-${(hash >>> 0).toString(16)}`;
}

function parseNuotomasterLine(line: string, season: number, category: string | null, sourceUrl: string) {
  const match = cleanText(line).match(
    /^(\d{2,4}[A-Z]{2})\s+(\d{2}\.\d{2}\.\d{2}|\d{1,3}\.\d{2})\s+(?:\*\s+)?(\d{1,3})(?:[^\d\s])?\s+(\d{1,4}(?:[.,]\d{2})?)\s+(\d{2}\/\d{2})\s+(.+)$/i,
  );
  if (!match) return null;

  const parsedEvent = parseEvent(match[1]);
  const time = normalizeTime(match[2]);
  const timeSeconds = timeToSeconds(match[2]);
  if (!parsedEvent || !time || timeSeconds === null) return null;

  const race: Omit<Race, "id"> = {
    source: "nuotomaster",
    sourceType: "summary",
    circuit: "unknown",
    date: seasonDate(match[5], season),
    season,
    meet: cleanText(match[6]),
    location: cleanText(match[6]),
    event: eventLabel(parsedEvent.distance, parsedEvent.style),
    distance: parsedEvent.distance,
    style: parsedEvent.style,
    pool: null,
    chrono: null,
    time,
    timeSeconds,
    position: Number(match[3]),
    points: Number(match[4].replace(",", ".")),
    category,
    club: null,
    sourceUrl,
  };
  return { ...race, id: makeRaceId(race) };
}

function parseNuotomasterHtml(html: string, code: string, sourceUrl: string) {
  const header = html.match(
    /Risultati\s+(\d{4})[\s\S]{0,400}?<br>\s*<br>\s*([^<]+)<br>\s*((?:19|20)\d{2})\s*-\s*([MU]\d{2})/i,
  );
  const season = Number(header?.[1]);
  const name = cleanText(header?.[2] || "") || null;
  const birthYear = header?.[3] ? Number(header[3]) : null;
  const category = header?.[4]?.toUpperCase() || null;
  const races: Race[] = [];

  const historicalBlocks = html.matchAll(
    /<h1>\s*Risultati anno\s+(\d{4})\s*<\/h1>\s*<pre>([\s\S]*?)<\/pre>/gi,
  );
  for (const block of historicalBlocks) {
    for (const line of block[2].replace(/<br\s*\/?>/gi, "\n").split("\n")) {
      const race = parseNuotomasterLine(line, Number(block[1]), category, sourceUrl);
      if (race) races.push(race);
    }
  }

  const currentBlock = html.match(
    /<h1>\s*Risultati in ordine di gara\s*<\/h1>\s*<pre>([\s\S]*?)<\/pre>/i,
  );
  if (currentBlock && season) {
    for (const line of currentBlock[1].replace(/<br\s*\/?>/gi, "\n").split("\n")) {
      const race = parseNuotomasterLine(line, season, category, sourceUrl);
      if (race) races.push(race);
    }
  }

  if (!races.length) throw new Error("Nessuna gara riconosciuta nella scheda atleta NuotoMaster");

  return {
    athlete: { code, name, club: null, category, birthYear } satisfies Athlete,
    races: dedupeRaces(races),
  };
}

function looksLikeNuotomasterLandingPage(html: string) {
  const lowered = html.toLowerCase();
  return lowered.includes('action="scheda_indi.asp"') &&
    lowered.includes('name="p_codi"') &&
    lowered.includes("riq_riep");
}

async function fetchNuotomaster(code: string, year: string, refresh: boolean, debug: DebugInfo) {
  const cacheKey = `nuotomaster:${code}:${year}`;
  const cached = cacheGet<{ athlete: Athlete; races: Race[] }>(cacheKey, refresh);
  if (cached) return { ...cached, fromCache: true };

  const errors: string[] = [];
  for (const baseUrl of NUOTOMASTER_BASE_URLS) {
    const homeUrl = `${baseUrl}/master.asp`;
    const sourceUrl = `${baseUrl}/Scheda_indi.asp`;
    debug.fetchedUrls.push(homeUrl, sourceUrl);
    try {
      const home = await fetch(homeUrl, { headers: BROWSER_HEADERS });
      const cookieHeader = splitCookies(home.headers.get("set-cookie"));
      const { response, html } = await fetchHtml(sourceUrl, {
        method: "POST",
        headers: {
          ...BROWSER_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded",
          "Origin": baseUrl.replace(/\/NUOTO$/i, ""),
          "Referer": homeUrl,
          ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
        },
        body: new URLSearchParams({ p_codi: code, p_anno: year }).toString(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (looksLikeNuotomasterLandingPage(html)) throw new Error("NuotoMaster ha restituito la pagina iniziale");
      if (html.length < 1500) throw new Error("Risposta troppo corta");
      const result = parseNuotomasterHtml(html, code, sourceUrl);
      cacheSet(cacheKey, result, 24 * 60 * 60);
      return { ...result, fromCache: false };
    } catch (error) {
      errors.push(`${baseUrl}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(errors.join(" ; "));
}

function parseFinvenetoAthleteHtml(html: string, finvenetoAthleteId: string, sourceUrl: string) {
  const code = cleanText(html.match(/Codice F\.I\.N\.:\s*(\d+)/i)?.[1] || "");
  const name = cleanText(html.match(/Cognome e Nome:\s*<b>([\s\S]*?)<\/b>/i)?.[1] || "") || null;
  const category = cleanText(
    html.match(/Categoria:\s*([^<\r\n]+?)(?:\s*-\s*Tess\.FIN:|<)/i)?.[1] || "",
  ) || null;
  const birthYear = Number(html.match(/Anno nascita:\s*((?:19|20)\d{2})/i)?.[1]) || null;
  const club = cleanText(
    html.match(/Societ(?:à|&agrave;):[\s\S]{0,500}?<a[^>]*>[\s\S]*?<b>([\s\S]*?)<\/b>/i)?.[1] || "",
  ) || null;
  if (!code || !name) throw new Error(`Scheda FIN Veneto ${finvenetoAthleteId} non riconosciuta`);

  const athlete: Athlete = {
    code,
    name,
    club,
    category,
    birthYear,
    finvenetoAthleteId,
  };
  const races: Race[] = [];
  const statsSection = html.match(/<a name="statistiche-per-specialita"><\/a>([\s\S]*)$/i)?.[1] || "";
  const specialtyBlocks = statsSection.matchAll(
    /<h4>\s*([\s\S]*?)\s*<\/h4>\s*<table[^>]*summary="Statistiche specialit[^"]*"[^>]*>[\s\S]*?<tbody[^>]*>([\s\S]*?)<\/tbody>/gi,
  );

  for (const block of specialtyBlocks) {
    const parsedEvent = parseEvent(cleanText(block[1]));
    if (!parsedEvent) continue;

    for (const row of block[2].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cleanText(cell[1]));
      if (cells.length < 5) continue;

      const date = italianDate(cells[0]);
      const time = normalizeTime(cells[4]);
      const timeSeconds = timeToSeconds(cells[4]);
      const pool = Number(cells[2]);
      const chrono = cells[3].toUpperCase() === "A" || cells[3].toUpperCase() === "M"
        ? cells[3].toUpperCase() as "A" | "M"
        : null;
      if (!date || !time || timeSeconds === null || (pool !== 25 && pool !== 50)) continue;

      const href = decodeEntities(
        row[1].match(/href="([^"]*nuoto_risultatigara\.php[^"]*)"/i)?.[1] || "",
      );
      const meet = cells[1] || null;
      const race: Omit<Race, "id"> = {
        source: "finveneto",
        sourceType: "official",
        circuit: /CAMPIONATO REGIONALE/i.test(meet || "") ? "regionale" : "grand_prix_master",
        date,
        season: seasonFromDate(date),
        meet,
        location: null,
        event: eventLabel(parsedEvent.distance, parsedEvent.style),
        distance: parsedEvent.distance,
        style: parsedEvent.style,
        pool,
        chrono,
        time,
        timeSeconds,
        position: null,
        points: null,
        category,
        club,
        sourceUrl: href ? new URL(href, FINVENETO_BASE_URL).toString() : sourceUrl,
      };
      races.push({ ...race, id: makeRaceId(race) });
    }
  }

  if (!races.length) throw new Error(`Nessuna gara di nuoto riconosciuta nella scheda FIN Veneto ${finvenetoAthleteId}`);
  return { athlete, races: dedupeRaces(races) };
}

function parseFinvenetoIndex(html: string) {
  const candidates: FinvenetoIndexCandidate[] = [];
  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const identity = row[1].match(
      /nuoto_schedaatleta\.php\?id_atleta=(\d+)[^>]*>\s*<strong>([\s\S]*?)<\/strong>/i,
    );
    if (!identity) continue;
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cleanText(cell[1]));
    candidates.push({
      finvenetoAthleteId: identity[1],
      name: cleanText(identity[2]),
      club: cells[2] || null,
    });
  }
  return candidates;
}

async function fetchFinvenetoIndex(refresh: boolean, debug: DebugInfo) {
  const cacheKey = "finveneto:index";
  const cached = cacheGet<FinvenetoIndexCandidate[]>(cacheKey, refresh);
  if (cached) return cached;

  debug.fetchedUrls.push(...FINVENETO_INDEX_URLS);
  const pages = await Promise.all(FINVENETO_INDEX_URLS.map(async (url) => {
    const { response, html } = await fetchHtml(url, { headers: BROWSER_HEADERS });
    if (!response.ok) throw new Error(`FIN Veneto indice HTTP ${response.status}`);
    return parseFinvenetoIndex(html);
  }));
  const unique = new Map<string, FinvenetoIndexCandidate>();
  for (const candidate of pages.flat()) unique.set(candidate.finvenetoAthleteId, candidate);
  const candidates = [...unique.values()];
  cacheSet(cacheKey, candidates, 24 * 60 * 60);
  return candidates;
}

function validateFinvenetoAthlete(athlete: Athlete, code: string, name: string) {
  if (code && athlete.code !== code) {
    throw new Error(`La scheda FIN Veneto ${athlete.finvenetoAthleteId} appartiene al codice FIN ${athlete.code}`);
  }
  if (name && normalizePersonName(athlete.name || "") !== normalizePersonName(name)) {
    throw new Error(`La scheda FIN Veneto ${athlete.finvenetoAthleteId} appartiene a ${athlete.name}`);
  }
}

async function fetchFinvenetoSheet(
  finvenetoAthleteId: string,
  code: string,
  name: string,
  refresh: boolean,
  debug: DebugInfo,
) {
  const cacheKey = `finveneto:${finvenetoAthleteId}`;
  const cached = cacheGet<{ athlete: Athlete; races: Race[] }>(cacheKey, refresh);
  if (cached) {
    validateFinvenetoAthlete(cached.athlete, code, name);
    return { ...cached, fromCache: true };
  }

  const persisted = await readFinvenetoResultCache(finvenetoAthleteId, refresh, debug);
  if (persisted) {
    validateFinvenetoAthlete(persisted.athlete, code, name);
    cacheSet(cacheKey, persisted, FINVENETO_CACHE_TTL_SECONDS);
    return { ...persisted, fromCache: true };
  }

  const sourceUrl = `${FINVENETO_BASE_URL}nuoto_schedaatleta.php?id_atleta=${finvenetoAthleteId}`;
  debug.fetchedUrls.push(sourceUrl);
  const { response, html } = await fetchHtml(sourceUrl, { headers: BROWSER_HEADERS });
  if (!response.ok) throw new Error(`FIN Veneto HTTP ${response.status}`);
  const value = parseFinvenetoAthleteHtml(html, finvenetoAthleteId, sourceUrl);
  validateFinvenetoAthlete(value.athlete, code, name);
  cacheSet(cacheKey, value, FINVENETO_CACHE_TTL_SECONDS);
  await Promise.all([
    saveAthleteMapping(value.athlete, debug),
    saveFinvenetoResultCache(value, debug),
  ]);
  return { ...value, fromCache: false };
}

async function fetchFinveneto(
  code: string,
  name: string,
  finvenetoAthleteId: string,
  refresh: boolean,
  debug: DebugInfo,
) {
  if (finvenetoAthleteId) {
    return await fetchFinvenetoSheet(finvenetoAthleteId, code, name, refresh, debug);
  }

  const mappings = await findAthleteMappings(code, name, debug);
  const mappedIds = mappings.map((mapping) => mapping.finveneto_athlete_id).filter(Boolean) as string[];
  if (code && mappedIds.length) {
    return await fetchFinvenetoSheet(mappedIds[0], code, name, refresh, debug);
  }

  if (!name) {
    throw new Error("Nome e cognome necessari per risolvere automaticamente la scheda FIN Veneto");
  }

  const normalizedName = normalizePersonName(name);
  const index = await fetchFinvenetoIndex(refresh, debug);
  const indexIds = index
    .filter((candidate) => normalizePersonName(candidate.name) === normalizedName)
    .map((candidate) => candidate.finvenetoAthleteId);
  const candidateIds = [...new Set([...mappedIds, ...indexIds])];
  if (!candidateIds.length) {
    throw new Error("Atleta non trovato nell'indice Master FIN Veneto corrente");
  }
  if (candidateIds.length > 10) {
    throw new Error("Troppi atleti con lo stesso nome: inserisci anche il codice FIN");
  }

  const candidates = (await Promise.all(candidateIds.map(async (candidateId) => {
    try {
      return await fetchFinvenetoSheet(candidateId, code, name, refresh, debug);
    } catch (error) {
      debug.warnings.push(
        `Scheda FIN Veneto ${candidateId} ignorata: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }))).filter(Boolean) as Array<{ athlete: Athlete; races: Race[]; fromCache: boolean }>;

  if (!candidates.length) {
    throw new Error(code
      ? "Nessuna scheda FIN Veneto con nome e codice FIN corrispondenti"
      : "Nessuna scheda FIN Veneto valida trovata per questo nome");
  }
  if (!code && candidates.length > 1) {
    throw new AthleteAmbiguousError(candidates.map((candidate) => candidate.athlete));
  }

  return candidates[0];
}

async function mapWithConcurrency<T, R>(
  values: T[],
  limit: number,
  mapper: (value: T) => Promise<R>,
) {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await mapper(values[currentIndex]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return results;
}

async function fetchJson<T>(url: string, debug: DebugInfo) {
  debug.fetchedUrls.push(url);
  const { response, html } = await fetchHtml(url, { headers: BROWSER_HEADERS });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return JSON.parse(html) as T;
}

async function readNationalEventCache(
  code: string,
  event: NationalEvent,
  refresh: boolean,
  debug: DebugInfo,
) {
  if (refresh) return null;
  const fetchedAfter = new Date(Date.now() - FEDERNUOTO_CACHE_TTL_SECONDS * 1000).toISOString();
  const rows = await databaseSelect<ResultCacheRow<{ races: Race[] }>>("swim_results_cache", {
    select: "payload,fetched_at",
    athlete_code: `eq.${code}`,
    season: `eq.${event.season}`,
    source: "eq.federnuoto",
    cache_key: `eq.${event.id}`,
    fetched_at: `gte.${fetchedAfter}`,
    order: "fetched_at.desc",
    limit: "1",
  }, debug);
  return rows[0]?.payload?.races || null;
}

async function saveNationalEventCache(
  code: string,
  event: NationalEvent,
  races: Race[],
  debug: DebugInfo,
) {
  await databaseUpsert("swim_results_cache", {
    athlete_code: code,
    season: event.season,
    source: "federnuoto",
    cache_key: event.id,
    payload: { races },
    fetched_at: new Date().toISOString(),
  }, "athlete_code,season,source,cache_key", debug);
}

function parseMicroplusRaces(
  payload: Record<string, unknown>,
  event: NationalEvent,
  code: string,
) {
  const sport = payload.Sport as Record<string, unknown> | undefined;
  const competition = payload.Competition as Record<string, unknown> | undefined;
  const eventInfo = payload.Event as Record<string, unknown> | undefined;
  if (sport?.Cod !== "MA" || sport?.CodDisciplina !== "001") return [] as Race[];

  const parsedEvent = parseEvent(String(competition?.Ita || ""));
  const date = italianDate(String(eventInfo?.Date || "")) || event.end_date;
  if (!parsedEvent || !date) return [] as Race[];

  const races: Race[] = [];
  for (const row of (payload.data as Array<Record<string, unknown>> | undefined) || []) {
    if (String(row.PlaCod || "").trim() !== code) continue;
    const time = normalizeTime(String(row.MemPrest || ""));
    const timeSeconds = timeToSeconds(String(row.MemPrest || ""));
    if (!time || timeSeconds === null) continue;

    const rawChrono = String(row.MemRBatt || "").toUpperCase();
    const chrono = rawChrono === "A" || rawChrono === "M" ? rawChrono as "A" | "M" : null;
    const rawPosition = String(row.PlaCls ?? "").trim();
    const parsedPosition = /^\d+$/.test(rawPosition) ? Number(rawPosition) : null;
    const position = parsedPosition !== null && parsedPosition > 0 ? parsedPosition : null;
    const rawPoints = String(row.MemPoint ?? "").trim().replace(",", ".");
    const points = rawPoints ? Number(rawPoints) : null;
    const race: Omit<Race, "id"> = {
      source: "federnuoto",
      sourceType: "official",
      circuit: "campionati_italiani",
      date,
      season: event.season,
      meet: event.name,
      location: String(eventInfo?.Place || "") || null,
      event: eventLabel(parsedEvent.distance, parsedEvent.style),
      distance: parsedEvent.distance,
      style: parsedEvent.style,
      pool: event.pool,
      chrono,
      time,
      timeSeconds,
      position,
      points: points !== null && Number.isFinite(points) ? points : null,
      category: String(row.PlaCat || "") || null,
      club: String(row.TeamDescrIta || "") || null,
      sourceUrl: event.results_url || event.base_url,
    };
    races.push({ ...race, id: makeRaceId(race) });
  }
  return races;
}

async function fetchNationalEvent(
  code: string,
  event: NationalEvent,
  refresh: boolean,
  debug: DebugInfo,
) {
  const cacheKey = `federnuoto:${code}:${event.id}`;
  const cached = cacheGet<Race[]>(cacheKey, refresh);
  if (cached) return { races: cached, fromCache: true };

  const persisted = await readNationalEventCache(code, event, refresh, debug);
  if (persisted) {
    cacheSet(cacheKey, persisted, FEDERNUOTO_CACHE_TTL_SECONDS);
    return { races: persisted, fromCache: true };
  }

  const baseUrl = `${event.base_url.replace(/\/+$/, "")}/`;
  const counter = await fetchJson<{ contatori?: Array<{ cod?: string; nomefile?: string }> }>(
    new URL("Contatori.json", baseUrl).toString(),
    debug,
  );
  const files = [...new Set(
    (counter.contatori || [])
      .filter((entry) => entry.cod === "CGR1" && entry.nomefile)
      .map((entry) => entry.nomefile as string),
  )];

  const chunks = await mapWithConcurrency(files, 4, async (filename) => {
    const payload = await fetchJson<Record<string, unknown>>(new URL(filename, baseUrl).toString(), debug);
    return parseMicroplusRaces(payload, event, code);
  });
  const races = dedupeRaces(chunks.flat());
  cacheSet(cacheKey, races, FEDERNUOTO_CACHE_TTL_SECONDS);
  await saveNationalEventCache(code, event, races, debug);
  return { races, fromCache: false };
}

async function fetchFedernuoto(
  code: string,
  requestedSeason: string,
  refresh: boolean,
  debug: DebugInfo,
) {
  if (!code) throw new Error("Codice FIN non disponibile per cercare i Campionati Italiani");
  const catalog = await databaseSelect<NationalEvent>("swim_national_event_catalog", {
    select: "*",
    enabled: "eq.true",
    order: "start_date.asc",
  }, debug);
  const events = catalog.filter((event) => !requestedSeason || String(event.season) === requestedSeason);
  if (!events.length) {
    return {
      races: [] as Race[],
      fromCache: false,
      warnings: ["Nessun Campionato Italiano di nuoto configurato nel catalogo Supabase per le stagioni richieste"],
    };
  }

  const warnings: string[] = [];
  const results = await mapWithConcurrency(events, 2, async (event) => {
    try {
      return await fetchNationalEvent(code, event, refresh, debug);
    } catch (error) {
      warnings.push(`${event.name}: ${error instanceof Error ? error.message : String(error)}`);
      return { races: [] as Race[], fromCache: false };
    }
  });
  return {
    races: dedupeRaces(results.flatMap((result) => result.races)),
    fromCache: results.length > 0 && results.every((result) => result.fromCache),
    warnings,
  };
}

async function fetchNatatoriaIdentity(code: string, natatoriaId: string, refresh: boolean, debug: DebugInfo) {
  const cacheKey = `natatoria:${code}:${natatoriaId}`;
  const cached = cacheGet<Athlete>(cacheKey, refresh);
  if (cached) return { athlete: cached, races: [] as Race[], fromCache: true };

  const sourceUrl = `https://natatoria.com/nuoto_schedaatleta.php?lang=it&id_atleta=${natatoriaId}`;
  debug.fetchedUrls.push(sourceUrl);
  const { response, html } = await fetchHtml(sourceUrl, { headers: BROWSER_HEADERS });
  if (!response.ok) throw new Error(`Natatoria HTTP ${response.status}`);

  const foundCode = cleanText(html.match(/Codice:\s*([^<\r\n]+)/i)?.[1] || "");
  if (!foundCode) throw new Error("Codice FIN non trovato nella scheda Natatoria");
  if (code && foundCode !== code) throw new Error(`La scheda Natatoria ${natatoriaId} appartiene al codice FIN ${foundCode}`);

  const athlete: Athlete = {
    code: foundCode,
    natatoriaId,
    name: cleanText(html.match(/Cognome e Nome:\s*<b>([\s\S]*?)<\/b>/i)?.[1] || "") || null,
    birthYear: Number(html.match(/Anno nascita:\s*((?:19|20)\d{2})/i)?.[1]) || null,
    category: cleanText(html.match(/Categoria:\s*([^<\r\n]+)/i)?.[1] || "") || null,
    club: cleanText(html.match(/Societ(?:à|&agrave;):[\s\S]*?<b>([\s\S]*?)<\/b>/i)?.[1] || "") || null,
  };
  cacheSet(cacheKey, athlete, 6 * 60 * 60);
  return { athlete, races: [] as Race[], fromCache: false };
}

function dedupeRaces(races: Race[]) {
  const priority: Record<Source, number> = { federnuoto: 4, finveneto: 3, natatoria: 2, nuotomaster: 1 };
  const map = new Map<string, Race>();
  for (const race of races) {
    const key = [
      race.date || "",
      race.distance,
      race.style,
      race.timeSeconds.toFixed(2),
      normalizeName(race.meet || ""),
    ].join("|");
    const previous = map.get(key);
    if (!previous || priority[race.source] > priority[previous.source]) map.set(key, race);
  }
  return [...map.values()].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function mergeAthlete(base: Athlete, candidate?: Athlete) {
  if (!candidate) return base;
  return {
    ...base,
    code: base.code || candidate.code,
    name: base.name || candidate.name,
    club: base.club || candidate.club,
    category: base.category || candidate.category,
    birthYear: base.birthYear || candidate.birthYear,
    natatoriaId: candidate.natatoriaId || base.natatoriaId,
    finvenetoAthleteId: candidate.finvenetoAthleteId || base.finvenetoAthleteId,
  };
}

function parseSources(raw: string | null, code: string) {
  const sources = raw
    ? raw.split(",").map((item) => item.trim()).filter(Boolean)
    : code ? ["finveneto", "federnuoto", "nuotomaster"] : ["finveneto", "federnuoto"];
  const invalid = sources.filter((item) => !ALLOWED_SOURCES.includes(item as Source));
  if (invalid.length) throw new Error(`Fonti non valide: ${invalid.join(", ")}`);
  return [...new Set(sources)] as Source[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return jsonResponse({ error: "Metodo non supportato" }, 405);

  const url = new URL(req.url);
  const code = url.searchParams.get("code")?.trim() || "";
  const name = cleanText(url.searchParams.get("name")?.trim() || "");
  const requestedSeason = url.searchParams.get("year")?.trim() || "";
  const year = requestedSeason || String(new Date().getFullYear());
  const natatoriaId = url.searchParams.get("natatoriaId")?.trim() || "";
  const finvenetoAthleteId = url.searchParams.get("finvenetoAthleteId")?.trim() || "";
  const refresh = url.searchParams.get("refresh") === "true";
  const includeDebug = url.searchParams.get("debug") === "true";
  const debug: DebugInfo = { fetchedUrls: [], warnings: [] };

  if (!code && !name) return jsonResponse({ error: "Inserisci nome e cognome oppure il codice FIN" }, 400);
  if (code && !/^\d+$/.test(code)) return jsonResponse({ error: "Parametro `code` non valido" }, 400);
  if (name && normalizeName(name).split(" ").length < 2) {
    return jsonResponse({ error: "Inserisci sia il nome sia il cognome" }, 400);
  }
  if (!/^\d{4}$/.test(year)) return jsonResponse({ error: "Parametro `year` non valido" }, 400);
  if (natatoriaId && !/^\d+$/.test(natatoriaId)) return jsonResponse({ error: "Parametro `natatoriaId` non valido" }, 400);
  if (finvenetoAthleteId && !/^\d+$/.test(finvenetoAthleteId)) {
    return jsonResponse({ error: "Parametro `finvenetoAthleteId` non valido" }, 400);
  }

  let requestedSources: Source[];
  try {
    requestedSources = parseSources(url.searchParams.get("sources"), code);
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 400);
  }

  let athlete: Athlete = {
    code,
    name: null,
    club: null,
    category: null,
    birthYear: null,
    natatoriaId: natatoriaId || null,
    finvenetoAthleteId: finvenetoAthleteId || null,
  };
  const races: Race[] = [];
  const sources: Partial<Record<Source, SourceStatus>> = {};

  if (requestedSources.includes("nuotomaster")) {
    if (!code) {
      sources.nuotomaster = { ok: false, error: "Il codice FIN e necessario per interrogare NuotoMaster" };
    } else {
      try {
        const result = await fetchNuotomaster(code, year, refresh, debug);
        athlete = mergeAthlete(athlete, result.athlete);
        races.push(...result.races);
        sources.nuotomaster = { ok: true, fromCache: result.fromCache, count: result.races.length };
      } catch (error) {
        sources.nuotomaster = { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    }
  }

  if (requestedSources.includes("finveneto")) {
    try {
      const result = await fetchFinveneto(
        code,
        name || athlete.name || "",
        finvenetoAthleteId,
        refresh,
        debug,
      );
      athlete = mergeAthlete(athlete, result.athlete);
      races.push(...result.races);
      sources.finveneto = { ok: true, fromCache: result.fromCache, count: result.races.length };
    } catch (error) {
      if (error instanceof AthleteAmbiguousError) {
        return jsonResponse({
          error: error.message,
          codeRequired: true,
          candidates: error.candidates.map((candidate) => ({
            name: candidate.name,
            club: candidate.club,
            category: candidate.category,
            birthYear: candidate.birthYear,
          })),
          ...(includeDebug ? { debug } : {}),
        }, 409);
      }
      sources.finveneto = { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  if (requestedSources.includes("federnuoto")) {
    try {
      const result = await fetchFedernuoto(athlete.code, requestedSeason, refresh, debug);
      races.push(...result.races);
      sources.federnuoto = {
        ok: true,
        fromCache: result.fromCache,
        count: result.races.length,
        ...(result.warnings.length ? { warnings: result.warnings } : {}),
      };
    } catch (error) {
      sources.federnuoto = { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  if (requestedSources.includes("natatoria")) {
    if (!natatoriaId) {
      sources.natatoria = {
        ok: false,
        error: "Mapping Natatoria non ancora risolto: passa `natatoriaId` come override",
      };
    } else {
      try {
        const result = await fetchNatatoriaIdentity(athlete.code, natatoriaId, refresh, debug);
        athlete = mergeAthlete(athlete, result.athlete);
        races.push(...result.races);
        sources.natatoria = {
          ok: true,
          fromCache: result.fromCache,
          count: 0,
          warnings: ["Scheda atleta verificata; parser gare Natatoria da collegare all'endpoint manifestazioni"],
        };
      } catch (error) {
        sources.natatoria = { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    }
  }

  await saveAthleteMapping(athlete, debug);

  const successfulSources = Object.values(sources).filter((status) => status.ok).length;
  const response = {
    athlete,
    races: dedupeRaces(races),
    sources,
    fetchedAt: new Date().toISOString(),
    cache: {
      hit: Object.values(sources).some((status) => status.fromCache),
      ttlSeconds: 24 * 60 * 60,
      kind: hasPersistentCache() ? "supabase-and-memory" : "memory-only",
    },
    ...(includeDebug ? { debug } : {}),
  };

  return jsonResponse(response, successfulSources ? 200 : 502);
});
