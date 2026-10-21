# Next.js frontend candidate

Research date: 17 October 2026. Selected infrastructure: Netlify Free, Supabase Auth/Postgres/Edge Functions, Resend, Paddle. No implementation or deployment performed.

## Assessment

Next.js is viable and does not require Vercel or paid hosting. For this site's current scope, static export is sufficient; a runtime deployment adds conveniences but overlaps with the selected Supabase backend. Prefer Next if one React framework and potential future server rendering matter most. Astro + React is arguably the cleaner content-first default; React + Vite is simplest for a dashboard but needs deliberate prerendering for public-page SEO. These are engineering judgments, not claims one framework universally performs better.

## Official static-export behavior

`output: 'export'` plus `next build` emits `out/` HTML/CSS/JS that any static web host can serve. Build-time Server Components and browser-side data fetching are supported. No Node server is required. Request-dependent cookies/handlers, Server Actions, runtime Proxy, ISR, and default image optimization are unavailable; unknown dynamic paths need design around build-time route enumeration. Static GET handlers can emit build-time files. `next export` was removed in v14: avoid stale deployment instructions that append it. [Official current static-export guide](https://nextjs.org/docs/app/guides/static-exports).

For Zusal, prebuild public landing/pricing/download/docs pages and metadata. Auth/dashboard can fetch private data in the browser. Use fixed dashboard routes and query parameters for request details, rather than needing arbitrary exported `/request/[id]` paths. Authentication and row authorization remain enforced by Supabase; hiding a client page is not access control. No user-specific data may be baked into the export. Next documents client navigation/data fetching and optional progression to server features. [SPA guide](https://nextjs.org/docs/app/guides/single-page-applications).

## Netlify runtime alternative

Netlify's maintained OpenNext adapter supports full runtime Next.js. SSR, ISR, request handlers and Server Actions use Netlify Functions; middleware uses an Edge Function; image optimization uses Netlify Image CDN. This adds platform integration/runtime behavior to test. Static export works without the runtime. [Current Netlify Next overview](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [official Netlify integration reference](https://github.com/netlify/context-and-tools/blob/main/skills/netlify-frameworks/references/nextjs.md).

The framework has no per-user fee. Hosting still consumes credits: Netlify Free has 300/month shared by deploys, traffic and compute; functions cost 10 credits/GB-hour, production deployments 15 each, bandwidth20/GB, requests2/10k. Exhaustion pauses live sites. Static Next avoids runtime function compute but not deploy/bandwidth/request meters. [Netlify pricing](https://www.netlify.com/pricing/), [pause rules](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/).

## Comparison for Zusal

| Choice | Advantage | Tradeoff |
|---|---|---|
| Next static export | Unified React routing/layouts plus prebuilt HTML, future runtime option | Must respect export constraints; some Next features intentionally unused |
| React + Vite | Straightforward browser application using existing Supabase backend | Public-page HTML generation, metadata and content/docs system need planning |
| Astro + React | Public content rendered statically with interactive React where needed | Astro/React boundary plus dashboard routing conventions to maintain |

SSR is a convenience if later required, not a prerequisite for billing or protected usage history. Paddle checkout creation/portal sessions and webhooks can remain Supabase Edge Functions. Reassess runtime Next only when actual needs justify it; don't add a duplicate API layer solely because the framework offers one.
