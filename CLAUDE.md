# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Achei Meu Livro" — a Next.js book-recommendation site. The user hits
"Sortear livro" and gets a random book (optionally filtered by
category) with cover, synopsis, and affiliate buy buttons for Amazon,
Mercado Livre, and Shopee. Full product plan: `PLANO.md`. Setup/deploy
walkthrough: `README.md`.

Sorteio works anonymously. Signing in (name + e-mail + senha, or
Google) additionally unlocks the **estante** — a personal bookshelf at
`/estante` where sorteado books are kept on shelves ("Não lidos",
"Lidos", plus any the user creates). See "Contas e estante" below.

No book is ever manually typed in — every field (title, ISBN, cover,
synopsis) is always sourced from the Google Books API, never
fabricated. Two population paths feed the same `Book` table: the cron
job (`/api/cron/sync-books` → `lib/sync.ts`) does a broad per-category
keyword search; `prisma/curate.ts` (run manually, `npm run
prisma:curate`) instead walks a hand-picked list of well-known/popular
authors per category and pulls their real catalog via Google Books'
`inauthor:` search — curation only picks *which authors*, not the book
data itself. The randomizer queries the local Postgres index (`ORDER
BY random()`) so the user-facing path never touches the external API.
The catalog is Portuguese-only — both paths discard any item whose
`language` field isn't `pt*`; `lib/sync.ts` additionally drops the
`subject:xxx` qualifier (Google's own English genre taxonomy, which
otherwise skews results English).

`Book.category` is nullable: only 12 categories are kept in the
`Category` table (down from an original 29 modeled on Amazon's
storefront — see `prisma/seed.ts`). Books outside those 12 are left
uncategorized (`category = null`) rather than deleted, and only
surface when the frontend's category filter is left on "Todas as
categorias" — see `getCategories()` in `app/page.tsx` and the `WHERE`
clause in `app/api/random-book/route.ts`.

Google Books' `inauthor:` operator is quoted-string-hostile — wrapping
a multi-word name in quotes (`inauthor:"Jane Austen"`) returns
near-empty/irrelevant results; the working form has no quotes
(`inauthor:Jane Austen`). The API has also been observed returning
inconsistent `totalItems` for the identical query across back-to-back
calls — a Google-side reliability issue `prisma/curate.ts` compensates
for with retries, not something fixable on our end.

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build             # production build
npm run lint               # ESLint (next/core-web-vitals)
npm run typecheck           # tsc --noEmit
npx prisma validate          # validate prisma/schema.prisma without a DB connection
npx prisma migrate dev        # create/apply a migration locally (needs DATABASE_URL)
npx prisma db seed             # populate the 12 curated categories (prisma/seed.ts)
npm run prisma:curate          # one-off: populate Book via curated popular-author lists (prisma/curate.ts)
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
- **`app/estante/page.tsx`** — server component, `force-dynamic`;
  `auth()` guard then loads shelves straight from Prisma (same pattern
  as `app/page.tsx`, no GET API). Renders `EstanteView`, which owns all
  optimistic state.
- **`app/api/shelves*`, `app/api/shelf-items*`, `app/api/estante`** —
  the estante mutations. All start with `requireUserId()` and validate
  with `zod`, returning `{ error, details: parsed.error.flatten() }` on
  400 like `random-book` does.
- **`app/api/signup/route.ts`** — sits outside `/api/auth/*` so it can
  never collide with the `[...nextauth]` catch-all. Caps the password
  at 72 bytes because bcrypt truncates silently past that.
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
- **`prisma/curate.ts`** — one-off script, not wired to any route or
  cron. `CATEGORY_AUTHORS` maps each of the 12 kept categories to a
  hand-picked author list; for each author it queries Google Books'
  `inauthor:` search (unquoted — see note above), filters to `pt*` +
  has-ISBN, caps how many books one author can contribute
  (`MAX_PER_AUTHOR`), and upserts with `source: "curated"`. Idempotent
  — safe to rerun to top up thin categories.
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
- **`prisma/schema.prisma`** — `Book` (populated by the cron sync or
  `prisma/curate.ts`, never hand-entered; `category` nullable, see
  above), `Category` (the 12 kept categories — drives both the Google
  Books search terms and the frontend filter dropdown), `AffiliateLink`
  (click counters only — URLs are never persisted, always rebuilt on
  demand), plus the accounts/estante models described below.

