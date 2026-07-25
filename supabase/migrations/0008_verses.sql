-- ============================================================================
-- Full Bhagavad-gītā Sanskrit text for the Verse Explorer.
--
-- Devanāgarī and IAST transliteration are PUBLIC DOMAIN (the ślokas are
-- ancient); sourced from an MIT-licensed compilation and normalised to the
-- site's conventions. The English `essence` notes are ORIGINAL prose written
-- for this site — they are NOT BBT text, and are not a substitute for the
-- translation or purports, which stay in the book.
--
-- Numbering follows the standard recension (chapter 1 has 47 verses). BBT's
-- printed edition prints some verses as combined blocks and numbers chapter 1
-- to 46, so per-verse deep links to vedabase.io are unsafe — the Explorer links
-- at CHAPTER level instead.
-- ============================================================================

create table if not exists public.verses (
  chapter         smallint not null check (chapter between 1 and 18),
  verse           smallint not null check (verse > 0),
  devanagari      text not null,
  transliteration text not null,
  essence         text,
  updated_at      timestamptz not null default now(),
  primary key (chapter, verse)
);

create index if not exists verses_chapter_idx on public.verses (chapter, verse);

alter table public.verses enable row level security;

-- Scripture is public: anyone may read it. Only the server writes.
drop policy if exists "verses read" on public.verses;
create policy "verses read" on public.verses for select using (true);

-- This project strips default privileges — every grant is explicit.
grant select on public.verses to anon, authenticated;
grant select, insert, update, delete on public.verses to service_role;
