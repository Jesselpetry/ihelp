"use client";

import { ExternalLink, Megaphone, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SHORTCUTS } from "@/lib/shortcuts";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  heading: { th: "ทางลัดประจำสัปดาห์", en: "This week's shortcuts" },
};

export function Shortcuts() {
  const { locale } = useLocale();
  if (SHORTCUTS.length === 0) return null;
  return (
    <section className="p-5 flex flex-col">
      <h2 className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-3">
        <Megaphone className="size-3.5" />
        {t(L.heading, locale)}
      </h2>
      <div className="grid auto-rows-fr gap-3 flex-1">
        {SHORTCUTS.map((s) => (
          <a
            key={s.href + s.title.en}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-xl border bg-background/50 p-3.5 transition-colors hover:border-primary/50 hover:bg-primary/[0.03]"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                {t(s.title, locale)}
              </span>
              <ExternalLink className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary mt-0.5" />
            </span>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed flex-1">
              {t(s.description, locale)}
            </p>
            {s.date && (
              <span className="mt-2">
                <Badge variant="outline" className="text-muted-foreground text-[10px]">
                  <CalendarDays className="size-3" />
                  {s.date}
                </Badge>
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
