# Achei Meu Livro

Site de recomendação de livros: sorteia um livro aleatório (de todo o
catálogo ou por categoria) e mostra botões de compra para Amazon,
Mercado Livre e Shopee, com rastreamento de clique via link de
afiliado. Ver `PLANO.md` para o plano de produto completo.

## Stack

- **Next.js 14 (App Router) + TypeScript** — frontend e backend
- **Tailwind CSS** — estilização
- **PostgreSQL (Supabase, free tier)** — banco de dados
- **Prisma** — ORM e migrações
- **Vercel** — hospedagem (free tier) + Vercel Cron Jobs para o job de sync
- **Google Books API** — fonte automática do catálogo de livros

Nenhum livro é cadastrado manualmente: um job de sincronização
(`/api/cron/sync-books`) busca livros por categoria na Google Books
API e mantém um índice próprio no banco. O sorteio consulta esse
índice localmente (`ORDER BY random()`), sem depender da API externa
no clique do usuário.

## Estrutura do projeto

```
app/
  page.tsx                        Página inicial (sorteio + filtro por categoria)
  layout.tsx / globals.css        Layout raiz e estilos globais
  api/random-book/route.ts        GET — sorteia um livro do índice (com filtro opcional)
  api/cron/sync-books/route.ts    GET — job de sync (protegido por CRON_SECRET)
  go/[bookId]/[store]/route.ts    GET — monta o link de afiliado, conta o clique, redireciona (302)
components/
  BookRandomizer.tsx              Client component: botão de sortear + seletor de categoria
  BookResult.tsx                  Exibe capa, título, autor, sinopse e botões de loja
lib/
  prisma.ts                       Singleton do Prisma Client
  google-books.ts                 Fetch + normalização de resultados da Google Books API
  sync.ts                         Orquestra o sync por categoria (upsert no banco)
  sanitize.ts                     Remove HTML da sinopse antes de salvar (anti-XSS)
  affiliate.ts                    Monta URL de afiliado por loja (Amazon/Shopee/Mercado Livre)
prisma/
  schema.prisma                   Modelos Book, Category, AffiliateLink
  seed.ts                         Popula as ~10 categorias iniciais
types/book.ts                     Tipos compartilhados (BookDTO, CategoryDTO)
vercel.json                       Config do Vercel Cron (chama /api/cron/sync-books 1x/dia)
```

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha pelo menos `DATABASE_URL` (veja seção Supabase abaixo). As
demais (`GOOGLE_BOOKS_API_KEY`, `AMAZON_ASSOC_TAG`,
`SHOPEE_*`, `MERCADOLIVRE_LINK_PATTERN`) podem ficar vazias — o site
funciona com fallbacks (ver seção de afiliados mais abaixo).

`CRON_SECRET` deve ser preenchido com uma string aleatória longa
mesmo em dev, se você for testar o endpoint `/api/cron/sync-books`
manualmente (ele recusa qualquer chamada sem o header correto).

### 3. Criar o banco (Supabase)

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com)
   (free tier).
2. No painel do projeto, vá em **Project Settings → Database**.
3. Copie a **Connection string** no modo *Transaction* (porta 6543,
   com `pgbouncer=true`) para `DATABASE_URL`.
4. Copie a **Connection string** no modo *Session/Direct* (porta
   5432) para `DIRECT_URL` — usada pelo Prisma só durante as
   migrações, não em runtime.

### 4. Rodar as migrações e popular as categorias

```bash
npx prisma migrate dev
npx prisma db seed
```

Isso cria as tabelas (`Book`, `Category`, `AffiliateLink`) e insere as
~10 categorias iniciais (Filosofia, Culinária, Ficção, Autoajuda,
Romance, Fantasia, Biografia, História, Negócios, Autoconhecimento),
cada uma já com termos de busca em português mapeados para a Google
Books API.

### 5. Popular o índice de livros

Com o servidor de dev rodando (`npm run dev`), chame o endpoint de
sync manualmente (ele exige o header de autenticação com o mesmo
valor de `CRON_SECRET` do seu `.env`):

