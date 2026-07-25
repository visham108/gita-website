-- ============================================================================
-- Diacritic-folded search column.
--
-- Readers type "krsna", "atma", "moksa" on an ordinary keyboard, but the
-- transliteration holds "kṛṣṇa", "ātmā", "mokṣa" — so a literal ILIKE found
-- nothing. `search_text` holds an ASCII-folded copy of the transliteration plus
-- the essence note, and all searching runs against it.
--
-- Populated from the application side (Unicode NFD, then strip the combining
-- marks), and refreshed whenever an essence note is written.
-- ============================================================================

alter table public.verses add column if not exists search_text text;

-- pg_trgm keeps the ILIKE '%…%' scans cheap; without it Postgres falls back to
-- a sequential scan, survivable at 701 rows but wasteful.
create extension if not exists pg_trgm;
create index if not exists verses_search_idx
  on public.verses using gin (search_text gin_trgm_ops);
