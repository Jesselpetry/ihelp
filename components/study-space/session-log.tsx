"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUBJECTS, SUBJECT_ORDER } from "@/lib/study-space/subjects";
import { formatDay } from "@/lib/study-space/dates";
import { formatMinutes } from "@/lib/study-space/progress";
import type { SubjectCode } from "@/lib/study-space/types";
import { useStudySpace } from "./context";
import { SubjectDot, SubjectTag } from "./primitives";
import { fill, L } from "./strings";

/**
 * The selected day's time entries, newest first, with a form for time read
 * away from the clock. Removing an entry takes its minutes back off the day.
 */
export function SessionLog({ date, defaultSubject }: { date: string; defaultSubject: SubjectCode }) {
  const { locale } = useLocale();
  const { data, store } = useStudySpace();
  const [adding, setAdding] = useState(false);
  const [subject, setSubject] = useState<SubjectCode>(defaultSubject);
  const [minutes, setMinutes] = useState("30");
  const logs = data.sessionLogs.filter((l) => l.date === date);
  const f = formatDay(date, locale);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = Math.round(Number(minutes));
    if (!Number.isFinite(m) || m < 1) return;
    store.logSession(date, subject, Math.min(600, m), "manual");
    setAdding(false);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{fill(t(L.sessionsFor, locale), { d: `${f.day} ${f.month}` })}</h3>
        {!adding && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus />
            {t(L.addManual, locale)}
          </Button>
        )}
      </div>

      {adding && (
        <form onSubmit={submit} className="mb-3 space-y-3 rounded-xl border bg-muted/40 p-3">
          <div role="group" aria-label={t(L.courseLabel, locale)} className="grid grid-cols-4 gap-1">
            {SUBJECT_ORDER.map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={subject === code}
                onClick={() => setSubject(code)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border px-1 py-1.5 text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  subject === code ? "border-primary bg-card" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <SubjectDot code={code} />
                {SUBJECTS[code].shortName}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={600}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="h-8 w-24 bg-card tabular-nums"
              aria-label={t(L.minutes, locale)}
              autoFocus
            />
            <span className="text-sm text-muted-foreground">{t(L.minutes, locale)}</span>
            <div className="ml-auto flex gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>
                {t(L.cancel, locale)}
              </Button>
              <Button type="submit" size="sm">
                {t(L.add, locale)}
              </Button>
            </div>
          </div>
        </form>
      )}

      {logs.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {t(L.noSessions, locale)}
        </p>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {logs.map((log) => (
            <li key={log.id} className="group flex items-center gap-3 px-3 py-2 text-sm">
              <SubjectTag code={log.subjectCode} className="w-16 shrink-0" />
              <span className="tabular-nums">{formatMinutes(log.durationMinutes, locale)}</span>
              {log.source === "manual" && <span className="text-xs text-muted-foreground">{t(L.manual, locale)}</span>}
              <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                {new Date(log.timestamp).toLocaleTimeString(locale === "th" ? "th-TH" : "en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Bangkok",
                })}
              </span>
              <button
                type="button"
                onClick={() => store.removeSession(log.id)}
                aria-label={t(L.remove, locale)}
                title={t(L.remove, locale)}
                className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
