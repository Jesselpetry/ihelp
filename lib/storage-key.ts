/**
 * Maps a library asset's public path to its object key in the `ihelp-library`
 * Supabase Storage bucket.
 *
 * Supabase rejects non-ASCII object keys outright (400 InvalidKey), and one
 * file in the library is named in Thai — with more likely to follow, since the
 * dropzone SOP invites dropping course files in under their real names. So the
 * key is sanitized while the name on disk is left alone: the manifest keeps
 * deriving a Thai title and download filename from the real name, and only the
 * key — which nobody reads — is transliterated.
 *
 * Both the uploader (scripts/sync-library-assets.ts) and the URL resolver
 * (lib/asset-url.ts) call this, so the two can never disagree about where a
 * file lives.
 */

/**
 * FNV-1a, 32-bit, hex. Not a security hash — it just disambiguates two
 * segments that sanitize to the same ASCII stem. Chosen because it is a few
 * lines of synchronous integer math that behave identically in Node and in the
 * browser, unlike crypto.subtle which is async and would force assetUrl() to
 * become a promise.
 */
function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

/** Sanitizes one path segment, keeping its extension readable. */
function safeSegment(segment: string): string {
  if (SAFE_SEGMENT.test(segment)) return segment;

  const dot = segment.lastIndexOf(".");
  const hasExt = dot > 0 && SAFE_SEGMENT.test(segment.slice(dot + 1));
  const base = hasExt ? segment.slice(0, dot) : segment;
  const ext = hasExt ? segment.slice(dot).toLowerCase() : "";

  const stem = base
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");

  // The hash is always appended, so two different Thai names that reduce to the
  // same stem — or to nothing at all — still get distinct keys.
  return `${stem ? `${stem}-` : ""}${fnv1a(segment)}${ext}`;
}

/**
 * "/assets/it-kmitl/itf/exams/foo.pdf" -> "it-kmitl/itf/exams/foo.pdf".
 * Accepts a path with or without the leading "/assets/".
 */
export function storageKey(assetPath: string): string {
  return assetPath
    .replace(/^\/?assets\//, "")
    .split("/")
    .filter(Boolean)
    .map(safeSegment)
    .join("/");
}
