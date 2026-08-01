import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Same category list Amazon uses for its Kindle/livros store, each
 * mapped to Google Books search terms in Portuguese. These terms are
 * what the sync cron job sends to the Google Books API (`q=` param)
 * to populate the book index.
 */
const categories = [
  {
    name: "Administração, Negócios e Economia",
    slug: "administracao-negocios-economia",
    searchTerms: "administração negócios economia subject:business-economics",
  },
  {
    name: "Arte, Cinema e Fotografia",
    slug: "arte-cinema-fotografia",
    searchTerms: "arte cinema fotografia subject:art",
  },
  {
    name: "Artesanato, Casa e Estilo de Vida",
    slug: "artesanato-casa-estilo-de-vida",
    searchTerms: "artesanato decoração casa",
  },
  {
    name: "Autoajuda",
    slug: "autoajuda",
    searchTerms: "autoajuda desenvolvimento pessoal",
  },
  {
    name: "Biografias e Histórias Reais",
    slug: "biografias-historias-reais",
    searchTerms: "biografia memórias subject:biography",
  },
  {
    name: "Ciências",
    slug: "ciencias",
    searchTerms: "ciência divulgação científica subject:science",
  },
  {
    name: "Computação, Informática e Mídias Digitais",
    slug: "computacao-informatica-midias-digitais",
    searchTerms: "computação informática tecnologia subject:computers",
  },
  {
    name: "Crônicas, Humor e Entretenimento",
    slug: "cronicas-humor-entretenimento",
    searchTerms: "crônicas humor subject:humor",
  },
  {
    name: "Direito",
    slug: "direito",
    searchTerms: "direito subject:law",
  },
  {
    name: "Educação, Referência e Didáticos",
    slug: "educacao-referencia-didaticos",
    searchTerms: "educação didático subject:education",
  },
  {
    name: "Engenharia e transporte",
    slug: "engenharia-e-transporte",
    searchTerms: "engenharia transporte subject:technology-engineering",
  },
  {
    name: "Erótico",
    slug: "erotico",
    searchTerms: "romance erótico literatura erótica",
  },
  {
    name: "Esportes e Lazer",
    slug: "esportes-e-lazer",
    searchTerms: "esportes lazer",
  },
  {
    name: "Fantasia, Horror e Ficção Científica",
    slug: "fantasia-horror-ficcao-cientifica",
    searchTerms: "fantasia terror ficção científica subject:fiction",
  },
  {
    name: "Gastronomia e Culinária",
    slug: "gastronomia-e-culinaria",
    searchTerms: "culinária gastronomia receitas subject:cooking",
  },
  {
    name: "História",
    slug: "historia",
    searchTerms: "história subject:history",
  },
  {
    name: "HQs, Mangás e Graphic Novels",
    slug: "hqs-mangas-graphic-novels",
    searchTerms: "quadrinhos mangá graphic novel",
  },
  {
    name: "Infantil",
    slug: "infantil",
    searchTerms: "livro infantil crianças",
  },
  {
    name: "Jovens e Adolescentes",
    slug: "jovens-e-adolescentes",
    searchTerms: "jovens adolescentes young adult",
  },
  {
    name: "LGBTQ+",
    slug: "lgbtq",
    searchTerms: "livros LGBTQ literatura queer",
  },
  {
    name: "Literatura e ficção",
    slug: "literatura-e-ficcao",
    searchTerms: "literatura ficção subject:fiction",
  },
  {
    name: "Livros internacionais",
    slug: "livros-internacionais",
    searchTerms: "literatura estrangeira livros internacionais",
  },
  {
    name: "Medicina",
    slug: "medicina",
    searchTerms: "medicina saúde subject:medical",
  },
  {
    name: "Policial, Suspense e Mistério",
    slug: "policial-suspense-misterio",
    searchTerms: "policial suspense mistério",
  },
  {
    name: "Política, Filosofia e Ciências Sociais",
    slug: "politica-filosofia-ciencias-sociais",
    searchTerms: "política filosofia ciências sociais subject:philosophy",
  },
  {
    name: "Religião e espiritualidade",
    slug: "religiao-e-espiritualidade",
    searchTerms: "religião espiritualidade",
  },
  {
    name: "Romance",
    slug: "romance",
    searchTerms: "romance subject:romance",
  },
  {
    name: "Saúde e Família",
    slug: "saude-e-familia",
    searchTerms: "saúde família bem-estar",
  },
  {
    name: "Turismo e Guias de Viagem",
    slug: "turismo-e-guias-de-viagem",
    searchTerms: "turismo viagem guia subject:travel",
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

  const removed = await prisma.category.deleteMany({
    where: { slug: { notIn: currentSlugs } },
  });
  if (removed.count > 0) {
    console.log(`  Removidas ${removed.count} categoria(s) fora da lista atual.`);
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
