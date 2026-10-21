/**
 * Which Markdown tables list library files, and which card each row names.
 *
 * A week page or an overview lists its handouts in a table:
 *
 *     | เอกสาร | ไฟล์ในคลัง | หน้า |
 *     | --- | --- | --- |
 *     | สไลด์ | `itf-lec-week13.pdf` | 12 |
 *
 * The reader (components/md-view.tsx) swaps such a table for file cards, each
 * matched to a library card by `fileName`. The resource index and the audit
 * (scripts/library-shared.ts) read the same tables to record which cards a doc
 * names and which names match nothing — a page that lists a file no card
 * carries is an audit error. Both must apply the same rules or the audit would
 * judge a different page than the one readers get, so the rules live here,
 * once, over plain strings. Each caller keeps only the step that turns its own
 * table into a TextTable.
 *
 * Pure: no imports, no React, loadable from a tsx script.
 */

/** Anything with a file name to match on; a library card (SubjectAsset) is one. */
export interface NamedFile {
  fileName: string;
}

/**
 * One row of a doc table. Structurally the reader's SessionDocumentItem
 * (components/session-materials.tsx), so MdView hands rows to the file deck
 * as they are.
 */
export interface DocTableRow<A extends NamedFile = NamedFile> {
  title: string;
  /** The pages cell as written ("12", "12-14"); undefined when the table has no pages column. */
  pages?: string;
  /** The file cell with its quotes and backticks stripped. */
  fileName: string;
  /** The first library card whose file name matches, if any. */
  matchedAsset?: A;
}

/** A table reduced to the text of its cells, exactly as written. */
export interface TextTable {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}

// Header keywords, Thai and English, matched as lowercase substrings. A header
// is "the title column" or "the file column" if it contains one of these.
const STATUS_WORDS = ["สถานะ", "status", "ผลกระทบ"];
// "ไฟล์ในคลัง" is the usual header; any header naming the library counts.
const LIBRARY_WORDS = ["คลัง"];
const TITLE_WORDS = ["เอกสาร", "document", "title", "ชื่อ"];
const FILE_WORDS = ["ไฟล์", "file"];
const PAGES_WORDS = ["หน้า", "page"];

/** What a file cell looks like when no header says which column holds files. */
const FILE_NAME_SHAPE = /\.(pdf|png|jpg|docx|pptx)$/i;

function hasAny(header: string, words: readonly string[]): boolean {
  return words.some((word) => header.includes(word));
}

/** Authors quote or backtick file names; the card's own fileName has neither. */
function unquote(text: string): string {
  return text.replace(/[`'"]/g, "");
}

/**
 * The first card whose file name matches the one a doc wrote, ignoring case: the
 * name exactly, the name with `.pdf` added (the doc left the extension off), or
 * the same name with a different extension.
 */
export function matchAsset<A extends NamedFile>(
  fileName: string,
  assets: readonly A[] | undefined,
): A | undefined {
  const wanted = fileName.toLowerCase();
  const wantedBase = wanted.replace(/\.[^/.]+$/, "");
  return assets?.find((asset) => {
    const have = asset.fileName.toLowerCase();
    return have === wanted || have === `${wanted}.pdf` || have.replace(/\.[^/.]+$/, "") === wantedBase;
  });
}

/**
 * The file rows of a doc table, or null when the table is not one.
 *
 * Decided from the header row alone, before any body cell is read:
 *   - a status word anywhere (สถานะ, status, ผลกระทบ) makes it a status table,
 *     never a doc table, even if its rows mention files;
 *   - otherwise it is a doc table when a header names the library (คลัง), or
 *     when one header names the title (เอกสาร, document, title, ชื่อ) and
 *     another the file (ไฟล์, file).
 *
 * The file column is the first header that says file. A table that names the
 * library but never says "file" falls back to the first cell of its first row
 * that ends in a file extension. The title column defaults to the first column
 * that is not the file column; the pages column exists only if a header says
 * หน้า or page. Rows with no file cell, or an empty one, are skipped.
 */
export function readDocTable<A extends NamedFile>(
  table: TextTable,
  assets?: readonly A[],
): DocTableRow<A>[] | null {
  const headers = table.headers.map((header) => header.trim().toLowerCase());

  if (headers.some((header) => hasAny(header, STATUS_WORDS))) return null;

  const isDocTable =
    headers.some((header) => hasAny(header, LIBRARY_WORDS)) ||
    (headers.some((header) => hasAny(header, TITLE_WORDS)) &&
      headers.some((header) => hasAny(header, FILE_WORDS)));
  if (!isDocTable) return null;

  let fileCol = headers.findIndex((header) => hasAny(header, FILE_WORDS));
  let titleCol = headers.findIndex((header) => hasAny(header, TITLE_WORDS));
  const pagesCol = headers.findIndex((header) => hasAny(header, PAGES_WORDS));

  const { rows } = table;
  if (rows.length === 0) return null;

  if (fileCol === -1) {
    fileCol = rows[0].findIndex((text) => FILE_NAME_SHAPE.test(unquote(text).trim()));
  }
  if (fileCol === -1) return null;
  if (titleCol === -1) titleCol = fileCol === 0 ? 1 : 0;

  // A missing cell is told apart from an empty one by position, not by
  // truthiness: an empty title cell gives the card an empty title, and an empty
  // pages cell gives "", while a row too short to have the cell at all falls
  // back to the file name / no pages.
  const items: DocTableRow<A>[] = [];
  for (const cells of rows) {
    if (fileCol >= cells.length) continue;

    const fileName = unquote(cells[fileCol]).trim();
    if (!fileName) continue;

    items.push({
      title: titleCol < cells.length ? cells[titleCol].trim() : fileName,
      pages: pagesCol >= 0 && pagesCol < cells.length ? cells[pagesCol].trim() : undefined,
      fileName,
      matchedAsset: matchAsset(fileName, assets),
    });
  }

  return items.length > 0 ? items : null;
}

// ── From a parsed tree ──────────────────────────────────────────────────────
// react-markdown hands a `table` component its hast node. Reading that tree is
// the same job for the reader and for the index builder, so it lives here too.

/** The few fields of a hast node the table walk reads. */
export interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
}

function hastText(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map((child) => hastText(child)).join("");
}

function childElements(parent: HastNode | undefined, tagName: string): HastNode[] {
  return (parent?.children ?? []).filter((c) => c.type === "element" && c.tagName === tagName);
}

/**
 * The text of a hast `table` element, or null when it has no thead, tbody or
 * header row — the shape remark-gfm gives every Markdown table, so null means
 * the node is not one.
 */
export function textTableFromHast(node: HastNode | undefined): TextTable | null {
  if (!node || node.tagName !== "table") return null;

  const thead = childElements(node, "thead")[0];
  const tbody = childElements(node, "tbody")[0];
  if (!thead || !tbody) return null;

  const headerRow = childElements(thead, "tr")[0];
  if (!headerRow) return null;

  return {
    headers: childElements(headerRow, "th").map((cell) => hastText(cell)),
    rows: childElements(tbody, "tr").map((row) =>
      childElements(row, "td").map((cell) => hastText(cell)),
    ),
  };
}
