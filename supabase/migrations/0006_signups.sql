-- ============================================================================
-- Sign-ups: free live course interest.
-- (A 'newsletter' kind was also permitted here originally; the weekly-verse
--  list was later removed because nothing ever sent it. The check constraint
--  still allows the value, harmlessly — no code writes it. See 0011.)
-- Both are captured server-side only. These rows are personal data (name +
-- email), so nothing is readable by anon or authenticated clients — the
-- service-role key is the only way in, exactly like orders.
-- ============================================================================

create table if not exists public.signups (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('course', 'newsletter')),
  name       text,
  email      text not null,
  created_at timestamptz not null default now(),
  -- One row per person per list. Also the guard that stops a repeated submit
  -- from sending the confirmation email over and over.
  unique (kind, email)
);

create index if not exists signups_kind_created_idx on public.signups (kind, created_at desc);

alter table public.signups enable row level security;
-- Deliberately NO policies: with RLS on and no policy, nothing reaches this
-- table except the service-role key, which bypasses RLS.

-- This project strips default privileges, so every grant is explicit.
grant select, insert, update, delete on public.signups to service_role;
revoke all on public.signups from anon, authenticated;
