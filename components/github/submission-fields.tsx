"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceBadges, SectionTitle, TextField } from "@/components/form-fields";
import { FileLanguagePicker } from "@/components/wizard/wizard-frame";
import { SUBMISSION_CERT_STATEMENTS, statementLabel } from "@/lib/statements";
import { SUBMISSION_STEPS, TIME_OPTIONS } from "@/lib/wizard-content";
import { type SubmissionDraft } from "@/lib/wizard-fields";
import { useLocale, t } from "@/lib/i18n";

const STATUS_COLORS = { Pass: "green", "Not Pass": "red", "Not Submit": "gray" } as const;
const RESULT_COLORS = { Pass: "green", "Not Pass": "red" } as const;
const FACT_COLORS = { Yes: "amber", No: "gray" } as const;
const COPIED_COLORS = { No: "green", Yes: "red" } as const;

const L = {
  ojTitle: { th: "หมายเลข/ชื่อโจทย์ OJ", en: "OJ problem number/title" },
  subId: { th: "OJ submission ID (ถ้ามี)", en: "OJ submission ID, if submitted" },
  status: { th: "สถานะ OJ", en: "OJ status" },
  time: { th: "เวลาที่ใช้คิดและทำโจทย์ด้วยตนเอง", en: "Independent time spent" },
  understanding: { th: "อธิบายโจทย์ด้วยคำพูดของตนเอง", en: "The problem in your own words" },
  firstPlan: { th: "แผนแรกของฉัน", en: "My first plan" },
  finalApproach: { th: "วิธีสุดท้ายที่ใช้จริง", en: "My final approach" },
  testWhy: { th: "ทำไมเลือก case นี้", en: "Why I chose this case" },
  input: { th: "Input", en: "Input" },
  expected: { th: "Expected output", en: "Expected output" },
  actual: { th: "Actual output", en: "Actual output" },
  result: { th: "ผลลัพธ์", en: "Result" },
  usedAi: { th: "ใช้ AI กับโจทย์นี้หรือไม่", en: "Did you use AI on this problem?" },
  humanHelp: { th: "ได้รับความช่วยเหลือจากคนหรือไม่", en: "Did you get human help?" },
  whoHelped: { th: "ใครช่วยคุณ", en: "Who helped you" },
  whatHelp: { th: "เขาช่วยอะไร", en: "What did they help with" },
  stillOwn: { th: "คุณยังทำอะไรด้วยตนเอง", en: "What did you still do by yourself" },
  copied: { th: "คัดลอก code จากผู้อื่นหรือไม่", en: "Did you copy code from another person?" },
};

