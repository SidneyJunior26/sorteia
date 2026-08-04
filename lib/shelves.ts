import { Prisma, ShelfKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Shelves every account starts with, in display order. */
export const DEFAULT_SHELVES = [
  { kind: ShelfKind.UNREAD, name: "Não lidos", position: 0 },
  { kind: ShelfKind.READ, name: "Lidos", position: 1 },
] as const;

type PrismaLike = Prisma.TransactionClient | typeof prisma;

/**
 * Creates whichever default shelves the user is missing and returns the
 * "Não lidos" one (the drop target for a freshly sorteado book).
 *
 * Keyed on `kind`, never on `name`: a user who renamed "Não lidos" to
 * "Fila" must not silently get a second one on the next call.
 *
 * Called from three places, all of them necessary:
 *   1. auth.ts `events.createUser` — the Google sign-up path.
 *   2. /api/signup — the credentials path creates the User row directly
 *      with Prisma and never touches the adapter, so the event above
 *      does not fire.
 *   3. /estante — defensive; covers accounts created before this shipped
 *      and any half-failed signup. One indexed read when nothing is
 *      missing.
 */
export async function ensureDefaultShelves(
  userId: string,
  client: PrismaLike = prisma
) {
  const existing = await client.shelf.findMany({
    where: { userId },
    select: { id: true, kind: true, name: true, position: true },
    orderBy: { position: "asc" },
  });

  const presentKinds = new Set(existing.map((s) => s.kind));
  const missing = DEFAULT_SHELVES.filter((s) => !presentKinds.has(s.kind));

  if (missing.length > 0) {
    await client.shelf.createMany({
      data: missing.map((s) => ({ userId, ...s })),
      skipDuplicates: true,
    });
  }

  const unread = await client.shelf.findFirst({
    where: { userId, kind: ShelfKind.UNREAD },
    select: { id: true },
  });

  // Fall back to the lowest-positioned shelf if UNREAD somehow lost a
  // race — better to file the book somewhere than to drop it.
  if (unread) return unread;

  return client.shelf.findFirstOrThrow({
    where: { userId },
    select: { id: true },
    orderBy: { position: "asc" },
  });
}

/**
 * The heading above the bookshelf. A null `libraryTitle` means the user
 * never customized it, so it's derived from their name and keeps
 * following it.
 */
export function resolveLibraryTitle(user: {
  name: string | null;
  libraryTitle: string | null;
}): { title: string; isDefault: boolean } {
  if (user.libraryTitle?.trim()) {
    return { title: user.libraryTitle.trim(), isDefault: false };
  }

  const firstName = user.name?.trim().split(/\s+/)[0];
  return {
    title: firstName ? `Estante do ${firstName}` : "Minha estante",
    isDefault: true,
  };
}
