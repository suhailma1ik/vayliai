import {
  serve,
  body,
  admin,
  json,
  randomToken,
  hash,
  rate,
  check,
  Failure,
} from "../_shared/http.ts";
serve(async (req) => {
  const input = await body(req);
  if (
    typeof input.device_code !== "string" ||
    !/^[a-f0-9]{64}$/.test(input.device_code)
  )
    throw new Failure(400, "Invalid device code.");
  const digest = await hash(input.device_code);
  await rate("pair-poll:" + digest, 15, 60);
  const db = admin();
  const { data, error } = await db
    .from("pairings")
    .select("approved_by,expires_at,consumed_at")
    .eq("device_hash", digest)
    .single();
  if (
    error ||
    !data ||
    Date.parse(data.expires_at) < Date.now() ||
    data.consumed_at
  )
    throw new Failure(400, "Pairing expired or already consumed.");
  if (!data.approved_by) return json({ status: "authorization_pending" });
  const token = "zusal_" + randomToken();
  const result = await db.rpc("consume_pair", {
    p_hash: digest,
    p_token_hash: await hash(token),
  });
  check(result);
  if (!result.data) throw new Failure(409, "Pairing already consumed.");
  return json({
    status: "approved",
    device_id: result.data,
    access_token: token,
    token_type: "Bearer",
    scope: "usage:write entitlement:read",
  });
});
