import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyPaddle } from "../src/lib/webhook.ts";
test("webhook authenticates exact raw bytes and rejects forgery and replay", async () => {
  const secret = "test-only-signature-secret",
    stamp = 1900000000,
    raw = '{"event_id":"evt_test"}';
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(stamp + ":" + raw),
  );
  const sig = Array.from(new Uint8Array(signed), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const header = `ts=${stamp};h1=${sig}`;
  assert.equal(await verifyPaddle(raw, header, secret, stamp), true);
  assert.equal(await verifyPaddle(raw + " ", header, secret, stamp), false);
  assert.equal(await verifyPaddle(raw, header, secret, stamp + 301), false);
  assert.equal(await verifyPaddle(raw, header, "wrong", stamp), false);
  assert.equal(
    await verifyPaddle(raw, "ts=bad;h1=" + sig, secret, stamp),
    false,
  );
});
