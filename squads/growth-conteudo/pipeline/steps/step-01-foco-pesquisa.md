---
type: checkpoint
outputFile: squads/growth-conteudo/output/research-focus.md
---

# Step 1: Foco da Pesquisa (checkpoint)

Rita Referência roda como subagent e não pode fazer perguntas interativas — este checkpoint coleta o foco da pesquisa ANTES dela começar a trabalhar.

## Contexto a apresentar ao usuário

1. Mostrar o propósito do squad: "Growth Conteúdo analisa tendências de BookTok/Bookstagram Brasil e produz conteúdo (Instagram Reels, Feed e TikTok) para atrair novos usuários ao Achei Meu Livro."
2. Mostrar o nome da empresa (`_opensquad/_memory/company.md`): "Achei Meu Livro".

## Perguntas ao usuário

1. **Foco da pesquisa (texto livre):**
   "Qual o foco específico desta pesquisa hoje?
   Exemplo: 'gêneros literários em alta agora', 'formatos de vídeo que estão performando no BookTok Brasil', 'ângulos ainda não explorados pra sorteio de livro'
   Digite o tema:"

2. **Janela de tempo (lista numerada):**
   1. Últimas 24 horas
   2. Últimos 7 dias
   3. Último mês
   4. Sem restrição de tempo (evergreen)

## Após a resposta

Salvar a resposta do usuário em `squads/growth-conteudo/output/research-focus.md` no formato:

```markdown
# Research Focus

**Topic:** {tema digitado pelo usuário}
**Time Range:** {rótulo da janela escolhida, ex: "Últimos 7 dias"}
**Date:** {data de hoje em YYYY-MM-DD}
```

Este arquivo é o `inputFile` do step 2 (Rita Referência).
