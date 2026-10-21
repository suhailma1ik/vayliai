# Brevo transactional email for Zusal

Research: 17 October 2026. Planning only; no accounts, DNS changes or sends. Zusal uses Supabase Free, Netlify Free and Paddle; total operating budget ₹10,000/month. Need verification and password reset for first 1,000 activated users.

## Recommendation

Brevo is a valid low-cost SMTP candidate for a controlled launch, but **300/day is a daily bottleneck**, not a flexible 9,000/month pool. Transactional platform activation and mandatory free-plan branding reduce its attractiveness versus an auth-focused transactional service. Pick it if daily volume and branding are acceptable and approval/delivery tests pass; reserve a paid upgrade before a concentrated launch surge.

## Confirmed limits and costs

- Free includes **300 email sends/day**, SMTP/API and transactional email. Unused daily allowance does not roll over. At the cap, up to 1,000 transactional messages enter a retry queue; beyond that they are not delivered. Queued verification/reset messages may become stale before arrival. [Official Free FAQ](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan).
- This is based on sends, not guaranteed inbox delivery. A user base of 1,000 can fit across days, but 1,000 email signups on launch day cannot all get immediate verification on Free. Budget also for retries, password resets, address changes and other messages.
- Current official plans start **Starter $9/month for 5,000 monthly sends**; paid removes the 300/day limit, but its monthly minimum can be lower than free's theoretical 30-day total. Pricing is volume/plan dependent, not simply $9 for unlimited email. [Official plan details](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans), [transactional product pricing](https://www.brevo.com/products/transactional-email/).
- Free FAQ says emails always include the **Sent with Brevo** sticker. Starter removes it only with a separate branding add-on, listed as $9/month in Help; Standard includes removal. Product page displays inconsistent localized add-on pricing, so verify checkout before quoting all-in charges. Do not promise unbranded auth emails on Free.
- Prepaid credits are a separate purchasable option, available for both marketing and transactional sends, starting in 5,000-email packs; never expire. Pack price requires current account/checkout quote. One credit is an email sent to one contact. Stored-contact allowance is not transactional sending allowance. [Plan/add-on explanation](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans).

## Production setup

- Brevo documentation states transactional sending requires separate activation; new accounts may need a support ticket. Signup or a paid plan does not prove SMTP is ready. Sender must be verified. [SMTP activation/troubleshooting](https://help.brevo.com/hc/en-us/articles/115000188150-Troubleshooting-Issues-with-Brevo-SMTP).
- Authenticate a controlled sending domain using Brevo code, DKIM and DMARC. Shared infrastructure does not require adding Brevo SPF/MX records; those apply to dedicated-IP setup. Preserve existing DNS policy and one DMARC record; follow generated values. DNS verification can take up to 48 hours. [Official domain authentication](https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC).
- Configure Supabase custom SMTP using **SMTP credentials/key, not an API key**. Supabase's built-in SMTP is non-production, team-address only and two messages/hour. Custom SMTP initially defaults to **30 messages/hour**, adjustable separately from Brevo's daily cap. [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Brevo-specific integration](https://developers.brevo.com/docs/supabase-smtp-integration).
- Use current account-provided username; Brevo documents account-dependent SMTP logins. Do not blindly hardcode the signup email from an integration example. [SMTP keys](https://help.brevo.com/hc/en-us/articles/7959631848850-Create-and-manage-your-SMTP-keys).

## Before launch

Confirm SMTP activation, sender/domain verification, exact auth email branding, safe link handling and actual Gmail/Outlook delivery. Disable link tracking if it rewrites single-use auth links; coordinate Supabase auth settings and rate limits. Monitor bounces/delivery using transactional logs/webhooks rather than equating SMTP acceptance with inbox delivery. [Transactional events](https://developers.brevo.com/docs/transactional-webhooks).

Keep promotional mail separately permissioned and avoid allowing campaigns to consume the auth-email allowance. Paddle's billing emails are a separate delivery path. Recommendation is conditional on measured launch volume; no deliverability guarantee is established by advertised percentage claims.
