# Zusal — account and data platform shortlist

Prepared 17 October 2026. For founder review; no platform selected, account created, or production spend authorized. This choice is separate from frontend framework and website hosting.

## Founder decision (supersedes recommendation below)

Founder selected Supabase starting on Free after comparing both free tiers. Auth, Postgres and compatible Edge Functions are the initial backend direction. Do not silently upgrade to Pro. Existing Node server needs runtime compatibility/adaptation review; Jev, production SMTP, domain and frontend hosting are separate costs. Free-tier limits, inactivity pausing, backup gaps and a measured upgrade trigger must be addressed before public paid launch. No account/project created.

## Requirements

Google and email/password authentication, verification/reset, account-scoped usage/history, CLI pairing and revocation, atomic first-1,000 trial grants, Paddle webhook deduplication and subscription entitlements. Total operating budget INR 10,000/month including assessment and other services. No provider-key vault or agent harness backend.

## Three candidates

| Option | Best reason to choose | Main tradeoff |
| --- | --- | --- |
| Supabase Auth + Postgres | One account/data service; relational SQL fits users/devices/grants/subscriptions/events and reporting; transactional grants and row-level policies | Production baseline and email costs; database ingestion/storage/query limits still need measurement |
| Firebase Auth + Firestore + backend functions | Integrated managed authentication/document storage; usage-based costs can be low at small traffic | Document/read-write billing and report/query design need care; paid billing required for Functions deployment |
| Clerk + separate Postgres (e.g. Neon) | Strong prebuilt account UI and identity/CLI integration capabilities; flexible separate database | Two service boundaries and identity synchronization; auth pricing alone is not full-platform cost |

## Recommendation

Supabase is the preferred overall foundation for this product, based on relational data fit and fewer integrations, not a measured speed/security superiority claim. Use local/free development as appropriate; plan one Pro production project from USD 25/month, plus production SMTP, website/backend hosting, usage overages/add-ons and applicable tax/FX. Keep production project count and compute deliberate.

Supabase default SMTP is not for public production signup. Choose email delivery separately. Postgres RLS and transactional first-1,000 allocation are implementation requirements, not automatic benefits requiring no tests. Do not ship admin/service-role credentials in the CLI or browser.

Firebase and Clerk remain viable alternatives. All options still require Zusal application logic for usage ingestion, entitlements, idempotent billing reconciliation and secure authorization. Paddle remains selected; vendor-native billing modules do not replace that decision.

## Hosting compatibility

Sites hosted identity defaults to ChatGPT sign-in and its skill requires confirming supported capabilities before adding external identity. User explicitly requires Google and email/password. Do not silently substitute ChatGPT identity or assume these external auth options work in Sites hosting. Choose/verify deployment separately, preserving the requested sign-in methods.

## Evidence

- [Supabase pricing](https://supabase.com/pricing)
- [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Firebase pricing](https://firebase.google.com/pricing)
- [Firestore operation pricing](https://firebase.google.com/docs/firestore/pricing)
- [Clerk pricing](https://clerk.com/pricing)
- Specialist reports: `platform-supabase.md`, `platform-firebase.md`, `platform-clerk.md`.

Decision pending founder selection. Included authentication users are not a guarantee that event volume or full operating spend fits budget.
