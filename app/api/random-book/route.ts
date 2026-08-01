import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  category: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Categoria inválida")
    .optional(),
  exclude: z.string().trim().cuid().optional(),
  count: z.coerce.number().int().min(1).max(3).optional().default(1),
});

interface RandomBookRow {
  id: string;
  googleBooksId: string;
  isbn: string | null;
  title: string;
  author: string;
  synopsis: string | null;
  category: string | null;
  language: string | null;
  coverUrl: string | null;
  publishedDate: string | null;
  source: string;
  lastSyncedAt: Date;
  createdAt: Date;
}

/**
 * GET /api/random-book?category=<slug>&exclude=<bookId>&count=<1-3>
 *
 * Returns up to `count` random books from the synced index. Filters
 * happen entirely at the database level (`ORDER BY random() LIMIT n`)
 * via parameterized Prisma queries — no string concatenation of
 * request input into SQL, ever. `exclude` (avoid repeating the last
 * shown book) only applies when count=1, since with count>1 the
 * `LIMIT n` already returns distinct rows within the same draw.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    exclude: searchParams.get("exclude") ?? undefined,
    count: searchParams.get("count") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { category: categorySlug, exclude, count } = parsed.data;
  const applyExclude = count === 1 ? exclude : undefined;

  let categoryName: string | null = null;
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { name: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
    }
    categoryName = category.name;
  }

  const conditions: Prisma.Sql[] = [];
  if (categoryName) {
    conditions.push(Prisma.sql`category = ${categoryName}`);
  }
  if (applyExclude) {
    conditions.push(Prisma.sql`id != ${applyExclude}`);
  }

  const whereClause =
    conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}` : Prisma.empty;

  let rows = await prisma.$queryRaw<RandomBookRow[]>(
    Prisma.sql`SELECT * FROM "Book" ${whereClause} ORDER BY random() LIMIT ${count}`
  );

  // If excluding the last-shown book left zero candidates (e.g. only
  // one book in that category), retry once without the exclusion.
  if (rows.length === 0 && applyExclude) {
    const retryWhere = categoryName ? Prisma.sql`WHERE category = ${categoryName}` : Prisma.empty;

    rows = await prisma.$queryRaw<RandomBookRow[]>(
      Prisma.sql`SELECT * FROM "Book" ${retryWhere} ORDER BY random() LIMIT ${count}`
    );
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Nenhum livro encontrado. O catálogo pode ainda não ter sido sincronizado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ books: rows });
}
