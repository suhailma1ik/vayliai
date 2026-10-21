import { recentlyAuthenticated } from "../../../src/lib/service.ts";
import {
  serve,
  body,
  admin,
  json,
  user,
  rate,
  Failure,
  check,
} from "../_shared/http.ts";
import { paddle } from "../_shared/paddle.ts";
serve(async (req) => {
  const who = await user(req);
  await rate("delete:" + who.id, 3, 600);
  const input = await body(req);
  if (input.confirmation !== "DELETE")
    throw new Failure(400, "Type DELETE to confirm.");
  const token = req.headers.get("Authorization")!.replace(/^Bearer /, "");
  let claims;
  try {
    claims = JSON.parse(
      atob(token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/")),
    );
  } catch {
    throw new Failure(401, "Sign in again before deleting your account.");
  }
  if (!recentlyAuthenticated(claims))
    throw new Failure(
      401,
      "Sign out and sign in again before deleting your account.",
    );
  const db = admin();
  const profile = await db
    .from("profiles")
    .select("paddle_subscription_id")
    .eq("id", who.id)
    .single();
  check(profile);
  const id = profile.data?.paddle_subscription_id;
  if (id) {
    const subscription = await paddle(
      "/subscriptions/" + encodeURIComponent(id),
    );
    if (
      subscription.status !== "canceled" &&
      subscription.scheduled_change?.action !== "cancel"
    )
      await paddle(
        "/subscriptions/" + encodeURIComponent(id) + "/cancel",
        "POST",
        { effective_from: "next_billing_period" },
      );
  }
  // Cascade removes devices, pairing, usage, receipts, and checkout associations.
  check(await db.auth.admin.deleteUser(who.id));
  return json({ deleted: true });
});
