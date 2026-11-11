import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { downloadPrivateJson } from "@/lib/storage/signed-url";
import type {
  ScoreManifest,
  ScoreManifestEntry,
  ScoreSheet,
} from "./sheet-types";

const LOCAL_DATA_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "local",
  "scores",
  "data",
);
const REMOTE_CACHE_TTL_MS = 60_000;

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const remoteCache = new Map<string, CacheEntry<unknown>>();
const remoteInflight = new Map<string, Promise<unknown>>();

async function cachedRemoteJson<T>(key: string): Promise<T | null> {
  const now = Date.now();
  const cached = remoteCache.get(key) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  let pending = remoteInflight.get(key) as Promise<T | null> | undefined;
  if (!pending) {
    pending = downloadPrivateJson<T>("scores", key)
      .then((value) => {
        if (value !== null) {
          remoteCache.set(key, {
            expiresAt: Date.now() + REMOTE_CACHE_TTL_MS,
            value,
          });
        }
        return value;
      })
      .finally(() => {
        remoteInflight.delete(key);
      });
    remoteInflight.set(key, pending);
  }

  return pending;
}

async function listLocalSheetFiles(): Promise<string[] | null> {
  try {
    const entries = await readdir(LOCAL_DATA_DIR);
    const jsonFiles = entries.filter((f) => /^\d{8}\.json$/.test(f)).sort();
    return jsonFiles.length > 0 ? jsonFiles : null;
  } catch {
    return null;
  }
}

async function readLocalJson<T>(fileName: string): Promise<T | null> {
  try {
    const raw = await readFile(path.join(LOCAL_DATA_DIR, fileName), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readLocalSheets(): Promise<ScoreSheet[]> {
  const files = await listLocalSheetFiles();
  if (!files) return [];
  const sheets = await Promise.all(
    files.map((f) => readLocalJson<ScoreSheet>(f)),
  );
  return sheets.filter((s): s is ScoreSheet => Boolean(s));
}

function matchEntry(
  entry: Pick<ScoreManifestEntry, "courseCode" | "title" | "aliases">,
  needle: string,
): boolean {
  return (
    entry.courseCode.toLowerCase() === needle ||
    entry.title.toLowerCase() === needle ||
    entry.aliases.some((alias) => alias.toLowerCase() === needle)
  );
}

/**
 * Lightweight course catalog (no student IDs, names, or scores) so
 * unauthenticated requests can determine 401 vs 404 without downloading sheets.
 */
export async function readScoreManifest(): Promise<ScoreManifest | null> {
  const localFiles = await listLocalSheetFiles();
  if (localFiles) {
    const sheets = await readLocalSheets();
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      hasNames: true,
      sheets: sheets.map((s) => ({
        file: `${s.courseCode}.json`,
        courseCode: s.courseCode,
        title: s.title,
        aliases: s.aliases,
        hub: Boolean(s.hub),
        importedAt: s.importedAt,
      })),
    };
  }

  return cachedRemoteJson<ScoreManifest>("manifest.json");
}

export async function listHubScoreCatalog(): Promise<ScoreManifestEntry[]> {
  const manifest = await readScoreManifest();
  if (!manifest) return [];
  return manifest.sheets
    .filter((entry) => entry.hub)
    .sort((a, b) => a.courseCode.localeCompare(b.courseCode));
}

export async function findHubManifestEntry(
  courseCode: string,
): Promise<ScoreManifestEntry | null> {
  const needle = courseCode.trim().toLowerCase();
  const catalog = await listHubScoreCatalog();
  return catalog.find((entry) => matchEntry(entry, needle)) ?? null;
}

/**
 * Loads all `hub: true` course score sheets. Must only be called after
 * verifying an authenticated @kmitl.ac.th student session.
 */
export async function listHubScoreSheets(): Promise<ScoreSheet[]> {
  const localFiles = await listLocalSheetFiles();
  if (localFiles) {
    const sheets = await readLocalSheets();
    return sheets
      .filter((s) => Boolean(s.hub))
      .sort((a, b) => a.courseCode.localeCompare(b.courseCode));
  }

  const catalog = await listHubScoreCatalog();
  if (catalog.length === 0) return [];
  const loaded = await Promise.all(
    catalog.map((entry) => cachedRemoteJson<ScoreSheet>(entry.file)),
  );
  return loaded
    .filter((s): s is ScoreSheet => Boolean(s && s.hub))
    .sort((a, b) => a.courseCode.localeCompare(b.courseCode));
}

/**
 * Loads a single `hub: true` course score sheet by course code, title, or alias.
 * Must only be called after verifying an authenticated @kmitl.ac.th session.
 */
export async function findHubScoreSheet(
  courseCode: string,
): Promise<ScoreSheet | null> {
  const entry = await findHubManifestEntry(courseCode);
  if (!entry) return null;

  const localFiles = await listLocalSheetFiles();
  if (localFiles) {
    const sheets = await readLocalSheets();
    const needle = courseCode.trim().toLowerCase();
    return sheets.find((s) => s.hub && matchEntry(s, needle)) ?? null;
  }

  const sheet = await cachedRemoteJson<ScoreSheet>(entry.file);
  return sheet && sheet.hub ? sheet : null;
}

/**
 * Loads `student-names.json` fallback map (id -> full name). Must only be
 * called after verifying an authenticated @kmitl.ac.th session.
 */
export async function readStudentNamesRegistry(): Promise<
  Record<string, string>
> {
  const localFiles = await listLocalSheetFiles();
  if (localFiles) {
    const localNames =
      await readLocalJson<Record<string, string>>("student-names.json");
    return localNames && typeof localNames === "object" ? localNames : {};
  }

  const remoteNames =
    await cachedRemoteJson<Record<string, string>>("student-names.json");
  return remoteNames && typeof remoteNames === "object" ? remoteNames : {};
}
