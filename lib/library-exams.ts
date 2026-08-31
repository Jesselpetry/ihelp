import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { isInsider } from "@/lib/auth/guards";
import { restrictedAssetsForCourse } from "@/lib/subject-library";
import { storageKey } from "@/lib/storage-key";
import type { SubjectAsset } from "@/lib/subject-library-ui";

/**
 * Private bucket holding the library's past exam papers.
 *
 * Separate from `ihelp-exams`, which backs the curated /exams archive and is
 * keyed by rows in ihelp.exams. This one mirrors the public ihelp-library
 * layout — same object keys — so a file's key does not change when it is
 * reclassified as an exam.
 */
export const LIBRARY_EXAM_BUCKET = "ihelp-library-exams";

/** Long enough to open the file, short enough not to be worth passing around. */
const SIGNED_URL_TTL_SECONDS = 60 * 10;

/**
 * A course's past exams with short-lived signed URLs, or [] for anyone who is
 * not an insider.
 *
 * isInsider() is the actual access control. The service-role client used for
 * signing bypasses storage policies, so it is reached only after that check
 * passes — the same shape as listExamsForInsider() in lib/exams.ts.
 *
 * Returns [] rather than throwing: this backs a gallery section that simply is
 * not there for most readers, not a page they navigated to expecting content.
 */
export async function libraryExamsForInsider(code: string): Promise<SubjectAsset[]> {
  if (!(await isInsider())) return [];

  const assets = restrictedAssetsForCourse(code);
  if (assets.length === 0) return [];

  // One asset can appear twice under different fragments (#page=3); sign each
  // underlying object once and hand the same URL to every entry that wants it.
  const keys = [...new Set(assets.map((a) => storageKey(a.url.split("#")[0])))];

  const storage = createAdminClient().storage.from(LIBRARY_EXAM_BUCKET);
  const { data } = await storage.createSignedUrls(keys, SIGNED_URL_TTL_SECONDS);
  const byKey = new Map((data ?? []).map((d) => [d.path, d.signedUrl] as const));

  return assets.flatMap((asset) => {
    const [pathPart, fragment] = asset.url.split("#");
    const signed = byKey.get(storageKey(pathPart));
    // A missing signature means the object is not in the private bucket. Drop
    // the entry rather than rendering a card that cannot open.
    if (!signed) return [];
    return [{ ...asset, url: fragment ? `${signed}#${fragment}` : signed }];
  });
}
