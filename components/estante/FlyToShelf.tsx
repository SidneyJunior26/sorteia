"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface FlyToShelfProps {
  /** Where the click happened; null means "don't animate". */
  from: DOMRect | null;
  coverUrl: string | null;
  onDone: () => void;
}

/**
 * The book flying into the shelf.
 *
 * On /estante the spines animate themselves (motion `layoutId` on
 * BookSpine), but on the home page the destination shelf isn't on
 * screen — so the cover flies to the "Minha estante" link in the header
 * and collapses there instead.
 */
export default function FlyToShelf({ from, coverUrl, onDone }: FlyToShelfProps) {
  const reduceMotion = useReducedMotion();
  const [target, setTarget] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!from) {
      setTarget(null);
      return;
    }
    const el = document.getElementById("estante-nav-link");
    setTarget(el?.getBoundingClientRect() ?? null);
  }, [from]);

  // Nothing to fly to, or the user asked for less motion: skip straight
  // to done so the caller's state still resets.
  useEffect(() => {
    if (from && (reduceMotion || !target)) onDone();
  }, [from, reduceMotion, target, onDone]);

  if (!mounted || !from || !target || reduceMotion) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onDone}>
      <motion.div
        key="fly"
        className="pointer-events-none fixed z-50 overflow-hidden rounded-sm shadow-lg"
        initial={{
          top: from.top,
          left: from.left + from.width / 2 - 18,
          width: 36,
          height: 52,
          opacity: 1,
          rotate: 0,
        }}
        animate={{
          top: target.top + target.height / 2 - 6,
          left: target.left + target.width / 2 - 6,
          width: 12,
          height: 16,
          opacity: 0,
          rotate: 22,
        }}
        transition={{ duration: 0.62, ease: [0.32, 0.72, 0.3, 1] }}
        onAnimationComplete={onDone}
        style={{
          backgroundColor: "#7c3aed",
          backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
    </AnimatePresence>,
    document.body
  );
}
