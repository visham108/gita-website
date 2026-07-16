import { GITA_VERSES, type Verse } from "@/lib/data";

export interface OrderedVerse extends Verse {
  ref: string;
}

/** Every verse in the corpus, chapter.verse ascending — the canonical order
    for the verse-of-the-day sequence (numeric sort, the single source of
    truth replacing the two divergent prototype algorithms). */
export const ORDERED_VERSES: OrderedVerse[] = Object.entries(GITA_VERSES)
  .map(([ref, v]) => ({ ref, ...v }))
  .sort((a, b) => {
    const [ac, av] = a.ref.split(".").map(Number);
    const [bc, bv] = b.ref.split(".").map(Number);
    return ac - bc || av - bv;
  });

/** Index of today's verse — one per day, sequential, wraps at the end. */
export function dailyVerseIndex(now = Date.now()): number {
  return ORDERED_VERSES.length ? Math.floor(now / 864e5) % ORDERED_VERSES.length : 0;
}
