"use client";

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
  onClose: () => void;
  onMove: (shelfId: string) => void;
  onRemove: () => void;
  busy: boolean;
}

export default function BookDetailPanel({
  item,
  shelves,
  currentShelfId,
  onClose,
  onMove,
  onRemove,
  busy,
}: BookDetailPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-3"
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
    </motion.div>
  );
}
