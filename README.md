# Achei Meu Livro

Site de recomendação de livros: sorteia um livro aleatório (de todo o
catálogo ou por categoria) e mostra botões de compra para Amazon,
Mercado Livre e Shopee, com rastreamento de clique via link de
afiliado. Ver `PLANO.md` para o plano de produto completo.

O sorteio funciona sem login. Criando conta (nome, e-mail e senha, ou
Google), o usuário ganha uma **estante** em `/estante`: os livros
sorteados vão pra prateleira "Não lidos" por padrão, e ele pode mover
entre "Lidos", criar prateleiras próprias e renomear tudo.

## Stack

- **Next.js 14 (App Router) + TypeScript** — frontend e backend
- **Tailwind CSS** — estilização, com tema claro/escuro via `next-themes`
- **react-bits** — componentes visuais/animados (vendorizados em `components/reactbits/`)
- **NextAuth / Auth.js v5** — cadastro e login (e-mail + senha, e Google opcional)
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
auth.config.ts                    Metade edge-safe do NextAuth (Google opcional, callbacks)
auth.ts                           Metade Node (Prisma adapter, credenciais + bcrypt)
app/
  page.tsx                        Página inicial (sorteio + filtro por categoria)
  layout.tsx / globals.css        Layout raiz, tokens de tema claro/escuro
  entrar/ cadastrar/              Login e cadastro
  estante/page.tsx                Estante do usuário (protegida por auth())
  api/random-book/route.ts        GET — sorteia um livro do índice (com filtro opcional)
  api/cron/sync-books/route.ts    GET — job de sync (protegido por CRON_SECRET)
  api/auth/[...nextauth]/         Handlers do NextAuth
  api/signup/route.ts             POST — cria conta (zod + bcrypt) e as prateleiras padrão
  api/shelves*/ api/shelf-items*/ CRUD de prateleiras e de livros na estante
  api/estante/route.ts            PATCH — renomeia o título da estante
  go/[bookId]/[store]/route.ts    GET — monta o link de afiliado, conta o clique, redireciona (302)
components/
  BookRandomizer.tsx              Client component: botão de sortear + seletor de categoria
  BookResult.tsx                  Exibe capa, título, autor, sinopse e botões de loja
  AddToShelfButton.tsx            "Guardar na estante" no resultado do sorteio
  AuthNav.tsx / ThemeToggle.tsx   Header: conta e tema claro/escuro
  providers.tsx                   SessionProvider + ThemeProvider (mantém o layout server-side)
  estante/                        Marcenaria da estante (Bookcase, ShelfPlank, BookSpine...)
  reactbits/                      Componentes do reactbits.dev vendorizados
lib/
  prisma.ts                       Singleton do Prisma Client
  google-books.ts                 Fetch + normalização de resultados da Google Books API
  sync.ts                         Orquestra o sync por categoria (upsert no banco)
  sanitize.ts                     Remove HTML da sinopse antes de salvar (anti-XSS)
  affiliate.ts                    Monta URL de afiliado por loja (Amazon/Shopee/Mercado Livre)
  auth-guard.ts                   requireUserId() usado por toda rota /api de usuário
  shelves.ts                      Prateleiras padrão + título derivado da estante
  spine.ts                        Cor/largura/altura da lombada, derivadas por hash do id
prisma/
  schema.prisma                   Book, Category, AffiliateLink, User/Account/Session, Shelf, ShelfItem
  seed.ts                         Popula as 12 categorias curadas
types/                            Tipos compartilhados (book.ts, shelf.ts, next-auth.d.ts)
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

Preencha pelo menos `DATABASE_URL` (veja seção Supabase abaixo) e
`AUTH_SECRET`. As demais (`GOOGLE_BOOKS_API_KEY`, `AMAZON_ASSOC_TAG`,
`SHOPEE_*`, `MERCADOLIVRE_LINK_PATTERN`) podem ficar vazias — o site
funciona com fallbacks (ver seção de afiliados mais abaixo).

`AUTH_SECRET` **não é opcional** desde que o login existe. Sem ele,
`auth()` levanta `MissingSecret`, e como o cabeçalho consulta a sessão
em toda página isso derruba o site inteiro, não só a estante. Gere com:

```bash
openssl rand -base64 32
```

`CRON_SECRET` deve ser preenchido com uma string aleatória longa
mesmo em dev, se você for testar o endpoint `/api/cron/sync-books`
manualmente (ele recusa qualquer chamada sem o header correto).

