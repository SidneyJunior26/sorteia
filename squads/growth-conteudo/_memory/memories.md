# Squad Memory: Growth Conteúdo

## Estilo de Escrita

- Ângulo "vídeo cru, sem produção" (tela limpa + reação real, sem efeito/trilha) é a forma de execução validada pela pesquisa (research-brief.md ciclo 1, confiança ALTA) — priorizar sobre formatos mais produzidos/estéticos em ciclos futuros até haver dado que diga o contrário.

## Design Visual

- Design system do ciclo 1 (referência pra manter consistência entre ciclos, a menos que haja motivo pra mudar): Poppins, fundo escuro `#1F1B2E` / claro `#F7F3EC` / accent coral `#FF6B4A`, texto escuro `#201C2B` sobre accent (branco sobre accent só dá ~2,8:1 de contraste, abaixo do mínimo AA).
- Slide de "prova"/screenshot do produto: sempre usar print REAL do site (via Playwright contra `npm run dev` local), nunca mockup de UI — se a copy afirma "isso é print direto", a imagem tem que ser um print de verdade. Ciclo 1 pegou esse descompasso na revisão da Vera (mockup vs copy) e corrigiu antes de publicar.
- Slides renderizados em PNG; a skill `instagram-publisher` exige JPEG — converter antes do upload real.

## Estrutura de Conteúdo

- Cadência validada no ciclo 1: 2 pilares por ciclo (regra de Gustavo Growth, nunca mais que isso), 5 peças/semana (2 TikTok, 2 Reels, 1 Feed).

## Proibições Explícitas

- Nunca reportar dry-run/publish como sucesso sem credencial real configurada — se faltar token/conexão, reportar bloqueio explicitamente (ver publish-log.md ciclo 1), nunca simular resultado positivo.

## Técnico (específico do squad)

- **TikTok automatizado está bloqueado**: `mcp__claude_ai_Higgsfield__tiktok_connect` retorna erro de scope (escopos de Business API: `biz.spark.auth`, `tto.campaign.link`, `biz.creator.info` etc.) — provável exigência de conta TikTok Business/Creator do lado do app do Higgsfield. Usuário não tem CNPJ e decidiu (2026-08-03) manter TikTok manual permanentemente para este squad: filma o roteiro e publica direto pelo app. Não tentar `tiktok_connect` de novo em ciclos futuros sem o usuário pedir explicitamente.
- **Instagram automatizado está pendente de configuração**: `.env` não tem `INSTAGRAM_ACCESS_TOKEN`/`INSTAGRAM_USER_ID`/`IMGBB_API_KEY`. Usuário optou (2026-08-03) por publicar manual por enquanto e configurar depois. Não assumir que está configurado em ciclos futuros — checar `.env` antes do step 15.
- Nenhum vídeo é gerado por IA neste squad — os roteiros de Reels/TikTok são scripts de gravação real (o usuário filma), coerente com o ângulo "cru" validado pela pesquisa. Não confundir com Higgsfield `generate_video` (não usado neste squad).
- **Persona de IA (talking-head) via Higgsfield está bloqueada por plano**: conta Higgsfield é free (1,88 crédito), e o storyboard (`gpt_image_2`)/clipe (Seedance) do workflow `ugc-flow` exigem plano Basic/Plus/Ultra. Geração de imagem única (`soul_2`, persona) funciona no free, mas o resto do fluxo não. Usuário decidiu (2026-08-03) não assinar nem usar o trial gratuito de 3 dias por ora.
- **Artflow (`app.artflow.ai/actor-studio`) não é viável via automação neste ambiente**: o navegador Playwright roda headless, sem janela visível — o usuário não consegue logar nele (login dele no Safari não compartilha sessão com o Chromium do Playwright). Produção de vídeo de persona ficou 100% manual pro usuário (ver `output/video-persona-roteiro.md`). Não tentar automatizar login/Artflow de novo sem o usuário pedir explicitamente.
- Persona de referência gerada (Higgsfield `soul_2`) salva em `output/visuals/persona-referencia.png` — reaproveitar essa mesma persona/prompt se o usuário decidir gerar o clipe completo depois (créditos/plano permitindo), para manter consistência visual entre ciclos.
