# Zusal brand and website requirements

Status: requirements draft; no website implementation or publication authorized in this phase. This document separates user-approved decisions from design recommendations. Last updated: 17 October 2026.

## Approved decisions

- Product name: **Zusal**, derived from Zubeda and Salman, the founder’s mother and brother.
- Audience: individual developers.
- Product distribution: router CLI/package integrated with an existing harness. Website is the marketing, distribution, account, usage, and subscription surface.
- Brand direction: precise, calm, technical; distinctive and deliberately avoids a generic AI-generated appearance.
- Proposed palette accepted in conversation: charcoal text, restrained electric teal accent, warm off-white background, dark product-demonstration sections.
- Logo direction selected: concept 2, **Passage**, an angular standalone routing symbol paired with the Zusal wordmark. Reference raster is available at `assets/zusal-passage-concept.png`; editable vector geometry and favicon treatment remain to be finalized.
- Public website includes landing and download experiences. Authenticated dashboard includes usage and subscription management.
- Authentication: Google or email/password; email verification and password reset included.
- Dashboard metrics: request count, models selected, token usage, estimated model costs. **No estimated savings in the first release.**
- Individual request history: timestamp, selected model, tokens, estimated cost.
- Subscription: tentative $5/month for routing; provider charges paid separately by users. No permanent free plan.
- First **1,000** users who activate CLI routing receive 30 days of Pro. Later users receive 14 days. Trial begins on CLI activation, no card required upfront, explicit paid subscription after expiry. Dashboard and history remain accessible after expiry.

## Proposed information architecture

**Founder update:** the launch page inventory below is approved: Home, Download, Pricing, Docs, Sign in/Sign up, Dashboard, Request History, Billing, Account Settings, Privacy and Terms. Changelog remains optional/unapproved. Individual controls, settings actions, route spellings and support destination are still proposals.

Keep public navigation short: Product (landing anchors), Pricing, Docs, Download; secondary Sign in. Avoid manufacturing empty company, research, customer, or enterprise sections simply to match Cursor.

| Route / surface | Content and primary action | Priority / status |
| --- | --- | --- |
| `/` | Product explanation, concrete routing demonstration, workflow, compatibility, price/offer, focused FAQ; primary install/download action | Required; section ordering proposed |
| `/download` | Supported OS/package options, install command, version, release notes, setup instructions; copy install command | Required; platforms unresolved |
| `/pricing` | One clear Pro offer; routing fee versus separate provider charges; trial eligibility, start/expiry, cancellation and renewal terms | Proposed separate route; content necessary |
| `/docs` | Quickstart, harness integration, authentication/activation, usage interpretation, troubleshooting, uninstall | Proposed documentation surface |
| `/changelog` | Actual CLI/product releases | Proposed; merge into download page if content is small |
| `/sign-in`, `/sign-up` | Google and email/password, useful validation, links to recovery/verification | Required |
| Email verification / reset | Verify, resend with rate-limit messaging, expired link, password-reset completion | Required |
| `/app` | Usage overview and account/trial status with date filter | Required |
| `/app/requests` | Search/filterable request history with pagination | History required; controls proposed |
| `/app/billing` | Trial/subscription state, subscribe, cancel, payment method, invoices | Required |
| `/app/settings` | Profile, sign-in methods, password/security, account deletion | Proposed; exact scope unresolved |
| `/privacy`, `/terms` | Actual telemetry, retention, subscription, refund, and service terms | Launch requirement; text needs review |
| Support | Clear working support channel; searchable docs first | Launch requirement; destination unresolved |

## Public landing-page narrative

Proposed progression, each section adds new information:

1. **Explain the product:** concise promise, what is installed, primary installation action. Working copy: “The right model for each agent request.” Supporting copy must say Zusal routes requests across supported models and is designed to reduce unnecessary expensive-model use; do not promise identical results or proven savings without evidence.
2. **Show one request:** a clear request → routing decision → chosen model demonstration. Mark synthetic inputs and numbers as illustrative; no invented performance claims. Include text equivalent to any animation.
3. **Show the developer workflow:** install, connect compatible harness, activate account, route. Exact commands and integrations require verification.
4. **Explain developer control and scope:** selected model visibility and usage reporting. Only show controls that actually ship; do not imply automatic tool execution, hosted model credits, or unapproved preferences.
5. **Show the dashboard:** genuine screenshot once built; a labeled preview during design. Request/token/model/cost information, no savings card.
6. **Explain price and trial:** $5/month only once finalized; provider usage separate; first 1,000 activation offer with no fake countdown or fabricated remaining count.
7. **Answer the buying questions:** supported harnesses/platforms/models, billing start, post-trial behavior, what is sent for reporting, and where to get help. Publish answers only after implementation decisions exist.
8. **Repeat the install action** at a natural end of page.

## Core journeys and states

### First visit → successful first use

Read product explanation → check compatibility → install package → connect CLI/account using approved activation mechanism → show verified activation and correct trial entitlement → see first received usage event in dashboard.

Open decision: allow anonymous installation before registration (recommended) versus requiring sign-in before download. Trial must not start on download or sign-up. Clarify activation definition and eligibility centrally rather than implementing separate web-only rules.

### Returning developer → understand activity

Sign in → choose time range → see totals and model breakdown → inspect request records → understand how token and cost figures were computed. Proposed default: last 7 days, with account-local display timezone labeled. Dashboard needs UTC data storage contract and reliable totals from backend; browser arithmetic is not the authority.

