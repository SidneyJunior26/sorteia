"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import type { ShelfDTO, ShelfItemDTO } from "@/types/shelf";

interface BookDetailPanelProps {
  item: ShelfItemDTO;
  shelves: ShelfDTO[];
  currentShelfId: string;
  /** Viewport coordinate the panel anchors near — the cursor position on
   *  hover, or the spine's own position when opened via click/keyboard. */
  point: { x: number; y: number };
  onClose: () => void;
  onMove: (shelfId: string) => void;
  onRemove: () => void;
  busy: boolean;
  /** Cancels/reschedules the parent's hide-on-leave timer, so moving the
   *  cursor off the spine and into the panel itself doesn't close it. */
  onPanelEnter: () => void;
  onPanelLeave: () => void;
}

const OFFSET_X = 16;
const OFFSET_Y = -12;
const VIEWPORT_PADDING = 12;

export default function BookDetailPanel({
  item,
  shelves,
  currentShelfId,
  point,
  onClose,
  onMove,
  onRemove,
  busy,
  onPanelEnter,
  onPanelLeave,
}: BookDetailPanelProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  // Starts hidden — the very first paint would otherwise show the panel
  // at its default top-left/untransformed spot for one frame, before
  // the layout effect below ever gets to measure and clamp it.
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();
    const maxLeft = window.innerWidth - width - VIEWPORT_PADDING;
    const maxTop = window.innerHeight - height - VIEWPORT_PADDING;

    const left = Math.min(
      Math.max(point.x + OFFSET_X, VIEWPORT_PADDING),
      Math.max(maxLeft, VIEWPORT_PADDING)
    );
    const top = Math.min(
      Math.max(point.y + OFFSET_Y, VIEWPORT_PADDING),
      Math.max(maxTop, VIEWPORT_PADDING)
    );

    setStyle({ left, top, opacity: 1 });
  }, [point.x, point.y]);

  // position: fixed only tracks the viewport when nothing between here
  // and <body> has a transform — and framer-motion's layoutId/layout on
  // BookSpine, plus AnimatedContent's gsap tween, both leave one behind
  // on their wrapper even at rest. Portaling straight to <body> sidesteps
  // that trap entirely (same reason FlyToShelf does it).
  return createPortal(
    <motion.div
      ref={panelRef}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 w-[min(340px,calc(100vw-24px))]"
      style={style}
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
    >
      <SpotlightCard
        className="p-4 sm:p-5"
        spotlightColor="rgba(139, 92, 246, 0.18)"
      >
        <div className="flex gap-4">
          <div className="relative h-32 w-[86px] shrink-0 overflow-hidden rounded-md border border-border bg-brand-50 dark:bg-brand-950">
            {item.coverUrl ? (
              <Image
                src={item.coverUrl}
                alt={`Capa do livro ${item.title}`}
                fill
                sizes="86px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-brand-300 dark:text-brand-700">
                📖
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-foreground">
                  {item.title}
                </h4>
                <p className="truncate text-sm text-muted-foreground">
                  {item.author}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={onClose}
                aria-label="Fechar detalhes"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Select
                value={currentShelfId}
                onValueChange={onMove}
                disabled={busy}
              >
                <SelectTrigger className="h-8 w-[190px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shelves.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id}>
                      {shelf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Only linkable while the Book row still exists — an
                  orphaned snapshot has no id to build the affiliate
                  redirect from. */}
              {item.bookId && (
                <>
                  <Button
                    asChild
                    size="sm"
                    className="h-8 gap-1.5 bg-[#131921] px-3 text-white hover:bg-[#232f3e] dark:ring-1 dark:ring-white/20"
                  >
                    <a
                      href={`/go/${item.bookId}/AMAZON`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                    >
                      <ShoppingCart className="size-3.5 shrink-0 text-[#ff9900]" />
                      Amazon
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="h-8 gap-1.5 bg-[#FFE600] px-3 text-[#3483FA] hover:bg-[#f7dc00]"
                  >
                    <a
                      href={`/go/${item.bookId}/MERCADO_LIVRE`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                    >
                      <ShoppingCart className="size-3.5 shrink-0" />
                      Mercado Livre
                    </a>
                  </Button>
                </>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onRemove}
                disabled={busy}
              >
                <Trash2 className="size-3.5" />
                Tirar da estante
              </Button>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>,
    document.body
  );
}
