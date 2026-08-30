"use client";

import Link from "next/link";
import { ArrowRight, Code2, Hammer, Home } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  badge: { th: "กำลังจัดเตรียม", en: "In preparation" },
  title: { th: "คลังทรัพยากรกำลังจะมา", en: "The resource library is coming" },
  body: {
    th: "เรากำลังจัดหมวดหมู่สไลด์ ชีทสรุป และเอกสารประกอบการเรียนของทุกวิชาปี 1 ให้เรียบร้อยก่อนเปิดให้ใช้งาน อีกไม่นานเกินรอ",
    en: "We are sorting the slides, summary sheets, and course documents for every first-year subject before opening this up. It will not be long.",
  },
  meanwhile: { th: "ระหว่างนี้ลองดู", en: "In the meantime" },
  pscp: { th: "ห้องแลป PSCP", en: "PSCP lab" },
  home: { th: "รายวิชาทั้งหมด", en: "All courses" },
};

/**
 * Placeholder shown in place of the library while LIBRARY_COMING_SOON is set.
 *
 * A client component because the copy is bilingual and the locale lives in a
 * context - rendering on the server would pin this page to Thai regardless of
 * the language toggle.
 */
export function LibraryComingSoon() {
  const { locale } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Hammer className="size-7" />
      </div>

      <Badge
        variant="outline"
        className="rounded-full border-primary/30 bg-primary/5 text-primary"
      >
        {t(L.badge, locale)}
      </Badge>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-balance sm:text-2xl">
          {t(L.title, locale)}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {t(L.body, locale)}
        </p>
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t(L.meanwhile, locale)}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/pscp">
            <Code2 />
            {t(L.pscp, locale)}
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home />
            {t(L.home, locale)}
          </Link>
        </Button>
      </div>
    </main>
  );
}
