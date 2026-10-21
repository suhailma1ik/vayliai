import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../netlify/functions/auth-storage.ts";
import { unseal } from "../src/server/cookies.ts";
test("session endpoint enforces origin, opaque HttpOnly persistence and separate PKCE purpose", async () => {
  process.env.APP_ORIGIN = "https://zusal.test";
  process.env.PUBLIC_SUPABASE_URL = "https://testproject.supabase.co";
  process.env.PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.AUTH_COOKIE_KEY = "ab".repeat(32);
  const call = (body: unknown, origin = "https://zusal.test") =>
    handler(
      new Request("https://zusal.test/.netlify/functions/auth-storage", {
        method: "POST",
        headers: { origin, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  assert.equal(
    (
      await call(
        { action: "get", key: "sb-testproject-auth-token" },
        "https://attacker.test",
      )
    ).status,
    403,
  );
  assert.equal(
    (await call({ action: "get", key: "other-project" })).status,
    400,
  );
  const session = await call({
    action: "set",
    key: "sb-testproject-auth-token",
    value: JSON.stringify({
      refresh_token: "test-refresh",
      access_token: "access-not-persisted",
      user: { email: "not-persisted@example.test" },
    }),
  });
  assert.equal(session.status, 200);
  const cookie = session.headers.get("Set-Cookie")!;
  assert.match(cookie, /HttpOnly; Secure; SameSite=Lax/);
  assert.ok(!cookie.includes("test-refresh"));
  const sealed = cookie.split(";")[0].split("=")[1];
  assert.equal(
    await unseal(sealed, process.env.AUTH_COOKIE_KEY, "__Host-zusal-session"),
    "test-refresh",
  );
  const verifier = await call({
    action: "set",
    key: "sb-testproject-auth-token-code-verifier",
    value: '"test-pkce"',
  });
  assert.match(verifier.headers.get("Set-Cookie")!, /__Host-zusal-pkce=/);
  assert.match(verifier.headers.get("Set-Cookie")!, /Max-Age=600/);
  const removed = await call({
    action: "remove",
    key: "sb-testproject-auth-token",
  });
  assert.match(removed.headers.get("Set-Cookie")!, /Max-Age=0/);
});
