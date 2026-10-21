# Dashboard direction: activity-first

Planning proposal only. No implementation. Zusal serves individual developers using routing plugins; approved metrics are request counts, models selected, tokens and estimated model costs. Request History is a separate page. No savings metric; no default prompt collection proposed.

## Assessment

Activity-first answers “Is the router doing something, and which models is it choosing?” It is strongest immediately after installation and when diagnosing routing behavior. A dominant activity feed, however, duplicates Request History, overweights the last few calls, and makes totals/trends harder to understand. It is less compelling for a developer returning after a week to understand overall consumption.

**Recommend overview-first with a compact recent-activity preview.** This preserves activity-first's trust benefit without turning Dashboard into a second history page. This is a design recommendation, not measured evidence about user preference.

## Proposed hierarchy

1. **Time range:** Today / 7 days / 30 days, clearly identifying display timezone. Consistent date range applies to summary, trend and model breakdown. Avoid implying current month totals when range differs.
2. **Top metrics:** Requests, tokens and estimated model cost. Model selection is better represented by a distribution than an unhelpful count of distinct models. Label currency, token units and estimate status visibly.
3. **Usage trend:** Requests by day by default; optional token/cost mode if needed. One readable chart is preferable to many decorative cards.
4. **Model selection breakdown:** Models ranked by request share, with request count and optional tokens/estimated cost columns. This shows what the router is actually doing.
5. **Recent requests:** Last five calls with timestamp, selected model, tokens and estimated cost; “View request history” leads to the dedicated page. No prompts/responses, hidden prompt previews, or unapproved content collection.
6. **Account/trial status:** A restrained status area with expiry or billing link. Elevate it only when trial expiry or a payment problem needs action; do not turn every visit into a sales prompt.

## Option comparison

| Direction | Best question answered | Main drawback |
|---|---|---|
| Overview-first | What happened during this period? | Needs careful hierarchy to avoid generic analytics clutter |
| Activity-first | Is Zusal receiving calls; what happened recently? | Duplicates Request History and hides longer-term patterns |
| Cost-first | What am I spending? | Provider bills are separate, estimates may be incomplete, and unsupported savings comparisons can imply false certainty |

Cost-first is not recommended initially. A $5 subscription to Zusal is separate from estimated model-provider costs; avoid combining them into a “bill” or implying Zusal charges provider usage. An active subscription should not imply activity has occurred.

## Necessary states and controls

- First use: real setup/connection guidance and “Waiting for your first request”; never show fabricated metrics as actual usage.
- Authentication success, CLI pairing, first observed activity and trial activation are distinct events. Product activation semantics must match the backend grant rule.
- Show last-received/update time; include refresh. Do not promise live telemetry before reporting reliability is verified.
- Loading/error/empty/partial reporting states must be distinguishable. Missing cost/tokens are unknown, not zero. A numeric zero only means a measured zero.
- Deduplicate events and choose one definition for request count. Decide whether it counts provider calls or routing decisions, because harness tool loops can make these differ. Do not quietly switch definitions between dashboard/history.
- Date range and timezone should match history links; model filters belong primarily on Request History. Preserve selections when navigating.
- Explain estimated cost briefly: available token metadata and price version; separate input/output/cached tokens when supported. No unsupported inference of final provider invoice.
- Charts require readable labels, keyboard-accessible controls and text/table equivalents; color is not the only model identifier.
- Request History handles pagination, date/model filters and detailed rows. Avoid unbounded loading. Errors/failures need a definition and source before introducing status filters.

## Suggested requirement decision

Choose overview-first; include five recent requests and a prominent history link. During initial onboarding, temporarily emphasize the first observed routing event. This is one dashboard adapting to account state, not separate activity/analytics modes.
