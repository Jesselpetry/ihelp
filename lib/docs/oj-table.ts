/**
 * Detection and parsing of weekly iJudge problem tables in Markdown.
 *
 * In the PSCP weekly guides (archive/week01.md to week14.md), weekly problems
 * are written as a table under "## โจทย์ iJudge ประจำสัปดาห์":
 *
 *     | รหัสข้อ | ชื่อโจทย์ | ระดับ | ป้ายกำกับ | แนวคิดและจุดสังเกตสำคัญ (Conceptual Takeaways) |
 *     |:---:|---|:---:|:---:|---|
 *     | [`oj2981`](/pscp/oj2981) | สวัสดี: ชื่อ | 0 | - | รับสตริง 1 บรรทัดด้วย `input()` ... |
 *
 * The reader (components/md-view.tsx) intercepts this table and renders it
 * as an interactive, embedded OjProblemsDeck matching the visual craftsmanship
 * of SessionMaterialsDeck ("slide embed"), but redirecting directly into the
 * iHelp in-browser workspace (/pscp/ojXXXX).
 *
 * Pure: no React, loadable from scripts or RSC.
 */
import type { HastNode } from "./doc-table";

export interface OjProblemItem {
  id?: number;
  code: string;
  slug: string;
  name: string;
  difficulty?: number;
  tags?: string;
  isLearningLog: boolean;
  isRecommended?: boolean;
  takeaway: string;
  href: string;
}

const OJ_CODE_WORDS = ["รหัสข้อ", "รหัสโจทย์", "รหัส", "problem id", "oj"];
const OJ_NAME_WORDS = ["ชื่อโจทย์", "ชื่อ", "problem name", "title"];
const OJ_DIFF_WORDS = ["ระดับ", "ความยาก", "level", "difficulty"];
const OJ_TAG_WORDS = ["ป้ายกำกับ", "แท็ก", "learning log", "tag"];
const OJ_TAKEAWAY_WORDS = [
  "แนวคิด",
  "คำใบ้",
  "takeaway",
  "hint",
  "จุดเน้น",
  "หัวใจสำคัญ",
  "สังเกต",
];

function hasAny(header: string, words: readonly string[]): boolean {
  return words.some((word) => header.includes(word));
}

function hastText(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map((child) => hastText(child)).join("");
}

function childElements(parent: HastNode | undefined, tagName: string): HastNode[] {
  return (parent?.children ?? []).filter((c) => c.type === "element" && c.tagName === tagName);
}

function findFirstHref(node: HastNode | undefined): string | null {
  if (!node) return null;
  const props = (node as { properties?: Record<string, unknown> }).properties;
  if (node.type === "element" && node.tagName === "a" && props?.href) {
    return String(props.href);
  }
  if (node.children) {
    for (const child of node.children) {
      const href = findFirstHref(child);
      if (href) return href;
    }
  }
  return null;
}

export function isOjProblemTable(headers: readonly string[]): boolean {
  const norm = headers.map((h) => h.trim().toLowerCase());
  const hasCode = norm.some((h) => hasAny(h, OJ_CODE_WORDS));
  const hasNameOrConcept =
    norm.some((h) => hasAny(h, OJ_NAME_WORDS)) &&
    (norm.some((h) => hasAny(h, OJ_DIFF_WORDS)) ||
      norm.some((h) => hasAny(h, OJ_TAG_WORDS)) ||
      norm.some((h) => hasAny(h, OJ_TAKEAWAY_WORDS)));
  return hasCode && hasNameOrConcept;
}

/**
 * Extracts structured problem items from a Markdown table HAST node,
 * or returns null if the table is not an iJudge problem table.
 */
