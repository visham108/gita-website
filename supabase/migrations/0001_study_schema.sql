-- ============================================================================
-- Study data schema — maps 1:1 onto the prototype's localStorage keys.
-- Every table is per-user with RLS: a user can only read/write their own rows.
-- ============================================================================

-- profiles ← bgaii_profile_v1 { name } + bgaii_plan_v1 + course enrolled/quiz
create table if not exists public.profiles (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  name          text,
  reading_plan  text check (reading_plan in ('pilgrim', 'essence', 'daily')),
  enrolled      boolean not null default false,
  quiz_m1_score integer check (quiz_m1_score between 0 and 3),
  updated_at    timestamptz not null default now()
);

-- bookmarks ← bgaii_bookmarks_v1 string[]
create table if not exists public.bookmarks (
  user_id    uuid not null references auth.users (id) on delete cascade,
  verse_ref  text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, verse_ref)
);

-- highlights ← bgaii_highlights_v1 string[]
create table if not exists public.highlights (
  user_id    uuid not null references auth.users (id) on delete cascade,
  verse_ref  text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, verse_ref)
);

-- notes ← bgaii_notes_v1 { ref: text }
create table if not exists public.notes (
  user_id    uuid not null references auth.users (id) on delete cascade,
  verse_ref  text not null,
  body       text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, verse_ref)
);

-- last_read ← bgaii_lastread_v1 { ref, when }
create table if not exists public.last_read (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  verse_ref text not null,
  read_at   timestamptz not null default now()
);

-- course_progress ← bgaii_course_v1.done { lessonId: true }
create table if not exists public.course_progress (
  user_id   uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  done_at   timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: owner-only access on every table.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles','bookmarks','highlights','notes','last_read','course_progress']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows select" on public.%I', t);
    execute format('drop policy if exists "own rows insert" on public.%I', t);
    execute format('drop policy if exists "own rows update" on public.%I', t);
    execute format('drop policy if exists "own rows delete" on public.%I', t);
    execute format('create policy "own rows select" on public.%I for select using (auth.uid() = user_id)', t);
    execute format('create policy "own rows insert" on public.%I for insert with check (auth.uid() = user_id)', t);
    execute format('create policy "own rows update" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "own rows delete" on public.%I for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;

-- Data API privileges: signed-in users only (anon gets nothing here).
-- service_role is the server-side key (adoption checks, admin, later phases).
grant select, insert, update, delete
  on public.profiles, public.bookmarks, public.highlights,
     public.notes, public.last_read, public.course_progress
  to authenticated, service_role;

revoke all
  on public.profiles, public.bookmarks, public.highlights,
     public.notes, public.last_read, public.course_progress
  from anon;
