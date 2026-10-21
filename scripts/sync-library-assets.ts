/**
 * Uploads public/assets/** to the public `ihelp-library` Supabase Storage
 * bucket.
 *
 * Why: the ~670 files under public/assets are ~908 MB of PDFs. Shipping them in
 * the repo pushed the git pack to 881 MB and the Vercel build output past 1 GB,
 * which ran the build container out of disk (ENOSPC). Storage serves them
 * instead; lib/library/asset-url.ts rewrites "/assets/…" to the bucket's public
 * URL.
 *
 * The files stay on disk locally (gitignored) so build-library-manifest.mjs and
 * build-library-stats.mjs can still scan them — their committed JSON output is
 * what ships. Re-run this after dropping new files in, before pushing.
 *
 * Usage:
 *   npm run assets:sync            # upload whatever is missing
 *   npm run assets:sync -- --force # re-upload everything
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, read from
 * the environment or from .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { storageKey } from "../lib/library/storage-key";
import { coursesWithAssets, mergedAssets } from "../lib/library/subject-library";
import { isRestrictedAsset } from "../lib/library/subject-library-ui";
import { BUCKETS, bucketForAsset } from "../lib/storage/buckets";
// The bucket names, the .env.local lookup and the bucket listing are shared with
// scripts/library-audit.ts, which runs the same listing read-only (`--remote`).
import { LIBRARY_BUCKET, RESTRICTED_BUCKET, listBucketKeys, storageConfig } from "./storage-keys";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS_DIR = path.join(ROOT, "public", "assets");
const CONCURRENCY = 8;
// Assets are immutable in practice — a revised handout arrives under a new
// name — so let the CDN hold them for a year instead of Storage's 1h default.
const CACHE_CONTROL = "31536000";

const config = storageConfig(ROOT);
if (!config) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}
const STORAGE = config;
const SUPABASE_URL = STORAGE.url;
const SERVICE_KEY = STORAGE.serviceKey;

const force = process.argv.includes("--force");

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".circ": "application/octet-stream",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

async function upload(file: string, key: string, bucket: string): Promise<number> {
  const body = fs.readFileSync(file);
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": CACHE_CONTROL,
      "x-upsert": "true",
    },
    body: new Uint8Array(body),
  });
  if (!res.ok) throw new Error(`${key}: ${res.status} ${await res.text()}`);
  return body.length;
}

// Wrapped rather than left at top level: tsx transforms this file to CJS,
// where a top-level await throws ERR_REQUIRE_ASYNC_MODULE.
async function main() {
  // Which keys are past exams, decided by the library data rather than by path:
  // ten scanned exam pages live outside any exams/ folder, and uploading those
  // to the public bucket would publish them. Files on disk that the manifest
  // does not know about fall back to the path check inside bucketForAsset().
  const restricted = new Set<string>();
  for (const code of coursesWithAssets()) {
    for (const asset of mergedAssets(code)) {
      if (isRestrictedAsset(asset)) restricted.add(storageKey(asset.url.split("#")[0]));
    }
  }

  const files = walk(ASSETS_DIR);
  const have = force
    ? new Set<string>()
    : new Set([
        ...(await listBucketKeys(LIBRARY_BUCKET, STORAGE)),
        ...[...(await listBucketKeys(RESTRICTED_BUCKET, STORAGE))].map((k) => `${RESTRICTED_BUCKET}/${k}`),
      ]);

  const todo = files
    .map((file) => {
      const rel = path.relative(ASSETS_DIR, file).split(path.sep).join("/");
      const key = storageKey(rel);
      // A file has no category of its own, so a card that is a past exam hands
      // its "exam" down to the file; bucketForAsset() does the routing, path
      // check included, so this and the audit never keep a copy of the rule.
      const bucketId = bucketForAsset({
        url: `/assets/${rel}`,
        category: restricted.has(key) ? "exam" : undefined,
      });
      const bucket = BUCKETS[bucketId];
      return { file, key, bucket, seen: bucket === RESTRICTED_BUCKET ? `${RESTRICTED_BUCKET}/${key}` : key };
    })
    .filter(({ seen }) => !have.has(seen));

  const totalBytes = todo.reduce((sum, { file }) => sum + fs.statSync(file).size, 0);
  const totalJobs = todo.length;
  const restrictedJobs = todo.filter((j) => j.bucket === RESTRICTED_BUCKET).length;
  console.log(
    `${files.length} files on disk, ${have.size} already uploaded, ` +
      `${totalJobs} to upload (${(totalBytes / 1048576).toFixed(1)} MB) — ` +
      `${restrictedJobs} of them past exams into ${RESTRICTED_BUCKET}`,
  );

  let done = 0;
  let sent = 0;
  const failures: string[] = [];
  const started = Date.now();

  async function worker() {
    for (;;) {
      const job = todo.pop();
      if (!job) return;
      try {
        const bytes = await upload(job.file, job.key, job.bucket);
        // Read-modify-write in one tick. `sent += await …` would re-read a stale
        // `sent` after the await and clobber whatever the other workers added.
        sent += bytes;
      } catch (err) {
        failures.push(`${job.key}: ${(err as Error).message}`);
      }
      done += 1;
      if (done % 50 === 0 || done === totalJobs) {
        const secs = (Date.now() - started) / 1000;
        console.log(
          `  ${done}/${totalJobs} files, ${(sent / 1048576).toFixed(0)} MB, ` +
            `${(sent / 1048576 / secs).toFixed(1)} MB/s`,
        );
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`uploaded ${done - failures.length} files, ${(sent / 1048576).toFixed(1)} MB`);
  if (failures.length) {
    console.error(`\n${failures.length} failures:`);
    for (const failure of failures.slice(0, 20)) console.error(`  ${failure}`);
    process.exit(1);
  }
}

main();
