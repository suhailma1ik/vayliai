# Zusal: India individual / sole-proprietor launch assessment

Research date: 17 October 2026. Assumes a solo founder resident and operating in India; the founder has not yet confirmed jurisdiction. Product: worldwide English-first routing subscription, tentative US$5/month; model providers bill users separately; ₹10,000/month operating budget. This is an assessment for choosing a launch route, not a finding that any account or tax treatment is approved.

## Assessment

An India sole proprietorship is the strongest lean validation option if the founder accepts personal liability and is not presently raising equity. It avoids creating a company solely to test demand. Pairing it with an approved merchant of record (MoR) may simplify international subscription checkout and customer sales-tax handling. That does not remove the founder's Indian income-tax, GST/export, accounting or banking responsibilities; those depend on actual facts and need confirmation before money flows.

Do not conflate a sole proprietorship with incorporation. Startup India's guide says the business has no separate existence from the proprietor and liability is unlimited. The official Udyam portal provides free paperless MSME registration and identifies the proprietor's Aadhaar for proprietorship applications; Udyam is not a separate liability-shielding company.

Sources: [Startup India entity guide](https://www.startupindia.gov.in/content/sih/en/startup-scheme/international/go-to-market-guide/types-of-businesses.html), [official Udyam portal](https://udyamregistration.gov.in/).

## Individual versus sole proprietor matters for payments

Stripe's India documentation specifically distinguishes an unregistered individual from a formally registered sole proprietorship (typically Udyam documentation). It allows individuals domestic payments only; companies, LLPs and sole proprietorships may support international payments. Stripe India remains invite-only. Therefore do not plan worldwide subscriptions around a normal individual Stripe account, or assume registration guarantees an invitation. Its onboarding documentation lists international payment documentation including IEC and RBI purpose-code requirements; verify requirements for the actual service/account.

Sources: [Stripe India supported businesses](https://support.stripe.com/questions/supported-payment-methods-currencies-and-businesses-for-stripe-accounts-in-india?locale=en-GB), [Stripe India onboarding](https://support.stripe.com/questions/details-needed-to-create-an-account-with-stripe-in-india).

## MoR route: plausible, not preapproved

Paddle explicitly supports individual/sole-trader identity verification and says its separate business-identification step is not required for those sellers. India is not on its unsupported supplier-country list. This makes an application plausible, not guaranteed: identity, product, domain and risk review still apply.

Paddle requires a live HTTPS website, pricing information, accessible terms/refund/privacy policies and other domain-review information. An MoR can manage subscription checkout and customer-side sales taxes; it does not make the founder a corporation or resolve all Indian compliance.

Sources: [identity verification](https://www.paddle.com/help/start/account-verification/what-is-identity-verification), [business identification](https://www.paddle.com/help/start/account-verification/what-is-business-verification), [supplier countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle), [domain review](https://www.paddle.com/help/start/account-verification/what-is-domain-verification), [MoR overview](https://www.paddle.com/paddle-101).

## Economics requiring confirmation

Paddle's public headline is 5% + $0.50 per checkout transaction, with no monthly charge. At $5 that arithmetic is $0.75 (15%) before any other applicable effects. However its own Paddle-101 page flags separate pricing for transactions under $10. Since Zusal is $5, obtain a written applicable fee schedule before treating $0.75 as the quote. Payout timing, minimums, FX, refunds and chargebacks also affect cash flow and should be compared when selecting the payments provider.

Sources: [Paddle pricing](https://www.paddle.com/pricing), [small-transaction note](https://www.paddle.com/paddle-101).

## When to choose / avoid

- Choose for a solo, bootstrapped validation launch with small budget and no immediate equity investment.
- Avoid treating it as the long-term answer if limited liability, cofounder equity, fundraising or substantial contracts are imminent; evaluate OPC/private limited instead.
- Worldwide audience does not itself require a foreign company. Do not incorporate abroad solely on an assumption that payments become automatic.
- Later changing entity means rechecking seller identity, contracts, bank details and subscriptions with the payments provider; do not assume an invisible migration.

## Checks before committing

Confirm residence and state, existing business registrations, founder/cofounder plans, approved MoR eligibility and applicable $5 subscription fees, payout account/documents, and relevant Indian accounting/export obligations. No action has been taken to form a business or apply for payments.
