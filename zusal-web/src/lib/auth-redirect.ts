export function safeNext(search: string) {
  const next = new URLSearchParams(search).get("next");
  return next && /^\/app(?:\/|\?|$)/.test(next) && !/[\\\x00-\x1f]/.test(next)
    ? next
    : "/app";
}
