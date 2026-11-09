"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Flame,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type WarRoomTab = "mock-exam" | "past-papers" | "formula-sheets" | "blueprint-traps" | "study-guide";

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
    year: "คลังเอกสาร",
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
    year: "ชุดคละบท",
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

const DEADLY_TRAPS = [
  {
    id: "trap-01",
    title: { th: "กับดัก 01: ลืมเขียนสัญลักษณ์ lim ก่อนแทนค่า", en: "Trap 01: Omitting lim notation before substitution" },
    danger: { th: "ถูกหัก 0.5–1 คะแนนทันที", en: "Immediate 0.5-1 mark deduction" },
    why: {
      th: "การเขียน f(x) = (x²-4)/(x-2) = x+2 ทันทีโดยไม่มี lim ถือว่าผิดหลักคณิตศาสตร์ เพราะที่ x=2 ตัวส่วนเป็น 0 นิพจน์ไม่ได้เท่ากันจริงๆ ถ้าไม่ใส่ lim",
      en: "Writing algebraic reduction without lim is mathematically false because at x=2 the fraction is undefined.",
    },
    remedy: {
      th: "เขียนคำว่า lim_{x→c} กำกับหน้าทุกบรรทัดจนกว่าจะถึงบรรทัดที่แทนค่าตัวเลข x ลงไปจริง",
      en: "Keep writing lim_{x→c} on every single line until you actually evaluate by plugging the constant in.",
    },
  },
  {
    id: "trap-02",
    title: { th: "กับดัก 02: ลืมบวกค่าคงตัว + C ในปริพันธ์ไม่จำกัดเขต", en: "Trap 02: Forgetting + C in indefinite integrals" },
    danger: { th: "อาจารย์ตัดเหลือ 0 ในข้อนั้นทันที", en: "Zero credit for the entire problem" },
    why: {
      th: "โจทย์ Indefinite Integral ไม่มีขอบเขต คำตอบคือวงศ์ของฟังก์ชัน (Family of functions) การขาด + C หมายถึงได้คำตอบเพียงฟังก์ชันเดียว",
      en: "Indefinite integration yields a family of functions; omitting + C loses the entire point.",
    },
    remedy: {
      th: "ทันทีที่เครื่องหมายถั่วงอก ∫ และ dx หายไป ให้เขียน + C ทันทีในบรรทัดนั้น และตรวจทานซ้ำก่อนส่ง",
      en: "The moment the integral sign and dx vanish, append + C immediately on that line.",
    },
  },
  {
    id: "trap-03",
    title: { th: "กับดัก 03: ลืมเปลี่ยนขอบเขตเมื่อทำ u-Substitution", en: "Trap 03: Forgetting to change bounds during u-sub" },
    danger: { th: "ขอบเขต x ปนกับตัวแปร u เสียคะแนนวิธีทำ", en: "Invalid mixed bounds and penalty" },
    why: {
      th: "เมื่อเปลี่ยน ∫_a^b f(g(x))g'(x)dx ไปเป็น ∫ u du ขอบเขต a, b ยังคงเป็นค่าของ x การใส่ขอบเขตเดิมกับตัวแปร u เป็นข้อผิดพลาดร้ายแรง",
      en: "Bounds a and b belong to x; using them alongside u creates an invalid integral statement.",
    },
    remedy: {
      th: "คำนวณ u(a) และ u(b) ในกรอบทดข้างๆ ทันทีที่กำหนดตัวแปร u แล้วเปลี่ยนขอบเขตบนเครื่องหมายอินทิกรัลทันที",
      en: "Compute u(a) and u(b) immediately in a side box and update limits on the integral symbol.",
    },
  },
  {
    id: "trap-04",
    title: { th: "กับดัก 04: สับสนระหว่าง 0/0 กับ k/0", en: "Trap 04: Confusing 0/0 with k/0" },
    danger: { th: "ตอบผิดข้อและสรุปผลผิดทาง", en: "Wrong answer and false conclusion" },
    why: {
      th: "0/0 คือรูปแบบไม่กำหนด (Indeterminate Form) ต้องแยกตัวประกอบหรือคูณสังยุค แต่ k/0 (เมื่อ k ≠ 0) เป็นลิมิตอนันต์ (±∞ หรือหาค่าไม่ได้) ไม่ต้องแยกตัวประกอบ",
      en: "0/0 is indeterminate requiring factoring/conjugate, while k/0 indicates an infinite limit or DNE.",
    },
    remedy: {
      th: "แทนค่าตัวเลขก่อนเสมอ ถ้าเศษไม่เป็น 0 แต่ส่วนเป็น 0 ให้ตรวจลิมิตซ้าย-ขวาเพื่อหาว่าลู่เข้าสู่ +∞, -∞ หรือหาค่าไม่ได้",
      en: "Always plug in numbers first. If numerator is non-zero and denominator is 0, test left and right limits.",
    },
  },
  {
    id: "trap-05",
    title: { th: "กับดัก 05: สับสนสูตรปริมาตร Disk กับ Washer", en: "Trap 05: Washer formula error π(R-r)² instead of π(R²-r²)" },
    danger: { th: "คำนวณปริมาตรผิดมหันต์", en: "Completely invalid volume calculation" },
    why: {
      th: "พื้นที่หน้าตัดวงแหวนคือ π R² - π r² = π(R² - r²) ไม่ใช่ π(R - r)² การเอารัศมีมาลบกันก่อนยกกำลังสองเป็นข้อผิดพลาดที่พบบ่อยที่สุด",
      en: "Annular area is π(R² - r²), NOT π(R - r)². Squaring the difference is completely wrong.",
    },
    remedy: {
      th: "ท่องจำให้แม่น: 'พาย คูณ (รัศมีนอกกำลังสอง ลบ รัศมีในกำลังสอง)' ไม่ใช่เอารัศมีมาลบกันก่อน",
      en: "Always square each radius separately before subtracting: π ∫ (R(x)² - r(x)²) dx.",
    },
  },
  {
    id: "trap-06",
    title: { th: "กับดัก 06: ท่องลำดับ LIATE ผิดในการเลือกตัวแปร u ใน By Parts", en: "Trap 06: Wrong priority order in LIATE for By Parts" },
    danger: { th: "อินทิเกรตติดลูป วนซ้ำไม่รู้จบ", en: "Infinite integration loop without simplification" },
    why: {
      th: "ลำดับการเลือก u ที่ดีที่สุดคือ Logarithmic → Inverse Trig → Algebraic → Trigonometric → Exponential หากเลือกสลับ เช่น เอา e^x เป็น u จะทำให้พจน์ไม่ลดรูปลง",
      en: "Prioritize u as Log → InvTrig → Alg → Trig → Exp. Reversing it makes the integral harder.",
    },
    remedy: {
      th: "เขียนตัวย่อ L-I-A-T-E ไว้บนหัวกระดาษ และถ้าพบฟังก์ชันพหุนามคูณ e^x หรือ sin(x) ให้ใช้ DI Table (ตารางลัด) จะไม่มีวันผิด",
      en: "Note L-I-A-T-E on scratch paper, and use tabular DI method for polynomial times exponential/trig.",
    },
  },
];

