/**
 * Sanitizes a `?next=` redirect target.
 *
 * Anything that isn't a single-slash-prefixed relative path is thrown
 * away — `//evil.com` and `https://evil.com` are both browser-valid
 * redirect targets, so accepting a raw query param here would turn the
 * login page into an open redirect.
 */
export function safeNextPath(value: string | undefined, fallback = "/estante") {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}
