# Zusal — requirements and decision log

Updated: 2026-10-17 (Asia/Kolkata).

## Working agreement

- Gather requirements and review the specification before website implementation.
- User authorized parallel subagent workstreams covering startup launch needs.
- Agents research, prepare artifacts, and surface decisions; recommendations are not approved requirements.
- For substantial unresolved choices, user requests subagent-backed research followed by the top three viable options with reasons and a recommendation; user chooses before commitment. Avoid unnecessary three-way comparisons for routine implementation details or settled decisions.
- Discovery format update on 18 October 2026: ask independent questions in batches of five to reduce back-and-forth. Keep dependent questions for a later batch and distinguish proposed defaults from approvals.
- No public launch, spending, external communications, or production account creation is implied by planning authorization.

## Confirmed product and audience

- Product name: Zusal, combining Zubeda and Salman (the founder's mother and brother).
- Primary audience: individual developers.
- Launch market: worldwide, English-first. Actual payment availability remains subject to the operating entity and provider support.
- Monthly operating budget: INR 10,000, excluding users' model-provider bills. Do not treat unapproved vendor prices as budget commitments.
- Business setup selected: Indian sole proprietorship (option 1). Selection is a planning decision, not evidence of registration, payment approval or completed tax/accounting review. Exact state/address and existing registrations remain to be confirmed before setup.
- Operating country confirmed: India initially. Dubai/UAE is a possible future move, not a committed incorporation or migration. Evaluate payment-provider entity/country changes; do not assume subscriptions transfer automatically.
- Initial distribution: a router CLI/package that connects to an existing harness.
- Launch integration targets: Pi and DeepSeek Harness, each on macOS, Windows and Linux. These are desired support targets, not verified compatibility claims; exact OS versions, shells and CPU architectures remain to be specified.
- Router scope clarified by owner-supplied `pi-router/AGENT_HANDOFF.md`: backend assesses and selects; plugin hands the physical model to Pi's native virtual-model callback. Pi owns execution-provider dispatch, credentials, streaming, tools, retries and conversation loop. Zusal calls Jev for assessment only; do not build another inference/proxy stack.
- Developers bring their own model-provider access and pay providers separately.
- Website scope: public landing page, download/install section, user dashboard, subscription management.
- Launch support channel selected: Discord community, replacing the earlier email-support selection. Link it from the website, docs and dashboard alongside troubleshooting documentation. Server/invite and moderation process remain to be set up; no server created or messages sent. No email support service or public issue tracker committed. Sensitive account/payment matters need a private handling path to specify; never solicit secrets in public channels.
- Support detail approved: Discord public help channels plus private tickets for account/payment concerns. Ticket privacy/access and moderation setup still need verification.
- Launch page inventory approved: Home, Download, Pricing, Docs, Sign in/Sign up, Dashboard, Request History, Billing, Account Settings, Privacy and Terms. Exact routes/content and account-settings actions remain to be specified; do not treat proposed additional features as approved.
- Website hosting selected: Netlify, starting on Free. Supabase remains the account/data/backend foundation; Paddle remains billing. Monitor shared credit usage and pause behavior; no paid upgrade, account or deployment has been created/authorized.
- Frontend selected: Astro + React. Pre-render public landing/pricing/download/docs pages with Astro; use a coherent React application for authenticated dashboard interactions. Start with static deployment to Netlify and Supabase-backed data; do not add runtime SSR without a concrete requirement. No website implementation started.
- Domain ownership: user confirmed no domain owned yet. No domain availability or trademark clearance established; no purchase authorized.

## Confirmed brand direction

- Precise, calm, technical; distinctive and restrained.
- Charcoal text, warm off-white backgrounds, restrained teal accents.
- Theme scope selected: both light and dark themes. Default/system-preference behavior not yet selected. Both must preserve the agreed brand and accessible contrast.
- Concrete copy and product examples; no fabricated metrics, testimonials, or savings claims.
- Standalone symbol plus Zusal wordmark.
- Selected logo: Option 2, Passage. Current raster is a concept; final geometry, monochrome treatment, and small-size QA remain outstanding.
- Selected concept image: /Users/suhailmalik/.codex/generated_images/01a140fb-278e-71e3-8def-0ba8c33edabb/exec-c84d1f9b-f2ef-4e0a-8e2d-78911e47d0ef.png
- Workspace copy: `assets/zusal-passage-concept.png`.

## Confirmed account and dashboard requirements

- Google sign-in and email/password sign-in; no GitHub sign-in for initial scope.
- Account/data/backend platform selected: Supabase, starting on Free. Plan for Auth, Postgres and compatible Edge Functions. This is not a claim that the existing Node server runs unchanged or that Jev, email, domain and website hosting are included. Runtime adaptation, limits, backups and production email delivery must be addressed before launch; no Supabase project or paid upgrade has been created/authorized.
- Transactional email selected: Resend, starting on Free (published allowance at selection: 3,000/month and 100/day). Verify owned sender domain, configure Supabase custom SMTP and its separate rate limits, and test verification/reset delivery before launch. No account, DNS change, email send or paid upgrade performed.
- Email verification and password reset were included in the proposed auth scope and have not been separately revisited.
- Usage summaries: request count, selected models, token usage, estimated model costs.
- Request-count definition selected: actual execution-model provider calls, including tool-continuation calls and retry attempts, labeled "Model requests". Not user turns, routing decisions or Jev assessor calls. Record status per attempt; unavailable usage is not zero. Exact inclusion/time attribution for attempts failing before provider contact remains an implementation definition to document consistently.
- Individual request history: timestamp, selected model, tokens, estimated cost.
- Dashboard reporting storage approved: metadata only (model/provider, timestamps, token usage, estimated cost, status and request identifiers). Exclude prompts, model responses and code from analytics/history; avoid raw errors or user-controlled labels that could leak them. Jev assessment context is a separate existing data flow and must be disclosed accurately; this decision does not assert no conversation text leaves the device or establish assessor retention policy.
- Individual request-history retention selected: 30 days. Define deletion cutoff/timezone and disclose expiry in UI/privacy copy during implementation. Retention duration for aggregated daily summaries is not yet selected; do not infer indefinite retention from this decision.
- CSV export approved for available individual request history, bounded to the 30-day retention window. Export only authorized metadata and handle missing values accurately; formatting/CSV-injection protection are implementation responsibilities.
- Aggregated daily usage-summary retention subsequently selected: 12 months. This supersedes undecided summary-retention wording above. Summaries contain totals, not individual request details; account deletion and any separately required billing retention need their own policy.
- Dashboard layout selected: overview-first. Four summary figures (requests, tokens, models used, estimated model cost), date-range selector, one activity chart, model breakdown, five latest requests linking to full history, compact trial/subscription status. Provider cost estimates remain separate from Zusal billing; missing data is unavailable rather than zero; new accounts get setup guidance rather than sample usage. Exact time ranges, request counting and retention remain unresolved.
- Dashboard controls subsequently approved: default last 7 days; Today, last 30 days and custom ranges; request-history filters by model and status (successful/failed/canceled); user-local timezone clearly labeled; refresh on page load plus manual refresh and last-updated timestamp, without constant polling. Earlier unresolved wording for these controls is superseded. Detailed history is bounded to 30 days, summaries to 12 months; date selection must explain that distinction.
- No estimated savings display in the initial version.
- Billing: subscribe, cancel, update payment details, view invoices.
- CLI account connection selected: `zusal login` opens browser sign-in and explicit approval of the requesting device; device-code flow is the fallback for remote/headless machines. No routine manual-token-copying flow. Pairing must be short-lived, one-use and bound to the requesting CLI; issue scoped revocable credentials server-side, never provider/admin credentials. Exact expiry and device metadata are implementation details to specify.
- Download/install flow approved on 18 October 2026: install first. Public installation instructions/downloads, with clear Pi/DeepSeek and OS-specific tabs. Account sign-in occurs through `zusal login` when connecting CLI; downloading/installing/pairing does not start trial. Do not gate public installation instructions on login or purchase. Actual commands/artifacts remain subject to release verification.
- Account Settings launch scope approved: profile and sign-in methods; password changes for email/password accounts; connected CLI devices with individual revocation; account deletion with confirmation. Provider API-key management excluded. Account-linking, deletion/cancellation interactions and any billing-record retention still need precise behavior; this approval does not authorize destructive actions on existing accounts.
- Account deletion behavior approved: confirmation and recent authentication; cancel future subscription renewals; revoke all CLI devices; delete profile and usage records; disclose separately retained billing records where required. Deletion ends access immediately, unlike cancellation. No automatic refund implied; deletion/retention implementation and third-party record handling need precise documentation.
- Billing provider selected: Paddle, acting as merchant of record. Plan to use hosted checkout/customer portal and verified subscription webhooks. No merchant account, approval, fee quote or live billing integration is established by this decision.
- After trial expiry, dashboard and history remain accessible; routing requires payment.

## Commercial decisions

- Routing subscription, with a tentative price of USD 5/month; provider inference charges are separate.
- Pricing update selected on 18 October 2026: Pro monthly USD 5, or annual USD 50 billed upfront yearly. Annual price is USD 10 below twelve monthly payments (two months free equivalent, approximately 16.7% discount). Both are billing intervals for the same Pro plan; no different feature tiers implied. This supersedes tentative-price/monthly-only proposals. Annual cancellation/refund details and tax presentation still need confirmation; do not imply prorated refund or transfer previous cancellation proposals to approved behavior silently.
- Cancellation approved on 18 October 2026 for both monthly and annual subscriptions: cancellation disables next renewal; routing access continues through the current paid period end. This does not imply an automatic refund or prorated refund; refund policy and applicable mandatory rights remain separate decisions. Dashboard/history remain available under their retention policy after paid access ends.
- Failed paid renewal policy selected: three-day routing-access grace period, with clear dashboard notice and payment-update action. If unresolved at grace expiry, suspend routing; dashboard/retained history remain accessible. Does not extend an expired free trial. Define grace from the failed renewal for the unpaid period, do not reset it on retries/replayed events; successful recovery reconciles with Paddle paid status.
- First 1,000 eligible users who activate routing through the CLI: 30 days of Pro free.
- Later eligible users: 14-day Pro trial.
- Trial starts at CLI connection and routing activation, rather than website signup.
- Trial activation precisely selected: first successfully completed real routed model request, reported by the harness. Signup, download, pairing, selection alone, failed setup/provider requests and health checks do not start trial. Server validates/deduplicates completion and assigns one immutable grant per account; first-1,000 order is server-accepted qualifying activation order, with exact concurrency/bootstrap controls to specify. No claim that a success signal proves answer quality.
- Trial reminder emails approved: three days before expiry and when trial ends; show expiry in dashboard. Deduplicate and skip obsolete reminders when account has converted/deleted or state changed. Auth email priority and Resend daily quotas must be accounted for.

## Discovery clarification pending

- In the five-question batch user answered "yes" to documentation (written guides only vs guides plus videos; recommendation was written first). Exact launch video scope needs clarification rather than silently assuming either choice.
- No payment card required to begin the trial.
- Explicit paid subscription required after trial; no permanent free routing tier.
- Do not promise unlimited routing: fair-use limits and operating economics remain unresolved.

## Proposals not yet final

- Pi and DeepSeek Harness are confirmed launch targets. OpenCode is deferred unless separately approved.
- Jev is confirmed and implemented as initial assessor per handoff; Laya remains a possible future comparison, with no user-facing assessor selector.
- Four logical router components: input adapter, Jev assessment adapter, catalog, selection policy. Integration boundaries are the plugin and HTTP API.
- Stack selected: Astro + React, Netlify Free, Supabase Free, Resend Free and Paddle. Sole proprietorship is the selected business structure. Domain and remaining product details are unresolved.
- The owner-supplied handoff resolves the previously flagged dispatch discrepancy in favor of Pi-owned inference. Its existing Pi implementation authorization is separate from the website requirements-review stage. DeepSeek Harness is a newer requested launch target; its adapter is not established by the Pi handoff and should follow the same thin-plugin ownership principle where supported.

## Pending founder input

1. Exact launch OS versions and CPU architectures. Windows target is native only, not WSL.
2. Paddle approval/readiness: Indian sole-proprietor verification, applicable USD 5 subscription fees, payout terms, website review requirements and possible later UAE entity-transfer procedure. Provider selection is complete; no application has been performed.
3. Domain selection (none owned), final page inventory and dashboard/onboarding behavior. Frontend framework selection is complete: Astro + React.

## Remaining requirements to resolve

- Launch milestones, team ownership, target date, and scope gates.
- Supported harnesses, operating systems, install/update/release process.
- Final pricing, caps, abuse controls, trial eligibility and activation definition.
- Legal business location and payment-provider eligibility before choosing billing integration.
- Website/account-to-CLI pairing and router entitlement contract.
- Telemetry source, cost estimation method, data freshness, retention and deletion.
- Account linking between Google and email login.
- History detail and filters, date ranges, usage/export requirements.
- Dashboard empty/error/trial-expired/payment-failed states.
- Documentation, support channel, cancellation/refund policy and legal pages.
- Domain ownership, final logo assets, actual product screenshots.
- Accessibility, performance, security, monitoring and launch acceptance checks.
- Cross-platform verification: proposed CI matrix of both harness adapters on native macOS, Windows and Ubuntu runners; integration/install tests of the actual package, fixture provider streams, limited controlled live smoke tests before release, and manual terminal/browser-login checks. Passing on one OS does not imply compatibility on another; Docker/WSL cannot establish native Windows compatibility.

## Product evidence from owner-supplied handoff

- Read `pi-router/AGENT_HANDOFF.md` on 17 October 2026. Current source/runtime takes precedence over stale implementation snapshots; do not read secrets to confirm status.
- Pi implementation uses a native virtual-model callback (Pi 1.2.0 snapshot), and batches three Jev assessment questions in one request.
- Handoff reports nine tests passed including actual Pi runtime with simulated providers; this planning session has not rerun them.
- Live Jev/provider success, quality, savings and production resilience remain unestablished in the handoff.
- Handoff flags a possible no-overlap mismatch between configured catalog and allowlisted model. Treat as snapshot to verify in the router implementation workstream, not an instruction to change configuration from website planning.
- No persistent per-user analytics or production accounts/billing are established by the handoff. Dashboard needs completion metadata from the harness, not a new Zusal inference proxy.

## Parallel planning artifacts

- `positioning-launch.md`: positioning, acquisition and commercial launch assumptions.
- `brand-website.md`: sitemap, journeys, visual/content requirements.
- `technical-readiness.md`: existing implementation evidence and launch dependencies.
- Primary agent consolidates findings into `launch-plan.md` without silently approving proposals.

## Implementation decisions after final recommendation approval

The founder approved proceeding with recommended defaults and implementation. Written documentation ships first; videos are deferred. Theme follows the OS initially and stores an explicit user override. The homepage includes an explicitly illustrative routing explorer. Dashboard details expose a bounded reason code and separate routing/response timing. Aggregate acquisition events default to off and can be enabled only after deployment/privacy review. No further discovery approval is required for routine reversible implementation choices.

Implementation source is in `../zusal-web`; service account setup, final legal/commercial facts, hosted integration evidence, and native harness release verification remain launch dependencies. Refer to `zusal-web/docs/LAUNCH.md` for current status rather than treating the website preview as a launched service.
