---
execution: inline
agent: paulo-publica
inputFile: squads/growth-conteudo/output/final-approval.md
outputFile: squads/growth-conteudo/output/publish-log.md
---

# Step 15: Publicação

Paulo Publica executa dry-run seguido de publicação ao vivo (mediante confirmação explícita adicional do usuário) no Instagram (via skill `instagram-publisher`) e no TikTok (via ferramenta MCP nativa `mcp__claude_ai_Higgsfield__tiktok_publish` — não é skill instalada em `skills/`).

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/final-approval.md` — confirmação do checkpoint anterior (step 14)
- `squads/growth-conteudo/output/content-instagram-feed.md`, `output/content-instagram-reels.md`, `output/content-tiktok.md` — conteúdo final aprovado
- `squads/growth-conteudo/output/visuals-manifest.md` — visuais renderizados pela Duda Design
- `_opensquad/core/best-practices/social-networks-publishing.md` — workflow de publicação

## Instructions

### Process
1. Confirmar que o step 14 registrou "Aprovado para publicação" antes de iniciar qualquer ação.
2. Validar o conteúdo contra os requisitos de cada plataforma (formato de imagem/vídeo, contagem de caracteres, número de imagens).
3. Apresentar o preview estruturado de publicação para Instagram e TikTok.
4. Rodar o dry-run em cada plataforma e reportar o resultado.
5. Pedir confirmação explícita adicional do usuário antes de publicar ao vivo (o checkpoint do step 14 aprova o conteúdo; esta é a confirmação final de "publicar agora").
6. Publicar sequencialmente (Instagram primeiro, depois TikTok), reportando resultado de cada um antes de seguir para o próximo.
7. Registrar o log de publicação com URLs, IDs e status.

## Output Format

```
PUBLISH PREVIEW
[detalhes por plataforma: mídia, legenda, hashtags, validação]

DRY-RUN RESULT
[resultado do teste por plataforma]

PUBLISH RESULT
[resultado real por plataforma: sucesso com URL/ID, ou falha com erro e sugestão]

=== PUBLISH LOG ===
| Plataforma | Status | URL/ID | Data/Hora |
|---|---|---|---|
...
```

## Output Example

Ver `squads/growth-conteudo/agents/paulo-publica.agent.md`, seção "Output Examples", Example 1 (preview + dry-run) e Example 2 (publicação multi-plataforma com falha parcial) — usar como referência direta de formato.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Uma publicação ao vivo foi tentada sem confirmação explícita do usuário além do checkpoint do step 14
2. Um resultado de sucesso foi reportado sem URL/permalink do post

## Quality Criteria

- [ ] Dry-run executado e aprovado antes de qualquer publicação ao vivo
- [ ] Preview estruturado apresentado com todos os detalhes por plataforma
- [ ] Publicação sequencial com relatório por plataforma
- [ ] Log final registrado em `squads/growth-conteudo/output/publish-log.md`
