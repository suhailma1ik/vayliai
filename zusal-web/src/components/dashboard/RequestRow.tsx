import type { ModelRequest } from "../../lib/contracts";
import { ChevronDown } from "lucide-react";
import { number, money } from "../../lib/usage";
export default function RequestRow({
  request: r,
  expanded,
  onToggle,
}: {
  request: ModelRequest;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr>
        <td>
          <button
            className="request-model"
            onClick={onToggle}
            aria-expanded={expanded}
          >
            {r.model}
            <ChevronDown size={12} />
          </button>
          <span className="request-id">{r.id.slice(0, 18)}</span>
        </td>
        <td>
          {new Date(r.occurred_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <span className="request-id">
            {new Date(r.occurred_at).toLocaleDateString()}
          </span>
        </td>
        <td>
          {r.input_tokens === null || r.output_tokens === null
            ? "Unavailable"
            : number(r.input_tokens + r.output_tokens)}
        </td>
        <td>
          {r.estimated_cost_usd === null ? "—" : money(r.estimated_cost_usd)}
        </td>
        <td>
          <span className={`status-tag ${r.status}`}>
            <span />
            {r.status === "successful"
              ? "Completed"
              : r.status === "canceled"
                ? "Canceled"
                : "Failed"}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="request-detail">
          <td colSpan={5}>
            <dl>
              <div>
                <dt>Routing reason</dt>
                <dd>{r.routing_reason ?? "Unavailable"}</dd>
              </div>
              <div>
                <dt>Routing time</dt>
                <dd>
                  {r.routing_ms === null ? "Unavailable" : `${r.routing_ms} ms`}
                </dd>
              </div>
              <div>
                <dt>Model response</dt>
                <dd>
                  {r.response_ms === null
                    ? "Unavailable"
                    : `${r.response_ms} ms`}
                </dd>
              </div>
              <div>
                <dt>Provider</dt>
                <dd>{r.provider}</dd>
              </div>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
