import { z } from "zod";

// Shared "must actually be filled in" rule for free-text fields.
const req = z.string().trim().min(1).max(8000);
const filled = (v: string) => req.safeParse(v).success;

// ---- Submission wizard ----

interface SubmissionValidationDraft {
  oj_title: string;
  understanding: string;
  first_plan: string;
  final_approach: string;
  tests: { why: string; input: string; expected: string; actual: string }[];
  human_help: string;
  who_helped: string;
  what_help: string;
  still_own_work: string;
  certs: boolean[];
}

const submissionStepChecks: Partial<
  Record<string, (d: SubmissionValidationDraft) => boolean>
> = {
  info: (d) => filled(d.oj_title),
  understanding: (d) => filled(d.understanding),
  first_plan: (d) => filled(d.first_plan),
  final_approach: (d) => filled(d.final_approach),
  tests: (d) =>
    d.tests.length > 0 &&
    d.tests.every(
      (tc) => filled(tc.why) && filled(tc.input) && filled(tc.expected) && filled(tc.actual),
    ),
  human_help: (d) =>
    d.human_help !== "Yes" ||
    (filled(d.who_helped) && filled(d.what_help) && filled(d.still_own_work)),
  declaration: (d) => d.certs.length > 0 && d.certs.every(Boolean),
};

// Returns the index of the first step (below targetIndex) that fails
// validation, or null if everything up to targetIndex checks out.
export function validateSubmissionUpTo(
  draft: SubmissionValidationDraft,
  stepKeys: readonly string[],
  targetIndex: number,
): number | null {
  for (let i = 0; i < targetIndex && i < stepKeys.length; i++) {
    const check = submissionStepChecks[stepKeys[i]];
    if (check && !check(draft)) return i;
  }
  return null;
}

// ---- Reflection wizard ----

interface ReflectionValidationDraft {
  oj_title: string;
  ai_tool: string;
  ai_tools: string[];
  ai_tool_other: string;
  policy_answers: string[];
  policy_no_explain: string;
  what_asked: string;
  what_noticed: string;
  what_checked: string;
  what_learned: string;
  certs: boolean[];
}

function hasAiTool(d: ReflectionValidationDraft): boolean {
  return d.ai_tools.length > 0 || filled(d.ai_tool_other) || filled(d.ai_tool);
}

const reflectionStepChecks: Partial<
  Record<string, (d: ReflectionValidationDraft) => boolean>
> = {
  info: (d) => filled(d.oj_title),
  tool: (d) => hasAiTool(d),
  policy: (d) => !d.policy_answers.includes("No") || filled(d.policy_no_explain),
  asked: (d) => filled(d.what_asked),
  noticed: (d) => filled(d.what_noticed),
  checked: (d) => filled(d.what_checked),
  learned: (d) => filled(d.what_learned),
  declaration: (d) => d.certs.length > 0 && d.certs.every(Boolean),
};

export function validateReflectionUpTo(
  draft: ReflectionValidationDraft,
  stepKeys: readonly string[],
  targetIndex: number,
): number | null {
  for (let i = 0; i < targetIndex && i < stepKeys.length; i++) {
    const check = reflectionStepChecks[stepKeys[i]];
    if (check && !check(draft)) return i;
  }
  return null;
}
