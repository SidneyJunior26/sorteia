"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FlyToShelf from "@/components/estante/FlyToShelf";
import type { BookDTO } from "@/types/book";

interface ShelfOption {
  id: string;
  name: string;
  kind: "UNREAD" | "READ" | "CUSTOM";
}

export default function AddToShelfButton({ book }: { book: BookDTO }) {
  const { status } = useSession();
  const [shelves, setShelves] = useState<ShelfOption[] | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flyFrom, setFlyFrom] = useState<DOMRect | null>(null);

  // A different book was sorteado into this slot — reset the state.
  useEffect(() => {
    setSaved(null);
    setError(null);
  }, [book.id]);

  const loadShelves = useCallback(async () => {
    if (shelves) return;
    try {
      const response = await fetch("/api/shelves/list", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setShelves(data.shelves as ShelfOption[]);
    } catch {
      // Leave the list null; the menu falls back to "Não lidos".
    }
  }, [shelves]);

  async function add(shelfId: string | undefined, shelfName: string) {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/shelf-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, shelfId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error ?? "Não foi possível adicionar.");
        return;
      }

      setSaved(shelfName);
    } catch {
      setError("Erro de conexão. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />;
  }

  if (status !== "authenticated") {
    return (
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/entrar?next=%2F">
          <BookmarkPlus className="size-3.5 shrink-0" />
          Entrar pra salvar na estante
        </Link>
      </Button>
    );
  }

  if (saved) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1.5 text-sm text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <Check className="size-3.5 shrink-0" />
          Guardado em {saved}
        </span>
        <Button asChild variant="ghost" size="sm">
          <Link href="/estante">Ver estante</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={busy}
          onClick={(event) => {
            setFlyFrom(event.currentTarget.getBoundingClientRect());
            void add(undefined, "Não lidos");
          }}
        >
          <BookmarkPlus className="size-3.5 shrink-0" />
          {busy ? "Guardando..." : "Guardar na estante"}
        </Button>

        <DropdownMenu onOpenChange={(open) => open && void loadShelves()}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              disabled={busy}
              aria-label="Escolher prateleira"
            >
              ▾
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Guardar em
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(shelves ?? []).map((shelf) => (
              <DropdownMenuItem
                key={shelf.id}
                onClick={() => void add(shelf.id, shelf.name)}
              >
                {shelf.name}
              </DropdownMenuItem>
            ))}
            {shelves === null && (
              <DropdownMenuItem disabled>Carregando...</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      <FlyToShelf
        from={flyFrom}
        coverUrl={book.coverUrl}
        onDone={() => setFlyFrom(null)}
      />
    </div>
  );
}
