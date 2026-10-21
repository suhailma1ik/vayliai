import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
// Async storage delegates persistence to encrypted, HttpOnly, same-origin cookies.
// Supabase access tokens live in memory. Never write sessions to browser storage.
let memory = new Map<string, string>();
async function storage(action: string, key: string, value?: string) {
  const response = await fetch("/.netlify/functions/auth-storage", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, key, value }),
  });
  if (!response.ok)
    throw new Error("Session service unavailable. Please try again.");
  return (await response.json()).value;
}
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          flowType: "pkce",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
          storage: {
            async getItem(key) {
              if (memory.has(key)) return memory.get(key)!;
              const value = await storage("get", key);
              if (value) memory.set(key, value);
              return value;
            },
            async setItem(key, value) {
              await storage("set", key, value);
              memory.set(key, value);
            },
            async removeItem(key) {
              memory.delete(key);
              await storage("remove", key);
            },
          },
        },
      })
    : null;
export async function invoke(name: string, body: Record<string, unknown>) {
  if (!supabase) throw new Error("Live services are not configured yet.");
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error)
    throw new Error(
      "The service could not complete this action. Please try again or contact support.",
    );
  if (data?.error) throw new Error(String(data.error));
  return data;
}
