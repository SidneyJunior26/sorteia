import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";
import { ensureDefaultShelves } from "@/lib/shelves";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bodySchema = z.object({
  bookId: z.string().trim().cuid(),
  shelfId: z.string().trim().cuid().optional(),
});

/**
 * Adds a book to a shelf — or moves it, if it's already on another one.
 *
 * There is no separate "move" here because `@@unique([userId, bookId])`
 * makes them the same operation: a book has exactly one shelf, so
 * shelving it again is an update of `shelfId`.
 */
export async function POST(request: NextRequest) {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // The snapshot is built from the DB, never from the request body — the
  // client must not be able to dictate what title ends up on a spine.
  const book = await prisma.book.findUnique({
    where: { id: parsed.data.bookId },
    select: {
      id: true,
      googleBooksId: true,
      title: true,
      author: true,
      coverUrl: true,
      isbn: true,
      category: true,
    },
  });

  if (!book) {
    return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
  }

  let shelfId = parsed.data.shelfId;

  if (shelfId) {
    // A shelf id from the client has to be re-checked against the caller,
    // otherwise a book could be filed onto someone else's shelf.
    const shelf = await prisma.shelf.findFirst({
      where: { id: shelfId, userId: guard.userId },
      select: { id: true },
    });
    if (!shelf) {
      return NextResponse.json(
        { error: "Prateleira não encontrada." },
        { status: 404 }
      );
    }
  } else {
    const unread = await ensureDefaultShelves(guard.userId);
    shelfId = unread.id;
  }

  const last = await prisma.shelfItem.findFirst({
    where: { shelfId, userId: guard.userId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const snapshot = {
    googleBooksId: book.googleBooksId,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    isbn: book.isbn,
    category: book.category,
  };

  const item = await prisma.shelfItem.upsert({
    where: { userId_bookId: { userId: guard.userId, bookId: book.id } },
    create: {
      userId: guard.userId,
      shelfId,
      bookId: book.id,
      position: (last?.position ?? -1) + 1,
      ...snapshot,
    },
    // Refresh the snapshot on re-add: a later sync may have filled in a
    // cover or fixed the synopsis.
    update: { shelfId, ...snapshot },
    select: {
      id: true,
      bookId: true,
      title: true,
      author: true,
      coverUrl: true,
      category: true,
      addedAt: true,
      shelfId: true,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
