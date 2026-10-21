import { env, Failure } from "./http.ts";
export async function paddle(path: string, method = "GET", body?: unknown) {
  if (!env("PADDLE_API_KEY"))
    throw new Failure(503, "Billing is not configured.");
  const host =
    env("PADDLE_ENV") === "live"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";
  const response = await fetch(host + path, {
    method,
    headers: {
      Authorization: "Bearer " + env("PADDLE_API_KEY"),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Failure(503, "Billing provider is temporarily unavailable.");
  return (await response.json()).data;
}
export function salesReady() {
  if (env("PADDLE_ENV") === "live" && env("LIVE_BILLING_READY") !== "true")
    throw new Failure(503, "Paid launch setup is still in progress.");
}
