# Sistema de Livros — Plano do Projeto

## 1. Ideia

Site de recomendação de livros. O usuário chega sem saber o que ler e pode:

- Clicar em **"Sortear livro"** e receber um livro aleatório de todo o catálogo.
- Filtrar por **categoria** (ex: Filosofia, Culinária, Ficção) e sortear um aleatório dentro dela.

Cada livro sorteado mostra capa, título, autor, sinopse breve e botões de compra para Amazon, Mercado Livre e Shopee. Cada botão redireciona para a página do produto **com o código de afiliado**, gerando comissão.

## 2. Decisões já tomadas

- Catálogo **alimentado automaticamente** por fonte externa (nada de cadastro manual, catálogo grande demais pra isso).
- Ainda sem cadastro de afiliado em nenhuma loja — pré-requisito antes do lançamento.
- Hospedagem gratuita no início, com caminho de migração quando gerar receita.

## 3. Catálogo automático — como puxar os livros

Analisei as opções de fonte de dados. Resumo direto:

| Fonte | Catálogo | Custo | Trava |
|---|---|---|---|
| **Google Books API** (recomendada) | Milhões de títulos, inclui lançamentos recentes | Grátis | Cota de ~1.000 requisições/dia (dá pra pedir aumento; suficiente pra um job de sincronização, não pra tráfego direto do usuário) |
| Open Library API | Grande, bom complemento pra ISBN/capas | Grátis, sem cota agressiva | Metadados às vezes incompletos |
| Amazon PA-API (catálogo da própria Amazon) | O maior de todos | Grátis, mas... | **Só libera acesso depois de 3 vendas via seu link em 180 dias, e exige 10 vendas a cada 30 dias pra continuar ativo.** Ou seja: não dá pra usar antes de já ter vendas — inviável pra popular o catálogo no lançamento. |

**Decisão:** usar Google Books API como fonte principal (às vezes complementando com Open Library), não a Amazon PA-API. A Amazon fica só como uma das lojas de destino do link de afiliado, não como fonte de dados.

### Por que não é 100% "sem banco"?

Nem Google Books nem Open Library têm um endpoint de "me dê 1 livro aleatório da categoria X" — dá pra buscar por categoria, mas não sortear de forma barata direto na API a cada clique. Solução:

- Um **job automático (cron)** roda periodicamente (ex: 1x por dia) e busca, por categoria, títulos novos/populares na Google Books API.
- Esses resultados (id, título, autor, categoria, ISBN, sinopse, capa) são salvos num **índice próprio, leve, no banco** — não é cadastro manual, é cache automático.
- O sorteio consulta esse índice (`ORDER BY random()`), rápido e sem depender da API na hora do clique do usuário.
- Como o job roda de novo periodicamente, lançamentos novos entram sozinhos no índice sem você tocar em nada.

Ou seja: você continua "tendo uma base própria" (pra sorteio ser rápido), mas ela se **auto-alimenta** via API, igual você queria — nada de portal de cadastro manual.

## 4. Stack recomendada

| Camada | Ferramenta | Por quê |
|---|---|---|
| Frontend + Backend | Next.js (App Router) | Um projeto só faz site e API; free tier generoso |
| Hospedagem | Vercel (plano free) | Deploy gratuito direto do GitHub, HTTPS |
| Banco de dados | Supabase (Postgres free tier) | Guarda o índice sincronizado automaticamente; grátis até ~500MB |
| ORM | Prisma | Facilita consultas e migração de schema |
| Job de sincronização | Vercel Cron Jobs (grátis no plano free, execução periódica) | Roda a rotina que busca livros novos na Google Books API e atualiza o índice |

## 5. Modelo de dados

**books** (índice sincronizado automaticamente, não cadastro manual)
- id, google_books_id, isbn, title, author, synopsis, category, cover_url, published_date, source, last_synced_at

**categories**
- id, name, slug (Filosofia, Culinária, Ficção, Autoajuda, etc.) — mapeadas para os termos de busca da Google Books API

**affiliate_links** (gerados, não um por livro salvo manualmente — ver seção 6)
- id, book_id, store, url_pattern_usado, clicks (contador)

## 6. Como funciona o sorteio

- "Sortear livro" (sem categoria): consulta `ORDER BY random() LIMIT 1` no índice já sincronizado.
- Sorteio por categoria: mesma query filtrando por `category`.
- Evitar repetir o último livro mostrado (guardar no histórico da sessão, opcional).

