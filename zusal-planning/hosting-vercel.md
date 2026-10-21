# Vercel for Zusal hosting

Research: 17 October 2026. Planning only. Zusal is commercial SaaS; Supabase Free selected for backend, Paddle billing. ₹10,000 total monthly operating budget. No signup, deployment or implementation performed.

## Recommendation

Vercel **Pro** is the best convenience option if we choose full-stack Next.js with server rendering and want its native deployment workflow. It is not my first value choice for a mostly static marketing site plus client-rendered dashboard backed by Supabase. For that architecture, Cloudflare can preserve more of the budget without losing essential functionality. Netlify is an alternative with familiar deploy previews, but its credit allowance requires watching deploy and traffic consumption.

## Critical eligibility

Vercel Hobby explicitly permits only **non-commercial personal use**. Zusal's paid routing SaaS must not be planned on Hobby, even if traffic is small or launch access is temporarily free. [Official Hobby plan](https://vercel.com/docs/plans/hobby).

## Cost

Pro platform fee is **$20/month**, including one deploying team seat and **$20 infrastructure usage credit**. Extra deploying seats cost $20/month each; read-only viewer seats are free. The credit is not a second $20 mandatory charge and does not make Pro a hard $20 spending ceiling. Usage beyond included allocations/credit and add-ons costs extra. Taxes are additional where applicable. [Official Pro plan](https://vercel.com/docs/plans/pro-plan), [pricing](https://vercel.com/pricing).

Avoid an invented INR conversion; budget the USD fee plus actual FX/tax. This fixed charge is affordable within ₹10,000 total, but reduces funds for Jev, email, monitoring and other services before we have paid users.

Spend Management can alert, invoke webhooks or pause production. A threshold alone does not stop usage; pause must be enabled. Enforcement lags several minutes, and pausing means the website/APIs stop serving. Stored-resource charges can continue. [Spend Management](https://vercel.com/docs/spend-management).

## Framework and deployment fit

- **React/Vite static:** officially supported, Git deploy previews and environment handling; ensure SPA deep links rewrite correctly. With Supabase handling trusted APIs, Vercel's premium server conveniences may be unnecessary. [Vite support](https://vercel.com/docs/frameworks/frontend/vite).
- **Next.js:** native support for static generation, ISR, SSR, API routes/functions and streaming. SSR runs on Functions and adds metered compute; static pages avoid that runtime work. Keep marketing pages static/pre-rendered where possible. [Next.js support](https://vercel.com/docs/frameworks/full-stack/nextjs).
- Custom domains and automatic HTTPS are supported; deployments also have generated URLs. Domain registration/renewal and any promotional free-domain eligibility are separate from ongoing hosting. [Custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain).
- Published Pro limits include 6,000 deployments/day, 45-minute build duration and 1 GB source upload limit. These are unlikely launch blockers. Preview/production environment separation still needs correct Supabase redirects and credentials. [Limits](https://vercel.com/docs/limits).

## Brief alternatives

| Option | Why choose it | Tradeoff |
|---|---|---|
| Cloudflare | Free/unlimited requests to static assets; Workers Paid starts $5/month if server execution is needed | Full-stack SSR uses Workers runtime/adapters; verify framework compatibility |
| Netlify | Free commercial hosting is documented; convenient previews and static deployments | Current Free has 300 credits/month; production deploys cost 15 credits each plus traffic/compute; pause on exhaustion |
| Vercel Pro | Direct Next.js integration and convenient server rendering workflow | Commercial hosting begins at $20/month, usage/add-ons extra |

Sources: [Cloudflare static/Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Netlify commercial permission](https://www.netlify.com/blog/introducing-netlify-free-plan/) (use only permission, not its outdated quotas), [current Netlify plans](https://www.netlify.com/pricing/), [Netlify deploy credits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/).

No evidence that Vercel Pro increases Zusal's conversion or user-facing quality by itself. Choose it for actual framework/deployment benefit; for the current static-plus-Supabase requirements, Cloudflare is the more budget-conscious default.
