---
type: checkpoint
outputFile: squads/growth-conteudo/output/strategy-approval.md
---

# Step 5: Aprovar Estratégia/Calendário (checkpoint)

O usuário revisa o calendário editorial do ciclo (e qualquer ajuste de roadmap proposto) antes do squad avançar para geração de ângulos de conteúdo.

## Contexto a apresentar ao usuário

"Revise o calendário editorial em `squads/growth-conteudo/output/calendario-editorial.md`. Confira: os pilares priorizados, a cadência por plataforma, e qualquer ajuste proposto ao roadmap de crescimento."

## Pergunta ao usuário

```
O calendário editorial e o ajuste de roadmap (se houver) estão aprovados?

1. Sim, aprovar e seguir para geração de ângulos
2. Não, ajustar os pilares priorizados (volta para o step 4)
3. Não, ajustar a cadência/formato (volta para o step 4)
```

Se o usuário escolher 2 ou 3, capturar o feedback específico e retornar ao step 4 (Gustavo Growth) com essa correção.

## Após a resposta

Salvar em `squads/growth-conteudo/output/strategy-approval.md`:

```markdown
# Strategy Approval

**Status:** {Aprovado | Ajuste solicitado}
**Feedback do usuário (se houver):** {texto livre}
**Data:** {YYYY-MM-DD}
```
