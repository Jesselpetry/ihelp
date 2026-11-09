"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileCheck2,
  FileText,
  Flame,
  RotateCcw,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ExamWarRoomBanner,
  ResourceItemCard,
  TopicHeader,
  SURFACE,
} from "@/components/course-hub-shared";
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
  title: LText;
  fileName: string;
  pages: number;
  isSolution?: boolean;
}

const PAST_PAPERS: PastPaperItem[] = [
  {
    id: "mfit-final-pastpaper-2561",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2561",
      en: "Final Exam Paper 2018 / 2561",
    },
    fileName: "mfit-final-final-mathit-2561.pdf",
    pages: 22,
  },
  {
    id: "mfit-final-pastpaper-2560",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2560",
      en: "Final Exam Paper 2017 / 2560",
    },
    fileName: "mfit-final-2560.pdf",
    pages: 26,
  },
  {
    id: "mfit-final-pastpaper-2559",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2559",
      en: "Final Exam Paper 2016 / 2559",
    },
    fileName: "mfit-final-final-mathit-2559.pdf",
    pages: 1,
  },
  {
    id: "mfit-final-pastpaper-2559-copy",
    title: {
      th: "ข้อสอบปลายภาค MFIT ปีการศึกษา 2559 (ฉบับสำเนา)",
      en: "Final Exam Paper 2016 / 2559 (Copy)",
    },
    fileName: "mfit-final-copy-of-final-mathit-2559.pdf",
    pages: 1,
  },
  {
    id: "mfit-final-notelub",
    title: {
      th: "บันทึกเฉลยข้อสอบปลายภาค NoteLub",
      en: "NoteLub Final Worked Solution Key",
    },
    fileName: "mfit-final-notelub.pdf",
    pages: 3,
    isSolution: true,
  },
  {
    id: "mfit-final-vault-unidentified",
    title: {
      th: "ชุดข้อสอบรวมปลายภาค MFIT (ชุดฝึกซ้อม)",
      en: "Final Exam Mixed Drill Set",
    },
    fileName: "mfit-final-unidentified.pdf",
    pages: 6,
  },
  {
    id: "mfit-final-vault-cdn",
    title: {
      th: "รวมชุดข้อสอบเก่าและแนวโจทย์ปลายภาค (คลังกลาง)",
      en: "Calculus Final Exam Archive Vault Collection",
    },
    fileName: "mfit-final-cdn-fbsbx-com.pdf",
    pages: 19,
  },
];

interface FormulaSheetItem {
  id: string;
  title: LText;
  fileName: string;
  pages: number;
  highlight?: boolean;
}

const FORMULA_SHEETS: FormulaSheetItem[] = [
  {
    id: "mfit-useful-info-2569",
    title: {
      th: "แผ่นสรุปข้อมูลและสูตรสำคัญ Useful Information (1/2569)",
      en: "Calculus Useful Information Sheet (1/2569)",
    },
    fileName: "mfit-ref-calculus-useful-info-2569.pdf",
    pages: 1,
    highlight: true,
  },
  {
    id: "mfit-cheat-sheet-2023",
    title: {
      th: "ชีทสรุปสูตรปลายภาค (ฉบับปี 2023)",
      en: "Final Exam Formula Sheet (2023)",
    },
    fileName: "mfit-sheet-cheat-sheet-2023.pdf",
    pages: 1,
  },
  {
    id: "mfit-cheat-sheet-2022",
    title: {
      th: "ชีทสรุปสูตรปลายภาค (ฉบับปี 2022)",
      en: "Final Exam Formula Sheet (2022)",
    },
    fileName: "mfit-sheet-cheat-sheet-2022.pdf",
    pages: 3,
  },
  {
    id: "mfit-recap-calculus",
    title: {
      th: "ชีทสรุปสูตรแคลคูลัส อนุพันธ์ และปริพันธ์",
      en: "Calculus Differentiation & Integration Recap",
    },
    fileName: "mfit-sheet-recap-calculus.pdf",
    pages: 6,
  },
  {
    id: "mfit-final-recap-week08-13",
    title: {
      th: "ชีทติวเข้มและสรุปเนื้อหาทบทวนปลายภาค สัปดาห์ที่ 8–13",
      en: "Final Exam Intensive Recap Weeks 08–13",
    },
    fileName: "mfit-sheet-final-recap-week08-13.pdf",
    pages: 19,
  },
  {
    id: "mfit-holyshit-final-part1",
    title: {
      th: "ชีตสรุปเตรียมสอบแคลคูลัส Holy Shit Final Part 1",
      en: "Calculus Holy Shit Final Part 1 Cheatsheet",
    },
    fileName: "mfit-sheet-holyshit-final-part1.pdf",
    pages: 21,
    highlight: true,
  },
];

