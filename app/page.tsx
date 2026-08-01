import { prisma } from "@/lib/prisma";
import BookRandomizer from "@/components/BookRandomizer";
import TextType from "@/components/TextType";
import type { CategoryDTO } from "@/types/book";

// The category dropdown needs fresh data from the DB (and the DB may
// not even be reachable at build time before Supabase is configured),
// so this route is rendered per-request rather than statically.
export const dynamic = "force-dynamic";

async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const [categories, nonEmpty] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.book.groupBy({ by: ["category"] }),
    ]);

    // A category with no synced books yet would just be a dead-end
    // filter option (0 results on every draw), so it's hidden from the
    // dropdown until the sync job actually populates it.
    const namesWithBooks = new Set(nonEmpty.map((b) => b.category));
    return categories.filter((c) => namesWithBooks.has(c.name));
  } catch (error) {
    console.error("[home] Falha ao carregar categorias:", error);
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <section className="text-center mb-10">
        <TextType
          as="h1"
          className="text-3xl sm:text-4xl font-bold text-brand-900 mb-3"
          text="Não sabe o que ler? Sorteie um livro."
          typingSpeed={45}
          initialDelay={200}
          loop={false}
          showCursor
          hideCursorWhileTyping={false}
          cursorCharacter="|"
        />
        <p className="text-gray-600 max-w-xl mx-auto">
          Clique em &quot;Sortear livro&quot; pra receber uma sugestão
          aleatória do catálogo, ou escolha a categoria e a quantidade antes
          de sortear.
        </p>
      </section>

      <BookRandomizer categories={categories} />
    </div>
  );
}
