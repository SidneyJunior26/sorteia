"use client";

import { AnimatePresence } from "motion/react";
import BookSpine from "./BookSpine";
import ShelfPlank from "./ShelfPlank";
import type { ShelfItemDTO } from "@/types/shelf";

interface BookcaseProps {
  items: ShelfItemDTO[];
  onSelect: (item: ShelfItemDTO) => void;
  selectedId: string | null;
  emptyMessage: React.ReactNode;
}

/** Side panels + back panel + a plank, with the spines standing on it. */
export default function Bookcase({
  items,
  onSelect,
  selectedId,
  emptyMessage,
}: BookcaseProps) {
  return (
    <div
      className="relative rounded-lg px-2 pt-3"
      style={{
        background:
          "linear-gradient(to bottom, color-mix(in srgb, var(--shelf-back) 88%, black), var(--shelf-back))",
        boxShadow: "inset 0 2px 14px -4px var(--shelf-shadow)",
      }}
    >
      {/* Side panels, drawn as the outer edges of the case. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[9px] rounded-l-lg"
        style={{
          background:
            "linear-gradient(to right, var(--wood-edge), var(--wood-face))",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[9px] rounded-r-lg"
        style={{
          background:
            "linear-gradient(to left, var(--wood-edge), var(--wood-face))",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-[9px] min-h-[172px] overflow-x-auto overflow-y-hidden">
        {items.length === 0 ? (
          <div className="flex min-h-[172px] items-end justify-center pb-3">
            {emptyMessage}
          </div>
        ) : (
          <ul className="flex min-h-[172px] items-end gap-[3px] px-1 pb-0 pt-4">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((item) => (
                <li key={item.id} className="flex items-end">
                  <BookSpine
                    item={item}
                    onSelect={onSelect}
                    isSelected={selectedId === item.id}
                  />
                </li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <ShelfPlank />
    </div>
  );
}
