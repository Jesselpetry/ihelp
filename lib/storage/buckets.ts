import { isRestrictedAsset, type SubjectAsset } from "@/lib/library/subject-library-ui";

/**
 * The five Supabase Storage buckets: the name the code uses, mapped to the id
 * Supabase knows the bucket by.
 *
 * Application code takes every bucket id from here, so each string exists once.
 * They are not free to rename: the objects live under these ids, the policies
 * in db/sql/ name them (`bucket_id = 'ihelp-avatars'`), and the generated
 * lib/library/resource-index.json records them as each card's storage bucket.
 *
 * Plain data, deliberately neither "use client" nor "server-only". Client
 * Components import it (the avatar and upload forms write to Storage straight
 * from the browser) and so do the tsx scripts, where `server-only` throws as
 * soon as it is imported.
 */
export const BUCKETS = {
  library: "ihelp-library",
  libraryExams: "ihelp-library-exams",
  exams: "ihelp-exams",
  resources: "ihelp-resources",
  avatars: "ihelp-avatars",
} as const;

export type BucketId = keyof typeof BUCKETS;

/**
 * Who can read an object without the app handing them a URL.
 *
 * - "public": the bucket is public in Supabase, so anyone holding the object
 *   URL can fetch it, signed in or not. Build that URL with publicObjectUrl().
 * - "private": no URL works until the server mints a signed one with
 *   signObjectUrls(), and it only does that after an insider check.
 */
export type BucketAccess = "public" | "private";

export const BUCKET_ACCESS = {
  // Library media files: slides, lab sheets, cheatsheets, notes.
  // Uploaded by `bun run assets:sync`; the URL comes from assetUrl().
  library: "public",
  // Restricted library assets.
  libraryExams: "private",
  // Curated exams archive.
  exams: "private",
  // Files students share with the class (lib/actions/upload.ts); sharing is
  // off unless NEXT_PUBLIC_UPLOADS_ENABLED. The browser uploads under its own
  // <studentId>/ prefix, and the object path is a stable public URL.
  resources: "public",
  // Profile pictures students uploaded, <studentId>/<uuid>.webp. Public so an
  // <img> can load them; resolveAvatarUrl() falls back to the Google picture.
  avatars: "public",
} as const satisfies Record<BucketId, BucketAccess>;

/**
 * Which library bucket holds a card's file.
 */
export function bucketForAsset(
  asset: Pick<SubjectAsset, "url" | "category">,
): "library" | "libraryExams" {
  return isRestrictedAsset(asset) ? "libraryExams" : "library";
}
