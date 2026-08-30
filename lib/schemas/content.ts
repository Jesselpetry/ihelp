import { z } from "zod";

/**
 * Machine-checkable form of the content contract.
 *
 * The rules here are not new. Most of them were already written down — as a
 * five-clause verification procedure in the header comment of
 * lib/quiz-content.ts, and as prose in docs/DROPZONE_SOP.md — and they were
 * followed carefully by whoever read them. A comment cannot fail a build, so
 * banks written later drifted: one third of the question bank now ships a
 * placeholder where its per-option explanation should be.
 *
 * Turning the prose into checks has to happen BEFORE the banks are touched,
 * not after. The discipline currently lives in those comments; a refactor that
 * moves the data without moving the rule first would lose the rule silently.
 */

/** Bilingual text. `en` may be absent — Thai is the fallback, by design. */
export const lTextSchema = z.object({
  th: z.string().min(1),
  en: z.string().optional(),
});

export const quizKindSchema = z.enum([
  "mcq",
  "predict-output",
  "spot-the-bug",
  "pep8",
  "true-false",
  "short-answer",
]);

export const quizOptionSchema = z.object({
  id: z.string().min(1),
  label: lTextSchema,
  why: lTextSchema,
});

export const quizQuestionSchema = z.object({
  id: z.string().min(1),
  kind: quizKindSchema,
  prompt: lTextSchema,
  snippet: z.string().optional(),
  stdin: z.string().optional(),
  options: z.array(quizOptionSchema),
  correctId: z.string(),
  // Required, and the single most load-bearing field in the schema: every
  // question must name the line of source material it came from.
  sourceRef: z.string().min(1),
  chapter: z.number().int().positive().optional(),
  explanationMd: z.string().optional(),
});

export type QuizQuestionShape = z.infer<typeof quizQuestionSchema>;

/** How many options each kind is allowed to carry. */
export const OPTION_COUNTS: Record<string, number[]> = {
  // Four is the norm; CHEM's bank is a five-choice paper (ก–จ), so five is legal.
  mcq: [4, 5],
  "predict-output": [4, 5],
  "spot-the-bug": [4, 5],
  pep8: [4, 5],
  "true-false": [2],
  // Open essays with a model answer — self-assessed, so there is nothing to pick.
  "short-answer": [0],
};

/**
 * Explanations that explain nothing.
 *
 * Each of these is a real string currently repeated across a whole bank. The
 * schema's central promise is that a wrong pick teaches the misconception that
 * produced it; a distractor carrying one of these teaches nothing, and there
 * are 63 of the first one alone.
 */
export const PLACEHOLDER_WHY = [
  "ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง",
  "ตัวเลือกนี้ไม่ถูก",
  "ไม่ถูกต้อง",
  "ผิด",
  "wrong",
  "incorrect",
];

export type Severity = "error" | "warn";

export interface Finding {
  severity: Severity;
  rule: string;
  where: string;
  message: string;
}

const THAI = /[฀-๿]/;

/**
 * Whether an LText claims to be bilingual while carrying the same Thai on both
 * keys.
 *
 * `LText` makes `en` optional precisely so Thai-only content can say so. Sixty
 * items in the COMPRO mock paper instead copy the Thai string onto `en`, which
 * reports coverage that does not exist — the locale toggle appears to work and
 * changes nothing. Omitting `en` is the honest form.
 */
export function isFakeBilingual(text: { th: string; en?: string }): boolean {
  return text.en !== undefined && text.en === text.th && THAI.test(text.th);
}

/**
 * Checks one question bank against the contract.
 *
 * `requireChapter` is set for banks bound to a module that offers chapter-scoped
 * practice: without a chapter on every question, a student cannot drill one
 * week, and the weak-spot room cannot say which chapter is weak.
 */
export function checkBank(
  bankName: string,
  questions: unknown[],
  opts: { requireChapter?: boolean } = {},
): Finding[] {
  const findings: Finding[] = [];
  const seenIds = new Set<string>();

  questions.forEach((raw, i) => {
    const where = `${bankName}[${i}]`;
    const parsed = quizQuestionSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        findings.push({
          severity: "error",
          rule: "schema",
          where: `${where}.${issue.path.join(".")}`,
          message: issue.message,
        });
      }
      return;
    }

    const q = parsed.data;
    const at = `${bankName}/${q.id}`;

    if (seenIds.has(q.id)) {
      findings.push({
        severity: "error",
        rule: "duplicate-id",
        where: at,
        message: "question id already used in this bank",
      });
    }
    seenIds.add(q.id);

    const allowed = OPTION_COUNTS[q.kind];
    if (allowed && !allowed.includes(q.options.length)) {
      findings.push({
        severity: "error",
        rule: "option-count",
        where: at,
        message: `${q.kind} takes ${allowed.join(" or ")} options, found ${q.options.length}`,
      });
    }

    if (q.kind !== "short-answer") {
      const ids = q.options.map((o) => o.id);
      if (!ids.includes(q.correctId)) {
        findings.push({
          severity: "error",
          rule: "correct-id",
          where: at,
          message: `correctId "${q.correctId}" is not one of ${ids.join(", ")}`,
        });
      }
      if (new Set(ids).size !== ids.length) {
        findings.push({
          severity: "error",
          rule: "option-id",
          where: at,
          message: "option ids are not unique — shuffling would break grading",
        });
      }
    }

    if (opts.requireChapter && q.chapter === undefined) {
      findings.push({
        severity: "warn",
        rule: "chapter",
        where: at,
        message: "no chapter — cannot be drilled by chapter or reported as a weak spot",
      });
    }

    // A question that carries its teaching in one prose block is exempt: the
    // engine renders explanationMd instead of the per-option notes.
    if (!q.explanationMd && q.options.length > 1) {
      const whys = q.options.map((o) => o.why.th.trim());
      if (new Set(whys).size !== whys.length) {
        findings.push({
          severity: "warn",
          rule: "why-duplicate",
          where: at,
          message: "two options share the same explanation — one of them teaches nothing",
        });
      }
      for (const option of q.options) {
        const why = option.why.th.trim().toLowerCase();
        if (PLACEHOLDER_WHY.some((p) => why === p.toLowerCase())) {
          findings.push({
            severity: "warn",
            rule: "why-placeholder",
            where: `${at}/${option.id}`,
            message: "placeholder explanation — a wrong pick should teach the misconception",
          });
        }
      }
    }

    for (const [field, text] of [
      ["prompt", q.prompt] as const,
      ...q.options.map((o) => [`option.${o.id}.label`, o.label] as const),
    ]) {
      if (isFakeBilingual(text)) {
        findings.push({
          severity: "warn",
          rule: "fake-bilingual",
          where: `${at}.${field}`,
          message: "en duplicates the Thai — omit en instead of claiming a translation",
        });
      }
    }
  });

  return findings;
}
