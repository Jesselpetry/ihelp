/**
 * Syncs generated score JSON files (`local/scores/data/*.json`) to the
 * private `ihelp-scores` Supabase Storage bucket so Vercel deployments
 * (`staging` and `main`) can serve authenticated @kmitl.ac.th score sheets
 * without ever committing student grades or PII to the public GitHub repo.
 *
 * Usage:
 *   bun run scores:sync
 *
 * Never uploads spreadsheets under `local/scores/sheets/` or `sources.json`.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or .env.local).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ScoreManifest,
  ScoreManifestEntry,
  ScoreSheet,
} from "../lib/scores/sheet-types";
import { BUCKETS } from "../lib/storage/buckets";
import { storageConfig, type StorageConfig } from "./storage-keys";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCORES_DATA_DIR = path.join(ROOT, "local", "scores", "data");
const BUCKET = BUCKETS.scores;

async function ensurePrivateBucket(config: StorageConfig): Promise<void> {
  const res = await fetch(`${config.url}/storage/v1/bucket/${BUCKET}`, {
    headers: {
      Authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
    },
  });

  if (res.ok) {
    const bucket = (await res.json()) as { public?: boolean };
    if (bucket.public) {
      throw new Error(
        `Refusing to upload scores: bucket "${BUCKET}" is marked public in Supabase.`,
      );
    }
    return;
  }

  if (res.status !== 404 && res.status !== 400) {
    throw new Error(`Check bucket failed: ${res.status} ${await res.text()}`);
  }

  const createRes = await fetch(`${config.url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: false,
    }),
  });

  if (!createRes.ok) {
    throw new Error(
      `Create private bucket failed: ${createRes.status} ${await createRes.text()}`,
    );
  }
  console.log(`Created private Storage bucket "${BUCKET}".`);
}

async function uploadJson(
  config: StorageConfig,
  key: string,
  payload: string | Buffer,
): Promise<number> {
  const body = typeof payload === "string" ? Buffer.from(payload, "utf8") : payload;
  const res = await fetch(`${config.url}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.serviceKey}`,
      apikey: config.serviceKey,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "60",
      "x-upsert": "true",
    },
    body: new Uint8Array(body),
  });
  if (!res.ok) {
    throw new Error(`Upload ${key} failed: ${res.status} ${await res.text()}`);
  }
  return body.byteLength;
}

async function main() {
  const config = storageConfig(ROOT);
  if (!config) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
    process.exit(1);
  }

  if (!fs.existsSync(SCORES_DATA_DIR)) {
    console.error(`Missing ${SCORES_DATA_DIR} — import score sheets first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SCORES_DATA_DIR).sort();
  const sheetFiles = files.filter((f) => /^\d{8}\.json$/.test(f));
  if (sheetFiles.length === 0) {
    console.error(`No <courseCode>.json files found in ${SCORES_DATA_DIR}`);
    process.exit(1);
  }

  await ensurePrivateBucket(config);

  const manifestEntries: ScoreManifestEntry[] = [];
  for (const file of sheetFiles) {
    const raw = fs.readFileSync(path.join(SCORES_DATA_DIR, file));
    const parsed = JSON.parse(raw.toString("utf8")) as ScoreSheet;
    const bytes = await uploadJson(config, file, raw);
    manifestEntries.push({
      file,
      courseCode: parsed.courseCode,
      title: parsed.title,
      aliases: parsed.aliases ?? [],
      hub: Boolean(parsed.hub),
      importedAt: parsed.importedAt,
    });
    console.log(
      `Uploaded ${file} (${parsed.title}, ${bytes.toLocaleString()} bytes) -> ${BUCKET}/${file}`,
    );
  }

  const hasNames = files.includes("student-names.json");
  if (hasNames) {
    const namesRaw = fs.readFileSync(
      path.join(SCORES_DATA_DIR, "student-names.json"),
    );
    const bytes = await uploadJson(config, "student-names.json", namesRaw);
    console.log(
      `Uploaded student-names.json (${bytes.toLocaleString()} bytes) -> ${BUCKET}/student-names.json`,
    );
  }

  const manifest: ScoreManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    hasNames,
    sheets: manifestEntries,
  };
  const manifestBytes = await uploadJson(
    config,
    "manifest.json",
    JSON.stringify(manifest, null, 2),
  );
  console.log(
    `Uploaded manifest.json (${manifestBytes.toLocaleString()} bytes) -> ${BUCKET}/manifest.json`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});

