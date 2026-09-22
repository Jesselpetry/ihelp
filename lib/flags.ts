/**
 * Build-time feature flags.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so these are safe to read
 * from both server and client components.
 */

/**
 * Turns community uploads (/upload and the "แชร์" entry in the account menu)
 * on.
 *
 * Defaults to OFF, so a build with no configuration at all - production on
 * `main` included - accepts no new files. Developers opt in by putting
 * `NEXT_PUBLIC_UPLOADS_ENABLED=1` in their `.env.local`, which is gitignored,
 * so `main` and `dev` share identical code.
 *
 * The flag hides the entry points; `createResource` refuses the write on its
 * own, so a stale form or a hand-rolled POST gets nowhere either.
 */
export const UPLOADS_ENABLED = process.env.NEXT_PUBLIC_UPLOADS_ENABLED === "1";
