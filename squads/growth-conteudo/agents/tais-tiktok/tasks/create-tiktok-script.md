---
task: "Create TikTok Script"
order: 1
input: |
  - chosen_angle: Ângulo aprovado pelo usuário no checkpoint (output/angle-selection.md)
  - format_rules: Regras estruturais injetadas pelo Pipeline Runner via campo format (instagram-reels.md — reaproveitado como base mais próxima, sem best-practice dedicado a TikTok neste repositório)
output: |
  - tiktok_script: Roteiro completo de vídeo curto TikTok (hook, setup, delivery, CTA), legenda e hashtags
---

# Create TikTok Script

Adapta o ângulo aprovado em um roteiro de vídeo curto vertical nativo do TikTok Brasil, reaproveitando a lógica estrutural de Reels (hook-first, corte de ritmo, CTA leve) por não existir best-practice file dedicado a TikTok neste repositório, mas ajustando tom e linguagem para o registro mais cru da comunidade BookTok.

## Process

1. Ler o ângulo aprovado e identificar o que precisa ser adaptado para soar nativo do TikTok (tom mais cru, menos produzido, vocabulário de comunidade BookTok).
2. Escrever o hook (0-2s): texto na tela + fala inicial que crie curiosidade ou reação imediata — evitar qualquer introdução institucional.
3. Escrever o setup (2-5s) e a entrega (5-18s/22s), nomeando o corte de plano a cada 3-5 segundos.
4. Escrever o CTA final (últimos 3-5s): leve, no tom de comunidade ("manda pra quem precisa", "salva"), nunca venda direta.
5. Escrever a legenda curta e as hashtags de nicho (#booktokbrasil e correlatos).
6. Indicar direção de áudio (som nativo/trending do TikTok, se aplicável e coerente com o conteúdo — nunca forçado).
7. Verificar acentuação completa em português e ausência de linguagem de marketing corporativo.

## Output Format

```
=== ROTEIRO — TikTok ===
Ângulo: [id/título do ângulo]
Duração alvo: [15-30s]

HOOK (0-2s):
[Visual]: ...
[Texto overlay]: ...
[Áudio]: ...

SETUP (2-5s):
[Visual]: ...
[Script]: ...

DELIVERY (5-18s):
[Visual]: ...
[Script]: ...
[Corte]: troca de plano a cada 3-4s

CTA (últimos 3-5s):
[Visual]: ...
[Script]: ...
[Texto overlay]: ...

=== LEGENDA ===
[Legenda curta, tom de comunidade]

=== HASHTAGS ===
#booktokbrasil #tag2 ...

=== AUDIO NOTE ===
[Som nativo/trending, se aplicável]
```

## Output Example

> Ver `pipeline/data/output-examples.md`, Exemplo 2, para o roteiro completo "eu não escolhi. o site escolheu por mim" — mesma estrutura serve como referência de profundidade, ajustando tom para o registro mais cru do TikTok quando aplicável.

## Quality Criteria

- [ ] Hook nos primeiros 1-2 segundos, sem introdução institucional
- [ ] Corte de plano indicado a cada 3-5 segundos
- [ ] CTA leve, no tom de comunidade do TikTok
- [ ] Legenda e hashtags de nicho presentes (#booktokbrasil ou equivalente)
- [ ] Acentuação completa em português

## Veto Conditions

Reject and redo if ANY are true:
1. O roteiro diverge do ângulo aprovado no checkpoint (introduz tema não aprovado)
2. O tom soa institucional/de marketing em vez de cru e nativo da comunidade BookTok
