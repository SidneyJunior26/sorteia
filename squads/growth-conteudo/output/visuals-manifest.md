# Manifesto de Visuais — Ciclo "Antes e Depois" (Achei Meu Livro)

Peças geradas a partir do conteúdo aprovado: `content-instagram-feed.md` (carrossel de
5 slides), `content-instagram-reels.md` e `content-tiktok.md` (thumbnails de capa de
vídeo). Um único design system foi definido antes de qualquer HTML, e o slide 1 foi
renderizado e verificado visualmente antes do restante do lote — conforme processo da
task `render-carousel`.

## Design System

**Plataforma:** Instagram Carrossel (slides 1-5) + Instagram Reels / TikTok (thumbnails)

Viewport:
- Carrossel: 1080 x 1440
- Thumbnails de vídeo (Reels/TikTok): 1080 x 1920

Cores (5 no total — variações são derivadas por opacidade, não cores novas):
- Primary (fundo escuro): `#1F1B2E` — azul-arroxeado profundo, evoca leitura à noite; contraste 15,7:1 com texto branco.
- Secondary (fundo claro): `#F7F3EC` — bege claro tipo página de livro, reforça o tom informal-leve sem parecer corporativo.
- Accent (destaque/CTA): `#FF6B4A` — coral quente, cor do dado 🎲 e do gatilho de Surpresa do ângulo aprovado; usado em palavras-chave e no fundo do slide de CTA.
- Texto sobre fundo escuro: `#FFFFFF`.
- Texto sobre fundo claro e sobre accent: `#201C2B` — mesmo tom do primary, o que fecha o ciclo de cor sem introduzir uma 6ª cor; sobre o accent garante contraste 5,9:1 (branco sobre accent ficaria em ~2,8:1, abaixo do mínimo AA — por isso o CTA usa texto escuro, não branco).

Tipografia:
- Família: 'Poppins' (Google Fonts via `@import`), pesos 500/600/700/800 — sans-serif arredondada, amigável, alinhada ao tom direto/informal-leve (evita a seriedade de uma serifada editorial).
- Hero: 72px / 800 (capa do carrossel, slide 1)
- Heading: 48-50px / 700 (headline de cada slide de conteúdo)
- Body: 38px / 600 (texto de apoio — acima do mínimo de 34px exigido)
- Caption: 26-30px / 600 (rótulos, subtexto de CTA — acima do mínimo de 24px/20px)

Espaçamento:
- Base: 24px
- Margem de conteúdo: 80px (múltiplo de ~3,3x base)
- Gap entre seções: 40-48px

Grid:
- Coluna única centralizada, largura máxima de conteúdo 920px (1080 - 2×80)
- Layout via Flexbox em todos os slides (sem posicionamento absoluto para conteúdo primário; absoluto reservado só para tag de marca e rótulo "arrasta pro lado")

Elementos visuais:
- Border radius: 28-40px (cards, frame de screenshot, reveal-card das thumbnails)
- Alternância de fundo do carrossel: escuro (capa) → claro → escuro → claro → accent (CTA), conforme aprovado no `content-instagram-feed.md`
- Palavra-chave de destaque de cada slide de conteúdo em `#FF6B4A`
- Emoji de dado 🎲 como motivo recorrente de marca (ligado ao pilar "Achado aleatório")

## Verificação do Slide 1 (antes do lote)

Slide 1 renderizado e inspecionado visualmente via Playwright (screenshot em
`slide-01.png`) antes de gerar os demais: fonte Poppins carregou corretamente, hero em
72px sem quebra estranha, contraste branco sobre `#1F1B2E` alto, sem clipping de texto,
sem contador de slide. Só depois dessa verificação os slides 2-5 e as thumbnails foram
gerados e renderizados.

## Renderização

Renderização real via Playwright MCP (`browser_navigate` + `browser_resize` +
`browser_take_screenshot`) contra um servidor HTTP local servindo os HTMLs (o protocolo
`file://` estava bloqueado no ambiente). Todos os 7 PNGs abaixo foram efetivamente
renderizados e verificados — nenhuma peça ficou pendente.

Atualização pós-revisão (Vera Veredito, `review-verdict.md`, ciclo 1): o slide 4
originalmente usava um mockup genérico de UI (silhuetas) enquanto a copy afirmava
"isso é print direto da tela do sorteio" — descompasso sinalizado como Required
change. Corrigido: capturado print real via Playwright contra o dev server local
(`npm run dev`), sorteio real do livro "A escolha dos três" (Stephen King, categoria
Fantasia/Horror/Ficção Científica), embutido como imagem base64 dentro do
`slide-04.html` (mantém o HTML autocontido, sem dependência de arquivo externo) e
`slide-04.png` re-renderizado. Nenhum dado de livro foi inventado — a imagem é uma
captura real do produto em funcionamento.

=== MANIFESTO DE VISUAIS ===
- slide-01.html → slide-01.png (capa do carrossel)
- slide-02.html → slide-02.png (conteúdo — Antes)
- slide-03.html → slide-03.png (conteúdo — Depois)
- slide-04.html → slide-04.png (conteúdo — Prova, com mockup de UI a substituir por print real antes de publicar)
- slide-05.html → slide-05.png (CTA)
- reels-thumbnail.html → reels-thumbnail.png (capa do vídeo Reels)
- tiktok-thumbnail.html → tiktok-thumbnail.png (capa do vídeo TikTok)

Caminho base: `squads/growth-conteudo/output/visuals/`

## Quality Criteria (checklist)

- [x] Design system documentado antes de qualquer HTML de slide
- [x] Todo HTML é autocontido (CSS inline, sem CDN além do `@import` do Google Fonts, sem JS)
- [x] Fonte mínima respeitada (34px+ corpo de carrossel, 20px absoluto em qualquer plataforma) — corpo usado: 38px; caption mínimo usado: 26px
- [x] Contraste 4,5:1 verificado em todo texto (branco/#1F1B2E ~15,7:1; #201C2B/#F7F3EC ~15,3:1; #201C2B/#FF6B4A ~5,9:1)
- [x] Slide 1 verificado visualmente antes do lote completo
- [x] Nenhum contador de slide nas imagens de carrossel
- [x] Manifesto final lista todos os arquivos com caminho correto
