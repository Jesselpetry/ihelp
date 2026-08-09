"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-6 mb-2 text-primary font-semibold border-l-[3px] border-primary pl-2">
      {children}
    </h4>
  );
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

// ---------------- Plan steps field ----------------
// Renders the plan as a list of one-line step boxes (each auto-prefixed
// "Step N:") plus a free-text remark, but stores the whole thing back as the
// same plain-string format the generator/parser expects, e.g.:
//   Step 1: read n
//   Step 2: loop and sum
//
//   Remark: not sure about negatives
// Empty step boxes are dropped and steps are renumbered on serialize.

type PlanState = { steps: string[]; remark: string };

function parsePlan(raw: string): PlanState {
  const lines = (raw || "").split("\n");
  const steps: string[] = [];
  const remarkLines: string[] = [];
  let sawMarker = false;
  let inRemark = false;
  for (const line of lines) {
    if (inRemark) {
      remarkLines.push(line);
      continue;
    }
    const rm = line.match(/^\s*Remark\s*:\s?(.*)$/i);
    if (rm) {
      sawMarker = true;
      inRemark = true;
      remarkLines.push(rm[1]);
      continue;
    }
    const sm = line.match(/^\s*Step\s+\d+\s*:\s?(.*)$/i);
    if (sm) {
      sawMarker = true;
      steps.push(sm[1]);
      continue;
    }
    // No explicit markers yet: treat each non-empty line as its own step so
    // old free-text plans (1 line = 1 step) stay editable. Blank separators
    // are ignored.
    if (!sawMarker && line.trim()) steps.push(line.trim());
  }
  const remark = remarkLines.join("\n").trim();
  return { steps: steps.length ? steps : [""], remark };
}

function serializePlan(steps: string[], remark: string): string {
  const body = steps
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, i) => `Step ${i + 1}: ${s}`)
    .join("\n");
  const r = remark.trim();
  if (!body && !r) return "";
  if (!r) return body;
  if (!body) return `Remark: ${r}`;
  return `${body}\n\nRemark: ${r}`;
}

export function PlanStepsField({
  label,
  hint,
  value,
  onChange,
  stepPrefix = "Step",
  addLabel = "Add step",
  remarkLabel = "Remark",
  remarkHint,
  stepsModeLabel = "Steps",
  textModeLabel = "Text",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  stepPrefix?: string;
  addLabel?: string;
  remarkLabel?: string;
  remarkHint?: string;
  stepsModeLabel?: string;
  textModeLabel?: string;
}) {
  const [mode, setMode] = useState<"steps" | "text">("steps");
  const [state, setState] = useState<PlanState>(() => parsePlan(value));
  const lastSerialized = useRef(value);

  // Re-parse only when the value changes from the outside (e.g. a saved draft
  // is loaded), not on our own edits.
  useEffect(() => {
    if (value !== lastSerialized.current) {
      setState(parsePlan(value));
      lastSerialized.current = value;
    }
  }, [value]);

  const commit = (steps: string[], remark: string) => {
    setState({ steps, remark });
    const s = serializePlan(steps, remark);
    lastSerialized.current = s;
    onChange(s);
  };

  const setStep = (i: number, v: string) =>
    commit(state.steps.map((s, j) => (j === i ? v : s)), state.remark);
  const addStep = () => commit([...state.steps, ""], state.remark);
  const removeStep = (i: number) => {
    const next = state.steps.filter((_, j) => j !== i);
    commit(next.length ? next : [""], state.remark);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground">{label}</Label>
        <div className="inline-flex shrink-0 rounded-full border border-border p-0.5 text-xs">
          {(
            [
              ["steps", stepsModeLabel],
              ["text", textModeLabel],
            ] as const
          ).map(([m, ml]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                "rounded-full px-3 py-1 font-medium transition-colors " +
                (mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {ml}
            </button>
          ))}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {mode === "text" ? (
        <Textarea
          value={value}
          onChange={(e) => {
            lastSerialized.current = e.target.value;
            setState(parsePlan(e.target.value));
            onChange(e.target.value);
          }}
          rows={8}
        />
      ) : (
       <>
      <div className="space-y-2">
        {state.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2 shrink-0 select-none text-sm font-medium text-muted-foreground tabular-nums">
              {stepPrefix} {i + 1}:
            </span>
            <Textarea
              value={step}
              onChange={(e) => setStep(i, e.target.value)}
              rows={1}
              className="min-h-9 flex-1"
            />
            {state.steps.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(i)}
                aria-label="Remove step"
                className="mt-1.5 shrink-0 rounded-md border border-border p-1.5 text-muted-foreground hover:border-red-400 hover:text-red-500 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addStep}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
      <div className="space-y-1.5 pt-1">
        <Label className="text-muted-foreground">{remarkLabel}</Label>
        {remarkHint && <p className="text-xs text-muted-foreground">{remarkHint}</p>}
        <Textarea
          value={state.remark}
          onChange={(e) => commit(state.steps, e.target.value)}
          rows={2}
        />
      </div>
       </>
      )}
    </div>
  );
}

export type BadgeTone = "green" | "red" | "gray" | "amber" | "primary";

const ACTIVE_TONE: Record<BadgeTone, string> = {
  green:
    "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-600 dark:bg-emerald-600",
  red: "border-red-500 bg-red-500 text-white dark:border-red-600 dark:bg-red-600",
  gray: "border-slate-400 bg-slate-400 text-white dark:border-slate-500 dark:bg-slate-500",
  amber:
    "border-amber-500 bg-amber-500 text-white dark:border-amber-600 dark:bg-amber-600",
  primary: "border-primary bg-primary text-primary-foreground",
};

// Badge-style single choice (replaces dropdowns). Colors per option via `colors`.
export function ChoiceBadges({
  label,
  value,
  onChange,
  options,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  colors?: Record<string, BadgeTone>;
}) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-muted-foreground">{label}</Label>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          const tone = colors?.[o] ?? "primary";
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                "inline-flex items-center gap-1.5 " +
                (active
                  ? ACTIVE_TONE[tone]
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground")
              }
            >
              {active && <Check className="size-3.5" />}
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
