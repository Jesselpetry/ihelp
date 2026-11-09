"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  Eye,
  Flame,
  RotateCcw,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopicHeader, SURFACE } from "@/components/course-hub-shared";
import { CourseWatermark } from "@/components/course-watermark";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";
import { PreviewModal, type Preview } from "@/components/preview-modal";
import { TechniqueQuiz } from "@/components/technique-quiz";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import {
  MFIT_FINAL_MOCK_EXAM,
  MFIT_FINAL_PILLARS,
  MFIT_FINAL_MOCK_QUIZ_ID,
} from "@/lib/quiz/mfit-final-mock-exam";
import type { FenceWarRoomConfig } from "@/lib/docs/fences";

interface PastPaperItem {
  id: string;
  year: string;
  title: LText;
  description: LText;
  fileName: string;
  pages: number;
  points: string;
  itemCount: string;
  badge: LText;
  isSolution?: boolean;
}

const PAST_PAPERS: PastPaperItem[] = [
  {
    id: "mfit-final-pastpaper-2561",
    year: "2561",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2561 (ฉบับจริง 50 คะแนน)",
      en: "Final Exam Paper 2018 / 2561 (50 Points)",
    },
    description: {
      th: "ข้อสอบปลายภาคฉบับทางการชุดล่าสุดในคลัง แสดงโจทย์ข้อเขียนแสดงวิธีทำเต็มเล่ม 22 หน้า รวม 26 ข้อคำนวณ",
      en: "Official final exam paper from 2018, 22 constructed-response pages covering 26 calculation problems.",
    },
    fileName: "mfit-final-final-mathit-2561.pdf",
    pages: 22,
    points: "50 คะแนน",
    itemCount: "26 ข้อ",
    badge: { th: "ฉบับจริงสมบูรณ์", en: "Full Official" },
  },
  {
    id: "mfit-final-pastpaper-2560",
    year: "2560",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2560 (ฉบับจริง 40 คะแนน)",
      en: "Final Exam Paper 2017 / 2560 (40 Points)",
    },
    description: {
      th: "ข้อสอบจริงปี 2560 แสดงโจทย์ละเอียดพร้อมพื้นที่ว่างสำหรับเขียนแสดงวิธีทำ รวม 22 ข้อ",
      en: "Official 2017 paper with fully laid-out calculation items and working space, 22 problems.",
    },
    fileName: "mfit-final-2560.pdf",
    pages: 26,
    points: "40 คะแนน",
    itemCount: "22 ข้อ",
    badge: { th: "ฉบับจริงสมบูรณ์", en: "Full Official" },
  },
  {
    id: "mfit-final-pastpaper-2559",
    year: "2559",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2559 (ฉบับจริง 40 คะแนน)",
      en: "Final Exam Paper 2016 / 2559 (40 Points)",
    },
    description: {
      th: "ใบข้อสอบจริงปี 2559 รวม 25 ข้อคำนวณ ครอบคลุมทั้งลิมิต อนุพันธ์ ปริพันธ์ และพื้นที่ปริมาตร",
      en: "Official 2016 paper containing 25 calculus problems covering limits, derivatives and integrals.",
    },
    fileName: "mfit-final-final-mathit-2559.pdf",
    pages: 1,
    points: "40 คะแนน",
    itemCount: "25 ข้อ",
    badge: { th: "ข้อสอบจริง", en: "Official" },
  },
  {
    id: "mfit-final-notelub",
    year: "เฉลย",
    title: {
      th: "บันทึกเฉลยข้อสอบปลายภาค NoteLub (ลายมือเฉลยวิธีทำละเอียด)",
      en: "NoteLub Final Worked Solution Key (Handwritten)",
    },
    description: {
      th: "บันทึกเฉลยแสดงวิธีทำทีละบรรทัด พร้อมวิเคราะห์จุดที่อาจารย์ให้คะแนนและจุดที่ห้ามผิด",
      en: "Step-by-step handwritten working solution key showing grading breakdown.",
    },
    fileName: "mfit-final-notelub.pdf",
    pages: 3,
    points: "เฉลยวิธีทำ",
    itemCount: "เฉลยละเอียด",
    badge: { th: "เฉลยลายมือ", en: "Worked Key" },
    isSolution: true,
  },
  {
    id: "mfit-final-vault-cdn",
    year: "คลังกลาง",
    title: {
      th: "รวมชุดข้อสอบเก่าและแนวโจทย์ปลายภาค ฉบับคลังกลาง (19 หน้า)",
      en: "Calculus Final Exam Archive Vault Collection (19 Pages)",
    },
    description: {
      th: "เอกสารรวบรวมโจทย์ข้อสอบเก่าและแบบฝึกหัดทบทวนปลายภาคแคลคูลัส 19 หน้า สำหรับฝึกจับเวลา",
      en: "19-page collection of past final problems and calculus review drills.",
    },
    fileName: "mfit-final-cdn-fbsbx-com.pdf",
    pages: 19,
    points: "รวมทุกปี",
    itemCount: "หลายชุด",
    badge: { th: "คลังกลาง", en: "Archive Vault" },
  },
  {
    id: "mfit-final-pastpaper-2559-copy",
    year: "2559",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2559 (ฉบับสำเนา)",
      en: "Final Exam Paper 2016 / 2559 (Copy)",
    },
    description: {
      th: "สำเนาแผ่นข้อสอบจริงปี 2559 ครบทุกพาร์ต",
      en: "Copy of the 2016 final examination question sheet.",
    },
    fileName: "mfit-final-copy-of-final-mathit-2559.pdf",
    pages: 1,
    points: "40 คะแนน",
    itemCount: "25 ข้อ",
    badge: { th: "สำเนาข้อสอบ", en: "Paper Copy" },
  },
  {
    id: "mfit-final-vault-unidentified",
    year: "ชุดฝึกซ้อม",
    title: {
      th: "ชุดข้อสอบรวมปลายภาค MFIT (ชุดคละหัวข้อ 6 หน้า)",
      en: "Final Exam Mixed Problem Set (6 Pages)",
    },
    description: {
      th: "ชุดโจทย์คละหัวข้อแคลคูลัสปลายภาค 6 หน้า สำหรับฝึกประยุกต์และทดสอบความเร็ว",
      en: "Six-page mixed calculus problem set for speed testing and technique review.",
    },
    fileName: "mfit-final-unidentified.pdf",
    pages: 6,
    points: "ชุดฝึกซ้อม",
    itemCount: "คละหัวข้อ",
    badge: { th: "ชุดฝึกซ้อม", en: "Drill Set" },
  },
];

