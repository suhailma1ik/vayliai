# Dodo Payments candidate for Zusal

Researched 17 October 2026. Assumes India sole proprietor now, possible UAE entity later; worldwide developer SaaS at tentative $5/month and ₹10,000 monthly operating budget. No application or approval.

## Fit and onboarding

Dodo is a plausible third candidate alongside Paddle and Razorpay. Its MoR model handles payment processing and customer sales-tax administration; this is operationally attractive for a small global launch, but does not eliminate the founder's own Indian obligations. [Merchant policy](https://docs.dodopayments.com/miscellaneous/merchant-acceptance)

The verification guide explicitly places creators/sole proprietors under Individual. Registered Entity is a different onboarding path. Individual bank-account names must match verified identity. Required approvals and monitoring review precede payouts. Website must expose pricing, terms, privacy, refund/cancellation policy and support contact. Do not choose account type solely by colloquial business name: verify how a registered Indian proprietorship with tax IDs is classified.

Account type can change only while all verification forms remain under review; once a form is approved, failed or held, the choice becomes permanent. No documented automatic India-individual to UAE-company transfer was established. [Verification](https://docs.dodopayments.com/miscellaneous/verification-process)

India and UAE both appear on the eligible merchant-country list; this is location eligibility, not account approval or migration permission. [Countries](https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories)

## Published fees and illustrative $5 economics

Official localized pricing (English details within page): US cards/wallets 4%+$0.40; subscription surcharge +0.5%; cards/APMs outside US +1.5%. Thus a $5 USD US-card subscription illustrates $0.625 (12.5%); non-US card $0.70 (14%). These exclude tax-base effects, FX, payout and exceptional fees; not a binding quote.

India-INR domestic pricing is 4%+$0.15 with international fees additionally listed; confirm stacking. ACH/SEPA direct debit instead costs 1.5%, capped at $15/€15, without international/subscription surcharges. PayPal/BNPL +3%. Adaptive currency charges customers 2–4% FX. Recovery features charge 5% of recovered revenue. Refund $1; dispute $30; prevention fees vary. Payouts below $1,000 cost $5; USD SWIFT $25; non-USD settlement FX applies. No fixed platform cost is stated under Standard. [Pricing](https://dodopayments.com/th/pricing)

## India payouts: important current limitation

October 12 payout documentation says INR native wallets and INR-denominated payouts are discontinued, although INR purchases remain supported. Wallets are USD/GBP/EUR. A bank may convert incoming money to INR at its rate; intermediary charges can apply. Confirm the India payout rail and FIRA/remittance evidence before choosing.

Default payout threshold $100, reducible to $50. Default twice-monthly schedule; eligibility depends on verification, monitoring and balance. Below-$1,000 payouts incur $5. Local-transfer and SWIFT routes differ; available rails depend on country/account. An approved account may be in another country but must belong to the verified individual/entity; this does not establish entity-transfer support. [Payout guide](https://docs.dodopayments.com/features/payouts/payout-structure)

## Subscription integration

Hosted portal supports cancellation, payment-method changes and invoice download; server-created portal sessions last 24 hours. [Portal](https://docs.dodopayments.com/features/customer-portal)

No-card free-trial subscriptions are documented: optional payment method while no amount is due; without a method at billing time, subscription goes on hold. This can support no-card evaluation, but Zusal should retain its own activation timestamp and first-1,000 cohort counter. If we run trial entitlements internally and create checkout only when a user explicitly subscribes, billing cannot begin accidentally. [Card-optional release](https://docs.dodopayments.com/changelog/v1.113.28)

Payment/subscription APIs and webhooks are available. Use verified events and reconciliation for access state, rather than trusting browser redirects. [Integration introduction](https://docs.dodopayments.com/guides/login)

## Comparison conclusion

Dodo merits shortlisting for integrated global billing and explicit sole-proprietor onboarding. It may beat Paddle's headline transaction arithmetic, but low-volume payout fees/FX and account-type rigidity weaken the advantage. Recommend only after written confirmation of Indian settlement costs/documents, applicable subscription fee schedule, and future entity-transfer process. No speed-of-approval or reliability claim has been independently established.
