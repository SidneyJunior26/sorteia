"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Download, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface AccountViewProps {
  name: string | null;
  email: string;
}

export default function AccountView({ name, email }: AccountViewProps) {
  const [exporting, setExporting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const response = await fetch("/api/account");
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "meus-dados.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Não foi possível baixar seus dados agora. Tente de novo.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) throw new Error();
      // The row is gone — sair localmente e mandar pra home, já sem sessão.
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Não foi possível excluir sua conta agora. Tente de novo.");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-900 dark:text-brand-100">
          Minha conta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {name ? `${name} — ` : ""}
          {email}
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <SpotlightCard className="mb-6 p-5" spotlightColor="rgba(139, 92, 246, 0.18)">
        <h2 className="font-semibold text-foreground">Seus dados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Baixe uma cópia de tudo que guardamos sobre você — nome, e-mail e
          os livros da sua estante — em formato JSON. Veja também nossa{" "}
          <Link href="/privacidade" className="underline hover:text-foreground">
            Política de Privacidade
          </Link>
          .
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 gap-1.5"
          onClick={handleExport}
          disabled={exporting}
        >
          <Download className="size-4" />
          {exporting ? "Preparando..." : "Baixar meus dados"}
        </Button>
      </SpotlightCard>

      <SpotlightCard
        className="p-5 border-destructive/20"
        spotlightColor="rgba(239, 68, 68, 0.12)"
      >
        <h2 className="flex items-center gap-1.5 font-semibold text-destructive">
          <ShieldAlert className="size-4" />
          Excluir conta
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Apaga sua conta, sua estante e todos os livros guardados nela.
          Essa ação é permanente e não pode ser desfeita.
        </p>

        {!confirmingDelete ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmingDelete(true)}
          >
            <Trash2 className="size-4" />
            Excluir minha conta
          </Button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-destructive">
              Tem certeza?
            </span>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Sim, excluir tudo"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}
