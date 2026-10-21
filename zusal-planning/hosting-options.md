# Zusal — frontend hosting shortlist

Research date: 17 October 2026. Supabase Free selected for Auth/Postgres/compatible backend functions; Paddle selected for billing. Website hosting is unselected. INR 10,000/month total operating budget. No deployment/account/purchase performed.

## Founder decision

Founder selected option 2: Netlify, starting on Free. This supersedes the Cloudflare recommendation below. Retain Supabase backend and Paddle billing. Observe shared credit limits and live-site pause behavior; no automatic paid upgrade. No hosting account or deployment performed.

## Ranked options for founder choice

1. **Cloudflare Workers Static Assets Free — recommended:** serve prebuilt landing/download/docs/auth/dashboard files. Static asset requests are free/unlimited under documented limits. Cloudflare now recommends Workers over Pages for new projects. Keep paid/private database access, Paddle secrets and Jev assessment in server-side Supabase functions. Dynamic Worker/SSR execution has separate quotas/pricing. User accounts/dashboard can be dynamic through APIs even when frontend assets are static.
2. **Netlify Free:** commercial projects permitted, custom domains/HTTPS supported. New accounts use credit-based pricing: 300 shared monthly credits; traffic and production deployments consume credits. Free has a hard limit with no auto-recharge; exhaustion can pause all sites on the team, including live traffic. Useful alternative but more restrictive for our frontend than Cloudflare static hosting.
3. **Vercel Pro:** strong Next.js platform and preview workflows, but Hobby explicitly excludes commercial use. Pro starts from a paid plan plus applicable usage. Not recommended for this budget unless specific Next.js/server features justify ongoing cost. No assumption that pre-revenue Zusal marketing is noncommercial.

## Proposed boundary

Cloudflare serves frontend files → browser authenticates via Supabase → authorized reads via RLS/backend → server-only Paddle/Jev operations in Supabase Edge Functions. Never include Paddle API secrets, privileged database keys, or Jev credentials in frontend assets. Domains, public-page prerendering/SEO, auth redirect allowlists, SPA fallbacks and releases need verification during implementation.

No frontend framework is finalized. Pre-render public marketing/docs routes and hydrate interactive dashboard as needed; avoid assuming runtime SSR is required. CLI packages/binaries should use a verified package/release distribution channel rather than large website assets or Supabase free database storage. Domain registration is separate from hosting.

## Sources

- [Cloudflare new-project guidance](https://developers.cloudflare.com/pages/)
- [Workers static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Vercel Hobby restrictions](https://vercel.com/docs/plans/hobby)
- [Netlify free commercial usage](https://www.netlify.com/blog/introducing-netlify-free-plan/)
- [Netlify credit plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- Specialist reports: `hosting-cloudflare.md`, `hosting-netlify.md`, `hosting-vercel.md`.

Hosted Sites has its own identity/deployment workflow; this independently hosted plan must preserve the user's Google/email login requirement rather than silently substituting ChatGPT login. This shortlist is a requirements decision, not an instruction to publish via another platform.
