/**
 * Sanitization helpers for content coming from external APIs (Google
 * Books, Open Library). We never trust/render raw HTML from these
 * sources — the `description` field from Google Books frequently
 * contains tags like <p>, <b>, <i>, <br> — so we strip all markup
 * before storing, to avoid stored XSS if this text is ever rendered
 * with dangerouslySetInnerHTML down the line, and to keep the DB
 * clean plain text.
 */

/** Strips all HTML tags and decodes a small set of common entities. */
export function stripHtml(input: string | null | undefined): string | null {
  if (!input) return null;

  const withoutTags = input.replace(/<[^>]*>/g, " ");

  const decoded = withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  return decoded.replace(/\s+/g, " ").trim() || null;
}

/** Truncates text to a max length, cutting on a word boundary. */
export function truncate(input: string | null, maxLength = 600): string | null {
  if (!input) return null;
  if (input.length <= maxLength) return input;

  const sliced = input.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const safeSlice = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;

  return `${safeSlice}…`;
}

/** Sanitizes and truncates a synopsis coming from an external API. */
export function sanitizeSynopsis(
  input: string | null | undefined,
  maxLength = 600
): string | null {
  return truncate(stripHtml(input), maxLength);
}
