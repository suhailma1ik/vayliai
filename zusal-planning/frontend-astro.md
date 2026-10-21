# Astro + React frontend for Zusal

Research: 17 October 2026. Planning only. Selected services: Netlify Free, Supabase Free, Resend, Paddle. Public landing/pricing/download/docs plus authenticated usage, request history and billing dashboard. No implementation or external action.

## Recommendation

**Astro + React is my preferred architecture if Zusal treats its public website/docs as a substantial acquisition channel while keeping the dashboard bounded.** It produces content-rich public pages at build time and loads React where interaction needs it. React/Vite is simpler if the dashboard will dominate and the team wants one UI model. Next.js is appropriate if integrated server-rendered personalization/server routes become a real requirement; they are not presently required.

This is an architectural fit judgment, not proof of higher conversion or guaranteed performance. Good design, accessibility, content and asset discipline matter more than the framework name.

## What official docs establish

- Astro defaults to pre-rendered pages/routes/endpoints at build time. Static deployment needs no extra Netlify adapter. On-demand SSR needs an adapter; it can be enabled route-by-route if justified later. [Rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [Netlify deployment](https://docs.astro.build/en/guides/deploy/netlify/).
- Components ordinarily emit HTML/CSS without browser JavaScript; `client:*` opts interactive components into hydration. This suits public content and isolated demos without sending the entire dashboard bundle to the landing page. [Islands](https://docs.astro.build/en/concepts/islands/).
- Official React integration supports rendering/hydrating React components. `client:load` hydrates promptly; `client:only="react"` skips server rendering, useful for browser-dependent account UI and SDK state. A loading fallback should prevent a blank dashboard. [React integration](https://docs.astro.build/en/guides/integrations-guide/react/), [directives](https://docs.astro.build/en/reference/directives-reference/).
- Astro file-based routes and client dashboard routes are separate concerns. Static dynamic routes require build-time paths; unknown nested app paths do not magically resolve. [Routing](https://docs.astro.build/en/guides/routing/).

## Proposed shape

One repository/build: Astro pages for `/`, `/pricing`, `/download`, docs and policy content; one React application mounted within `/app/` for usage/history/billing/account settings. Login and auth callback routes may mount React components as needed. Supabase handles authentication/data authorization; trusted backend endpoints handle billing and account/device operations. Resend and Paddle secrets remain outside the static/browser bundle.

Use one React tree within the dashboard so auth state, query cache, routing and ordinary React context work normally. Do not make every dashboard card an isolated Astro island. Independent islands cannot share a normal React context wrapper; Astro documents external stores for cross-island state. [State between islands](https://docs.astro.build/en/recipes/sharing-state-islands/).

Dashboard deep links need a **scoped** Netlify 200 rewrite to the app shell (e.g. `/app/*` to `/app/index.html`, depending on actual output). Avoid a broad site-wide SPA fallback that turns missing docs pages into the app or masks genuine 404s. Verify refresh, back/forward, auth recovery callback and billing return links in the production-style build. [Netlify SPA rewrites](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).

## Honest tradeoffs

| Choice | Main strength | Main cost for Zusal |
|---|---|---|
| Astro + React | Prebuilt public content plus rich React dashboard; static hosting | Two component/rendering models and route boundary; shared styling requires discipline |
| React + Vite | One component model and app state approach; straightforward dashboard | Public content needs deliberate prerender/metadata approach rather than assuming a client SPA equals an SEO-ready site |
| Next.js | Integrated React page/server features when actually needed | More server/client/cache/runtime choices; static export removes features, server deployment adds operational usage |

Astro does not require two deployments, two domains or a second full app stack. It does require knowing which code runs at build time versus in the browser. Prefer shared design tokens/CSS and selected React components, not duplicated independent design systems. Avoid SSR initially: a static shell may be public while the protected data remains server-authorized; client-side redirects alone are not data security.

## Budget and maintenance

Static output avoids frontend server compute but still consumes Netlify bandwidth/request/deploy credits. Content edits cause rebuilds; release batching and previews should respect Netlify Free. Public prices and download metadata need a documented update source, and stale CLI release links must not require fragile manual edits. Future CMS or docs tooling is separate; no need to add it automatically.

Final choice should hinge on whether public content/docs justify Astro's second rendering model. For the current mixed marketing + dashboard scope, they plausibly do; if earliest delivery speed with an experienced React-only team dominates, choose React/Vite instead.
