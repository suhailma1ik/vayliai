import { serve, admin, json, Failure } from "../_shared/http.ts";
import { device } from "../_shared/device.ts";
import { entitlement } from "../../../src/lib/service.ts";
serve(async (req) => {
  const d = await device(req);
  const { data, error } = await admin()
    .from("profiles")
    .select(
      "subscription_status,current_period_end,renewal_failed_at,trial_started_at,trial_ends_at",
    )
    .eq("id", d.account_id)
    .single();
  if (error || !data) throw new Failure(503, "Access status is unavailable.");
  const state = entitlement(data);
  return json({
    state,
    can_route: ["paid", "grace", "trial", "not_activated"].includes(state),
    trial_ends_at: data.trial_ends_at,
    current_period_end: data.current_period_end,
    bootstrap: state === "not_activated",
  });
});
