# Amazon SES for Zusal transactional email

Researched 17 October 2026. Planning only; no account, DNS, credentials, approval request or messages created. Selected stack: Supabase Free Auth, Netlify Free frontend, Paddle billing; worldwide audience, India proprietor, ₹10,000 total monthly budget.

## Recommendation

SES is the low-variable-cost challenger, particularly if the founder already operates AWS. For a new founder at small launch volume, Resend/Brevo may save setup time; SES's tiny sending bill does not eliminate operational work or production approval. Use only transactional account/service email here, not a marketing suite.

## Current pricing — important change

New SES accounts and unused account/region combinations default to **Essentials from July 21, 2026**: $0.16 per 1,000 at initial volume, with no fixed Essentials base fee. **À-la-carte remains $0.10 per 1,000 outbound**, with no minimum; switch is allowed, first downgrade immediate if defaulted. Illustrative 10,000 sends: $1.60 or $1 respectively, excluding data, optional features and taxes. Pro has a $105/account/region monthly fee and is inappropriate here. Current AWS free offer is up to $200 general credits with time restrictions, not an ongoing 3,000-email/month promise. [Official current pricing](https://aws.amazon.com/ses/pricing/).

## Production prerequisites

- New accounts start in a region-specific sandbox: verified recipients/domains only, 200 sends per 24 hours and one per second. Request production access before public signup; AWS approval and final quotas are not guaranteed. [Sandbox/production access](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html).
- Supabase supports SES through custom SMTP. Default Supabase sender is nonproduction and restricted to team addresses; custom SMTP initially has a separate 30-message/hour Auth limit that needs deliberate review for launch bursts. SES approval does not remove Supabase rate limits. [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp).
- Configure SES region SMTP endpoint, TLS, sender identity and **SES SMTP username/password**, not raw IAM access keys. They are different credential types. Secrets remain in Supabase/backend, never Netlify client bundle. [AWS credential types](https://docs.aws.amazon.com/ses/latest/dg/send-email-concepts-credentials.html).
- Verify Zusal sending domain; configure DKIM and an intentional SPF/DMARC alignment setup (custom MAIL FROM if needed). Validate from/return-path behavior rather than blindly adding DNS records. Authentication improves legitimacy, but does not guarantee inbox placement. [SES email authentication](https://docs.aws.amazon.com/ses/latest/dg/email-authentication-methods.html).

## Work beyond SMTP

The project must monitor bounces/complaints and sender reputation, maintain suppression handling and rate limits, and verify email templates and links. SES is a sending service, not the site's account backend or a support mailbox. First 1,000 trial grants do not translate directly to 1,000 emails: verification, resends, resets, welcome and expiry notices each add volume. Billing emails sent by Paddle need not be duplicated.

## Comparative judgment

| Candidate | Why choose | Main tradeoff |
|---|---|---|
| SES | Very low pay-as-you-go cost and no mandatory à-la-carte base fee | AWS IAM/region configuration, production review and deliverability operations |
| Resend | Developer-oriented transactional setup and tooling | Daily/monthly free limits; verify actual launch quota and paid price in companion report |
| Brevo transactional SMTP | Potentially useful daily free allowance | Separate product/account approval and transactional settings; do not select its marketing suite by accident |

All three are listed as SMTP-compatible by Supabase. Final Resend/Brevo quotas/prices require their own current official research; this report does not claim comparative deliverability superiority. SES is a valid #3 if time-to-launch simplicity wins; a strong #1 on marginal sending cost once AWS setup and approval are complete.
