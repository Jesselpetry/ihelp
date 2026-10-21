"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CUSTOM_LIMITS, CUSTOM_PRESET_ID, TIMER_PRESETS } from "@/lib/study-space/presets";
import type { StudySettings } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { L } from "./strings";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n) || lo));

/**
 * Timer settings and the reset. Identity is not here — the page belongs to
 * the signed-in student. The form mounts fresh on every open, so it always
 * starts from what is saved.
 */
export function SettingsDialog({
  trigger,
  open,
  onOpenChange,
}: {
  /** The button that opens it; focus returns there on close. */
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useLocale();
  const { data } = useStudySpace();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(L.settingsTitle, locale)}</DialogTitle>
          <DialogDescription>{t(L.settingsDesc, locale)}</DialogDescription>
        </DialogHeader>
        {open && <SettingsForm settings={data.settings} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function SettingsForm({ settings, onDone }: { settings: StudySettings; onDone: () => void }) {
  const { locale } = useLocale();
  const { store } = useStudySpace();
  const [presetId, setPresetId] = useState(settings.selectedPresetId);
  const [study, setStudy] = useState(String(settings.customPreset.studyMinutes));
  const [rest, setRest] = useState(String(settings.customPreset.breakMinutes));
  const [sound, setSound] = useState(settings.soundEnabled);
  const [autoAdvance, setAutoAdvance] = useState(settings.autoStartBreak);
  const [confirmReset, setConfirmReset] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      selectedPresetId: presetId,
      customPreset: {
        studyMinutes: clamp(Number(study), CUSTOM_LIMITS.study.min, CUSTOM_LIMITS.study.max),
        breakMinutes: clamp(Number(rest), CUSTOM_LIMITS.break.min, CUSTOM_LIMITS.break.max),
      },
      soundEnabled: sound,
      autoStartBreak: autoAdvance,
    });
    onDone();
  };

  const options = [
    ...TIMER_PRESETS.map((p) => ({ id: p.id, label: t(p.label, locale), detail: `${p.studyMinutes} / ${p.breakMinutes}` })),
    { id: CUSTOM_PRESET_ID, label: t(L.custom, locale), detail: `${study || "–"} / ${rest || "–"}` },
  ];

  const shortcuts: [string, string][] = [
    ["Space", t(L.scStartPause, locale)],
    ["F", t(L.scFocus, locale)],
    ["Esc", t(L.scExit, locale)],
  ];

  return (
    <form onSubmit={save} className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-muted-foreground">{t(L.timer, locale)}</legend>
        <div role="group" aria-label={t(L.timer, locale)} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={presetId === o.id}
              onClick={() => setPresetId(o.id)}
              className={cn(
                "rounded-xl border p-2.5 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                presetId === o.id ? "border-primary bg-primary/5" : "hover:bg-muted",
              )}
            >
              <div className="text-sm font-medium">{o.label}</div>
              <div className="text-xs tabular-nums text-muted-foreground">{o.detail}</div>
            </button>
          ))}
        </div>

        {presetId === CUSTOM_PRESET_ID && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ss-study">{t(L.studyMin, locale)}</Label>
              <Input
                id="ss-study"
                type="number"
                min={CUSTOM_LIMITS.study.min}
                max={CUSTOM_LIMITS.study.max}
                value={study}
                onChange={(e) => setStudy(e.target.value)}
                className="tabular-nums"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ss-break">{t(L.breakMin, locale)}</Label>
              <Input
                id="ss-break"
                type="number"
                min={CUSTOM_LIMITS.break.min}
                max={CUSTOM_LIMITS.break.max}
                value={rest}
                onChange={(e) => setRest(e.target.value)}
                className="tabular-nums"
              />
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={sound} onCheckedChange={(v) => setSound(v === true)} />
            {t(L.sound, locale)}
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={autoAdvance} onCheckedChange={(v) => setAutoAdvance(v === true)} />
            {t(L.autoAdvance, locale)}
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-muted-foreground">{t(L.shortcuts, locale)}</legend>
        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5 text-sm">
          {shortcuts.map(([key, label]) => (
            <div key={key} className="contents">
              <dt>
                <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-xs">{key}</kbd>
              </dt>
              <dd className="text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </fieldset>

      <fieldset className="rounded-xl border border-destructive/30 p-3">
        <legend className="px-1 text-xs font-medium text-destructive">{t(L.danger, locale)}</legend>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            if (!confirmReset) return setConfirmReset(true);
            store.resetProgress();
            onDone();
          }}
        >
          {t(confirmReset ? L.resetConfirm : L.resetAll, locale)}
        </Button>
      </fieldset>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onDone}>
          {t(L.cancel, locale)}
        </Button>
        <Button type="submit">{t(L.save, locale)}</Button>
      </DialogFooter>
    </form>
  );
}
