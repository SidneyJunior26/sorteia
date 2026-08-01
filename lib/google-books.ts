import { sanitizeSynopsis } from "./sanitize";

const GOOGLE_BOOKS_ENDPOINT = "https://www.googleapis.com/books/v1/volumes";

interface GoogleBooksIndustryIdentifier {
  type: string;
  identifier: string;
}

interface GoogleBooksImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  imageLinks?: GoogleBooksImageLinks;
  industryIdentifiers?: GoogleBooksIndustryIdentifier[];
  language?: string;
  ratingsCount?: number;
  averageRating?: number;
}

interface GoogleBooksItem {
  id: string;
  volumeInfo?: GoogleBooksVolumeInfo;
}

interface GoogleBooksResponse {
  totalItems?: number;
  items?: GoogleBooksItem[];
}

/** Normalized shape we actually persist, after sanitizing external data. */
export interface NormalizedBook {
  googleBooksId: string;
  isbn: string | null;
  title: string;
  author: string;
  synopsis: string | null;
  coverUrl: string | null;
  publishedDate: string | null;
  language: string | null;
  ratingsCount: number;
  averageRating: number | null;
}

function pickIsbn(identifiers: GoogleBooksIndustryIdentifier[] | undefined): string | null {
  if (!identifiers || identifiers.length === 0) return null;
  const isbn13 = identifiers.find((i) => i.type === "ISBN_13");
  const isbn10 = identifiers.find((i) => i.type === "ISBN_10");
  return isbn13?.identifier ?? isbn10?.identifier ?? null;
}

/** Google sometimes returns http:// thumbnail URLs; upgrade to https. */
function normalizeCoverUrl(url: string | undefined): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\//, "https://");
}

function normalizeItem(item: GoogleBooksItem): NormalizedBook | null {
  const info = item.volumeInfo;
  if (!info || !info.title) return null;

  const author = info.authors && info.authors.length > 0 ? info.authors.join(", ") : "Autor desconhecido";

  return {
    googleBooksId: item.id,
    isbn: pickIsbn(info.industryIdentifiers),
    title: info.title,
    author,
    synopsis: sanitizeSynopsis(info.description),
    coverUrl: normalizeCoverUrl(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail),
    publishedDate: info.publishedDate ?? null,
    language: info.language ?? null,
    ratingsCount: info.ratingsCount ?? 0,
    averageRating: info.averageRating ?? null,
  };
}

/**
 * Fetches a single page of results from the Google Books API for a
 * given search query. Throws on network/HTTP errors — callers should
 * catch and log per-category failures without crashing the whole sync.
 */
async function fetchPage(query: string, startIndex: number, maxResults: number): Promise<GoogleBooksResponse> {
  const params = new URLSearchParams({
    q: query,
    startIndex: String(startIndex),
    maxResults: String(maxResults),
    langRestrict: "pt",
    printType: "books",
  });

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (apiKey) {
    params.set("key", apiKey);
  }

  const url = `${GOOGLE_BOOKS_ENDPOINT}?${params.toString()}`;
  const response = await fetch(url, {
    // Sync job runs server-side on a schedule; no need to cache here,
    // Next's default fetch cache is disabled for dynamic cron routes.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Books API respondeu ${response.status} para query "${query}" (startIndex=${startIndex})`);
  }

  return (await response.json()) as GoogleBooksResponse;
}

/**
 * Fetches and normalizes up to `targetCount` books for a given search
 * query, paginating a few pages. Individual malformed items (missing
 * title, etc.) are skipped rather than failing the whole batch.
 */
export async function fetchBooksForQuery(query: string, targetCount = 30): Promise<NormalizedBook[]> {
  const pageSize = 20;
  const maxPages = 3; // up to ~60 raw results fetched, enough to yield ~20-30 valid ones
  const results = new Map<string, NormalizedBook>();

  for (let page = 0; page < maxPages && results.size < targetCount; page++) {
    const startIndex = page * pageSize;
    const data = await fetchPage(query, startIndex, pageSize);

    if (!data.items || data.items.length === 0) {
      break; // no more results for this query
    }

    for (const item of data.items) {
      const normalized = normalizeItem(item);
      if (normalized) {
        results.set(normalized.googleBooksId, normalized);
      }
    }
  }

  return Array.from(results.values()).slice(0, targetCount);
}
