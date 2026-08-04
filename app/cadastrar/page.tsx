import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasGoogleProvider } from "@/auth.config";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";
import { safeNextPath } from "@/lib/next-path";

export const dynamic = "force-dynamic";

export const metadata = { title: "Criar conta — Achei Meu Livro" };

export default async function CadastrarPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const session = await auth();
  const next = safeNextPath(searchParams.next);

  if (session?.user?.id) redirect(next);

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Nome, e-mail e senha. Só isso."
      footer={
        <>
          Já tem conta?{" "}
          <Link
            href={`/entrar?next=${encodeURIComponent(next)}`}
            className="font-medium text-brand-700 dark:text-brand-300 hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <SignupForm hasGoogle={hasGoogleProvider} next={next} />
    </AuthShell>
  );
}
