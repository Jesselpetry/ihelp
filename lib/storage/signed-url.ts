import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKETS, type BucketId } from "@/lib/storage/buckets";

/** Long enough to open the file, short enough not to be worth passing around. */
export const SIGNED_URL_TTL_SECONDS = 60 * 10;

/**
 * Short-lived signed URLs for objects in a private bucket, keyed by the object
 * key you passed in (Storage echoes it back as `path`).
 *
 * A key Storage cannot find or sign is absent from the map, so the caller
 * decides what that means: libraryExamsForInsider() drops the card,
 * listExamsForInsider() shows the row without a link. A failed request yields
 * an empty map instead of a throw, so a Storage outage leaves those pages
 * rendering without links rather than erroring.
 *
 * This is NOT an access check. It signs with the service-role client, which
 * bypasses Storage policies, so it will sign anything for whoever reaches it.
 * Call it only after isInsider() / requireInsider() has passed; both callers
 * run that guard first and never get here otherwise.
 */
export async function signObjectUrls(
  bucket: BucketId,
  keys: string[],
  ttlSeconds = SIGNED_URL_TTL_SECONDS,
): Promise<Map<string, string>> {
  const storage = createAdminClient().storage.from(BUCKETS[bucket]);
  const { data } = await storage.createSignedUrls(keys, ttlSeconds);

  const signed = new Map<string, string>();
  for (const entry of data ?? []) {
    // An object Storage cannot find comes back with an error string and a null
    // URL instead of failing the whole batch; leave it out of the map.
    if (entry.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
  }
  return signed;
}
