import { useState } from "react";
export default function PricePlan() {
  const [annual, setAnnual] = useState(false);
  return (
    <div className="price-panel">
      <span className="eyebrow">ONE PLAN. ALL YOUR ROUTES.</span>
      <h2>Zusal Pro</h2>
      <div className="page-tabs" role="group" aria-label="Billing interval">
        <button aria-pressed={!annual} onClick={() => setAnnual(false)}>
          Monthly
        </button>
        <button aria-pressed={annual} onClick={() => setAnnual(true)}>
          Yearly · 2 months free
        </button>
      </div>
      <div className="price-value">
        ${annual ? "50" : "5"}
        <small> / {annual ? "year" : "month"}</small>
      </div>
      <p className="price-sub">
        {annual
          ? "$50 billed upfront. $10 less than 12 monthly payments."
          : "Billed monthly. Cancel the next renewal anytime."}
      </p>
      <a
        href={`/app/billing?interval=${annual ? "yearly" : "monthly"}`}
        className="button primary"
      >
        Choose {annual ? "yearly" : "monthly"} Pro ↗
      </a>
      <ul>
        <li>Automatic model selection in supported harnesses</li>
        <li>Overview, model breakdown, and request history</li>
        <li>30-day request details with CSV export</li>
        <li>12 months of compact daily usage summaries</li>
        <li>Connected-device management</li>
        <li>Discord community and private support tickets</li>
      </ul>
      <p className="price-sub">
        Same features on both billing intervals. Model-provider charges are
        separate. Applicable taxes are shown at checkout.
      </p>
    </div>
  );
}
