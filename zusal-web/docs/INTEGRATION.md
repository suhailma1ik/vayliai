# Website / harness contract

The website does not proxy inference. Pi/DeepSeek Harness retains provider credentials, makes inference calls, and reports execution metadata. This repository does not modify either harness. The existing Pi prototype has not yet implemented the following production account contract.

## Device login

All function calls are POST JSON to `https://PROJECT.supabase.co/functions/v1/NAME`. Browser requests have one exact `APP_ORIGIN`. CLI requests have no browser Origin. Custom device credentials are **not Supabase user JWTs**; the Edge functions verify them against SHA-256 hashes server-side.

1. `pair-start` with `{ "name": "My Mac · Pi" }`. Server returns a random `device_code`, a human `user_code`, verification URLs, 600-second expiry, and a 5-second polling interval. Treat the device code as a secret. Gateway must supply a trustworthy client IP for the persisted rate limit.
2. Open `verification_uri_complete`. User signs in, reviews the named requesting device, and explicitly approves it. Manual entry on `/app/approve` works for headless machines. Approval does not start a trial.
3. `pair-poll` with `{ "device_code": "…" }` every five seconds. Pending returns `authorization_pending`. Approved returns a one-time `zusal_…` scoped token. Store in the native OS credential store; do not log, print, embed in URLs or commit it. A lost response after one-use consumption requires restarting pairing.
4. `entitlement` with `Authorization: Bearer zusal_…` before routing. States: `not_activated`, `trial`, `paid`, `grace`, `expired`. The first state permits the bootstrap request; `expired` denies routing. Fail closed on unavailable/unknown status. Dashboard access is independent.
5. Report a real completed provider execution call to `ingest-usage` using the same bearer token. Decision-only, health checks and Jev assessment calls must not be reported as model requests. The harness, not a caller-supplied flag, determines what is a real execution.

```json
{
  "id": "stable-unique-execution-call-id",
  "occurred_at": "2026-10-18T07:00:00.000Z",
  "model": "provider/model-id",
  "provider": "provider-id",
  "status": "successful",
  "input_tokens": 123,
  "output_tokens": 456,
  "estimated_cost_usd": 0.002,
  "routing_reason": "task_complexity_balanced",
  "routing_ms": 180,
  "response_ms": 1240
}
```

Only listed fields are accepted. `status` is `successful`, `failed`, or `canceled`; unknown usage/cost/timing is `null`. Reason is a bounded enum-like code, never free-form conversation text. Each retry/tool continuation execution has its own stable ID. Retrying delivery uses the **same ID**. At-most-once accounting and activation are in one database transaction. Reports may be at most 24 hours old or 5 minutes ahead. Do not backfill historical prototype requests to claim a trial.

The first accepted successful report starts one immutable grant: 30 days for accepted activation positions 1–1,000, otherwise 14 days. The server serializes the account and launch counter. This is proof of an authenticated device report, **not independent proof that a model actually executed**. The harness must gate dispatch and report honestly; a local plugin is not tamper-proof licensing. Stronger abuse controls require separately designed signed execution evidence or a trusted service. No new inference proxy is introduced here.

## Billing

`billing` accepts an authenticated, verified Supabase user token. Checkout accepts a fixed `monthly` or `yearly` interval, never a caller-supplied amount/price. It creates the transaction server-side and returns its ID for Paddle.js. Portal returns the Paddle customer portal. Entitlements come from signature-verified webhooks, never browser checkout completion callbacks.

Subscribe to `transaction.completed` and subscription lifecycle events. The first successful transaction must correlate with a server-created checkout intent and customer. Replayed event IDs and older events do not overwrite newer state. Paid renewal grace uses the original failed period timestamp; repeated updates do not extend it. Cancellation keeps access to the paid period end. A fresh checkout for a canceled subscription needs the reconciliation workflow described in LAUNCH.md before live enablement.

## Operational jobs

- Schedule `select public.prune_usage()` daily using Supabase Cron. Retention: request detail 30 days; daily summaries 12 months; internal usage replay receipts 31 days; expired pairing/rate buckets removed after one day; billing-event IDs 90 days. Row policies enforce visible history boundaries even if a cleanup run is late.
- Schedule `trial-reminders` hourly using a server-side secret bearer header. Never embed the scheduler secret in a public page or URL. Worker claims rows with a lease, sends at most five per invocation and reserves a maximum 20 reminder deliveries/day to leave capacity for auth mail. Resend idempotency keys and persisted delivery markers prevent normal duplicate sends. Verify delivery and quota behavior in staging.
- Reminder emails are skipped after conversion/deletion; an already in-flight message can race with conversion. Authentication email uses Supabase SMTP configured to Resend, separately from this worker.

Daily token/cost sums carry missing-value counters. Reporting continues to record already executed calls even if a trial expires before delayed delivery; the harness checks entitlement before dispatch. Provider pricing/cost calculation remains the harness's responsibility.
