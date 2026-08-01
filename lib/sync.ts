import { prisma } from "./prisma";
import { fetchBooksForQuery } from "./google-books";

export interface CategorySyncResult {
  category: string;
  slug: string;
  fetched: number;
  upserted: number;
  skippedObscure: number;
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
    error: null,
  };

  try {
    const books = await fetchBooksForQuery(category.searchTerms, 30);
    result.fetched = books.length;

    for (const book of books) {
      // Skip books with no ISBN at all — a much stronger signal of an
      // obscure/incomplete edition than Google's ratingsCount, which is
      // almost always empty even for well-known titles (tested against
      // "Dom Casmurro" itself: no ratingsCount). No ISBN means no clean
      // way to find this exact edition on Amazon either.
      if (!book.isbn) {
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
  } catch (fetchError) {
    result.error = fetchError instanceof Error ? fetchError.message : String(fetchError);
    console.error(`[sync-books] Falha ao buscar categoria "${category.name}":`, fetchError);
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
