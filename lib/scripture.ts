/* Server-side access to the full Sanskrit text of the Bhagavad-gītā.

   The verses live in Postgres rather than the JS bundle: shipping all 701 to
   every visitor would add hundreds of kilobytes to first load, and the text is
   read a chapter at a time. Cached and tagged so a correction or a newly
   written essence propagates without a redeploy.

   Distinct from lib/verses.ts, which holds the small curated set powering the
   verse-of-the-day sequence. */

export const VERSES_TAG = "verses";

export interface DbVerse {
  chapter: number;
  verse: number;
  devanagari: string;
  transliteration: string;
  essence: string | null;
}

function creds() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anon ? { url, anon } : null;
}

/* Two cache lifetimes, deliberately.

   The Sanskrit never changes, so a chapter can sit in cache for an hour. But
   search matches against the essence notes as well, and those are still being
   written — an hour-long cache would keep serving "no results" for a word whose
   note was added minutes ago. (This bit during development: a search run before
   the folded column existed kept returning zero long after it was fixed.) */
const CACHE_CHAPTER = 3600;
const CACHE_SEARCH = 60;

async function query(path: string, revalidate = CACHE_CHAPTER): Promise<DbVerse[]> {
  const c = creds();
  if (!c) return [];
  try {
    const res = await fetch(`${c.url}/rest/v1/verses?${path}`, {
      headers: { apikey: c.anon, Authorization: `Bearer ${c.anon}` },
      next: { revalidate, tags: [VERSES_TAG] },
    });
    if (!res.ok) return [];
    return (await res.json()) as DbVerse[];
  } catch {
    return [];
  }
}

const COLS = "chapter,verse,devanagari,transliteration,essence";

export function getChapterVerses(chapter: number): Promise<DbVerse[]> {
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 18) return Promise.resolve([]);
  return query(`select=${COLS}&chapter=eq.${chapter}&order=verse.asc`);
}

export function getVerse(chapter: number, verse: number): Promise<DbVerse[]> {
  return query(`select=${COLS}&chapter=eq.${chapter}&verse=eq.${verse}&limit=1`);
}

/** How many verses each chapter actually holds. Read from the data rather than
    hard-coded, because editions disagree — BBT numbers chapter 1 to 46 where
    the standard recension has 47. */
export async function getVerseCounts(): Promise<Record<number, number>> {
  const rows = await query("select=chapter,verse&order=chapter.asc,verse.asc");
  const counts: Record<number, number> = {};
  for (const r of rows) counts[r.chapter] = (counts[r.chapter] ?? 0) + 1;
  return counts;
}

/** Strip diacritics so a plain keyboard finds the text: "krsna" → "kṛṣṇa",
    "atma" → "ātmā". NFD splits a letter from its marks; removing the marks
    leaves ASCII. The stored `search_text` column is folded the same way. */
export function fold(s: string): string {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-̣̱ͯ]/g, "")
    .replace(/[’'`]/g, "")
    .toLowerCase();
}

/** Search the Sanskrit and the essence notes. Matching runs against the folded
    column so diacritics are optional. "2.47" style references are resolved by
    the caller before reaching here. */
export async function searchVerses(q: string): Promise<DbVerse[]> {
  // PostgREST treats commas and parens as syntax inside or=(), so strip them.
  const clean = fold(q).replace(/[,()*%]/g, " ").trim();
  if (clean.length < 2) return [];
  const enc = encodeURIComponent(`*${clean}*`);
  return query(
    `select=${COLS}&search_text=ilike.${enc}&order=chapter.asc,verse.asc&limit=60`,
    CACHE_SEARCH
  );
}
