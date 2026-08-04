/**
 * The wooden board the books stand on.
 *
 * Pure CSS — react-bits has no bookshelf, so the furniture is hand-built
 * and the library only supplies the motion around it. Colors come from
 * the --wood-* vars in globals.css so it flips with the theme.
 */
export default function ShelfPlank() {
  return (
    <div className="relative" aria-hidden="true">
      {/* Top face — the surface the spines sit on. */}
      <div
        className="h-[10px] rounded-t-[3px]"
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

      {/* Front edge — the bit you'd see looking straight at the shelf. */}
      <div
        className="h-[7px] rounded-b-[3px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--wood-face), var(--wood-edge))",
          boxShadow: "0 9px 16px -8px var(--shelf-shadow)",
        }}
      />
    </div>
  );
}
