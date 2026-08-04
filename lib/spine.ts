/**
 * Deterministic per-book visual traits for the bookshelf spines.
 *
 * Everything here is derived from the item id by hashing — never
 * `Math.random()`. The spines are server-rendered real content, so a
 * random value would differ between the server and the client's first
 * render and blow up hydration (the same trap `FloatingLetters` dodges
 * by only generating after mount, which isn't an option here).
 */

/** FNV-1a, 32-bit. Small, stable, no dependencies. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Book-cloth colors, picked to sit well against the wooden shelf. */
const SPINE_COLORS = [
  { bg: "#7c3aed", fg: "#f5f3ff" }, // violeta
  { bg: "#b91c1c", fg: "#fef2f2" }, // vermelho
  { bg: "#15803d", fg: "#f0fdf4" }, // verde
  { bg: "#1d4ed8", fg: "#eff6ff" }, // azul
  { bg: "#b45309", fg: "#fffbeb" }, // âmbar
  { bg: "#0f766e", fg: "#f0fdfa" }, // teal
  { bg: "#9d174d", fg: "#fdf2f8" }, // vinho
  { bg: "#3f3f46", fg: "#fafafa" }, // grafite
  { bg: "#5b21b6", fg: "#f5f3ff" }, // roxo escuro
  { bg: "#a16207", fg: "#fefce8" }, // mostarda
] as const;

export interface SpineStyle {
  /** Spine cloth color. */
  background: string;
  /** Title color, pre-paired for contrast. */
  color: string;
  /** Spine thickness in px — thicker for longer titles, like a real book. */
  width: number;
  /** Spine height in px; books on a shelf are never all the same height. */
  height: number;
  /** Tiny lean, in degrees, for the last book on a partly-filled shelf. */
  tilt: number;
}

export function spineStyle(id: string, title: string): SpineStyle {
  const h = hash(id);

  const palette = SPINE_COLORS[h % SPINE_COLORS.length];

  // 28-46px: page count roughly tracks title length in a satisfying,
  // if entirely unscientific, way.
  const width = 28 + Math.min(18, Math.round(title.length / 3));

  // 150-190px, so the top edge of the row is uneven like a real shelf.
  const height = 150 + ((h >>> 8) % 41);

  return {
    background: palette.bg,
    color: palette.fg,
    width,
    height,
    tilt: 0,
  };
}
