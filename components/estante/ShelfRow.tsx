"use client";

import { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import Bookcase from "./Bookcase";
import BookDetailPanel from "./BookDetailPanel";
import EditableTitle from "./EditableTitle";
import type { ShelfDTO, ShelfItemDTO } from "@/types/shelf";

interface ShelfRowProps {
  shelf: ShelfDTO;
  allShelves: ShelfDTO[];
  index: number;
  busy: boolean;
  onRename: (shelfId: string, name: string) => Promise<string | null>;
  onDelete: (shelfId: string) => void;
  onMoveItem: (itemId: string, shelfId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function ShelfRow({
  shelf,
  allShelves,
  index,
  busy,
  onRename,
  onDelete,
  onMoveItem,
  onRemoveItem,
}: ShelfRowProps) {
  const [selected, setSelected] = useState<ShelfItemDTO | null>(null);

  // The selected book may have been moved or removed since; re-read it
  // from the current shelf so the panel never shows a stale row.
  const selectedItem = selected
    ? shelf.items.find((i) => i.id === selected.id) ?? null
    : null;

  return (
    <AnimatedContent
      distance={30}
      duration={0.5}
      delay={index * 0.08}
      threshold={0.05}
    >
      <section id={`shelf-${shelf.id}`} className="mb-8 scroll-mt-24">
        <div className="mb-2 flex items-center gap-2">
          <EditableTitle
            value={shelf.name}
            onSave={(name) => onRename(shelf.id, name)}
            editLabel={`Renomear a prateleira ${shelf.name}`}
            className="text-base font-semibold text-brand-800 dark:text-brand-200"
            inputClassName="w-56 text-base font-semibold"
            as="h2"
          />

          <span className="text-xs text-muted-foreground">
            {shelf.items.length}{" "}
            {shelf.items.length === 1 ? "livro" : "livros"}
          </span>

          {shelf.kind === "CUSTOM" && (
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label={`Opções da prateleira ${shelf.name}`}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:text-destructive"
                    onClick={() => onDelete(shelf.id)}
                  >
                    <Trash2 className="size-4" />
                    Excluir prateleira
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <Bookcase
          items={shelf.items}
          onSelect={(item) =>
            setSelected((current) => (current?.id === item.id ? null : item))
          }
          selectedId={selectedItem?.id ?? null}
          emptyMessage={
            <p className="text-sm text-muted-foreground">
              Prateleira vazia. Sorteie um livro e mande pra cá.
            </p>
          }
        />

        {selectedItem && (
          <BookDetailPanel
            item={selectedItem}
            shelves={allShelves}
            currentShelfId={shelf.id}
            busy={busy}
            onClose={() => setSelected(null)}
            onMove={(shelfId) => {
              if (shelfId !== shelf.id) {
                onMoveItem(selectedItem.id, shelfId);
                setSelected(null);
              }
            }}
            onRemove={() => {
              onRemoveItem(selectedItem.id);
              setSelected(null);
            }}
          />
        )}
      </section>
    </AnimatedContent>
  );
}
