---
execution: inline
agent: vera-veredito
inputFile: squads/growth-conteudo/output/visuals-manifest.md
outputFile: squads/growth-conteudo/output/review-verdict.md
on_reject: 8
---

# Step 13: Revisão de Qualidade

Vera Veredito avalia copy e visual juntos (Reels, Feed, TikTok e os visuais renderizados pela Duda) contra os critérios objetivos de `quality-criteria.md`, produzindo um veredito estruturado. Em caso de REJECT, o pipeline retorna ao step 8 (criação de conteúdo Instagram Reels — reinicia a cadeia de criação 8→9→10→11→12).

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/content-instagram-reels.md`, `output/content-instagram-feed.md`, `output/content-tiktok.md` — conteúdo do ciclo
- `squads/growth-conteudo/output/visuals-manifest.md` — visuais renderizados pela Duda Design
- `squads/growth-conteudo/pipeline/data/quality-criteria.md` — critérios objetivos de avaliação
- `squads/growth-conteudo/pipeline/data/anti-patterns.md` — erros de domínio a verificar

## Instructions

### Process
1. Ler o conteúdo completo e os visuais renderizados do início ao fim antes de pontuar qualquer critério.
2. Pontuar cada critério aplicável (hook, CTA, aderência ao ângulo, qualidade visual, tom de marca) em escala 1-10, com justificativa específica.
3. Calcular a média geral e aplicar as regras de decisão: APPROVE (média ≥7, nenhum critério <4), CONDITIONAL APPROVE (média ≥7 com critério não-crítico 4-6), REJECT (média <7 OU qualquer critério <4).
4. Se REJECT, apontar exatamente o que corrigir, onde, e indicar retorno ao step 8.

## Output Format

```
==============================
 REVIEW VERDICT: [APPROVE | CONDITIONAL APPROVE | REJECT]
==============================
Conteúdo: [descrição do ciclo]
Revisão: [N] de 2

SCORING TABLE
| Critério | Score | Resumo |
|---|---|---|
...
OVERALL: [X,X]/10

DETALHES:
[Strength/Required change/Suggestion por item]

VERDICT: [texto do veredito final]
```

## Output Example

Ver `squads/growth-conteudo/agents/vera-veredito.agent.md`, seção "Output Examples", Example 1 (APPROVE) e Example 2 (REJECT) — usar como referência direta de formato e profundidade.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Algum score foi dado sem justificativa por escrito
2. O veredito final não corresponde matematicamente às notas atribuídas (ex: critério <4/10 presente mas veredito é APPROVE)

## Quality Criteria

- [ ] Copy e visual avaliados juntos, nunca isoladamente
- [ ] Toda rejeição inclui correção específica (o quê, onde, como)
- [ ] Pelo menos um "Strength" presente mesmo em veredito REJECT
- [ ] Revisão indica claramente o número do ciclo de revisão (1 de 2, 2 de 2)
