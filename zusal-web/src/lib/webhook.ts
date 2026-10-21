import { validWebhookTimestamp } from "./service.ts";
export async function verifyPaddle(
  raw: string,
  header: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  const parts = header.split(";").map((p) => p.split("="));
  const stamp = parts.find(([key]) => key === "ts")?.[1];
  const timestamp = Number(stamp);
  if (!secret || !stamp || !validWebhookTimestamp(timestamp, nowSeconds))
    return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  for (const [name, value] of parts) {
    if (name !== "h1" || !/^[a-f0-9]{64}$/.test(value ?? "")) continue;
    const bytes = Uint8Array.from(value.match(/.{2}/g)!, (hex) =>
      parseInt(hex, 16),
    );
    if (
      await crypto.subtle.verify(
        "HMAC",
        key,
        bytes,
        new TextEncoder().encode(stamp + ":" + raw),
      )
    )
      return true;
  }
  return false;
}
