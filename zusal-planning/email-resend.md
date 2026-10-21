# Resend transactional email candidate

Research date: 17 October 2026. Scope: Zusal Google/email-password accounts, verification/reset, and necessary account/trial notices. Supabase Free + Netlify Free + Paddle are selected assumptions; no signup, domain changes or sends performed.

## Recommendation

Resend Free is a practical low-friction start for a controlled launch, because it directly supports Supabase SMTP and does not require a paid subscription for production sending. It cannot support a sudden 1,000-email signup wave on the free daily quota. Either stage invitations or fund Pro before a public spike; never make password reset wait behind optional notices.

## Current limits and costs

Transactional Free: $0, 3,000 emails/month, 100/day, three domains, one webhook endpoint and 30-day data retention. Pro: $20/month, 50,000 emails/month, no daily limit, ten domains; additional emails $0.90/1,000 when paid overages are enabled. Verify the actual account dashboard before launch; old 2023 blog domain limits differ from current pricing. [Current pricing](https://resend.com/pricing?product=transactional), [paid overages](https://resend.com/changelog/pay-as-you-go-pricing)

These count emails, not customers. One signup confirmation plus two trial notices already consumes three sends; retries, resets, changed emails and other transactions consume more. First-1,000 grants describe entitlement eligibility, not a guarantee of email throughput. Google sign-in need not incur an extra confirmation send unless our app chooses to send one.

## Production eligibility and sender domain

Official docs say Free accounts have production access without a separate approval wait. Sending still requires domain setup and applicable policies/quotas. [Production access](https://resend.com/docs/knowledge-base/does-resend-require-production-approval)

The shared `resend.dev` sender is testing-only and can send only to the Resend account owner's email. Real recipients require a verified domain we control, and a matching sender address. [Recipient restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)

Verify required DNS records, configure SPF/DKIM and DMARC, and use a transactional subdomain to separate future marketing reputation. Sending from an address does not by itself create a support inbox; replies need a monitored mailbox/forwarding arrangement. [Domain guide](https://resend.com/docs/dashboard/domains/introduction)

## Supabase and operational integration

Official SMTP recipe: host `smtp.resend.com`, TLS port 465, username `resend`, API key as SMTP password, plus verified sender/domain. Keep credentials in Supabase/backend configuration, never the website bundle. This supplies verification/reset emails without adding website-host coupling. [Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp)

Supabase has its own auth email rate limit after custom SMTP configuration (initially 30/hour), distinct from Resend's daily/monthly cap. Align both limits with launch traffic and anti-abuse controls. [Supabase SMTP limits](https://supabase.com/docs/guides/auth/auth-smtp)

For auth emails disable open/click tracking; link rewriting can break verification links. Prepare for mailbox scanners consuming single-use links; test an explicit confirmation-button flow. Monitor bounces, suppression and delivery failures; delivery accepted by a recipient server is not proof of inbox placement. A branded Supabase auth domain is an optional separate cost/plan consideration, not a prerequisite imposed by Resend SMTP. [Auth deliverability guidance](https://resend.com/docs/knowledge-base/how-do-i-maximize-deliverability-for-supabase-auth-emails)

Proposed application behavior: reserve capacity for verification/reset; schedule trial notices with deduplication, retry transient failures and monitor quota. Keep app trial messaging separate from Paddle-owned billing emails to avoid duplicate/conflicting renewal notices. No marketing broadcasts in initial scope.

## Comparison summary

Best for easy developer setup, Supabase compatibility and no fixed spend during a gradual launch. Tradeoff: restrictive 100/day Free cap and a $20 paid step; an email provider with cheap metered volume may cost less if signup waves are expected. No provider can guarantee inbox placement. If choosing Resend, record Free as a controlled-launch decision, not an unrestricted 1,000-user launch guarantee.
