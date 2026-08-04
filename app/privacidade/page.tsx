import Link from "next/link";

export const metadata = { title: "Política de Privacidade — Achei Meu Livro" };

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14 text-sm leading-relaxed text-foreground [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-brand-900 dark:[&_h1]:text-brand-100 [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-brand-900 dark:[&_h2]:text-brand-100 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_a]:text-brand-600 [&_a]:underline dark:[&_a]:text-brand-400">
      <h1>Política de Privacidade</h1>
      <p className="text-muted-foreground">Última atualização: agosto de 2026.</p>

      <p>
        O Achei Meu Livro ajuda você a sortear um livro pra ler e, se quiser
        criar uma conta, guardar os livros sorteados numa estante pessoal.
        Esta página explica quais dados coletamos, pra quê, e como você
        controla eles — conforme a Lei Geral de Proteção de Dados (Lei nº
        13.709/2018).
      </p>

      <h2>Quem coleta seus dados</h2>
      <p>
        O controlador dos dados é Sidney Junior, responsável pelo site. Para
        qualquer pedido sobre seus dados, escreva pra{" "}
        <a href="mailto:sidneyjunior26@gmail.com">
          sidneyjunior26@gmail.com
        </a>
        .
      </p>

      <h2>Sortear um livro sem cadastro</h2>
      <p>
        Sortear e comprar livros funciona sem criar conta. Nesse caso não
        coletamos nenhum dado pessoal seu — só um contador anônimo de
        cliques em cada link de compra (Amazon, Mercado Livre, Shopee), sem
        vínculo com quem clicou.
      </p>

      <h2>Se você cria uma conta</h2>
      <p>Ao se cadastrar, coletamos:</p>
      <ul>
        <li>
          <strong>Nome, e-mail e senha</strong> (cadastro direto) — a senha
          nunca é guardada em texto puro, só um hash bcrypt que nem nós
          conseguimos reverter;
        </li>
        <li>
          <strong>Nome, e-mail e foto de perfil</strong> (login com Google,
          se você escolher essa opção) — recebidos do Google, nunca sua
          senha do Google;
        </li>
        <li>
          <strong>Os livros que você guarda na sua estante</strong> (título,
          autor, capa, categoria) e o nome das prateleiras que você criar.
        </li>
      </ul>
      <p>
        Usamos isso só pra: autenticar seu login, exibir sua estante, e
        deixar você personalizar o título dela e das prateleiras. Nunca
        vendemos ou compartilhamos esses dados com terceiros para
        publicidade.
      </p>

      <h2>Cookies</h2>
      <p>
        Usamos um único cookie, estritamente necessário: o de sessão de
        login, que expira em 30 dias ou quando você clica em &ldquo;Sair&rdquo;.
        Não usamos cookies de rastreamento, analytics ou publicidade.
      </p>

      <h2>Por quanto tempo guardamos</h2>
      <p>
        Enquanto sua conta existir. Se você excluir sua conta, tudo
        relacionado a ela — perfil, estante e prateleiras — é apagado do
        banco de dados imediatamente e de forma definitiva.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode, a qualquer momento, direto na página{" "}
        <Link href="/conta">Minha conta</Link>:
      </p>
      <ul>
        <li>Baixar uma cópia de todos os seus dados, em JSON;</li>
        <li>Excluir sua conta e todos os dados vinculados a ela.</li>
      </ul>
      <p>
        Para corrigir nome ou e-mail, ou qualquer outro pedido relacionado
        aos seus dados (Art. 18 da LGPD), escreva pra{" "}
        <a href="mailto:sidneyjunior26@gmail.com">
          sidneyjunior26@gmail.com
        </a>
        .
      </p>

      <h2>Mudanças nesta política</h2>
      <p>
        Se esta política mudar de forma relevante, a data no topo desta
        página é atualizada.
      </p>
    </div>
  );
}
