import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKETS, type BucketId } from "@/lib/storage/buckets";

/** Long enough to study or take an exam, without leaving links permanently public. */
export const SIGNED_URL_TTL_SECONDS = 60 * 60 * 2; // 2 hours

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
  const signed = new Map<string, string>();
  try {
    const storage = createAdminClient().storage.from(BUCKETS[bucket]);
    const { data, error } = await storage.createSignedUrls(keys, ttlSeconds);
    if (error) {
      console.error(`signObjectUrls error for bucket ${bucket}:`, error);
      return signed;
    }

    for (const entry of data ?? []) {
      // An object Storage cannot find comes back with an error string and a null
      // URL instead of failing the whole batch; leave it out of the map.
      if (entry.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
    }
  } catch (err) {
    console.error(`signObjectUrls exception for bucket ${bucket}:`, err);
  }
  return signed;
}

export function storageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Downloads and parses a private JSON object using the service-role client.
 * Callers must enforce their own session/authorization checks before reading
 * sensitive student records.
 */
export async function downloadPrivateJson<T>(
  bucket: BucketId,
  key: string,
): Promise<T | null> {
  if (!storageConfigured()) return null;
  try {
    const { data, error } = await createAdminClient()
      .storage.from(BUCKETS[bucket])
      .download(key);
    if (error || !data) return null;
    return JSON.parse(await data.text()) as T;
  } catch (err) {
    console.error(`downloadPrivateJson exception for ${bucket}/${key}:`, err);
    return null;
  }
}
