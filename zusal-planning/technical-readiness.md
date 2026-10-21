# Zusal technical and product launch readiness

Status: requirements discovery; no implementation or external setup authorized in this workstream. Prepared from the conversation and read-only inspection of `pi-router`. No secrets or environment files were read. Existing test source was inspected; tests were not run and passing status is not claimed.

## Approved requirements

- Audience: individual developers.
- Product delivered through a router CLI/package integrated with an existing harness. Router decides which model serves a request; the stated target scope also includes firing that request. Harness owns tools, conversation state and agent loop.
- Website: landing page, download/install experience and authenticated user dashboard. Google sign-in and email/password; email verification and password reset were included in the accepted flow.
- Dashboard: request count, model selections, token usage, estimated model costs, and individual request history (timestamp, selected model, tokens and estimated cost). No estimated savings.
- Billing: subscribe, cancel, update payment details, view invoices. Tentative price is USD 5/month for routing only. Users bring provider access and pay model providers separately. Website is not a provider-key management product.
- First 1,000 users activating routing through the CLI receive 30 days of Pro. Later activations receive 14 days. No card required to start. At expiry explicit payment is required; dashboard/history remain accessible.
- Logo direction selected: standalone angular Passage symbol. The transcript does not establish that final source/vector assets actually exist.

## Observed code facts

| Area | What is present | Evidence |
|---|---|---|
| Runtime/package | Private ESM Node package, version 0.1.0, Node >=22.19.0; no runtime npm dependencies | `pi-router/package.json` |
| Integration | Pi 1.2.0 virtual model registered as `our-router/auto`; allowlisted authenticated physical models only | `pi-router/src/plugin.mjs:35`, `:80` |
| Dispatch boundary | Plugin returns a physical model to Pi; it does not fire provider inference itself | `pi-router/src/plugin.mjs:65`, README Flow |
| Backend | Local HTTP `/v1/select`, localhost only; single shared bearer token; 64 KiB body limit | `pi-router/src/server.mjs:15`, `:37`, `:48`, `:85` |
| Assessment | Jev task/difficulty/visual requirement batched into one hosted request; 2.5-second timeout; current default `jev-latest` | `pi-router/src/jev.mjs:39` |
| Policy | Explicit bootstrap tier heuristic; provisional confidence threshold; task preferences and deterministic ties; not a learned optimizer | `pi-router/src/policy.mjs` |
| Session behavior | New user turns select again; tool continuations/retries retain eligible previous/failed physical model | `pi-router/src/plugin.mjs:43` |
| Failure behavior | Backend/assessment failures select an eligible local default; caller cancellation does not trigger fallback | `pi-router/src/plugin.mjs:67` |
| Privacy boundary | Sends bounded user/recent text excerpts to backend and TypeSafe; excludes system/thinking/tool arguments/image bytes, but no general private-text redaction | `pi-router/src/plugin.mjs:10`, README Context and failures |
| Telemetry | JSON terminal logs for receipt, decision and errors; no persistent per-user records and no provider-completion tokens/costs | `pi-router/src/server.mjs:22`, `:62` |
| Tests | Fixtures cover eligibility/auth/validation/cancellation/fallback, optional real-Pi fixture runtime; README says live Jev and real provider streaming/auth refresh not yet verified | `pi-router/test`, README Verification |

No account service, billing service, production deployment, release distribution, persisted usage database or dashboard was found in the inspected project files. Absence is limited to this inspected project, not a claim about other systems.

## Architectural decision required before implementation

**Resolved after this review:** the owner supplied `pi-router/AGENT_HANDOFF.md`. Pi-owned inference is already agreed, not an unresolved defect. Retain the native virtual-model callback; Zusal calls Jev for assessment but does not proxy execution-provider calls. The alternatives below are historical review notes, not current options awaiting approval. Native Windows only is confirmed. DeepSeek is a newer launch target whose integration needs separate verification. The handoff reports nine fixture/runtime tests passed; this review did not rerun them or establish live-provider success.

The inspected prototype and the stated scope differ: prototype = selection only with Pi dispatch; stated target = selection plus request dispatch. Confirm one of the following explicitly:

