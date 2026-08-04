"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClickSpark from "@/components/reactbits/ClickSpark";
import CountUp from "@/components/reactbits/CountUp";
import Magnet from "@/components/reactbits/Magnet";
import EditableTitle from "./EditableTitle";
import ShelfRow from "./ShelfRow";
import type { EstanteDTO, ShelfDTO } from "@/types/shelf";

/** Reads {error} out of a failed response, with a usable fallback. */
async function errorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return typeof data?.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

export default function EstanteView({ initial }: { initial: EstanteDTO }) {
  const [libraryTitle, setLibraryTitle] = useState(initial.libraryTitle);
  const [shelves, setShelves] = useState<ShelfDTO[]>(initial.shelves);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBooks = shelves.reduce((sum, s) => sum + s.items.length, 0);

  const renameLibrary = useCallback(async (next: string) => {
    const previous = libraryTitle;
    setLibraryTitle(next);

    const response = await fetch("/api/estante", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libraryTitle: next }),
    });

    if (!response.ok) {
      setLibraryTitle(previous);
      return errorMessage(response, "Não foi possível salvar o título.");
    }

    const data = await response.json();
    setLibraryTitle(data.libraryTitle);
    return null;
  }, [libraryTitle]);

  const renameShelf = useCallback(
    async (shelfId: string, name: string) => {
      const previous = shelves;
      setShelves((current) =>
        current.map((s) => (s.id === shelfId ? { ...s, name } : s))
      );

      const response = await fetch(`/api/shelves/${shelfId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        setShelves(previous);
        return errorMessage(response, "Não foi possível renomear.");
      }

      return null;
    },
    [shelves]
  );

  async function createShelf(event: React.FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;

    setBusy(true);
    setError(null);

    const response = await fetch("/api/shelves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setBusy(false);

    if (!response.ok) {
      setError(await errorMessage(response, "Não foi possível criar."));
      return;
    }

    const data = await response.json();
    setShelves((current) => [...current, data.shelf]);
    setNewName("");
    setCreating(false);

    // A new shelf lands at the bottom, usually below the fold — and
    // ShelfRow's AnimatedContent only fades in once scrolled to. Without
    // this, clicking "Criar" looks like nothing happened.
    requestAnimationFrame(() => {
      document
        .getElementById(`shelf-${data.shelf.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function deleteShelf(shelfId: string) {
    const previous = shelves;
    const target = shelves.find((s) => s.id === shelfId);
    const unread = shelves.find((s) => s.kind === "UNREAD");
    if (!target || !unread) return;

    setBusy(true);
    setError(null);

    // Optimistic: the books land back on "Não lidos", matching what the
    // route does inside its transaction.
    setShelves((current) =>
      current
        .filter((s) => s.id !== shelfId)
        .map((s) =>
          s.id === unread.id ? { ...s, items: [...s.items, ...target.items] } : s
        )
    );

    const response = await fetch(`/api/shelves/${shelfId}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setShelves(previous);
      setError(await errorMessage(response, "Não foi possível excluir."));
    }
  }

  async function moveItem(itemId: string, shelfId: string) {
    const previous = shelves;
    const item = shelves.flatMap((s) => s.items).find((i) => i.id === itemId);
    if (!item) return;

    setBusy(true);
    setError(null);

    setShelves((current) =>
      current.map((s) => {
        if (s.id === shelfId) return { ...s, items: [...s.items, item] };
        return { ...s, items: s.items.filter((i) => i.id !== itemId) };
      })
    );

    const response = await fetch(`/api/shelf-items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelfId }),
    });
    setBusy(false);

    if (!response.ok) {
      setShelves(previous);
      setError(await errorMessage(response, "Não foi possível mover o livro."));
    }
  }

  async function removeItem(itemId: string) {
    const previous = shelves;
    setBusy(true);
    setError(null);

    setShelves((current) =>
      current.map((s) => ({
        ...s,
        items: s.items.filter((i) => i.id !== itemId),
      }))
    );

    const response = await fetch(`/api/shelf-items/${itemId}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setShelves(previous);
      setError(await errorMessage(response, "Não foi possível remover."));
    }
  }

  return (
    <ClickSpark sparkColor="#a78bfa" sparkCount={8} sparkRadius={18}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <header className="mb-8">
          <EditableTitle
            value={libraryTitle}
            onSave={renameLibrary}
            editLabel="Renomear a estante"
            className="text-2xl sm:text-3xl font-bold text-brand-900 dark:text-brand-100"
            inputClassName="h-10 w-72 text-2xl font-bold"
            as="h1"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            <CountUp to={totalBooks} duration={1} className="font-medium" />{" "}
            {totalBooks === 1 ? "livro guardado" : "livros guardados"} em{" "}
            {shelves.length}{" "}
            {shelves.length === 1 ? "prateleira" : "prateleiras"}.
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

        {shelves.map((shelf, index) => (
          <ShelfRow
            key={shelf.id}
            shelf={shelf}
            allShelves={shelves}
            index={index}
            busy={busy}
            onRename={renameShelf}
            onDelete={deleteShelf}
            onMoveItem={moveItem}
            onRemoveItem={removeItem}
          />
        ))}

        {creating ? (
          <form onSubmit={createShelf} className="flex items-center gap-2">
            <Input
              autoFocus
              value={newName}
              maxLength={60}
              placeholder="Nome da prateleira"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setCreating(false);
                  setNewName("");
                }
              }}
              className="h-9 w-64"
              aria-label="Nome da nova prateleira"
            />
            <Button type="submit" size="sm" disabled={busy}>
              Criar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setNewName("");
              }}
            >
              Cancelar
            </Button>
          </form>
        ) : (
          <Magnet
            padding={70}
            magnetStrength={5}
            wrapperClassName="inline-flex"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setCreating(true)}
            >
              <Plus className="size-4" />
              Nova prateleira
            </Button>
          </Magnet>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Sortear mais um livro
          </Link>
        </p>
      </div>
    </ClickSpark>
  );
}
