# Conceito de logo — Sorteia

## Sistema de design

- **Cor primária:** `#7c3aed` (brand-600, já usada no botão "Sortear livro")
- **Elemento gráfico:** hexágono de linha (silhueta de um dado visto em perspectiva isométrica) com um livro aberto saindo do topo, um ponto de dado marcado na "página" do meio.
- **Estilo:** flat/outline minimalista, sem gradiente, sem texto embutido — pensado para funcionar como ícone isolado (favicon) e ao lado do wordmark "Sorteia".

Racional: mantém a paleta roxa já em produção (sem dissonância com o botão/header atuais) e comunica "dado + livro" (sorteio de livro) numa peça só, sem precisar de texto de apoio.

## Prompt usado (Higgsfield, `nano_banana_2`, 1:1, 1k)

```
Minimalist abstract logo mark combining a six-sided die and an open book silhouette,
geometric flat design, single color deep purple #7c3aed on white background, no text,
no gradients, clean vector icon style, centered composition, small favicon-friendly
```

Resultado: `squads/revisao-site/output/assets/logo-conceito-01.png`

---

## Review — Renata Revisão

```
==============================
 VEREDITO: APROVAR COM RESSALVAS
==============================

| Critério                          | Nota | Justificativa                                                             |
|------------------------------------|------|------------------------------------------------------------------------------|
| Uso da paleta existente            | 10/10| Cor única #7c3aed, exatamente o brand-600 já usado no botão principal        |
| Ausência de texto malformado       | 10/10| Nenhum texto na imagem — não há risco de IA errar renderização de texto      |
| Conceito remete a sorteio+livro    | 7/10 | O livro é claro; o "dado" fica sugerido pelo hexágono + ponto, mas não é óbvio que é um dado sem a explicação ao lado |
| Legibilidade em tamanho pequeno    | 6/10 | Em favicon (16-32px) as linhas finas do hexágono tendem a sumir; só o livro central continua reconhecível |
| Simplicidade/ausência de ruído     | 9/10 | Composição limpa, sem elementos extras                                       |

Ponto forte: a cor está perfeitamente alinhada com a marca já em produção — zero dissonância
visual com o botão "Sortear livro" existente.

Ponto forte: composição centrada e sem gradientes facilita reaproveitar em qualquer fundo
(claro ou escuro) com pouca adaptação.

Sugestão (não-bloqueante): se for virar favicon de verdade, vale simplificar mais — usar só
o livro (sem o contorno do hexágono/dado) numa versão "reduzida" para 16-32px, já que o
dado se perde nesse tamanho. Isso é ajuste de versão, não motivo pra rejeitar o conceito.

VEREDITO: APROVAR COM RESSALVAS — conceito sólido e on-brand; recomendo criar uma variante
simplificada só pra favicon antes de aplicar em produção.
```

---

**Decisão do usuário (checkpoint final, 2026-07-31):** aprovado como referência de marca (ex: og-image, redes sociais). Favicon/header continuam usando o emoji 🎲 por enquanto — sem aplicação de arquivo de logo no código nesta rodada.
