import { admin, hash, Failure } from "./http.ts";
export async function device(req: Request) {
  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token || !/^zusal_[a-f0-9]{64}$/.test(token))
    throw new Failure(401, "Device authentication required.");
  const { data, error } = await admin()
    .from("devices")
    .select("id,account_id")
    .eq("token_hash", await hash(token))
    .is("revoked_at", null)
    .single();
  if (error || !data)
    throw new Failure(401, "Device is unavailable or revoked.");
  return data as { id: string; account_id: string };
}
