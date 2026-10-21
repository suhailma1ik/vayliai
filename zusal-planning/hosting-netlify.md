# Netlify hosting candidate

Research date: 17 October 2026. Zusal: commercial worldwide English-first SaaS; Indian sole proprietor; Supabase Free backend and Paddle billing chosen; ₹10,000 total monthly operating budget, preference to avoid fixed expenses. Planning only, no signup or deployment.

## Recommendation

Netlify is a valid commercial host and strong fallback, but its current Free credit pool makes it a weaker zero-fixed-cost choice than a static host that does not meter production deployments and static traffic together. Choose it when its deployment tooling is worth the credit management or a $9/$20 recurring hosting cost. Current Zusal scope does not require SSR or Netlify Functions: use static-generated public pages plus a browser dashboard calling secured Supabase APIs/Edge Functions. Server secrets and Paddle webhooks remain backend responsibilities.

## Verified facts

- Netlify explicitly says Free can host commercial projects. Its 2024 announcement is useful for permission, not today's quotas. [Official announcement](https://www.netlify.com/blog/introducing-netlify-free-plan/).
- Current credit-plan documentation lists Free $0 with **300 monthly credits and a hard limit**, Personal $9 with 1,000, Pro from $20 with 3,000. Free has no recharge option; paid-plan recharge is off by default. [Current plan documentation](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/).
- Current metering: **15 credits per production deployment**, **20 per GB bandwidth**, **2 per 10,000 web requests**, **10 per GB-hour function compute**. Deploy previews/branch deploys have no deployment charge, but traffic to previews still counts. File downloads and page assets contribute bandwidth; do not host sizable release artifacts without modeling it. [Pricing](https://www.netlify.com/pricing/).
- Illustrative arithmetic: 10 production deployments consume 150/300 free credits. The other 150 cover at most 7.5GB bandwidth if nothing else consumes credits; real allowance is lower once requests/other meters are included. 20 deployments alone exhaust 300. This is not a monthly capacity promise.
- When a team's allowance is exhausted, **all its projects pause**, including live traffic, forms and deploys. Visitors see site unavailable. Free resumes at the next cycle or upon paid upgrade; the protection against unexpected billing comes with an availability tradeoff. [Pause behavior](https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/).
- Custom domains, SSL and global CDN are included. Domain registration remains a separate purchase. Git/API deployments and deploy previews are supported. [Pricing](https://www.netlify.com/pricing/).
- SPA deep links need fallback configuration such as `/* /index.html 200`. Public landing/docs pages can be generated as actual HTML for search visibility, with fallback limited appropriately to dashboard routes. [Official SPA troubleshooting](https://docs.netlify.com/resources/troubleshooting/page-not-found-error-guide/).

## Commercial and stack comparison

| Host | Commercial fit | Zusal implication |
|---|---|---|
| Netlify Free | Explicitly permitted | $0 starting cost, shared credit exhaustion can take live website offline |
| Cloudflare Pages / static Workers | See companion Cloudflare research for current permission/quotas | Prefer if its static delivery economics and framework deployment meet requirements |
| Vercel Hobby | Official terms restrict to personal/noncommercial use | Not appropriate for Zusal's commercial site; assess Pro if selecting Vercel |

[Vercel terms](https://vercel.com/legal/terms) explicitly restrict Hobby. Avoid stale advice that any free tier is acceptable for paid SaaS.

## If selected

Use previews for iteration and deliberately publish production batches. Link package/download assets to their verified release distribution rather than consuming website bandwidth unnecessarily. Set usage alerts and keep recharge disabled unless the founder explicitly chooses automatic spending. Do not duplicate the chosen Supabase backend with Netlify Database simply because included. Website authentication is implemented with Supabase, not paid host-wide password protection. Overall cost still includes Supabase limits, auth email, domain, Jev and Paddle transaction fees; Netlify Free does not guarantee the whole product stays inside ₹10,000.
