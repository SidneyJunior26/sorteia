import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * LGPD Art. 9 / 18 II e V — direito de acesso e portabilidade. Devolve
 * tudo que o app guarda sobre o usuário, num formato legível/reutilizável.
 * `passwordHash` fica de fora de propósito: é segredo do sistema, não um
 * dado pessoal que o titular precise "receber de volta".
 */
export async function GET() {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  const user = await prisma.user.findUnique({
    where: { id: guard.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      libraryTitle: true,
      createdAt: true,
      accounts: { select: { provider: true } },
      shelves: {
        orderBy: { position: "asc" },
        select: {
          name: true,
          kind: true,
          items: {
            orderBy: { addedAt: "asc" },
            select: {
              title: true,
              author: true,
              isbn: true,
              category: true,
              addedAt: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  }

  return NextResponse.json(
    { exportedAt: new Date().toISOString(), user },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="meus-dados.json"',
      },
    }
  );
}

/**
 * LGPD Art. 18 VI — direito de eliminação. `onDelete: Cascade` em
 * Account/Session/Shelf/ShelfItem faz o resto sumir junto — não sobra
 * rastro do usuário além do que já era anônimo (cliques em AffiliateLink,
 * que nunca guardaram quem clicou).
 */
export async function DELETE() {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  await prisma.user.delete({ where: { id: guard.userId } });

  return NextResponse.json({ ok: true });
}
