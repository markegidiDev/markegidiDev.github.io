create table if not exists public.swim_results_cache (
  id uuid primary key default gen_random_uuid(),
  athlete_code text not null,
  season int not null,
  source text not null,
  cache_key text not null,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  unique (athlete_code, season, source, cache_key)
);

create table if not exists public.swim_athlete_source_map (
  athlete_code text primary key,
  natatoria_id text,
  finveneto_athlete_id text,
  athlete_name text,
  athlete_name_normalized text,
  birth_year int,
  club text,
  updated_at timestamptz not null default now()
);

alter table public.swim_athlete_source_map
  add column if not exists athlete_name_normalized text;

create index if not exists swim_athlete_source_map_name_idx
  on public.swim_athlete_source_map (athlete_name_normalized);

create table if not exists public.swim_national_event_catalog (
  id text primary key,
  name text not null,
  base_url text not null,
  results_url text,
  start_date date not null,
  end_date date not null,
  season int not null,
  pool int not null check (pool in (25, 50)),
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.swim_national_event_catalog (
  id,
  name,
  base_url,
  results_url,
  start_date,
  end_date,
  season,
  pool
) values (
  'riccione-estivi-2026',
  'Campionato Italiano di Nuoto Master Herbalife',
  'https://fin2026.microplustiming.com/export/MA_2026_06_29-07_05_Riccione/MA',
  'https://fin2026.microplustiming.com/MA_2026_06_29-07_05_Riccione.php',
  '2026-06-29',
  '2026-07-05',
  2026,
  50
), (
  'torino-indoor-2025',
  'Campionati Italiani Indoor Unipol di Nuoto Master',
  'https://fin2025.microplustiming.com/export/MA_2025_12_06-08_Torino/MA',
  'https://fin2025.microplustiming.com/MA_2025_12_06-08_Torino.php',
  '2025-12-06',
  '2025-12-08',
  2026,
  25
), (
  'riccione-estivi-2025',
  'Campionati Italiani di Nuoto Master Herbalife',
  'https://fin2025.microplustiming.com/export/MA_2025_06_24-29_Riccione/MA',
  'https://fin2025.microplustiming.com/MA_2025_06_24-29_Riccione.php',
  '2025-06-24',
  '2025-06-29',
  2025,
  50
)
on conflict (id) do update set
  name = excluded.name,
  base_url = excluded.base_url,
  results_url = excluded.results_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  season = excluded.season,
  pool = excluded.pool,
  updated_at = now();

alter table public.swim_results_cache enable row level security;
alter table public.swim_athlete_source_map enable row level security;
alter table public.swim_national_event_catalog enable row level security;
