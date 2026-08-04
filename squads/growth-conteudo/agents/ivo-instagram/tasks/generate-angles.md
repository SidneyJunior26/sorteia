---
task: "Generate Angles"
order: 1
input: |
  - editorial_calendar: Conteúdo de output/calendario-editorial.md (pilares, cadência, temas do ciclo)
  - research_brief: Achados relevantes de output/research-brief.md (tendências ranqueadas)
output: |
  - angles: Lista de 4-6 ângulos de conteúdo cobrindo Instagram Reels, Instagram Feed e TikTok
---

# Generate Angles

Gera um conjunto de ângulos de conteúdo — ideias centrais agnósticas de formato — a partir do calendário editorial aprovado. Cada ângulo deve servir aos 3 formatos-alvo do squad (Reels, Feed, TikTok), já que Tais TikTok não gera ângulo próprio: ela adapta o ângulo aprovado aqui para o formato TikTok na etapa de criação.

## Process

1. Ler o calendário editorial e identificar os pilares de conteúdo priorizados para este ciclo.
2. Para cada pilar, gerar 1-2 ângulos concretos (ideia central + tema específico), garantindo que nenhum ângulo dependa de um formato específico para funcionar.
3. Atribuir a cada ângulo um gatilho psicológico dominante distinto dos demais (evitar repetição de gatilho entre ângulos do mesmo ciclo).
4. Verificar que pelo menos um ângulo do conjunto usa o diferencial único do produto (sorteio real) — nunca entregar um conjunto só de ângulos genéricos de nicho.
5. Para cada ângulo, escrever uma justificativa curta de por que serve à aquisição (público que não conhece o site), não à retenção.
6. Compilar o conjunto final (4-6 ângulos) em markdown, pronto para o checkpoint de escolha.

## Output Format

```yaml
angles:
  - id: "angulo-1"
    title: "..."
    pillar: "..."
    psychological_driver: "..."
    formats_covered: ["instagram-reels", "instagram-feed", "tiktok"]
    acquisition_rationale: "..."
    risk_to_avoid: "..."
```

## Output Example

> Ver `pipeline/data/output-examples.md`, Exemplo 1, para um ângulo completo aplicado ("O sorteio não é aleatório de qualquer jeito"). Trecho adicional:

```
ÂNGULO 1: "Isso ou aquilo: romantasy vs terror"

Pilar: Isso ou aquilo (25% da cadência)
Gatilho psicológico dominante: Pertencimento (tomar um lado gera identificação com
um grupo de leitores)
Formatos cobertos: TikTok, Instagram Reels, Instagram Feed

Por que serve aquisição:
Debate de gênero é formato que já performa bem no nicho geral de BookTok — atrai
gente que talvez nem soubesse do site, mas se interessa pelo tema do debate e
descobre o produto de forma indireta, sem sentir que está sendo vendido algo.

Execução sugerida por formato:
- TikTok/Reels: vídeo rápido com dois livros do catálogo, um de cada gênero,
  pedindo pro público comentar o favorito.
- Feed: carrossel formato Mito vs Realidade adaptado para "motivos pra escolher
  romantasy" vs "motivos pra escolher terror".

Risco a evitar: parecer debate raso sem ligação com o produto — sempre fechar
com CTA de "sorteia um dos dois no site" para ancorar no mecanismo real.
```

## Quality Criteria

- [ ] 4-6 ângulos entregues, cada um com gatilho psicológico distinto
- [ ] Pelo menos um ângulo usa o diferencial único do produto (sorteio real)
- [ ] Todo ângulo serve aos 3 formatos-alvo sem depender de um específico
- [ ] Justificativa de aquisição (não retenção) presente em cada ângulo

## Veto Conditions

Reject and redo if ANY are true:
1. Nenhum ângulo do conjunto usa o mecanismo único do produto (sorteio real)
2. Dois ou mais ângulos compartilham o mesmo gatilho psicológico dominante
