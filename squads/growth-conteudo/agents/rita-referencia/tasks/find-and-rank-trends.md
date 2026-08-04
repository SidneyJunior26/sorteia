---
task: "Find and Rank Trends"
order: 1
input: |
  - research_focus: Tema e janela de tempo definidos pelo usuário no checkpoint anterior (arquivo research-focus.md)
  - existing_brief: Conteúdo atual de pipeline/data/research-brief.md, usado como base a cruzar/atualizar
output: |
  - research_brief: Brief estruturado de pesquisa do ciclo atual, no formato padrão (Key Findings, Trending Angles, Sources, Recommendations, Gaps)
---

# Find and Rank Trends

Encontra e ranqueia tendências atuais de BookTok/Bookstagram Brasil relevantes ao foco de pesquisa definido pelo usuário, cruzando com o conhecimento já compilado em `research-brief.md` e produzindo um brief atualizado e ranqueado por adequação ao Achei Meu Livro.

## Process

1. Ler o foco de pesquisa (`research-focus.md`) e o brief já existente (`pipeline/data/research-brief.md`) para não duplicar pesquisa já feita.
2. Rodar uma varredura focada (`web_search`/`web_fetch`) nas categorias de fonte mais relevantes: imprensa especializada em livros/mercado editorial brasileiro, anúncios oficiais de plataforma (TikTok Newsroom), e blogs de creator economy do nicho literário. Coletar 5-10 fontes candidatas.
3. Selecionar as 3-5 fontes mais promissoras e extrair achados detalhados, cruzando alegações-chave entre si.
4. Para cada achado, atribuir nível de confiança: ALTA (3+ fontes concordam), MÉDIA (2 fontes concordam), BAIXA (fonte única ou dados conflitantes).
5. Classificar cada ângulo de tendência por ciclo de vida (emergente/crescimento/maduro/declinando) e por adequação ao mecanismo único do produto (sorteio real de livro).
6. Compilar o brief no formato padrão: Key Findings, Trending Angles (ranqueados), Sources (tabela com tipo e relevância), Recommendations, Gaps.
7. Verificar que toda seção está preenchida antes de entregar — se uma seção ficar vazia, explicar por quê no próprio texto.

## Output Format

```yaml
research_brief:
  topic: "..."
  time_range: "..."
  prepared: "YYYY-MM-DD"
  key_findings:
    - finding: "..."
      confidence: "alta|média|baixa"
      source: "..."
      url: "..."
      accessed: "YYYY-MM-DD"
  trending_angles:
    - angle: "..."
      lifecycle: "emergente|crescimento|maduro|declinando"
      product_fit: "..."
  sources:
    - name: "..."
      type: "..."
      relevance: "n/10"
      date: "..."
  recommendations:
    - "..."
  gaps:
    - "..."
```

## Output Example

> Ver `squads/growth-conteudo/pipeline/data/output-examples.md` para exemplos completos de brief de pesquisa aplicados ao nicho de livro. Trecho ilustrativo:

```
RESEARCH BRIEF
Tema: Formatos de vídeo curto para nicho de livro no Brasil
Janela: Últimos 30 dias
Preparado: 2026-08-02

KEY FINDINGS

1. Vídeos no formato "isso ou aquilo" (debate de gênero) seguem entre os formatos
   de maior retenção nos primeiros 3 segundos em contas de nicho literário brasileiras
   analisadas manualmente nesta janela.
   Confiança: MÉDIA — observação qualitativa cruzada com 2 fontes de creator economy,
   sem dado quantitativo de plataforma disponível publicamente.
   Fonte: Accio (blog de creator economy), acessado 2026-08-01.
   Fonte: Automateed (blog de creator economy), acessado 2026-08-01.

2. Nenhuma conta de nicho literário brasileiro encontrada usa "prova de curadoria
   real" (mostrar que o catálogo não é aleatório de qualquer coisa) como ângulo
   recorrente — espaço aberto para o Achei Meu Livro.
   Confiança: MÉDIA — busca manual em perfis públicos, não é levantamento exaustivo.

TRENDING ANGLES

- "Isso ou aquilo" — Lifecycle: crescimento. Alta adequação ao produto (fácil de
  produzir com o catálogo de 12 categorias já existente).
- "Prova de curadoria real" — Lifecycle: emergente (nicho específico, não genérico
  de BookTok). Adequação altíssima — nenhum concorrente cobre isso.

SOURCES
| # | Fonte | Tipo | Relevância | Data |
|---|---|---|---|---|
| 1 | Accio | Creator economy | 6/10 | 2026-08 |
| 2 | Automateed | Creator economy | 5/10 | 2026-08 |

RECOMMENDATIONS
1. Priorizar "prova de curadoria real" neste ciclo — diferencial não ocupado.
2. Manter "isso ou aquilo" como pilar de manutenção (já validado, baixo risco).

GAPS
- Não há dado quantitativo de retenção específico para contas brasileiras de nicho
  literário — análise é qualitativa/manual, não de plataforma.
```

## Quality Criteria

- [ ] Todo achado citado tem fonte e data de acesso rastreáveis
- [ ] Nível de confiança justificado em uma frase para cada achado
- [ ] Ângulos ranqueados por adequação ao produto, não só popularidade
- [ ] Seção de Gaps preenchida, mesmo que pequena
- [ ] Brief cruza com o conhecimento já existente em research-brief.md, sem duplicar contradições sem sinalizar

## Veto Conditions

Reject and redo if ANY are true:
1. Algum achado de "confiança alta" está baseado em uma única fonte sem corroboração
2. A seção de Gaps está ausente ou vazia sem explicação
