import { createClient } from "npm:@supabase/supabase-js@2.118.0";
export const env = (key: string) => Deno.env.get(key) ?? "";
export const admin = () =>
  createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
export class Failure extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
export async function body(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 16384)
    throw new Failure(413, "Request too large.");
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > 16384)
    throw new Failure(413, "Request too large.");
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Failure(400, "Invalid JSON.");
  }
}
export async function user(req: Request) {
  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token) throw new Failure(401, "Sign in to continue.");
  const { data, error } = await admin().auth.getUser(token);
  if (error || !data.user?.email_confirmed_at)
    throw new Failure(401, "A verified sign-in is required.");
  return data.user;
}
export async function rate(key: string, limit: number, seconds = 60) {
  const { data, error } = await admin().rpc("take_rate", {
    p_bucket: key,
    p_limit: limit,
    p_seconds: seconds,
  });
  if (error) throw new Failure(503, "Service temporarily unavailable.");
  if (!data)
    throw new Failure(429, "Too many requests. Please wait and try again.");
}
export const randomToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
export async function hash(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
}
export function check(result: { error: unknown }) {
  if (result.error) throw new Failure(503, "Service temporarily unavailable.");
}
export function serve(handler: (req: Request) => Promise<Response>) {
  Deno.serve(async (req: Request) => {
    const origin = req.headers.get("origin");
    const allowed = env("APP_ORIGIN");
    if (origin && origin !== allowed)
      return json({ error: "Origin not allowed." }, 403);
    const cors: Record<string, string> = origin
      ? {
          "Access-Control-Allow-Origin": origin,
          Vary: "Origin",
          "Access-Control-Allow-Headers":
            "authorization,apikey,content-type,x-client-info",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        }
      : {};
    if (req.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST")
      return json({ error: "Method not allowed." }, 405);
    let response: Response;
    try {
      response = await handler(req);
    } catch (error) {
      const id = crypto.randomUUID();
      if (!(error instanceof Failure))
        console.error(
          JSON.stringify({ event: "function_error", request_id: id }),
        );
      response = json(
        {
          error:
            error instanceof Failure
              ? error.message
              : "Unable to complete this action.",
          request_id: id,
        },
        error instanceof Failure ? error.status : 500,
      );
    }
    for (const [k, v] of Object.entries(cors)) response.headers.set(k, v);
    return response;
  });
}
