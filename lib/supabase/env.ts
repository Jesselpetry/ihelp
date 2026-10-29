/**
 * False when the Supabase URL or anon key is unset (e.g. a local checkout
 * without credentials). Callers then skip Supabase and treat every visitor as
 * signed out, so the public study pages still render.
 *
 * Direct `process.env.NEXT_PUBLIC_*` reads so Next inlines them in the browser.
 */
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
