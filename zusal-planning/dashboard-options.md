# Zusal — dashboard organization options

Prepared 17 October 2026. UX proposals for founder choice; not user research results or measured conversion claims. Page inventory is approved; layout/controls remain pending. No implementation.

## Founder decision

Founder selected option 1, overview-first, including the arrangement presented in conversation: four summaries (requests, tokens, models used, estimated model cost), date selector, one activity chart, model breakdown, five recent requests linked to history and compact subscription/trial notice. This supersedes pending layout wording. Exact date ranges, counting semantics and retention are still to be resolved. No implementation.

## Shared confirmed scope

Request count, model selections, token usage and estimated model-provider costs. Individual history includes timestamp, selected model, tokens and estimated cost. No estimated savings. Billing is Zusal's subscription, distinct from estimated external model-provider spending. Separate Request History, Billing and Account Settings pages exist in approved inventory.

## Three approaches

1. **Overview-first — recommended:** concise usage totals, activity trend, model distribution, recent requests with link to full history. Answers 'is Zusal being used, which models, and how much?' without emphasizing only spending or raw logs. Initial setup and trial status visible where useful, rather than dominating every visit.
2. **Activity-first:** recent request feed/table dominates; summaries secondary. Good for investigating individual routing decisions, but overlaps the already approved Request History page and makes general usage harder to scan.
3. **Cost-first:** estimated provider cost and model cost breakdown dominate. Good for spending awareness, but estimates can be incomplete and billing is separate; avoid implying Zusal collects provider charges or measures savings. No spending limits or budgets are implicitly approved.

## Proposed overview-first arrangement

Header with date range and freshness indicator. Four summary values: physical model requests (definition pending), tokens, models used and estimated provider cost. One usage-trend visualization and model breakdown. Recent request preview. Setup prompt only when CLI isn't connected; trial/subscription notice consistent with current state. Link to Billing rather than mixing subscription charges into provider-cost totals.

## Controls proposed, not approved

Founder subsequently selected 30-day retention for individual request records. Aggregated-summary retention is still unresolved. This supersedes request-detail retention being wholly undecided below.

Default last 7 days; Today, 7 days, 30 days and custom ranges. History pagination; model and status filters. Cost-estimate explanation and missing-data state. No live polling or CSV export assumed. User-facing request-count definition, timezone, freshness, retention and retry treatment must be agreed in later requirements or resolved with documented defaults.

## State requirements

No fabricated usage for new users. Distinguish no events from delayed/unavailable telemetry. Unknown token/cost fields remain unavailable rather than zero. Never show savings. Charts have readable text/table alternatives. Dashboard/history access continues after trial/subscription expiry; routing access follows entitlement policy.

Supporting reviews: `dashboard-overview.md`, `dashboard-activity.md`, `dashboard-cost.md`.
