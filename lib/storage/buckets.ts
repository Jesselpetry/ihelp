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
  // Every library file except past exams: slides, lab sheets, cheatsheets,
  // scans. "Behind the login" is not "private" (AGENTS.md rule 4): the
  // library's *list* needs an IT KMITL login, but the files do not, and their
  // paths are in this public repo. Treat anything outside exams/ as public.
  // Uploaded by `bun run assets:sync`; the URL comes from assetUrl().
  library: "public",
  // The library's past exam papers, chosen by bucketForAsset(). Same object
  // keys as `library`, so reclassifying a file moves it rather than renaming
  // it. Insiders only, through libraryExamsForInsider().
  libraryExams: "private",
  // The curated /exams archive, keyed by rows in ihelp.exams. A separate list
  // from the library's past exams, in its own bucket. Insiders only, through
  // listExamsForInsider().
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
 * Which library bucket holds a card's file: `libraryExams` for a past exam,
 * `library` for everything else.
 *
 * Library files are the only objects that route between two buckets. Avatars,
 * shared resources and the /exams archive each live in exactly one, so this is
 * the one place that decision is made. The rule itself stays in
 * isRestrictedAsset() (category "exam", or a path under /exams/); this only
 * turns its answer into a bucket id for the uploader, the audit and the index
 * builder, which must all agree on where an object goes.
 */
export function bucketForAsset(
  asset: Pick<SubjectAsset, "url" | "category">,
): "library" | "libraryExams" {
  return isRestrictedAsset(asset) ? "libraryExams" : "library";
}
