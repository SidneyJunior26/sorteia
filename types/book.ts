/** Shared shape of a Book as returned by /api/random-book. */
export interface BookDTO {
  id: string;
  googleBooksId: string;
  isbn: string | null;
  title: string;
  author: string;
  synopsis: string | null;
  category: string;
  coverUrl: string | null;
  publishedDate: string | null;
  source: string;
  lastSyncedAt: string;
  createdAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
}
