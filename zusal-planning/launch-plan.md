# Zusal — coordinated startup launch plan

Prepared 17 October 2026. Status: requirements discovery and recommendations, not an implementation approval or a claim of launch readiness.

## Confirmed direction

Individual developers worldwide, English-first. Standalone router CLI with marketing/download site and authenticated usage/billing dashboard. Google and email/password login. Routing subscription tentatively USD 5/month; model-provider charges separate. First 1,000 eligible CLI activations receive 30 days Pro, later users 14 days; no card upfront and explicit purchase after expiry. Dashboard/history stays available after expiry. No estimated savings display.

Monthly operating ceiling: INR 10,000 excluding model-provider charges paid by users. Brand: Zusal, selected Passage symbol, charcoal/off-white and restrained teal. See `requirements.md` for the decision ledger and `assets/zusal-passage-concept.png` for the selected concept.

Updated launch targets: Pi and DeepSeek Harness on macOS, Windows and Linux. Exact versions/shells/architectures and native Windows versus WSL are still to be defined. This supersedes the earlier one-harness recommendation. Require both adapters to pass a native-OS CI matrix plus release smoke/manual checks before claiming verified support.

Subsequent decisions: native Windows only; Indian sole proprietorship initially, possible future Dubai/UAE move; Paddle selected as billing merchant of record, conditional on actual approval and acceptable fees/payout terms. These supersede earlier entity/provider-selection questions. No account application or incorporation has been performed.

Account/data/backend decision: Supabase starting on Free. This supersedes earlier proposed Pro baseline; no automatic paid upgrade. Auth, Postgres and compatible Edge Functions are planned. Assess Node-to-Edge compatibility, custom SMTP, backup handling and actual quotas. Website frontend hosting remains undecided; external Google/email authentication compatibility must be preserved.

Frontend hosting subsequently selected: Netlify Free. Supersedes the earlier undecided status and Cloudflare recommendation. Monitor shared credits/deployment costs and quota-triggered live-site pausing. Frontend framework and production email provider remain undecided; no account/deployment or paid upgrade performed.

Transactional email subsequently selected: Resend Free. Supersedes the earlier undecided email status. Own-domain verification, Supabase SMTP configuration and rate-limit/delivery checks remain; no account or email send performed. Frontend framework and actual domain ownership remain undecided.

Frontend subsequently selected: Astro + React, static public pages plus interactive React dashboard on Netlify. Supabase remains backend. No runtime SSR requirement established. Domain is not owned yet. Proceed with remaining requirements and specification review before website implementation.

## Workstreams and deliverables

| Workstream | Deliverable now | Subsequent work after requirements review |
| --- | --- | --- |
| Product/founder coordination | Approved/proposed decision ledger and dependency plan | Final MVP scope, acceptance criteria, priority order |
| Positioning/acquisition | `positioning-launch.md` | Evidence-based copy, real demo, integration guide, cohort acquisition experiments |
| Brand/website UX | `brand-website.md` | Logo refinement, wireframes, actual states, responsive designs and implementation |
| Router/release integration | Existing-code review in `technical-readiness.md` | Resolve dispatch boundary, integration verification, publishable CLI package and compatibility matrix |
| Accounts/usage/billing | Requirements in technical readiness report | CLI pairing, entitlements, usage ingestion, billing reconciliation and real dashboard data |
| Trust/operations | Required controls and launch gates | Verified disclosures, retention/deletion, support, monitoring, backups/restore and incident response |

These are work areas, not separate services or new hires. Use focused subagents as needed; primary agent owns consistency. No unrelated skills, enterprise features, or paid acquisition are needed merely to appear complete.

## Critical findings

1. Resolved by owner-supplied `pi-router/AGENT_HANDOFF.md`: Pi-owned dispatch is intentional and agreed. Zusal assesses/selects and returns the physical model via Pi's native callback. Do not add another provider gateway/stream stack. DeepSeek adapter remains new work, separate from the implemented Pi path.
2. Selection logs do not contain actual provider completion usage. Real dashboard tokens and estimated costs require completion metadata from the approved dispatch boundary.
3. Account pairing, entitlements, billing, persisted usage, and public release artifacts were not found in the inspected prototype. They are dependencies of a functional launch, not completed website features.
4. Trial activation and first-1,000 allocation need a single precise definition. Planning agents proposed different activation triggers; neither has been approved. Select a trigger and failure semantics before implementation.
5. Provider credentials are outside the website scope. Actual assessor text flow still needs accurate disclosure; do not equate credentials staying outside the dashboard with all data staying local.

## Budget discipline — proposed

- INR 10,000 is a ceiling, not a target to spend. Obtain verified vendor costs and expected usage before selecting services.
- Prefer one application backend and one database, managed identity/payment collection where suitable, and existing harness capabilities.
- A provisional allocation ceiling: INR 3,000 assessment/routing, INR 2,000 hosting/database, INR 1,000 transactional email/monitoring/other operating tools, INR 4,000 reserve. These are planning envelopes, not vendor quotes or a feasibility guarantee.
- Confirm whether domain/one-time expenses belong inside the budget. International billing/provider eligibility cannot be assumed from worldwide launch intent.
- Before public onboarding, measure decision costs and estimate: active accounts × routing decisions/account × cost/decision + fixed infrastructure + other variable expenses.
- Keep the promised first-1,000 offer but recommend staged admissions. Trial cohort size should follow measured burn. No unapproved rollout cap, usage allowance, or price change is assumed.
- Do not market unlimited routing before unit economics support it. No paid acquisition initially; validate install, usage and paid retention first.

## Sequence and exit criteria

### 1. Complete requirements

Decide supported harness/OS, deployment/dispatch ownership, activation definition, usage counting, history retention, trial allowance, billing region/entity, domain, cancellation/refund behavior and initial support channel. Approve final website scope and UI acceptance criteria.

### 2. Design a reviewable product

Refine selected logo, design landing/download/auth/dashboard/billing journeys and their empty/error states. Use visibly labeled sample data until integration exists. Agree on copy and release compatibility claims. Do not start production website implementation before the requirements review.

### 3. Make the service functional

Build the agreed API/data contracts, identity/pairing, entitlements, usage reporting and billing reconciliation. Package the CLI. Integrate website with actual services. Keep website telemetry distinct from assessor inputs and user-provider invoices.

### 4. Validate privately

Verify clean install, supported provider calls/tool loops/cancellation, account isolation, correct first-1,000 grants under concurrency, usage reconciliation, trial expiry, explicit purchase, renewal/cancellation/payment failure, backups/restore and operating cost. Passing mocked tests alone does not establish routing quality.

### 5. Launch in measured cohorts

Start a small real cohort, address installation and reliability failures, measure burn and conversion, then widen admissions against the first-1,000 allocation. Real releases/docs/support precede public promotion. Public posting, purchases and production account setup need task-specific authorization when reached.

## Success measures

Track website-to-install, paired CLI, qualified activation, first successful use, continued usage, paid conversion after complete trial windows, renewals, routing/provider errors, support load and contribution per paying account. Select numeric targets from observed baselines rather than inventing success claims.

## Immediate decisions to gather

1. Specify exact versions/shells/architectures for confirmed Pi + DeepSeek Harness launch targets across macOS, Windows and Linux.
2. Confirm operating business country/entity before payment-provider selection.
3. Define the DeepSeek adapter around the confirmed thin-plugin boundary; collect provider completion usage from harness instrumentation for dashboard reporting.

The user has explicitly asked to gather requirements before implementation. This plan does not authorize publication, purchases, external messages or a claim that the startup is live.
