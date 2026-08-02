import { PrismaClient } from "@prisma/client";
import { fetchBooksForQuery } from "../lib/google-books";
import { isPortuguese } from "../lib/sync";

const prisma = new PrismaClient();

const TARGET_PER_CATEGORY = 60;
const MAX_PER_AUTHOR = 8;
const DELAY_BETWEEN_AUTHORS_MS = 250;
const DELAY_BETWEEN_RETRIES_MS = 600;
const RETRY_ATTEMPTS = 3;

/**
 * One-off curated population: instead of the cron's broad per-category
 * keyword search (lib/sync.ts), this walks a hand-picked list of
 * well-known/bestselling authors per category and pulls their real
 * catalog from Google Books (title/ISBN/synopsis/cover all sourced
 * from the API, never fabricated). Only the author selection is
 * curated by hand; everything else is real API data, same trust model
 * as the cron sync. Run manually: `npm run prisma:curate`.
 */
const CATEGORY_AUTHORS: Record<string, string[]> = {
  Romance: [
    "Colleen Hoover",
    "Jojo Moyes",
    "Nicholas Sparks",
    "Jane Austen",
    "Danielle Steel",
    "Nora Roberts",
    "E L James",
    "Cecelia Ahern",
    "Sylvia Day",
    "Thalita Rebouças",
    "Martha Medeiros",
    "Paula Pimenta",
  ],
  "Literatura e ficção": [
    "Machado de Assis",
    "Clarice Lispector",
    "Jorge Amado",
    "José Saramago",
    "Paulo Coelho",
    "Gabriel García Márquez",
    "Milan Kundera",
    "Fiódor Dostoiévski",
    "Liev Tolstói",
    "Franz Kafka",
    "Guimarães Rosa",
    "Graciliano Ramos",
  ],
  "Fantasia, Horror e Ficção Científica": [
    "J R R Tolkien Senhor dos Aneis",
    "George R R Martin Guerra dos Tronos",
    "J.K. Rowling",
    "Stephen King",
    "Neil Gaiman",
    "Brandon Sanderson",
    "Isaac Asimov",
    "Philip K. Dick",
    "H P Lovecraft contos",
    "Ray Bradbury",
    "Frank Herbert",
    "Sarah J. Maas",
  ],
  "Policial, Suspense e Mistério": [
    "Agatha Christie",
    "Arthur Conan Doyle",
    "Dan Brown",
    "Gillian Flynn",
    "Stieg Larsson",
    "Raphael Montes",
    "John Grisham",
    "Patricia Cornwell",
    "Harlan Coben",
    "Paula Hawkins",
    "Thomas Harris",
    "James Patterson",
  ],
  Autoajuda: [
    "Augusto Cury",
    "Napoleon Hill",
    "Dale Carnegie",
    "Rhonda Byrne",
    "Mel Robbins",
    "Brené Brown",
    "Eckhart Tolle",
    "Zíbia Gasparetto",
    "Içami Tiba",
    "James Clear",
    "Deepak Chopra",
    "Robin Sharma",
  ],
  "Administração, Negócios e Economia": [
    "Robert Kiyosaki",
    "Simon Sinek",
    "Daniel Kahneman",
    "Malcolm Gladwell",
    "Ray Dalio",
    "Jim Collins",
    "Eric Ries",
    "Peter Drucker",
    "Adam Grant",
    "Walter Isaacson",
    "Ben Horowitz",
    "Stephen Covey",
  ],
  "Biografias e Histórias Reais": [
    "Walter Isaacson",
    "Michelle Obama",
    "Barack Obama",
    "Malala Yousafzai",
    "Nelson Mandela",
    "Tara Westover",
    "Trevor Noah",
    "Anne Frank",
    "Frank McCourt",
    "Drauzio Varella",
    "Ruy Castro",
    "Laurentino Gomes",
  ],
  Infantil: [
    "Monteiro Lobato",
    "Ziraldo",
    "Ruth Rocha",
    "Eva Furnari",
    "Julia Donaldson",
    "Dr. Seuss",
    "Ana Maria Machado",
    "Pedro Bandeira",
    "Roald Dahl",
    "Tatiana Belinky",
    "Sylvia Orthof",
    "Maurice Sendak",
  ],
  "Jovens e Adolescentes": [
    "Suzanne Collins",
    "John Green",
    "Veronica Roth",
    "Cassandra Clare",
    "Rick Riordan",
    "Stephenie Meyer",
    "Thalita Rebouças",
    "Paula Pimenta",
    "Becky Albertalli",
    "Sarah Dessen",
    "Marissa Meyer",
    "Leigh Bardugo",
  ],
  "HQs, Mangás e Graphic Novels": [
    "Maurício de Sousa",
    "Alan Moore",
    "Neil Gaiman",
    "Art Spiegelman",
    "Naoki Urasawa",
    "Eiichiro Oda",
    "Masashi Kishimoto",
    "Akira Toriyama",
    "Tite Kubo",
    "Fábio Moon",
    "Marjane Satrapi",
    "Stan Lee",
  ],
  "Crônicas, Humor e Entretenimento": [
    "Luis Fernando Verissimo",
    "Martha Medeiros",
    "Rubem Alves",
    "Fernando Sabino",
    "Ziraldo",
    "Millôr Fernandes",
    "Nelson Rodrigues",
    "David Sedaris",
    "Bill Bryson",
    "Ariano Suassuna",
    "Paulo Mendes Campos",
    "Carlos Drummond de Andrade",
  ],
  "Religião e espiritualidade": [
    "Paulo Coelho",
    "Zíbia Gasparetto",
    "Chico Xavier",
    "Dalai Lama",
    "Rick Warren",
    "Eckhart Tolle",
    "Santo Agostinho",
    "C S Lewis Nárnia",
    "Thich Nhat Hanh",
    "Padre Fábio de Melo",
    "Madre Teresa de Calcutá",
    "Divaldo Franco",
  ],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface CategoryCurationResult {
  category: string;
  collected: number;
  upserted: number;
  authorsWithNoMatch: string[];
}

/**
 * Google Books' `inauthor:` search is quoted-string-hostile (wrapping
 * multi-word names in quotes returns near-empty/irrelevant results —
 * confirmed empirically) and the API itself has been observed
 * returning wildly inconsistent totals for the identical query across
 * back-to-back calls (a Google-side reliability issue, not ours).
 * Retrying a few times and merging every hit compensates for that.
 */
async function fetchAuthorBooksWithRetry(author: string) {
  const merged = new Map<string, Awaited<ReturnType<typeof fetchBooksForQuery>>[number]>();

  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const books = await fetchBooksForQuery(`inauthor:${author}`, 40);
      for (const book of books) {
        merged.set(book.googleBooksId, book);
      }
    } catch (error) {
      console.error(`  Falha ao buscar autor "${author}" (tentativa ${attempt + 1}):`, error);
    }
    await sleep(DELAY_BETWEEN_RETRIES_MS);
  }

  return Array.from(merged.values());
}

