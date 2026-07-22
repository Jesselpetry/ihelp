"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileLanguagePicker, ScrollDownCue, WizardFrame } from "@/components/wizard/wizard-frame";
import { ChoiceBadges, PlanStepsField, TextField } from "@/components/form-fields";
import { MarkdownPreview } from "@/components/md-preview";

const STATUS_COLORS = { Pass: "green", "Not Pass": "red", "Not Submit": "gray" } as const;
const RESULT_COLORS = { Pass: "green", "Not Pass": "red" } as const;
const FACT_COLORS = { Yes: "amber", No: "gray" } as const;
const COPIED_COLORS = { No: "green", Yes: "red" } as const;
import { SUBMISSION_CERT_STATEMENTS, statementLabel } from "@/lib/statements";
import { SUBMISSION_STEPS, TIME_OPTIONS, HOW_TO_COUNT_TIME } from "@/lib/wizard-content";
import { useDraft, downloadMarkdown } from "@/lib/draft";
import { addHistoryEntry } from "@/lib/history";
import { GithubPushSection } from "@/components/github/github-push-section";
import {
  emptySubmissionDraft,
  submissionFieldsFromDraft,
  type SubmissionDraft as Draft,
} from "@/lib/wizard-fields";
import { useLocale, t } from "@/lib/i18n";
import { validateSubmissionUpTo } from "@/lib/validation";

const STEP_KEYS = [
  "language", "info", "understanding", "first_plan", "final_approach",
  "tests", "ai_use", "human_help", "declaration", "download",
] as const;

const emptyDraft = emptySubmissionDraft;

const L = {
  ojTitle: { th: "หมายเลข/ชื่อโจทย์ OJ", en: "OJ problem number/title" },
  subId: { th: "OJ submission ID (ถ้ามี)", en: "OJ submission ID, if submitted" },
  status: { th: "สถานะ OJ", en: "OJ status" },
  time: { th: "เวลาที่ใช้คิดและทำโจทย์ด้วยตนเอง", en: "Independent time spent" },
  understanding: {
    th: "อธิบายโจทย์ด้วยคำพูดของตนเอง (input / output / constraints)",
    en: "The problem in your own words (input / output / constraints)",
  },
  firstPlan: { th: "แผนแรกของฉัน", en: "My first plan" },
  addStep: { th: "เพิ่มขั้นตอน", en: "Add step" },
  planStepsMode: { th: "ขั้นตอน", en: "Steps" },
  planTextMode: { th: "ข้อความ", en: "Text" },
  planRemark: { th: "หมายเหตุ", en: "Remark" },
  planRemarkHint: {
    th: "สิ่งที่ยังไม่แน่ใจหรืออยากบันทึกไว้ (ไม่บังคับ)",
    en: "Anything you were unsure about or want to note (optional)",
  },
  finalApproach: { th: "วิธีสุดท้ายที่ใช้จริง", en: "My final approach" },
  testWhy: { th: "ทำไมเลือก case นี้", en: "Why I chose this case" },
  input: { th: "Input", en: "Input" },
  expected: { th: "Expected output", en: "Expected output" },
  actual: { th: "Actual output", en: "Actual output" },
  result: { th: "Result", en: "Result" },
  usedAi: { th: "ใช้ AI กับโจทย์นี้หรือไม่", en: "Did you use AI for this problem?" },
  aiYesNote: {
    th: "คุณตอบว่าใช้ AI — อย่าลืมสร้าง ai_reflection.md ด้วย (ปุ่มอยู่หน้ารายการโจทย์)",
    en: "You answered Yes — remember to also create ai_reflection.md (button on the problems page).",
  },
  humanHelp: {
    th: "ได้ถามเพื่อน TA ผู้สอน หรือบุคคลอื่นหรือไม่",
    en: "Did you ask a friend, TA, instructor, or another person for help?",
  },
  whoHelped: { th: "ใครช่วยคุณ", en: "Who helped you?" },
  whatHelp: { th: "เขาช่วยอะไร", en: "What did they help with?" },
  stillOwn: { th: "คุณยังทำอะไรด้วยตนเอง", en: "What did you still do by yourself?" },
  copied: { th: "คุณคัดลอก code จากคนอื่นหรือไม่", en: "Did you copy any code from another person?" },
  certWarn: {
    th: "ต้องติ๊กครบทั้ง 7 ข้อจึงจะไปต่อได้ ถ้าข้อใดยังไม่จริง ให้กลับไปแก้งานก่อน",
    en: "All statements must be checked to continue. If one isn't true yet, go back and fix your work first.",
  },
  preview: { th: "สร้างตัวอย่างไฟล์", en: "Generate preview" },
  download: { th: "ดาวน์โหลด submission.md", en: "Download submission.md" },
  clear: { th: "ล้างแบบร่างนี้", en: "Clear this draft" },
  draftNote: {
    th: "แบบร่างถูกบันทึกในเครื่องของคุณโดยอัตโนมัติ",
    en: "Your draft is saved automatically in this browser.",
  },
  incomplete: {
    th: "กรุณากรอกข้อมูลที่จำเป็นให้ครบก่อนดาวน์โหลด",
    en: "Please fill in all required fields before downloading.",
  },
  verifyRead: {
    th: "ฉันได้เลื่อนอ่านไฟล์นี้จนจบแล้ว และข้อมูลถูกต้อง",
    en: "I scrolled through and read this whole file, and it is correct.",
  },
  scrollHint: {
    th: "เลื่อนอ่านตัวอย่างไฟล์ให้ถึงบรรทัดสุดท้ายก่อน จึงจะติ๊กยืนยันและดาวน์โหลดได้",
    en: "Scroll the preview to the last line to unlock the confirm checkbox and download.",
  },
  previewEmpty: {
    th: "กด “สร้างตัวอย่างไฟล์” เพื่อดูเนื้อหา",
    en: "Press “Generate preview” to see the file.",
  },
  vscodeReminder: {
    th: "อย่าลืม: เขียน รัน และทดสอบ code จริงใน VS Code และส่ง code ในระบบ OJ ด้วยตนเอง",
    en: "Remember: write, run, and test your real code in VS Code, and submit the code to the OJ yourself.",
  },
};