interface FormulaSheetItem {
  id: string;
  title: LText;
  description: LText;
  fileName: string;
  pages: number;
  badge: LText;
  highlight?: boolean;
}

const FORMULA_SHEETS: FormulaSheetItem[] = [
  {
    id: "mfit-useful-info-2569",
    title: {
      th: "แผ่นสรุปข้อมูลและสูตรสำคัญ Calculus Useful Info (เทอม 1/2569)",
      en: "Calculus Useful Information Sheet (Semester 1/2569)",
    },
    description: {
      th: "เอกสารสรุปสูตรทางการของภาควิชาเทอมปัจจุบัน ระบุสูตรที่อนุญาตและขอบเขตในห้องสอบ",
      en: "Official departmental formula sheet for this semester's final exam.",
    },
    fileName: "mfit-ref-calculus-useful-info-2569.pdf",
    pages: 1,
    badge: { th: "ทางการ 1/2569", en: "Official 2569" },
    highlight: true,
  },
  {
    id: "mfit-holyshit-final-part1",
    title: {
      th: "ชีตสรุปเตรียมสอบแคลคูลัส Holy Shit Final Part 1",
      en: "Calculus Holy Shit Final Part 1 Cheatsheet",
    },
    description: {
      th: "สรุปสูตร เทคนิควิเคราะห์โจทย์ และตัวอย่างข้อสอบแคลคูลัสครึ่งหลัง (21 หน้า) จัดทำโดย แบงค์ ธรรมดล (IT24)",
      en: "Comprehensive calculus final review, shortcuts and worked walkthroughs (21 pages) by Tammadon Suksa (IT24).",
    },
    fileName: "mfit-sheet-holyshit-final-part1.pdf",
    pages: 21,
    badge: { th: "ชีตสรุป 21 หน้า", en: "21 Pages" },
    highlight: true,
  },
  {
    id: "mfit-final-recap-week08-13",
    title: {
      th: "ชีทติวเข้มและสรุปเนื้อหาทบทวนปลายภาค สัปดาห์ 8–13",
      en: "Final Exam Intensive Recap Weeks 08–13",
    },
    description: {
      th: "เอกสารติวทบทวนเนื้อหาและโจทย์สำคัญ สัปดาห์ที่ 8 ถึง 13 (ลิมิต อนุพันธ์ ปริพันธ์) รวม 19 หน้า",
      en: "19-page intensive review deck covering weeks 8 through 13.",
    },
    fileName: "mfit-sheet-final-recap-week08-13.pdf",
    pages: 19,
    badge: { th: "ติวเข้ม W08–13", en: "Recap W08-13" },
  },
  {
    id: "mfit-recap-calculus",
    title: {
      th: "ชีทสรุปสูตรแคลคูลัส อนุพันธ์ และปริพันธ์ (Diff & Int Recap)",
      en: "Calculus Differentiation & Integration Formula Recap",
    },
    description: {
      th: "แผ่นพับสรุปสูตรอนุพันธ์และปริพันธ์ทุกสูตร จัดหมวดหมู่อ่านง่าย 6 หน้า",
      en: "Six-page quick reference sheet for all differentiation and integration rules.",
    },
    fileName: "mfit-sheet-recap-calculus.pdf",
    pages: 6,
    badge: { th: "สูตรครบ 6 หน้า", en: "Formulas" },
  },
  {
    id: "mfit-cheat-sheet-2023",
    title: {
      th: "ชีทสรุปสูตรปลายภาค ฉบับปี 2023",
      en: "Final Exam Formula Sheet (2023 Edition)",
    },
    description: {
      th: "สรุปสูตรแคลคูลัสกระชับฉบับพกพา 1 หน้า",
      en: "Single-page ultra-compact calculus formula cheat sheet.",
    },
    fileName: "mfit-sheet-cheat-sheet-2023.pdf",
    pages: 1,
    badge: { th: "ฉบับปี 2023", en: "2023 Edition" },
  },
  {
    id: "mfit-cheat-sheet-2022",
    title: {
      th: "ชีทสรุปสูตรปลายภาค ฉบับปี 2022",
      en: "Final Exam Formula Sheet (2022 Edition)",
    },
    description: {
      th: "สรุปสูตรและข้อควรจำแคลคูลัส 3 หน้า",
      en: "Three-page reference guide and calculus reminders.",
    },
    fileName: "mfit-sheet-cheat-sheet-2022.pdf",
    pages: 3,
    badge: { th: "ฉบับปี 2022", en: "2022 Edition" },
  },
];

