import { NextRequest, NextResponse } from "next/server";
import { runBookSync } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // seconds; sync across many categories can take a while

/**
 * GET /api/cron/sync-books
 *
 * Triggered by Vercel Cron (see vercel.json) on a daily schedule.
 * Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}`
 * for scheduled invocations of this route, as long as the CRON_SECRET
 * env var is set on the Vercel project — see README for details.
 *
 * This check is important: without it, anyone who discovers this URL
 * could trigger the job on demand and burn the Google Books API's
 * daily quota (shared across the whole app).
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("[sync-books] CRON_SECRET não configurado — recusando execução.");
    return NextResponse.json({ error: "CRON_SECRET não configurado no servidor." }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const startedAt = Date.now();
  const results = await runBookSync();
  const durationMs = Date.now() - startedAt;

  const totals = results.reduce(
    (acc, r) => {
      acc.fetched += r.fetched;
      acc.upserted += r.upserted;
      if (r.error) acc.categoriesWithErrors += 1;
      return acc;
    },
    { fetched: 0, upserted: 0, categoriesWithErrors: 0 }
  );

  return NextResponse.json({
    ok: true,
    durationMs,
    totals,
    results,
  });
}
