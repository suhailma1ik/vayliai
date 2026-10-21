import type { Account, ModelRequest, Device, DailyUsage } from "./contracts";
export const demoAccount: Account = {
  id: "demo",
  display_name: "Alex Morgan",
  trial_started_at: null,
  trial_ends_at: null,
  trial_kind: null,
  subscription_status: "active",
  current_period_end: new Date(Date.now() + 21 * 86400000).toISOString(),
  cancel_at_period_end: false,
  renewal_failed_at: null,
};
const models = [
  "Efficient / example",
  "Balanced / example",
  "Frontier / example",
];
export function demoRequests(): ModelRequest[] {
  return Array.from({ length: 128 }, (_, i) => ({
    id: `example-${String(i + 1).padStart(4, "0")}`,
    occurred_at: new Date(Date.now() - i * 39 * 60000).toISOString(),
    model: models[i % 3],
    provider: "Illustrative provider",
    status: i % 19 === 0 ? "failed" : i % 23 === 0 ? "canceled" : "successful",
    input_tokens: i % 19 === 0 ? null : 420 + i * 13,
    output_tokens: i % 19 === 0 ? null : 120 + i * 3,
    estimated_cost_usd: i % 19 === 0 ? null : ((i % 3) + 1) * 0.0014,
    routing_reason: [
      "Bounded documentation request",
      "Multi-step implementation",
      "Complex investigation",
    ][i % 3],
    routing_ms: 80 + (i % 7) * 21,
    response_ms: i % 19 === 0 ? null : 1100 + (i % 11) * 340,
  }));
}
export const demoDevices: Device[] = [
  {
    id: "demo-device",
    name: "MacBook Pro · Pi",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    last_seen_at: new Date().toISOString(),
    revoked_at: null,
  },
];
export function demoDaily(): DailyUsage[] {
  const rows = demoRequests();
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    const day = date.toISOString().slice(0, 10);
    const batch = rows.filter((r) => r.occurred_at.startsWith(day));
    return {
      day,
      requests: batch.length,
      tokens: batch.reduce(
        (n, r) => n + (r.input_tokens ?? 0) + (r.output_tokens ?? 0),
        0,
      ),
      estimated_cost_usd: batch.length
        ? batch.reduce((n, r) => n + (r.estimated_cost_usd ?? 0), 0)
        : 0,
      model_counts: Object.fromEntries(
        models.map((m) => [m, batch.filter((r) => r.model === m).length]),
      ),
    };
  });
}
