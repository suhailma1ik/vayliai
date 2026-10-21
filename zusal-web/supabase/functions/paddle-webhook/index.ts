import { serve, admin, json, env, Failure, check } from "../_shared/http.ts";
import { paddle } from "../_shared/paddle.ts";
import { verifyPaddle } from "../../../src/lib/webhook.ts";
serve(async (req) => {
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > 262144)
    throw new Failure(413, "Webhook too large.");
  if (
    !(await verifyPaddle(
      raw,
      req.headers.get("Paddle-Signature") ?? "",
      env("PADDLE_WEBHOOK_SECRET"),
    ))
  )
    throw new Failure(401, "Invalid webhook signature.");
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    throw new Failure(400, "Invalid webhook.");
  }
  if (
    typeof event.event_id !== "string" ||
    !Number.isFinite(Date.parse(event.occurred_at))
  )
    throw new Failure(400, "Invalid webhook envelope.");
  const isTransaction = event.event_type === "transaction.completed",
    isSubscription = String(event.event_type).startsWith("subscription.");
  if (!isTransaction && !isSubscription) return json({ ignored: true });
  const subscriptionId = isTransaction
    ? event.data.subscription_id
    : event.data.id;
  if (!/^sub_[a-z0-9]+$/.test(subscriptionId ?? ""))
    return json({ ignored: true });
  const subscription = await paddle("/subscriptions/" + subscriptionId);
  const db = admin();
  // Account association comes from the server-created Paddle customer, never browser custom_data.
  const result = await db
    .from("profiles")
    .select("id,paddle_subscription_id,subscription_status")
    .eq("paddle_customer_id", subscription.customer_id)
    .maybeSingle();
  check(result);
  if (!result.data) return json({ ignored: true });
  const account = result.data;
  if (
    account.paddle_subscription_id &&
    account.paddle_subscription_id !== subscriptionId
  )
    throw new Failure(409, "Conflicting subscription requires reconciliation.");
  if (!account.paddle_subscription_id) {
    const transactionId = isTransaction
      ? event.data.id
      : event.data.transaction_id;
    const intent = await db
      .from("checkout_intents")
      .select("price_id")
      .eq("transaction_id", transactionId ?? "")
      .eq("account_id", account.id)
      .maybeSingle();
    check(intent);
    if (!intent.data)
      throw new Failure(409, "Checkout association is not available yet.");
  }
  const prices = [
    env("PADDLE_PRICE_MONTHLY"),
    env("PADDLE_PRICE_YEARLY"),
  ].filter(Boolean);
  if (
    subscription.items?.length !== 1 ||
    !prices.includes(subscription.items[0]?.price?.id) ||
    subscription.items[0]?.quantity !== 1
  )
    throw new Failure(409, "Subscription price is not recognized.");
  // A first subscription.created notification alone does not prove completed payment.
  if (!account.paddle_subscription_id && !isTransaction)
    return json({ awaiting_completed_transaction: true });
  check(
    await db.rpc("apply_billing", {
      p_account: account.id,
      p_event: event.event_id,
      p_at: event.occurred_at,
      p_subscription: subscriptionId,
      p_status: subscription.status,
      p_end: subscription.current_billing_period?.ends_at ?? null,
      p_cancel: subscription.scheduled_change?.action === "cancel",
    }),
  );
  return json({ received: true });
});