1. Preserve Pi dispatch and instrument supported completion events. Smallest change; website requirements can still be met. Product promise must describe actual ownership.
2. Move dispatch into a Zusal adapter/gateway. Adds provider protocol, streaming, usage extraction and cancellation responsibilities; must preserve harness tool-call identifiers and continuation semantics.

Do not build a second provider retry loop under Pi accidentally. The decision must also establish local versus hosted dispatch. No provider-key collection or storage should be added to the website without a separate product decision.

## Recommended minimum system boundaries

Keep one application/control-plane service and one database initially; logical modules do not require separate services.

- Marketing/download site: public content, versioned install instructions, honest compatibility matrix.
- Account/control plane: identity, CLI pairing, devices, entitlements and billing reconciliation.
- Routing runtime: assessment, policy/catalog and whichever dispatch boundary is approved.
- Usage ingestion/read API: account-scoped structured events, aggregation and request history.
- External billing/identity/email infrastructure chosen only after jurisdiction, payment availability and hosting needs are known.

The control plane supports the paid product; it does not expand the router into a harness. Exclude tools execution, memory/agent orchestration, team management, provider-key vault UI, workflow builder, savings claims and custom model training from the first website release.

## Real usage telemetry dependencies

Define terms before UI: a routing decision, a user turn and a physical provider request are different. A single turn can contain multiple provider calls from tools/retries; counting only `/v1/select` undercounts activity and cost.

Recommended dashboard: headline model requests, separate routing-decision count where useful, and history rows representing physical model requests. Group by turn in a later enhancement if needed. This is a recommendation awaiting agreement.

Minimum event contract:

- Globally unique event ID, account/device ID from authenticated context, CLI version, schema version.
- Routing decision ID, turn/session opaque IDs, provider request attempt ID; avoid using a caller-supplied account ID as authority.
- Occurred time and server received time; provider/model/version, policy version, mode, selected/fallback reason.
- Completion status (success/error/cancelled), latency, available input/output/cache/reasoning usage categories with explicit semantics.
- Token fields nullable when unavailable. Unknown usage/cost must display as unavailable, never zero.
- Estimated cost currency, decimal precision, price-table version/effective date and cost source; provider-reported cost distinguished from our estimate.

Do not send prompt bodies, responses, file paths, repo names, raw errors or provider credentials to usage analytics by default. The existing assessor text flow is separate and needs truthful disclosure.

Ingestion must authenticate each device, enforce account ownership, cap payloads/rate, deduplicate event IDs and accept retries/reordering. Locally buffered metadata should be bounded; at-least-once delivery plus server idempotency avoids duplicate costs. Client-reported usage is informative rather than authoritative provider billing. Missing/offline events and partial streams require clearly stated coverage.

Price calculations must accommodate provider-specific cache and reasoning semantics without double counting. Version prices so past rows do not silently change after a catalog update. Monthly account figures and per-model breakdowns should reconcile to request rows for the selected time range/timezone. Do not present estimates as invoices from model providers.

## CLI identity and first-1,000 offer

Recommended pairing flow: `zusal login` opens a browser with a short-lived, one-use pairing request; user authenticates and approves the named device; CLI receives a scoped credential through polling or a securely bound callback. Never put long-lived credentials in URLs or reusable copy/paste logs. Support device logout/revocation and account deletion behavior.

Activation should have one written definition. Recommendation: first authenticated routing attempt accepted for assessment with at least one eligible model; do not start a trial on account creation, download, pairing or an upstream provider failure. If the desired definition is first successfully completed model call, promotion allocation and asynchronous completion need a reservation rule. Confirm before implementation.

Allocate promotions server-side in a transaction: unique activation per account + lock/update promotion counter only if remaining >0 + insert immutable grant + commit. Enforce unique account grant and idempotency so simultaneous activations cannot produce 1,001 grants or consume multiple slots for one account. Server clock sets start/end. Store explicit grant kind/duration rather than infer eligibility from signup order.

Entitlement states should cover not activated, trial active, trial expired, paid active, paid cancellation scheduled, payment failure/grace and ended. Billing is authoritative for paid access; ingestion of usage must not grant access. Existing local fallback must not accidentally grant paid routing after an explicit entitlement denial: distinguish an outage from `subscription_required`.

