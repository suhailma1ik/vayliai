import { test } from "node:test";
import assert from "node:assert/strict";
import { seal, unseal } from "../src/server/cookies.ts";
test("session cookies are authenticated, purpose-bound and opaque", async () => {
  const key = "ab".repeat(32),
    purpose = "__Host-zusal-session";
  const encrypted = await seal("refresh-secret", key, purpose);
  assert.ok(!encrypted.includes("refresh-secret"));
  assert.equal(await unseal(encrypted, key, purpose), "refresh-secret");
  assert.equal(await unseal(encrypted + "junk", key, purpose), null);
  assert.equal(await unseal(encrypted, "cd".repeat(32), purpose), null);
  assert.equal(await unseal(encrypted, key, "__Host-zusal-pkce"), null);
  await assert.rejects(seal("test", "short", purpose));
});
