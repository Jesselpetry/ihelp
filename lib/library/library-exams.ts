import "server-only";

import { isInsider } from "@/lib/auth/guards";
import { restrictedAssetsForCourse } from "@/lib/library/subject-library";
import { storageKey } from "@/lib/library/storage-key";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import { BUCKETS } from "@/lib/storage/buckets";
import { signObjectUrls } from "@/lib/storage/signed-url";

/**
 * Restricted storage bucket identifier.
 */
export const LIBRARY_EXAM_BUCKET = BUCKETS.libraryExams;

/**
 * Signs restricted assets for authorized users, or returns [] otherwise.
 *
 * isInsider() is the actual access control. The service-role client behind
 * signObjectUrls() bypasses storage policies, so it is reached only after that
 * check passes — the same shape as listExamsForInsider() in
 * lib/library/exams.ts.
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

  const byKey = await signObjectUrls("libraryExams", keys);

  return assets.flatMap((asset) => {
    const [pathPart, fragment] = asset.url.split("#");
    const signed = byKey.get(storageKey(pathPart));
    // A missing signature means the object is not in the private bucket. Drop
    // the entry rather than rendering a card that cannot open.
    if (!signed) return [];
    return [{ ...asset, url: fragment ? `${signed}#${fragment}` : signed }];
  });
}
