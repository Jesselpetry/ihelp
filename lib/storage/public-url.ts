import { BUCKETS, type BucketId } from "@/lib/storage/buckets";

/**
 * Written as a literal `process.env.NEXT_PUBLIC_…` property read on purpose.
 * Next inlines the value at build time only when it sees exactly that
 * expression, and assetDownloadUrl() runs inside Client Components, so
 * `process.env[name]` or a destructured read would be undefined in the browser.
 * Synchronous for the same reason: a client render cannot await a URL.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * The project URL without trailing slashes, so the joins below never double
 * one, or null when Supabase is not configured. Worked out once at load:
 * assetDownloadUrl() asks for it on every row a library table renders.
 */
const SUPABASE_BASE = SUPABASE_URL ? SUPABASE_URL.replace(/\/+$/, "") : null;

/**
 * `<supabase>/storage/v1/object/public/<bucket>`, the prefix every public URL
 * for a bucket starts with, or null when Supabase is not configured.
 */
function publicBucketBase(bucket: BucketId): string | null {
  if (SUPABASE_BASE === null) return null;
  return `${SUPABASE_BASE}/storage/v1/object/public/${BUCKETS[bucket]}`;
}

/**
 * The public URL of an object in a public bucket, or null when Supabase is not
 * configured (a local checkout without .env.local). Each caller decides what
 * "no URL" means for it: assetUrl() keeps the on-disk path, resolveAvatarUrl()
 * falls back to the Google picture, resourcePublicUrl() to "#".
 *
 * Every key segment is percent-encoded and the slashes between them are kept.
 * Only meaningful for buckets marked "public" in BUCKET_ACCESS: a private
 * bucket refuses this path, and a signed URL is the only way in.
 */
export function publicObjectUrl(bucket: BucketId, key: string): string | null {
  const base = publicBucketBase(bucket);
  if (base === null) return null;
  return `${base}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Whether a URL points into the given public bucket. assetDownloadUrl() uses it
 * to tell our own Storage URLs from anything else a card can carry, so it only
 * appends `?download=` where Supabase understands it.
 *
 * The trailing slash keeps `ihelp-library` from also claiming
 * `ihelp-library-exams`, whose name starts with the same characters.
 */
export function isPublicObjectUrl(bucket: BucketId, url: string): boolean {
  const base = publicBucketBase(bucket);
  return base !== null && url.startsWith(`${base}/`);
}
