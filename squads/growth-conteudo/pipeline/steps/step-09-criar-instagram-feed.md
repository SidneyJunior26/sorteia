---
execution: subagent
agent: ivo-instagram
format: instagram-feed
inputFile: squads/growth-conteudo/output/angle-selection.md
outputFile: squads/growth-conteudo/output/content-instagram-feed.md
model_tier: powerful
---

# Step 9: Criar Conteúdo Instagram Feed

Ivo Instagram cria o carrossel completo de Instagram Feed a partir do mesmo ângulo aprovado, escolhendo explicitamente um dos 7 formatos de carrossel e seguindo as regras injetadas automaticamente pelo Pipeline Runner (`format: instagram-feed`).

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/angle-selection.md` — ângulo aprovado no step 7 (mesmo ângulo do step 8)
- `squads/growth-conteudo/agents/ivo-instagram/tasks/create-instagram-feed.md` — task executada nesta etapa
- `squads/growth-conteudo/pipeline/data/tone-of-voice.md` — tom escolhido/recomendado para o ciclo
- `squads/growth-conteudo/pipeline/data/quality-criteria.md` — critérios de carrossel aplicáveis

## Instructions

### Process
1. Ler o ângulo aprovado e escolher o formato de carrossel que melhor serve o ângulo (Editorial, Listicle, Tutorial, Mito vs Realidade, Antes e Depois, Storytelling ou Problema→Solução).
2. Escrever o slide de capa (título provocativo, máx. 20 palavras).
3. Escrever os slides de conteúdo seguindo o fluxo do formato escolhido (headline + texto de apoio, 40-80 palavras por slide, cores alternadas).
4. Escrever o slide final de CTA — leve, específico.
5. Escrever a legenda e selecionar 5-15 hashtags.
6. Verificar que nenhum slide tem contador de posição e que todos respeitam a contagem de palavras.

## Output Format

```
=== FORMAT ===
[nome do formato escolhido]

=== SLIDES ===
Slide 1 (Cover):
  Title: ...
  Background: ...

Slide 2 ([papel no arco]):
  Headline: ...
  Supporting text: ...
  Accent keywords: ...
  Background: light/dark/accent

... (continuar até o slide final)

Slide N (CTA):
  CTA: ...
  Background: ...

=== CAPTION ===
[hook — até 125 chars]
[corpo]
[pergunta de fechamento]

=== HASHTAGS ===
#tag1 #tag2 ... (5-15)
```

## Output Example

Ver `squads/growth-conteudo/pipeline/data/output-examples.md`, Exemplo 3 ("3 mitos sobre 'sortear' um livro") — carrossel completo pronto para uso como referência direta.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Algum slide de conteúdo tem menos de 40 palavras (exceto pedido explícito de slides curtos)
2. O carrossel não declara explicitamente qual dos 7 formatos está sendo seguido

## Quality Criteria

- [ ] Cada slide entre 40-80 palavras (headline + texto de apoio)
- [ ] Cores de fundo alternadas entre slides
- [ ] Nenhum contador de slide nas imagens
- [ ] Legenda termina com pergunta aberta ou CTA claro
