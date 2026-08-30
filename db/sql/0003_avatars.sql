-- =============================================================================
-- iHelp - avatar storage bucket and column grants.
--
-- Apply by hand in the Supabase SQL editor AFTER db/migrations/0002_*.sql.
-- Re-runnable.
-- =============================================================================

-- Public bucket: profile pages are public, so avatars are served directly
-- rather than through a signed URL.
insert into storage.buckets (id, name, public)
values ('ihelp-avatars', 'ihelp-avatars', true)
on conflict (id) do nothing;

drop policy if exists ihelp_avatars_read on storage.objects;
create policy ihelp_avatars_read on storage.objects
  for select
  using (bucket_id = 'ihelp-avatars');

-- Writes are pinned to a folder named after the student's own id, the same way
-- ihelp-resources works: ihelp-avatars/69070027/<uuid>.webp
drop policy if exists ihelp_avatars_insert_own on storage.objects;
create policy ihelp_avatars_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'ihelp-avatars'
    and (storage.foldername(name))[1] = ihelp.current_student_id()
  );

drop policy if exists ihelp_avatars_update_own on storage.objects;
create policy ihelp_avatars_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'ihelp-avatars'
    and (storage.foldername(name))[1] = ihelp.current_student_id()
  );

drop policy if exists ihelp_avatars_delete_own on storage.objects;
create policy ihelp_avatars_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'ihelp-avatars'
    and (storage.foldername(name))[1] = ihelp.current_student_id()
  );

-- Extend the column-level UPDATE grant from db/sql/0001_rls.sql to cover the
-- new avatar column. `google_avatar_url` is deliberately NOT granted: it is
-- server-maintained from the OAuth identity on every sign-in, and `role`
-- stays ungranted so nobody can promote themselves.
grant update (avatar_url) on ihelp.users to authenticated;
