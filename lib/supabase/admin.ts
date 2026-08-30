import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * Used for exactly one thing: minting short-lived signed URLs for the private
 * `ihelp-exams` bucket, after requireInsider() has already authorized the
 * caller. Do not reach for it anywhere else.
 *
 * The `server-only` import makes the build fail if this module is ever pulled
 * into a Client Component bundle.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
