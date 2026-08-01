import { prisma } from "./prisma";
import { fetchBooksForQuery } from "./google-books";

const MIN_RATINGS_WITHOUT_ISBN = 5;

// Portuguese-only catalog. Language codes from Google Books come as
// "pt", "pt-BR", "pt-PT", etc., so this checks the prefix rather than
// an exact match.
function isPortuguese(language: string | null): boolean {
  if (!language) return false;
  return language.toLowerCase().startsWith("pt");
}

/**
 * Google's `subject:xxx` tags are its own (English) genre taxonomy and
 * heavily skew search results toward the English-language catalog for
 * that genre (e.g. "romance" + subject:romance returns almost entirely
 * English titles) — dropped here since only Portuguese results matter.
 */
function stripSubjectTag(searchTerms: string): string {
  return searchTerms.replace(/\bsubject:\S+/gi, "").replace(/\s+/g, " ").trim();
}

export interface CategorySyncResult {
  category: string;
  slug: string;
  fetched: number;
  upserted: number;
  skippedObscure: number;
  skippedLanguage: number;
  error: string | null;
}

/**
 * Syncs a single category: fetches books from Google Books for its
 * search terms and upserts them into the Book table by googleBooksId.
 * Errors are caught and returned in the result rather than thrown, so
 * a failure in one category never aborts the rest of the sync run.
 */
async function syncCategory(category: { name: string; slug: string; searchTerms: string }): Promise<CategorySyncResult> {
  const result: CategorySyncResult = {
    category: category.name,
    slug: category.slug,
    fetched: 0,
    upserted: 0,
    skippedObscure: 0,
    skippedLanguage: 0,
    error: null,
  };

  let books;
  try {
    books = await fetchBooksForQuery(stripSubjectTag(category.searchTerms), 80);
  } catch (fetchError) {
    result.error = fetchError instanceof Error ? fetchError.message : String(fetchError);
    console.error(`[sync-books] Falha ao buscar categoria "${category.name}":`, fetchError);
    return result;
  }

  result.fetched = books.length;

  for (const book of books) {
    if (!isPortuguese(book.language)) {
      result.skippedLanguage += 1;
      continue;
    }

    // No ISBN is a signal of an obscure/incomplete edition, but it's
    // not decisive on its own — Google frequently omits ISBN even for
    // well-known titles. Only drop it when there's also no rating
    // signal backing it up; a book with real ratingsCount is worth
    // keeping (title/author search still works fine on Amazon without
    // an ISBN) instead of shrinking the pool and causing repeats.
    const hasRatingSignal = (book.ratingsCount ?? 0) >= MIN_RATINGS_WITHOUT_ISBN;
    if (!book.isbn && !hasRatingSignal) {
      result.skippedObscure += 1;
      continue;
    }

    try {
      await prisma.book.upsert({
        where: { googleBooksId: book.googleBooksId },
        update: {
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          synopsis: book.synopsis,
          category: category.name,
          language: book.language,
          ratingsCount: book.ratingsCount,
          averageRating: book.averageRating,
          coverUrl: book.coverUrl,
          publishedDate: book.publishedDate,
          source: "google_books",
          lastSyncedAt: new Date(),
        },
        create: {
          googleBooksId: book.googleBooksId,
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          synopsis: book.synopsis,
          category: category.name,
          language: book.language,
          ratingsCount: book.ratingsCount,
          averageRating: book.averageRating,
          coverUrl: book.coverUrl,
          publishedDate: book.publishedDate,
          source: "google_books",
          lastSyncedAt: new Date(),
        },
      });
      result.upserted += 1;
    } catch (upsertError) {
      // Skip this one book, keep processing the rest of the batch.
      console.error(`[sync-books] Falha ao salvar livro "${book.title}" (${book.googleBooksId}):`, upsertError);
    }
  }

  return result;
}

/**
 * Runs the full sync: for every Category in the DB, fetch and upsert
 * books from Google Books. Categories are processed sequentially and
 * independently — one category's Google API error/rate limit is
 * logged and skipped, never crashes the whole job.
 */
export async function runBookSync(): Promise<CategorySyncResult[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const results: CategorySyncResult[] = [];

  for (const category of categories) {
    const result = await syncCategory(category);
    results.push(result);
  }

  return results;
}
