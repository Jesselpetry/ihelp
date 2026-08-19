"use client";

import Link from "next/link";
import { GraduationCap, FlaskConical } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  title: { th: "EN-KMITL · เลือกวิชา", en: "EN-KMITL · Select Course" },
  subtitle: {
    th: "เลือกวิชาที่ต้องการเตรียมสอบ",
    en: "Choose the subject you want to study for",
  },
  comproTitle: { th: "Computer Programming", en: "Computer Programming" },
  comproCode: { th: "01006012 — เตรียมสอบกลางภาค", en: "01006012 — Midterm Prep" },
  comproDesc: {
    th: "สรุปเนื้อหา บทที่ 1-5 + ภาคผนวก · แบบทดสอบ 60+ ข้อ · คลังทรัพยากร",
    en: "Summary Ch.1-5 + Appendix · 60+ quiz questions · Resource library",
  },
  chemTitle: { th: "เคมีทั่วไป (Chemistry)", en: "General Chemistry" },
  chemCode: { th: "เตรียมสอบกลางภาค · บทที่ 1-5", en: "Midterm Prep · Ch.1-5" },
  chemDesc: {
    th: "สรุปเนื้อหา อะตอม/พันธะ/สโตอิชิโอ/สารละลาย/สมดุล · แบบทดสอบ 20 ข้อ · คลังทรัพยากร",
    en: "Summary: atoms, bonding, stoichiometry, solutions, equilibrium · 20-question quiz · Resource library",
  },
};

export function EnKmitlSelectionHub() {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-2xl px-3 sm:px-6 py-10 sm:py-16 w-full">
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(L.title, locale)}</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">{t(L.subtitle, locale)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ComPro card */}
        <Link
          href="/en-kmitl/compro"
          className="group flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide mb-1">
              {t(L.comproCode, locale)}
            </p>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
              {t(L.comproTitle, locale)}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {t(L.comproDesc, locale)}
            </p>
          </div>
        </Link>

        {/* Chem card */}
        <Link
          href="/en-kmitl/chem"
          className="group flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <FlaskConical className="size-6" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide mb-1">
              {t(L.chemCode, locale)}
            </p>
            <h2 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
              {t(L.chemTitle, locale)}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {t(L.chemDesc, locale)}
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
