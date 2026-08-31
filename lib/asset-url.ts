/**
 * Resolves a library asset path to where the file is actually served from.
 *
 * Library assets (621 PDFs, ~910 MB) used to ship inside public/assets. That
 * pushed the git pack to 881 MB and the Vercel build output past 1 GB, which
 * ran the build container out of disk. The files now live in the public
 * `ihelp-library` Supabase Storage bucket, uploaded by
 * scripts/sync-library-assets.mjs.
 *
 * Asset entries — hand-written ones in lib/subject-library.ts and generated
 * ones in lib/library-manifest.json — still carry the original "/assets/…"
 * path, because that path is the object key and the stats/manifest scripts key
 * off it. This function is the single point where that path becomes a URL.
 */

import { storageKey } from "@/lib/storage-key";

const BUCKET = "ihelp-library";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Public base for the bucket, or null when Supabase is not configured. */
const CDN_BASE = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${BUCKET}`
  : null;

/**
 * Maps "/assets/it-kmitl/itf/exams/foo.pdf" to its Storage URL. A fragment
 * (`#page=3`) is preserved — the PDF viewer relies on it.
 *
 * Anything that is not an /assets path is returned untouched: absolute URLs to
 * iJudge, /pyodide/*, and site-relative links all pass straight through.
 * Without a configured Supabase URL it also returns the input unchanged, so a
 * local checkout that still has the files on disk keeps working.
 */
export function assetUrl(url: string): string {
  if (!CDN_BASE) return url;
  if (!url.startsWith("/assets/")) return url;
  const hash = url.indexOf("#");
  const pathPart = hash === -1 ? url : url.slice(0, hash);
  const fragment = hash === -1 ? "" : url.slice(hash);
  // storageKey() decides the object key — including sanitizing non-ASCII names
  // that Supabase refuses — and encodeURIComponent then makes each segment
  // URL-safe without eating the slashes between them.
  const key = storageKey(pathPart).split("/").map(encodeURIComponent).join("/");
  return `${CDN_BASE}/${key}${fragment}`;
}

/**
 * Same URL, but asking Storage to send Content-Disposition: attachment with the
 * asset's real filename.
 *
 * The `download` attribute on an <a> is ignored for cross-origin hrefs, so once
 * assets moved off the site's own origin the download buttons would have
 * navigated to the PDF instead of saving it. Supabase's ?download= parameter
 * restores the behaviour, and it carries the Thai filenames intact because the
 * response uses RFC 5987 filename*=UTF-8''.
 */
export function assetDownloadUrl(url: string, fileName: string): string {
  if (!CDN_BASE || !url.startsWith(CDN_BASE)) return url;
  const [base, fragment = ""] = url.split("#");
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}download=${encodeURIComponent(fileName)}${fragment ? `#${fragment}` : ""}`;
}
