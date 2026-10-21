import {
  serve,
  body,
  admin,
  json,
  randomToken,
  hash,
  rate,
  check,
  env,
  Failure,
} from "../_shared/http.ts";
serve(async (req) => {
  const input = await body(req);
  const name = input.name;
  if (
    typeof name !== "string" ||
    name.trim().length < 1 ||
    name.length > 80 ||
    /[\x00-\x1f]/.test(name)
  )
    throw new Failure(400, "Choose a device name of 1–80 characters.");
  // Use the trusted gateway's IP header; do not accept an address supplied in JSON.
  const address = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!address) throw new Failure(503, "Trusted gateway address unavailable.");
  await rate("pair-start:" + (await hash(address)), 5, 600);
  await rate("pair-start-global", 100, 600);
  const secret = randomToken(),
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  const userCode = code.slice(0, 4) + "-" + code.slice(4);
  const expires = new Date(Date.now() + 600000).toISOString();
  check(
    await admin()
      .from("pairings")
      .insert({
        device_hash: await hash(secret),
        user_code: userCode,
        name: name.trim(),
        expires_at: expires,
      }),
  );
  return json({
    device_code: secret,
    user_code: userCode,
    verification_uri: env("APP_ORIGIN") + "/app/approve",
    verification_uri_complete:
      env("APP_ORIGIN") + "/app/approve?user_code=" + userCode,
    expires_in: 600,
    interval: 5,
  });
});
