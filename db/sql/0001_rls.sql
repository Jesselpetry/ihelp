-- =============================================================================
-- iHelp — foreign key to auth.users, row level security, and storage policies.
--
-- Apply by hand in the Supabase SQL editor AFTER db/migrations/0000_*.sql.
-- Not managed by drizzle-kit: it would try to recreate auth.users, and it does
-- not model policies at all.
--
-- Re-runnable.
-- =============================================================================

-- ── auth.users foreign key ───────────────────────────────────────────────────
-- Declared here rather than in db/schema.ts: referencing a pgSchema table from
-- the Drizzle schema makes drizzle-kit emit `CREATE TABLE "auth"."users"`,
-- which would collide with the auth schema Supabase and itgg-2026 rely on.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_auth_user_id_fkey'
  ) then
    alter table ihelp.users
      add constraint users_auth_user_id_fkey
      foreign key (auth_user_id) references auth.users(id) on delete cascade;
  end if;
end $$;

-- ── Minimal grants ───────────────────────────────────────────────────────────
-- USAGE only. `authenticated` needs to resolve ihelp.* in order to call the
-- helper functions from the Storage policies below. No table privileges are
-- granted, and `ihelp` is deliberately NOT added to
-- Settings -> API -> Exposed schemas, so PostgREST cannot route to these
-- tables at all. The table policies further down are defence in depth for the
-- day somebody widens a grant.
grant usage on schema ihelp to authenticated;

-- ── Identity helpers ─────────────────────────────────────────────────────────
-- SECURITY DEFINER for two reasons: it avoids recursive policy evaluation when
-- a policy on ihelp.users needs to read ihelp.users, and it works without
-- granting SELECT on the table to `authenticated`.
create or replace function ihelp.current_student_id()
returns varchar
language sql
stable
security definer
set search_path = ihelp, public
as $$
  select u.student_id from ihelp.users u where u.auth_user_id = auth.uid();
$$;

create or replace function ihelp.is_insider()
returns boolean
language sql
stable
security definer
set search_path = ihelp, public
as $$
  select exists (
    select 1
    from ihelp.users u
    where u.auth_user_id = auth.uid()
      and u.role in ('insider', 'admin')
  );
$$;

revoke execute on function ihelp.current_student_id() from public;
revoke execute on function ihelp.is_insider() from public;
grant execute on function ihelp.current_student_id() to authenticated;
grant execute on function ihelp.is_insider() to authenticated;

-- ── Enable RLS ───────────────────────────────────────────────────────────────
alter table ihelp.users     enable row level security;
alter table ihelp.resources enable row level security;
alter table ihelp.exams     enable row level security;

-- ── users: profiles are public within the community; edit only your own ──────
drop policy if exists users_select_all on ihelp.users;
create policy users_select_all on ihelp.users
  for select to authenticated
  using (true);

drop policy if exists users_insert_own on ihelp.users;
create policy users_insert_own on ihelp.users
  for insert to authenticated
  with check (auth_user_id = auth.uid());

drop policy if exists users_update_own on ihelp.users;
create policy users_update_own on ihelp.users
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- Column-level lock so a student can never self-promote to insider/admin,
-- reassign their student_id, or point their row at another auth identity.
-- Mirrors the itgg_2026.profiles pattern in itgg-2026/db/migrations/0001.
revoke update on ihelp.users from authenticated;
grant update (first_name, last_name, nickname, major, facebook_url, ig_url)
  on ihelp.users to authenticated;

-- ── resources: every verified IT user reads; you insert only as yourself ─────
drop policy if exists resources_select_all on ihelp.resources;
create policy resources_select_all on ihelp.resources
  for select to authenticated
  using (true);

drop policy if exists resources_insert_own on ihelp.resources;
create policy resources_insert_own on ihelp.resources
  for insert to authenticated
  with check (uploader_id = ihelp.current_student_id());

drop policy if exists resources_update_own on ihelp.resources;
create policy resources_update_own on ihelp.resources
  for update to authenticated
  using (uploader_id = ihelp.current_student_id())
  with check (uploader_id = ihelp.current_student_id());

drop policy if exists resources_delete_own on ihelp.resources;
create policy resources_delete_own on ihelp.resources
  for delete to authenticated
  using (uploader_id = ihelp.current_student_id());

-- ── exams: STRICT ────────────────────────────────────────────────────────────
-- Only insider|admin may read. No INSERT/UPDATE/DELETE policy exists, so
-- `authenticated` cannot write at all; the archive is curated by service role.
drop policy if exists exams_select_insiders on ihelp.exams;
create policy exams_select_insiders on ihelp.exams
  for select to authenticated
  using (ihelp.is_insider());

-- ── Storage buckets ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('ihelp-resources', 'ihelp-resources', true),
  ('ihelp-exams',     'ihelp-exams',     false)
on conflict (id) do nothing;

-- storage.objects already has RLS enabled by Supabase.

drop policy if exists ihelp_resources_read on storage.objects;
create policy ihelp_resources_read on storage.objects
  for select to authenticated
  using (bucket_id = 'ihelp-resources');

-- Uploads must land in a folder named after the uploader's own student id:
--   ihelp-resources/69070027/<uuid>.pdf
-- This is what makes a forged uploader_id useless: the file itself cannot be
-- written outside the student's own prefix.
drop policy if exists ihelp_resources_insert_own on storage.objects;
create policy ihelp_resources_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'ihelp-resources'
    and (storage.foldername(name))[1] = ihelp.current_student_id()
  );

drop policy if exists ihelp_resources_delete_own on storage.objects;
create policy ihelp_resources_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'ihelp-resources'
    and (storage.foldername(name))[1] = ihelp.current_student_id()
  );

-- Private bucket: insiders and admins only, and only through a signed URL.
drop policy if exists ihelp_exams_read_insiders on storage.objects;
create policy ihelp_exams_read_insiders on storage.objects
  for select to authenticated
  using (bucket_id = 'ihelp-exams' and ihelp.is_insider());
