import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const paramsSchema = z.object({ itemId: z.string().trim().cuid() });
const patchSchema = z.object({ shelfId: z.string().trim().cuid() });

/** Moves a book to another shelf, addressed by shelf-item id. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Item inválido." }, { status: 400 });
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
      { error: "Prateleira inválida.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const shelf = await prisma.shelf.findFirst({
    where: { id: parsed.data.shelfId, userId: guard.userId },
    select: { id: true },
  });
  if (!shelf) {
    return NextResponse.json(
      { error: "Prateleira não encontrada." },
      { status: 404 }
    );
  }

  const result = await prisma.shelfItem.updateMany({
    where: { id: parsedParams.data.itemId, userId: guard.userId },
    data: { shelfId: shelf.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, shelfId: shelf.id });
}

/** Takes a book off the shelf entirely. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Item inválido." }, { status: 400 });
  }

  const result = await prisma.shelfItem.deleteMany({
    where: { id: parsedParams.data.itemId, userId: guard.userId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Livro não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
