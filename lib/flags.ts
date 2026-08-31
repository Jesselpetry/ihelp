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

/**
 * Covers the per-course resource library — the asset gallery on
 * /courses/[dir]/archive — with a "coming soon" overlay.
 *
 * Same default-ON convention as LIBRARY_COMING_SOON above: a build with no
 * configuration keeps the gallery covered, and developers opt out with
 * `NEXT_PUBLIC_RESOURCE_LIBRARY_COMING_SOON=0` in their gitignored .env.local.
 *
 * This is a presentation-level cover, not access control. The overlay dims and
 * disables the gallery, but the asset list is still in the page payload and the
 * Storage URLs it points at are public. Anything that must not be readable yet
 * has to be withheld server-side or moved to a private bucket instead.
 */
export const RESOURCE_LIBRARY_COMING_SOON =
  process.env.NEXT_PUBLIC_RESOURCE_LIBRARY_COMING_SOON !== "0";
