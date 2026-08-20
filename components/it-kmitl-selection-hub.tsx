"use client";

import Link from "next/link";
import { CircuitBoard } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  title: { th: "IT-KMITL · เลือกวิชา", en: "IT-KMITL · Select Course" },
  subtitle: {
    th: "เลือกวิชาที่ต้องการเตรียมสอบ",
    en: "Choose the subject you want to study for",
  },
  icsTitle: { th: "ICS / Digital Logic", en: "ICS / Digital Logic" },
  icsCode: { th: "เตรียมสอบกลางภาค · บทที่ 1-6", en: "Midterm Prep · Ch.1-6" },
  icsDesc: {
    th: "สรุปเนื้อหา เลขฐาน/บูลีน/K-Map/Timing/ออกแบบวงจร/MUX · แบบทดสอบ 50 ข้อ · ข้อสอบชุดฝึกพร้อมเฉลย · คลังทรัพยากร",
    en: "Summary: number systems, Boolean algebra, K-maps, timing, circuit design, MUX · 50-question quiz · practice exam with answer key · resource library",
  },
};

export function ItKmitlSelectionHub() {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-2xl px-3 sm:px-6 py-10 sm:py-16 w-full">
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(L.title, locale)}</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">{t(L.subtitle, locale)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ICS card */}
        <Link
          href="/it-kmitl/ics"
          className="group flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <CircuitBoard className="size-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide mb-1">
              {t(L.icsCode, locale)}
            </p>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
              {t(L.icsTitle, locale)}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {t(L.icsDesc, locale)}
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
