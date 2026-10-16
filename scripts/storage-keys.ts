/**
 * Supabase Storage plumbing shared by the library scripts.
 *
 * scripts/sync-library-assets.ts (uploads) and scripts/library-audit.ts
 * (`--remote`, read-only) both have to answer "what is already in the bucket?",
 * and they must answer it the same way: the audit calls a file uploaded exactly
 * when the uploader would skip it. So the bucket names, the credentials lookup
 * and the listing live here once.
 *
 * Nothing in this file writes. The one request is Storage's list endpoint — a
 * POST, but a read — and the service key goes into a request header only: it is
 * never logged or put in an error message.
 */
import fs from "node:fs";
import path from "node:path";

/** Public bucket: every library file except past exams. */
export const LIBRARY_BUCKET = "ihelp-library";

/**
 * Past exams are insider-only, so they go to a private bucket instead. Keeping
 * the same object key in both means reclassifying a file is a move, not a
 * rename. See lib/library-exams.ts for the read side.
 */
export const RESTRICTED_BUCKET = "ihelp-library-exams";

export interface StorageConfig {
  url: string;
  serviceKey: string;
}

/**
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the
 * environment, falling back to `<root>/.env.local` when the URL is not set.
 * Returns null when either is still missing. Variables already in the
 * environment always win over the file.
 */
export function storageConfig(root: string): StorageConfig | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const envFile = path.join(root, ".env.local");
    if (fs.existsSync(envFile)) {
      for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
      }
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceKey ? { url, serviceKey } : null;
}

/** Every object key already in the bucket, so a re-run only sends what is new. */
export async function listBucketKeys(
  bucket: string,
  config: StorageConfig,
): Promise<Set<string>> {
  const keys = new Set<string>();
  const seen = new Set<string>();
  const queue = [""];
  while (queue.length) {
    const prefix = queue.shift()!;
    if (seen.has(prefix)) continue;
    seen.add(prefix);
    let offset = 0;
    for (;;) {
      const res = await fetch(`${config.url}/storage/v1/object/list/${bucket}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.serviceKey}`,
          apikey: config.serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix,
          limit: 1000,
          offset,
          sortBy: { column: "name", order: "asc" },
        }),
      });
      if (!res.ok) throw new Error(`list ${prefix}: ${res.status} ${await res.text()}`);
      const rows = (await res.json()) as { name: string; id: string | null }[];
      if (!rows.length) break;
      for (const row of rows) {
        const full = prefix ? `${prefix}/${row.name}` : row.name;
        // Storage gives real objects an id; folders come back with id null.
        if (row.id === null) queue.push(full);
        else keys.add(full);
      }
      if (rows.length < 1000) break;
      offset += rows.length;
    }
  }
  return keys;
}
