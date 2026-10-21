import type { ModelRequest } from "./contracts.ts";
export function summarize(rows: ModelRequest[]) {
  return {
    requests: rows.length,
    models: new Set(rows.map((r) => r.model)).size,
    knownTokens: rows.reduce(
      (n, r) => n + (r.input_tokens ?? 0) + (r.output_tokens ?? 0),
      0,
    ),
    partialTokens: rows.some(
      (r) => r.input_tokens === null || r.output_tokens === null,
    ),
    cost: rows.reduce((n, r) => n + (r.estimated_cost_usd ?? 0), 0),
    partialCost: rows.some((r) => r.estimated_cost_usd === null),
  };
}
export function filterRequests(
  rows: ModelRequest[],
  filter: { start?: string; end?: string; model?: string; status?: string },
) {
  return rows.filter(
    (r) =>
      (!filter.start ||
        Date.parse(r.occurred_at) >= Date.parse(filter.start)) &&
      (!filter.end || Date.parse(r.occurred_at) < Date.parse(filter.end)) &&
      (!filter.model || r.model === filter.model) &&
      (!filter.status || r.status === filter.status),
  );
}
export function dateWindow(
  range: string,
  now = new Date(),
  customStart = "",
  customEnd = "",
) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "custom") {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(customStart) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(customEnd)
    )
      throw new Error("Choose both dates.");
    const a = new Date(`${customStart}T00:00:00`),
      b = new Date(`${customEnd}T00:00:00`);
    b.setDate(b.getDate() + 1);
    if (!Number.isFinite(+a) || !Number.isFinite(+b) || a >= b)
      throw new Error("Start date must be before the end date.");
    return { start: a.toISOString(), end: b.toISOString() };
  }
  start.setDate(
    start.getDate() - (range === "30d" ? 29 : range === "today" ? 0 : 6),
  );
  return { start: start.toISOString(), end: end.toISOString() };
}
export function toCsv(rows: ModelRequest[]) {
  const keys: (keyof ModelRequest)[] = [
    "id",
    "occurred_at",
    "provider",
    "model",
    "status",
    "input_tokens",
    "output_tokens",
    "estimated_cost_usd",
    "routing_reason",
    "routing_ms",
    "response_ms",
  ];
  const cell = (value: unknown) => {
    let s = value == null ? "" : String(value);
    if (/^[\s]*[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replaceAll('"', '""')}"`;
  };
  return (
    "\uFEFF" +
    [
      keys.join(","),
      ...rows.map((row) => keys.map((k) => cell(row[k])).join(",")),
    ].join("\r\n")
  );
}
export const number = (value: number) =>
  new Intl.NumberFormat(undefined, {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
export const money = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value);
