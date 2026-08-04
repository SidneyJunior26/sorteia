---
type: checkpoint
outputFile: squads/growth-conteudo/output/content-approval.md
---

# Step 11: Aprovar Conteúdo (checkpoint obrigatório)

Checkpoint MANDATÓRIO (Gate 2b): nenhum conteúdo pode ser renderizado em visual antes de aprovação humana explícita. Este step precede diretamente o step 12 (Duda Design renderiza visuais).

## Contexto a apresentar ao usuário

"Revise os 3 conteúdos criados neste ciclo antes de seguirmos para a renderização visual:
- Reels: `squads/growth-conteudo/output/content-instagram-reels.md`
- Feed/carrossel: `squads/growth-conteudo/output/content-instagram-feed.md`
- TikTok: `squads/growth-conteudo/output/content-tiktok.md`"

## Pergunta ao usuário

```
O conteúdo dos 3 formatos está aprovado para seguir para renderização visual?

1. Sim, aprovar todos e renderizar
2. Não, ajustar o roteiro de Reels (volta para o step 8)
3. Não, ajustar o carrossel de Feed (volta para o step 9)
4. Não, ajustar o roteiro de TikTok (volta para o step 10)
```

Se qualquer opção de ajuste for escolhida, capturar o feedback específico e retornar ao step correspondente antes de prosseguir.

## Após a resposta

Salvar em `squads/growth-conteudo/output/content-approval.md`:

```markdown
# Content Approval

**Status:** {Aprovado | Ajuste solicitado}
**Peças aprovadas:** {Reels | Feed | TikTok | Todos}
**Feedback do usuário (se houver):** {texto livre}
**Data:** {YYYY-MM-DD}
```
