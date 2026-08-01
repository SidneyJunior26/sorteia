import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 12 categorias mais populares/genéricas, reduzidas a partir da lista
 * original de 29 (que espelhava as categorias da Amazon). Livros que
 * não se encaixam bem em nenhuma delas ficam sem categoria
 * (Book.category = null) e só aparecem no sorteio quando nenhum
 * filtro de categoria é aplicado. searchTerms ainda alimenta o cron
 * de sync (/api/cron/sync-books) para essas 12.
 */
const categories = [
  {
    name: "Romance",
    slug: "romance",
    searchTerms: "romance subject:romance",
  },
  {
    name: "Literatura e ficção",
    slug: "literatura-e-ficcao",
    searchTerms: "literatura ficção subject:fiction",
  },
  {
    name: "Fantasia, Horror e Ficção Científica",
    slug: "fantasia-horror-ficcao-cientifica",
    searchTerms: "fantasia terror ficção científica subject:fiction",
  },
  {
    name: "Policial, Suspense e Mistério",
    slug: "policial-suspense-misterio",
    searchTerms: "policial suspense mistério",
  },
  {
    name: "Autoajuda",
    slug: "autoajuda",
    searchTerms: "autoajuda desenvolvimento pessoal",
  },
  {
    name: "Administração, Negócios e Economia",
    slug: "administracao-negocios-economia",
    searchTerms: "administração negócios economia subject:business-economics",
  },
  {
    name: "Biografias e Histórias Reais",
    slug: "biografias-historias-reais",
    searchTerms: "biografia memórias subject:biography",
  },
  {
    name: "Infantil",
    slug: "infantil",
    searchTerms: "livro infantil crianças",
  },
  {
    name: "Jovens e Adolescentes",
    slug: "jovens-e-adolescentes",
    searchTerms: "jovens adolescentes literatura juvenil",
  },
  {
    name: "HQs, Mangás e Graphic Novels",
    slug: "hqs-mangas-graphic-novels",
    searchTerms: "quadrinhos mangá graphic novel",
  },
  {
    name: "Crônicas, Humor e Entretenimento",
    slug: "cronicas-humor-entretenimento",
    searchTerms: "crônicas humor subject:humor",
  },
  {
    name: "Religião e espiritualidade",
    slug: "religiao-e-espiritualidade",
    searchTerms: "religião espiritualidade",
  },
];

const currentSlugs = categories.map((c) => c.slug);

async function main() {
  console.log("Seeding categories...");

  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        searchTerms: category.searchTerms,
      },
      create: category,
    });
    console.log(`  ✓ ${result.name} (${result.slug})`);
  }

  const removedCategories = await prisma.category.findMany({
    where: { slug: { notIn: currentSlugs } },
    select: { name: true },
  });

  if (removedCategories.length > 0) {
    const removedNames = removedCategories.map((c) => c.name);

    // Books tagged with a category that's leaving the curated list
    // don't get deleted — they just become uncategorized, so they
    // still surface when no category filter is applied.
    const { count: uncategorized } = await prisma.book.updateMany({
      where: { category: { in: removedNames } },
      data: { category: null },
    });

    const { count: removed } = await prisma.category.deleteMany({
      where: { slug: { notIn: currentSlugs } },
    });

    console.log(`  Removidas ${removed} categoria(s) fora da lista atual.`);
    console.log(`  ${uncategorized} livro(s) ficaram sem categoria.`);
  }

  console.log("Seed concluído.");
}

main()
  .catch((error) => {
    console.error("Erro ao rodar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
