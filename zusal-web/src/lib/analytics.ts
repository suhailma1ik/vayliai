const pages = new Set(["/", "/download", "/pricing", "/docs", "/sign-up"]);
export function countEvent(event: "visit" | "install_click" | "signup_submit") {
  if (
    import.meta.env.PUBLIC_ANALYTICS_ENABLED !== "true" ||
    !import.meta.env.PUBLIC_SUPABASE_URL ||
    navigator.doNotTrack === "1"
  )
    return;
  const page = location.pathname.replace(/\/$/, "") || "/";
  if (!pages.has(page)) return;
  // No auth client, credentials, user ID, query string, prompt or persistent visitor ID.
  void fetch(import.meta.env.PUBLIC_SUPABASE_URL + "/functions/v1/site-event", {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, page }),
    keepalive: true,
  }).catch(() => {});
}