Env vars are documented inline in `.env.example`; the site runs with
just `DATABASE_URL`/`CRON_SECRET`/`AUTH_SECRET` set — affiliate tag
vars and the Google OAuth pair are optional and degrade gracefully
(plain non-monetized search links; no "Continuar com Google" button).

## Contas e estante

Auth is **NextAuth/Auth.js v5** (`next-auth@5.0.0-beta.x`) with
`@auth/prisma-adapter`, split across two files for a reason:

- **`auth.config.ts`** is edge-safe and must never import
  `@/lib/prisma`, the adapter, or `bcryptjs`. It holds the Google
  provider (registered only when `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`
  are both set — `hasGoogleProvider` is exported so the login page can
  hide a button that would otherwise 500) and the jwt/session callbacks.
- **`auth.ts`** is Node-only: adapter, Credentials provider (bcrypt cost
  10, with a dummy-hash compare on the not-found branch so `/entrar`
  can't be used to enumerate registered e-mails), and the
  `events.createUser` hook.

Session strategy is **JWT**, forced by the Credentials provider. The
`Session`/`VerificationToken` tables therefore stay empty — they exist
only because the adapter's TypeScript contract requires them. Google
sign-ins still write `User` and `Account` rows (the adapter's
createUser/linkAccount run regardless of session strategy), which is
what gives shelves a stable `User.id` to hang off.

There is deliberately **no `middleware.ts`**. Middleware would sit in
front of every request including `/go/[bookId]/[store]` (the
monetization path) and `/api/cron/sync-books`; a wrong matcher breaks
those silently. The real boundary is `await auth()` in
`app/estante/page.tsx` plus `requireUserId()` (`lib/auth-guard.ts`) at
the top of every `/api` handler that touches user data.

Estante model, in `prisma/schema.prisma`:

- `Shelf.kind` (`UNREAD | READ | CUSTOM`) — **not the name** — is the
  stable identity of the two default shelves. `ensureDefaultShelves()`
  in `lib/shelves.ts` keys on `kind` so a user who renames "Não lidos"
  to "Fila" never gets a duplicate recreated. It is called from three
  places, all required: `events.createUser` (Google path),
  `/api/signup` (credentials path bypasses the adapter entirely), and
  `/estante` (defensive).
- `ShelfItem` has `@@unique([userId, bookId])`, which is what enforces
  "a book lives on exactly one shelf". Adding and moving are therefore
  the *same* operation — `POST /api/shelf-items` upserts and reassigns
  `shelfId`.
- `ShelfItem` keeps both a `bookId` FK (nullable, `onDelete: SetNull`)
  **and** a title/author/cover snapshot. Nothing deletes `Book` rows
  today (`lib/sync.ts` only upserts), but if that ever changed the
  user's shelf degrades to a spine that still renders instead of
  silently losing books.
- Deleting a custom shelf moves its books to "Não lidos" inside a
  transaction *before* the delete — the schema's `onDelete: Cascade`
  would otherwise destroy them.
- `User.libraryTitle` is nullable on purpose: null means "not
  customized", and `resolveLibraryTitle()` derives "Estante do {first
  name}" so the heading keeps following `User.name` until overridden.

Ownership is always expressed inside the Prisma `where` alongside
`userId` (`updateMany`/`deleteMany`/`findFirst`), never as a
fetch-then-compare in JS — that pattern is an IDOR one refactor away.
Cross-user attempts return 404.

## UI: reactbits, tema e a estante

Visual components come from **reactbits.dev**, vendored into
`components/reactbits/`. They are NOT installed with the shadcn CLI:
`shadcn@latest` is v3.x and targets Tailwind v4, while this repo is
Tailwind v3 with a v2-era `components.json`, so the CLI may try to
rewrite `tailwind.config.ts`/`globals.css`. Instead the registry JSON
is fetched directly (`https://reactbits.dev/r/{Name}-TS-TW.json`) and
`files[0].content` is written out by hand. Two things must be done to
every file pulled that way:

1. **Prepend `"use client";`** — reactbits ships without it, and the
   first Server Component that imports one fails with "useRef only
   works in a Client Component". `components/TextType.tsx` (vendored
   earlier, by hand) has the same fix.
