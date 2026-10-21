# Firebase account and usage foundation

Research date: 17 October 2026. Planning only; no project, account or implementation created. Zusal: Google/email-password accounts, verified email/reset, CLI pairing, first 1,000 activation grants, trials, Paddle subscriptions, usage summary/history. Worldwide; India proprietor; ₹10,000 total monthly operating budget.

## Recommendation

Firebase is a viable low-maintenance candidate: Authentication + Firestore + a trusted API layer. Use Blaze for a Firebase Functions backend; retain base Firebase Auth unless Identity Platform features justify upgrading. It is attractive if the team prefers Google-managed infrastructure and document data. It is less natural than PostgreSQL for relational subscription/event reporting and ad hoc analytics. Do not choose it on the assumption all 1,000 users and request histories will remain free.

Firebase can support a frontend hosted elsewhere; choosing Firebase Auth/Firestore does not itself choose Firebase Hosting or App Hosting. Backend runtime compatibility still needs a deployment check, particularly if considering edge-only environments.

## Authentication and pricing distinction

- Google and email/password are supported; verification and password reset SDK flows exist. Configure real production redirect domains and test provider linking so the same person does not receive duplicate trial grants. [Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [manage users](https://firebase.google.com/docs/auth/web/manage-users).
- Base Firebase Authentication lists other authentication services as no-cost, subject to operational quotas. Optional **Authentication with Identity Platform** changes limits/pricing: Spark 3,000 DAU for common providers; Blaze first 50,000 MAU no-cost, with usage pricing above. Do not apply these MAU charges to base Auth or call Identity Platform mandatory for Google/email. [Auth upgrade distinction](https://firebase.google.com/docs/auth), [pricing](https://firebase.google.com/pricing).
- Verification email limits: Spark 1,000/day vs Blaze 100,000/day; reset emails 150/day vs 10,000/day. New registrations have a per-IP quota; abuse controls may impose additional restrictions. [Auth limits](https://firebase.google.com/docs/auth/limits).
- Base Auth does not include Identity Platform's additional enterprise SLA/features. App Check enforcement for Authentication requires Identity Platform. Decide whether that upgrade is worth its changed pricing/limits rather than implying all protection is included. [Auth FAQ](https://firebase.google.com/docs/auth/faq-and-troubleshooting).

## Firestore data and cost

Firestore's free database allowance is one database/project: **1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 10 GiB monthly outbound**. Reads/writes beyond allowance, indexes/storage, bandwidth, and some query index reads are billable at location-specific rates. TTL deletion, PITR/backups/restores are not part of free usage. [Billing details](https://firebase.google.com/docs/firestore/pricing).

For perspective, 1,000 users × 100 requests/day = 100,000 history inserts/day before summary updates, subscription events and dashboard reads. This exceeds the free write allowance; it does not by itself imply a large bill. Budget from actual event volume, document size, indexes, retention, location and queries, not user count alone.

Keep per-user daily/model summaries and cursor-paginated request history. Do not scan every request on every dashboard refresh. Realtime listeners bill for changes and can incur repeat reads after reconnects; aggregate queries also have index-read billing. Offset pagination wastes reads. Use bounded date filters, cursors and explicit retention. Firestore is not a SQL joins/reporting engine.

## Required trusted backend logic

1. **First 1,000:** one transaction reads the launch counter and user's activation grant, then assigns a once-only cohort/trial and increments count only if eligible. Use server time. Idempotency and contention retries are necessary; a normal sharded approximate counter is inappropriate for an exact cap. Retry exhaustion must be handled. [Atomic transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [transaction contention](https://firebase.google.com/docs/firestore/transaction-data-contention).
2. **Expiry:** check trial/subscription timestamps when authorizing service. TTL is cleanup only; deletion is usually within 24 hours and not immediate. [TTL behavior](https://firebase.google.com/docs/firestore/ttl).
3. **CLI pairing:** build a short-lived, single-use browser-approved exchange; issue a scoped, revocable device credential. Firebase Auth provides identity, not a complete scoped device-authorization product. Do not hand the CLI an unrestricted account refresh token or Admin credential. Session cookies support server websites but do not replace device authorization. [Session cookies](https://firebase.google.com/docs/auth/admin/manage-cookies), [custom tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens).
4. **Paddle:** trusted HTTP endpoint verifies the original body/signature, deduplicates event IDs and applies entitlement transitions transactionally. Functions exposes the wire-format body. Firebase does not automatically reconcile billing states for Paddle. [Functions rawBody reference](https://firebase.google.com/docs/reference/functions/2nd-gen/node/firebase-functions.https.request).
5. **Isolation:** owner reads only; privileged writes for grants/billing/aggregates. Direct web/mobile Firestore access uses Security Rules. Server SDK bypasses Rules, so API owner checks and restricted IAM are essential. Rules are not query filters. [Security conditions](https://firebase.google.com/docs/firestore/security/rules-conditions).

## Functions and production budgeting

Spark does not provide deployed Cloud Functions; Blaze links Cloud Billing. Firebase lists a functions no-cost invocation allowance, but compute/network/build/artifact costs also matter and depend on deployed generation and region. Do not promise free functions simply because invocation count is below 2 million. Keep minimum instances at zero initially, set sensible scaling limits, remove old artifacts, and measure cold starts. [Pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans), [function management](https://firebase.google.com/docs/functions/manage-functions).

Current Firebase supports service **spend caps** for Functions, App Hosting, AI Logic and Extensions. These are distinct from alerts, do not include Firestore, and are not hard caps because enforcement lags usage. Alerts alone never pause service. Leave budget headroom and plan degraded behavior if a cap pauses billing webhooks or pairing. [Current spend-cap documentation](https://firebase.google.com/docs/projects/billing/spend-caps).

Allocate only a portion of ₹10,000 to account/data hosting; Jev and the rest of the product still need budget. No exact rupee monthly estimate is defensible until region and event volume are selected. Use separate production/test projects, choose database region deliberately, define retention/backups, and test account isolation, concurrent activation and duplicate/out-of-order billing events before launch.

## Decision summary

Strong option for managed login and fast document-backed dashboards with little server upkeep. Main compromises: Firestore query-based billing, custom entitlement/device logic, weaker fit for relational analytics, and Google-specific data rules/SDK coupling. Recommend shortlist rather than automatic winner; compare against an integrated PostgreSQL platform and an auth-plus-SQL stack on total implementation and operating effort.