### Login com Google (opcional)

`GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` podem ficar vazios: o
provider simplesmente não é registrado e o botão "Continuar com
Google" não aparece — cadastro e login por e-mail + senha continuam
funcionando normalmente.

Pra ativar: [Google Cloud Console](https://console.cloud.google.com/)
→ APIs & Services → Credentials → Create credentials → OAuth client ID
→ Web application. Em "Authorized redirect URIs", adicione
`http://localhost:3000/api/auth/callback/google` (dev) e
`https://SEU-DOMINIO/api/auth/callback/google` (produção).

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

Isso cria as tabelas (`Book`, `Category`, `AffiliateLink`, as de conta
do NextAuth — `User`, `Account`, `Session`, `VerificationToken` — e as
da estante, `Shelf` e `ShelfItem`) e insere as 12 categorias curadas,
cada uma já com termos de busca em português mapeados para a Google
Books API.

> ⚠️ Se o `prisma migrate dev` detectar divergência com o banco, ele
> **oferece resetar o banco inteiro** — o que apagaria a tabela `Book`
> com todo o catálogo curado, caro de refazer (a Google Books API tem
> rate limit). Nunca aceite esse prompt. Em banco com dados, prefira
> `npx prisma migrate dev --create-only`, leia o SQL gerado, confirme
> que só tem `CREATE`, e aplique com `npx prisma migrate deploy`.

Em produção a migração precisa ser aplicada **antes** do deploy do
código que lê as tabelas novas: o build da Vercel roda `prisma
generate` (via `postinstall`), mas não `prisma migrate deploy`.

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

### 7. Testar a estante

Crie uma conta em `/cadastrar` (nome, e-mail e senha). As prateleiras
"Não lidos" e "Lidos" são criadas junto com a conta. Sorteie um livro
na home, clique em "Guardar na estante" e abra `/estante`.

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
   `AUTH_SECRET`, `GOOGLE_BOOKS_API_KEY`, `CRON_SECRET`, e as de
   afiliado/Google OAuth quando disponíveis). **`AUTH_SECRET` precisa
   estar lá antes do primeiro deploy com login** — sem ele o site
   inteiro cai, não só a estante.
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
  visitas, nem mesmo pra quem está logado — o sorteio não olha a
  estante do usuário pra evitar livros já guardados.
- **Um livro só pode estar numa prateleira por vez**: garantido no
  banco por `@@unique([userId, bookId])`. Não dá pra ter o mesmo livro
  em "Lidos" e numa prateleira "Favoritos" ao mesmo tempo — mover tira
  da anterior.
- **Sem recuperação de senha**: não há fluxo de "esqueci minha senha"
  nem confirmação de e-mail. Quem perde a senha e não usa Google fica
  sem acesso à conta.
- **Sem rate limiting no cadastro/login**: `/api/signup` e o callback
  de credenciais não têm limite por IP.
- **NextAuth v5 ainda é beta** (`5.0.0-beta.x`). É o que a v5 exige pro
  App Router e é amplamente usado em produção, mas a API pode mudar
  antes do estável.
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
- **Senhas com bcrypt**: nunca em texto puro. Custo 10 (bcryptjs é JS
  puro; 12 leva ~600ms em serverless e parece travado) e limite de 72
  bytes na validação, porque o bcrypt trunca em silêncio depois disso.
- **Sem enumeração de e-mail no login**: quando o e-mail não existe, o
  `authorize()` ainda compara a senha contra um hash fixo, pra que
  e-mail errado e senha errada demorem o mesmo tanto.
- **Sem IDOR na estante**: toda rota de usuário começa com
  `requireUserId()`, e o `userId` entra **dentro do `where` do Prisma**
  (`updateMany`/`deleteMany`/`findFirst`) — nunca "busca por id e
  compara em JS". Tentativa de mexer na prateleira de outro usuário
  responde 404; sem sessão, 401.
- **Sem open redirect no `?next=`**: `safeNextPath()` (`lib/next-path.ts`)
  só aceita caminho relativo de uma barra — `//evil.com` e
  `https://evil.com` caem no padrão `/estante`.
- **Excluir prateleira não apaga livros**: os itens são movidos pra
  "Não lidos" numa transação antes do delete, em vez de deixar o
  `onDelete: Cascade` do schema destruí-los junto.
