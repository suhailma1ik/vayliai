# Supabase as Zusal's account and data foundation

Research: 17 October 2026. Assumptions: first 1,000 activated users receive 30 days, later users 14 days; Google and email/password login; Paddle paid subscriptions; usage metadata/history; ₹10,000/month total operating budget. No vendor selected, account created or implementation performed.

## Recommendation

Strong default candidate: Supabase combines hosted Postgres and authentication, avoiding separate auth/data vendors at launch. Recommend one Pro production project, local development, custom SMTP, and application-owned billing/CLI endpoints. Free is suitable for prototyping, not the financial basis for a reliable public launch. This is a design assessment, not a scale guarantee.

## Cost and production limits

Free includes 50,000 MAU, 500 MB database, 5 GB egress and 1 GB storage; inactive projects may pause after one week. Pro starts at $25/month, includes the first project at default compute, 100,000 MAU (then $0.00325/MAU), 8 GB disk and 250 GB egress; daily backups retain seven days. These allowances do not mean 1,000 active developers' event histories fit indefinitely. [Pricing](https://supabase.com/pricing)

Budget $25/month as the base, plus actual taxes/FX, email delivery and website hosting; reserve roughly ₹3,000/month for this base as a planning allocation, not a currency quote. Additional paid projects start around $10/month. Avoid unneeded custom Supabase domain, IPv4, PITR, branch compute and oversized compute initially. [Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)

Keep Pro spend cap enabled and monitor bills: it covers several quota-based items but not compute or optional add-ons, and reaching caps can restrict service. [Cost controls](https://supabase.com/docs/guides/platform/cost-control)

## Auth and email

Email/password, hosted email verification, and reset-password flows are documented. Google login is supported but needs our Google OAuth application, redirect configuration and production consent-screen setup. [Password auth](https://supabase.com/docs/guides/auth/passwords), [Google](https://supabase.com/docs/guides/auth/social-login/auth-google)

Custom SMTP is required for real public email signup/reset: built-in delivery is non-production, restricted to authorized team addresses and currently two messages/hour. Custom SMTP initially defaults to 30 messages/hour; adjust with the email provider before a launch surge. Configure domain authentication/deliverability and reserve separate sending capacity. Pro alone does not solve email delivery. [SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp)

## Data model and transactional decisions (proposed)

- Store users/profiles, CLI devices, activation grants, trial dates, usage events, daily aggregates, Paddle customer/subscription IDs and processed webhook IDs.
- Allocate the first-1,000 grant in one database transaction with a locked counter/slots, unique user grant and idempotent activation. Browser-side counting is unsafe. Database functions/RPC support multi-statement transactions. [RPC transactions](https://supabase.com/docs/reference/javascript/using-modifiers-rollback)
- Apply per-user RLS/grants to usage/history reads. Do not allow users to directly edit entitlement/grant tables or create authoritative billed events. Index user/timestamp and deduplicate event IDs. [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- Verify Paddle signatures on a backend; record event IDs and update subscription state transactionally. Handle duplicates, out-of-order events and reconciliation. This is application logic, not a turnkey Supabase entitlement feature.
- Retain only agreed metadata; choose detailed-history retention and aggregate older records to control database growth. MAU count is unlikely to be the first capacity bottleneck; workload, indexes, rows and ingestion rate need measurement.

## CLI pairing and hosting (proposed)

Keep privileged Supabase keys exclusively on the backend. Supabase secret/service-role keys bypass RLS and must never ship with the plugin. [API keys](https://supabase.com/docs/guides/getting-started/api-keys)

Use browser-authenticated, one-time CLI pairing followed by a separate random, scoped, revocable device credential stored hashed server-side. Scope devices to routing/usage endpoints, never billing administration. Supabase Auth handles website login; CLI pairing/token issuance is Zusal logic requiring design and tests, not assumed native device authorization.

No need to choose hosting now: frontend can use Supabase's HTTP client APIs with RLS; a backend handles pairing, telemetry and Paddle. Cloudflare Workers integration is documented, with runtime configuration requirements. For direct Postgres from ephemeral servers use transaction pooling, avoiding session-state assumptions. [Workers example](https://supabase.com/docs/reference/server/usage-examples), [connections](https://supabase.com/docs/guides/database/connecting-to-postgres)

## Selection conditions

Choose if we want fast managed auth plus relational reporting and can fund $25/month plus SMTP. Compare against a cheaper modular stack only if the saved base cost outweighs building/maintaining auth, backups and account security. Before production confirm backend host compatibility, email delivery, database region/latency, retention, ingestion load, RLS denial tests, restore process and webhook/device security.