async function curateCategory(categoryName: string, authors: string[]): Promise<CategoryCurationResult> {
  const collected = new Map<string, Awaited<ReturnType<typeof fetchBooksForQuery>>[number]>();
  const authorsWithNoMatch: string[] = [];

  for (const author of authors) {
    if (collected.size >= TARGET_PER_CATEGORY) break;

    const books = await fetchAuthorBooksWithRetry(author);
    const matches = books.filter((b) => isPortuguese(b.language) && b.isbn);
    if (matches.length === 0) {
      authorsWithNoMatch.push(author);
    }

    let addedForAuthor = 0;
    for (const book of matches) {
      if (collected.size >= TARGET_PER_CATEGORY || addedForAuthor >= MAX_PER_AUTHOR) break;
      if (collected.has(book.googleBooksId)) continue;
      collected.set(book.googleBooksId, book);
      addedForAuthor += 1;
    }

    await sleep(DELAY_BETWEEN_AUTHORS_MS);
  }

  let upserted = 0;
  for (const book of collected.values()) {
    try {
      await prisma.book.upsert({
        where: { googleBooksId: book.googleBooksId },
        update: {
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          synopsis: book.synopsis,
          category: categoryName,
          language: book.language,
          ratingsCount: book.ratingsCount,
          averageRating: book.averageRating,
          coverUrl: book.coverUrl,
          publishedDate: book.publishedDate,
          source: "curated",
          lastSyncedAt: new Date(),
        },
        create: {
          googleBooksId: book.googleBooksId,
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          synopsis: book.synopsis,
          category: categoryName,
          language: book.language,
          ratingsCount: book.ratingsCount,
          averageRating: book.averageRating,
          coverUrl: book.coverUrl,
          publishedDate: book.publishedDate,
          source: "curated",
          lastSyncedAt: new Date(),
        },
      });
      upserted += 1;
    } catch (error) {
      console.error(`  [${categoryName}] Falha ao salvar "${book.title}":`, error);
    }
  }

  return { category: categoryName, collected: collected.size, upserted, authorsWithNoMatch };
}

/**
 * Optional CURATE_CATEGORIES env var ("|"-separated category names —
 * commas can't be the separator since some category names contain
 * one, e.g. "HQs, Mangás e Graphic Novels") restricts the run to
 * specific categories — useful for topping up just the categories
 * that came up thin on a previous run, without re-spending API quota
 * on ones that are already well populated.
 */
function categoriesToRun(): [string, string[]][] {
  const filter = process.env.CURATE_CATEGORIES;
  const entries = Object.entries(CATEGORY_AUTHORS);
  if (!filter) return entries;

  const wanted = new Set(filter.split("|").map((s) => s.trim()));
  return entries.filter(([categoryName]) => wanted.has(categoryName));
}

async function main() {
  const results: CategoryCurationResult[] = [];

  for (const [categoryName, authors] of categoriesToRun()) {
    console.log(`\n=== ${categoryName} ===`);
    const result = await curateCategory(categoryName, authors);
    console.log(`  Coletados: ${result.collected}, salvos: ${result.upserted}`);
    if (result.authorsWithNoMatch.length > 0) {
      console.log(`  Sem resultado em pt: ${result.authorsWithNoMatch.join(", ")}`);
    }
    results.push(result);
  }

  console.log("\n=== Resumo ===");
  for (const r of results) {
    console.log(`${r.category}: ${r.upserted}/${TARGET_PER_CATEGORY}`);
  }
}

main()
  .catch((error) => {
    console.error("Erro ao rodar curadoria:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
