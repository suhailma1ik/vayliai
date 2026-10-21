import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toCsv,
  summarize,
  filterRequests,
  dateWindow,
} from "../src/lib/usage.ts";
const row = {
  id: "r1",
  occurred_at: "2026-10-18T10:00:00Z",
  model: "model-a",
  provider: "provider",
  status: "successful" as const,
  input_tokens: 20,
  output_tokens: 10,
  estimated_cost_usd: 0.01,
  routing_reason: null,
  routing_ms: 40,
  response_ms: 400,
};
test("partial usage stays partial instead of looking complete", () => {
  const result = summarize([
    row,
    { ...row, id: "r2", input_tokens: null, estimated_cost_usd: null },
  ]);
  assert.equal(result.requests, 2);
  assert.equal(result.knownTokens, 40);
  assert.equal(result.partialTokens, true);
  assert.equal(result.partialCost, true);
  assert.equal(result.cost, 0.01);
});
test("CSV escapes formula cells, commas and double quotes", () => {
  const csv = toCsv([
    { ...row, model: "=SUM(1,2)", routing_reason: 'say "hello"' },
  ]);
  assert.ok(csv.includes('"\'=SUM(1,2)"'));
  assert.ok(csv.includes('"say ""hello"""'));
  assert.ok(!csv.includes("prompt"));
});
test("filters distinguish status, model and exclusive ending bound", () => {
  assert.equal(
    filterRequests([row], {
      start: "2026-10-18T00:00:00Z",
      end: "2026-10-19T00:00:00Z",
      model: "model-a",
      status: "successful",
    }).length,
    1,
  );
  assert.equal(filterRequests([row], { end: row.occurred_at }).length, 0);
  assert.equal(filterRequests([row], { status: "failed" }).length, 0);
});
test("seven-day date window uses calendar days and rejects reversed custom dates", () => {
  const result = dateWindow("7d", new Date(2026, 9, 18, 12));
  assert.equal(new Date(result.start).getDate(), 12);
  assert.throws(() =>
    dateWindow("custom", new Date(), "2026-10-18", "2026-10-01"),
  );
});
