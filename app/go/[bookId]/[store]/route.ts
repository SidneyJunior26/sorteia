import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Store } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildAffiliateUrl } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

const paramsSchema = z.object({
  bookId: z.string().trim().cuid(),
  // Whitelist enum — anything outside these three literal values is
  // rejected with 400 before any URL is built. This is what prevents
  // this route from being used as an open redirect: the destination
  // is always one of a fixed set of per-store templates constructed
  // server-side in lib/affiliate.ts, never taken from user input.
  store: z.nativeEnum(Store),
});

interface RouteParams {
  params: {
    bookId: string;
    store: string;
  };
}

/**
 * GET /go/{bookId}/{store}
 *
 * Builds the affiliate destination URL for a given book + store,
 * records the click, and 302-redirects. No link is ever hardcoded
 * per book — everything is assembled at click time from the book's
 * title/author and each store's template (see lib/affiliate.ts).
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const parsed = paramsSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
  }

  const { bookId, store } = parsed.data;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true, title: true, author: true, isbn: true },
  });

  if (!book) {
    return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
  }

  const destinationUrl = buildAffiliateUrl(store, book);

  // Best-effort click tracking: never let a DB hiccup block the
  // redirect the user is waiting on.
  try {
    await prisma.affiliateLink.upsert({
      where: { bookId_store: { bookId: book.id, store } },
      update: {
        clicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
      create: {
        bookId: book.id,
        store,
        clicks: 1,
        lastClickedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`[go] Falha ao registrar clique (book=${book.id}, store=${store}):`, error);
  }

  return NextResponse.redirect(destinationUrl, { status: 302 });
}
