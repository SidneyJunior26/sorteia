"use client";

import { useEffect, useRef, useState } from "react";
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

interface ActivePanel {
  item: ShelfItemDTO;
  x: number;
  y: number;
  /** true = opened by click/keyboard, stays open until explicitly closed.
   *  false = hover preview, closes shortly after the cursor leaves. */
  pinned: boolean;
}

// Grace period between the cursor leaving a spine and the preview
// closing — without it, moving the mouse from the spine into the panel
// to click a buy link or the shelf select would always close it first.
const HOVER_HIDE_DELAY = 150;

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
  const [active, setActive] = useState<ActivePanel | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function clearHideTimer() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  function scheduleHide(itemId: string) {
    clearHideTimer();
    hideTimer.current = setTimeout(() => {
      setActive((current) =>
        current && current.item.id === itemId && !current.pinned
          ? null
          : current
      );
    }, HOVER_HIDE_DELAY);
  }

  function handleHoverStart(item: ShelfItemDTO, point: { x: number; y: number }) {
    if (active?.pinned) return;
    clearHideTimer();
    setActive({ item, x: point.x, y: point.y, pinned: false });
  }

  function handleHoverMove(item: ShelfItemDTO, point: { x: number; y: number }) {
    if (active?.pinned) return;
    setActive((current) =>
      current && current.item.id === item.id && !current.pinned
        ? { ...current, x: point.x, y: point.y }
        : current
    );
  }

  function handleHoverEnd(item: ShelfItemDTO) {
    if (active?.pinned) return;
    scheduleHide(item.id);
  }

  function handleActivate(item: ShelfItemDTO, point: { x: number; y: number }) {
    clearHideTimer();
    setActive((current) =>
      current?.pinned && current.item.id === item.id
        ? null
        : { item, x: point.x, y: point.y, pinned: true }
    );
  }

  function handlePanelLeave() {
    if (!active || active.pinned) return;
    scheduleHide(active.item.id);
  }

  function close() {
    clearHideTimer();
    setActive(null);
  }

  // Re-read from the current shelf so the panel never shows a stale row
  // (the book may have moved or been removed since it was opened).
  const activeItem = active
    ? shelf.items.find((i) => i.id === active.item.id) ?? null
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
          selectedId={activeItem?.id ?? null}
          onHoverStart={handleHoverStart}
          onHoverMove={handleHoverMove}
          onHoverEnd={handleHoverEnd}
          onActivate={handleActivate}
          emptyMessage={
            <p className="text-sm text-muted-foreground">
              Prateleira vazia. Sorteie um livro e mande pra cá.
            </p>
          }
        />

        {active && activeItem && (
          <BookDetailPanel
            item={activeItem}
            shelves={allShelves}
            currentShelfId={shelf.id}
            point={{ x: active.x, y: active.y }}
            busy={busy}
            onClose={close}
            onPanelEnter={clearHideTimer}
            onPanelLeave={handlePanelLeave}
            onMove={(shelfId) => {
              if (shelfId !== shelf.id) {
                onMoveItem(activeItem.id, shelfId);
                close();
              }
            }}
            onRemove={() => {
              onRemoveItem(activeItem.id);
              close();
            }}
          />
        )}
      </section>
    </AnimatedContent>
  );
}
