# Implementation references

Consulted official documentation during implementation; verify again when upgrading dependencies.

- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/): React islands on static Astro pages.
- [Astro CLI](https://docs.astro.build/en/reference/cli-reference/): build and preview. Agent auto-background behavior is avoided with `--ignore-lock` for managed terminal sessions.
- [Netlify redirects](https://docs.netlify.com/manage/routing/redirects/overview/): static routes and fallback behavior.
- [Supabase Edge authentication](https://supabase.com/docs/guides/functions/auth-legacy-jwt): explicit bearer verification with `auth.getUser()`; custom device credentials have separate checks.
- [Supabase JWT fields](https://supabase.com/docs/guides/auth/jwt-fields): authentication-method timestamps for sensitive actions.
- [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp): account email production setup.
- [Paddle transaction creation](https://developer.paddle.com/build/transactions/create-transaction/): server-created transaction IDs.
- [Paddle checkout open](https://developer.paddle.com/paddlejs/methods/paddle-checkout-open): checkout via transaction ID.
- [Paddle webhook verification](https://developer.paddle.com/webhooks/about/signature-verification/): signed raw request bytes and timestamp.
- [Paddle subscription-created event](https://developer.paddle.com/webhooks/subscriptions/subscription-created/): transaction association; initial created notification alone does not activate access in this implementation.
- [Paddle webhook lifecycle](https://developer.paddle.com/webhooks/about/how-webhooks-work/): completed transactions and subscription lifecycle.

These are implementation references, not evidence that merchant approval, live authentication, payment collection, email delivery, or harness integration has been tested.
- [Paddle customer portal sessions](https://developer.paddle.com/api-reference/customer-portals/create-customer-portal-session/): temporary authenticated portal links; portal host validation also follows [the management-link changelog](https://developer.paddle.com/changelog/2025/subscription-management-links-customer-portal/).
