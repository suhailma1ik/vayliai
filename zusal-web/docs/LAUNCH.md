# Launch checklist

## Implemented and locally checked

- Astro marketing pages, Pi/DeepSeek and native OS installation tabs, pricing toggles, written documentation, and labeled demo.
- Google/email-password UI, verification/reset flows, HttpOnly encrypted session storage handler, account/profile/device/deletion UI.
- Usage overview/history, calendar date controls, model/status filters, request expansion, CSV escaping, retained daily summaries, theme controls and responsive layouts.
- Supabase schema with tenant RLS, restricted column updates, metadata validation, atomic one-use pairing, hashed device credentials, idempotent usage, serialized trial grants, paid entitlement states, signed billing webhook handler, and reminder worker.
- Database tests use actual PostgreSQL semantics through PGlite. They are not a hosted-Supabase integration test.

## Required service setup

1. Create the Supabase project, select region, apply `supabase/migrations/202610180001_core.sql`, deploy functions using `supabase/config.toml`, and configure auth rate limits/CAPTCHA where appropriate. Verify gateway IP forwarding cannot be spoofed before exposing `pair-start`.
2. Enable Google plus email/password, require email confirmation, configure production Site URL and exact callback/reset URLs. Configure Resend SMTP with a verified domain. Do not use broad production redirect wildcards. Verify account-linking behavior; no custom identity merging is implemented.
3. Connect Netlify to this project folder. Set `.env.example` values in Netlify; set server-only `APP_ORIGIN` and a random 64-hex-character `AUTH_COOKIE_KEY`. Generate the key locally using a trusted secrets tool and store it directly in Netlify. Never put it in a PUBLIC_ variable. Session cookies require HTTPS; use a Netlify deploy preview or HTTPS local function environment to test authenticated flows. Static Astro preview exercises the UI only; it does not run Netlify Functions.
4. Set Supabase function secrets from `supabase/.env.example`; Supabase supplies its URL and service-role key in that runtime. Never use a service key in frontend builds. Configure Paddle sandbox prices at $5/month and $50/year (same feature plan), sandbox client token, customer portal and webhook destination/events. Verify tax display in actual checkout.
5. Schedule retention cleanup and trial reminder jobs, protect the scheduler secret, monitor failures, and keep transactional auth email ahead of trial marketing/reminders. Verify Resend quotas before 1,000 users; free service limits are not a promise of capacity.
6. Add the actual Discord invite/private-ticket channel and release URL only when available. Add a domain, verified sender and operational/legal contacts.

## Product integration and evidence

- Connect both harness adapters to `docs/INTEGRATION.md`. Website code does not implement `zusal login` in `pi-router` or add a DeepSeek adapter. Preserve harness-owned inference.
- Verify native install/login/revoke/dispatch/reporting on macOS, Linux and Windows. A website browser check cannot establish CLI compatibility on these operating systems.
- Run hosted multi-account RLS tests, Google/email confirmation/reset/logout flows, expired sessions, cookie refresh across navigation/tabs, device approval/expiry/replay/revocation, account deletion with recent authentication and subscription cancellation failure. Test revoked sessions and token expiry against configured Supabase Auth settings.
- Run Paddle sandbox checkout, duplicate click, portal, cancellation, failed renewal/recovery, webhook retries/out-of-order events, account deletion, refund/chargeback and canceled-account resubscription scenarios. Refund/chargeback policy and canceled-subscription reconciliation are not complete launch features. Keep LIVE_BILLING_READY=false until these work and commercial policies are settled.
- Entitlement can permit a first bootstrap request before a trial is granted. Device completion metadata is not tamper-proof evidence of provider execution; define abuse controls appropriate for a local plugin.
- Load test reporting and dashboard export with realistic usage. Full retained detail is paged in 1,000-row batches; high-volume accounts may need a server export job/aggregated queries before broad launch.

## Founder/legal inputs still needed

Operator identity/contact/address, final domain, refund/cooling-off policy, fair-use allowance, trial eligibility/abuse rules, deployment regions/processor agreements, and billing-record retention. Terms/privacy are visibly labeled drafts. No promise of equivalent answer quality, verified savings, unlimited usage, or cross-platform readiness is made.

## Release and rollback

Keep a staging Supabase project and Paddle sandbox separate from production. Take a database backup before migration. First expose a Netlify preview, run hosted checks, then launch to a small cohort. Watch pairing/ingestion failures, webhook failures/lag, duplicate billing, reminder sends and database growth. Log request IDs and error categories only—never credentials or raw payloads. Revert frontend through Netlify deploy rollback; disable live checkout/ingestion independently if needed. Do not roll back database records by deleting user data. Version future migrations forward.

Aggregate acquisition analytics default to disabled. A minimal endpoint and opt-in build flag count page/day event totals without visitor identifiers, URL queries or authentication. Enable both ANALYTICS_ENABLED and PUBLIC_ANALYTICS_ENABLED only after reviewing the final privacy disclosure and hosting-provider logs. Counts are approximate events, not unique visitors or verified signups. No advertising scripts or external analytics are loaded.
