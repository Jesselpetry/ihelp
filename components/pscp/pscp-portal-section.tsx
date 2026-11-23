"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  BrainCircuit,
  Code2,
  ArrowRight,
} from "lucide-react";
import { TopicHeader, SURFACE } from "@/components/course-hub-shared";
import { Badge } from "@/components/ui/badge";
import { useLocale, t, type LText } from "@/lib/i18n";
import { PgIjudgeModal } from "./pg-ijudge-modal";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  sectionTitle: {
    th: "คลังโจทย์และเครื่องมือโปรแกรมมิ่ง",
    en: "Programming Tools & Workspace",
  },
  sectionDesc: {
    th: "ศูนย์รวมเครื่องมือเขียนโค้ด ตะลุยโจทย์ iJudge โจทย์แนะนำเตรียมสอบ และส่วนขยาย VS Code สำหรับวิชา PSCP",
    en: "Coding workspace, iJudge problem archive, recommended exam prep, and VS Code extension for PSCP",
  },
  badgeCount: {
    th: "3 เครื่องมือหลัก",
    en: "3 Core Tools",
  },
  // Card 1: Workspace
  c1Title: {
    th: "คลังโจทย์และพื้นที่เขียนโค้ด",
    en: "Problems & Coding Workspace",
  },
  c1Desc: {
    th: "คลังโจทย์ iJudge 100+ ข้อ พร้อมตัวรันโค้ด Python ในเบราว์เซอร์ ทดสอบเทสเคส และตัวช่วยสร้าง submission.md",
    en: "100+ iJudge Python problems with embedded CodeMirror editor, test runner, and submission helper",
  },
  c1Badge: { th: "iJudge OJ", en: "iJudge OJ" },
  c1Action: { th: "เข้าสู่คลังโจทย์", en: "Open Workspace" },

  // Card 2: Recommended
  c2Title: {
    th: "14 โจทย์แนะนำเตรียมสอบ",
    en: "14 Recommended Problems",
  },
  c2Desc: {
    th: "ตะลุยโจทย์แนวข้อสอบจริง 14 ข้อ คัดสรรโดยรุ่นพี่ พร้อมเฉลย เทคนิค Python ทีละสเต็ป และตรวจเทสเคสอัตโนมัติ",
    en: "14 curated exam problems with step-by-step Python techniques, solutions, and automated test grader",
  },
  c2Badge: { th: "Exam Prep", en: "Exam Prep" },
  c2Action: { th: "ดูโจทย์แนะนำ", en: "View Recommended" },

  // Card 3: PG IJUDGE
  c3Title: {
    th: "PG IJUDGE Pro Extension",
    en: "PG IJUDGE Pro Extension",
  },
  c3Desc: {
    th: "ส่วนขยาย VS Code ส่งโค้ดตรงเข้า iJudge จากเอดิเตอร์ รันตัวอย่างในเครื่อง ตรวจสอบ Pass/Fail ได้ทันที ไม่ต้องสลับหน้าต่าง",
    en: "Submit code straight to iJudge from VS Code, run samples locally, and inspect verdicts in-editor",
  },
  c3Badge: { th: "VS Code Tool", en: "VS Code Tool" },
  c3Action: { th: "ดูวิธีติดตั้ง & ใช้งาน", en: "Setup Guide" },
};

export function PscpPortalSection({ className }: { className?: string }) {
  const { locale } = useLocale();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  return (
    <section id="pscp-portal" className={cn("space-y-3 scroll-mt-24", className)}>
      <TopicHeader
        id="pscp-portal-header"
        title={t(L.sectionTitle, locale)}
        description={t(L.sectionDesc, locale)}
        aside={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Terminal className="size-3.5" />
            {t(L.badgeCount, locale)}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* ── Card 1: Workspace & Problem Registry ── */}
        <Link
          href="/pscp"
          className={cn(
            SURFACE,
            "group relative flex flex-col justify-between p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md border border-border/70 dark:border-white/10"
          )}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                <Terminal className="size-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 rounded-full">
                {t(L.c1Badge, locale)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {t(L.c1Title, locale)}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {t(L.c1Desc, locale)}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs font-semibold text-primary">
            <span>{t(L.c1Action, locale)}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* ── Card 2: 14 Recommended Problems ── */}
        <Link
          href="/recommended"
          className={cn(
            SURFACE,
            "group relative flex flex-col justify-between p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md border border-border/70 dark:border-white/10"
          )}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                <BrainCircuit className="size-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 rounded-full">
                {t(L.c2Badge, locale)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {t(L.c2Title, locale)}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {t(L.c2Desc, locale)}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs font-semibold text-primary">
            <span>{t(L.c2Action, locale)}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* ── Card 3: PG IJUDGE Extension Modal Trigger ── */}
        <button
          type="button"
          onClick={() => setIsProModalOpen(true)}
          className={cn(
            SURFACE,
            "group relative flex flex-col justify-between p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md border border-border/70 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                <Code2 className="size-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 rounded-full">
                {t(L.c3Badge, locale)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {t(L.c3Title, locale)}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {t(L.c3Desc, locale)}
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-xs font-semibold text-primary">
            <span>{t(L.c3Action, locale)}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </button>
      </div>

      {/* ── PG IJUDGE Extension Details Modal ── */}
      <PgIjudgeModal open={isProModalOpen} onOpenChange={setIsProModalOpen} />
    </section>
  );
}
