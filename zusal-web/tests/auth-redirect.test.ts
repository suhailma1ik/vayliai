import { test } from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../src/lib/auth-redirect.ts";
test("login preserves device approval but refuses external redirects", () => {
  assert.equal(
    safeNext("?next=%2Fapp%2Fapprove%3Fuser_code%3DABCD-EFGH"),
    "/app/approve?user_code=ABCD-EFGH",
  );
  for (const value of [
    "https://evil.test",
    "//evil.test",
    "/app\\evil",
    "/application",
    "/app\n",
  ])
    assert.equal(safeNext("?next=" + encodeURIComponent(value)), "/app");
});
