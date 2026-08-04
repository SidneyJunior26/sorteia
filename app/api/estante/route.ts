import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";
import { resolveLibraryTitle } from "@/lib/shelves";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const patchSchema = z.object({
  // null (or an empty string) clears the override, so the heading goes
  // back to being derived from the user's name.
  libraryTitle: z.string().trim().max(60).nullable(),
});

/** Renames the whole library (the heading above the shelves). */
export async function PATCH(request: NextRequest) {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Título inválido.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const next = parsed.data.libraryTitle?.trim() || null;

  const user = await prisma.user.update({
    where: { id: guard.userId },
    data: { libraryTitle: next },
    select: { name: true, libraryTitle: true },
  });

  const { title, isDefault } = resolveLibraryTitle(user);

  return NextResponse.json({ ok: true, libraryTitle: title, isDefault });
}
