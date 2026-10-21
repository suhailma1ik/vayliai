# Zusal website — implementation contract

Implementation authorized 18 October 2026 after requirements discovery. Source of product decisions: ../zusal-planning/requirements.md; latest conversation overrides older proposals. Apply all five latest recommendations: written guides first, system theme with saved override, metadata routing/response durations, labeled interactive illustration, aggregate funnel analytics without advertising tracking.

## Capabilities and build order

| Module | Responsibility | Depends on |
|---|---|---|
| foundation | Astro static output, tokens, brand, accessible layouts | — |
| identity | Supabase browser auth, profile, device approval/settings | foundation |
| reporting | metadata history/filter/CSV, daily overview | identity |
| billing | Paddle checkout/portal, webhook state | identity |
| public-site | Home/download/pricing/docs/policies | foundation |
| service | schema, RLS, metadata ingestion, trial grants, pairing, deletion | identity contract |

No new approval gates: owner explicitly authorizes implementing with reasonable defaults. No paid upgrades, production registrations, publication or external messages without appropriate configuration/authorization. New project separate from existing pi-router.

## Boundaries

Astro + React, Netlify static output, Supabase Auth/Postgres/Edge Functions, Resend SMTP, Paddle. No provider keys, prompts, code or responses stored in analytics. Missing live configuration disables real mutations clearly; illustrative data only behind explicitly labeled demo route/mode, never silently shown as real usage. No fake download artifacts or deployed backend claims. No modifications to router or unverified DeepSeek compatibility claims. Final legal policies/refund/usage caps/business contact details are launch blockers, not invented terms.

## Commands

`npm run dev`, `npm run check`, `npm test`, `npm run build`, `npm run preview`.

## UI acceptance

All approved pages exist. Both themes, system default, remember override; keyboard/mobile/reduced-motion support. Public content prerendered. Dashboard one coherent React application; overview/history/billing/settings/device approval. History counts execution calls including retries/tools, 30 days; summaries 12 months. Date filters 7d default/today/30d/custom local time, pagination/model/status filtering, CSV safety, nullable metrics. No estimated savings. Per-user/private data never prerendered.

## Security and verification

Fail-closed server authorization, owner RLS, no secret browser keys, signed/idempotent Paddle webhooks and immutable activation grants. Service functions tested through pure validation/entitlement helpers where practical; database concurrency/RLS and live integrations require configured Supabase verification before launch. Test build, typecheck, data transformations, auth/config failures, browser navigation/responsive/key flows with available browser tools. Document setup and unverified live-service dependencies.
