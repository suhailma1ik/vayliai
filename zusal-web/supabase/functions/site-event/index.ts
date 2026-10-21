import {
  serve,
  body,
  admin,
  json,
  env,
  Failure,
  rate,
  check,
} from "../_shared/http.ts";
serve(async (req) => {
  if (env("ANALYTICS_ENABLED") !== "true") return json({ enabled: false });
  if (req.headers.get("origin") !== env("APP_ORIGIN"))
    throw new Failure(403, "Origin required.");
  const input = await body(req);
  if (
    Object.keys(input).some((k) => !["event", "page"].includes(k)) ||
    !["visit", "install_click", "signup_submit"].includes(
      String(input.event),
    ) ||
    !["/", "/download", "/pricing", "/docs", "/sign-up"].includes(
      String(input.page),
    )
  )
    throw new Failure(400, "Invalid aggregate event.");
  await rate("site-events-global", 300, 60);
  check(
    await admin().rpc("count_site_event", {
      p_event: input.event,
      p_page: input.page,
    }),
  );
  return json({ counted: true });
});