export function MfitWarRoomPortal({ config }: { config?: FenceWarRoomConfig } = {}) {
  void config;
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<WarRoomTab>("mock-exam");
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
    const pillarConfig = MFIT_FINAL_PILLARS.find((p) => p.pillar === selectedPillar);
    if (!pillarConfig) return MFIT_FINAL_MOCK_EXAM;

    // Map pillar to chapters
    // Pillar 1: chapter 8
    // Pillar 2: chapters 9, 10
    // Pillar 3: chapter 11
    // Pillar 4: chapters 12, 13
    // Pillar 5: chapters 14, 15
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

  function scrollToSection(elementId: string) {
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="my-6 space-y-6">
      {/* ── Command Portal Hero Header ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/40 via-card to-neutral-900/80 p-5 sm:p-7">
        <div className="absolute -top-24 -right-24 size-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shadow-inner">
                <Swords className="size-5 animate-pulse" />
              </span>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-[11px] font-bold text-red-400 uppercase tracking-wider">
                  🔥 Final Exam Command Center · 35 คะแนนเต็ม
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Target className="size-3.5 text-primary" />
                {locale === "th" ? "แคลคูลัสล้วน (W08–15)" : "Pure Calculus (W08-15)"}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ShieldAlert className="size-3.5 text-yellow-500" />
                {locale === "th" ? "ข้อเขียน 100% คิดมือ" : "100% Written & No Calc"}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {locale === "th"
                ? "ศูนย์บัญชาการรบ MFIT — ยุทธการพิชิตข้อสอบปลายภาค"
                : "MFIT War Room Portal — Final Exam Operation"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {locale === "th"
                ? "เลือกระบบเตรียมตัวสอบที่คุณต้องการ: ฝึกทำข้อสอบจำลอง 25 ข้อ, เจาะคลังข้อสอบเก่าจริงย้อนหลังทุกปี, เปิดชีทสูตรสรุปทางการ, หรือตรวจเช็คกับดักคะแนน"
                : "Choose your battle station: 25-item mock exam simulator, authentic past paper vault, official formula decks, or score trap breakdown."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
              <div className="text-lg sm:text-xl font-bold text-red-500">25 ข้อ</div>
              <div className="text-[11px] text-muted-foreground">{locale === "th" ? "ข้อสอบจำลอง 5 เสาหลัก" : "Mock Items"}</div>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
              <div className="text-lg sm:text-xl font-bold text-primary">7 ชุด</div>
              <div className="text-[11px] text-muted-foreground">{locale === "th" ? "ข้อสอบเก่าฉบับจริงในคลัง" : "Past Exam Papers"}</div>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
              <div className="text-lg sm:text-xl font-bold text-yellow-500">6 ฉบับ</div>
              <div className="text-[11px] text-muted-foreground">{locale === "th" ? "ชีทสรุปสูตร & เอกสารติว" : "Formula Sheets"}</div>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
              <div className="text-lg sm:text-xl font-bold text-emerald-500">10 จุด</div>
              <div className="text-[11px] text-muted-foreground">{locale === "th" ? "กับดัก All-or-Nothing" : "Deadly Traps"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mode Navigation Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        <Button
          variant={activeTab === "mock-exam" ? "default" : "outline"}
          size="sm"
          onClick={() => { setActiveTab("mock-exam"); }}
          className="gap-2 shrink-0 rounded-full font-semibold text-xs sm:text-sm"
        >
          <Target className="size-3.5" />
          <span>{locale === "th" ? "ข้อสอบจำลอง 25 ข้อ" : "Mock Exam (25)"}</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            Quiz
          </Badge>
        </Button>

        <Button
          variant={activeTab === "past-papers" ? "default" : "outline"}
          size="sm"
          onClick={() => { setActiveTab("past-papers"); }}
          className="gap-2 shrink-0 rounded-full font-semibold text-xs sm:text-sm"
        >
          <BookOpen className="size-3.5" />
          <span>{locale === "th" ? "คลังข้อสอบเก่าฉบับจริง" : "Past Papers Vault"}</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            7 ชุด
          </Badge>
        </Button>

        <Button
          variant={activeTab === "formula-sheets" ? "default" : "outline"}
          size="sm"
          onClick={() => { setActiveTab("formula-sheets"); }}
          className="gap-2 shrink-0 rounded-full font-semibold text-xs sm:text-sm"
        >
          <FileText className="size-3.5" />
          <span>{locale === "th" ? "ชีทสรุปสูตรทางการ" : "Formula Sheets"}</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            6 ชุด
          </Badge>
        </Button>

        <Button
          variant={activeTab === "blueprint-traps" ? "default" : "outline"}
          size="sm"
          onClick={() => { setActiveTab("blueprint-traps"); }}
          className="gap-2 shrink-0 rounded-full font-semibold text-xs sm:text-sm"
        >
          <AlertTriangle className="size-3.5" />
          <span>{locale === "th" ? "วิเคราะห์ 35 คะแนน & กับดัก" : "35 Pts & Traps"}</span>
        </Button>

        <Button
          variant={activeTab === "study-guide" ? "default" : "outline"}
          size="sm"
          onClick={() => { setActiveTab("study-guide"); }}
          className="gap-2 shrink-0 rounded-full font-semibold text-xs sm:text-sm"
        >
          <Sparkles className="size-3.5" />
          <span>{locale === "th" ? "คู่มือวิธีทำโจทย์แบบละเอียด" : "Deep Study Guide"}</span>
        </Button>
      </div>

      {/* ── Tab 1: Mock Exam Simulator ───────────────────────────────────── */}
      {activeTab === "mock-exam" && (
        <div className="space-y-4">
          {!quizStarted ? (
            <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                    <Flame className="size-3.5" />
                    {locale === "th" ? "ระบบจำลองสภาพห้องสอบจริง" : "Exam Simulator Briefing"}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {locale === "th" ? "ข้อสอบจำลองเสมือนจริง MFIT Final Exam (25 ข้อ)" : "Realistic MFIT Final Mock Exam (25 Questions)"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {locale === "th"
                      ? "สร้างจากโครงสร้างข้อสอบจริง 2559–2561 ครอบคลุม 5 เสาหลักแคลคูลัส พร้อมเฉลยละเอียดและวิเคราะห์วิธีทำทีละขั้น"
                      : "Engineered from authentic past paper blueprints (2016-2018) covering all 5 pillars of calculus with full step-by-step working."}
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => setQuizStarted(true)}
                  className="gap-2 bg-red-600 hover:bg-red-700 text-white font-bold shrink-0"
                >
                  <Flame className="size-4" />
                  <span>{locale === "th" ? "เริ่มทำข้อสอบจำลอง" : "Start Mock Exam"}</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              {/* 3 Core Rules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/50 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">✍️</span>
                    <span>{locale === "th" ? "ข้อเขียนแสดงวิธีทำ 100%" : "Constructed-Response"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {locale === "th"
                      ? "ข้อสอบจริงไม่มีช้อยส์ ในแบบทดสอบนี้ใช้ปรนัยเพื่อวัดความเข้าใจ แต่ในห้องสอบต้องเขียนแสดงวิธีทำทุกบรรทัด"
                      : "The real exam is 100% written. Options here are designed for rapid self-assessment with step-by-step keys."}
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                    <span className="flex size-6 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-500">🚫</span>
                    <span>{locale === "th" ? "ห้ามใช้เครื่องคิดเลขเด็ดขาด" : "No Calculator Allowed"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {locale === "th"
                      ? "ต้องคำนวณด้วยมือล้วน ฝึกตัดทอนเศษส่วน แยกตัวประกอบ และจัดรูปสมการให้คล่องแคล่ว"
                      : "Manual calculations only. Practice exact fraction cancellation, factoring, and radical simplification."}
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-foreground">
                    <span className="flex size-6 items-center justify-center rounded-md bg-red-500/10 text-red-500">⚙️</span>
                    <span>{locale === "th" ? "ปรัชญา Limit Machine" : "Limit Machine Core"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {locale === "th"
                      ? "ทุกหัวข้อในครึ่งหลัง (อนุพันธ์, ปริพันธ์, พื้นที่, ปริมาตร) สร้างต่อยอดมาจากนิยามลิมิตทั้งสิ้น"
                      : "All calculus topics (derivatives, integration, area, solids of revolution) are extensions of limit machines."}
                  </p>
                </div>
              </div>

              {/* Drill Filter by Pillar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                    {locale === "th" ? "เลือกขอบเขตที่ต้องการฝึกซ้อม:" : "Select Drill Scope / Topic:"}
                  </h4>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {quizQuestions.length} {locale === "th" ? "ข้อในชุดที่เลือก" : "items in selected set"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPillar("all")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selectedPillar === "all"
                        ? "border-red-500 bg-red-500/10 shadow-sm"
                        : "border-border/50 bg-neutral-50/40 dark:bg-neutral-900/30 hover:border-border hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-foreground">
                        {locale === "th" ? "🚀 ลุยข้อสอบจำลองเต็มรูปแบบ" : "🚀 Full Mock Exam"}
                      </span>
                      <Badge variant={selectedPillar === "all" ? "default" : "outline"} className="text-[10px]">
                        25 ข้อ
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {locale === "th" ? "ครบทุก 5 เสาหลักตามโครงสร้างข้อสอบจริง 35 คะแนน" : "All 5 pillars matching the full 35-point paper"}
                    </p>
                  </button>

                  {MFIT_FINAL_PILLARS.map((p) => {
                    const isSelected = selectedPillar === p.pillar;
                    return (
                      <button
                        key={p.pillar}
                        type="button"
                        onClick={() => setSelectedPillar(p.pillar)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/50 bg-neutral-50/40 dark:bg-neutral-900/30 hover:border-border hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs sm:text-sm text-foreground truncate">
                            {t(p.name, locale)}
                          </span>
                          <Badge variant={isSelected ? "default" : "outline"} className="text-[10px] shrink-0">
                            {p.questionCount} ข้อ
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{p.chapterRange}</span>
                          <span className="font-medium text-foreground/80">{p.pointsEst}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start CTA */}
              <div className="flex justify-end pt-2">
                <Button
                  size="default"
                  onClick={() => setQuizStarted(true)}
                  className="gap-2 bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  <Target className="size-4" />
                  <span>
                    {locale === "th"
                      ? `เริ่มทำแบบฝึกหัด (${quizQuestions.length} ข้อ)`
                      : `Start Drill (${quizQuestions.length} items)`}
                  </span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuizStarted(false)}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{locale === "th" ? "← ย้อนกลับ / เปลี่ยนโหมดฝึกซ้อม" : "← Back / Change Scope"}</span>
                </Button>

                <div className="text-xs font-medium text-muted-foreground">
                  {selectedPillar === "all"
                    ? locale === "th" ? "ข้อสอบจำลองเต็มชุด (25 ข้อ)" : "Full Mock Exam (25 items)"
                    : t(MFIT_FINAL_PILLARS.find((p) => p.pillar === selectedPillar)?.name || { th: "", en: "" }, locale)}
                </div>
              </div>

              <article className="overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
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
        </div>
      )}

      {/* ── Tab 2: Past Papers Vault ──────────────────────────────────────── */}
      {activeTab === "past-papers" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {locale === "th" ? "📚 คลังข้อสอบเก่าฉบับจริง (Past Papers Vault)" : "📚 Authentic Past Papers Vault"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {locale === "th"
                    ? "รวบรวมข้อสอบเก่าฉบับจริงของวิชา MFIT พร้อมบันทึกเฉลยวิธีทำ สามารถกดพรีวิวอ่านบนเว็บได้ทันที หรือดาวน์โหลดเก็บไว้"
                    : "Official past exam papers and handwritten solution keys. Preview directly in your browser or download for offline drill."}
                </p>
              </div>

              <Badge variant="outline" className="text-xs shrink-0 self-start sm:self-auto border-primary/30 text-primary">
                {PAST_PAPERS.length} {locale === "th" ? "ชุดเอกสารในคลัง" : "vault documents"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {PAST_PAPERS.map((paper) => {
              const remoteAsset = remoteAssets.find(
                (a) => a.fileName === paper.fileName || a.url?.includes(paper.fileName)
              );
              const downloadUrl = remoteAsset?.url || `/assets/it-kmitl/mfit/exams/${paper.fileName}`;

              return (
                <div
                  key={paper.id}
                  className={`group rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all ${
                    paper.isSolution
                      ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50"
                      : "border-border/50 bg-card hover:border-border hover:shadow-md"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        {paper.year}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {t(paper.badge, locale)}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {paper.pages} {locale === "th" ? "หน้า" : "pages"}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {t(paper.title, locale)}
                    </h4>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(paper.description, locale)}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                      <span>{locale === "th" ? "น้ำหนัก:" : "Weight:"} <strong className="text-foreground">{paper.points}</strong></span>
                      <span>•</span>
                      <span>{locale === "th" ? "ปริมาณ:" : "Volume:"} <strong className="text-foreground">{paper.itemCount}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openPreviewForFile(paper.fileName, paper.title, paper.description)}
                      className="gap-1.5 text-xs flex-1 rounded-xl font-semibold"
                    >
                      <Eye className="size-3.5" />
                      <span>{locale === "th" ? "เปิดดูตัวอย่างทันที" : "Instant Preview"}</span>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
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
        </div>
      )}

      {/* ── Tab 3: Official Formula Sheets ────────────────────────────────── */}
      {activeTab === "formula-sheets" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {locale === "th" ? "📑 ชีทสรุปสูตร & เอกสารทางการ (Official Formula Sheets)" : "📑 Official Formula Sheets"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {locale === "th"
                    ? "แผ่นสรุปข้อมูลสูตรทางการของภาควิชาเทอมปัจจุบัน และชีทติวเข้มที่ครอบคลุมเนื้อหาแคลคูลัสปลายภาคทั้งหมด"
                    : "Official useful information decks, concise formula cheatsheets, and comprehensive semester recaps."}
                </p>
              </div>

              <Badge variant="outline" className="text-xs shrink-0 self-start sm:self-auto border-yellow-500/30 text-yellow-500">
                {FORMULA_SHEETS.length} {locale === "th" ? "ฉบับสรุป" : "sheets available"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {FORMULA_SHEETS.map((sheet) => {
              const remoteAsset = remoteAssets.find(
                (a) => a.fileName === sheet.fileName || a.url?.includes(sheet.fileName)
              );
              const downloadUrl = remoteAsset?.url || `/assets/it-kmitl/mfit/sheets/${sheet.fileName}`;

              return (
                <div
                  key={sheet.id}
                  className={`group rounded-2xl border p-4 flex flex-col justify-between gap-3.5 transition-all ${
                    sheet.highlight
                      ? "border-yellow-500/40 bg-yellow-950/10 hover:border-yellow-500/60"
                      : "border-border/50 bg-card hover:border-border hover:shadow-md"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={sheet.highlight ? "default" : "secondary"} className="text-[10px]">
                        {t(sheet.badge, locale)}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {sheet.pages} {locale === "th" ? "หน้า" : "pages"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {t(sheet.title, locale)}
                    </h4>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {t(sheet.description, locale)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openPreviewForFile(sheet.fileName, sheet.title, sheet.description)}
                      className="gap-1.5 text-xs flex-1 rounded-xl font-semibold"
                    >
                      <Eye className="size-3.5" />
                      <span>{locale === "th" ? "เปิดดูตัวอย่าง" : "Preview"}</span>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs rounded-xl"
                    >
                      <a href={downloadUrl} download={sheet.fileName} target="_blank" rel="noopener noreferrer">
                        <Download className="size-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab 4: Blueprint & Deadly Traps ───────────────────────────────── */}
      {activeTab === "blueprint-traps" && (
        <div className="space-y-6">
          {/* 5 Pillars Breakdown */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <Layers className="size-3.5" />
                {locale === "th" ? "วิเคราะห์พิมพ์เขียว 35 คะแนน" : "35 Points Blueprint Breakdown"}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {locale === "th" ? "5 เสาหลักแห่งแคลคูลัส (Calculus 5 Pillars)" : "5 Pillars of Calculus"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {locale === "th"
                  ? "สัดส่วนคะแนน 35 คะแนน ในข้อสอบจริง 1/2569 แบ่งตามหัวข้อบรรยายและสไลด์"
                  : "Expected score distribution for the 1/2569 final examination based on lecture scope."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {MFIT_FINAL_PILLARS.map((p) => (
                <div key={p.pillar} className="rounded-xl border border-border/50 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary">เสาที่ {p.pillar}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {p.pointsEst}
                    </Badge>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {t(p.name, locale)}
                  </h4>
                  <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    {p.chapterRange}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Deadly Traps */}
          <div className="rounded-2xl border border-red-500/30 bg-red-950/10 p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {locale === "th" ? "10 กับดักจุดตาย All-or-Nothing ที่ห้ามผิดเด็ดขาด" : "10 Deadly All-or-Nothing Exam Traps"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {locale === "th"
                    ? "จุดผิดซ้ำซากที่ทำให้นักศึกษาได้ 0 คะแนนในข้อนั้น แม้ว่าจะคำนวณตัวเลขถูกก็ตาม"
                    : "Common traps where students receive zero credit despite having correct intermediate math."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEADLY_TRAPS.map((trap) => (
                <div key={trap.id} className="rounded-xl border border-border/50 bg-card p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-red-500 dark:text-red-400 leading-snug">
                      {t(trap.title, locale)}
                    </h4>
                    <span className="inline-flex items-center text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full shrink-0">
                      {t(trap.danger, locale)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                    <div>
                      <strong className="text-foreground/80">{locale === "th" ? "ทำไมถึงผิด: " : "Why it fails: "}</strong>
                      {t(trap.why, locale)}
                    </div>
                    <div className="pt-1 border-t border-border/40 text-emerald-600 dark:text-emerald-400">
                      <strong className="font-semibold">{locale === "th" ? "วิธีแก้ให้ได้คะแนนเต็ม: " : "Remedy: "}</strong>
                      {t(trap.remedy, locale)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 5: Deep Study Guide Fast Navigation ──────────────────────── */}
      {activeTab === "study-guide" && (
        <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 space-y-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {locale === "th" ? "📖 คู่มือสรุปวิธีทำโจทย์แคลคูลัสฉบับละเอียด (Deep Study Guide)" : "📖 Deep Calculus Problem-Solving Guide"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {locale === "th"
                ? "เนื้อหาบทสรุปการคำนวณและขั้นตอนทำโจทย์แบบ Step-by-Step แสดงอยู่ด้านล่าง สามารถกดเพื่อกระโดดไปยังหัวข้อที่ต้องการได้ทันที"
                : "Full step-by-step calculus lecture notes and solved proofs are rendered below. Click below to fast jump."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("เสาที่-1-ลิมิตและความต่อเนื่อง-limit-continuity-week-8")}
              className="justify-between text-xs h-auto py-2.5 rounded-xl font-medium"
            >
              <span>{locale === "th" ? "1. ลิมิต & การแก้ 0/0" : "1. Limits & 0/0 Forms"}</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("เสาที่-2-อนุพันธ์-กฎลูกโซ่-และฟังก์ชันแฝง-differentiation-mechanics-week-910")}
              className="justify-between text-xs h-auto py-2.5 rounded-xl font-medium"
            >
              <span>{locale === "th" ? "2. ดิฟนิยาม & Implicit" : "2. Limit Def & Implicit"}</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("เสาที่-3-การประยุกต์อนุพันธ์และปัญหาค่าสุดขีด-applications-optimization-week-11")}
              className="justify-between text-xs h-auto py-2.5 rounded-xl font-medium"
            >
              <span>{locale === "th" ? "3. Optimization & ค่าสุดขีด" : "3. Optimization & Extrema"}</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("เสาที่-4-ปริพันธ์พื้นฐาน-ftc-และ-u-substitution-integration-mechanics-week-1213")}
              className="justify-between text-xs h-auto py-2.5 rounded-xl font-medium"
            >
              <span>{locale === "th" ? "4. ปริพันธ์ & u-Sub" : "4. Integrals & u-Sub"}</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("เสาที่-5-by-parts-พื้นที่-และปริมาตรทรงตันหมุน-advanced-integration-applications-week-1415")}
              className="justify-between text-xs h-auto py-2.5 rounded-xl font-medium"
            >
              <span>{locale === "th" ? "5. By Parts & ปริมาตรหมุน" : "5. By Parts & Volume"}</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToSection("ตารางกับดักจุดตาย-all-or-nothing-checklist")}
              className="justify-between text-xs h-auto py-2.5 rounded-xl font-medium text-red-500 dark:text-red-400"
            >
              <span>{locale === "th" ? "⚠️ 10 กับดัก All-or-Nothing" : "⚠️ 10 Deadly Traps"}</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => scrollToSection("ยุทธศาสตร์และภาพรวมการรบ-final-exam-briefing")}
              className="gap-2 rounded-full text-xs font-semibold"
            >
              <ArrowRight className="size-3.5 rotate-90" />
              <span>{locale === "th" ? "เลื่อนลงอ่านเนื้อหาเลกเชอร์ฉบับเต็ม" : "Scroll Down to Full Lecture Notes"}</span>
            </Button>
          </div>
        </div>
      )}

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
