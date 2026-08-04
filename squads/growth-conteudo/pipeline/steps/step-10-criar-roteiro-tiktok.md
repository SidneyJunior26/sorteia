---
execution: subagent
agent: tais-tiktok
format: instagram-reels
inputFile: squads/growth-conteudo/output/angle-selection.md
outputFile: squads/growth-conteudo/output/content-tiktok.md
model_tier: powerful
---

# Step 10: Criar Roteiro TikTok

Tais TikTok adapta o mesmo ângulo aprovado em um roteiro de vídeo curto vertical nativo do TikTok Brasil.

**Nota de design sobre o campo `format`:** não existe best-practice file dedicado a TikTok em `_opensquad/core/best-practices/` neste repositório. Este step usa `format: instagram-reels` deliberadamente — é a base estrutural mais próxima (vídeo vertical curto, hook nos primeiros segundos, corte de ritmo, CTA no fechamento). A adaptação de tom para o registro mais cru da comunidade BookTok Brasil é responsabilidade da persona de Tais TikTok (ver `agents/tais-tiktok.agent.md`), não do arquivo de formato injetado.

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/angle-selection.md` — ângulo aprovado no step 7 (mesmo ângulo dos steps 8 e 9)
- `squads/growth-conteudo/agents/tais-tiktok/tasks/create-tiktok-script.md` — task executada nesta etapa
- `squads/growth-conteudo/pipeline/data/tone-of-voice.md` — tom escolhido/recomendado para o ciclo
- `squads/growth-conteudo/pipeline/data/research-brief.md` — vocabulário e comportamento da comunidade BookTok Brasil

## Instructions

### Process
1. Ler o ângulo aprovado e identificar o que precisa ser adaptado para soar nativo do TikTok (tom mais cru, vocabulário de comunidade BookTok).
2. Escrever hook (0-2s), setup (2-5s) e delivery (5-18s/22s), nomeando o corte de plano a cada 3-5 segundos.
3. Escrever o CTA final leve, no tom de comunidade ("manda pra quem precisa", "salva").
4. Escrever legenda curta e hashtags de nicho (#booktokbrasil e correlatos).
5. Indicar direção de áudio (som nativo/trending, se coerente com o conteúdo).

## Output Format

```
=== ROTEIRO — TikTok ===
Ângulo: [id/título]
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
[legenda curta, tom de comunidade]

=== HASHTAGS ===
#booktokbrasil #tag2 ...

=== AUDIO NOTE ===
[som nativo/trending, se aplicável]
```

## Output Example

Ver `squads/growth-conteudo/pipeline/data/output-examples.md`, Exemplo 2, adaptando o tom para o registro mais cru do TikTok (menos produção, mais reação imediata).

## Veto Conditions

Reject and redo if ANY of these are true:
1. O roteiro diverge do ângulo aprovado no checkpoint (introduz tema não aprovado)
2. O tom soa institucional/de marketing em vez de cru e nativo da comunidade BookTok

## Quality Criteria

- [ ] Hook nos primeiros 1-2 segundos, sem introdução institucional
- [ ] Corte de plano indicado a cada 3-5 segundos
- [ ] CTA leve, no tom de comunidade do TikTok
- [ ] Acentuação completa em português
