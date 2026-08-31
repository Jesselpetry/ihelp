/**
 * Build-time feature flags.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so these are safe to read
 * from both server and client components.
 */

/**
 * Hides the resource library behind a "coming soon" cover.
 *
 * Defaults to ON, so a build with no configuration at all - production on
 * `main` included - keeps the library covered. Developers opt out by putting
 * `NEXT_PUBLIC_LIBRARY_COMING_SOON=0` in their `.env.local`, which is
 * gitignored, so `main` and `dev` share identical code and no future merge
 * conflicts on this file.
 *
 * Opening the library to everyone is then a one-word change here.
 */
export const LIBRARY_COMING_SOON =
  process.env.NEXT_PUBLIC_LIBRARY_COMING_SOON !== "0";
