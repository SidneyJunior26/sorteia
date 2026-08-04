/**
 * The wooden board the books stand on.
 *
 * Pure CSS — react-bits has no bookshelf, so the furniture is hand-built
 * and the library only supplies the motion around it. Colors come from
 * the --wood-* vars in globals.css so it flips with the theme. The thin
 * brass line and double-step front edge give it the more colonial,
 * built-in-cabinet look — plain flat boards read as flat-pack furniture.
 */
export default function ShelfPlank() {
  return (
    <div className="relative" aria-hidden="true">
      {/* Top face — the surface the spines sit on. */}
      <div
        className="h-[10px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--wood-top), var(--wood-face))",
        }}
      >
        {/* Grain. */}
        <div
          className="h-full w-full opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 5px, rgb(0 0 0 / 0.05) 5px 6px, transparent 6px 13px, rgb(255 255 255 / 0.04) 13px 14px)",
          }}
        />
      </div>

      {/* Brass inlay strip, like the trim on a colonial display cabinet. */}
      <div
        className="h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--wood-trim), transparent)",
          opacity: 0.75,
        }}
      />

      {/* Front edge, in two steps — a plain single slab reads flat-pack;
          the reveal between the two tones reads as a moulded profile. */}
      <div
        className="h-[5px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--wood-face), var(--wood-edge))",
        }}
      />
      <div
        className="h-[4px] rounded-b-[2px]"
        style={{
          background: "var(--wood-edge)",
          boxShadow: "0 9px 16px -8px var(--shelf-shadow)",
        }}
      />
    </div>
  );
}
