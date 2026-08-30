#!/usr/bin/env node
/**
 * Builds lib/library-stats.json — byte size and (for PDFs) page count for every
 * file under public/assets/, keyed by the public URL the library cards use.
 *
 * The Subject Library gallery prints "12 pages · 3.4 MB" on each book cover, and
 * those numbers have to stay true when a PDF is replaced. Regenerate with:
 *
 *   node scripts/build-library-stats.mjs
 *
 * Page counting is done here rather than at request time because it means
 * inflating every content stream in a 200 MB asset tree.
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "public", "assets");
const OUT = path.join(ROOT, "lib", "library-stats.json");

const PAGE_TYPE = /\/Type\s*\/Page(?![sA-Za-z])/;

/** Every /Type /Page (but not /Pages) in a buffer of decoded PDF syntax. */
function countPageObjects(text) {
  return (text.match(new RegExp(PAGE_TYPE, "g")) ?? []).length;
}

/**
 * Page objects in a PDF's plain body, counted by distinct object number. An
 * incrementally-saved PDF appends a whole second copy of its page objects, so
 * counting matches would double every page in the file.
 */
function countPageObjectsByNumber(text) {
  const seen = new Set();
  const headers = [...text.matchAll(/(?:^|[\s>])(\d+)\s+\d+\s+obj\b/g)];
  for (let i = 0; i < headers.length; i++) {
    const start = headers[i].index + headers[i][0].length;
    const end = i + 1 < headers.length ? headers[i + 1].index : text.length;
    if (PAGE_TYPE.test(text.slice(start, end))) seen.add(headers[i][1]);
  }
  return seen.size;
}

/**
 * Page count for a PDF. Modern writers pack the page tree into compressed
 * object streams, so the raw bytes alone undercount; inflate every Flate
 * stream and scan those too. Falls back to the /Count on the page tree root.
 */
function pdfPageCount(buf) {
  const raw = buf.toString("latin1");
  const plain = countPageObjectsByNumber(raw);

  let compressed = 0;
  const streams = raw.matchAll(/stream\r?\n/g);
  for (const m of streams) {
    const start = m.index + m[0].length;
    const end = raw.indexOf("endstream", start);
    if (end < 0) continue;
    try {
      const inflated = zlib.inflateSync(buf.subarray(start, end));
      compressed += countPageObjects(inflated.toString("latin1"));
    } catch {
      // Not a Flate stream (image data, already-plain content) — skip it.
    }
  }

  // A hybrid-reference PDF stores its page objects twice — once in the plain
  // body for old readers and once in an object stream — so the two counts are
  // alternative views of the same tree, never halves of it. Take the larger.
  const pages = Math.max(plain, compressed);
  if (pages > 0) return pages;

  const counts = [...raw.matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  return counts.length ? Math.max(...counts) : 0;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name !== ".DS_Store") out.push(full);
  }
  return out;
}

const stats = {};
for (const file of walk(ASSETS).sort()) {
  const url = "/assets/" + path.relative(ASSETS, file).split(path.sep).join("/");
  const entry = { sizeBytes: fs.statSync(file).size };
  if (file.toLowerCase().endsWith(".pdf")) {
    const pages = pdfPageCount(fs.readFileSync(file));
    if (pages > 0) entry.pages = pages;
  }
  stats[url] = entry;
}

fs.writeFileSync(OUT, JSON.stringify(stats, null, 2) + "\n");
console.log(`wrote ${Object.keys(stats).length} entries to ${path.relative(ROOT, OUT)}`);