export function MfitWarRoomPortal({ config }: { config?: FenceWarRoomConfig } = {}) {
  void config;
  const { locale } = useLocale();
  const [selectedPillar, setSelectedPillar] = useState<number | "all">("all");
  const [quizStarted, setQuizStarted] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [remoteAssets, setRemoteAssets] = useState<SubjectAsset[]>([]);

  // Fetch signed asset URLs for MFIT
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/library/assets?course=MFIT", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ assets?: SubjectAsset[] }>;
      })
      .then((data) => {
        if (data?.assets && data.assets.length > 0) {
          setRemoteAssets(data.assets);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Filter questions by selected pillar
  const quizQuestions = useMemo(() => {
    if (selectedPillar === "all") return MFIT_FINAL_MOCK_EXAM;
    const chapterSet = new Set<number>();
    if (selectedPillar === 1) chapterSet.add(8);
    else if (selectedPillar === 2) { chapterSet.add(9); chapterSet.add(10); }
    else if (selectedPillar === 3) chapterSet.add(11);
    else if (selectedPillar === 4) { chapterSet.add(12); chapterSet.add(13); }
    else if (selectedPillar === 5) { chapterSet.add(14); chapterSet.add(15); }

    return MFIT_FINAL_MOCK_EXAM.filter((q) => q.chapter !== undefined && chapterSet.has(q.chapter));
  }, [selectedPillar]);

  function openPreviewForFile(fileName: string, title: LText, description?: LText) {
    const found = remoteAssets.find(
      (a) => a.fileName === fileName || a.url?.includes(fileName)
    );

    const fallbackAsset: SubjectAsset = {
      id: `mfit-${fileName}`,
      title,
      description: description || { th: "", en: "" },
      tags: ["MFIT", "Final", "Exam"],
      category: "exam",
      scope: "final",
      courseCode: "MFIT",
      fileType: "pdf",
      url: `/assets/it-kmitl/mfit/exams/${fileName}`,
      fileName,
    };

    setPreview({
      items: [found || fallbackAsset],
      index: 0,
    });
  }

  return (
    <div className="space-y-8 my-4">
      {/* ── Official Standard Course Banner ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/courses/06016401-Math-for-IT"
            className="text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
          >
            <ChevronLeft className="size-4" />
            <span>{locale === "th" ? "กลับสู่หน้าหลักวิชา Math for IT" : "Back to Math for IT Hub"}</span>
          </Link>
          <span className="rounded-full bg-red-500/10 border border-red-500/25 px-2.5 py-0.5 text-xs font-semibold text-red-500">
            {locale === "th" ? "จุดพักสอบปลายภาค" : "Final Exam Milestone"}
          </span>
        </div>

        <header
          style={{ background: IHELP_GRADIENT_CSS }}
          className="relative isolate flex min-h-28 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-4 text-white shadow-sm sm:min-h-36 sm:p-5"
        >
          <CourseWatermark code="MFIT" size="banner" />
          <div className="relative z-10 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/80">
              <span className="font-semibold text-white">MFIT</span>
              <span>·</span>
              <span>06016401</span>
              <span>·</span>
              <span>{locale === "th" ? "ขอบเขตปลายภาค (สัปดาห์ที่ 8–15)" : "Final Scope (Weeks 8–15)"}</span>
              <span>·</span>
              <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                {locale === "th" ? "35 คะแนนเต็ม" : "35 Marks"}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {locale === "th"
                ? "สอบปลายภาค — ศูนย์บัญชาการรบ MFIT (Final War Room)"
                : "Final Examination — MFIT War Room"}
            </h1>
            <p className="line-clamp-2 text-xs text-white/80 sm:text-sm">
              {locale === "th"
                ? "คลังข้อสอบเก่าฉบับจริงในระบบ · ข้อสอบจำลอง 25 ข้อ · ชีทสรุปสูตรทางการ · คู่มือยุทธศาสตร์พิชิต 35 คะแนน"
                : "Official past exam vault, 25-item mock exam, formula sheets & 35-point strategic study guide"}
            </p>
          </div>
        </header>
      </div>

      {/* ── Section 1: ข้อสอบจำลองปลายภาค (Mock Exam Simulator) ─────────── */}
      <section className="space-y-3" id="mock-exam">
        <TopicHeader
          id="mock-exam-header"
          title={locale === "th" ? "ข้อสอบจำลองปลายภาค 25 ข้อ (Final Mock Exam)" : "Final Mock Exam Simulator"}
          aside={
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "th" ? "25 ข้อ · 5 เสาหลัก" : "25 Items · 5 Pillars"}
            </span>
          }
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => setSelectedPillar("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
              selectedPillar === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            🚀 {locale === "th" ? "ข้อสอบจำลองเต็มชุด (25 ข้อ)" : "Full Mock Exam (25 Items)"}
          </button>
          {MFIT_FINAL_PILLARS.map((p) => {
            const active = selectedPillar === p.pillar;
            return (
              <button
                key={p.pillar}
                type="button"
                onClick={() => setSelectedPillar(p.pillar)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t(p.name, locale)} ({p.questionCount} {locale === "th" ? "ข้อ" : "items"})
              </button>
            );
          })}
        </div>

        {/* Quiz launch card or runner */}
        {!quizStarted ? (
          <div className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${SURFACE}`}>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <Flame className="size-4" />
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  {selectedPillar === "all"
                    ? (locale === "th" ? "ชุดข้อสอบจำลองเต็มรูปแบบ (25 ข้อ · ครบทุก 5 เสาหลัก)" : "Full Final Mock Exam (25 Items)")
                    : t(MFIT_FINAL_PILLARS.find((p) => p.pillar === selectedPillar)?.name || { th: "", en: "" }, locale)}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {locale === "th"
                  ? "จำลองจากสถิติข้อสอบจริง 2559–2561 (22–26 ข้อ) ข้อเขียน 100% คิดมือล้วน พร้อมเฉลยละเอียดและวิเคราะห์วิธีทำทีละขั้น"
                  : "Engineered from authentic past final exams (2016-2018), 100% manual calculation with full step-by-step working."}
              </p>
            </div>

            <Button
              onClick={() => setQuizStarted(true)}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white font-bold shrink-0 self-end sm:self-auto rounded-xl"
            >
              <Target className="size-4" />
              <span>{locale === "th" ? `เริ่มทำข้อสอบ (${quizQuestions.length} ข้อ)` : `Start Quiz (${quizQuestions.length})`}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuizStarted(false)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                <span>{locale === "th" ? "← ย้อนกลับ / เปลี่ยนโหมด" : "← Back / Change Topic"}</span>
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                {selectedPillar === "all"
                  ? (locale === "th" ? "ข้อสอบจำลองเต็มชุด (25 ข้อ)" : "Full Mock Exam (25 items)")
                  : t(MFIT_FINAL_PILLARS.find((p) => p.pillar === selectedPillar)?.name || { th: "", en: "" }, locale)}
              </span>
            </div>

            <article className={`p-4 sm:p-6 overflow-hidden ${SURFACE}`}>
              <TechniqueQuiz
                problemId={MFIT_FINAL_MOCK_QUIZ_ID}
                problemName={
                  selectedPillar === "all"
                    ? "MFIT Final Mock Exam (Full 25 Items)"
                    : `MFIT Final Drill - Pillar ${selectedPillar}`
                }
                questions={quizQuestions}
              />
            </article>
          </div>
        )}
      </section>

      {/* ── Section 2: คลังข้อสอบเก่าฉบับจริง (Past Papers Vault) ────────── */}
      <section className="space-y-3 pt-4" id="past-papers">
        <TopicHeader
          id="past-papers-header"
          title={locale === "th" ? "คลังข้อสอบเก่าฉบับจริง (Past Papers Vault)" : "Authentic Past Papers Vault"}
          aside={
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "th" ? "7 ชุดในคลัง" : "7 Papers in Vault"}
            </span>
          }
        />

        <div className="flex flex-col gap-2.5">
          {PAST_PAPERS.map((paper) => {
            const remoteAsset = remoteAssets.find(
              (a) => a.fileName === paper.fileName || a.url?.includes(paper.fileName)
            );
            const downloadUrl = remoteAsset?.url || `/assets/it-kmitl/mfit/exams/${paper.fileName}`;

            return (
              <div
                key={paper.id}
                className="group rounded-xl border border-border/50 bg-neutral-50/70 dark:bg-neutral-900/40 p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-border hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-all"
              >
                <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-1.5 sm:mt-0 group-hover:bg-primary transition-colors" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                        {t(paper.title, locale)}
                      </h4>
                      <Badge variant={paper.isSolution ? "default" : "outline"} className="text-[10px] px-1.5 py-0">
                        {t(paper.badge, locale)}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {paper.pages} {locale === "th" ? "หน้า" : "pages"} · {paper.points}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                      {t(paper.description, locale)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => openPreviewForFile(paper.fileName, paper.title, paper.description)}
                    className="gap-1.5 text-xs rounded-xl font-medium"
                  >
                    <Eye className="size-3.5" />
                    <span>{locale === "th" ? "เปิดดูตัวอย่าง" : "Preview"}</span>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs rounded-xl"
                  >
                    <a href={downloadUrl} download={paper.fileName} target="_blank" rel="noopener noreferrer">
                      <Download className="size-3.5" />
                      <span>{locale === "th" ? "ดาวน์โหลด" : "Download"}</span>
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: ชีทสรุปสูตร & เอกสารทางการ (Official Formula Sheets) ─ */}
      <section className="space-y-3 pt-4" id="formula-sheets">
        <TopicHeader
          id="formula-sheets-header"
          title={locale === "th" ? "ชีทสรุปสูตร & เอกสารทางการ (Official Formula Sheets)" : "Official Formula Sheets"}
          aside={
            <span className="rounded-full bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              {locale === "th" ? "6 ฉบับสรุป" : "6 Cheatsheets"}
            </span>
          }
        />

        <div className="flex flex-col gap-2.5">
          {FORMULA_SHEETS.map((sheet) => {
            const remoteAsset = remoteAssets.find(
              (a) => a.fileName === sheet.fileName || a.url?.includes(sheet.fileName)
            );
            const downloadUrl = remoteAsset?.url || `/assets/it-kmitl/mfit/sheets/${sheet.fileName}`;

            return (
              <div
                key={sheet.id}
                className={`group rounded-xl border p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  sheet.highlight
                    ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50"
                    : "border-border/50 bg-neutral-50/70 dark:bg-neutral-900/40 hover:border-border hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-1.5 sm:mt-0 group-hover:bg-yellow-500 transition-colors" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                        {t(sheet.title, locale)}
                      </h4>
                      <Badge variant={sheet.highlight ? "default" : "outline"} className="text-[10px] px-1.5 py-0">
                        {t(sheet.badge, locale)}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {sheet.pages} {locale === "th" ? "หน้า" : "pages"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                      {t(sheet.description, locale)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => openPreviewForFile(sheet.fileName, sheet.title, sheet.description)}
                    className="gap-1.5 text-xs rounded-xl font-medium"
                  >
                    <Eye className="size-3.5" />
                    <span>{locale === "th" ? "เปิดดูตัวอย่าง" : "Preview"}</span>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs rounded-xl"
                  >
                    <a href={downloadUrl} download={sheet.fileName} target="_blank" rel="noopener noreferrer">
                      <Download className="size-3.5" />
                      <span>{locale === "th" ? "ดาวน์โหลด" : "Download"}</span>
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Separator for Deep Study Guide ────────────────────── */}
      <section className="pt-6" id="study-guide">
        <TopicHeader
          id="study-guide-header"
          title={locale === "th" ? "ยุทธศาสตร์และคู่มือสรุปวิธีทำโจทย์แคลคูลัส (Deep Study Guide)" : "Deep Study Guide & Strategy"}
          aside={
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "th" ? "แคลคูลัส Week 08–15 · 35 คะแนน" : "Calculus W08-15 · 35 Pts"}
            </span>
          }
        />
      </section>

      {/* ── Modal Viewer ─────────────────────────────────────────────────── */}
      {preview && (
        <PreviewModal
          preview={preview}
          courseCode="MFIT"
          onIndexChange={(index) => setPreview({ ...preview, index })}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
