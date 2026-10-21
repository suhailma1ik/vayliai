import { useState } from "react";
import { Check } from "lucide-react";
import type { Account } from "../../lib/contracts";
import { invoke } from "../../lib/supabase";
import { openCheckout } from "../../lib/paddle";
import { entitlement } from "../../lib/service";
export default function Billing({
  account,
  demo,
}: {
  account: Account | null;
  demo: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const access = entitlement(account ?? {});
  const managing = ["active", "past_due", "paused", "trialing"].includes(
    account?.subscription_status ?? "",
  );
  async function action(interval?: string) {
    if (demo) {
      setMessage("Demo only. No checkout or subscription was created.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const data = await invoke(
        "billing",
        interval ? { action: "checkout", interval } : { action: "portal" },
      );
      if (interval) {
        await openCheckout(data.transaction_id);
      } else {
        const url = new URL(data.url);
        if (
          url.protocol !== "https:" ||
          ![
            "customer-portal.paddle.com",
            "sandbox-customer-portal.paddle.com",
          ].includes(url.hostname)
        )
          throw new Error("Billing portal address is unavailable.");
        location.assign(url.href);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to open billing.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="billing-current">
        <span className="eyebrow">YOUR PLAN</span>
        <h2>
          {access === "paid"
            ? "Zusal Pro"
            : access === "grace"
              ? "Payment needs attention"
              : access === "trial"
                ? "Pro trial"
                : access === "expired"
                  ? "Routing access has ended"
                  : "Ready when you are."}
        </h2>
        <p>
          {account?.cancel_at_period_end
            ? "Renewal canceled. Access continues to your paid period end."
            : account?.current_period_end
              ? `Current period ends ${new Date(account.current_period_end).toLocaleDateString()}.`
              : "Your free period starts after your first successful routed request."}
        </p>
        {account?.trial_ends_at && (
          <p>
            Trial {access === "expired" ? "ended" : "ends"}{" "}
            {new Date(account.trial_ends_at).toLocaleString()}.
          </p>
        )}
        {access === "grace" && (
          <div className="notice">
            A paid renewal failed. Routing continues for three days from the
            original failure. Update your payment method in the billing portal.
          </div>
        )}
        <button className="button" disabled={busy} onClick={() => action()}>
          Manage payments & invoices ↗
        </button>
      </div>
      <div className="billing-options">
        {[
          {
            name: "Monthly",
            amount: "5",
            period: "month",
            interval: "monthly",
            note: "Flexible, month by month.",
          },
          {
            name: "Yearly",
            amount: "50",
            period: "year",
            interval: "yearly",
            note: "Two months free equivalent. $50 upfront.",
          },
        ].map((plan) => (
          <section key={plan.interval}>
            <span className="eyebrow">PRO / {plan.name}</span>
            <h2>
              ${plan.amount}
              <small> / {plan.period}</small>
            </h2>
            <p>{plan.note}</p>
            <ul>
              <li>
                <Check size={14} />
                All Pro features
              </li>
              <li>
                <Check size={14} />
                30-day request history
              </li>
              <li>
                <Check size={14} />
                12-month daily summaries
              </li>
              <li>
                <Check size={14} />
                Discord community support
              </li>
            </ul>
            <button
              className="button primary"
              disabled={
                busy ||
                (!demo && !import.meta.env.PUBLIC_PADDLE_CLIENT_TOKEN) ||
                managing
              }
              onClick={() => action(plan.interval)}
            >
              {busy
                ? "Opening…"
                : managing
                  ? "Manage existing plan above"
                  : `Choose ${plan.name.toLowerCase()} ↗`}
            </button>
          </section>
        ))}
      </div>
      {!import.meta.env.PUBLIC_PADDLE_CLIENT_TOKEN && !demo && (
        <div className="notice">
          Paid checkout is not configured. Merchant approval, price IDs, refund
          terms and usage allowance must be ready before live purchases.
        </div>
      )}
      {message && (
        <p role="status" className="form-message">
          {message}
        </p>
      )}
      <div className="cost-note">
        Provider usage is separate. Cancellation stops renewal and keeps access
        through the current paid period. Failed paid renewals have a three-day
        grace period. Checkout displays applicable taxes.
      </div>
    </>
  );
}
