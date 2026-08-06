import { prisma } from "@/lib/prisma";
import BookRandomizer from "@/components/BookRandomizer";
import TextType from "@/components/TextType";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import BlurText from "@/components/reactbits/BlurText";
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
          className="text-3xl sm:text-4xl font-bold text-brand-900 dark:text-brand-100 mb-3"
          text="Não sabe o que ler? Sorteie um livro."
          typingSpeed={45}
          initialDelay={200}
          loop={false}
          showCursor
          hideCursorWhileTyping={false}
          cursorCharacter="|"
        />
        <BlurText
          text='Clique em "Sortear livro" pra receber uma sugestão aleatória do catálogo, ou escolha a categoria e a quantidade antes de sortear.'
          delay={28}
          animateBy="words"
          direction="top"
          className="text-muted-foreground max-w-xl mx-auto justify-center"
        />
      </section>

      {/* Below the fold on most viewports, so AnimatedContent's
          ScrollTrigger entrance reads as intentional rather than as a
          flash of the hero repainting. */}
      <AnimatedContent distance={40} duration={0.6} threshold={0.15}>
        <section className="text-center mb-8 max-w-xl mx-auto">
          <h2 className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-1">
            Por que sortear em vez de escolher?
          </h2>
          <p className="text-sm text-muted-foreground">
            Escolher entre milhares de livros trava mais do que ajuda — é o
            próprio motivo de você não saber o que ler. Aqui você sorteia um
            livro real, com sinopse e onde comprar na hora. Sem pesquisa,
            sem decisão, sem demora.
          </p>
        </section>
      </AnimatedContent>

      <BookRandomizer categories={categories} />
    </div>
  );
}