### Trial → paid

See trial status and actual expiry date → open billing → explicit purchase → successful subscription confirmation. Preserve route back to dashboard. Handle checkout abandoned, payment pending, payment failed, trial expired, cancellation scheduled, and canceled states. Never auto-charge a no-card trial or imply that registration is a paid commitment.

### Returning after expiry

Dashboard/history remain readable → honest expiry banner → subscribe action → routing entitlement updates after confirmed payment. Avoid locking invoice/history access behind subscription.

### Empty and failure states

- No CLI connected: show setup instructions, no fabricated metrics.
- Connected but no events: distinguish waiting from failed telemetry.
- Delayed or unavailable reporting: display last update and retry path; do not convert missing data into zero.
- Cost unavailable: show “Unavailable” or partial estimate with explanation; never silently display $0.
- No filter matches: reset filters action.
- Verification/reset link expired: resend flow with clear state.
- Session expired: preserve safe return destination after sign-in.
- Unknown route: useful 404 with navigation.

## Brand execution requirements

- Wordmark plus standalone Passage symbol; icon in one color, light/dark variants, square app-icon treatment, favicon set.
- Refine from the selected reference at `assets/zusal-passage-concept.png`. Deliver editable vector source, SVG, monochrome variants, favicon assets, clear-space and minimum-size rules. Verify 16px and 32px icon readability.
- Typography: readable sans-serif; monospace only for code, IDs, token/cost values where helpful. Actual font family and licensing unresolved.
- Color roles and tested contrast values to be finalized; initial color names are direction, not approved hex codes.
- Use purposeful, substantial layouts with strong hierarchy. Avoid repeated feature-card grids, excessive rounded containers, glass panels, generic gradient blobs, fake terminal activity, and gratuitous animations.
- Motion should explain routing or state changes; respect reduced-motion settings and provide static alternatives.
- Voice: direct developer language, clear costs and limitations. Avoid “revolutionary,” “unlimited,” “same quality,” or numerical savings unless substantiated.
- Founder story can appear as a small optional About note; do not imply the former Neomichi etymology applies to Zusal.

## Content and assets needed before implementation completion

1. Selected Passage reference and approved refined mark; source artwork and ownership/license details.
2. Confirmed product description, shipping capabilities, supported harness/provider/OS matrix.
3. Actual installation commands, download artifacts, latest stable version, release provenance, and release notes.
4. Verified screenshots or explicit demo fixture data for product previews.
5. Final pricing/limits, offer eligibility, cancellation timing, tax/currency presentation, refund policy.
6. Dashboard data dictionary: request definition, tool-loop counting, retries/errors inclusion, input/output/cached tokens, cost pricing date and currency, refresh delay and data retention.
7. Support destination, business identity/contact, privacy and terms text matching actual operations.
8. Final page titles, descriptions, social preview image, icons, canonical domain, and transactional-email templates.

## Accessibility and responsive acceptance criteria (proposed)

Target WCAG 2.2 AA; formally verify against the chosen standard during implementation. These are planning acceptance criteria, not a claim of current compliance.

- All actions usable by keyboard, visible focus, correct headings/landmarks, skip navigation, and focus restored after dialogs.
- Labels and errors programmatically associated; accessible password reveal, autofill, and paste/password-manager support.
- Normal text contrast at least 4.5:1; large text and meaningful UI boundaries at least 3:1. Selection/state never depends only on teal.
- Screen-reader text for icon controls, sensible logo alternative text, status updates announced without repeated disruption.
- Charts have text totals and accessible data/table equivalent. Tables preserve headers and readable numeric alignment.
- Dialogs trap focus appropriately, Escape closes when safe; subscription actions describe actual consequences.
- Test representative 320/375px mobile, 768px tablet, and desktop widths; no page-level horizontal overflow at narrow widths. For dense history, use an accessible contained scroll or purpose-designed row layout.
- Support 200% zoom, reduced motion, long email/model names, unusually large totals, localization-ready dates/currencies.
- Mobile navigation and checkout return flows work without hover. Touch targets should meet minimum standard and aim for comfortable 44px controls.
- Real loading, empty, partial-data, error, success, and disabled states are designed before completion.

## Highest-priority unresolved decisions

Ask these in a coordinated sequence with other workstreams, not all at once:

1. What release is being designed: realistic launch-ready service or a marketing site/dashboard prototype? Which backend and release assets exist?
2. Which operating systems, package managers, and harness integrations are actually supported at launch?
3. What account-to-CLI activation method and event define an activated user? How do we allocate exactly the first 1,000 valid entitlements?
4. Is $5 final, what routing allowance applies, and how do cancellation/refund/renewal rules work?
5. What metadata will the service receive, how fresh is it, how long is it retained, and can users delete/export it? Do not collect prompt content just to populate request history.
6. What domain is available/owned? The selected logo raster is available; exact vector refinement needs review.
7. Are docs and pricing separate pages, and which support channel will be staffed?

## Design phase deliverables after requirements agreement

Page inventory and final scope → primary journey wireframes including state matrix → visual tokens and logo refinement → responsive landing/download/dashboard/billing designs → approved copy and verified data examples → implementation brief with acceptance criteria.

Source guidance consulted: Sites skill and its presentation-led-sites reference. No new implementation, registration, publishing, or image generation performed.
