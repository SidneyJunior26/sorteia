/** Shapes shared between the estante server components and its API. */

export type ShelfKindDTO = "UNREAD" | "READ" | "CUSTOM";

/** One book sitting on a shelf. Mirrors the ShelfItem snapshot columns. */
export interface ShelfItemDTO {
  id: string;
  /** Null when the underlying Book row is gone — the spine still renders
   *  from the snapshot below, but the affiliate buttons are unavailable. */
  bookId: string | null;
  title: string;
  author: string;
  coverUrl: string | null;
  category: string | null;
  addedAt: string;
}

export interface ShelfDTO {
  id: string;
  name: string;
  kind: ShelfKindDTO;
  position: number;
  items: ShelfItemDTO[];
}

export interface EstanteDTO {
  /** Already resolved: the stored libraryTitle, or the derived default. */
  libraryTitle: string;
  /** True when the title is still the derived default, not user-set. */
  libraryTitleIsDefault: boolean;
  shelves: ShelfDTO[];
  totalBooks: number;
}
