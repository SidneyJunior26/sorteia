import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountView from "@/components/conta/AccountView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Minha conta — Achei Meu Livro" };

export default async function ContaPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/entrar?next=%2Fconta");
  }

  return (
    <AccountView
      name={session.user.name ?? null}
      email={session.user.email ?? ""}
    />
  );
}
