# Zusal positioning and launch plan

Status: requirements and proposals for review. No publication or implementation authorized in this workstream. Prepared 17 October 2026.

## Confirmed decisions

- Product: standalone router CLI/package integrated with an existing agent harness. Zusal selects the execution model and dispatches the model request; the harness owns agent behavior and tool execution.
- Initial audience: individual developers.
- Business model: fixed routing subscription, tentatively $5/month; customers provide their own model-provider access and pay provider charges separately.
- Offer: first 1,000 users who activate through the CLI receive 30 days of Pro; subsequent users receive 14 days. No card required initially. Continued routing requires an explicit paid subscription afterward; dashboard and history remain accessible.
- Website: landing page, download/install experience, account dashboard, usage reporting, subscription management, invoices, and account access through Google or email/password.
- Dashboard: request count, selected models, tokens, estimated model costs, and request-level timestamp/model/token/cost history. No estimated savings in the first version.
- Brand: Zusal, formed from Zubeda and Salman; precise, calm, technical, restrained teal and charcoal/off-white. Standalone angular Passage symbol selected conceptually; usable source artwork still needs verification before production use.

## Proposed positioning

**Architecture clarification from owner-supplied handoff:** Zusal selects the physical execution model; Pi's inference layer sends provider requests. References below to Zusal "calling" models describe an earlier scope and must be revised in final copy. Do not market Zusal as an execution-provider proxy. Jev is the confirmed initial assessor. Newer launch scope targets both Pi and DeepSeek across macOS, native Windows and Linux; compatibility claims still require verification.

Category: model routing for coding agents.

Core statement: “Zusal chooses and calls a model for each agent request, so individual developers can manage model spend without manually switching models.”

Hero candidate: “The right model for your next agent request.”

Supporting copy: “Connect Zusal to your coding agent. Keep your provider accounts, let Zusal select the model, and see what every request used and cost.”

Primary call to action: “Install Zusal.” Secondary: “See how routing works.” Account creation and trial activation should be part of installation rather than separate competing conversion paths.

Pricing explanation: “$5/month for routing. Model-provider usage is billed separately by your providers.” Price remains tentative. Show this near the primary pricing CTA, not only in an FAQ.

Claims requiring evidence before publication: preserves quality, reduces costs, improves speed, works with a named harness, supports a named provider, stores no prompts, routes locally, or requires only a particular number of setup minutes. No comparative savings percentage, benchmark superiority, testimonial, customer logo, or reliability guarantee should be invented.

## Proposed launch scope

Start with one verified harness integration and a deliberately small supported model/provider set. Announce exact supported versions and operating systems. A broad multi-harness claim creates support work before routing reliability is established.

Website information architecture:

1. Landing page: product purpose, real request-flow demonstration, setup overview, compatibility, transparent pricing, FAQ, install CTA.
2. Install/download: OS-specific instructions, prerequisites, release version, authentication/activation steps, verification command, troubleshooting, uninstall instructions.
3. Pricing: paid plan, trial eligibility and timing, model charges excluded, usage limits, cancellation and expiry behavior.
4. Documentation: quickstart, supported integrations/providers, routing controls, telemetry/privacy explanation, troubleshooting.
5. Account: onboarding, usage and request history, subscription and invoices, profile/security.
6. Trust/support: privacy policy, terms, support contact and service status. Policy content must reflect the actual data flow and operating entity.

A public changelog is useful after there are real releases. A blog, enterprise page, referral program, and extensive SEO page collection are lower priority than install-to-first-request completion.

## Proposed rollout

1. Private validation: a small group of real individual developers runs a known integration on real work. Observe installation failures, provider mismatches, broken tool loops, and whether developers keep routing enabled. Do not call testers paying customers.
2. Public early access: open the 1,000-activation offer once installation, entitlement activation, cancellation, and support are dependable. The offer is eligibility, not a fabricated countdown or an automatic requirement to onboard all 1,000 immediately.
3. Paid validation: prompt users to explicitly subscribe before expiry. Measure continued use after payment, not only trial activation. Announce a change to standard trial eligibility clearly when the launch allocation is exhausted.
4. Expansion: add another harness or provider only after existing users can install, use, and retain the product reliably.

