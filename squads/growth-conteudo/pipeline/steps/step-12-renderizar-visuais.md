---
execution: subagent
agent: duda-design
inputFile: squads/growth-conteudo/output/content-instagram-feed.md
outputFile: squads/growth-conteudo/output/visuals-manifest.md
model_tier: powerful
---

# Step 12: Renderizar Visuais

Duda Design renderiza os slides do carrossel de Instagram Feed aprovado (HTML→imagem via `template-designer`/`image-creator`/`higgsfield_generate_image`) e gera thumbnails de capa para os vídeos de Reels e TikTok aprovados, usando um único design system consistente para todo o ciclo.

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/content-instagram-feed.md` — carrossel aprovado no step 11
- `squads/growth-conteudo/output/content-instagram-reels.md` — roteiro de Reels aprovado (para thumbnail de capa)
- `squads/growth-conteudo/output/content-tiktok.md` — roteiro de TikTok aprovado (para thumbnail de capa)
- `squads/growth-conteudo/agents/duda-design/tasks/render-carousel.md` — task executada nesta etapa
- `_opensquad/_memory/company.md` — tom de marca e contexto de produto

## Instructions

### Process
1. Ler o conteúdo aprovado (carrossel completo + roteiros de vídeo) e o contexto de marca.
2. Definir o design system do ciclo (cores, tipografia, espaçamento, grid) alinhado ao tom direto/informal-leve do site, documentando antes de qualquer HTML.
3. Escrever o HTML autocontido do slide 1 (capa do carrossel), respeitando viewport 1080x1440 e tamanhos mínimos de fonte.
4. Renderizar e verificar visualmente o slide 1 antes de gerar o restante do lote.
5. Gerar os slides restantes do carrossel e as thumbnails de capa de Reels/TikTok com o mesmo design system.
6. Compilar o manifesto final com os caminhos de todos os arquivos gerados.

## Output Format

```
DESIGN SYSTEM
[cores, tipografia, espaçamento, grid documentados]

=== MANIFESTO DE VISUAIS ===
- slide-01.html → slide-01.png (capa do carrossel)
- slide-02.html → slide-02.png (conteúdo)
...
- reels-thumbnail.html → reels-thumbnail.png (capa do vídeo Reels)
- tiktok-thumbnail.html → tiktok-thumbnail.png (capa do vídeo TikTok)

Caminho base: squads/growth-conteudo/output/visuals/
```

## Output Example

Ver `_opensquad/core/best-practices/image-design.md`, Exemplo 1 (design system completo + HTML de slide de capa) e `squads/growth-conteudo/pipeline/data/output-examples.md` (referência de tom) — adaptar cores/tipografia ao tom direto/informal-leve do Achei Meu Livro.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Algum slide usa fonte abaixo do mínimo de plataforma (34px corpo, 20px absoluto)
2. O lote completo foi renderizado sem verificação prévia do slide 1

## Quality Criteria

- [ ] Design system documentado antes de qualquer HTML de slide
- [ ] Todo HTML é autocontido (CSS inline, sem CDN além de Google Fonts)
- [ ] Contraste 4,5:1 verificado em todo texto
- [ ] Manifesto final lista todos os arquivos com caminho correto
