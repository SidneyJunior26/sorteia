# Vídeo de Persona — Roteiro de Performance (Ciclo 1)

Complementa `content-tiktok.md` / `content-instagram-reels.md`: em vez de gravação de
tela pura, o usuário vai produzir um clipe com uma criadora (persona de IA) performando
o roteiro, depois emendar com a própria gravação de tela do MacBook mostrando o site.

## Status de geração

- **Persona/referência visual**: gerada via Higgsfield (`soul_2`), salva em
  `squads/growth-conteudo/output/visuals/persona-referencia.png`. Mulher, ~late 20s,
  cabelo castanho ondulado, quarto aconchegante com estante de livros ao fundo,
  camiseta branca + shorts pretos.
- **Storyboard/clipe de vídeo**: NÃO gerado. O storyboard (`gpt_image_2`) e o clipe
  (Seedance) exigem plano Higgsfield Basic/Plus/Ultra — a conta está no plano free
  (1,88 crédito restante) e o usuário optou por não assinar/usar trial agora.
- **Decisão do usuário (2026-08-03)**: produzir o vídeo da persona manualmente via
  Artflow (`app.artflow.ai/actor-studio`), fora do fluxo automatizado do squad — sem
  créditos suficientes em nenhuma das duas ferramentas para gerar via IA nesta etapa.
  Artflow exige login próprio do usuário (Playwright roda headless neste ambiente, sem
  janela visível pro usuário logar) — produção 100% manual a partir daqui.

## Roteiro de performance (usar no Artflow ou qualquer ferramenta de avatar)

**Direção geral:** mulher empolgada, talking-head direto pra câmera, tom cru/genuíno
(sem produção polida) — consistente com o achado de maior confiança da pesquisa do
ciclo (`research-brief.md`: formato cru vence produzido no BookTok Brasil).

**Fala (contínua, ~15-20s):**

> "Gente, eu jurei que ia cair alguma coisa aleatória mesmo, tipo qualquer coisa. Deixa
> eu te mostrar—" **[vira a câmera/celular 180° aqui, de frente pro rosto dela para
> apontando pra frente]** "—para! CAIU ESSE! Eu não fazia ideia que esse livro existia,
> juro! Olha a sinopse... isso aqui é exatamente o meu gênero! Manda pra quem também
> não sabe o que ler essa semana!"

**Ponto de corte:** a virada de câmera na linha "Deixa eu te mostrar" é onde o usuário
vai substituir o vídeo pela própria gravação de tela do MacBook (mostrando o sorteio no
site), mantendo o áudio da persona contínuo por baixo da nova imagem a partir desse
ponto — edição feita fora deste squad, no editor de vídeo do usuário.

**Requisitos pra manter no vídeo final:**
- Áudio contínuo do início ao fim, sem corte, mesmo depois da troca de imagem.
- Sem trilha/efeito sonoro dramático (achado de confiança ALTA da pesquisa: cru > produzido).
- Duração total do clipe final: 15-30s (padrão do squad pra Reels/TikTok).

## Próximos passos (fora deste squad)

1. Usuário gera o clipe da persona no Artflow (Sample Actor pronto, ex. Barbara/Mary,
   ou actor próprio) performando o roteiro acima.
2. Usuário filma a tela do MacBook mostrando o sorteio real no site.
3. Usuário edita os dois vídeos juntos no ponto de corte indicado.
4. Resultado final volta pro squad para revisão da Vera Veredito (mesmo processo do
   step 13) antes de publicar, se o usuário quiser esse gate de qualidade novamente.
