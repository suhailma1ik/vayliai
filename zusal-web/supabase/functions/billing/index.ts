import {
  serve,
  body,
  admin,
  json,
  user,
  rate,
  check,
  env,
  Failure,
} from "../_shared/http.ts";
import { paddle, salesReady } from "../_shared/paddle.ts";
serve(async (req) => {
  const who = await user(req);
  const input = await body(req);
  await rate("billing:" + who.id, 10, 60);
  const db = admin();
  const result = await db
    .from("profiles")
    .select("paddle_customer_id,paddle_subscription_id,subscription_status")
    .eq("id", who.id)
    .single();
  check(result);
  const profile = result.data;
  if (!profile) throw new Failure(404, "Account unavailable.");
  if (input.action === "portal") {
    if (!profile.paddle_customer_id)
      throw new Failure(400, "No paid billing account yet.");
    const portal = await paddle(
      "/customers/" +
        encodeURIComponent(profile.paddle_customer_id) +
        "/portal-sessions",
      "POST",
      {},
    );
    return json({ url: portal.urls.general.overview });
  }
  if (
    input.action !== "checkout" ||
    !["monthly", "yearly"].includes(String(input.interval))
  )
    throw new Failure(400, "Choose monthly or yearly billing.");
  salesReady();
  if (
    profile.paddle_subscription_id &&
    ["active", "past_due", "paused", "trialing"].includes(
      profile.subscription_status,
    )
  )
    throw new Failure(
      409,
      "Manage your existing subscription in the billing portal.",
    );
  await rate("checkout-lock:" + who.id, 1, 30);
  const price = env(
    input.interval === "yearly"
      ? "PADDLE_PRICE_YEARLY"
      : "PADDLE_PRICE_MONTHLY",
  );
  if (!/^pri_[a-z0-9]+$/.test(price))
    throw new Failure(503, "Pricing is not configured.");
  const recent = await db
    .from("checkout_intents")
    .select("transaction_id,price_id")
    .eq("account_id", who.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  check(recent);
  if (recent.data) {
    const existing = await paddle(
      "/transactions/" + recent.data.transaction_id,
    );
    if (["draft", "ready"].includes(existing.status)) {
      if (recent.data.price_id !== price)
        throw new Failure(
          409,
          "An existing checkout uses the other billing interval. Contact support to replace it before starting another.",
        );
      return json({ transaction_id: existing.id });
    }
    if (
      ["paid", "completed", "billed"].includes(existing.status) &&
      !profile.paddle_subscription_id
    )
      throw new Failure(
        409,
        "Your payment is processing. Refresh billing shortly; do not pay again.",
      );
  }
  let customerId = profile.paddle_customer_id;
  if (!customerId) {
    const customer = await paddle("/customers", "POST", { email: who.email });
    customerId = customer.id;
    check(
      await db
        .from("profiles")
        .update({ paddle_customer_id: customerId })
        .eq("id", who.id),
    );
  }
  const transaction = await paddle("/transactions", "POST", {
    customer_id: customerId,
    items: [{ price_id: price, quantity: 1 }],
    collection_mode: "automatic",
    custom_data: { account_id: who.id },
  });
  check(
    await db.from("checkout_intents").insert({
      transaction_id: transaction.id,
      account_id: who.id,
      price_id: price,
    }),
  );
  return json({ transaction_id: transaction.id });
});
