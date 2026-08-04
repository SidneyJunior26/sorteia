---
type: checkpoint
outputFile: squads/growth-conteudo/output/trend-selection.md
---

# Step 3: Escolher Tendência/Ângulo do Ciclo (checkpoint)

O step 2 (Rita Referência) pode trazer múltiplas tendências ranqueadas. Este checkpoint pede ao usuário para escolher UMA para desenvolver neste ciclo — segue o padrão de "News Selection Checkpoint" adaptado para seleção de tendência.

## Contexto a apresentar ao usuário

Mostrar o caminho do arquivo gerado no step anterior: "Revise o brief completo em `squads/growth-conteudo/output/research-brief.md` antes de escolher."

Listar as 3-5 tendências mais bem ranqueadas da seção "Trending Angles" do brief, cada uma com: nome da tendência, ciclo de vida, e avaliação de adequação ao produto (uma frase resumo).

## Pergunta ao usuário (lista numerada)

```
Qual tendência/ângulo você quer desenvolver neste ciclo?

1. [Nome da tendência 1] — [ciclo de vida] — [resumo de adequação]
2. [Nome da tendência 2] — [ciclo de vida] — [resumo de adequação]
3. [Nome da tendência 3] — [ciclo de vida] — [resumo de adequação]
...
N. Pesquisar mais tendências (volta para o step 2 com novo foco)
```

## Após a resposta

Salvar a escolha do usuário em `squads/growth-conteudo/output/trend-selection.md`:

```markdown
# Trend Selection

**Tendência escolhida:** {nome da tendência}
**Ciclo de vida:** {emergente/crescimento/maduro/declinando}
**Justificativa do usuário (se fornecida):** {comentário livre, se houver}
**Data:** {data de hoje em YYYY-MM-DD}
```

Este arquivo é lido pelo step 4 (Gustavo Growth) junto com o research-brief.md completo.
