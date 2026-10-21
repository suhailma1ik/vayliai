export type RequestStatus = "successful" | "failed" | "canceled";
export type ModelRequest = {
  id: string;
  occurred_at: string;
  model: string;
  provider: string;
  status: RequestStatus;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost_usd: number | null;
  routing_reason: string | null;
  routing_ms: number | null;
  response_ms: number | null;
};
export type DailyUsage = {
  day: string;
  requests: number;
  tokens: number;
  estimated_cost_usd: number | null;
  model_counts: Record<string, number>;
  missing_tokens?: number;
  missing_cost?: number;
};
export type Device = {
  id: string;
  name: string;
  created_at: string;
  last_seen_at: string | null;
  revoked_at: string | null;
};
export type Account = {
  id: string;
  display_name: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trial_kind: "launch" | "standard" | null;
  subscription_status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  renewal_failed_at: string | null;
};
