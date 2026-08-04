---
task: "Create Instagram Reels"
order: 2
input: |
  - chosen_angle: Ângulo aprovado pelo usuário no checkpoint (output/angle-selection.md)
  - format_rules: Regras de Instagram Reels injetadas automaticamente pelo Pipeline Runner via campo format
output: |
  - reels_script: Roteiro completo de Reels (hook, setup, delivery, CTA), legenda e hashtags
---

# Create Instagram Reels

Cria o roteiro completo de Instagram Reels a partir do ângulo aprovado, seguindo a estrutura hook/setup/delivery/CTA e as regras de plataforma injetadas pelo Pipeline Runner (`format: instagram-reels`).

## Process

1. Ler o ângulo aprovado e confirmar qual pilar e gatilho psicológico ele usa.
2. Rodar o diagnóstico de pré-escrita: nível de consciência do público (aqui, majoritariamente "não-consciente"/desconhece o produto), o que define um hook que cria o problema/curiosidade em vez de assumir conhecimento prévio.
3. Escrever 3 opções de hook (0-2s) usando gatilhos estruturais distintos (pergunta, afirmação contra-intuitiva, reação genuína) — aguardar confirmação implícita do fluxo do pipeline antes de seguir (o checkpoint de ângulo já cobre a decisão de direção; aqui as 3 opções são entregues juntas no roteiro para revisão da Vera).
4. Escrever o roteiro completo: hook, setup (2-5s), delivery (5-18s, com corte de plano a cada 3-5s), CTA (últimos 3-5s) — CTA sempre leve (salvar, seguir, comentar), nunca hard-sell.
5. Escrever a legenda (primeiros 125 caracteres carregando o hook), fechando com pergunta ou CTA leve.
6. Selecionar 5-15 hashtags relevantes ao nicho (evitar spam de hashtag).
7. Rodar o Copy Stress Test e a verificação de acentuação em português antes de entregar.

## Output Format

```
=== REEL SCRIPT ===
Ângulo: [id/título do ângulo]

HOOK (0-2s):
[Visual]: ...
[Texto Overlay]: ...
[Áudio]: ...

SETUP (2-5s):
[Visual]: ...
[Script]: ...

DELIVERY (5-18s):
[Visual]: ...
[Script]: ...
[Texto Overlays]: ...

CTA (últimos 3-5s):
[Visual]: ...
[Script]: ...
[Texto Overlay]: ...

=== CAPTION ===
[Hook — até 125 caracteres]
[Corpo]
[CTA/pergunta]

=== HASHTAGS ===
#tag1 #tag2 ... (5-15)

=== AUDIO NOTE ===
[Direção de áudio/som]
```

## Output Example

> Ver `pipeline/data/output-examples.md`, Exemplo 2, para o roteiro completo "eu não escolhi. o site escolheu por mim" — usar como referência direta de profundidade e formatação esperadas.

## Quality Criteria

- [ ] Hook nos primeiros 2 segundos, sem introdução lenta
- [ ] Duração total entre 15-30s
- [ ] Legenda com hook nos primeiros 125 caracteres
- [ ] CTA leve e específico, coerente com topo de funil
- [ ] Nenhum clichê da lista "never use" presente

## Veto Conditions

Reject and redo if ANY are true:
1. O roteiro não tem hook definido nos primeiros 2 segundos
2. O CTA usa linguagem de venda direta ("compre", "assine agora") incompatível com conteúdo de aquisição
