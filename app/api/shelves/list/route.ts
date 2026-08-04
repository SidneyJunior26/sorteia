import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * The caller's shelves, names only — used by the "guardar em..." picker
 * on the home page, which has no server-rendered shelf data of its own.
 *
 * Sits at /api/shelves/list rather than GET /api/shelves so the
 * collection route stays a single-purpose POST.
 */
export async function GET() {
  const guard = await requireUserId();
  if ("response" in guard) return guard.response;

  const shelves = await prisma.shelf.findMany({
    where: { userId: guard.userId },
    orderBy: { position: "asc" },
    select: { id: true, name: true, kind: true },
  });

  return NextResponse.json({ shelves });
}
