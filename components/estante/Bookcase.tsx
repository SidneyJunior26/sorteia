"use client";

import { AnimatePresence } from "motion/react";
import BookSpine from "./BookSpine";
import ShelfPlank from "./ShelfPlank";
import type { ShelfItemDTO } from "@/types/shelf";

interface BookcaseProps {
  items: ShelfItemDTO[];
  selectedId: string | null;
  onHoverStart: (item: ShelfItemDTO, point: { x: number; y: number }) => void;
  onHoverMove: (item: ShelfItemDTO, point: { x: number; y: number }) => void;
  onHoverEnd: (item: ShelfItemDTO) => void;
  onActivate: (item: ShelfItemDTO, point: { x: number; y: number }) => void;
  emptyMessage: React.ReactNode;
}

/** Side panels + back panel + a plank, with the spines standing on it. */
export default function Bookcase({
  items,
  selectedId,
  onHoverStart,
  onHoverMove,
  onHoverEnd,
  onActivate,
  emptyMessage,
}: BookcaseProps) {
  return (
    <div
      className="relative rounded-sm px-2.5 pt-3"
      style={{
        background:
          "linear-gradient(to bottom, color-mix(in srgb, var(--shelf-back) 88%, black), var(--shelf-back))",
        boxShadow:
          "inset 0 2px 14px -4px var(--shelf-shadow), 0 0 0 1px var(--wood-edge)",
      }}
    >
      {/* Crown moulding — a colonial built-in reads as a cabinet with a
          cap, not an open plank. */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[7px] h-[7px] rounded-t-sm"
        style={{
          background:
            "linear-gradient(to bottom, var(--wood-top), var(--wood-face))",
          boxShadow: "0 -1px 0 0 var(--wood-trim) inset",
        }}
        aria-hidden="true"
      />

      {/* Side panels, drawn as the outer edges of the case. Fluting
          (the repeating grooves) is what reads as turned/carved posts
          rather than a flat plywood side. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[11px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--wood-edge), var(--wood-face)), repeating-linear-gradient(180deg, transparent 0 4px, rgb(0 0 0 / 0.18) 4px 5px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[11px]"
        style={{
          backgroundImage:
            "linear-gradient(to left, var(--wood-edge), var(--wood-face)), repeating-linear-gradient(180deg, transparent 0 4px, rgb(0 0 0 / 0.18) 4px 5px)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-[11px] min-h-[172px] overflow-x-auto overflow-y-hidden">
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
                    isSelected={selectedId === item.id}
                    onHoverStart={onHoverStart}
                    onHoverMove={onHoverMove}
                    onHoverEnd={onHoverEnd}
                    onActivate={onActivate}
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
