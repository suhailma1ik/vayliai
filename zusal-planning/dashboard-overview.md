# Dashboard option: overview first

17 October 2026. Design proposal only; not approved, no implementation. Audience: individual developers. Confirmed metrics: request counts, selected models, token usage, estimated model-provider cost. No estimated savings. Dashboard does not manage provider credentials.

## Proposed hierarchy

1. Compact title with date range and freshness indicator. Default current calendar month in the user's display timezone; display timezone explicitly. Presets: today, 7 days, 30 days, month to date; custom range. Default is a proposal, not settled.
2. One restrained four-metric strip: requests, estimated provider cost, total tokens, distinct selected models. Model diversity is descriptive, not an achievement. Model distribution below answers which models were selected.
3. Primary trend: requests over time; toggle to tokens or estimated cost. Show readable axes and no chart decoration. Granularity follows range; label partial current day.
4. Model distribution table: model, requests, tokens, estimated cost. A small proportional bar is optional; table stays readable and accessible without color.
5. Recent requests, at most five to ten rows: timestamp, model, tokens, estimated cost, status when measured. Link to dedicated Request History for full filtering/detail.
6. Small subscription/trial status and manage-billing link. Promote this to a banner only when action is due. No giant trial countdown or promotional carousel.

## Why this should be default

An overview answers whether Zusal is connected, being used and where requests are going in one screen. It balances the product's routing purpose with spending transparency and fits the confirmed separate Request History and Billing pages. Compact charts and tables prevent the generic card-grid dashboard appearance.

Costs should always read **Estimated provider cost**, distinct from the Zusal subscription paid through Paddle. No comparison baseline, cost reduction claim, quality guarantee or savings number. Missing token/price data must stay unknown/partial, not become zero.

## Alternatives and tradeoffs

| Option | Strongest use | Tradeoff |
|---|---|---|
| Overview first | Returning developer wants a quick health/usage summary | One click needed for request-by-request debugging |
| Activity first | Developer validating a new installation or investigating routing | Summary and month-level spending become secondary |
| Cost first | Developer primarily watching provider spending | Overemphasizes estimates and can imply provider billing authority we do not have |

Recommendation: overview first, with recent activity immediately available and a prominent Request History link. On first activation, temporarily emphasize the first request/setup state; no need to make every later dashboard visit activity-first.

## Empty, trial and incomplete-data states

- Before CLI connection: clear setup checklist, choose Pi or DeepSeek instructions, verification of connection. Do not show synthetic graphs or fabricated usage. Never ask for provider keys in the website.
- Connected, no requests yet: show connected device/harness when reliable, explain how to send first request and display refresh/freshness status. Usage area shows honest zero-state.
- Pending ingestion: distinguish reported data freshness from last request. Never claim live/realtime unless measured.
- Trial: small start/end dates and upgrade action. Do not begin trial at account creation; server activation is authoritative. Show actual grant length, not a generic 14 days for first-1,000 recipients.
- Expired/cancelled: retain readable history and relevant billing action; accurately distinguish scheduled end-of-period cancellation from already expired access.
- Missing costs/tokens: coverage indicator (e.g. partial data); no inference from model selection alone. Reported zero and unreported value differ.
- Failed data fetch: retry with error, preserve any visible cached data with stale label; do not replace failure with zero totals.

## Proposed controls and boundaries

Use a single shared date range across summary, chart and model distribution. Dashboard recent rows follow the same range. Put advanced model/harness/status filters on Request History rather than filling the overview toolbar. Responsive layout stacks sections in their reading order; all metrics and charts have accessible text/table equivalents. No export, notifications, device-management UI or downloadable reports implied by this proposal; each remains a separate requirement decision.

Acceptance when implemented: totals reconcile to the selected range, inaccessible/other-user rows are excluded server-side, unavailable estimates are labeled, loading/error/empty states are distinct, keyboard navigation works, and small screens retain model/time/cost readability.
