# Razorpay for Zusal subscriptions

Research: 17 October 2026. India sole proprietor confirmed; possible Dubai entity later. Worldwide English-first $5/month routing SaaS; ₹10,000 monthly operating budget. Research only, no account or external action.

## Assessment

Razorpay is a credible lower-processing-cost option, particularly for Indian customers, but ranks behind a suitable Merchant of Record (MoR) for this worldwide solo-founder launch. With Razorpay, Zusal remains the seller and must arrange applicable customer-tax compliance. Do not compare percentage fees alone against Paddle/Dodo: their MoR service includes a different responsibility boundary.

## Eligibility and currencies

- Sole proprietorship is a supported business type. KYC includes proprietor PAN/address evidence, bank details and applicable business proofs. The current onboarding flow controls which proofs are required; eligibility is not approval. [Official business KYC checklist](https://razorpay.com/docs/payments/business-types-kyc-documents), [current onboarding explanation](https://razorpay.com/blog/minimum-documents-payment-gateway-onboarding-india/).
- International payments need separate activation and business verification; the operations team reviews details and purpose code. A live domestic account does not prove international recurring acceptance. [Official purpose-code and enablement documentation](https://github.com/razorpay/markdown-docs/blob/master/payments/international-payments/purpose-codes.md).
- Official subscription FAQ supports international currencies through cards; UPI/eMandate are INR only. International subscription proceeds settle in INR at the payment-creation exchange rate. Thus USD-priced subscriptions are documented, but must be enabled and tested for this merchant. [Subscriptions FAQ](https://razorpay.com/docs/payments/subscriptions/faqs/).

## Pricing: important conflict

The live subscription product page advertises a **limited-time 0.5% subscription add-on**, with 0.9% struck out, on top of the underlying platform fee, plus applicable GST. [Subscription product pricing](https://razorpay.com/subscriptions/).

Razorpay's own explanatory pricing blog instead lists **0.99%** subscription charges, **3% international-card** processing, and **18% GST on fees**. It also warns conversion/bank fees may apply. These public pages conflict, so obtain the account-specific subscription rate and international FX/settlement terms before committing. [Official pricing explanation](https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained).

Illustrations only: if 3% processing + 0.5% subscription and 18% GST on both apply, fee is 4.13%, about $0.2065 equivalent on a $5 payment, before other applicable charges/FX. At 0.99% subscription it is 4.7082%, about $0.2354. These are arithmetic scenarios, not a quote or complete all-in cost. GST on processor fees is distinct from any tax due on Zusal's customer sale. Do not budget around promotional waivers.

## Website functionality

- Monthly subscriptions, future-start trials, hosted checkout/links and notifications are supported. Razorpay's native future-start trial includes payment authentication before billing starts. **Zusal's no-card trial should instead be tracked in our own entitlement database; create the paid subscription only when the user explicitly subscribes.** [Create subscriptions and trials](https://razorpay.com/docs/payments/subscriptions/create).
- Cancellation APIs and subscription webhooks enable Zusal's dashboard controls. Verify signatures and process events idempotently before changing entitlement. [Subscription webhooks](https://razorpay.com/docs/payments/subscriptions/subscribe-to-webhooks).
- Recurring invoices are automatically generated; use invoice records for customer history, while confirming statutory invoice content separately. [Official subscription workflow](https://razorpay.com/docs/payments/subscriptions/workflow/).
- Hosted payment-method update/retry flows exist. A complete Stripe/Paddle-style hosted customer portal was not established by the sources reviewed; budget Zusal dashboard work for cancel/view invoice/update-payment entry points. [Official payment retries documentation](https://razorpay.com/docs/payments/subscriptions/payment-retries/).

## Tax and future Dubai migration

Razorpay payment aggregation does not make it Zusal's merchant of record. Its terms describe Zusal as merchant and restrict transfer/assignment of the agreement. Do not assume moving to a Dubai entity can be handled by editing bank details or that existing recurring mandates will transfer. Obtain written re-onboarding and mandate migration instructions before any entity move. [Razorpay payment terms](https://razorpay.com/terms/).

For comparison Paddle explicitly operates as MoR and publishes 5% + $0.50, with custom/low-value pricing caveats relevant to $5 products. [Paddle pricing](https://www.paddle.com/pricing), [Paddle under-$10 caveat](https://www.paddle.com/paddle-101). Parent research covers Dodo's complete fees and seller-country eligibility. MoR customer-tax handling does not remove Zusal's Indian accounting, income-tax, export or future entity-transfer obligations.

## Recommendation

Choose Razorpay only if its merchant-specific international recurring approval and full fee quote are satisfactory **and** there is an explicit plan/budget for worldwide customer-tax compliance. Its lower transaction cost alone does not offset unknown global compliance work at this stage. Keep it in the top three as the control/cost option or future India payment rail.
