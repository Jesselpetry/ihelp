"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FileLanguagePicker, ScrollDownCue, WizardFrame } from "@/components/wizard/wizard-frame";
import { ChoiceBadges, TextField } from "@/components/form-fields";
import { MarkdownPreview } from "@/components/md-preview";

const STATUS_COLORS = { Pass: "green", "Not Pass": "red", "Not Submit": "gray" } as const;
const POLICY_COLORS = { Yes: "green", No: "red", "Not Applicable": "gray" } as const;
import {
  REFLECTION_CERT_STATEMENTS,
  REFLECTION_POLICY_STATEMENTS,
  statementLabel,
} from "@/lib/statements";
import { REFLECTION_STEPS } from "@/lib/wizard-content";
import { useDraft, downloadMarkdown } from "@/lib/draft";
import { addHistoryEntry } from "@/lib/history";
import { useLocale, t } from "@/lib/i18n";
import { validateReflectionUpTo } from "@/lib/validation";

const STEP_KEYS = [
  "language", "info", "tool", "policy", "asked", "noticed", "checked", "learned",
  "declaration", "download",
] as const;

// Options straight from the template's examples block, plus free-text "other"
const AI_TOOL_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "ChatGPT Codex / OpenAI Codex / Codex CLI",
  "Claude Code",
  "Gemini CLI",
];

