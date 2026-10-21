const allowed = new Set([
  "id",
  "occurred_at",
  "model",
  "provider",
  "status",
  "input_tokens",
  "output_tokens",
  "estimated_cost_usd",
  "routing_reason",
  "routing_ms",
  "response_ms",
]);
export function validateUsage(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Expected a metadata object");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).some((key) => !allowed.has(key)))
    throw new Error("Unsupported metadata field");
  for (const key of ["id", "model", "provider"])
    if (
      typeof value[key] !== "string" ||
      !value[key] ||
      String(value[key]).length > 160 ||
      /[\r\n\x00]/.test(String(value[key]))
    )
      throw new Error(`Invalid ${key}`);
  for (const key of ["model", "provider"])
    if (!/^[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,159}$/.test(String(value[key])))
      throw new Error("Model and provider must be identifiers.");
  if (
    typeof value.occurred_at !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T/.test(value.occurred_at) ||
    !Number.isFinite(Date.parse(value.occurred_at))
  )
    throw new Error("Invalid timestamp");
  if (!["successful", "failed", "canceled"].includes(String(value.status)))
    throw new Error("Invalid status");
  for (const key of [
    "input_tokens",
    "output_tokens",
    "routing_ms",
    "response_ms",
  ])
    if (
      value[key] !== null &&
      value[key] !== undefined &&
      (!Number.isSafeInteger(value[key]) ||
        Number(value[key]) < 0 ||
        Number(value[key]) > 1e9)
    )
      throw new Error(`Invalid ${key}`);
  if (
    value.estimated_cost_usd != null &&
    (typeof value.estimated_cost_usd !== "number" ||
      !Number.isFinite(value.estimated_cost_usd) ||
      value.estimated_cost_usd < 0 ||
      value.estimated_cost_usd > 100000)
  )
    throw new Error("Invalid cost");
  if (
    value.routing_reason != null &&
    (typeof value.routing_reason !== "string" ||
      !/^[a-zA-Z0-9_.:-]{1,100}$/.test(value.routing_reason))
  )
    throw new Error("Reason must be a code, not conversation text");
  return {
    ...value,
    input_tokens: value.input_tokens ?? null,
    output_tokens: value.output_tokens ?? null,
    estimated_cost_usd: value.estimated_cost_usd ?? null,
    routing_reason: value.routing_reason ?? null,
    routing_ms: value.routing_ms ?? null,
    response_ms: value.response_ms ?? null,
  } as {
    id: string;
    occurred_at: string;
    model: string;
    provider: string;
    status: string;
    input_tokens: number | null;
    output_tokens: number | null;
    estimated_cost_usd: number | null;
    routing_reason: string | null;
    routing_ms: number | null;
    response_ms: number | null;
  };
}
type Access = {
  subscription_status?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  renewal_failed_at?: string | null;
  trial_ends_at?: string | null;
  trial_started_at?: string | null;
};
export function entitlement(a: Access, now = new Date()) {
  if (
    a.subscription_status === "active" &&
    a.current_period_end &&
    Date.parse(a.current_period_end) > +now
  )
    return "paid";
  if (
    a.subscription_status === "past_due" &&
    a.renewal_failed_at &&
    Date.parse(a.renewal_failed_at) + 3 * 86400000 > +now
  )
    return "grace";
  if (a.trial_ends_at && Date.parse(a.trial_ends_at) > +now) return "trial";
  return a.trial_started_at || a.trial_ends_at || a.subscription_status
    ? "expired"
    : "not_activated";
}
export function validWebhookTimestamp(timestamp: number, nowSeconds: number) {
  return (
    Number.isSafeInteger(timestamp) && Math.abs(timestamp - nowSeconds) <= 300
  );
}

// Use only after Auth.getUser has verified the exact bearer JWT.
export function recentlyAuthenticated(
  claims: unknown,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  if (!claims || typeof claims !== "object") return false;
  const amr = (claims as { amr?: unknown }).amr;
  if (!Array.isArray(amr)) return false;
  return amr.some(
    (item) =>
      item &&
      ["password", "oauth", "totp"].includes(item.method) &&
      Number.isSafeInteger(item.timestamp) &&
      item.timestamp <= nowSeconds + 60 &&
      nowSeconds - item.timestamp <= 600,
  );
}
