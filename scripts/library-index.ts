#!/usr/bin/env tsx
/**
 * Builds lib/library/resource-index.json — the one file that answers "what does
 * the library hold, where does it live and what renders it?" for every course.
 * Run with `bun run library:index` (or `bun run library:build`, which refreshes
 * the manifest and stats first).
 *
 * The index is a snapshot of TypeScript sources and Markdown, so it goes stale
 * the moment any of them changes: rebuild after editing a card, a binding, a
 * schedule or a doc. `bun run library:audit` says when it is out of date.
 *
 * The output is deterministic — no timestamps, no disk metadata — so running
 * this twice gives identical bytes, and a diff of the file is a diff of the
 * library.
 */
import fs from "node:fs";

import { INDEX_FILE, INDEX_RELATIVE, buildResourceIndex, serializeIndex } from "./library-shared";

// Wrapped rather than left at top level: tsx transforms this file to CJS,
// where a top-level await throws ERR_REQUIRE_ASYNC_MODULE.
async function main() {
  const { index, extras } = await buildResourceIndex();

  const text = serializeIndex(index);
  fs.writeFileSync(INDEX_FILE, text);

  for (const warning of extras.warnings) console.warn(`warning: ${warning}`);

  const { totals } = index;
  console.log(
    `wrote ${INDEX_RELATIVE} — ${totals.courses} courses, ` +
      `${totals.docs} docs (${totals.renderedDocs} rendered), ` +
      `${totals.assets} assets (${totals.curated} curated, ${totals.generated} generated, ` +
      `${totals.insider} insider), ${(Buffer.byteLength(text) / 1024).toFixed(0)} KB`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
