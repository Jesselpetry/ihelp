"use client";

import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChoiceBadges, SectionTitle, TextField } from "@/components/form-fields";
import { FileLanguagePicker } from "@/components/wizard/wizard-frame";
import {
  REFLECTION_CERT_STATEMENTS,
  REFLECTION_POLICY_STATEMENTS,
  statementLabel,
} from "@/lib/statements";
import { REFLECTION_STEPS } from "@/lib/wizard-content";
import { composeAiTool, type ReflectionDraft } from "@/lib/wizard-fields";
import { useLocale, t } from "@/lib/i18n";

const STATUS_COLORS = { Pass: "green", "Not Pass": "red", "Not Submit": "gray" } as const;
const POLICY_COLORS = { Yes: "green", No: "red", "Not Applicable": "gray" } as const;

const AI_TOOL_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "ChatGPT Codex / OpenAI Codex / Codex CLI",
  "Claude Code",
  "Gemini CLI",
];

const L = {
  ojTitle: { th: "หมายเลข/ชื่อโจทย์ OJ", en: "OJ problem number/title" },
  subId: { th: "OJ submission ID (ถ้ามี)", en: "OJ submission ID, if submitted" },
  status: { th: "สถานะ OJ", en: "OJ status" },
  aiTool: { th: "เลือกเครื่องมือ AI ที่ใช้ (เลือกได้หลายอัน)", en: "Pick the AI tool(s) you used (multiple allowed)" },
  aiToolOther: { th: "อื่นๆ ระบุ...", en: "Other, specify..." },
  aiToolPicked: { th: "จะบันทึกในไฟล์เป็น:", en: "Will be written to the file as:" },
  policyNote: { th: "บันทึกสั้น ๆ (short note)", en: "Short note" },
  noExplain: { th: 'หากมีข้อใดตอบ "No" กรุณาอธิบายเหตุผล', en: 'If you answered "No" to any item, explain why' },
  asked: { th: "ฉันถาม AI ให้ช่วยอะไร", en: "What I asked AI to help with" },
  noticed: { th: "AI ช่วยให้ฉันสังเกตอะไร", en: "What AI helped me notice" },
  checked: { th: "ฉันตรวจสอบหรือแก้อะไรด้วยตนเอง", en: "What I checked or changed by myself" },
  learned: { th: "ฉันได้เรียนรู้อะไร (2-4 ประโยค)", en: "What I learned (2-4 sentences)" },
};

export function ReflectionFields({
  draft,
  update,
}: {
  draft: ReflectionDraft;
  update: (fn: (d: ReflectionDraft) => ReflectionDraft) => void;
}) {
  const { locale } = useLocale();
  const patch = (p: Partial<ReflectionDraft>) => update((d) => ({ ...d, ...p }));
  const g = (k: keyof typeof REFLECTION_STEPS) => t(REFLECTION_STEPS[k].guidance, locale);

  return (
    <div className="space-y-4">
      <FileLanguagePicker value={draft.file_locale} onChange={(v) => patch({ file_locale: v })} />

      <SectionTitle>{t(REFLECTION_STEPS.info.title, locale)}</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label={t(L.ojTitle, locale)} value={draft.oj_title} onChange={(v) => patch({ oj_title: v })} rows={2} />
        <TextField label={t(L.subId, locale)} value={draft.submission_id} onChange={(v) => patch({ submission_id: v })} rows={2} />
      </div>
      <ChoiceBadges label={t(L.status, locale)} value={draft.oj_status} onChange={(v) => patch({ oj_status: v })} options={["Pass", "Not Pass", "Not Submit"]} colors={STATUS_COLORS} />

      <SectionTitle>{t(REFLECTION_STEPS.tool.title, locale)}</SectionTitle>
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
                  ai_tools: active ? draft.ai_tools.filter((x) => x !== tool) : [...draft.ai_tools, tool],
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
      <Input placeholder={t(L.aiToolOther, locale)} value={draft.ai_tool_other} onChange={(e) => patch({ ai_tool_other: e.target.value })} />
      {composeAiTool(draft) && (
        <div className="rounded-lg border bg-background/50 p-3">
          <p className="text-xs text-muted-foreground mb-1">{t(L.aiToolPicked, locale)}</p>
          <pre className="text-sm whitespace-pre-wrap font-sans">{composeAiTool(draft)}</pre>
        </div>
      )}

      <SectionTitle>{t(REFLECTION_STEPS.policy.title, locale)}</SectionTitle>
      <p className="text-xs text-muted-foreground">{g("policy")}</p>
      <div className="space-y-3">
        {REFLECTION_POLICY_STATEMENTS.map((s, i) => (
          <div key={s} className="rounded-lg border bg-background/50 p-3 space-y-2">
            <p className="text-sm">{statementLabel(s, locale)}</p>
            {locale === "th" && <p className="text-xs text-muted-foreground break-words">{s}</p>}
            <ChoiceBadges
              label=""
              value={draft.policy_answers[i]}
              onChange={(v) => update((d) => ({ ...d, policy_answers: d.policy_answers.map((x, j) => (j === i ? v : x)) }))}
              options={["Yes", "No", "Not Applicable"]}
              colors={POLICY_COLORS}
            />
            <Input
              placeholder={t(L.policyNote, locale)}
              value={draft.policy_notes[i]}
              onChange={(e) => update((d) => ({ ...d, policy_notes: d.policy_notes.map((x, j) => (j === i ? e.target.value : x)) }))}
            />
          </div>
        ))}
        {draft.policy_answers.includes("No") && (
          <TextField label={t(L.noExplain, locale)} value={draft.policy_no_explain} onChange={(v) => patch({ policy_no_explain: v })} rows={2} />
        )}
      </div>

      <SectionTitle>{t(REFLECTION_STEPS.asked.title, locale)}</SectionTitle>
      <TextField label={t(L.asked, locale)} value={draft.what_asked} onChange={(v) => patch({ what_asked: v })} rows={5} />
      <SectionTitle>{t(REFLECTION_STEPS.noticed.title, locale)}</SectionTitle>
      <TextField label={t(L.noticed, locale)} value={draft.what_noticed} onChange={(v) => patch({ what_noticed: v })} rows={5} />
      <SectionTitle>{t(REFLECTION_STEPS.checked.title, locale)}</SectionTitle>
      <TextField label={t(L.checked, locale)} value={draft.what_checked} onChange={(v) => patch({ what_checked: v })} rows={5} />
      <SectionTitle>{t(REFLECTION_STEPS.learned.title, locale)}</SectionTitle>
      <TextField label={t(L.learned, locale)} value={draft.what_learned} onChange={(v) => patch({ what_learned: v })} rows={5} />

      <SectionTitle>{t(REFLECTION_STEPS.declaration.title, locale)}</SectionTitle>
      <div className="space-y-2">
        {REFLECTION_CERT_STATEMENTS.map((s, i) => (
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
