import "server-only";

import { currentStudentId, isInsider } from "@/lib/auth/guards";
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
 * Verified IT students (and insiders/admins) have access to past exam materials.
 * The service-role client behind signObjectUrls() bypasses storage policies,
 * so it is reached only after verifying student authentication or insider status.
 *
 * Returns [] rather than throwing: this backs a gallery section that simply is
 * not there for unauthenticated readers, not a page they navigated to expecting content.
 */
export async function libraryExamsForInsider(code: string): Promise<SubjectAsset[]> {
  const studentId = await currentStudentId();
  const insider = await isInsider();
  if (!studentId && !insider && process.env.NODE_ENV === "production") return [];

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
