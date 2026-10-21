# Zusal — frontend framework shortlist

Prepared 17 October 2026. Decision pending founder choice. All candidates are open-source frameworks; choosing Next.js does not require Vercel or paid runtime SSR. Netlify Free, Supabase Free, Resend Free and Paddle are already selected.

## Founder decision

Founder selected option 1: Astro + React after discussing all three alternatives. This supersedes pending wording below. Use static public pages and an interactive React dashboard, with backend authorization/data in Supabase. No implementation, account creation or deployment performed.

## Ranked options

1. **Astro + React — recommended:** generate public landing/pricing/download/docs pages as HTML, with React for interactive dashboard/charts/forms. Fits public content plus authenticated application; adds Astro and React conventions rather than a single React-only setup.
2. **React + Vite:** simplest React application build/deployment path for interactive dashboard. Plain Vite does not generate rendered HTML for each React route automatically; public marketing/SEO/social metadata need a deliberate rendering/pre-rendering approach.
3. **Next.js:** integrated routing and public HTML generation; supports static export on Netlify as well as server rendering. Static mode has feature restrictions; runtime server features add deployment/usage considerations. Useful if server-rendered authenticated flows become a real requirement, not necessary for current external-backend scope.

## Proposed architecture (not selected yet)

Astro static public pages + one coherent client React app for authenticated routes → Supabase account/data APIs → Supabase Edge Functions for privileged operations/Paddle webhooks. Pre-render public data only; never include per-user/private data or server secrets in build artifacts. Client route gating is UX, not authorization; enforce access through database policies/server endpoints.

Netlify rewrites should be scoped so dashboard deep links work without masking missing public routes. Test Google callback/password-reset paths and allowlists on preview and production origins. Domain question is pending. This is a framework recommendation, not implementation authorization or a substitute for product/page requirements review.

## Sources and reports

- [Astro islands](https://docs.astro.build/en/concepts/islands/)
- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Vite static deployment](https://vite.dev/guide/static-deploy.html)
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- Specialist reports: `frontend-astro.md`, `frontend-vite.md`, `frontend-next.md`.
