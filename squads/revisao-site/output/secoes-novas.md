# Avaliação: seções novas para a landing page

**Agente:** Bruno Growth (Estrategista de Conteúdo)
**Data:** 2026-08-02
**Insumo:** copy atual da página (`app/page.tsx`, `app/layout.tsx`), perfil de audiência/tom de `_opensquad/_memory/company.md`.

Contexto usado pra avaliar: a página hoje tem só headline animada +
uma linha de subheadline + o widget de sorteio. Nenhuma seção
explicativa/persuasiva existe. Público confirmado: "leitores
indecisos, sem um livro específico em mente, buscando descoberta
rápida de próxima leitura." Tom: direto, frases curtas,
informal-leve, foco em ação/CTA.

---

## Seção 1: "Por que usar o Achei Meu Livro"

**Veredito: recomendo — mas curto, não uma seção pesada.**

Motivo: o leitor indeciso hoje resolve "o que ler" de três jeitos —
pesquisa solta no Google, rola recomendação do Goodreads, ou pergunta
pra alguém. A objeção real antes de usar o sorteio é "por que confiar
num aleatório em vez de escolher eu mesmo com calma?". Isso merece
resposta, mas em 2-3 linhas — uma seção grande aqui compete com o
caminho rápido que é o próprio diferencial do produto.

### Copy

**Por que sortear em vez de escolher?**
Escolher entre milhares de livros trava mais do que ajuda — é o
próprio motivo de você não saber o que ler. Aqui você sorteia um
livro real, do catálogo sincronizado com a Amazon, com sinopse e onde
comprar na hora. Sem pesquisa, sem decisão, sem demora.

---

## Seção 2: "Como funciona" (explicador passo a passo)

**Veredito: não recomendo.**

Motivo: a subheadline atual já cobre isso em uma linha — "Clique em
'Sortear livro' pra receber uma sugestão aleatória do catálogo, ou
escolha a categoria e a quantidade antes de sortear." O próprio nome
do botão ("🎲 Sortear livro") já é auto-evidente. Um explicador de 3
passos aqui só adiciona scroll pra repetir informação que o usuário
já tem antes de clicar — o custo (mais rolagem antes da ação
principal) não se paga.

**Sugestão opcional, não-bloqueante:** se algo merece uma linha extra,
é de onde vêm os livros (não é geração aleatória de qualquer coisa —
é catálogo real sincronizado da Google Books/Amazon). Isso já está
parcialmente coberto na seção 1 acima; não precisa de seção própria.

---

## Seção 3: gancho de crescimento (atrair/reter usuário)

**Veredito: recomendo o copy, mas com uma ressalva importante — depende de um mecanismo de produto que ainda não existe no código.**

Motivo: hoje não existe nenhum botão de compartilhar o resultado do
sorteio, nem qualquer coisa que vire convite. Um gancho de
crescimento genuíno (não só uma frase de marketing) precisa de uma
ação real por trás — aqui, a mais natural é deixar o usuário
compartilhar o livro que ele sorteou (rede social ou link direto),
transformando o resultado em algo que se propaga sozinho.

**Isto requer mudança de produto**, não só copy: um botão "Compartilhar
esse sorteio" no `BookResult.tsx` que gere um link (ex:
`/?book=<id>` ou similar) ou imagem do resultado. Sem esse botão, o
copy abaixo fica sem função — não recomendo publicar o texto até o
mecanismo existir.

### Copy (pronto para quando o botão de compartilhar existir)

**Microcopy do botão:** "Compartilhar esse sorteio"

**Texto de apoio (opcional, perto do botão):**
Sorteou um livro bom? Manda pra quem também nunca sabe o que ler.

---

## Resumo

| Seção | Veredito | Copy pronto? |
|---|---|---|
| Por que usar o Achei Meu Livro | Recomendo | Sim, acima |
| Como funciona | Não recomendo | — |
| Gancho de crescimento (compartilhar) | Recomendo o copy, condicionado a mudança de produto | Sim, acima (não publicar sem o botão) |

---

# Revisão — Renata Revisão

```
==============================
 VEREDITO: APROVAR
==============================

| Critério                                          | Nota  | Justificativa                                                                                  |
|----------------------------------------------------|-------|--------------------------------------------------------------------------------------------------|
| Veredito explícito por seção, com motivo            | 9/10  | As três seções têm recomendo/não recomendo declarado antes de qualquer copy, motivo ancorado no público confirmado |
| Copy completo nas seções recomendadas               | 9/10  | Seção 1 e 3 vêm com texto pronto, não outline; nenhuma lacuna deixada pro usuário preencher       |
| Sinalização de mecanismo de produto inexistente     | 10/10 | O gancho de compartilhar é explicitamente marcado como "requer mudança de produto" e instrui a não publicar o copy sem o botão — segue a regra à risca |
| Ausência de clichê / jargão proibido                | 9/10  | Nenhum termo da lista proibida da Carla Copy aparece ("descubra", "sistema", "plataforma", superlativo vago) |
| Consistência de tom (direto/informal-leve)          | 8/10  | Registro consistente com o resto do site; a seção 1 poderia ser uma frase mais curta ainda, mas não quebra o tom |

Ponto forte: a seção 3 é o item mais fácil de errar aqui — muitos entregáveis
de growth prometem "compartilhe com amigos" sem o mecanismo existir. Bruno
separou claramente o copy pronto da condição de bloqueio ("não publicar sem
o botão"), o que evita a cilada de lançar uma promessa vazia no site.

Sugestão (opcional): a seção 2 poderia citar explicitamente que a decisão
de "não recomendar" já foi validada contra a subheadline atual (linha
exata citada) — já faz isso, então é só reforço, não bloqueia aprovação.

VEREDITO: APROVAR — nenhum critério abaixo de 4/10, média 9.0, pronto pro
checkpoint de aprovação do usuário.
```

