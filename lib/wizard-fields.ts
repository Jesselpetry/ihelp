// Shared draft shapes + draft→fields assembly for the submission and reflection
// wizards. Extracted so the wizards AND the repo editor's single-page
// step-by-step form build the exact same `fields` payload for
// /api/generate/{submission,reflection} — which keeps reverse-parsing
// (lib/md-parse.ts) round-tripping against the same generator.

import {
  SUBMISSION_CERT_STATEMENTS,
  REFLECTION_CERT_STATEMENTS,
  REFLECTION_POLICY_STATEMENTS,
} from "./statements";

export type FileLocale = "th" | "en";

// ---------------- Submission ----------------

export interface TestCase {
  why: string;
  input: string;
  expected: string;
  actual: string;
  result: string;
}

export interface SubmissionDraft {
  file_locale: FileLocale;
  oj_title: string;
  submission_id: string;
  oj_status: string;
  time_spent: string;
  understanding: string;
  first_plan: string;
  final_approach: string;
  tests: TestCase[];
  used_ai: string;
  human_help: string;
  who_helped: string;
  what_help: string;
  still_own_work: string;
  copied_code: string;
  certs: boolean[];
}

export function emptySubmissionDraft(ojTitle: string): SubmissionDraft {
  return {
    file_locale: "th",
    oj_title: ojTitle,
    submission_id: "",
    oj_status: "Pass",
    time_spent: "15-30 minutes",
    understanding: "",
    first_plan: "",
    final_approach: "",
    tests: [0, 1, 2].map(() => ({ why: "", input: "", expected: "", actual: "", result: "Pass" })),
    used_ai: "No",
    human_help: "No",
    who_helped: "",
    what_help: "",
    still_own_work: "",
    copied_code: "No",
    certs: SUBMISSION_CERT_STATEMENTS.map(() => false),
  };
}

export function submissionFieldsFromDraft(draft: SubmissionDraft): Record<string, unknown> {
  const certifications: Record<string, boolean> = {};
  SUBMISSION_CERT_STATEMENTS.forEach((s, i) => (certifications[s] = draft.certs[i]));
  const askedHuman = draft.human_help === "Yes";
  const fields: Record<string, unknown> = {
    oj_title: draft.oj_title,
    submission_id: draft.submission_id,
    oj_status: draft.oj_status,
    time_spent: draft.time_spent,
    understanding: draft.understanding,
    first_plan: draft.first_plan,
    final_approach: draft.final_approach,
    used_ai: draft.used_ai,
    human_help: draft.human_help,
    // hidden fields stay out of the file when no human help was used
    who_helped: askedHuman ? draft.who_helped : "",
    what_help: askedHuman ? draft.what_help : "",
    still_own_work: askedHuman ? draft.still_own_work : "",
    copied_code: draft.copied_code,
    certifications,
  };
  draft.tests.forEach((tc, i) => {
    const n = i + 1;
    fields[`t${n}_why`] = tc.why;
    fields[`t${n}_input`] = tc.input;
    fields[`t${n}_expected`] = tc.expected;
    fields[`t${n}_actual`] = tc.actual;
    fields[`t${n}_result`] = tc.result;
  });
  return fields;
}

// ---------------- Reflection ----------------

export interface ReflectionDraft {
  file_locale: FileLocale;
  oj_title: string;
  submission_id: string;
  oj_status: string;
  ai_tool: string; // legacy free text (kept for old saved drafts)
  ai_tools: string[];
  ai_tool_other: string;
  policy_answers: string[];
  policy_notes: string[];
  policy_no_explain: string;
  what_asked: string;
  what_noticed: string;
  what_checked: string;
  what_learned: string;
  certs: boolean[];
}

export function emptyReflectionDraft(ojTitle: string): ReflectionDraft {
  return {
    file_locale: "th",
    oj_title: ojTitle,
    submission_id: "",
    oj_status: "Pass",
    ai_tool: "",
    ai_tools: [],
    ai_tool_other: "",
    policy_answers: REFLECTION_POLICY_STATEMENTS.map(() => "Yes"),
    policy_notes: REFLECTION_POLICY_STATEMENTS.map(() => ""),
    policy_no_explain: "",
    what_asked: "",
    what_noticed: "",
    what_checked: "",
    what_learned: "",
    certs: REFLECTION_CERT_STATEMENTS.map(() => false),
  };
}

export function composeAiTool(draft: ReflectionDraft): string {
  const tools = [...draft.ai_tools];
  const other = draft.ai_tool_other.trim();
  if (other) tools.push(`Other: ${other}`);
  // fall back to legacy free text from old saved drafts
  if (tools.length === 0) return draft.ai_tool;
  return tools.join("\n");
}

export function reflectionFieldsFromDraft(draft: ReflectionDraft): Record<string, unknown> {
  const policy: Record<string, { answer: string; note: string }> = {};
  REFLECTION_POLICY_STATEMENTS.forEach((s, i) => {
    policy[s] = { answer: draft.policy_answers[i], note: draft.policy_notes[i] };
  });
  const certifications: Record<string, boolean> = {};
  REFLECTION_CERT_STATEMENTS.forEach((s, i) => (certifications[s] = draft.certs[i]));
  return {
    info: {
      "OJ problem number/title": draft.oj_title,
      "OJ submission ID, if submitted": draft.submission_id,
      "OJ status": draft.oj_status,
    },
    ai_tool: composeAiTool(draft),
    policy,
    // only emitted when some policy answer is "No"
    policy_no_explain: draft.policy_answers.includes("No") ? draft.policy_no_explain : "",
    what_asked: draft.what_asked,
    what_noticed: draft.what_noticed,
    what_checked: draft.what_checked,
    what_learned: draft.what_learned,
    certifications,
  };
}
