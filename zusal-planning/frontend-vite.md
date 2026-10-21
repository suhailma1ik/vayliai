# React + Vite frontend assessment

Research: 17 October 2026. Netlify Free, Supabase Free (Auth/Postgres/Edge Functions), Resend Free and Paddle fixed. No implementation. Scope: SEO-visible landing/pricing/docs/download plus private usage/history/billing dashboard.

## Recommendation

React + Vite is the leanest dashboard-centric option, but I would not make every public page a plain client-rendered SPA. Use build-time-generated public HTML and React for account/dashboard interaction. For this mixed content/product scope, Astro + React offers that composition more directly; Next.js is justified mainly if server-rendered application features are expected soon. This is an engineering assessment, not a benchmark.

## What Vite provides and leaves to us

Vite builds deployable assets into `dist` and Netlify supports those builds. It does not automatically render React route content into public HTML. Its SSR API is deliberately low-level; a framework/prerender integration or explicit static HTML generation is needed for that behavior. `vite preview` is a local preview tool, not production hosting. [Vite static deploy](https://vite.dev/guide/static-deploy.html), [SSR guide](https://vite.dev/guide/ssr.html)

Advantages: simple static deployment, one React component ecosystem for charts/forms, fast iteration, no required server-rendering runtime. Tradeoffs: we choose routing/data loading and content/prerender strategy, rather than assuming the bundler supplies an application framework. React's own from-scratch guide highlights these additional choices and recommends frameworks for many new apps. [React guide](https://react.dev/learn/build-a-react-app-from-scratch)

## Public content versus private data

Pure SPA can work functionally and some search engines render JavaScript, but it leaves initial public content and route metadata dependent on script execution. Prefer HTML per public URL with titles, descriptions, canonical tags and share metadata available immediately; don't claim a SPA is unindexable.

Private usage charts/history can fetch Supabase after login; dynamic data does not itself require SSR. RLS/backend authorization protects data, not the route's loading screen. Keep entitlements, Paddle secrets and trial-grant writes in backend. Public pricing/download docs should not require an authenticated session.

## Netlify routing and authentication

Netlify documents a `/* /index.html 200` fallback for SPA deep links. Put it last, avoid forced shadowing of prerendered pages, and route missing marketing/docs pages to real 404 behavior where practical. A scoped `/app/*` fallback is cleaner for a mixed static/public and SPA/private site. Ensure the actual callback/reset page exists or rewrites to the intended app entry. [Netlify Vite](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/), [rewrite rules](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)

Supabase OAuth/email redirects must use our configured production URLs and explicitly allowed preview URLs. A rewrite only serves the callback route; it does not perform OAuth code exchange or authorize the user. Test Google return, confirmation, password reset, refreshed nested routes and expired sessions. [Supabase redirects](https://supabase.com/docs/guides/auth/redirect-urls)

## Comparison

| Option | Fit for Zusal | Main cost/tradeoff |
|---|---|---|
| React + Vite | Excellent interactive dashboard; portable static build | Public content prerender/routing needs another deliberate layer |
| Astro + React | Strongest default for static public marketing/docs plus interactive dashboard | Two component conventions; mount a coherent React dashboard rather than disconnected stateful islands |
| Next.js | Good if full-stack SSR, server components or server-side sessions become central | More framework/runtime behavior than current external-backend scope needs |

Astro prerenders page HTML and hydrates chosen client components; Next.js can also export static HTML, so it is not inherently a paid-server requirement. Its static-export mode excludes features requiring a server. [Astro islands](https://docs.astro.build/en/concepts/islands/), [Next static export](https://nextjs.org/docs/app/guides/static-exports)

All three can use the selected external backend and static hosting; do not rank them by invented fixed runtime fees. For Vite, select a maintained prerender framework/plugin only if we choose it; no unverified dependency commitment is made here.
