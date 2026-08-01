import { Store } from "@prisma/client";

interface BookForLink {
  title: string;
  author: string;
  isbn?: string | null;
}

/**
 * All destination URLs are built server-side from fixed, per-store
 * templates below — never from user-supplied input. The `store`
 * value reaching these functions has already been validated against
 * the Store enum whitelist by the caller (see app/go/[bookId]/[store]),
 * so there is no open-redirect vector here.
 */

function searchQuery(book: BookForLink): string {
  return `${book.title} ${book.author}`.trim();
}

/**
 * Amazon: once approved in Amazon Associados, a search link already
 * works for tracking commission — no need to match the exact product.
 * If AMAZON_ASSOC_TAG isn't set yet, we return the same search link
 * without the `tag` param: still a valid, working link, just without
 * commission tracking.
 *
 * Searching by ISBN (when we have one) is far more precise than
 * title+author free text — it either finds the exact edition or
 * returns nothing, instead of surfacing an unrelated "closest match".
 */
export function getAmazonLink(book: BookForLink): string {
  const tag = process.env.AMAZON_ASSOC_TAG;

  const url = new URL("https://www.amazon.com.br/s");
  // URLSearchParams handles URL-encoding for us.
  url.searchParams.set("k", book.isbn || searchQuery(book));
  if (tag) {
    url.searchParams.set("tag", tag);
  }

  return url.toString();
}

/**
 * Shopee: the real integration uses Shopee's Open Platform Affiliate
 * API (`generateShortLink` GraphQL mutation) to turn any URL into a
 * short, tracked affiliate link. That call requires signed requests
 * with SHOPEE_APP_ID / SHOPEE_APP_SECRET and an approved
 * SHOPEE_AFFILIATE_ID, none of which exist yet.
 *
 * This function is the isolated seam where that real API call gets
 * plugged in later. For now it always returns the plain fallback
 * search URL — no fake/mocked API response.
 *
 * TODO (once approved + credentials set): call Shopee's Affiliate
 * Open API `generateShortLink` mutation with this fallback URL as
 * input, sign the request per Shopee's docs using SHOPEE_APP_ID and
 * SHOPEE_APP_SECRET, and return the short link it produces instead of
 * the fallback below. Keep the fallback as an error-path backup.
 */
export function getShopeeAffiliateLink(book: BookForLink): string {
  const fallbackUrl = buildShopeeFallbackUrl(book);

  const hasShopeeCredentials =
    Boolean(process.env.SHOPEE_APP_ID) &&
    Boolean(process.env.SHOPEE_APP_SECRET) &&
    Boolean(process.env.SHOPEE_AFFILIATE_ID);

  if (!hasShopeeCredentials) {
    return fallbackUrl;
  }

  // Credentials are present, but the real generateShortLink call is
  // not implemented yet (out of scope until the program approval and
  // API integration work happens). Falling back keeps the site
  // functional either way.
  return fallbackUrl;
}

function buildShopeeFallbackUrl(book: BookForLink): string {
  const url = new URL("https://shopee.com.br/search");
  url.searchParams.set("keyword", searchQuery(book));
  return url.toString();
}

/**
 * Mercado Livre: no simple public affiliate-link-generation API for
 * regular affiliates (the official API requires high volume). Uses a
 * configurable pattern from MERCADOLIVRE_LINK_PATTERN (containing a
 * literal "{query}" placeholder), interpolated with the URL-encoded
 * search query. Falls back to a direct site search if not configured.
 */
export function getMercadoLivreLink(book: BookForLink): string {
  const query = encodeURIComponent(searchQuery(book));
  const pattern = process.env.MERCADOLIVRE_LINK_PATTERN;

  if (pattern && pattern.includes("{query}")) {
    return pattern.replace("{query}", query);
  }

  return `https://lista.mercadolivre.com.br/${query}`;
}

/** Dispatches to the right builder for a whitelisted Store value. */
export function buildAffiliateUrl(store: Store, book: BookForLink): string {
  switch (store) {
    case Store.AMAZON:
      return getAmazonLink(book);
    case Store.SHOPEE:
      return getShopeeAffiliateLink(book);
    case Store.MERCADO_LIVRE:
      return getMercadoLivreLink(book);
    default: {
      // Exhaustiveness check: if Store gains a new member, this fails
      // to compile until handled above.
      const _exhaustive: never = store;
      throw new Error(`Loja não suportada: ${_exhaustive}`);
    }
  }
}
