-- =============================================================================
-- iHelp - row level security for the footer visitor counter.
--
-- Apply by hand in the Supabase SQL editor AFTER db/migrations/0001_*.sql.
-- Re-runnable.
-- =============================================================================

-- Deny-all by design: RLS on, zero policies, no grants. Nothing but the
-- Drizzle connection (the `postgres` role, via app/api/views) may read or write
-- this table, and `ihelp` is not exposed to PostgREST anyway. Visit counts are
-- aggregated for the footer by the server, never queried from the browser.
alter table ihelp.site_visits enable row level security;

-- Housekeeping: the table grows by one row per visitor per day, so a year of
-- traffic is small. If it ever needs trimming, daily rows older than the
-- all-time window cannot be dropped without changing the all-time figure --
-- roll them into a summary row first rather than deleting outright.
