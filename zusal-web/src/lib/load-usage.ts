import { supabase } from "./supabase";
import type { ModelRequest } from "./contracts";
export async function loadUsage() {
  if (!supabase) throw new Error("Account services unavailable.");
  const snapshot = new Date().toISOString(),
    cutoff = new Date(Date.now() - 30 * 86400000).toISOString(),
    rows: ModelRequest[] = [];
  for (let offset = 0; ; offset += 1000) {
    const result = await supabase
      .from("model_requests")
      .select("*")
      .gte("occurred_at", cutoff)
      .lte("ingested_at", snapshot)
      .order("occurred_at", { ascending: false })
      .order("id")
      .range(offset, offset + 999);
    if (result.error) throw result.error;
    rows.push(...((result.data ?? []) as ModelRequest[]));
    if ((result.data?.length ?? 0) < 1000)
      return { data: rows, error: null, count: rows.length };
  }
}
