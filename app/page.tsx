import { prisma } from "@/lib/prisma";
import BookRandomizer from "@/components/BookRandomizer";
import type { CategoryDTO } from "@/types/book";

// The category dropdown needs fresh data from the DB (and the DB may
// not even be reachable at build time before Supabase is configured),
// so this route is rendered per-request rather than statically.
export const dynamic = "force-dynamic";

async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return categories;
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
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-900 mb-3">
          Não sabe o que ler? Sorteia um livro.
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Clique em &quot;Sortear livro&quot; pra receber uma sugestão
          aleatória do catálogo, ou escolhe a categoria e a quantidade antes
          de sortear.
        </p>
      </section>

      <BookRandomizer categories={categories} />
    </div>
  );
}
