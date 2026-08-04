import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasGoogleProvider } from "@/auth.config";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/next-path";

export const dynamic = "force-dynamic";

export const metadata = { title: "Entrar — Achei Meu Livro" };

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const session = await auth();
  const next = safeNextPath(searchParams.next);

  if (session?.user?.id) redirect(next);

  return (
    <AuthShell
      title="Entrar"
      subtitle="Entre pra guardar os livros que você sortear na sua estante."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link
            href={`/cadastrar?next=${encodeURIComponent(next)}`}
            className="font-medium text-brand-700 dark:text-brand-300 hover:underline"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm hasGoogle={hasGoogleProvider} next={next} />
    </AuthShell>
  );
}
