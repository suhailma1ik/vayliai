import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateUsage,
  entitlement,
  validWebhookTimestamp,
} from "../src/lib/service.ts";
const event = {
  id: "req-1",
  occurred_at: "2026-10-18T10:00:00Z",
  model: "model-1",
  provider: "example",
  status: "successful",
  input_tokens: 10,
  output_tokens: 20,
  estimated_cost_usd: 0.01,
  routing_reason: "complex_debugging",
  routing_ms: 20,
  response_ms: 200,
};
test("ingestion accepts metadata but rejects prompt payloads", () => {
  assert.equal(validateUsage(event).id, "req-1");
  assert.throws(() => validateUsage({ ...event, prompt: "private code" }));
  assert.throws(() => validateUsage({ ...event, estimated_cost_usd: -1 }));
  assert.throws(() => validateUsage({ ...event, input_tokens: 1.5 }));
});
test("invalid dates and arbitrary routing prose are rejected", () => {
  assert.throws(() => validateUsage({ ...event, occurred_at: "yesterday" }));
  assert.throws(() =>
    validateUsage({
      ...event,
      routing_reason: "private source code goes here",
    }),
  );
});
test("missing usage stays nullable", () => {
  const r = validateUsage({
    ...event,
    input_tokens: null,
    estimated_cost_usd: null,
  });
  assert.equal(r.input_tokens, null);
  assert.equal(r.estimated_cost_usd, null);
});
test("expired trials do not get paid-renewal grace", () => {
  assert.equal(
    entitlement(
      { trial_ends_at: "2026-10-17T00:00:00Z" },
      new Date("2026-10-18T00:00:00Z"),
    ),
    "expired",
  );
});
test("paid grace never extends on retry and cancellation respects period end", () => {
  const now = new Date("2026-10-18T12:00:00Z");
  assert.equal(
    entitlement(
      {
        subscription_status: "past_due",
        renewal_failed_at: "2026-10-17T00:00:00Z",
      },
      now,
    ),
    "grace",
  );
  assert.equal(
    entitlement(
      {
        subscription_status: "past_due",
        renewal_failed_at: "2026-10-14T00:00:00Z",
      },
      now,
    ),
    "expired",
  );
  assert.equal(
    entitlement(
      {
        subscription_status: "active",
        current_period_end: "2026-10-19T00:00:00Z",
        cancel_at_period_end: true,
      },
      now,
    ),
    "paid",
  );
});
test("webhook timestamps reject stale and future messages", () => {
  assert.equal(validWebhookTimestamp(1000, 1000), true);
  assert.equal(validWebhookTimestamp(1, 1000), false);
  assert.equal(validWebhookTimestamp(2000, 1000), false);
});

test("deletion requires recent password/OAuth authentication, not a refreshed token", async () => {
  const { recentlyAuthenticated } = await import("../src/lib/service.ts");
  const now = 1900000000;
  assert.equal(
    recentlyAuthenticated(
      { amr: [{ method: "password", timestamp: now - 60 }] },
      now,
    ),
    true,
  );
  assert.equal(
    recentlyAuthenticated(
      {
        amr: [
          { method: "oauth", timestamp: now - 601 },
          { method: "token_refresh", timestamp: now },
        ],
      },
      now,
    ),
    false,
  );
  assert.equal(recentlyAuthenticated({ amr: [] }, now), false);
  assert.equal(
    recentlyAuthenticated(
      { amr: [{ method: "password", timestamp: now + 120 }] },
      now,
    ),
    false,
  );
});