```bash
curl -H "Authorization: Bearer SEU_CRON_SECRET_AQUI" \
  http://localhost:3000/api/cron/sync-books
```

Isso busca ~20-30 títulos por categoria na Google Books API e salva
no banco. Rode de novo a qualquer momento para atualizar o índice —
livros já existentes (mesmo `google_books_id`) são atualizados
(upsert), nunca duplicados.

### 6. Rodar o site

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Sanity checks disponíveis sem banco configurado

Estes comandos não dependem de uma conexão real com o Postgres:

```bash
npx prisma validate   # valida prisma/schema.prisma
npx tsc --noEmit       # typecheck completo
npm run build          # build de produção do Next.js
npm run lint            # ESLint
```

## Deploy na Vercel

1. Suba o repositório para o GitHub/GitLab e importe o projeto na
   [Vercel](https://vercel.com/new).
2. Em **Settings → Environment Variables**, configure todas as
   variáveis do `.env.example` (`DATABASE_URL`, `DIRECT_URL`,
   `GOOGLE_BOOKS_API_KEY`, `CRON_SECRET`, e as de afiliado quando
   disponíveis).
3. Faça o deploy. O build roda `prisma generate` automaticamente
   (script `postinstall`).
4. Depois do primeiro deploy, rode as migrações contra o banco de
   produção (a partir da sua máquina, apontando `DATABASE_URL`/
   `DIRECT_URL` para o Supabase de produção):
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
5. Dispare o sync uma vez manualmente (mesmo `curl` da seção acima,
   trocando a URL local pela URL de produção) para garantir volume
   mínimo (15-20 títulos por categoria) **antes** de divulgar o site.

### Como o Vercel Cron + CRON_SECRET funcionam juntos

O `vercel.json` já declara o cron:

```json
{
  "crons": [{ "path": "/api/cron/sync-books", "schedule": "0 6 * * *" }]
}
```

Isso agenda uma chamada `GET /api/cron/sync-books` todo dia às 06:00
UTC. A Vercel, ao disparar um cron job, envia automaticamente o header
`Authorization: Bearer <CRON_SECRET>` **desde que a env var
`CRON_SECRET` esteja configurada no projeto** — é assim que a rota
sabe distinguir uma chamada legítima do cron de uma chamada de
qualquer visitante tentando acessar a URL diretamente. Sem o
`CRON_SECRET` configurado, a rota responde `500` e recusa rodar (por
segurança, nunca roda "aberta"). Se o header não bater com o valor
configurado, ela responde `401`.

Sem esse controle, qualquer pessoa que descobrisse a URL do endpoint
poderia disparar o job repetidamente e estourar a cota diária gratuita
da Google Books API.

## Quando for aprovado no Amazon Associados / Shopee Afiliados

O sistema já funciona hoje **sem** nenhuma aprovação de afiliado — os
botões de compra levam para uma busca funcional em cada loja, só que
sem gerar comissão ainda. Quando as aprovações saírem, troque só as
env vars — não é necessário alterar código para Amazon e Mercado
Livre:

### Amazon Associados

1. Depois de aprovado, pegue sua **tracking ID** (algo como
   `meusite-20`).
2. Configure `AMAZON_ASSOC_TAG=meusite-20` no `.env` (local) e nas
   env vars do projeto na Vercel (produção).
3. Pronto — `lib/affiliate.ts` (`getAmazonLink`) já adiciona
   automaticamente `&tag=meusite-20` em todo link gerado. Nenhuma
   mudança de código necessária.

### Mercado Livre

1. Gere manualmente, uma vez, um link de afiliado no portal deles
   para entender o padrão de URL que eles usam para sua conta.
2. Configure `MERCADOLIVRE_LINK_PATTERN` com esse padrão, substituindo
   a parte da busca/produto pelo placeholder literal `{query}`, por
   exemplo:
   ```
   MERCADOLIVRE_LINK_PATTERN="https://lista.mercadolivre.com.br/{query}?matt_word=SEUCODIGO&matt_tool=XXXXX"
   ```
3. `lib/affiliate.ts` (`getMercadoLivreLink`) interpola esse padrão
   automaticamente. Nenhuma mudança de código necessária.

### Shopee Afiliados

Shopee exige uma chamada de API assinada (`generateShortLink`) para
gerar link rastreado — não é só uma env var. Quando você for aprovado:

1. Configure `SHOPEE_AFFILIATE_ID`, `SHOPEE_APP_ID` e
   `SHOPEE_APP_SECRET` nas env vars.
2. Abra `lib/affiliate.ts` e vá até a função `getShopeeAffiliateLink()`
   — ela já está isolada exatamente para esse propósito, com um
   comentário `TODO` marcando onde plugar a chamada real: hoje ela só
   monta a URL de fallback (busca em `shopee.com.br/search`); a
   chamada à API oficial de afiliados da Shopee (mutation
   `generateShortLink`, assinada com `SHOPEE_APP_ID`/
   `SHOPEE_APP_SECRET`) precisa ser adicionada ali, retornando o link
   curto gerado no lugar do fallback.
3. Até essa integração ser feita, o botão da Shopee continua
   funcionando (leva para a busca), só não gera comissão ainda.

## Limitações conhecidas (MVP)

- **Sem rate limiting no `/go/{bookId}/{loja}`**: a rota não tem
  proteção contra abuso/spam de cliques (ex.: rate limit por IP). Para
  o volume esperado no MVP isso é aceitável; se necessário no futuro,
  adicionar um rate limit (ex.: Upstash Redis + `@upstash/ratelimit`,
  compatível com edge) sem reescrever a lógica de redirecionamento.
- **Sem histórico de "não repetir o último livro" entre sessões**: o
  frontend evita repetir o último livro sorteado *durante a sessão
  atual* (passa `exclude` para a API), mas isso não persiste entre
  visitas — não há cookie/sessão de longo prazo, por design (sem
  login, sem tracking de usuário).
- **Cota da Google Books API**: sem `GOOGLE_BOOKS_API_KEY`, o sync usa
  a cota compartilhada/anônima, suficiente para o job diário mas não
  recomendado a longo prazo. Configure uma chave assim que possível.

## Segurança — o que já está implementado

- **Sem SQL injection**: o sorteio usa `prisma.$queryRaw` com
  *tagged templates* (`Prisma.sql` / `Prisma.join`), nunca
  concatenação de string — o valor de categoria/exclude vem sempre
  como parâmetro vinculado.
- **Sem open redirect**: `/go/[bookId]/[store]` valida `store` contra
  um enum whitelisted (`AMAZON | SHOPEE | MERCADO_LIVRE`) via Zod
  antes de qualquer coisa; a URL de destino é sempre montada
  server-side a partir de um template fixo por loja
  (`lib/affiliate.ts`), nunca a partir de input do usuário.
- **Sanitização de conteúdo externo**: a sinopse vinda da Google Books
  API passa por `stripHtml()` antes de ser salva no banco — nenhuma
  tag HTML crua é persistida ou renderizada.
- **Cron protegido por secret**: `/api/cron/sync-books` exige
  `Authorization: Bearer ${CRON_SECRET}`, responde `401`/`500` caso
  contrário.
- **Segredos via env var**: nenhuma chave/token no código;
  `.env` está no `.gitignore`; `.env.example` só tem placeholders.
- **Validação de input com Zod**: todos os route params/query strings
  de `/api/random-book` e `/go/[bookId]/[store]` são validados com
  Zod antes de tocar o banco.
- **Headers de segurança**: `next.config.mjs` define
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` e `X-XSS-Protection` em todas as rotas.
- **`next/image` com allowlist**: `remotePatterns` só libera domínios
  de capa da Google Books (`books.google.com`,
  `*.googleusercontent.com`) — nenhum host remoto arbitrário é aceito.
