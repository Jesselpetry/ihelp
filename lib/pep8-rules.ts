import type { LText } from "@/lib/i18n";
import type { Pep8Violation } from "@/lib/grader-types";

// ---------------------------------------------------------------------------
// (a) pycodestyle raw output -> bilingual Pep8Violation translation layer
// ---------------------------------------------------------------------------

export interface RawPep8Violation {
  line: number;
  col: number;
  code: string;
  message: string;
}

/**
 * Bilingual (Thai/English) explanations for the pycodestyle codes this
 * course actually surfaces in practice. Kept short and student-facing rather
 * than reproducing pycodestyle's terse internal wording verbatim.
 */
const PEP8_TRANSLATIONS: Record<string, LText> = {
  E302: {
    th: "ต้องเว้นบรรทัดว่าง 2 บรรทัดก่อนนิยามฟังก์ชัน/คลาสระดับบนสุด",
    en: "Expected 2 blank lines before a top-level function/class definition.",
  },
  E303: {
    th: "เว้นบรรทัดว่างมากเกินไป",
    en: "Too many blank lines in a row.",
  },
  E501: {
    th: "บรรทัดยาวเกินไป (เกิน 79 ตัวอักษร) ลองขึ้นบรรทัดใหม่หรือย่อชื่อตัวแปร",
    en: "Line too long (over 79 characters). Consider breaking it up.",
  },
  E225: {
    th: "ต้องมีช่องว่างรอบตัวดำเนินการ (เช่น =, +, <) เพื่อความอ่านง่าย",
    en: "Missing whitespace around an operator (e.g. =, +, <).",
  },
  E226: {
    th: "แนะนำให้มีช่องว่างรอบตัวดำเนินการทางคณิตศาสตร์ (เช่น *, /)",
    en: "Missing whitespace around an arithmetic operator (e.g. *, /).",
  },
  E231: {
    th: "ต้องมีช่องว่างหลังเครื่องหมายจุลภาค (,)",
    en: "Missing whitespace after a comma.",
  },
  W291: {
    th: "มีช่องว่างเกินความจำเป็นท้ายบรรทัด ลบออกได้เลย",
    en: "Trailing whitespace at the end of the line — safe to delete.",
  },
  W293: {
    th: "บรรทัดว่างที่มีช่องว่างแฝงอยู่ ควรลบให้สะอาด",
    en: "Blank line contains whitespace — clean it up.",
  },
  E711: {
    th: 'อย่าเทียบกับ None ด้วย == ให้ใช้ "is None" หรือ "is not None" แทน',
    en: 'Comparison to None should use "is None" / "is not None", not "==".',
  },
  E712: {
    th: 'อย่าเทียบกับ True/False ด้วย == ค่าบูลีนใช้ตรวจสอบตรง ๆ ได้เลย (เช่น "if cond:" แทน "if cond == True:")',
    en: 'Comparison to True/False should not use "==" — test the boolean directly (e.g. "if cond:" instead of "if cond == True:").',
  },
};

/**
 * Wraps pycodestyle's raw {line, col, code, message} output into the frozen
 * Pep8Violation shape from grader-types.ts, attaching a bilingual message.
 * Codes without a curated translation fall back to a generic bilingual
 * wrapper of pycodestyle's own message rather than throwing.
 */
export function translatePep8Violations(
  raw: RawPep8Violation[],
): Pep8Violation[] {
  return raw.map((v) => {
    const known = PEP8_TRANSLATIONS[v.code];
    const message: LText = known ?? {
      th: `[${v.code}] ${v.message}`,
      en: `[${v.code}] ${v.message}`,
    };
    return {
      line: v.line,
      col: v.col,
      code: v.code,
      message,
    };
  });
}

// ---------------------------------------------------------------------------
// (b) Custom exam-specific rules — lightweight regex/line-based checks for
// Pylint-style advice pycodestyle does not catch, but which this course's
// own problem.md files explicitly teach as PEP-8 scoring points.
// ---------------------------------------------------------------------------

/** Matches `X % Y == 0` (any spacing), e.g. `i % 15 == 0`. */
const MODULO_EQUALS_ZERO_RE = /\b[\w.]+\s*%\s*[\w.]+\s*==\s*0\b/;

/**
 * Matches `X == Y or X == Z` where X repeats on both sides of `or`
 * (the "combine into `in`" pattern), e.g. `i == 1 or i == n`.
 * Captures the repeated left-hand operand to confirm both comparisons are
 * against the same variable.
 */
