// Reverse of lib/markdown.ts: turn a committed submission.md / ai_reflection.md
// back into a wizard draft so it can be edited in the single-page step-by-step
// form. Deterministic because the generator fills ```text blocks in a fixed
// order (SUBMISSION_BLOCK_FIELDS / REFLECTION_BLOCK_FIELDS) plus known table
// rows. Returns null when the file does not match the template (block count
// mismatch) → the editor falls back to Raw with a notice.

import {
  SUBMISSION_BLOCK_FIELDS,
  SUBMISSION_CERT_STATEMENTS,
  REFLECTION_BLOCK_FIELDS,
  REFLECTION_INFO_ROWS,
  REFLECTION_POLICY_STATEMENTS,
  REFLECTION_CERT_STATEMENTS,
} from "./statements";
import {
  emptySubmissionDraft,
  emptyReflectionDraft,
  type SubmissionDraft,
  type ReflectionDraft,
  type FileLocale,
} from "./wizard-fields";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Extract every ```text block body in document order.
function extractTextBlocks(md: string): string[] {
  return [...md.matchAll(/```text\n([\s\S]*?)\n```/g)].map((m) => m[1]);
}

// Map the non-null field names onto the extracted blocks (same order the
// generator used). Returns null on a count mismatch.
function blockValues(md: string, fieldNames: (string | null)[]): Record<string, string> | null {
  const blocks = extractTextBlocks(md);
  if (blocks.length !== fieldNames.length) return null;
  const values: Record<string, string> = {};
  fieldNames.forEach((name, i) => {
    if (name !== null) values[name] = blocks[i];
  });
  return values;
}

// Read the value cell of a 2-column table row "| label | value |".
function twoColValue(md: string, label: string): string {
  const re = new RegExp(
    "^\\|\\s*" + escapeRegExp(label) + "\\s*\\|\\s*([^|\\n]*?)\\s*\\|\\s*$",
    "m",
  );
  const m = md.match(re);
  return m ? m[1] : "";
}

// Read both cells of a 3-column table row "| label | answer | note |".
function threeColValue(md: string, label: string): { answer: string; note: string } {
  const re = new RegExp(
    "^\\|\\s*" + escapeRegExp(label) + "\\s*\\|\\s*([^|\\n]*?)\\s*\\|\\s*([^|\\n]*?)\\s*\\|\\s*$",
    "m",
  );
  const m = md.match(re);
  return { answer: m ? m[1] : "", note: m ? m[2] : "" };
}

// The generated file keeps English structural headings for the en template and
// Thai ones for th. User answers live in ```text blocks / table cells, never in
// `#` headings, so a Thai character in a heading line is a reliable signal.
function detectLocale(md: string): FileLocale {
  return /^#.*[฀-๿]/m.test(md) ? "th" : "en";
}

export function parseSubmissionMd(md: string): SubmissionDraft | null {
  const v = blockValues(md, SUBMISSION_BLOCK_FIELDS);
  if (!v) return null;

  const draft = emptySubmissionDraft("");
  draft.file_locale = detectLocale(md);
  draft.oj_title = v.oj_title ?? "";
  draft.submission_id = v.submission_id ?? "";
  draft.oj_status = v.oj_status || "Pass";
  draft.time_spent = v.time_spent || draft.time_spent;
  draft.understanding = v.understanding ?? "";
  draft.first_plan = v.first_plan ?? "";
  draft.final_approach = v.final_approach ?? "";
  draft.used_ai = v.used_ai || "No";
  draft.human_help = v.human_help || "No";
  draft.who_helped = v.who_helped ?? "";
  draft.what_help = v.what_help ?? "";
  draft.still_own_work = v.still_own_work ?? "";
  draft.copied_code = v.copied_code || "No";
  draft.tests = [1, 2, 3].map((n) => ({
    why: v[`t${n}_why`] ?? "",
    input: v[`t${n}_input`] ?? "",
    expected: v[`t${n}_expected`] ?? "",
    actual: v[`t${n}_actual`] ?? "",
    result: v[`t${n}_result`] || "Pass",
  }));
  draft.certs = SUBMISSION_CERT_STATEMENTS.map(
    (s) => twoColValue(md, s).trim() === "Yes",
  );
  return draft;
}

export function parseReflectionMd(md: string): ReflectionDraft | null {
  const v = blockValues(md, REFLECTION_BLOCK_FIELDS);
  if (!v) return null;

  const draft = emptyReflectionDraft("");
  draft.file_locale = detectLocale(md);
  draft.oj_title = twoColValue(md, REFLECTION_INFO_ROWS[0]);
  draft.submission_id = twoColValue(md, REFLECTION_INFO_ROWS[1]);
  draft.oj_status = twoColValue(md, REFLECTION_INFO_ROWS[2]) || "Pass";

  // Split the composed AI-tool block back into picked tools + "Other" text.
  const toolLines = (v.ai_tool ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  draft.ai_tools = toolLines.filter((l) => !l.startsWith("Other:"));
  const other = toolLines.find((l) => l.startsWith("Other:"));
  draft.ai_tool_other = other ? other.replace(/^Other:\s*/, "") : "";
  draft.ai_tool = "";

  draft.policy_no_explain = v.policy_no_explain ?? "";
  draft.what_asked = v.what_asked ?? "";
  draft.what_noticed = v.what_noticed ?? "";
  draft.what_checked = v.what_checked ?? "";
  draft.what_learned = v.what_learned ?? "";

  draft.policy_answers = REFLECTION_POLICY_STATEMENTS.map((s) => {
    const a = threeColValue(md, s).answer.trim();
    return a || "Yes";
  });
  draft.policy_notes = REFLECTION_POLICY_STATEMENTS.map(
    (s) => threeColValue(md, s).note.trim(),
  );
  draft.certs = REFLECTION_CERT_STATEMENTS.map(
    (s) => twoColValue(md, s).trim() === "Yes",
  );
  return draft;
}
