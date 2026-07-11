"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LibraryDoc } from "@/lib/library";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  backToList: { th: "กลับหน้ารายการโจทย์", en: "Back to problems" },
  title: { th: "ห้องสมุดรายวิชา", en: "Course Library" },
  subtitle: {
    th: "เอกสาร AI Guidelines ของรายวิชา PSCP ทั้งหมด อ่านแบบหนังสือทีละบท",
    en: "All PSCP AI-Guidelines documents, readable like a book, one chapter at a time.",
  },
  chapters: { th: "บท", en: "chapters" },
  thOnly: { th: "TH", en: "TH" },
  enOnly: { th: "EN", en: "EN" },
};

export function LibraryToc({ docs }: { docs: LibraryDoc[] }) {
  const { locale } = useLocale();

  // group by section, preserving book order
  const sections: { title: LText; docs: LibraryDoc[] }[] = [];
  for (const doc of docs) {
    const last = sections[sections.length - 1];
    if (last && last.title.en === doc.section.title.en) last.docs.push(doc);
    else sections.push({ title: doc.section.title, docs: [doc] });
  }

  let chapter = 0;
  return (
    <main className="max-w-3xl mx-auto px-6 py-8 w-full">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {t(L.backToList, locale)}
        </Link>
        <h1 className="flex items-center gap-3 text-3xl font-bold mt-3">
          <BookOpen className="size-8 text-primary" />
          {t(L.title, locale)}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{t(L.subtitle, locale)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {docs.length} {t(L.chapters, locale)}
        </p>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm divide-y overflow-hidden">
        {sections.map((section) => (
          <div key={section.title.en} className="px-6 py-5">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              {t(section.title, locale)}
            </h2>
            <ol className="space-y-1">
              {section.docs.map((doc) => {
                chapter += 1;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`/library/${doc.slug}`}
                      className="group flex items-baseline gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors hover:bg-primary/[0.04]"
                    >
                      <span className="font-mono text-sm text-muted-foreground tabular-nums w-6 shrink-0 text-right">
                        {chapter}
                      </span>
                      <span className="font-medium underline-offset-4 group-hover:underline group-hover:text-primary">
                        {doc.title}
                      </span>
                      <span className="ml-auto flex gap-1 shrink-0">
                        {doc.hasTh && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {t(L.thOnly, locale)}
                          </Badge>
                        )}
                        {doc.hasEn && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {t(L.enOnly, locale)}
                          </Badge>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </main>
  );
}