export function SubmissionWizard({ problemId, ojTitle }: { problemId: string; ojTitle: string }) {
  const { locale } = useLocale();
  const [draft, setDraft, clearDraft] = useDraft<Draft>(
    `ihelp-submission-${problemId}`,
    emptyDraft(ojTitle),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // The file must be read to the end (scrolled to bottom) and confirmed
  // before it can be downloaded. Regenerating a preview resets both.
  const [reachedBottom, setReachedBottom] = useState(false);
  const [verified, setVerified] = useState(false);

  const steps = STEP_KEYS.map((k) => SUBMISSION_STEPS[k]);
  const key = STEP_KEYS[stepIndex];
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));
  const patchTest = (i: number, p: Partial<Draft["tests"][number]>) =>
    setDraft((d) => ({
      ...d,
      tests: d.tests.map((tc, j) => (j === i ? { ...tc, ...p } : tc)),
    }));

  async function generate(): Promise<string> {
    const fields = submissionFieldsFromDraft(draft);
    const res = await fetch("/api/generate/submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: draft.file_locale, fields }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "generation failed");
    addHistoryEntry({
      kind: "submission",
      problemId,
      ojTitle: draft.oj_title,
      fileLocale: draft.file_locale,
      fileName: "submission.md",
      markdown: data.markdown,
    });
    return data.markdown;
  }

  async function refreshPreview() {
    setBusy(true);
    setError("");
    // new content: student must scroll and re-confirm before downloading
    setReachedBottom(false);
    setVerified(false);
    try {
      setPreview(await generate());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    // the student must confirm they read the whole file first
    if (!verified) return;
    // verify every required field is filled in before generating the file,
    // even if the wizard was navigated straight to this step
    const invalidIndex = validateSubmissionUpTo(draft, STEP_KEYS, STEP_KEYS.length);
    if (invalidIndex !== null) {
      setStepIndex(invalidIndex);
      setError(t(L.incomplete, locale));
      return;
    }
    setBusy(true);
    setError("");
    try {
      downloadMarkdown("submission.md", await generate());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <WizardFrame
      fileName="submission.md"
      problemLabel={ojTitle}
      steps={steps}
      stepIndex={stepIndex}
      validate={(target) => validateSubmissionUpTo(draft, STEP_KEYS, target)}
      onStepChange={(i) => {
        setStepIndex(i);
        // arriving at the last step generates right away, which also saves
        // the file into the local history
        if (STEP_KEYS[i] === "download") refreshPreview();
      }}
    >
      {key === "language" && (
        <FileLanguagePicker
          value={draft.file_locale}
          onChange={(v) => patch({ file_locale: v })}
        />
      )}

      {key === "info" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={t(L.ojTitle, locale)} value={draft.oj_title} onChange={(v) => patch({ oj_title: v })} rows={2} />
            <TextField label={t(L.subId, locale)} value={draft.submission_id} onChange={(v) => patch({ submission_id: v })} rows={2} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChoiceBadges label={t(L.status, locale)} value={draft.oj_status} onChange={(v) => patch({ oj_status: v })} options={["Pass", "Not Pass", "Not Submit"]} colors={STATUS_COLORS} />
            <ChoiceBadges label={t(L.time, locale)} value={draft.time_spent} onChange={(v) => patch({ time_spent: v })} options={TIME_OPTIONS} />
          </div>
          <p className="text-xs text-muted-foreground whitespace-pre-line rounded-lg border bg-background/50 p-3">
            {t(HOW_TO_COUNT_TIME, locale)}
          </p>
        </div>
      )}

      {key === "understanding" && (
        <TextField label={t(L.understanding, locale)} value={draft.understanding} onChange={(v) => patch({ understanding: v })} rows={8} />
      )}

      {key === "first_plan" && (
        <PlanStepsField
          label={t(L.firstPlan, locale)}
          value={draft.first_plan}
          onChange={(v) => patch({ first_plan: v })}
          addLabel={t(L.addStep, locale)}
          remarkLabel={t(L.planRemark, locale)}
          remarkHint={t(L.planRemarkHint, locale)}
          stepsModeLabel={t(L.planStepsMode, locale)}
          textModeLabel={t(L.planTextMode, locale)}
        />
      )}

      {key === "final_approach" && (
        <TextField label={t(L.finalApproach, locale)} value={draft.final_approach} onChange={(v) => patch({ final_approach: v })} rows={8} />
      )}

      {key === "tests" && (
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
      )}

      {key === "ai_use" && (
        <div className="space-y-3">
          <ChoiceBadges label={t(L.usedAi, locale)} value={draft.used_ai} onChange={(v) => patch({ used_ai: v })} options={["No", "Yes"]} colors={FACT_COLORS} />
          {draft.used_ai === "Yes" && (
            <p className="text-sm text-primary rounded-lg border border-primary/40 bg-primary/5 p-3">
              {t(L.aiYesNote, locale)}
            </p>
          )}
        </div>
      )}

      {key === "human_help" && (
        <div className="space-y-4">
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
        </div>
      )}

      {key === "declaration" && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t(L.certWarn, locale)}</p>
          {SUBMISSION_CERT_STATEMENTS.map((s, i) => (
            <label key={s} className="flex items-center gap-3 text-sm cursor-pointer rounded-lg border bg-background px-3 py-2.5 hover:bg-muted transition-colors">
              <Checkbox
                checked={draft.certs[i]}
                onCheckedChange={(v) =>
                  setDraft((d) => ({ ...d, certs: d.certs.map((x, j) => (j === i ? v === true : x)) }))
                }
              />
              <span>
                {statementLabel(s, locale)}
                {locale === "th" && (
                  <span className="block text-xs text-muted-foreground">{s}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}

      {key === "download" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
          {/* left: the file to read */}
          <div>
            {preview ? (
              <MarkdownPreview markdown={preview} onReachedBottom={() => setReachedBottom(true)} />
            ) : (
              <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                {t(L.previewEmpty, locale)}
              </p>
            )}
          </div>

          {/* right: reminders + confirm + actions */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {preview && !reachedBottom && <ScrollDownCue />}
            <p className="text-sm rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-3">
              {t(L.vscodeReminder, locale)}
            </p>

            {preview && (
              <>
                <label
                  className={
                    "flex items-center gap-3 text-sm rounded-lg border bg-background px-3 py-2.5 transition-colors " +
                    (reachedBottom ? "cursor-pointer hover:bg-muted" : "opacity-60 cursor-not-allowed")
                  }
                >
                  <Checkbox
                    checked={verified}
                    disabled={!reachedBottom}
                    onCheckedChange={(v) => setVerified(v === true)}
                  />
                  <span>{t(L.verifyRead, locale)}</span>
                </label>
                {!reachedBottom && (
                  <p className="text-xs text-muted-foreground">{t(L.scrollHint, locale)}</p>
                )}
              </>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex flex-col gap-2 border-t pt-4">
              <Button onClick={download} disabled={busy || !verified} className="w-full">
                <Download className="size-4" />
                {t(L.download, locale)}
              </Button>
              {preview && (
                <GithubPushSection
                  problemId={problemId}
                  kind="submission"
                  markdown={preview}
                  disabled={!verified}
                />
              )}
              <Button variant="outline" onClick={refreshPreview} disabled={busy} className="w-full">
                {t(L.preview, locale)}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => {
                  if (window.confirm(t(L.clear, locale) + "?")) clearDraft();
                }}
              >
                {t(L.clear, locale)}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t(L.draftNote, locale)}</p>
          </div>
        </div>
      )}
    </WizardFrame>
  );
}