2. Check for hardcoded dark-only colors. `SpotlightCard` shipped with
   `border-neutral-800 bg-neutral-900`; it was edited to use
   `border-border bg-card` so it follows the theme.

Not installed, on purpose: `Beams`/`Silk` (need
`@react-three/fiber@^9`, which requires React 19 — this repo is 18.3),
`PillNav` (`react-router-dom`), `CardNav`/`Carousel` (`react-icons`,
duplicating lucide), `ScrollStack` (`lenis` hijacks global scroll),
`StarBorder` (hardcoded black gradient + needs extra keyframes),
`TiltedCard` (raw `<img>`, bypassing `next/image` and the
`remotePatterns` whitelist in `next.config.mjs`).

`AnimatedContent`/`FadeContent` start at `opacity: 0` and reveal via
gsap ScrollTrigger. That means anything below the fold stays invisible
until scrolled to — correct behavior, but it makes a freshly created
shelf look like a failed click, so `EstanteView` scrolls the new shelf
into view after creating it. Keep that in mind before wrapping
above-the-fold or dynamically-added content in either of them.

Theme is `next-themes` with `attribute="class"`, provided by
`components/providers.tsx` (which also holds `SessionProvider`) so
`app/layout.tsx` stays a server component. `<html>` needs
`suppressHydrationWarning`. Notes on the token system in
`app/globals.css`:

- The old unlayered `body { @apply bg-gradient-to-b from-brand-50 ... }`
  was removed. Unlayered CSS always beats `@layer base`, so it was
  overriding `bg-background` and pinning the page light. The gradient is
  now `--page-from`/`--page-to` vars inside `@layer base`.
- Tailwind colors here are bare `var(--x)` with no `<alpha-value>`
  placeholder, so **opacity modifiers silently do nothing**
  (`bg-card/70` renders fully opaque). Translucent surfaces use a
  dedicated var carrying its own alpha — see `--surface-translucent`,
  used by the header's frosted-glass effect.
- `--wood-top`/`--wood-face`/`--wood-edge`/`--shelf-back` drive the
  bookshelf furniture, which is hand-built CSS (`ShelfPlank`,
  `Bookcase`) — reactbits has no bookshelf.
- Third-party brand colors (Amazon `#131921`, Mercado Livre `#FFE600`)
  are left alone; Amazon's near-black just gets `dark:ring-1` so it
  doesn't vanish against the dark page.

Book spines derive color, width and height from a **hash of the item
id** (`lib/spine.ts`), never `Math.random()` — spines are
server-rendered real content, so a random value would break hydration.
Spine titles use `writing-mode: vertical-rl`, which screen readers
handle unreliably, so each spine is a real `<button>` with an
`aria-label` in normal reading order.

Movement between shelves animates via motion's `layoutId` on
`BookSpine` (shared across both `AnimatePresence` lists, so a move is
one continuous element). On the home page the destination shelf isn't
on screen, so `FlyToShelf` portals a cover that flies to the "Minha
estante" header link instead. Everything gates on `useReducedMotion()`.

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
