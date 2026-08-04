---
execution: subagent
agent: ivo-instagram
format: instagram-reels
inputFile: squads/growth-conteudo/output/angle-selection.md
outputFile: squads/growth-conteudo/output/content-instagram-reels.md
model_tier: powerful
---

# Step 8: Criar Conteúdo Instagram Reels

Ivo Instagram escreve o roteiro completo de Instagram Reels a partir do ângulo aprovado, seguindo as regras de Reels injetadas automaticamente pelo Pipeline Runner (`format: instagram-reels`).

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/angle-selection.md` — ângulo aprovado no step 7
- `squads/growth-conteudo/agents/ivo-instagram/tasks/create-instagram-reels.md` — task executada nesta etapa
- `squads/growth-conteudo/pipeline/data/tone-of-voice.md` — tom escolhido/recomendado para o ciclo
- `squads/growth-conteudo/pipeline/data/quality-criteria.md` — critérios de vídeo aplicáveis

## Instructions

### Process
1. Ler o ângulo aprovado e confirmar pilar e gatilho psicológico.
2. Rodar o diagnóstico de pré-escrita (nível de consciência do público: não-consciente/desconhece o produto).
3. Escrever o roteiro completo: hook (0-2s), setup (2-5s), delivery (5-18s, corte a cada 3-5s), CTA (últimos 3-5s) — CTA sempre leve.
4. Escrever legenda (hook nos primeiros 125 caracteres) e selecionar 5-15 hashtags.
5. Rodar o Copy Stress Test e verificar acentuação em português antes de entregar.

## Output Format

```
=== REEL SCRIPT ===
Ângulo: [id/título]

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
[hook — até 125 chars]
[corpo]
[CTA/pergunta]

=== HASHTAGS ===
#tag1 #tag2 ... (5-15)

=== AUDIO NOTE ===
[direção de áudio]
```

## Output Example

Ver `squads/growth-conteudo/pipeline/data/output-examples.md`, Exemplo 2 ("eu não escolhi. o site escolheu por mim") — roteiro completo pronto para uso como referência direta.

## Veto Conditions

Reject and redo if ANY of these are true:
1. O roteiro não tem hook definido nos primeiros 2 segundos
2. O CTA usa linguagem de venda direta incompatível com conteúdo de aquisição

## Quality Criteria

- [ ] Duração total entre 15-30s
- [ ] Legenda com hook nos primeiros 125 caracteres
- [ ] Corte de plano indicado a cada 3-5 segundos
- [ ] Nenhum clichê da lista "never use" do agente presente