No specific dates or numerical success targets are committed yet. Establish a baseline during private validation, then choose targets before public rollout.

## Acquisition experiments, in priority order

- Publish a working integration guide and a short unedited setup/demo video for the first supported harness. Demonstrate actual model selection and usage history.
- Share a technical explanation of routing boundaries and a reproducible evaluation method. Report quality and cost together when evidence exists.
- Seek permission to announce the integration in relevant harness communities. Any actual outreach or posting requires explicit user authorization.
- Invite developer feedback through a clear support channel and track recurring problems. Use consent before quoting feedback publicly.
- After retention is demonstrated, test additional educational content and partner integrations. Defer paid acquisition until subscription margin and retention are understood.

Each experiment should record audience, message, destination, eligible visits, signups, activated installs, paid conversions, and retained paid users. Do not promise a broad “launch everywhere” campaign without capacity to answer support and fix onboarding failures.

## Metrics and definitions

- Account created: unique account successfully registered.
- CLI connected: authenticated CLI installation linked to the account.
- Trial activated: recommended definition is first valid routing decision followed by successful dispatch acknowledgment, excluding setup checks; user must confirm this definition.
- First value: a successfully completed routed model interaction in the chosen harness. Count trial activation separately from completion so failed executions remain visible.
- Active user: a unique account with at least one qualifying routed interaction in the reporting interval. Do not use this definition interchangeably with launch-offer activation.
- Paid conversion: explicit subscription payment after trial eligibility; inspect cohorts only after their full trial and conversion window.
- Retention: paid subscribers continuing to use and renew; report separately from install counts.
- Quality signals: integration errors, tool-call failures, manual overrides, routing bypasses, and user-reported failures. Manual overrides are signals to investigate, not automatic proof of poor routing.
- Economics: routing/assessment expense per account, support burden, gross contribution per paid account, and cost of free cohorts.

## Economic risks to resolve

At $5/month, assume neither unlimited routing nor profitability. A useful calculation is:

Monthly contribution per paid user = net subscription receipts − assessment/decision calls − router infrastructure − observability/storage − other variable service costs.

Break-even assessment budget per request = (net receipts − other monthly variable costs) / routed request count.

Provider model charges remain the developer's expense, but any hosted decision engine still creates Zusal expense. Include assessor latency and failed/repeated assessment costs. If using local assessment, account for download size, device compatibility, and support instead of assuming zero operating cost.

First 1,000 activations at the proposed $5 rate represent $5,000 in subscription face value for a fully waived month, not necessarily $5,000 of lost revenue. Actual cash exposure is the cost of serving those accounts and supporting them. Bound that exposure with disclosed limits and abuse controls before public activation.

Determine subscription currency, taxes, payment fees, refunds, regional availability, and support expectations before treating $5 as net revenue. No current processor-specific fee assumptions are made here.

## Essential unresolved decisions

1. Which harness and OS combination is guaranteed to work on day one, and which downloadable artifact exists?
2. What counts as one activation for the first 1,000, and what prevents duplicate-account abuse without intrusive verification?
3. Does Pro have a request allowance, fair-use policy, or truly unlimited routing? How much does one routing assessment cost under expected usage?
4. Where does assessment and dispatch occur, and which data reaches Zusal? Marketing, dashboard feasibility, privacy, and security claims depend on the answer; provider keys themselves need not be collected by the website.
5. What behavior proves quality preservation sufficiently to make that claim, and who runs the evaluation?
6. What happens to an existing agent session when the trial expires? Avoid an unexplained mid-task failure; specify a clear entitlement response and warning.
7. What business entity, support address, payment region, currency, refund policy, and tax handling apply?
8. Is this release a functional launch with live backend/billing or a reviewable prototype pending router availability?

## Highest-impact next decision

Choose the first supported harness and operating systems. That determines the install promise, demo, compatibility copy, support burden, and which developers can actually become activated users. Confirm a working product path before optimizing campaign copy.
