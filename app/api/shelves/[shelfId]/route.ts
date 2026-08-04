import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, ShelfKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const paramsSchema = z.object({ shelfId: z.string().trim().cuid() });
const patchSchema = z.object({
  name: z.string().trim().min(1, "Dá um nome pra prateleira").max(60),
});

/** Renames a shelf — works for the default ones too; only the label
 *  changes, `kind` stays put so ensureDefaultShelves never duplicates. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { shelfId: string } }
) {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Prateleira inválida." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Nome inválido.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // userId inside the WHERE, not a post-fetch comparison — that's what
    // makes another user's shelf id a 404 instead of an IDOR.
    const result = await prisma.shelf.updateMany({
      where: { id: parsedParams.data.shelfId, userId: guard.userId },
      data: { name: parsed.data.name },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Prateleira não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, name: parsed.data.name });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Você já tem uma prateleira com esse nome." },
        { status: 409 }
      );
    }
    console.error("[shelves] Falha ao renomear:", error);
    return NextResponse.json(
      { error: "Não foi possível renomear." },
      { status: 500 }
    );
  }
}

/** Deletes a custom shelf, relocating its books to "Não lidos" first. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { shelfId: string } }
) {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Prateleira inválida." }, { status: 400 });
  }

  const shelf = await prisma.shelf.findFirst({
    where: { id: parsedParams.data.shelfId, userId: guard.userId },
    select: { id: true, kind: true },
  });

  if (!shelf) {
    return NextResponse.json(
      { error: "Prateleira não encontrada." },
      { status: 404 }
    );
  }

  if (shelf.kind !== ShelfKind.CUSTOM) {
    return NextResponse.json(
      { error: "As prateleiras Não lidos e Lidos não podem ser excluídas." },
      { status: 403 }
    );
  }

  const fallback = await prisma.shelf.findFirst({
    where: { userId: guard.userId, kind: ShelfKind.UNREAD },
    select: { id: true },
  });

  if (!fallback) {
    return NextResponse.json(
      { error: "Prateleira de destino não encontrada." },
      { status: 500 }
    );
  }

  try {
    // The books are moved out explicitly rather than left to the schema's
    // onDelete: Cascade, which would delete them with the shelf.
    await prisma.$transaction([
      prisma.shelfItem.updateMany({
        where: { shelfId: shelf.id, userId: guard.userId },
        data: { shelfId: fallback.id },
      }),
      prisma.shelf.delete({ where: { id: shelf.id } }),
    ]);

    return NextResponse.json({ ok: true, movedTo: fallback.id });
  } catch (error) {
    console.error("[shelves] Falha ao excluir:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a prateleira." },
      { status: 500 }
    );
  }
}
