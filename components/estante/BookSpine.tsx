"use client";

import { motion, useReducedMotion } from "motion/react";
import { spineStyle } from "@/lib/spine";
import type { ShelfItemDTO } from "@/types/shelf";

interface BookSpineProps {
  item: ShelfItemDTO;
  isSelected: boolean;
  /** Mouse only — the transient hover preview that follows the cursor. */
  onHoverStart: (item: ShelfItemDTO, point: { x: number; y: number }) => void;
  onHoverMove: (item: ShelfItemDTO, point: { x: number; y: number }) => void;
  onHoverEnd: (item: ShelfItemDTO) => void;
  /** Click or keyboard Enter/Space — pins the panel open (touch + a11y
   *  fallback, since hover doesn't exist on either). */
  onActivate: (item: ShelfItemDTO, point: { x: number; y: number }) => void;
}

export default function BookSpine({
  item,
  isSelected,
  onHoverStart,
  onHoverMove,
  onHoverEnd,
  onActivate,
}: BookSpineProps) {
  const reduceMotion = useReducedMotion();
  const style = spineStyle(item.id, item.title);

  return (
    // layoutId (not just layout) so moving a book between two shelves
    // animates as one continuous element across the two AnimatePresence
    // lists, instead of an exit here plus an unrelated enter there.
    <motion.button
      type="button"
      layoutId={item.id}
      layout
      onMouseEnter={(e) => onHoverStart(item, { x: e.clientX, y: e.clientY })}
      onMouseMove={(e) => onHoverMove(item, { x: e.clientX, y: e.clientY })}
      onMouseLeave={() => onHoverEnd(item)}
      onClick={(e) => {
        // A keyboard-triggered click (Enter/Space) reports clientX/Y as
        // 0,0 in every major browser — `detail === 0` is how you tell it
        // apart from a real pointer click, whose detail is the click
        // count. Fall back to the button's own position so Tab-ing to a
        // spine doesn't pin the panel into the viewport's top-left corner.
        if (e.detail === 0) {
          const rect = e.currentTarget.getBoundingClientRect();
          onActivate(item, { x: rect.left + rect.width / 2, y: rect.top });
          return;
        }
        onActivate(item, { x: e.clientX, y: e.clientY });
      }}
      initial={
        reduceMotion ? false : { y: -180, rotateZ: -14, opacity: 0 }
      }
      animate={{ y: 0, rotateZ: 0, opacity: 1 }}
      exit={reduceMotion ? undefined : { y: 60, opacity: 0, rotateZ: 8 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 220, damping: 22 }
      }
      whileHover={reduceMotion ? undefined : { y: -10 }}
      className="group relative shrink-0 origin-bottom rounded-t-[2px] rounded-b-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{
        width: style.width,
        height: style.height,
        background: style.background,
        color: style.color,
        boxShadow: isSelected
          ? "0 0 0 2px var(--ring), 0 10px 18px -10px rgb(0 0 0 / 0.7)"
          : "inset -3px 0 6px rgb(0 0 0 / 0.28), inset 3px 0 4px rgb(255 255 255 / 0.14), 0 6px 12px -8px rgb(0 0 0 / 0.6)",
      }}
      // Vertical writing-mode is read unreliably by screen readers, so
      // the accessible name is supplied here in normal reading order.
      aria-label={`${item.title}, de ${item.author}`}
      title={`${item.title} — ${item.author}`}
    >
      {/* Head and tail bands, like a bound hardcover. */}
      <span
        className="absolute inset-x-0 top-[6px] h-[2px] opacity-45"
        style={{ background: style.color }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-x-0 bottom-[6px] h-[2px] opacity-45"
        style={{ background: style.color }}
        aria-hidden="true"
      />

      <span
        className="absolute inset-0 flex items-center justify-center px-[3px] py-4"
        aria-hidden="true"
      >
        <span
          className="text-[10px] font-semibold leading-tight tracking-tight"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            maxHeight: "100%",
            // `line-clamp`/`-webkit-line-clamp` forces `display: -webkit-box`
            // with `-webkit-box-orient: vertical`, which fights
            // writing-mode and made some browsers fall back to laying the
            // title out horizontally. `text-overflow: ellipsis` respects
            // writing-mode's own block/inline axes instead.
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.title}
        </span>
      </span>
    </motion.button>
  );
}