## 7. Links de afiliado — realidade de cada loja

Aqui a automação varia por loja porque cada uma tem regras próprias. Analisei as três:

**Amazon** — depois de aprovado no Amazon Associados, não precisa de API nenhuma pra gerar link. Um link de busca já serve: `amazon.com.br/s?k={título}+{autor}&tag=SEU-CODIGO-20`. Isso já rastreia comissão, não exige casar o produto exato. (PA-API existe pra pegar produto exato, mas como vimos, só libera depois de já ter vendas — fica pra uma fase futura, não pro MVP.)

**Shopee** — tem uma API oficial de afiliados (depois de aprovado no programa) com um endpoint (`generateShortLink`) que transforma qualquer URL — inclusive uma busca — num link curto já rastreado com seu código. Totalmente automatizável.

**Mercado Livre** — é a mais limitada das três. Não existe uma API pública simples de geração de link pra qualquer afiliado; a API de afiliados oficial é liberada principalmente pra quem já tem alto volume (o próprio ML menciona algo como 500+ cliques/dia). No começo, o caminho realista é gerar o formato de link de afiliado uma vez manualmente no portal deles, entender o padrão da URL, e replicar esse padrão programaticamente pros demais livros — ou simplesmente deixar o Mercado Livre pra uma segunda fase, começando só com Amazon + Shopee.

**Como isso entra no sistema:** a rota `/go/{book_id}/{loja}` (já prevista no plano original) monta esse link na hora do clique — busca título/autor do livro no índice, aplica o padrão de cada loja, registra o clique e redireciona. Nenhum link fica "hardcoded" por livro.

## 8. Pré-requisitos antes de lançar

- Aprovação no Amazon Associados e no programa de afiliados da Shopee (Mercado Livre pode entrar depois).
- Job de sincronização rodando e populando o índice com um volume mínimo por categoria (sugestão: 15–20 títulos por categoria antes de abrir ao público, pra sorteio não repetir demais).

## 9. Ordem sugerida de construção

1. ✅ **Feito** — Estrutura do projeto Next.js + banco (schema `books`/`categories`/`affiliate_links` em `prisma/schema.prisma`).
2. ✅ **Feito** — Job de sincronização com a Google Books API por categoria, populando o índice (`app/api/cron/sync-books/route.ts`, `lib/sync.ts`, `lib/google-books.ts`, protegido por `CRON_SECRET`).
3. ✅ **Feito** — Página inicial com botão de sorteio aleatório (`app/page.tsx`, `components/BookRandomizer.tsx`, `app/api/random-book/route.ts`).
4. ✅ **Feito** — Página/componente de resultado do livro (capa, sinopse, botões de loja) — `components/BookResult.tsx`.
5. ✅ **Feito** — Filtro por categoria (select em `BookRandomizer.tsx`, param `?category=` na API, seed de 10 categorias em `prisma/seed.ts`).
6. ✅ **Feito** — Rota `/go/{book_id}/{loja}` que monta o link e conta cliques (`app/go/[bookId]/[store]/route.ts`, `lib/affiliate.ts`). Amazon e Mercado Livre com fallback funcional sem credencial; Shopee com seam isolado (`getShopeeAffiliateLink()`) pra plugar a API `generateShortLink` real depois.
7. 🔲 **Pendente (você)** — Deploy na Vercel + banco Supabase + cron job agendado. Config já pronta (`vercel.json`, `.env.example`, README com passo a passo) — falta criar o projeto Supabase, rodar `prisma migrate deploy`/seed, e fazer o deploy de fato.
8. 🔲 **Pendente (você)** — Cadastro nos programas de afiliado (Amazon Associados, Shopee Afiliados) e troca do `tag`/código placeholder pelo real via env vars (`AMAZON_ASSOC_TAG`, `SHOPEE_APP_ID`/`SECRET`/`AFFILIATE_ID`, `MERCADOLIVRE_LINK_PATTERN`).

## 10. Caminho de crescimento (pós-validação)

Quando o site começar a gerar receita e volume de vendas: solicitar acesso à Amazon PA-API (pra casar produto exato em vez de link de busca), buscar acesso à API de afiliados de alto volume do Mercado Livre, migrar de planos free para pagos (mais banda, banco maior), SEO para tráfego orgânico, newsletter.
