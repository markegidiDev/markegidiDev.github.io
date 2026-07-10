# AuraStats Supabase web setup

The dashboard uses `swim-results-aggregator`. Keep the existing
`nuotomaster-proxy` deployed until the new endpoint is working.

## Create the cache tables

1. Open **SQL Editor**.
2. Click **New query**.
3. Paste the complete contents of `swim-results-cache.sql`.
4. Click **Run**.

The script is idempotent: it is safe to run it again after an update.
It also seeds the catalog with the Riccione 2025, Indoor Torino 2025, and
Riccione 2026 national Master events.
Add future Italian swimming championships to `swim_national_event_catalog`
without changing the Edge Function.

For Riccione 2026 the catalog points to Microplus' structured JSON export at
`export/MA_2026_06_29-07_05_Riccione/MA`. The published `pdf/Book.pdf` remains
useful for people and as an archival reference, but the aggregator deliberately
uses `Contatori.json` and its `CGR1` result files: they expose athlete codes,
events, dates, times, positions, and points without requiring PDF text
extraction inside the Edge Function.

## Deploy the Edge Function

1. Open the Supabase project dashboard.
2. Select **Edge Functions** in the left sidebar.
3. Click **Deploy a new function** and select **Via Editor**.
4. Name the function `swim-results-aggregator`.
5. Replace the editor contents with `swim-results-aggregator/index.ts`.
6. Click **Deploy function**.
7. Open the deployed function details and disable the legacy JWT verification
   setting. AuraStats calls this read-only endpoint directly from the browser.

## Test from the dashboard

Use the built-in function tester with method `GET` and these query parameters:

```txt
name=Marco Egidi
debug=true
```

Expected: HTTP `200`, `athlete.code = "923530"`,
`athlete.finvenetoAthleteId = "535362"`, `sources.finveneto.ok = true`, and
the official FIN Veneto race history. The first request resolves the athlete
from the public Master GP index and stores the mapping in Supabase.

To aggregate FIN Veneto with the NuotoMaster summary, also pass the optional FIN
code:

```txt
name=Marco Egidi
code=923530
year=2026
debug=true
```

Expected: HTTP `200`, `sources.finveneto.ok = true`, and
`sources.nuotomaster.ok = true`. With `year=2026`, the seeded catalog also
attempts to return the athlete's official Indoor Torino 2025 and Riccione 2026
races through `sources.federnuoto`. Microplus can reset connections coming directly
from the Supabase Edge runtime even while the same JSON URLs work from a normal
browser or another server. In that case the response remains partial, the
source status contains a warning, and already imported rows in
`swim_results_cache` continue to work. This repository does not currently ship
the external scheduled importer needed to prefill that cache. If multiple FIN
Veneto athletes have the same name, the endpoint returns HTTP `409` and asks
for the FIN code.

To verify a Natatoria mapping manually while developing the Acquasport
provider:

```txt
name=Marco Egidi
code=923530
sources=finveneto,nuotomaster,natatoria
natatoriaId=431039
debug=true
```

The Edge Function uses the predefined `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` secrets to store mappings and FIN Veneto responses.
Do not expose the service-role key in `aurastats.html`.

## Current scope

- The public dashboard searches by first name and last name. The FIN code is
  optional and is required only to resolve homonyms or query NuotoMaster.
- FIN Veneto athlete resolution, official race parsing, and persistent cache
  are active.
- FIN national Master swimming events are read from
  `swim_national_event_catalog`; Microplus JSON responses are parsed and cached
  per athlete and event.
- NuotoMaster fetch and parsing run on the Edge Function when the FIN code is
  provided.
- The browser receives normalized JSON and no longer parses NuotoMaster HTML.
- Natatoria manual mapping validation is still available for development, but
  its Acquasport race scanner is not active yet.
- Add completed Italian Master swimming events to the catalog as their
  Microplus result URLs become available.
