"use client";

import Link from "next/link";
import { BookOpen, FileText, NotebookPen, Sparkles } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";

// The PSCP-specific tracks that used to sit in the global navbar. They belong
// to this subject, not to the site, so they live on the PSCP portal instead.
const MODULES: { href: string; icon: typeof BookOpen; title: LText; desc: LText }[] = [
  {
    href: "/recommended",
    icon: Sparkles,
    title: { th: "โจทย์แนะนำ", en: "Recommended Problems" },
    desc: {
      th: "10 โจทย์แนะนำ พร้อมคำอธิบายโจทย์ เทคนิค Python เทสเคส และตัวตรวจโค้ดในเบราว์เซอร์",
      en: "The 10 recommended problems with explanations, Python techniques, test cases, and an in-browser grader",
    },
  },
  {
    href: "/library",
    icon: BookOpen,
    title: { th: "ห้องสมุด AI Guidelines", en: "AI Guidelines Library" },
    desc: {
      th: "เอกสารนโยบายการใช้ AI ของรายวิชา อ่านแบบหนังสือทีละบท",
      en: "The course AI-usage policy documents, readable like a book",
    },
  },
  {
    href: "/make/submission",
    icon: FileText,
    title: { th: "สร้าง submission.md", en: "Make submission.md" },
    desc: {
      th: "ตัวช่วยกรอก Learning Log ทีละขั้น แล้วดาวน์โหลดไฟล์ไปส่ง",
      en: "Step-by-step Learning Log builder, then download the file",
    },
  },
  {
    href: "/make/reflection",
    icon: NotebookPen,
    title: { th: "สร้าง ai_reflection.md", en: "Make ai_reflection.md" },
    desc: {
      th: "บันทึกการใช้ AI ตามเทมเพลตทางการของรายวิชา",
      en: "Record your AI usage against the official course template",
    },
  },
];

export function PscpModules() {
  const { locale } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-8 w-full">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-3xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <Icon className="size-6 text-primary" />
            <h2 className="mt-3 text-base font-semibold transition-colors group-hover:text-primary">
              {t(title, locale)}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {t(desc, locale)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
