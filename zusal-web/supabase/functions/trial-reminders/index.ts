import {
  serve,
  admin,
  json,
  env,
  rate,
  check,
  Failure,
} from "../_shared/http.ts";
serve(async (req) => {
  if (
    !env("CRON_SECRET") ||
    req.headers.get("Authorization") !== "Bearer " + env("CRON_SECRET")
  )
    throw new Failure(401, "Scheduler authentication required.");
  if (!env("RESEND_API_KEY") || !env("MAIL_FROM"))
    throw new Failure(503, "Email service not configured.");
  const db = admin();
  let sent = 0;
  for (let i = 0; i < 5; i++) {
    const claim = await db.rpc("claim_trial_email");
    check(claim);
    const item = claim.data?.[0];
    if (!item) break;
    await rate(
      "trial-email-budget:" + new Date().toISOString().slice(0, 10),
      20,
      86400,
    );
    const account = await db
      .from("profiles")
      .select("trial_ends_at,subscription_status")
      .eq("id", item.account_id)
      .maybeSingle();
    check(account);
    if (
      !account.data ||
      account.data.trial_ends_at !== item.trial_end ||
      ["active", "past_due", "trialing"].includes(
        account.data.subscription_status,
      )
    )
      continue;
    const who = await db.auth.admin.getUserById(item.account_id);
    if (who.error || !who.data.user?.email) continue;
    const ended = item.kind === "expired";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env("RESEND_API_KEY"),
        "Content-Type": "application/json",
        "Idempotency-Key": `trial-${item.account_id}-${item.kind}-${item.trial_end}`,
      },
      body: JSON.stringify({
        from: env("MAIL_FROM"),
        to: [who.data.user.email],
        subject: ended
          ? "Your Zusal trial has ended"
          : "Your Zusal trial ends soon",
        text:
          (ended
            ? "Your Zusal trial has ended. Routing requires a Pro subscription."
            : "Your Zusal trial ends on " +
              new Date(item.trial_end).toUTCString() +
              ".") +
          " Your dashboard and retained history remain available. No payment is taken automatically. Manage your plan: " +
          env("APP_ORIGIN") +
          "/app/billing",
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Failure(503, "Reminder delivery deferred.");
    check(
      await db
        .from("trial_emails")
        .update({ sent_at: new Date().toISOString(), leased_until: null })
        .eq("account_id", item.account_id)
        .eq("kind", item.kind)
        .eq("trial_end", item.trial_end),
    );
    sent++;
  }
  return json({ sent });
});
