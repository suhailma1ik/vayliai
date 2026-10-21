# Zusal — transactional email options

Research date: 17 October 2026. Decision pending. Supabase Free + Netlify Free + Paddle confirmed. No email account created, credentials configured, DNS changed, messages sent or spend authorized.

## Founder decision

Founder selected option 1: Resend, starting on Free. This supersedes the pending status above. No automatic paid upgrade. Verify sender domain, Supabase SMTP settings, independent rate limits and launch-day capacity before production. No account, DNS change or email send performed.

## Shortlist

1. **Resend Free:** recommended for a small controlled pilot and simplest documented Supabase SMTP path. 3,000 transactional emails/month, 100/day; real recipients require own verified sender domain. Pro USD20/month if needed, not an automatic upgrade. Daily capacity must include confirmations, resets and app notices, not just signups. If expected daily volume exceeds quota, consider SES or another plan before public launch.
2. **Brevo Free:** 300 sends/day, no rollover; SMTP activation and sender authentication required. Branding/removal terms need verification; official Free FAQ says Brevo sticker remains. Queuing at limit is unsuitable as the normal behavior for time-sensitive auth links. Free volume alone does not establish deliverability or suitability.
3. **Amazon SES:** lowest marginal-cost candidate, but production access approval, domain/SMTP setup and bounce/complaint monitoring add operational work. Current new-account default Essentials is USD0.16/1,000; selectable à-la-carte USD0.10/1,000. Other data/features/taxes may add cost. Sandbox limits do not establish production capacity. Do not promise perpetual free SES based on obsolete offers.

## Shared requirements

- Verify a Zusal-owned sending domain/subdomain, authenticate DNS and test inbox placement.
- Configure Supabase custom SMTP and assess its independent initial auth-email rate limit (30/hour), alongside provider daily/monthly quotas.
- Preserve verification/reset URLs; disable interfering link tracking and test expiration/resend flows.
- Keep SMTP credentials server-side. Handle bounces/suppression, rate limiting and abuse; no inbox guarantee.
- Prioritize auth mail; avoid marketing messages in this operational scope. Application trial reminders require their own scheduling/deduplication logic.
- The first-1,000 promotion is an entitlement allocation, not proof of capacity for 1,000 same-day signups.

## Sources

- [Resend pricing](https://resend.com/pricing?product=transactional)
- [Resend Supabase integration](https://resend.com/docs/send-with-supabase-smtp)
- [Brevo free limits](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan)
- [SES pricing](https://aws.amazon.com/ses/pricing/)
- [SES production access](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)
- [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- Specialist reports: `email-resend.md`, `email-brevo.md`, `email-ses.md`.
