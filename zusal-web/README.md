# Zusal website

Astro + React website and usage dashboard, with a Supabase backend and Paddle billing integration source. Built for individual developers with their own provider accounts.

## Local preview

```sh
npm ci
npm run dev -- --ignore-lock
```

Open http://127.0.0.1:4321 and `/app/demo`. Without service environment variables, auth forms are disabled and real accounts show an explicit connection state. Sample activity appears only in the labeled demo. No credentials, provider requests, payments or emails are simulated as successful.

```sh
npm run check
npm run check:edge
npm test
npm run build
npm run preview -- --ignore-lock --port 4322
```

Browser verification uses Playwright and axe against the built site:

```sh
npx playwright install chromium
npm run test:browser
```

Alternatively set `CHROME_EXECUTABLE` to a local Chrome binary. `TEST_BASE_URL` defaults to `http://127.0.0.1:4322`. Tests use a fresh isolated browser profile and no personal sessions. Screenshots are saved in `artifacts/`.

## Live setup

Copy `.env.example` to `.env` only for local configuration. Netlify also runs the HttpOnly session handler; a static Astro server alone cannot authenticate. Use HTTPS deploy previews for complete testing. Keep encryption, service, Paddle and mail keys out of PUBLIC_ variables. See [launch setup](docs/LAUNCH.md), [harness contract](docs/INTEGRATION.md) and [source references](docs/SOURCES.md).

Production launch still requires configured services, approved billing and final policies, hosted integration tests, and actual harness integration/release verification. Nothing has been deployed or charged by creating these files.

## Structure

- `src/pages`, `src/styles`, `src/components`: public pages, auth and dashboard.
- `src/lib`: typed metadata, calculations, CSV, auth redirect and client adapters.
- `netlify/functions/auth-storage.ts`: origin-checked encrypted HttpOnly refresh-token/PKCE persistence. Access tokens remain in memory.
- `supabase/migrations`: tables, RLS, atomic activation/pairing/accounting, billing deduplication and cleanup.
- `supabase/functions`: user/device-authenticated handlers and Paddle webhook/reminder worker.
- `tests`: calculation, injection, cookie, signature and PostgreSQL behavior tests.

Existing `../pi-router` is intentionally separate and unchanged.
