/**
 * Pins the working directory to the repo root before anything from lib/ loads.
 *
 * lib/paths.ts takes its ROOT from `process.cwd()` the moment it is imported,
 * and every Markdown loader (lib/courses/course-content.ts, it-kmitl.ts,
 * en-kmitl.ts) hangs off that. Started from any other directory they would all
 * report "no such file", and the index would come out with every doc unbound —
 * quietly wrong rather than loudly broken.
 *
 * Imports run in source order, so the library scripts import this first.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.cwd() !== ROOT) process.chdir(ROOT);
