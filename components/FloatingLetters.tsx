"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETTER_COUNT = 20;

interface FloatingLetter {
  id: number;
  char: string;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

function randomLetters(): FloatingLetter[] {
  return Array.from({ length: LETTER_COUNT }, (_, id) => ({
    id,
    char: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 24 + Math.random() * 56,
    duration: 18 + Math.random() * 17,
    delay: Math.random() * -30,
    driftX: 15 + Math.random() * 25,
    driftY: 20 + Math.random() * 30,
  }));
}

export default function FloatingLetters() {
  const [letters, setLetters] = useState<FloatingLetter[]>([]);
  const reduceMotion = useReducedMotion();

  // Random positions are generated client-side only, after mount, so
  // server-rendered HTML never disagrees with the client's first
  // render (Math.random() during SSR would cause a hydration mismatch).
  useEffect(() => {
    setLetters(randomLetters());
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {letters.map((letter) => (
        <motion.span
          key={letter.id}
          className="absolute font-serif font-bold text-brand-200/40 select-none"
          style={{
            top: `${letter.top}%`,
            left: `${letter.left}%`,
            fontSize: letter.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -letter.driftY, 0, letter.driftY, 0],
                  x: [0, letter.driftX, 0, -letter.driftX, 0],
                  rotate: [0, 6, 0, -6, 0],
                }
          }
          transition={{
            duration: letter.duration,
            delay: letter.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {letter.char}
        </motion.span>
      ))}
    </div>
  );
}
