"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";

interface SignupFormProps {
  hasGoogle: boolean;
  next: string;
}

export default function SignupForm({ hasGoogle, next }: SignupFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível criar a conta.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
      return;
    }

    // The account exists now; log straight in so the user never has to
    // type the same credentials twice. Same reason for the try/catch as
    // in LoginForm — a 500 from the callback route makes signIn throw.
    let result;
    try {
      result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch {
      result = null;
    }

    if (!result || result.error || result.ok === false) {
      setError("Conta criada, mas o login falhou. Tente entrar manualmente.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {hasGoogle && (
        <>
          <GoogleButton next={next} />
          <p className="text-center text-xs text-muted-foreground">
            Ao continuar com Google, você concorda com nossa{" "}
            <Link
              href="/privacidade"
              target="_blank"
              className="underline hover:text-foreground"
            >
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Vira o título da sua estante — dá pra mudar depois.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-3.5 shrink-0 rounded border-input accent-brand-600"
          />
          <span>
            Li e concordo com a{" "}
            <Link
              href="/privacidade"
              target="_blank"
              className="underline hover:text-foreground"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !consent}
          className="w-full bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 dark:text-brand-950"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </div>
  );
}
