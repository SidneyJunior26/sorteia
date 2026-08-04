import { prisma } from "@/lib/prisma";

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller can retry — only set when blocked. */
  retryAfterSeconds?: number;
}

// Opportunistic cleanup instead of a cron: cheap for the 99% of calls
// that skip it, and there's no window in which a live counter can be
// deleted out from under a request (windowStart is always in the past
// by the time it's stale).
const CLEANUP_PROBABILITY = 0.01;
const CLEANUP_MAX_AGE_MS = 60 * 60 * 1000;

/**
 * Fixed-window counter backed by Postgres — see the RateLimitEntry
 * model for why this can't just be an in-memory Map on serverless.
 *
 * Fixed windows (vs. sliding/token-bucket) let a caller burst up to
 * 2x the limit right at a window boundary. That's an acceptable
 * trade for the simplicity here — this guards against sustained
 * automation, not a precise quota.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);

  if (Math.random() < CLEANUP_PROBABILITY) {
    prisma.rateLimitEntry
      .deleteMany({
        where: { windowStart: { lt: new Date(now - CLEANUP_MAX_AGE_MS) } },
      })
      .catch((error) => console.error("[rate-limit] Falha na limpeza:", error));
  }

  let count: number;
  try {
    const entry = await prisma.rateLimitEntry.upsert({
      where: { key_windowStart: { key, windowStart } },
      update: { count: { increment: 1 } },
      create: { key, windowStart, count: 1 },
      select: { count: true },
    });
    count = entry.count;
  } catch (error) {
    // A rate-limit outage should never take the feature it's guarding
    // down with it — fail open.
    console.error("[rate-limit] Falha ao checar limite:", error);
    return { allowed: true };
  }

  if (count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(
        (windowStart.getTime() + windowMs - now) / 1000
      ),
    };
  }

  return { allowed: true };
}

/** Best-effort client IP — trusts Vercel's `x-forwarded-for`, which the
 *  platform sets itself (not attacker-controlled on that path). Falls
 *  back to a shared bucket if it's ever missing, e.g. local dev. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
