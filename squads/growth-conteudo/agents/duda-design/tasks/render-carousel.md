---
task: "Render Carousel"
order: 1
input: |
  - approved_content: Conteúdo aprovado no checkpoint (output/content-instagram-feed.md, output/content-instagram-reels.md, output/content-tiktok.md)
  - brand_context: Tom de marca e paleta de referência (_opensquad/_memory/company.md, pipeline/data/tone-of-voice.md)
output: |
  - visuals: Arquivos HTML e imagens renderizadas (slides de carrossel + thumbnails de capa de vídeo)
  - manifest: Lista dos arquivos gerados com caminhos
---

# Render Carousel

Renderiza os slides do carrossel de Instagram Feed aprovado (HTML→imagem) e gera thumbnails de capa para os vídeos de Reels e TikTok aprovados, seguindo um design system único e consistente para todo o ciclo.

## Process

1. Ler o conteúdo aprovado (carrossel completo + roteiros de vídeo) e o contexto de marca.
2. Definir o design system do ciclo: cores (máx. 5), tipografia (família + escala hero/heading/body/caption), espaçamento base, grid. Documentar antes de qualquer HTML.
3. Escrever o HTML autocontido do slide 1 (capa do carrossel), respeitando o viewport 1080x1440 e os tamanhos mínimos de fonte (hero 58px, body 34px+).
4. Renderizar o slide 1 (via `template-designer`/`image-creator` ou ferramenta MCP `higgsfield_generate_image` conforme disponibilidade) e verificar visualmente: legibilidade, contraste, ausência de clipping.
5. Após verificação do slide 1, gerar os slides restantes do carrossel com o mesmo design system.
6. Gerar thumbnail de capa para o vídeo de Reels e para o vídeo de TikTok, também alinhados ao mesmo design system.
7. Compilar o manifesto final com os caminhos de todos os arquivos gerados.

## Output Format

```yaml
design_system:
  colors: {primary: "#...", secondary: "#...", accent: "#...", background: "#...", text: "#..."}
  typography: {family: "...", hero_px: 0, heading_px: 0, body_px: 0, caption_px: 0}
  spacing_base_px: 0
visuals:
  - file: "slide-01.html"
    rendered: "slide-01.png"
    role: "cover"
  - file: "slide-02.html"
    rendered: "slide-02.png"
    role: "content"
  - file: "reels-thumbnail.html"
    rendered: "reels-thumbnail.png"
    role: "video-cover"
  - file: "tiktok-thumbnail.html"
    rendered: "tiktok-thumbnail.png"
    role: "video-cover"
manifest_path: "squads/growth-conteudo/output/visuals-manifest.md"
```

## Output Example

> Ver `pipeline/data/output-examples.md` (referência de tom) e `_opensquad/core/best-practices/image-design.md`, Exemplo 1, para um design system completo + HTML de slide de capa aplicável a este squad, adaptando cores/tipografia ao tom direto/informal-leve do Achei Meu Livro (fundo escuro/claro alternado, headline em destaque, CTA leve no slide final).

## Quality Criteria

- [ ] Design system documentado antes de qualquer HTML de slide
- [ ] Todo HTML é autocontido (CSS inline, sem CDN externo além de Google Fonts)
- [ ] Fonte mínima respeitada (34px+ corpo de carrossel, 20px absoluto em qualquer plataforma)
- [ ] Contraste 4,5:1 verificado em todo texto
- [ ] Slide 1 verificado visualmente antes do lote completo
- [ ] Manifesto final lista todos os arquivos com caminho correto

## Veto Conditions

Reject and redo if ANY are true:
1. Algum slide usa fonte abaixo do mínimo de plataforma (34px corpo, 20px absoluto)
2. O lote completo foi renderizado sem verificação prévia do slide 1
