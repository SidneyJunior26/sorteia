import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves, resolveLibraryTitle } from "@/lib/shelves";
import EstanteView from "@/components/estante/EstanteView";
import type { EstanteDTO } from "@/types/shelf";

export const dynamic = "force-dynamic";

export const metadata = { title: "Minha estante — Achei Meu Livro" };

export default async function EstantePage() {
  const session = await auth();

  // The real access boundary. There is deliberately no middleware.ts —
  // it would sit in front of every request in the app, including the
  // /go/[bookId]/[store] affiliate redirects and the cron route.
  if (!session?.user?.id) {
    redirect("/entrar?next=%2Festante");
  }

  const userId = session.user.id;

  // Defensive: covers accounts created before shelves existed and any
  // half-failed signup. One indexed read when nothing is missing.
  await ensureDefaultShelves(userId);

  const [user, shelves] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, libraryTitle: true },
    }),
    prisma.shelf.findMany({
      where: { userId },
      orderBy: { position: "asc" },
      select: {
        id: true,
        name: true,
        kind: true,
        position: true,
        items: {
          orderBy: { addedAt: "asc" },
          select: {
            id: true,
            bookId: true,
            title: true,
            author: true,
            coverUrl: true,
            category: true,
            addedAt: true,
          },
        },
      },
    }),
  ]);

  const { title, isDefault } = resolveLibraryTitle(user);

  const initial: EstanteDTO = {
    libraryTitle: title,
    libraryTitleIsDefault: isDefault,
    totalBooks: shelves.reduce((sum, s) => sum + s.items.length, 0),
    shelves: shelves.map((shelf) => ({
      id: shelf.id,
      name: shelf.name,
      kind: shelf.kind,
      position: shelf.position,
      items: shelf.items.map((item) => ({
        ...item,
        addedAt: item.addedAt.toISOString(),
      })),
    })),
  };

  return <EstanteView initial={initial} />;
}
