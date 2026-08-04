---
execution: inline
agent: gustavo-growth
inputFile: squads/growth-conteudo/output/trend-selection.md
outputFile: squads/growth-conteudo/output/calendario-editorial.md
---

# Step 4: Calendário Editorial e Ajuste de Roadmap

Gustavo Growth transforma a tendência escolhida e o brief de pesquisa em um calendário editorial executável para o ciclo, e ajusta o roadmap de crescimento existente se a pesquisa justificar.

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/trend-selection.md` — tendência escolhida no checkpoint anterior
- `squads/growth-conteudo/output/research-brief.md` — brief de pesquisa completo do ciclo
- `squads/growth-conteudo/output/growth-roadmap.md` — roadmap de crescimento já aprovado (fases, pilares, métricas)
- `squads/growth-conteudo/pipeline/data/domain-framework.md` — framework operacional de estratégia/calendário

## Instructions

### Process
1. Confirmar em qual fase do roadmap o ciclo atual se encontra (Fase 1 calibração / Fase 2 tração / Fase 3 consolidação) lendo `growth-roadmap.md`.
2. Definir 1-2 pilares de conteúdo prioritários para este ciclo, cada um com percentual de alocação e justificativa ligada à tendência escolhida e ao brief de pesquisa.
3. Montar o calendário editorial do ciclo (1-2 semanas de conteúdo): para cada peça, especificar dia, plataforma, pilar, formato e tema.
4. Verificar se algum achado do brief exige ajuste no roadmap — se sim, documentar com uma linha de racional citando o achado específico; se não, declarar explicitamente que o roadmap permanece sem mudança.
5. Definir a métrica de sucesso do ciclo (única, específica, alinhada à fase atual) e o critério de corte.

## Output Format

```
# Calendário Editorial — Ciclo [N] (Fase [X]: [nome da fase])

## Contexto da fase
[reafirmação da fase atual e por que a métrica escolhida é a certa agora]

## Pilares priorizados deste ciclo
1. [pilar] ([%] da cadência) — [justificativa ligada ao achado da pesquisa]
2. [pilar] ([%] da cadência) — [justificativa]

## Cadência do ciclo
| Dia | Plataforma | Pilar | Formato | Tema |
|---|---|---|---|---|
...

## Ajuste ao roadmap
[ajuste específico com achado que motivou, ou "Nenhum ajuste necessário" com justificativa]

## Métrica de sucesso do ciclo
[métrica única e específica]
Critério de corte: [condição explícita]
```

## Output Example

Ver `squads/growth-conteudo/agents/gustavo-growth.agent.md`, seção "Output Examples", Example 1 (calendário Fase 1) e Example 2 (ajuste de roadmap motivado por pesquisa) — usar como referência direta de profundidade e formatação.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Mais de 2 pilares foram priorizados no mesmo ciclo
2. A métrica de sucesso do ciclo é vaga ("engajamento", "crescimento") em vez de específica e mensurável

## Quality Criteria

- [ ] Fase do roadmap reafirmada no início do calendário
- [ ] Cada pilar priorizado tem justificativa ligada a um achado da pesquisa
- [ ] Cadência do ciclo tem plataforma, formato e tema por peça, sem ambiguidade
- [ ] Critério de corte explícito está presente
