-- ============================================================================
-- Drop the per-verse study layer and lesson progress (added in 0001).
--
-- These served the Verse Explorer and the self-study reading plan. Both have
-- been removed: vedabase.io serves the text better than we can without a BBT
-- licence, and the site now teaches through the live course rather than asking
-- people to track solo progress against a plan. Nothing reads or writes these
-- tables any more, and StudyProvider has been reduced to auth + display name.
--
-- Only test rows existed at the time of dropping: 3 bookmarks, 1 note,
-- 2 course_progress rows.
--
-- `profiles` stays — it still carries the display name. Its reading_plan,
-- enrolled and quiz_m1_score columns go with the features they belonged to.
-- ============================================================================

drop table if exists public.bookmarks;
drop table if exists public.highlights;
drop table if exists public.notes;
drop table if exists public.last_read;
drop table if exists public.course_progress;

alter table public.profiles drop column if exists reading_plan;
alter table public.profiles drop column if exists enrolled;
alter table public.profiles drop column if exists quiz_m1_score;
