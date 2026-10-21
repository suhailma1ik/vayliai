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
serve(async (req) => {
  const who = await user(req);
  await rate("pair-approve:" + who.id, 10, 600);
  const input = await body(req);
  if (
    typeof input.user_code !== "string" ||
    !/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(input.user_code)
  )
    throw new Failure(400, "Enter a valid device code.");
  const db = admin();
  const { data, error } = await db
    .from("pairings")
    .select("name,expires_at")
    .eq("user_code", input.user_code)
    .is("approved_by", null)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (error || !data)
    throw new Failure(
      400,
      "Code unavailable or expired. Restart login in your CLI.",
    );
  if (input.action === "inspect")
    return json({ name: data.name, expires_at: data.expires_at });
  const result = await db
    .from("pairings")
    .update({ approved_by: who.id })
    .eq("user_code", input.user_code)
    .is("approved_by", null)
    .gt("expires_at", new Date().toISOString())
    .select("user_code");
  check(result);
  if (!result.data?.length)
    throw new Failure(409, "This code has already been used.");
  return json({ message: "Device approved. Return to your CLI." });
});
