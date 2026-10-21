# Zusal dashboard option: cost first

Design judgment, 17 October 2026. Planning only. Audience: individual developers. Confirmed metrics: request count, selected models, tokens, estimated model costs. Request rows: timestamp, model, tokens, estimated cost. Estimated savings explicitly excluded. Dashboard, Request History and Billing are separate pages.

## Proposed hierarchy

1. Shared date-range control (default current month), timezone clarity and usage freshness.
2. Primary summary: **Estimated model cost**, labeled **Provider usage · estimate**. Supporting request count and token total in smaller summaries.
3. Daily estimated model-cost chart with input/output/cache categories only where accurate source metadata exists. Avoid stacked complexity in v1.
4. Model breakdown table: model, request count, tokens, estimated cost; consistent period with the top summaries.
5. Recent requests preview (five rows) and link to full Request History.
6. A compact connection/trial/subscription status near account navigation; full Zusal charges and invoices live on Billing.

Empty state should prioritize connecting CLI and first request. Unknown costs should read unavailable/partial, never zero. If only some records have pricing coverage, show coverage and avoid a misleading complete total. Use visible labels rather than assuming a chart color explains cost classes.

## Why choose it

- Directly addresses the product's cost motivation without unsupported savings comparisons.
- Gives developers one quick answer to “what did my selected models approximately cost this month?”
- Model breakdown helps inspect spending concentration and routing distribution together.

## Why hesitate

- Users pay provider bills themselves; our estimate is not their provider invoice. Price versions, cached tokens, request failures and account discounts can create discrepancies.
- Without savings or quality evidence, leading with a spend number can obscure Zusal's actual routing value.
- A dashboard dominated by costs may suggest Zusal manages provider budgets, billing or payment collection when it does not.

## Required language and boundaries

Use **Estimated model cost** consistently; do not headline it as “Your bill” or “Amount due.” Include a short explanation: “Calculated from reported usage and model pricing. Your providers bill you separately; actual charges may differ.” Zusal's tentative $5 subscription, trial, renewal and invoices belong on Billing. No budget controls, spend caps, routing preferences or estimated savings are implied by this layout.

## Comparison and recommendation

| Direction | Best question answered | Main limitation |
|---|---|---|
| Cost first | How much model usage cost in this period | Estimates dominate despite separate provider billing |
| Overview first | Is routing working and what happened overall | Less dramatic cost positioning |
| Activity first | Which requests ran and where did they go | Requires scanning events to understand overall usage |

**Recommendation:** overview first is the safer launch default. Include estimated model cost as one of four equal metrics, a model-distribution view, and recent requests; retain cost-first as option two if the founder wants financial visibility to dominate. Activity-first is best for troubleshooting-heavy users. None changes confirmed data collection scope.