export function parseOjProblemTable(node: HastNode | undefined): OjProblemItem[] | null {
  if (!node || node.tagName !== "table") return null;

  const thead = childElements(node, "thead")[0];
  const tbody = childElements(node, "tbody")[0];
  if (!thead || !tbody) return null;

  const headerRow = childElements(thead, "tr")[0];
  if (!headerRow) return null;

  const headerCells = childElements(headerRow, "th");
  const headers = headerCells.map((cell) => hastText(cell).trim().toLowerCase());

  if (!isOjProblemTable(headers)) return null;

  let codeCol = headers.findIndex((h) => hasAny(h, OJ_CODE_WORDS));
  let nameCol = headers.findIndex((h) => hasAny(h, OJ_NAME_WORDS));
  let diffCol = headers.findIndex((h) => hasAny(h, OJ_DIFF_WORDS));
  let tagCol = headers.findIndex((h) => hasAny(h, OJ_TAG_WORDS));
  let takeawayCol = headers.findIndex((h) => hasAny(h, OJ_TAKEAWAY_WORDS));

  if (codeCol === -1) codeCol = 0;
  if (nameCol === -1) nameCol = 1;
  if (diffCol === -1 && headers.length > 2) diffCol = 2;
  if (tagCol === -1 && headers.length > 3) tagCol = 3;
  if (takeawayCol === -1 && headers.length > 4) takeawayCol = 4;

  const items: OjProblemItem[] = [];
  const bodyRows = childElements(tbody, "tr");

  for (const row of bodyRows) {
    const cells = childElements(row, "td");
    if (cells.length === 0) continue;

    const codeCell = cells[codeCol];
    const rawCode = hastText(codeCell).replace(/[`'"]/g, "").trim();
    if (!rawCode) continue;

    const hrefFromAst = findFirstHref(codeCell);
    const idMatch = rawCode.match(/\d+/);
    const id = idMatch ? Number.parseInt(idMatch[0], 10) : undefined;

    let slug = "";
    let href = "";

    if (hrefFromAst) {
      // e.g. /pscp/oj2981, /pscp/oj2999-frame, /recommended/oj2996-Swap_Characters
      const cleanHref = hrefFromAst.trim();
      const match = cleanHref.match(/(?:\/pscp\/|\/recommended\/|\/)([a-zA-Z0-9_\-]+)$/);
      if (match) {
        slug = match[1];
      } else {
        slug = cleanHref.replace(/^\//, "");
      }
      href = `/pscp/${slug}`;
    } else {
      slug = rawCode.toLowerCase().startsWith("oj")
        ? rawCode.toLowerCase()
        : id
          ? `oj${id}`
          : rawCode;
      href = `/pscp/${slug}`;
    }

    const name = nameCol >= 0 && nameCol < cells.length ? hastText(cells[nameCol]).trim() : rawCode;
    const diffText = diffCol >= 0 && diffCol < cells.length ? hastText(cells[diffCol]).trim() : "";
    const parsedDiff = Number.parseInt(diffText, 10);
    const difficulty = Number.isNaN(parsedDiff) ? undefined : parsedDiff;

    const tagText = tagCol >= 0 && tagCol < cells.length ? hastText(cells[tagCol]).trim() : "";
    const isLearningLog = /\[LL\]|LL|learning\s*log|⭐/i.test(tagText);
    const isRecommended =
      /\[Recommend\]|Recommend|แนะนำ/i.test(tagText) ||
      /\[Recommend\]|Recommend|แนะนำ/i.test(name) ||
      (id ? [3476, 3753, 3609, 3644, 3645, 3650, 3672, 3752, 2996, 2997, 2998, 3019, 3020, 3022, 3159, 3167, 3226, 3237].includes(id) : false);
    const cleanTag = tagText
      .replace(/⭐/g, "")
      .replace(/\[LL\]/gi, "")
      .replace(/\[Recommend\]/gi, "")
      .replace(/^[-–—]$/, "")
      .trim();

    const takeaway =
      takeawayCol >= 0 && takeawayCol < cells.length
        ? hastText(cells[takeawayCol]).trim()
        : "";

    items.push({
      id,
      code: rawCode,
      slug,
      name,
      difficulty,
      tags: cleanTag || undefined,
      isLearningLog,
      isRecommended,
      takeaway,
      href,
    });
  }

  return items.length > 0 ? items : null;
}

