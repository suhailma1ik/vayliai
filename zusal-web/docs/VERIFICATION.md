# Local verification — 18 October 2026

- `npm run check`: zero errors, warnings or hints.
- `npm run check:edge`: passes the separate Supabase runtime type check.
- `npm test`: 17 passing tests, no skips. Covers metadata validation, null usage, date/filter calculations, formula-safe CSV, webhook raw-byte authentication and replay age, recent-auth requirements, cookie encryption/purpose binding and origin checks; PostgreSQL tests cover tenant RLS, privilege restrictions, replay accounting, activation cutoff, one-use pairing, deletion cascades and renewal event ordering.
- `npm run build`: 18 static pages; generated CSP contains hashes for inline application scripts.
- `npm audit --audit-level=high`: zero known vulnerabilities reported by npm.
- Isolated Chrome + Playwright + axe: nine light-theme page scans and four dark-theme scans, no selected WCAG A/AA automated violations. Five mobile layout checks at 390px, no page overflow. Dashboard date controls, history status filtering, CSV download and request expansion pass. No JavaScript/console errors with the built CSP enforced by the test harness. Automated scans do not replace keyboard/screen-reader or hosted integration testing.
- Desktop/mobile screenshots and JSON results are in `artifacts/`.

No live Supabase tenant, Netlify deployment, Google OAuth application, Paddle merchant, Resend domain, Discord invite or CLI release was configured. Hosted auth/session renewal, payment lifecycle/refunds/chargebacks, deletion against real processors, quota/load behavior, and native harness installation still need staging verification. CI is supplied but has not run on GitHub.

Preview: http://127.0.0.1:4322 ; demo: http://127.0.0.1:4322/app/demo . Local preview does not run Netlify Functions.
