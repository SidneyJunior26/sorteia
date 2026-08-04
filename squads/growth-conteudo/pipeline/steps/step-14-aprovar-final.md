---
type: checkpoint
outputFile: squads/growth-conteudo/output/final-approval.md
---

# Step 14: Aprovar Final (checkpoint obrigatório)

Checkpoint MANDATÓRIO (Gate 2b): nenhuma publicação pode ocorrer sem aprovação humana explícita final. Este step precede diretamente o step 15 (Paulo Publica publica ao vivo).

## Contexto a apresentar ao usuário

"A Vera Veredito aprovou o conteúdo deste ciclo (ver `squads/growth-conteudo/output/review-verdict.md`). Revise mais uma vez os visuais finais em `squads/growth-conteudo/output/visuals-manifest.md` antes da publicação."

## Pergunta ao usuário

```
Confirma a publicação deste conteúdo no Instagram e no TikTok?

1. Sim, seguir para dry-run de publicação
2. Não, quero revisar o conteúdo de novo antes (volta para o step 11)
3. Não, cancelar a publicação deste ciclo
```

## Após a resposta

Salvar em `squads/growth-conteudo/output/final-approval.md`:

```markdown
# Final Approval

**Status:** {Aprovado para publicação | Revisão solicitada | Cancelado}
**Plataformas confirmadas:** {Instagram | TikTok | Ambas}
**Data:** {YYYY-MM-DD}
```

Se "Cancelado", encerrar o pipeline sem executar o step 15.
