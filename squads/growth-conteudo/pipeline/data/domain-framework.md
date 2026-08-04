# Domain Framework — Growth Conteúdo (Achei Meu Livro)

Framework operacional que orienta como o squad transforma tendência → estratégia → conteúdo → visual → publicação. Cada agente aplica a fatia relevante deste framework; este arquivo é a visão de conjunto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1. Pesquisa de Tendências (Rita Referência)

1. Receber foco de pesquisa do usuário (tema + janela de tempo) via checkpoint.
2. Varredura em fontes de nicho (BookTok/Bookstagram Brasil): imprensa especializada, TikTok Newsroom, blogs de creator economy do nicho literário.
3. Cruzar achados com o `research-brief.md` já compilado — atualizar, nunca substituir cegamente.
4. Classificar cada tendência por estágio de ciclo de vida: emergente / crescimento / madura / declinando.
5. Atribuir nível de confiança (alta/média/baixa) a cada achado, com justificativa.
6. Entregar brief estruturado com angles ranqueados por potencial de adequação ao produto (Achei Meu Livro), não só por popularidade genérica.

## 2. Estratégia e Calendário Editorial (Gustavo Growth)

1. Ler o research-brief do ciclo + o roadmap de crescimento (`output/growth-roadmap.md`) já existente.
2. Confirmar em qual fase do roadmap o ciclo atual se encontra (Fase 1 calibração / Fase 2 tração / Fase 3 consolidação).
3. Selecionar 1-2 pilares de conteúdo prioritários para este ciclo (nunca todos ao mesmo tempo — regra do strategist: fewer channels/pilares done well).
4. Montar calendário editorial de curto prazo (1 ciclo = tipicamente 1-2 semanas de conteúdo) com formato, plataforma e tema por peça.
5. Ajustar o roadmap se a pesquisa do ciclo revelar mudança relevante (novo gênero em alta, formato saturando) — documentar o ajuste, nunca reescrever o roadmap inteiro sem justificativa.
6. Definir a métrica de sucesso do ciclo (save rate, retenção 3s, ou CTR — dependendo da fase).

## 3. Geração de Ângulos (Ivo Instagram)

1. Ler o calendário editorial aprovado.
2. Gerar 4-6 ângulos de conteúdo cobrindo os 3 formatos-alvo (Instagram Reels, Instagram Feed, TikTok) — ângulo é a ideia central, não a execução por formato.
3. Cada ângulo usa um gatilho psicológico e um pilar de conteúdo distintos (evitar repetição de gatilho entre ângulos).
4. Apresentar ângulos com justificativa curta (por que este ângulo serve o objetivo de aquisição, não só de leitores que já conhecem o site).
5. Aguardar checkpoint de escolha do ângulo antes de qualquer execução por formato.

## 4. Criação de Conteúdo por Formato (Ivo Instagram + Tais TikTok)

1. Partir do ângulo escolhido — nunca divergir para um ângulo diferente sem aprovação.
2. Aplicar as regras de formato injetadas automaticamente pelo Pipeline Runner (`format:` no step) — Reels, Feed/carrossel, ou TikTok (via convenção de Reels, documentada como reaproveitamento).
3. Seguir a metodologia de copywriting: diagnóstico prévio (nível de consciência do público — aqui majoritariamente "não-consciente"/desconhece o site), 3 hooks antes do corpo, CTA calibrado à intensidade certa (aquisição = CTA leve, nunca hard-sell).
4. Rodar o Copy Stress Test antes de entregar.
5. Entregar roteiro/carrossel completo pronto para a Duda Design renderizar.

## 5. Renderização Visual (Duda Design)

1. Ler o conteúdo aprovado (roteiro de Reels/TikTok para capa de vídeo; carrossel completo para slides).
2. Definir/reaproveitar o design system da marca (cores, tipografia, grid) alinhado ao tom direto/informal-leve do site.
3. Renderizar HTML→imagem para cada slide do carrossel; gerar thumbnail de capa para Reels/TikTok.
4. Verificar a primeira peça renderizada antes de gerar o lote completo.
5. Entregar manifesto de arquivos gerados com caminhos.

## 6. Revisão de Qualidade (Vera Veredito)

1. Ler copy + visual juntos — nunca avaliar isoladamente.
2. Pontuar cada critério objetivo definido em `quality-criteria.md`.
3. Aplicar gatilho de rejeição automática: qualquer critério abaixo de 4/10 é REJECT, independente da média.
4. Se REJECT, apontar exatamente o que mudar e onde — nunca feedback vago.
5. Se APPROVE, seguir para checkpoint final antes de publicação.

## 7. Publicação (Paulo Publica)

1. Confirmar que o conteúdo passou pela revisão da Vera Veredito com veredito APPROVE.
2. Rodar dry-run em cada plataforma-alvo (Instagram via skill `instagram-publisher`; TikTok via ferramenta MCP nativa `tiktok_publish` do Higgsfield — não é skill instalada).
3. Apresentar preview estruturado e aguardar confirmação explícita do usuário — nunca publicar sem esse "ok" verbal.
4. Publicar sequencialmente (nunca em paralelo) e reportar resultado de cada plataforma antes de seguir para a próxima.
5. Registrar URLs e IDs de post no log de publicação.

## Decisões Estruturais do Squad

- **Ângulos cobrem os 3 formatos de uma vez** (passo 3): Tais TikTok não tem task própria de geração de ângulo porque o ângulo é a ideia central, agnóstica de formato — ela recebe o mesmo ângulo aprovado e adapta para TikTok na etapa de criação.
- **TikTok reaproveita `instagram-reels.md`**: não existe best-practice file dedicado para TikTok neste repositório. A lógica estrutural (vídeo vertical curto, hook nos primeiros segundos, corte de ritmo a cada poucos segundos) é a mesma; o `format:` do step de TikTok injeta `instagram-reels.md` explicitamente por esse motivo.
- **Checkpoint obrigatório antes de qualquer renderização ou publicação** (Gate 2b): aprovação de conteúdo antes da Duda renderizar; aprovação final antes do Paulo publicar.
