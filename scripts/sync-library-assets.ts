/**
 * Uploads public/assets/** to the public `ihelp-library` Supabase Storage
 * bucket.
 *
 * Why: the ~670 files under public/assets are ~908 MB of PDFs. Shipping them in
 * the repo pushed the git pack to 881 MB and the Vercel build output past 1 GB,
 * which ran the build container out of disk (ENOSPC). Storage serves them
 * instead; lib/asset-url.ts rewrites "/assets/…" to the bucket's public URL.
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

import { storageKey } from "../lib/storage-key";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS_DIR = path.join(ROOT, "public", "assets");
const BUCKET = "ihelp-library";
const CONCURRENCY = 8;
// Assets are immutable in practice — a revised handout arrives under a new
// name — so let the CDN hold them for a year instead of Storage's 1h default.
const CACHE_CONTROL = "31536000";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const envFile = path.join(ROOT, ".env.local");
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

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

/** Every object key already in the bucket, so a re-run only sends what is new. */
async function existingKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  const seen = new Set<string>();
  const queue = [""];
  while (queue.length) {
    const prefix = queue.shift()!;
    if (seen.has(prefix)) continue;
    seen.add(prefix);
    let offset = 0;
    for (;;) {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY!,
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

async function upload(file: string, key: string): Promise<number> {
  const body = fs.readFileSync(file);
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY!,
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
  const files = walk(ASSETS_DIR);
  const have = force ? new Set<string>() : await existingKeys();
  const todo = files
    .map((file) => ({
      file,
      key: storageKey(path.relative(ASSETS_DIR, file).split(path.sep).join("/")),
    }))
    .filter(({ key }) => !have.has(key));

  const totalBytes = todo.reduce((sum, { file }) => sum + fs.statSync(file).size, 0);
  const totalJobs = todo.length;
  console.log(
    `${files.length} files on disk, ${have.size} already in ${BUCKET}, ` +
      `${totalJobs} to upload (${(totalBytes / 1048576).toFixed(1)} MB)`,
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
        const bytes = await upload(job.file, job.key);
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
