-- ============================================================================
-- Drop the verses table (added in 0008, search column in 0009).
--
-- The Verse Explorer that read it has been removed: vedabase.io serves the same
-- Sanskrit plus the translation and purports, which we have no licence to show,
-- so pointing readers there beats hosting a strictly poorer copy. Nothing reads
-- this table any more. The essence notes it held are dropped with it.
--
-- Migrations 0008 and 0009 are kept in place rather than deleted: replaying the
-- history from scratch should reproduce what actually happened, including the
-- steps that were later undone.
-- ============================================================================

drop index if exists public.verses_search_idx;
drop table if exists public.verses;
