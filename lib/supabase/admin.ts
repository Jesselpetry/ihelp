import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * Used by server storage functions after authorization checks.
 * Reached through signObjectUrls() in lib/storage/signed-url.ts.
 * Do not reach for it anywhere else.
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