const EQUALS_OR_EQUALS_RE =
  /\b([\w.]+)\s*==\s*[\w.'"]+\s+or\s+\1\s*==\s*[\w.'"]+/;

/** Matches `import X as Y` where the alias Y is 1-2 characters. */
const IMPORT_AS_SHORT_ALIAS_RE = /^\s*import\s+[\w.]+\s+as\s+(\w{1,2})\b/;

/**
 * Matches a plain (lowercase/mixed-case) module-level assignment that looks
 * like a constant: a simple `NAME = <literal>` at column 0 (no indentation),
 * where NAME is not already ALL_CAPS. Deliberately conservative — only flags
 * assignments to literal values (numbers/strings), since those are the
 * clearest "this should probably be a named constant" case, and skips names
 * that are already all-uppercase (already compliant) or that look like dunder
 * names (__all__, etc.) or single-letter loop-style names.
 */
const MODULE_LEVEL_LOWERCASE_LITERAL_RE =
  /^([a-z][a-z0-9_]{2,})\s*=\s*(?:\d+(?:\.\d+)?|"[^"]*"|'[^']*')\s*$/;

function pushViolation(
  violations: Pep8Violation[],
  line: number,
  col: number,
  code: string,
  message: LText,
  sourceRef: string,
) {
  violations.push({ line, col, code, message, sourceRef });
}

/**
 * Lightweight, line/regex-based checks (not a full AST) for course-specific
 * PEP-8 advice that pycodestyle itself does not flag, sourced directly from
 * this repo's own problem.md "Key Takeaways" sections so the UI can point
 * students back at the exact note that taught the tip.
 */
export function checkCustomRules(code: string): Pep8Violation[] {
  const violations: Pep8Violation[] = [];
  const lines = code.split("\n");

  lines.forEach((lineText, idx) => {
    const line = idx + 1;

    // --- FizzBuzz problem.md §5.6: `not i % 15` over `i % 15 == 0` ---------
    const modMatch = MODULO_EQUALS_ZERO_RE.exec(lineText);
    if (modMatch) {
      pushViolation(
        violations,
        line,
        modMatch.index + 1,
        "PSCP-NOT-MOD",
        {
          th: "ใช้ `not x % n` แทน `x % n == 0` จะกระชับกว่าและผ่าน Pylint โดยไม่มีคำเตือน",
          en: "Prefer `not x % n` over `x % n == 0` — shorter and satisfies Pylint with zero warnings.",
        },
        "problem.md §5.6 (oj3167-FizzBuzz)",
      );
    }

    // --- Triangle problem.md §5.5: `X in (1, n)` over `X == 1 or X == n` ---
    const orEqMatch = EQUALS_OR_EQUALS_RE.exec(lineText);
    if (orEqMatch) {
      pushViolation(
        violations,
        line,
        orEqMatch.index + 1,
        "PSCP-CONSIDER-IN",
        {
          th: "ใช้ `x in (a, b)` แทน `x == a or x == b` จะสั้นกว่าและ Pylint แนะนำ (consider-using-in)",
          en: "Prefer `x in (a, b)` over `x == a or x == b` — shorter, and Pylint's consider-using-in tip.",
        },
        "problem.md §5.5 (oj3237-Triangle)",
      );
    }

    // --- EuclideanDistance2D problem.md §5.4: discourage `import X as Y` ---
    const importMatch = IMPORT_AS_SHORT_ALIAS_RE.exec(lineText);
    if (importMatch) {
      pushViolation(
        violations,
        line,
        1,
        "PSCP-IMPORT-ALIAS",
        {
          th: `การตั้งชื่อย่อ "${importMatch[1]}" ให้โมดูลที่นำเข้าไม่ช่วยให้อ่านง่ายขึ้น ลองใช้ชื่อเต็มแทน`,
          en: `Abbreviating the imported module as "${importMatch[1]}" hurts readability — prefer the full name.`,
        },
        "problem.md §5.4 (oj2998-EuclideanDistance2D)",
      );
    }

    // --- Safe_Password problem.md §5.5: ALL_CAPS for module-level constants -
    // Only consider genuinely module-level lines: no leading whitespace, and
    // skip anything inside a def/class body by tracking indentation is
    // unnecessary here since the regex already requires zero indentation
    // (^NAME = ...), which a nested statement would never match.
    const constMatch = MODULE_LEVEL_LOWERCASE_LITERAL_RE.exec(lineText);
    if (constMatch) {
      const name = constMatch[1];
      // Skip common non-constant patterns: dunder names, and single
      // "throwaway" style names are already excluded by the {3,} length
      // requirement in the regex.
      if (!name.startsWith("__")) {
        pushViolation(
          violations,
          line,
          1,
          "PSCP-CONST-CASE",
          {
            th: `ค่าคงที่ระดับโมดูลอย่าง "${name}" ควรตั้งชื่อด้วยตัวพิมพ์ใหญ่ทั้งหมด (ALL_CAPS) ตามธรรมเนียม PEP-8`,
            en: `Module-level constant "${name}" should be named in ALL_CAPS per PEP-8 convention.`,
          },
          "problem.md §5.5 (oj3019-Safe_Password)",
        );
      }
    }
  });

  return violations;
}
