---
task: "Create Instagram Feed"
order: 3
input: |
  - chosen_angle: Ângulo aprovado pelo usuário no checkpoint (output/angle-selection.md)
  - format_rules: Regras de Instagram Feed/carrossel injetadas automaticamente pelo Pipeline Runner via campo format
output: |
  - feed_carousel: Carrossel completo (formato escolhido, slides, legenda, hashtags)
---

# Create Instagram Feed

Cria o carrossel completo de Instagram Feed a partir do ângulo aprovado, escolhendo explicitamente um dos 7 formatos de carrossel (Editorial, Listicle, Tutorial, Mito vs Realidade, Antes e Depois, Storytelling, Problema→Solução) e seguindo as regras de plataforma injetadas pelo Pipeline Runner (`format: instagram-feed`).

## Process

1. Ler o ângulo aprovado e escolher o formato de carrossel que melhor serve a esse ângulo (ex: "por trás do sorteio" combina com Editorial; "isso ou aquilo" combina com Mito vs Realidade ou debate direto).
2. Escrever o slide de capa: título provocativo (máx. 20 palavras) que para o scroll.
3. Escrever os slides de conteúdo seguindo o fluxo do formato escolhido — cada slide com headline (texto grande) + texto de apoio (40-80 palavras no total), alternando fundo claro/escuro/destaque.
4. Escrever o slide final de CTA — leve, específico (salvar, comentar), nunca hard-sell.
5. Escrever a legenda: hook nos primeiros 125 caracteres, corpo com contexto, fechamento com pergunta aberta.
6. Selecionar 5-15 hashtags (mix de nicho e amplas).
7. Rodar o Copy Stress Test e verificar que nenhum slide tem contador de posição ("3/8") nem menos de 40 palavras.

## Output Format

```
=== FORMAT ===
[Nome do formato escolhido]

=== SLIDES ===
Slide 1 (Cover):
  Title: ...
  Background: ...

Slide 2 ([Papel no arco narrativo]):
  Headline: ...
  Supporting text: ...
  Accent keywords: ...
  Background: light/dark/accent

... (continuar até o slide final)

Slide N (CTA):
  CTA: ...
  Background: ...

=== CAPTION ===
[Hook — até 125 caracteres]
[Corpo]
[Pergunta de fechamento]

=== HASHTAGS ===
#tag1 #tag2 ... (5-15)
```

## Output Example

> Ver `pipeline/data/output-examples.md`, Exemplo 3, para o carrossel completo "3 mitos sobre 'sortear' um livro" — usar como referência direta de profundidade e formatação esperadas.

## Quality Criteria

- [ ] Formato de carrossel escolhido explicitamente e seguido do início ao fim
- [ ] Cada slide entre 40-80 palavras (headline + texto de apoio)
- [ ] Cores de fundo alternadas entre slides
- [ ] Nenhum contador de slide nas imagens
- [ ] Legenda termina com pergunta aberta ou CTA claro

## Veto Conditions

Reject and redo if ANY are true:
1. Algum slide de conteúdo tem menos de 40 palavras (exceto se o usuário pediu explicitamente slides curtos)
2. O carrossel não declara explicitamente qual dos 7 formatos está sendo seguido
