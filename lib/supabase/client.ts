"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components.
 *
 * No `db.schema` option: the `ihelp` schema is intentionally NOT exposed to
 * PostgREST, so this client is only ever used for auth and Storage. All table
 * access goes through Drizzle on the server (see db/index.ts).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
