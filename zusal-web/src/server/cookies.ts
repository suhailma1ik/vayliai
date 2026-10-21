// Only refresh tokens and PKCE verifiers are persisted; encryption key stays on Netlify.
async function key(secret: string) {
  if (!/^[a-fA-F0-9]{64}$/.test(secret))
    throw new Error("AUTH_COOKIE_KEY must be 32 random bytes encoded as hex.");
  return crypto.subtle.importKey(
    "raw",
    Uint8Array.from(secret.match(/.{2}/g)!, (v) => parseInt(v, 16)),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}
export async function seal(value: string, secret: string, purpose: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: new TextEncoder().encode(purpose),
      },
      await key(secret),
      new TextEncoder().encode(JSON.stringify({ value, at: Date.now() })),
    ),
  );
  return Buffer.from(new Uint8Array([...iv, ...encrypted])).toString(
    "base64url",
  );
}
export async function unseal(value: string, secret: string, purpose: string) {
  try {
    const bytes = new Uint8Array(Buffer.from(value, "base64url"));
    const raw = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: bytes.slice(0, 12),
        additionalData: new TextEncoder().encode(purpose),
      },
      await key(secret),
      bytes.slice(12),
    );
    const stored = JSON.parse(new TextDecoder().decode(raw));
    if (
      typeof stored.value !== "string" ||
      !Number.isFinite(stored.at) ||
      Date.now() - stored.at >
        (purpose.endsWith("pkce") ? 600000 : 604800000) ||
      stored.at > Date.now() + 60000
    )
      return null;
    return stored.value as string;
  } catch {
    return null;
  }
}