export function MfitWarRoomPortal({
  config,
}: { config?: FenceWarRoomConfig } = {}) {
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
    else if (selectedPillar === 2) {
      chapterSet.add(9);
      chapterSet.add(10);
    } else if (selectedPillar === 3) chapterSet.add(11);
    else if (selectedPillar === 4) {
      chapterSet.add(12);
      chapterSet.add(13);
    } else if (selectedPillar === 5) {
      chapterSet.add(14);
      chapterSet.add(15);
    }

    return MFIT_FINAL_MOCK_EXAM.filter(
      (q) => q.chapter !== undefined && chapterSet.has(q.chapter),
    );
  }, [selectedPillar]);

  function openPreviewForFile(
    fileName: string,
    title: LText,
    description?: LText,
  ) {
    const found = remoteAssets.find(
      (a) => a.fileName === fileName || a.url?.includes(fileName),
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
    <div className="font-sans space-y-6 my-2">
      {/* ── Standardized Exam War Room Banner ────────────────────────────── */}
      <ExamWarRoomBanner
        title={locale === "th" ? "สอบปลายภาค" : "Final Examination"}
        subtitle={
          locale === "th"
            ? "ศูนย์บัญชาการรบ MFIT (Final War Room)"
            : "MFIT Final War Room"
        }
        code="MFIT"
      />

      {/* ── Section 1: ข้อสอบจำลองปลายภาค (Mock Exam Simulator) ─────────── */}
      <section className="space-y-3 pt-2" id="mock-exam">
        <TopicHeader
          id="mock-exam-header"
          title={
            locale === "th"
              ? "ข้อสอบจำลองปลายภาค 25 ข้อ (Final Mock Exam)"
              : "Final Mock Exam Simulator"
          }
          aside={
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "th" ? "25 ข้อ · 5 เสาหลัก" : "25 Items · 5 Pillars"}
            </span>
          }
          description={
            locale === "th"
              ? "จำลองจากสถิติข้อสอบจริง 2559–2561 (22–26 ข้อ) ข้อเขียน 100% คิดมือล้วน พร้อมเฉลยละเอียดและวิเคราะห์วิธีทำทีละขั้น"
              : "Engineered from authentic past final exams (2016–2018), 100% manual calculation with full step-by-step working."
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
            🚀{" "}
            {locale === "th"
              ? "ข้อสอบจำลองเต็มชุด (25 ข้อ)"
              : "Full Mock Exam (25 Items)"}
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
                {t(p.name, locale)} ({p.questionCount}{" "}
                {locale === "th" ? "ข้อ" : "items"})
              </button>
            );
          })}
        </div>

        {/* Quiz launch card or runner */}
        {!quizStarted ? (
          <div
            className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 transition-[box-shadow,background-color] hover:bg-primary/[0.03] hover:shadow-md dark:hover:bg-primary/10 border border-primary/25 ${SURFACE}`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="min-w-0 truncate text-xs sm:text-sm font-semibold text-foreground">
                  {selectedPillar === "all"
                    ? locale === "th"
                      ? "ชุดข้อสอบจำลองเต็มรูปแบบ (25 ข้อ · ครบทุก 5 เสาหลัก)"
                      : "Full Final Mock Exam (25 Items)"
                    : t(
                        MFIT_FINAL_PILLARS.find(
                          (p) => p.pillar === selectedPillar,
                        )?.name || { th: "", en: "" },
                        locale,
                      )}
                </span>
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold shrink-0">
                  {quizQuestions.length}{" "}
                  {locale === "th" ? "ข้อสอบ" : "items"}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setQuizStarted(true)}
              className="gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold shrink-0 rounded-xl text-xs"
            >
              <Flame className="size-3.5" />
              <span>
                {locale === "th"
                  ? `เริ่มทำข้อสอบ (${quizQuestions.length} ข้อ)`
                  : `Start Quiz (${quizQuestions.length})`}
              </span>
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
                <span>
                  {locale === "th"
                    ? "← ย้อนกลับ / เปลี่ยนโหมด"
                    : "← Back / Change Topic"}
                </span>
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                {selectedPillar === "all"
                  ? locale === "th"
                    ? "ข้อสอบจำลองเต็มชุด (25 ข้อ)"
                    : "Full Mock Exam (25 items)"
                  : t(
                      MFIT_FINAL_PILLARS.find(
                        (p) => p.pillar === selectedPillar,
                      )?.name || { th: "", en: "" },
                      locale,
                    )}
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
      <section className="space-y-2.5 pt-4" id="past-papers">
        <TopicHeader
          id="past-papers-header"
          title={
            locale === "th"
              ? "คลังข้อสอบเก่าฉบับจริง (Past Papers Vault)"
              : "Authentic Past Papers Vault"
          }
          aside={
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "th" ? "7 ชุดในคลัง" : "7 Papers in Vault"}
            </span>
          }
        />

        <div className="flex flex-col gap-2">
          {PAST_PAPERS.map((paper) => {
            const remoteAsset = remoteAssets.find(
              (a) =>
                a.fileName === paper.fileName ||
                a.url?.includes(paper.fileName),
            );
            const downloadUrl =
              remoteAsset?.url ||
              `/assets/it-kmitl/mfit/exams/${paper.fileName}`;

            return (
              <ResourceItemCard
                key={paper.id}
                title={t(paper.title, locale)}
                icon={
                  paper.isSolution ? (
                    <FileCheck2 className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )
                }
                iconClassName={
                  paper.isSolution
                    ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400"
                    : "bg-primary/10 text-primary"
                }
                onPreview={() =>
                  openPreviewForFile(paper.fileName, paper.title)
                }
                downloadUrl={downloadUrl}
                fileName={paper.fileName}
                previewLabel={locale === "th" ? "ดูตัวอย่าง" : "Preview"}
                downloadTitle={locale === "th" ? "ดาวน์โหลด" : "Download"}
              />
            );
          })}
        </div>
      </section>

      {/* ── Section 3: ชีทสรุปสูตร & เอกสารทางการ (Official Formula Sheets) ─ */}
      <section className="space-y-2.5 pt-4" id="formula-sheets">
        <TopicHeader
          id="formula-sheets-header"
          title={
            locale === "th"
              ? "ชีทสรุปสูตร & เอกสารทางการ (Official Formula Sheets)"
              : "Official Formula Sheets"
          }
          aside={
            <span className="rounded-full bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              {locale === "th" ? "6 ฉบับสรุป" : "6 Cheatsheets"}
            </span>
          }
        />

        <div className="flex flex-col gap-2">
          {FORMULA_SHEETS.map((sheet) => {
            const remoteAsset = remoteAssets.find(
              (a) =>
                a.fileName === sheet.fileName ||
                a.url?.includes(sheet.fileName),
            );
            const downloadUrl =
              remoteAsset?.url ||
              `/assets/it-kmitl/mfit/sheets/${sheet.fileName}`;

            return (
              <ResourceItemCard
                key={sheet.id}
                title={t(sheet.title, locale)}
                icon={<BookOpen className="size-4" />}
                iconClassName={
                  sheet.highlight
                    ? "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-400/15 dark:text-yellow-400"
                    : "bg-primary/10 text-primary"
                }
                highlight={sheet.highlight}
                onPreview={() =>
                  openPreviewForFile(sheet.fileName, sheet.title)
                }
                downloadUrl={downloadUrl}
                fileName={sheet.fileName}
                previewLabel={locale === "th" ? "ดูตัวอย่าง" : "Preview"}
                downloadTitle={locale === "th" ? "ดาวน์โหลด" : "Download"}
              />
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Separator for Deep Study Guide ────────────────────── */}
      <section className="pt-6" id="study-guide">
        <TopicHeader
          id="study-guide-header"
          title={
            locale === "th"
              ? "ยุทธศาสตร์และคู่มือสรุปวิธีทำโจทย์แคลคูลัส (Deep Study Guide)"
              : "Deep Study Guide & Strategy"
          }
          aside={
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "th"
                ? "แคลคูลัส Week 08–15 · 35 คะแนน"
                : "Calculus W08-15 · 35 Pts"}
            </span>
          }
        />
      </section>

      {/* ── Dedicated Preview Modal ───────────────────────────────────────── */}
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
