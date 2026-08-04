import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves } from "@/lib/shelves";

// Deliberately outside /api/auth/* so it can never collide with the
// [...nextauth] catch-all.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(80),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(254),
  // 72 is bcrypt's hard ceiling — it silently truncates past that, so a
  // longer password would give a false sense of strength. Reject instead.
  password: z
    .string()
    .min(8, "A senha precisa de pelo menos 8 caracteres")
    .max(72, "A senha pode ter no máximo 72 caracteres"),
});

// Cost 10, not 12: bcryptjs is pure JS, and 12 takes ~600ms on a small
// serverless instance — long enough that signup feels broken.
const BCRYPT_COST = 10;

export async function POST(request: NextRequest) {
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

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Esse e-mail já está cadastrado." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash },
        select: { id: true },
      });
      await ensureDefaultShelves(user.id, tx);
    });
  } catch (error) {
    // The findUnique above is for the friendly message; this catches the
    // race between two simultaneous signups on the same address.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Esse e-mail já está cadastrado." },
        { status: 409 }
      );
    }
    console.error("[signup] Falha ao criar conta:", error);
    return NextResponse.json(
      { error: "Não foi possível criar a conta. Tente de novo." },
      { status: 500 }
    );
  }

  // No server-side sign-in here — the client calls
  // signIn("credentials", { redirect: false }) right after, which keeps
  // this route a plain resource creator.
  return NextResponse.json({ ok: true }, { status: 201 });
}
