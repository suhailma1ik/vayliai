import type { ModelRequest } from "../../lib/contracts";
export default function ActivityChart({ rows }: { rows: ModelRequest[] }) {
  const days = Array.from(
    new Set(rows.map((r) => new Date(r.occurred_at).toLocaleDateString())),
  ).reverse();
  const bins = days.map((day) => ({
    day,
    count: rows.filter(
      (r) => new Date(r.occurred_at).toLocaleDateString() === day,
    ).length,
  }));
  const max = Math.max(1, ...bins.map((b) => b.count));
  return (
    <>
      {bins.length ? (
        <>
          <div
            className="activity-chart"
            role="img"
            aria-label={bins
              .map((b) => `${b.day}: ${b.count} requests`)
              .join("; ")}
          >
            <div className="chart-guides">
              <span>{max}</span>
              <span>{Math.round(max / 2)}</span>
              <span>0</span>
            </div>
            <div className="chart-bars">
              {bins.map((b) => (
                <div
                  key={b.day}
                  className="chart-bin"
                  title={`${b.day}: ${b.count} requests`}
                >
                  <div style={{ height: `${(b.count / max) * 100}%` }} />
                  <span>{b.day.replace(/\/\d{4}$/, "")}</span>
                </div>
              ))}
            </div>
          </div>
          <details className="chart-data">
            <summary>View chart data</summary>
            <ul>
              {bins.map((b) => (
                <li key={b.day}>
                  {b.day}: {b.count} requests
                </li>
              ))}
            </ul>
          </details>
        </>
      ) : (
        <div className="empty-chart">
          <span>—</span>
          <p>Your activity will take shape here.</p>
        </div>
      )}
    </>
  );
}