export function SubmissionFields({
  draft,
  update,
}: {
  draft: SubmissionDraft;
  update: (fn: (d: SubmissionDraft) => SubmissionDraft) => void;
}) {
  const { locale } = useLocale();
  const patch = (p: Partial<SubmissionDraft>) => update((d) => ({ ...d, ...p }));
  const patchTest = (i: number, p: Partial<SubmissionDraft["tests"][number]>) =>
    update((d) => ({
      ...d,
      tests: d.tests.map((tc, j) => (j === i ? { ...tc, ...p } : tc)),
    }));
  const g = (k: keyof typeof SUBMISSION_STEPS) => t(SUBMISSION_STEPS[k].guidance, locale);

  return (
    <div className="space-y-4">
      <FileLanguagePicker value={draft.file_locale} onChange={(v) => patch({ file_locale: v })} />

      <SectionTitle>{t(SUBMISSION_STEPS.info.title, locale)}</SectionTitle>
      <p className="text-xs text-muted-foreground">{g("info")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label={t(L.ojTitle, locale)} value={draft.oj_title} onChange={(v) => patch({ oj_title: v })} rows={2} />
        <TextField label={t(L.subId, locale)} value={draft.submission_id} onChange={(v) => patch({ submission_id: v })} rows={2} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ChoiceBadges label={t(L.status, locale)} value={draft.oj_status} onChange={(v) => patch({ oj_status: v })} options={["Pass", "Not Pass", "Not Submit"]} colors={STATUS_COLORS} />
        <ChoiceBadges label={t(L.time, locale)} value={draft.time_spent} onChange={(v) => patch({ time_spent: v })} options={TIME_OPTIONS} />
      </div>

      <SectionTitle>{t(SUBMISSION_STEPS.understanding.title, locale)}</SectionTitle>
      <TextField label={t(L.understanding, locale)} hint={g("understanding")} value={draft.understanding} onChange={(v) => patch({ understanding: v })} rows={6} />

      <SectionTitle>{t(SUBMISSION_STEPS.first_plan.title, locale)}</SectionTitle>
      <TextField label={t(L.firstPlan, locale)} hint={g("first_plan")} value={draft.first_plan} onChange={(v) => patch({ first_plan: v })} rows={6} />

      <SectionTitle>{t(SUBMISSION_STEPS.final_approach.title, locale)}</SectionTitle>
      <TextField label={t(L.finalApproach, locale)} hint={g("final_approach")} value={draft.final_approach} onChange={(v) => patch({ final_approach: v })} rows={6} />

      <SectionTitle>{t(SUBMISSION_STEPS.tests.title, locale)}</SectionTitle>
      <p className="text-xs text-muted-foreground">{g("tests")}</p>
      <div className="space-y-4">
        {draft.tests.map((tc, i) => (
          <div key={i} className="rounded-lg border bg-background/50 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
              <TextField label={`Test ${i + 1} — ${t(L.testWhy, locale)}`} value={tc.why} onChange={(v) => patchTest(i, { why: v })} rows={2} />
              <ChoiceBadges label={t(L.result, locale)} value={tc.result} onChange={(v) => patchTest(i, { result: v })} options={["Pass", "Not Pass"]} colors={RESULT_COLORS} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextField label={t(L.input, locale)} value={tc.input} onChange={(v) => patchTest(i, { input: v })} rows={3} />
              <TextField label={t(L.expected, locale)} value={tc.expected} onChange={(v) => patchTest(i, { expected: v })} rows={3} />
              <TextField label={t(L.actual, locale)} value={tc.actual} onChange={(v) => patchTest(i, { actual: v })} rows={3} />
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>{t(SUBMISSION_STEPS.ai_use.title, locale)}</SectionTitle>
      <ChoiceBadges label={t(L.usedAi, locale)} value={draft.used_ai} onChange={(v) => patch({ used_ai: v })} options={["No", "Yes"]} colors={FACT_COLORS} />

      <SectionTitle>{t(SUBMISSION_STEPS.human_help.title, locale)}</SectionTitle>
      <ChoiceBadges label={t(L.humanHelp, locale)} value={draft.human_help} onChange={(v) => patch({ human_help: v })} options={["No", "Yes"]} colors={FACT_COLORS} />
      {draft.human_help === "Yes" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={t(L.whoHelped, locale)} value={draft.who_helped} onChange={(v) => patch({ who_helped: v })} rows={2} />
            <TextField label={t(L.whatHelp, locale)} value={draft.what_help} onChange={(v) => patch({ what_help: v })} rows={2} />
          </div>
          <TextField label={t(L.stillOwn, locale)} value={draft.still_own_work} onChange={(v) => patch({ still_own_work: v })} rows={3} />
        </>
      )}
      <ChoiceBadges label={t(L.copied, locale)} value={draft.copied_code} onChange={(v) => patch({ copied_code: v })} options={["No", "Yes"]} colors={COPIED_COLORS} />

      <SectionTitle>{t(SUBMISSION_STEPS.declaration.title, locale)}</SectionTitle>
      <div className="space-y-2">
        {SUBMISSION_CERT_STATEMENTS.map((s, i) => (
          <label key={s} className="flex items-center gap-3 text-sm cursor-pointer rounded-lg border bg-background px-3 py-2.5 hover:bg-muted transition-colors">
            <Checkbox
              checked={draft.certs[i]}
              onCheckedChange={(v) => update((d) => ({ ...d, certs: d.certs.map((x, j) => (j === i ? v === true : x)) }))}
            />
            <span>
              {statementLabel(s, locale)}
              {locale === "th" && <span className="block text-xs text-muted-foreground">{s}</span>}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
