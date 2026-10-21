import { createClient } from "@supabase/supabase-js";
import { seal, unseal } from "../../src/server/cookies.ts";
const reply = (
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
export default async (req: Request) => {
  const origin = process.env.APP_ORIGIN,
    url = process.env.PUBLIC_SUPABASE_URL,
    key = process.env.PUBLIC_SUPABASE_ANON_KEY,
    secret = process.env.AUTH_COOKIE_KEY;
  if (!origin || !url || !key || !secret)
    return reply({ error: "Session service is not configured." }, 503);
  if (req.method !== "POST" || req.headers.get("origin") !== origin)
    return reply({ error: "Request unavailable." }, 403);
  try {
    const text = await req.text();
    if (text.length > 16384) return reply({ error: "Request too large." }, 413);
    const input = JSON.parse(text);
    const base = "sb-" + new URL(url).hostname.split(".")[0] + "-auth-token";
    if (![base, base + "-code-verifier"].includes(input.key))
      return reply({ error: "Invalid session key." }, 400);
    const verifier = input.key.endsWith("-code-verifier"),
      name = verifier ? "__Host-zusal-pkce" : "__Host-zusal-session";
    const header = (value: string, age: number) =>
      `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
    if (input.action === "remove")
      return reply({ value: null }, 200, { "Set-Cookie": header("", 0) });
    if (input.action === "set") {
      if (typeof input.value !== "string")
        return reply({ error: "Invalid session." }, 400);
      let value = input.value;
      if (!verifier) {
        const session = JSON.parse(value);
        if (
          typeof session.refresh_token !== "string" ||
          session.refresh_token.length > 512
        )
          return reply({ error: "Invalid session." }, 400);
        value = session.refresh_token;
      }
      if (value.length > 512) return reply({ error: "Invalid session." }, 400);
      return reply({ value: null }, 200, {
        "Set-Cookie": header(
          await seal(value, secret, name),
          verifier ? 600 : 604800,
        ),
      });
    }
    if (input.action !== "get")
      return reply({ error: "Invalid operation." }, 400);
    const cookie = req.headers
      .get("cookie")
      ?.split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(name + "="))
      ?.slice(name.length + 1);
    if (!cookie) return reply({ value: null });
    const stored = await unseal(cookie, secret, name);
    if (!stored)
      return reply({ value: null }, 200, { "Set-Cookie": header("", 0) });
    if (verifier) return reply({ value: stored });
    const auth = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    const { data, error } = await auth.auth.refreshSession({
      refresh_token: stored,
    });
    if (error && (!error.status || error.status === 429 || error.status >= 500))
      return reply({ error: "Session service temporarily unavailable." }, 503);
    if (error || !data.session)
      return reply({ value: null }, 200, { "Set-Cookie": header("", 0) });
    return reply({ value: JSON.stringify(data.session) }, 200, {
      "Set-Cookie": header(
        await seal(data.session.refresh_token, secret, name),
        604800,
      ),
    });
  } catch {
    return reply({ error: "Session service is unavailable." }, 503);
  }
};
