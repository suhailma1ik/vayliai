# Clerk + managed Postgres candidate

Research date: 17 October 2026. Requirements: Google plus email/password login, verify/reset, private usage/request history, CLI account connection, atomic first-1,000 activation promotion, Paddle paid subscriptions. ₹10,000 is the budget for the whole product, not authentication alone. Planning only.

## Assessment

Clerk + Neon Postgres is a realistic challenger to Supabase. Prefer Clerk if polished account UI and specialist authentication tooling are worth joining two systems. Prefer Supabase for Zusal's current scope because integrated auth/Postgres reduces identity/data plumbing and gives a straightforward relational store for usage, entitlements and billing records. Firebase remains capable, but document/operation-oriented modeling is a less natural fit for our SQL-style history and reporting. These are architectural judgments, not performance benchmarks.

## Auth evidence

- Current Clerk Hobby covers 50,000 monthly retained users (MRU) per app, not MAU. A user counts when returning at least 24 hours after signup. Hobby includes passwords and up to three social providers, user-sync webhooks, and a custom domain; retains Clerk branding, fixes session lifetime at seven days and has one-day application-log retention. Free is usable for a constrained production feature set; it is not all Pro functionality. [Pricing](https://clerk.com/pricing).
- Pro lists $20/month billed annually; Clerk's own current pricing explainer lists $25/month on monthly billing. This is auth cost, not total application cost. [Official pricing explanation](https://clerk.com/articles/clerk-pricing-explained).
- Email/password signup with email verification and forgot-password flows are documented. Prebuilt UI is available; custom forms require implementing the SDK flow. [Email/password](https://clerk.com/docs/guides/development/custom-flows/authentication/email-password), [reset](https://clerk.com/docs/guides/development/custom-flows/authentication/forgot-password).
- Google production login needs Zusal's own Google OAuth credentials and production configuration; development shared credentials are insufficient for public launch. [Google integration](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google).
- Development instances have a 100-user cap, separate identity data, and broad access to paid features that may require upgrade in production. Do not mistake the development cap for the production free-user allowance. [Environments](https://clerk.com/docs/guides/development/managing-environments).
- Clerk now explicitly documents OAuth Device Authorization Grant for CLI pairing, with a hosted verification page, short-lived codes and token polling. Also supports public clients without embedding a secret. Exact OAuth/token quota and pricing should be checked in chosen production plan before final architecture; do not assume web MRU covers every machine-auth product. [Device flow](https://clerk.com/docs/guides/configure/auth-strategies/oauth/device-authorization-grant).

## What is additional

Clerk user metadata is not our usage database. Zusal must provide application APIs, store request records and subscription state, enforce ownership on every query, and verify Paddle webhooks. Use a stable Zusal user ID linked to Clerk and Paddle IDs. Deletion, synchronization and retries span systems. Clerk's official Neon integration demonstrates that separate project/database setup and application schema remain required. [Clerk + Neon guide](https://clerk.com/docs/guides/development/integrations/databases/neon).

Suggested database candidate: **Neon Postgres**. Current live pricing shows free 100 CU-hours/project/month and 1GB storage; idle compute suspends after five minutes. Launch is usage-based at $0.106/CU-hour plus $0.35/GB-month storage, with no monthly minimum. History, egress and other services can add cost. These are current live figures; older Neon articles show superseded quotas. [Live pricing](https://neon.com/pricing).

Illustrative always-active minimum database compute: 0.25 CU × 730 hours × $0.106 = approximately $19.35/month, plus storage/history/other usage. This is arithmetic, not a forecast; actual scale and runtime change it. Free-tier suitability cannot be inferred from user count: frequent CLI events may keep compute active, and history retention drives storage. Frontend/API hosting, application emails, monitoring, backups, Paddle fees and Jev costs remain separate. Total stack cost is unknown until event rate, retention and hosting are selected; no INR conversion or whole-budget guarantee is made.

## Required application logic (our proposal)

- Per-user request history in Postgres with owner-scoped access; aggregate requests/tokens/model costs for charts.
- Promotion allocation in one server-side database transaction: unique grant per user plus locked/atomic bounded counter. Never use a frontend count or Clerk metadata alone to guarantee the first 1,000 activations.
- Server verifies Paddle webhook signatures, records processed event IDs, reconciles subscription state, and derives paid access. Keep Paddle as selected billing provider; do not substitute Clerk Billing.
- CLI identity proves the user; the backend separately checks subscription/trial access. Account login does not imply routing entitlement.

## Comparative burden

| Candidate | Core advantage | Additional Zusal work |
|---|---|---|
| Supabase Auth + Postgres | Auth and app data share Postgres; JWT/RLS integration | Custom UI, SMTP/Google setup, server-side promo/billing logic |
| Clerk + Neon | Specialist prebuilt account flows and documented CLI OAuth | Two-vendor identity/data mapping, app authorization/APIs, separate database budget |
| Firebase Auth + Firestore | Broad SDK ecosystem; server transactions supported | Document model, aggregations and operation budgeting, app-specific promo/billing logic |

Sources: [Supabase architecture](https://supabase.com/docs/guides/auth/architecture), [Supabase Auth/RLS](https://supabase.com/docs/guides/auth), [Firebase pricing](https://firebase.google.com/pricing), [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions). None provides Zusal's first-1,000 launch rules or Paddle entitlement integration automatically.