No-card trials imply abuse cost. Recommended launch protections are verified email, reasonable device/concurrency caps, account/IP rate limits and assessor spend alerts. Usage allowance and offline entitlement behavior remain product decisions; do not claim unlimited use at USD 5 until measured costs support it.

## Billing readiness

- Choose provider after confirming legal business location, payout eligibility, launch markets, currency/tax requirements and refund policy; these are not known from the repository.
- Create checkout through the server and use hosted payment collection. Website must not handle raw card data.
- Verify webhook signatures; deduplicate events; handle reordering and reconcile current subscription state. Browser return URLs alone never grant paid access.
- Confirm cancellation timing, failed-payment grace, renewal dates, trial reminders and the meaning of monthly billing. Default recommendation: cancellation effective at paid period end, access until then.
- Hosted billing portal can cover payment updates/invoices/cancellation. Preserve dashboard access after cancellation/expiry. No annual plan, coupons or teams needed unless separately approved.
- Before launch exercise trial expiry, checkout abandonment, renewal, cancelled subscriptions, failed payment, refund and webhook replay in test mode.

## Downloads and release readiness

- Confirm distribution: npm package, platform binaries or both. Current package is private and has no public installer command/binary entry; README launches a locally installed Pi.
- Publish only supported, tested OS/architecture combinations and pinned supported Pi/Node versions. Never create functioning-looking download buttons without real artifacts.
- Version packages, include changelog, integrity checks/provenance appropriate to distribution, reproducible release workflow, clean-machine install/uninstall and rollback.
- Verify paid product end to end on real supported providers, including streamed tool calls, cancellation, retries, provider auth refresh and usage extraction. Fixture tests are not evidence of routing quality.
- Provide minimum docs: install, pair/login, integrate harness, eligible providers, separate provider billing, what data leaves device, troubleshoot, update/uninstall.

## Privacy, security and operations readiness

Website keys are account credentials, not provider API keys. Isolate account data in every API query; test cross-account access denials. Use established auth protections, verified email/reset flows, session revocation and safe Google/email account linking.

Document assessor data flow before publishing privacy copy. Existing text excerpts can contain private code and are sent to TypeSafe; avoid claims such as “no code leaves your machine.” Decide retention/deletion for usage history, support logs and backups. Legal copy needs verified business/jurisdiction facts rather than a generic generated policy.

Minimum operational readiness: HTTPS deployment, secret management, backups plus a restore check, rate/concurrency limits, billing/usage reconciliation, routing/assessor latency and failure dashboards, alert thresholds and an incident/contact route. Logs must exclude credentials and prompt content. Set bounded assessor budgets for 1,000 free launch users before acquisition spend.

## Launch gates and unresolved decisions

Blocking public paid launch:

1. Retain agreed Pi-owned dispatch; decide deployment of the selection/account services and verify the newer DeepSeek adapter path.
2. Establish working CLI-to-account pairing, revocable device auth and server-side entitlements.
3. Build reliable physical-request usage collection; current selection logs cannot populate promised tokens/cost/history.
4. Choose billing provider using verified business/payment constraints and establish webhook reconciliation.
5. Define activation precisely, atomically allocate the first 1,000 grants and distinguish expiry denial from outage fallback.
6. Prove clean-machine install and live supported-provider integration; validate routing quality and real assessment costs before promises/pricing limits.
7. Agree on privacy/retention and truthful assessor-data disclosures.

Questions for the next discovery rounds (not all need asking at once): supported OS and harnesses at launch; activation definition; dashboard count semantics/time filters/retention; cancellation/grace/refund terms; business location/markets; trial usage caps; CLI device limits/offline behavior; assessor choice/pinning; hosting/deployment ownership; support channel and release timeline.

Recommended sequence: settle blockers and measurable acceptance criteria → prepare website/UI prototype with explicitly labeled fixtures → implement identity/pairing/entitlements + telemetry/billing contracts → integrate actual services and releases → test full lifecycle privately → invite small launch cohort → open the remaining first-1,000 offer after reliability and unit-cost validation.
