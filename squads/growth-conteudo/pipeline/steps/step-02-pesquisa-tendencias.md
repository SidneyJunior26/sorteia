---
execution: subagent
agent: rita-referencia
inputFile: squads/growth-conteudo/output/research-focus.md
outputFile: squads/growth-conteudo/output/research-brief.md
model_tier: fast
---

# Step 2: Pesquisa de Tendências

Rita Referência pesquisa e ranqueia tendências de BookTok/Bookstagram Brasil a partir do foco definido pelo usuário no checkpoint anterior, produzindo o brief de pesquisa do ciclo.

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/research-focus.md` — tema e janela de tempo definidos pelo usuário no step 1
- `squads/growth-conteudo/pipeline/data/research-brief.md` — base de conhecimento já compilada (cruzar/atualizar, nunca substituir cegamente)
- `squads/growth-conteudo/agents/rita-referencia/tasks/find-and-rank-trends.md` — task executada nesta etapa
- `_opensquad/_memory/company.md` — contexto de produto (Achei Meu Livro)

## Instructions

### Process
1. Ler o foco de pesquisa e o brief já existente para não duplicar pesquisa já feita.
2. Executar a task `find-and-rank-trends.md`: varredura focada em fontes de nicho (imprensa especializada em livros/mercado editorial brasileiro, anúncios oficiais de plataforma, blogs de creator economy do nicho literário).
3. Cruzar achados novos com os já existentes no research-brief.md, atribuindo nível de confiança (alta/média/baixa) a cada um.
4. Classificar cada tendência/ângulo por ciclo de vida (emergente/crescimento/maduro/declinando) e por adequação ao mecanismo único do produto (sorteio real).
5. Compilar o brief final no formato padrão (Key Findings, Trending Angles, Sources, Recommendations, Gaps).

## Output Format

O output deve seguir exatamente esta estrutura:
```
RESEARCH BRIEF
Tema: [tema do foco de pesquisa]
Janela: [janela de tempo escolhida]
Preparado: [data]

KEY FINDINGS
1. [achado] — Confiança: [alta/média/baixa] — Fonte: [nome], acessado [data]
...

TRENDING ANGLES
- "[nome do ângulo]" — Lifecycle: [emergente/crescimento/maduro/declinando]. [avaliação de adequação ao produto]
...

SOURCES
| # | Fonte | Tipo | Relevância | Data |
|---|---|---|---|---|
...

RECOMMENDATIONS
1. ...

GAPS
- ...
```

## Output Example

```
RESEARCH BRIEF
Tema: Formatos de vídeo curto para nicho de livro no Brasil
Janela: Últimos 30 dias
Preparado: 2026-08-02

KEY FINDINGS

1. Vídeos no formato "isso ou aquilo" (debate de gênero) seguem entre os formatos
   de maior retenção nos primeiros 3 segundos em contas de nicho literário
   brasileiras analisadas nesta janela.
   Confiança: MÉDIA — cruzado com 2 fontes de creator economy, sem dado
   quantitativo de plataforma disponível publicamente.
   Fonte: Accio, acessado 2026-08-01. Fonte: Automateed, acessado 2026-08-01.

2. Nenhuma conta de nicho literário brasileiro encontrada usa "prova de curadoria
   real" como ângulo recorrente — espaço aberto para o Achei Meu Livro.
   Confiança: MÉDIA — busca manual, não exaustiva.

TRENDING ANGLES

- "Isso ou aquilo" — Lifecycle: crescimento. Alta adequação (fácil de produzir
  com o catálogo de 12 categorias já existente).
- "Prova de curadoria real" — Lifecycle: emergente. Adequação altíssima — nenhum
  concorrente cobre isso.

SOURCES
| # | Fonte | Tipo | Relevância | Data |
|---|---|---|---|---|
| 1 | Accio | Creator economy | 6/10 | 2026-08 |
| 2 | Automateed | Creator economy | 5/10 | 2026-08 |

RECOMMENDATIONS
1. Priorizar "prova de curadoria real" neste ciclo — diferencial não ocupado.
2. Manter "isso ou aquilo" como pilar de manutenção (já validado, baixo risco).

GAPS
- Não há dado quantitativo de retenção específico para contas brasileiras de
  nicho literário — análise é qualitativa/manual, não de plataforma.
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Algum achado de "confiança alta" está baseado em uma única fonte sem corroboração
2. A seção de Gaps está ausente ou vazia sem explicação

## Quality Criteria

- [ ] Todo achado tem fonte citada com data de acesso
- [ ] Nível de confiança atribuído a cada achado, com justificativa
- [ ] Ângulos incluem avaliação de ciclo de vida e adequação ao produto
- [ ] Recomendações são acionáveis e ligadas diretamente aos achados
