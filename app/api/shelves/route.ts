import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, ShelfKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().min(1, "Dá um nome pra prateleira").max(60),
});

/** Creates a custom shelf. */
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
      { error: "Nome inválido.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const last = await prisma.shelf.findFirst({
    where: { userId: guard.userId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  try {
    const shelf = await prisma.shelf.create({
      data: {
        userId: guard.userId,
        name: parsed.data.name,
        kind: ShelfKind.CUSTOM,
        position: (last?.position ?? -1) + 1,
      },
      select: { id: true, name: true, kind: true, position: true },
    });

    return NextResponse.json({ shelf: { ...shelf, items: [] } }, { status: 201 });
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
    console.error("[shelves] Falha ao criar prateleira:", error);
    return NextResponse.json(
      { error: "Não foi possível criar a prateleira." },
      { status: 500 }
    );
  }
}
