import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
const hashes = new Set();
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await scan(path);
    else if (entry.name.endsWith(".html")) {
      const html = await readFile(path, "utf8");
      for (const match of html.matchAll(
        /<script\b([^>]*)>([\s\S]*?)<\/script>/g,
      )) {
        if (/\bsrc\s*=/.test(match[1]) || !match[2].trim()) continue;
        hashes.add(
          "'sha256-" +
            createHash("sha256").update(match[2]).digest("base64") +
            "'",
        );
      }
    }
  }
}
await scan("dist");
const csp = [
  "default-src 'self'",
  "script-src 'self' " + [...hashes].join(" ") + " https://cdn.paddle.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https://*.paddle.com",
  "connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.paddle.com",
  "frame-src https://*.paddle.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");
await writeFile(
  "dist/_headers",
  "/*\n  Content-Security-Policy: " + csp + "\n",
);
console.log("Generated CSP with " + hashes.size + " inline script hashes.");
