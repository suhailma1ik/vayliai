# Cloudflare hosting candidate for Zusal

Researched 17 October 2026. Scope: normal public website, independent of Sites plugin; Google/email authentication through selected Supabase backend and billing through Paddle. No deployment or signup. ₹10,000/month total budget.

## Recommendation

Cloudflare is a strong lowest-fixed-cost option for Zusal's landing, docs, download and client-rendered dashboard. However, for a new project choose **Workers Static Assets**, rather than starting Pages by default: Cloudflare's current Pages overview expressly calls Workers its primary application platform and recommends it for new projects. Pages remains a viable static host. [Current platform guidance](https://developers.cloudflare.com/pages/), [Static Assets](https://developers.cloudflare.com/workers/static-assets/)

Serve static/prerendered marketing/docs pages and a client-side authenticated dashboard. Keep existing custom backend responsibilities in Supabase-compatible Edge Functions unless a Worker has a concrete purpose. This avoids paying for two dynamic backends.

## Pricing and limits

Pages Free is $0, with unlimited static requests/bandwidth, SSL, 500 monthly builds, one build at a time, 100 custom domains, 20,000 files and maximum 25 MiB per asset. These are not unlimited dynamic compute promises. Pricing is not labeled personal/noncommercial-only; a normal commercial SaaS front end fits the published product positioning, subject to applicable terms and acceptable-use policies. No special account approval has been established. [Pages plans](https://pages.cloudflare.com/), [limits](https://developers.cloudflare.com/pages/platform/limits/)

Workers Free supports 100,000 dynamic requests/day, 10 ms CPU per invocation. Paid minimum $5/month includes 10 million requests and 30 million CPU-ms; published overage $0.30/million requests and $0.02/million CPU-ms. Static asset requests are free/unlimited when served as assets; requests invoking runtime/cache behavior can be billed differently. Pages Functions share Workers billing/quotas. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/)

Start website hosting at $0 if static. Domain registration, SMTP, Supabase and Paddle fees remain separate. Optional Workers Paid is $5/month when dynamic needs justify it; it is not an all-in Zusal budget. Free daily limits are a ceiling, not an availability or scale guarantee.

## Framework implications

Static React/Vite is simple for dashboard interaction but needs prerendered/public HTML for strong marketing/docs indexing. A static-site framework with React components is also suitable. SSR is not required just because login exists. If choosing full Next.js SSR, use its supported Workers integration rather than assuming Pages runs a normal Node server. [Pages Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

Custom apex domain on Pages requires Cloudflare nameservers; a subdomain can use external DNS with required configuration. Register the final domain separately. [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Integration requirements

- Supabase: configure production Site URL and explicit auth callback/reset redirect URLs. Separate preview environments so production login redirects do not point to arbitrary preview hosts. Browser client uses publishable key plus RLS; privileged keys stay in backend. [Redirect rules](https://supabase.com/docs/guides/auth/redirect-urls)
- Paddle: Paddle.js opens checkout from the static frontend using a client token; only approved live checkout domains may serve it. Keep API keys and signature-verified entitlement webhooks in backend. Static hosting does not block checkout. [Client tokens](https://developer.paddle.com/paddle-js/about/client-side-tokens/), [domain approval](https://developer.paddle.com/api-reference/checkout-domains/)
- Downloads: link versioned release/package-registry artifacts externally, with OS/harness install instructions and checksums as applicable; do not put large platform installers in Pages' 25 MiB assets. External release hosting has its own limits/terms.

## Decision assessment

Best when minimizing fixed infrastructure costs and retaining portable static assets matters. Main tradeoff is runtime-specific work if future server rendering or complex Node libraries move into Workers. Supabase availability, auth email delivery, Paddle approval and browser session security remain separate from the website host. No ChatGPT-native Sites identity is assumed.
