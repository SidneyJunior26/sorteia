# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Achei Meu Livro" — a Next.js book-recommendation site. The user hits
"Sortear livro" and gets a random book (optionally filtered by
category) with cover, synopsis, and affiliate buy buttons for Amazon,
Mercado Livre, and Shopee. Full product plan: `PLANO.md`. Setup/deploy
walkthrough: `README.md`.

No book is ever entered manually. A cron job (`/api/cron/sync-books`)
pulls books per category from the Google Books API into a local
Postgres index; the randomizer queries that index (`ORDER BY random()`)
so the user-facing path never touches the external API. The catalog is
Portuguese-only — `lib/sync.ts` fetches per category, drops the
`subject:xxx` qualifier (Google's own English genre taxonomy, which
otherwise skews results English), and discards any item whose
`language` field isn't `pt*`.

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build             # production build
npm run lint               # ESLint (next/core-web-vitals)
npm run typecheck           # tsc --noEmit
npx prisma validate          # validate prisma/schema.prisma without a DB connection
npx prisma migrate dev        # create/apply a migration locally (needs DATABASE_URL)
npx prisma db seed             # populate the ~10 seed categories (prisma/seed.ts)
```

There is no test suite in this repo — `lint`, `typecheck`, `build`, and
`prisma validate` are the available sanity checks (see README "Sanity
checks disponíveis sem banco configurado").

To exercise the sync job manually against a running dev server:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync-books
```

## Architecture

- **`app/page.tsx`** — server component; loads categories from Postgres
  directly via Prisma (`force-dynamic`, since the DB may be
  unconfigured at build time), filters out any category with zero
  synced books (a dead-end filter option otherwise), and renders
  `BookRandomizer`.
- **`app/api/random-book/route.ts`** — `GET`, validates query params
  with `zod`, then runs a parameterized `$queryRaw` (`ORDER BY random()
  LIMIT n`) against the `Book` table. Filters (`category`, `exclude`)
  are all applied inside the SQL, never in JS. `exclude` (skip
  repeating the last-shown book) only applies when `count === 1`. If
  excluding leaves zero rows, it retries once without the exclusion.
- **`app/api/cron/sync-books/route.ts`** — `GET`, gated by a
  `CRON_SECRET` bearer token (Vercel Cron sends this automatically once
  the env var is set on the project; see `vercel.json`). Delegates to
  `lib/sync.ts`.
- **`app/go/[bookId]/[store]/route.ts`** — `GET`, builds the affiliate
  URL for a `(book, store)` pair, best-effort increments a click
  counter, and 302-redirects. `store` is validated against the
  `Store` Prisma enum before use — this whitelist is what keeps the
  route from being an open redirect.
- **`lib/sync.ts`** — `runBookSync()` iterates every `Category` row,
  fetches books per category from Google Books, and upserts by
  `googleBooksId`. Books with no ISBN are skipped (stronger obscurity
  signal than Google's near-always-empty `ratingsCount`). Failures are
  caught per-category and per-book so one bad category/book never
  aborts the run — see `CategorySyncResult`.
- **`lib/google-books.ts`** — fetches + paginates the Google Books API,
  normalizes raw items into `NormalizedBook`, runs synopses through
  `sanitizeSynopsis`. Malformed items (no title) are dropped silently.
- **`lib/sanitize.ts`** — strips HTML from Google Books' `description`
  field before it ever reaches the DB (stored-XSS prevention) and
  truncates on a word boundary.
- **`lib/affiliate.ts`** — `buildAffiliateUrl(store, book)` dispatches
  to a per-store builder. All destination URLs are assembled
  server-side from fixed templates + env vars — never from request
  input. Amazon and Mercado Livre have working fallback search links
  even without affiliate credentials configured; Shopee has an
  isolated seam (`getShopeeAffiliateLink`) for the real
  `generateShortLink` Open API call, not yet implemented (see
  `PLANO.md` §7 and §9 for status).
- **`prisma/schema.prisma`** — `Book` (the auto-synced cache, not a
  manual catalog), `Category` (drives both the Google Books search
  terms and the frontend filter dropdown), `AffiliateLink` (click
  counters only — URLs are never persisted, always rebuilt on demand).

Env vars are documented inline in `.env.example`; the site runs with
just `DATABASE_URL`/`CRON_SECRET` set — affiliate tag vars are optional
and fall back to plain (non-monetized) search links until each program
approves the account (see README "Quando for aprovado...").

## Opensquad (marketing/content side-tooling)

This repo also hosts **Opensquad**, a separate multi-agent
orchestration framework used for non-engineering work (site copy
review, social content, branding) — unrelated to the Next.js app's
runtime. Entry point is the `/opensquad` skill.

- `_opensquad/` — framework core (don't hand-edit `_opensquad/core/`)
- `_opensquad/_memory/` — persistent company context/preferences, loaded on every squad run
- `squads/{name}/` — user-created squads (agents, build artifacts, output)
- `skills/` — Opensquad-installed skills (social publishing, image gen, etc.)
- Browser automation uses a dedicated `@playwright/mcp` server (`.mcp.json`,
  config at `_opensquad/config/playwright.config.json`) with a persistent,
  gitignored profile at `_opensquad/_browser_profile/` — the native Claude
  Code Playwright plugin must stay disabled for this to work.
- Prefer `/opensquad edit` over hand-editing squad YAML files.