interface Draft {
  file_locale: "th" | "en";
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

function emptyDraft(ojTitle: string): Draft {
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

function composeAiTool(draft: Draft): string {
  const tools = [...draft.ai_tools];
  const other = draft.ai_tool_other.trim();
  if (other) tools.push(`Other: ${other}`);
  // fall back to legacy free text from old saved drafts
  if (tools.length === 0) return draft.ai_tool;
  return tools.join("\n");
}

const L = {
  ojTitle: { th: "หมายเลข/ชื่อโจทย์ OJ", en: "OJ problem number/title" },
  subId: { th: "OJ submission ID (ถ้ามี)", en: "OJ submission ID, if submitted" },
  status: { th: "สถานะ OJ", en: "OJ status" },
  aiTool: { th: "เลือกเครื่องมือ AI ที่ใช้ (เลือกได้หลายอัน)", en: "Pick the AI tool(s) you used (multiple allowed)" },
  aiToolOther: { th: "อื่นๆ ระบุ...", en: "Other, specify..." },
  aiToolPicked: { th: "จะบันทึกในไฟล์เป็น:", en: "Will be written to the file as:" },
  policyNote: { th: "บันทึกสั้น ๆ (short note)", en: "Short note" },
  noExplain: {
    th: 'หากมีข้อใดตอบ "No" กรุณาอธิบายเหตุผล',
    en: 'If you answered "No" to any item, explain why',
  },
  asked: { th: "ฉันถาม AI ให้ช่วยอะไร", en: "What I asked AI to help with" },
  noticed: { th: "AI ช่วยให้ฉันสังเกตอะไร", en: "What AI helped me notice" },
  checked: { th: "ฉันตรวจสอบหรือแก้อะไรด้วยตนเอง", en: "What I checked or changed by myself" },
  learned: { th: "ฉันได้เรียนรู้อะไร (2-4 ประโยค)", en: "What I learned (2-4 sentences)" },
  certWarn: {
    th: "ต้องติ๊กครบทั้ง 5 ข้อจึงจะไปต่อได้ ถ้าข้อใดยังไม่จริง ให้กลับไปแก้งานก่อน",
    en: "All statements must be checked to continue. If one isn't true yet, go back and fix your work first.",
  },
  preview: { th: "สร้างตัวอย่างไฟล์", en: "Generate preview" },
  download: { th: "ดาวน์โหลด ai_reflection.md", en: "Download ai_reflection.md" },
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
  ownWords: {
    th: "เขียนด้วยคำพูดของตนเอง ห้ามวาง chat log และห้ามให้ AI เขียน reflection แทน",
    en: "Write in your own words. Do not paste the chat log, and do not ask AI to write this reflection for you.",
  },
};

export function ReflectionWizard({ problemId, ojTitle }: { problemId: string; ojTitle: string }) {
  const { locale } = useLocale();
  const [draft, setDraft, clearDraft] = useDraft<Draft>(
    `ihelp-reflection-${problemId}`,
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

  const steps = STEP_KEYS.map((k) => REFLECTION_STEPS[k]);
  const key = STEP_KEYS[stepIndex];
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  async function generate(): Promise<string> {
    const policy: Record<string, { answer: string; note: string }> = {};
    REFLECTION_POLICY_STATEMENTS.forEach((s, i) => {
      policy[s] = { answer: draft.policy_answers[i], note: draft.policy_notes[i] };
    });
    const certifications: Record<string, boolean> = {};
    REFLECTION_CERT_STATEMENTS.forEach((s, i) => (certifications[s] = draft.certs[i]));
    const fields = {
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
    const res = await fetch("/api/generate/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: draft.file_locale, fields }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "generation failed");
    addHistoryEntry({
      kind: "reflection",
      problemId,
      ojTitle: draft.oj_title,
      fileLocale: draft.file_locale,
      fileName: "ai_reflection.md",
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
    const invalidIndex = validateReflectionUpTo(draft, STEP_KEYS, STEP_KEYS.length);
    if (invalidIndex !== null) {
      setStepIndex(invalidIndex);
      setError(t(L.incomplete, locale));
      return;
    }
    setBusy(true);
    setError("");
    try {
      downloadMarkdown("ai_reflection.md", await generate());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <WizardFrame
      fileName="ai_reflection.md"
      problemLabel={ojTitle}
      steps={steps}
      stepIndex={stepIndex}
      validate={(target) => validateReflectionUpTo(draft, STEP_KEYS, target)}
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
          <p className="text-xs text-muted-foreground rounded-lg border bg-background/50 p-3">
            {t(L.ownWords, locale)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label={t(L.ojTitle, locale)} value={draft.oj_title} onChange={(v) => patch({ oj_title: v })} rows={2} />
            <TextField label={t(L.subId, locale)} value={draft.submission_id} onChange={(v) => patch({ submission_id: v })} rows={2} />
          </div>
          <ChoiceBadges label={t(L.status, locale)} value={draft.oj_status} onChange={(v) => patch({ oj_status: v })} options={["Pass", "Not Pass", "Not Submit"]} colors={STATUS_COLORS} />
        </div>
      )}

      {key === "tool" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t(L.aiTool, locale)}</p>
          <div className="flex flex-wrap gap-2">
            {AI_TOOL_OPTIONS.map((tool) => {
              const active = draft.ai_tools.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() =>
                    patch({
                      ai_tools: active
                        ? draft.ai_tools.filter((x) => x !== tool)
                        : [...draft.ai_tools, tool],
                    })
                  }
                  className={
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground")
                  }
                >
                  {active && <Check className="size-3.5" />}
                  {tool}
                </button>
              );
            })}
          </div>
          <Input
            placeholder={t(L.aiToolOther, locale)}
            value={draft.ai_tool_other}
            onChange={(e) => patch({ ai_tool_other: e.target.value })}
          />
          {composeAiTool(draft) && (
            <div className="rounded-lg border bg-background/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">{t(L.aiToolPicked, locale)}</p>
              <pre className="text-sm whitespace-pre-wrap font-sans">{composeAiTool(draft)}</pre>
            </div>
          )}
        </div>
      )}

      {key === "policy" && (
        <div className="space-y-3">
          {REFLECTION_POLICY_STATEMENTS.map((s, i) => (
            <div key={s} className="rounded-lg border bg-background/50 p-3 space-y-2">
              <p className="text-sm">{statementLabel(s, locale)}</p>
              {locale === "th" && (
                <p className="text-xs text-muted-foreground break-words">{s}</p>
              )}
              <ChoiceBadges
                label=""
                value={draft.policy_answers[i]}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    policy_answers: d.policy_answers.map((x, j) => (j === i ? v : x)),
                  }))
                }
                options={["Yes", "No", "Not Applicable"]}
                colors={POLICY_COLORS}
              />
              <Input
                placeholder={t(L.policyNote, locale)}
                value={draft.policy_notes[i]}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    policy_notes: d.policy_notes.map((x, j) => (j === i ? e.target.value : x)),
                  }))
                }
              />
            </div>
          ))}
          {draft.policy_answers.includes("No") && (
            <TextField label={t(L.noExplain, locale)} value={draft.policy_no_explain} onChange={(v) => patch({ policy_no_explain: v })} rows={2} />
          )}
        </div>
      )}

      {key === "asked" && (
        <TextField label={t(L.asked, locale)} value={draft.what_asked} onChange={(v) => patch({ what_asked: v })} rows={6} />
      )}
      {key === "noticed" && (
        <TextField label={t(L.noticed, locale)} value={draft.what_noticed} onChange={(v) => patch({ what_noticed: v })} rows={6} />
      )}
      {key === "checked" && (
        <TextField label={t(L.checked, locale)} value={draft.what_checked} onChange={(v) => patch({ what_checked: v })} rows={6} />
      )}
      {key === "learned" && (
        <TextField label={t(L.learned, locale)} value={draft.what_learned} onChange={(v) => patch({ what_learned: v })} rows={6} />
      )}

      {key === "declaration" && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t(L.certWarn, locale)}</p>
          {REFLECTION_CERT_STATEMENTS.map((s, i) => (
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

          {/* right: confirm + actions */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {preview && !reachedBottom && <ScrollDownCue />}

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
