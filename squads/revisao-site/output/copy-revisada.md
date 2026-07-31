# Copy revisada — Sorteia

Nome escolhido: **Sorteia**. Tom mantido: direto, curto, informal-leve, emoji pontual (🎲📚).

## Header (logo/nome)
- Atual: `📚 Sistema de Livros`
- Novo: `🎲 Sorteia`

## Title / meta description (SEO, `app/layout.tsx`)
- Atual title: "Sistema de Livros — Sorteie sua próxima leitura"
- Novo title: **"Sorteia — Ache seu próximo livro em um clique"**
- Atual description: "Sorteie um livro aleatório de todo o catálogo ou por categoria (Filosofia, Ficção, Culinária e mais) e compre com um clique na Amazon, Mercado Livre ou Shopee."
- Nova description: **"Sorteia um livro aleatório do catálogo ou por categoria — de Romance a Ciências — e compra na Amazon em um clique."** (removida menção a Mercado Livre/Shopee, já que só o botão da Amazon existe hoje)

## Hero headline — 3 variações

**A (atual, mínimo ajuste):** "Não sabe o que ler? Sorteia um livro."
Gatilho: resolução direta de indecisão — já testa bem, mantém a familiaridade.

**B (curiosidade + nome):** "Seu próximo livro favorito está a um sorteio de distância."
Gatilho: curiosidade + usa o verbo-marca "sorteio" reforçando o nome novo.

**C (urgência leve):** "Parou de ler por falta de ideia? Sorteia agora e resolve."
Gatilho: nomeia o problema (parou de ler) antes da solução.

**Recomendação: A** — já passa no teste do scroll, é a mais curta, e não precisa reaprender nada de quem já conhece o site.

## Subheadline
- Atual: "Clique em "Sortear livro" para receber uma sugestão aleatória de todo o catálogo, ou escolha uma categoria antes de sortear."
- Novo: **"Clique em "Sortear livro" pra receber uma sugestão aleatória do catálogo, ou escolhe a categoria e a quantidade antes de sortear."** (menção à quantidade, que hoje não é citada no texto de apoio mas já existe na UI)

## Dropdown de categoria (placeholder)
- Mantém: "Todas as categorias" (já é claro e consistente)

## Seletor de quantidade
- Mantém: "1 livro" / "2 livros" / "3 livros" (já é claro)

## Botão principal
- Mantém: "🎲 Sortear livro" (estado inicial) / "Sortear de novo" (após resultado)
- Justificativa: é o texto mais alinhado ao nome novo (mesmo verbo), não precisa mudar.

## Botão de compra (BookResult)
- Mantém: "Comprar na amazon" — já é específico e direto, não precisa de CTA mais forte.

## Rodapé
- Atual: "Feito com Next.js. Os links de loja podem conter código de afiliado — isso não altera o preço que você paga."
- Novo: **"Feito com 🎲 e Next.js. Os links de compra podem ter código de afiliado — isso não muda o preço que você paga."** (link com o nome/emoji da marca, "código de afiliado" plural "links de loja" → "links de compra" já que só Amazon resta)

## Erro de conexão
- Mantém: "Erro de conexão. Tente novamente." (já direto, não precisa mudar)

---

## Review — Renata Revisão

```
==============================
 VEREDITO: APROVAR
==============================

| Critério                          | Nota | Justificativa                                                          |
|------------------------------------|------|--------------------------------------------------------------------------|
| Alinhamento com tom da marca       | 9/10 | Mantém registro direto/informal-leve pedido, sem desvio                 |
| Clareza do CTA                     | 9/10 | Botão e botão de compra continuam comando direto, sem mudança desnecessária |
| Ausência de clichê                 | 10/10| Nenhum termo da lista proibida (jargão, "descubra o mundo") aparece     |
| Consistência com nome escolhido    | 8/10 | "Sorteia" integrado no header, title e rodapé de forma natural          |
| Precisão factual                   | 9/10 | Description corrigida remove Mercado Livre/Shopee (não existem mais no site) |

Ponto forte: a variação A do headline foi mantida como recomendação em vez de trocar por
trocar — evita reaprendizado desnecessário pra quem já usa o site, e já passa no teste do
scroll.

Ponto forte: a correção da meta description (removendo Mercado Livre/Shopee) é uma correção
factual importante que não estava no escopo original mas evita descrição enganosa em SEO.

Sugestão (opcional): no rodapé, "código de afiliado" ainda é termo um pouco técnico —
poderia virar "link de indicação", mas não é bloqueante, é vocabulário já usado antes no site.

VEREDITO: APROVAR — critérios essenciais atendidos, uma sugestão não-bloqueante registrada.
```
