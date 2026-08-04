---
execution: subagent
agent: ivo-instagram
inputFile: squads/growth-conteudo/output/calendario-editorial.md
outputFile: squads/growth-conteudo/output/angles.md
model_tier: powerful
---

# Step 6: Gerar Ângulos de Conteúdo

Ivo Instagram gera o conjunto de ângulos (ideias centrais, agnósticas de formato) a partir do calendário editorial aprovado. Este conjunto único de ângulos serve os 3 formatos-alvo do ciclo (Instagram Reels, Instagram Feed e TikTok) — Tais TikTok não gera ângulo próprio, ela adapta o ângulo escolhido para TikTok na etapa de criação (step 10).

## Context Loading

Load these files before executing:
- `squads/growth-conteudo/output/calendario-editorial.md` — calendário aprovado no step 5
- `squads/growth-conteudo/output/research-brief.md` — achados relevantes do ciclo
- `squads/growth-conteudo/agents/ivo-instagram/tasks/generate-angles.md` — task executada nesta etapa
- `squads/growth-conteudo/pipeline/data/tone-of-voice.md` — variações de tom disponíveis

## Instructions

### Process
1. Ler o calendário editorial e identificar os pilares de conteúdo priorizados para este ciclo.
2. Gerar 4-6 ângulos concretos cobrindo os pilares priorizados, garantindo que cada ângulo sirva aos 3 formatos-alvo sem depender de um específico.
3. Atribuir a cada ângulo um gatilho psicológico dominante distinto dos demais.
4. Verificar que pelo menos um ângulo usa o diferencial único do produto (sorteio real de livro).
5. Escrever a justificativa de aquisição (não retenção) de cada ângulo.

## Output Format

```
ÂNGULO [N]: "[título]"

Pilar: [pilar do calendário]
Gatilho psicológico dominante: [gatilho]
Formatos cobertos: TikTok, Instagram Reels, Instagram Feed

Por que serve aquisição:
[justificativa]

Execução sugerida por formato:
- TikTok/Reels: [direção]
- Feed: [direção]

Risco a evitar: [risco específico deste ângulo]
```
(repetir para cada um dos 4-6 ângulos)

## Output Example

Ver `squads/growth-conteudo/pipeline/data/output-examples.md`, Exemplo 1, e `squads/growth-conteudo/agents/ivo-instagram/tasks/generate-angles.md`, seção Output Example, para dois ângulos completos ("O sorteio não é aleatório de qualquer jeito" e "Isso ou aquilo: romantasy vs terror") aplicáveis diretamente como referência de profundidade.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Nenhum ângulo do conjunto usa o mecanismo único do produto (sorteio real)
2. Dois ou mais ângulos compartilham o mesmo gatilho psicológico dominante

## Quality Criteria

- [ ] 4-6 ângulos entregues, cada um com gatilho distinto
- [ ] Todo ângulo serve aos 3 formatos-alvo sem depender de um específico
- [ ] Justificativa de aquisição presente em cada ângulo
- [ ] Nenhum ângulo usa CTA de venda direta na descrição da execução sugerida
