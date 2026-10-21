import { useState } from "react";

const examples = [
  {
    label: "Routine edit",
    prompt: "Update the README installation instructions.",
    task: "Documentation",
    difficulty: "Bounded",
    route: 0,
    tier: "Efficient",
    note: "A focused change, with a clear finish line.",
  },
  {
    label: "Implementation",
    prompt: "Add pagination to the request history table.",
    task: "Implementation",
    difficulty: "Moderate",
    route: 1,
    tier: "Balanced",
    note: "Enough capability for a multi-step implementation.",
  },
  {
    label: "Debugging",
    prompt: "Find the race condition in our subscription webhook.",
    task: "Debugging",
    difficulty: "Complex",
    route: 2,
    tier: "Frontier",
    note: "More headroom for a demanding investigation.",
  },
];

export default function RoutingDemo() {
  const [selected, setSelected] = useState(0);
  const current = examples[selected];
  return (
    <div className="routing-demo">
      <div className="demo-toolbar">
        <span>
          <i className="live-dot" /> ROUTE EXPLORER
        </span>
        <span>ILLUSTRATIVE EXAMPLE</span>
      </div>
      <div
        className="demo-tabs"
        role="group"
        aria-label="Choose an illustrative request"
      >
        {examples.map((example, index) => (
          <button
            key={example.label}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {example.label}
          </button>
        ))}
      </div>
      <div className="request-input">
        <span className="demo-label">01 / REQUEST FROM YOUR AGENT</span>
        <p key={current.prompt}>{current.prompt}</p>
        <span className="request-caret">↵</span>
      </div>
      <div
        className="route-canvas"
        aria-label={`Illustrative route to ${current.tier} tier`}
      >
        <span className="incoming-path" />
        <div className="router-node">
          <svg viewBox="0 0 48 40" aria-hidden="true">
            <path
              fill="currentColor"
              d="M2 3h14c4 0 7 2 10 5l10 10c-3 3-7 3-10 0L16 10H2V3Zm0 30 11-11c3-3 7-3 10 0l10 10h13v7H32c-4 0-7-2-10-5l-6-6-7 7H2v-2Z"
            />
            <path fill="#5de1bd" d="m29 10 7-7h11v6l-9 9c-3 1-6-2-9-8Z" />
          </svg>
          <span>ZUSAL</span>
        </div>
        <svg
          className="route-lines"
          viewBox="0 0 220 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[
            "M0 110 C100 110 70 30 220 30",
            "M0 110 H220",
            "M0 110 C100 110 70 190 220 190",
          ].map((d, index) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={selected === index ? "#5de1bd" : "#465349"}
              strokeWidth={selected === index ? 2 : 1}
            />
          ))}
        </svg>
        <div className="route-options">
          {["Efficient", "Balanced", "Frontier"].map((tier, index) => (
            <div
              key={tier}
              className={`route-option ${selected === index ? "selected" : ""}`}
            >
              <span className="route-point" />
              <span>{tier}</span>
              <span className="route-check">
                {selected === index ? "↗" : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="assessment-row">
        <div>
          <span className="demo-label">TASK</span>
          <span>{current.task}</span>
        </div>
        <div>
          <span className="demo-label">SCOPE</span>
          <span>{current.difficulty}</span>
        </div>
        <div>
          <span className="demo-label">ROUTE</span>
          <span className="selected-route">{current.tier} ↗</span>
        </div>
      </div>
      <div className="demo-footnote" aria-live="polite">
        {current.note} <span>Example tiers, not live model rankings.</span>
      </div>
    </div>
  );
}
