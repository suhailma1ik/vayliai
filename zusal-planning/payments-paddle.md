# Paddle candidate for Zusal

Researched 17 October 2026. Confirmed context: Indian sole proprietor at launch, potential Dubai business move later; worldwide English-first audience; tentative $5/month routing subscription; ₹10,000 monthly operating budget. Planning only, no accounts or applications created.

## Assessment

Strong candidate for reducing worldwide billing and transaction-tax administration without fixed monthly payment-platform cost. Main disadvantages are the fixed fee at $5, payout cash-flow delay, cardless-trial early-access limitations, and an unconfirmed cross-entity migration path. Merchant acceptance, exact Indian payout route, any bespoke price, and future UAE transfer are not approved or guaranteed.

## Verified features and constraints

| Topic | Evidence and practical implication |
|---|---|
| India sole proprietor | Paddle explicitly exempts individuals/sole traders from the business-identification phase. Its unsupported seller-country list includes neither India nor UAE. Domain and identity checks still apply; eligible geography is not merchant approval. [Business identification](https://www.paddle.com/help/start/account-verification/what-is-business-verification), [seller countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle), [verification](https://www.paddle.com/help/start/account-verification) |
| Transaction pricing | Advertised Checkout rate: 5% + $0.50, no monthly fee. Arithmetic illustration for a $5 sale: $0.75, 15%, leaving $4.25 before other relevant deductions/tax treatment. Under-$10 products can contact Paddle for bespoke pricing; this is not a published discount or guaranteed quote. [Pricing](https://www.paddle.com/pricing) |
| Other fees | MSA lists FX conversion margins when buyer currency differs from payment currency; bank-transfer and optional payout-currency conversion charges may apply. Refund/chargeback costs also exist. Do not equate the advertised Checkout fee with every possible cost. [MSA, §§7 and 10](https://www.paddle.com/legal/terms) |
| Payout | Help center lists wire transfer or Payoneer, a minimum threshold of $100, and monthly payouts. Country/bank fees can apply. Indian bank acceptance, chosen currency, foreign-exchange cost, and remittance documentation need confirmation for the actual seller/bank. [Payout process](https://www.paddle.com/help/manage/get-paid/when-and-how-do-i-get-paid), [payout fees](https://www.paddle.com/help/manage/get-paid/is-there-a-fee-taken-for-payouts) |
| No-card trials | Public early access supports API-created cardless trials (`requires_payment_method: false`). No special access request required. Cardless-trial support in portal/dashboard and trial emails is still incomplete. Payment collection requires our own API/Paddle.js flow; no payment method at expiry causes cancellation. Suitable for 14/30-day plans, but Zusal must own activation eligibility and conversion messaging. [Cardless-trial guide](https://developer.paddle.com/build/trials/cardless-trials/) |
| Billing portal | Hosted customer portal covers standard subscription cancellation, payment-method updates, invoices, and other management. The cardless-trial payment-collection limitation above is an exception. [Portal/provisioning guide](https://developer.paddle.com/build/subscriptions/provision-access-webhooks/) |
| Webhooks | Subscription/transaction webhooks support local entitlement state. We need verified delivery handling and synchronization; paid routing access remains our decision. [Provisioning guide](https://developer.paddle.com/build/subscriptions/provision-access-webhooks/) |

At only a few customers, funds may not reach the $100 payout threshold for some time. Plan infrastructure runway separately from gross sales; free activation cohorts also generate no subscription receipts during their offer.

## Trial architecture recommendation (our proposal)

Maintain 30-day/14-day no-card access in Zusal's own entitlement system, starting at first valid CLI activation. Ask for explicit paid checkout only when users choose to subscribe. This avoids depending on early-access trial UI and collecting billing addresses during free activation. Use Paddle for paid subscription lifecycle and portal. Alternatively its cardless API can represent trials; that introduces more integration and requires a user-facing payment collection workflow. Do not silently convert users to charging without an explicit billing action.

## Future India → Dubai entity move

Paddle's MSA §9.5 requires advance written notice for material supplier-information changes (at least 30 calendar days); §18.3 requires prior written consent to assign or transfer contractual rights/obligations. Thus moving the legal seller to a UAE company is not simply editing the displayed address. [MSA](https://www.paddle.com/legal/terms).

Paddle advertises subscription migration and no contractual lock-in, but the public pages reviewed do not promise preservation of subscription IDs, saved payment mandates, or frictionless transfer between an Indian sole proprietor and a new UAE legal entity. An external provider-migration claim is not proof of cross-entity portability. [Pricing FAQ](https://www.paddle.com/pricing), [migration service](https://www.paddle.com/billing/migration-service).

Before any move, obtain Paddle's written answer on: re-verification/new account requirements; treatment of existing paid subscriptions and saved payment methods; customer consent/notices; invoices/refunds/disputes before and after transfer; payout cutoff/reserve; webhook IDs and API credentials; and whether users must resubscribe. Store Zusal user/entitlement IDs independently from Paddle IDs so implementation can accommodate an approved path. No migration guarantee has been received.

## Decision rule

Shortlist Paddle for the top-three comparison. Prefer it if seller/product approval, actual payout path and overall economics are acceptable. At $5, ask for low-ticket pricing before assuming advertised fees are optimal. Do not wait for a future Dubai entity solely to begin product validation.
