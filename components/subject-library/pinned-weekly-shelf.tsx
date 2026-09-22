"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Download,
  Eye,
  FlaskConical,
  Layers,
  Pin,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";
import { L, metaLine } from "./types";

const PINNED_ACTIONS_CELL =
  "sticky right-0 z-10 w-24 whitespace-nowrap bg-card/95 backdrop-blur-xs pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]";

const PINNED_KIND = {
  lecture: {
    icon: ScrollText,
    label: { th: "สไลด์บรรยาย", en: "Lecture" } satisfies LText,
    accent: "bg-primary/60",
    text: "text-primary",
    pill: "border-primary/30 bg-primary/10 text-primary",
  },
  lab: {
    icon: FlaskConical,
    label: { th: "ใบงานแล็บ", en: "Lab sheet" } satisfies LText,
    accent: "bg-emerald-500/60",
    text: "text-emerald-600 dark:text-emerald-400",
    pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
} as const;

type PinnedKind = keyof typeof PINNED_KIND;

/** One asset line inside a week group — mirrors the main table's row anatomy. */
export function PinnedWeekRow({
  asset,
  kind,
  onOpen,
}: {
  asset: SubjectAsset;
  kind: PinnedKind;
  onOpen: (asset: SubjectAsset) => void;
}) {
  const { locale } = useLocale();
  const style = PINNED_KIND[kind];
  const Icon = style.icon;

  return (
    <tr className="group transition-colors hover:bg-muted/35">
      <td className="py-2.5 pl-4 pr-3 max-w-[220px] sm:max-w-[320px] md:max-w-[460px]">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className={`h-7 w-1 shrink-0 rounded-full ${style.accent}`} />
          <button
            type="button"
            onClick={() => onOpen(asset)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Icon className={`size-4 shrink-0 ${style.text}`} />
            <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              {t(asset.title, locale)}
            </span>
          </button>
        </div>
      </td>
      <td className="py-2.5 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${style.pill}`}
        >
          <Icon className="size-3" />
          {t(style.label, locale)}
        </span>
      </td>
      <td className="py-2.5 px-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
        {metaLine(asset, locale) || "—"}
      </td>
      <td className={`${PINNED_ACTIONS_CELL} py-2.5`}>
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onOpen(asset)}
            aria-label={t(L.preview, locale)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Eye className="size-3.5" />
          </button>
          <a
            href={assetDownloadUrl(asset.url, asset.fileName)}
            download={asset.fileName}
            aria-label={`${t(L.download, locale)}: ${asset.fileName}`}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Download className="size-3.5" />
          </a>
        </div>
      </td>
    </tr>
  );
}

/** Placeholder line for a week that never shipped a slide or a lab sheet. */
export function PinnedWeekEmptyRow({ kind, label }: { kind: PinnedKind; label: string }) {
  const Icon = PINNED_KIND[kind].icon;
  return (
    <tr className="text-xs text-muted-foreground">
      <td colSpan={3} className="py-2 pl-4 pr-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-7 w-1 shrink-0 rounded-full bg-border" />
          <Icon className="size-3.5 shrink-0 opacity-50" />
          <span className="truncate">{label}</span>
        </div>
      </td>
      <td className={`${PINNED_ACTIONS_CELL} py-2`}>—</td>
    </tr>
  );
}

export interface PinnedWeeklyShelfProps {
  assets: SubjectAsset[];
  onOpen: (asset: SubjectAsset) => void;
  courseCode?: string;
}

export function PinnedWeeklyShelf({ assets, onOpen }: PinnedWeeklyShelfProps) {
  const { locale } = useLocale();
  const [activeTrack, setActiveTrack] = useState<"hardware" | "digital">("hardware");
  // Starts folded: the shelf is a jump-list, not the page's main content.
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 2569 hardware parts list reference
  const hardwareList = useMemo(() => {
    return assets.find(
      (a) => a.id === "ics-hardware-list-2569" || a.fileName.includes("component-list"),
    );
  }, [assets]);

  // Weeks 1 to 7
  const weeklyPairs = useMemo(() => {
    const weeks = [1, 2, 3, 4, 5, 6, 7];
    return weeks.map((w) => {
      let slide: SubjectAsset | undefined;
      let lab: SubjectAsset | undefined;
      let topicTitle = { th: `สัปดาห์ที่ ${w}`, en: `Week ${w}` };

      if (activeTrack === "hardware") {
        slide = assets.find(
          (a) =>
            a.scope === "final" &&
            (a.isCurrentYear || a.status === "current_year") &&
            a.category === "lecture" &&
            a.week === w,
        );
        lab = assets.find(
          (a) =>
            a.scope === "final" &&
            (a.isCurrentYear || a.status === "current_year") &&
            a.category === "exercise" &&
            a.week === w,
        );
        const titlesTh: Record<number, string> = {
          1: "ภาพรวมระบบคอมพิวเตอร์ และการใช้มัลติมิเตอร์",
          2: "หน่วยความจำ แอดเดรส I/O และออสซิลโลสโคป",
          3: "มัลติเพล็กเซอร์ แลตช์ และเบรดบอร์ดเบื้องต้น",
          4: "ฟลิปฟล็อป เคาน์เตอร์ และวงจรออสซิลเลเตอร์",
          5: "วงจรแปลงสัญญาณ DAC/ADC และลอจิกเกต",
          6: "วงจรหน่วยความจำ และการต่อบอร์ด FPGA Basys2",
          7: "วงจร ALU และการสร้างซีพียู 4 บิต (สอบแล็บ)",
        };
        const titlesEn: Record<number, string> = {
          1: "Computer Systems Overview & Multimeter",
          2: "Memory Addressing, I/O & Oscilloscope",
          3: "MUX, Latch, Buffer & Breadboard Basics",
          4: "Flip-Flops, Counters, ADC & Oscillator",
          5: "DAC/ADC Part 2 & Multiplexers via Logic Gates",
          6: "Memory Circuits & FPGA Basys2",
          7: "ALU & 4-bit CPU Synthesis (Lab Exam)",
        };
        topicTitle = {
          th: titlesTh[w] ?? `สัปดาห์ที่ ${w}`,
          en: titlesEn[w] ?? `Week ${w}`,
        };
      } else {
        slide = assets.find(
          (a) =>
            a.scope === "midterm" &&
            a.category === "lecture" &&
            a.week === w &&
            !a.isDuplicate,
        );
        lab = assets.find(
          (a) =>
            a.scope === "midterm" &&
            a.category === "exercise" &&
            a.week === w &&
            !a.isDuplicate,
        );
        const titlesTh: Record<number, string> = {
          1: "ระบบดิจิทัลเบื้องต้น และโปรแกรม Logisim",
          2: "พีชคณิตบูลีน ทฤษฎีเดอมอร์แกน และเกตลอจิก",
          3: "รูปแบบมาตรฐานคาโนนิคอล SOP & POS",
          4: "การลดรูปฟังก์ชันลอจิกด้วย K-map",
          5: "การตอบสนองเชิงเวลา (Time Response & Delay)",
          6: "ระบบเลขฐานและการคำนวณเลขฐานสอง (Arithmetic)",
          7: "วงจรมัลติเพล็กเซอร์และดีมัลติเพล็กเซอร์ (MUX/DEMUX)",
        };
        const titlesEn: Record<number, string> = {
          1: "Digital Systems Intro & Logisim Simulator",
          2: "Boolean Algebra & DeMorgan's Theorems",
          3: "Canonical SOP & POS Forms",
          4: "Logic Minimization via K-map",
          5: "Time Response & Propagation Delay",
          6: "Number Systems & Signed Binary Arithmetic",
          7: "Multiplexer & Demultiplexer Trees",
        };
        topicTitle = {
          th: titlesTh[w] ?? `สัปดาห์ที่ ${w}`,
          en: titlesEn[w] ?? `Week ${w}`,
        };
      }

      return { week: w, topicTitle, slide, lab };
    });
  }, [assets, activeTrack]);

  return (
    <section
      aria-label="Pinned Courseware"
      className="mb-8 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-b from-primary/5 via-card to-card p-4 shadow-sm backdrop-blur-md sm:p-6"
    >
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary shadow-2xs">
              <Pin className="size-3" />
              <span>{locale === "th" ? "ปักหมุดเอกสารประจำปี 2569" : "Pinned AY 2569"}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3" />
              <span>
                {locale === "th"
                  ? "จัดเรียงสไลด์คู่ใบงานแล็บรายสัปดาห์"
                  : "Weekly Paired Slide & Lab"}
              </span>
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {locale === "th"
              ? "สื่อการสอนประจำปีการศึกษา 2569 (จัดเรียงรายสัปดาห์ 1–7)"
              : "Academic Year 2569 Courseware (Sorted by Week 1–7)"}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {locale === "th"
              ? "จับคู่สไลด์บรรยายและใบงานแล็บประจำแต่ละสัปดาห์ สามารถกดเปิดอ่านตัวอย่างหรือดาวน์โหลดได้ทันที"
              : "Paired weekly lecture slides and lab sheets with direct 1-click preview and download."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-flex items-center gap-1.5 self-start rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer sm:self-center"
        >
          {isCollapsed ? (
            <>
              <span>{locale === "th" ? "แสดงทั้งหมด" : "Expand"}</span>
              <ChevronDown className="size-3.5" />
            </>
          ) : (
            <>
              <span>{locale === "th" ? "ย่อแถบปักหมุด" : "Collapse"}</span>
              <ChevronUp className="size-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Hardware Parts List Banner */}
      {hardwareList && !isCollapsed && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-background/90 p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary shrink-0">
              <Cpu className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">
                  {t(hardwareList.title, locale)}
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                  2569
                </span>
              </div>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                {t(hardwareList.description, locale)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpen(hardwareList)}
              className="h-7 rounded-full text-xs font-medium cursor-pointer"
            >
              <Eye className="mr-1 size-3" />
              {t(L.preview, locale)}
            </Button>
            <a
              href={assetDownloadUrl(hardwareList.url, hardwareList.fileName)}
              download={hardwareList.fileName}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
            >
              <Download className="size-3" />
              <span>{t(L.download, locale)}</span>
            </a>
          </div>
        </div>
      )}

      {/* Track Selector Tabs */}
      {!isCollapsed && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            {locale === "th" ? "เลือกพาร์ตการเรียน:" : "Select Track:"}
          </span>
          <button
            type="button"
            onClick={() => setActiveTrack("hardware")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTrack === "hardware"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="size-3.5" />
            <span>
              {locale === "th"
                ? "⚡ ฮาร์ดแวร์ & แล็บจริง 2569 (ผศ.ดร. สุภกิจ · W1–7)"
                : "⚡ Hardware & Bench Labs 2569 (Asst. Prof. Supakit)"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTrack("digital")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTrack === "digital"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>
              {locale === "th"
                ? "📐 ตรรกศาสตร์ดิจิทัล & Logisim (ศ.ดร. สุขสันต์ · W1–7)"
                : "📐 Digital Logic & Logisim (Prof. Sooksan)"}
            </span>
          </button>
        </div>
      )}

      {/* Weekly Table — grouped by week, same anatomy as the library table */}
      {!isCollapsed && (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-xs">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
                  <th scope="col" className="py-3 pl-4 pr-3">
                    {t(L.colName, locale)}
                  </th>
                  <th scope="col" className="py-3 px-3 whitespace-nowrap">
                    {t(L.colCategory, locale)}
                  </th>
                  <th scope="col" className="py-3 px-3 whitespace-nowrap">
                    {t(L.colSize, locale)}
                  </th>
                  <th
                    scope="col"
                    className="sticky right-0 z-10 w-24 whitespace-nowrap bg-muted/95 backdrop-blur-xs py-3 pl-2 pr-4 text-right shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]"
                  >
                    {t(L.colActions, locale)}
                  </th>
                </tr>
              </thead>
              {weeklyPairs.map(({ week, topicTitle, slide, lab }) => (
                <tbody
                  key={week}
                  className="divide-y divide-border/40 border-b border-border/60 last:border-b-0"
                >
                  {/* Week group header */}
                  <tr className="bg-muted/25">
                    <th scope="colgroup" colSpan={4} className="py-2 pl-4 pr-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex shrink-0 items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary tabular-nums">
                          {locale === "th" ? `สัปดาห์ที่ ${week}` : `Week 0${week}`}
                        </span>
                        <span className="min-w-0 truncate text-xs font-bold text-foreground">
                          {t(topicTitle, locale)}
                        </span>
                        <span className="ml-auto shrink-0 text-[10px] font-medium text-muted-foreground">
                          {activeTrack === "hardware" ? "2569 Final" : "2569 Midterm"}
                        </span>
                      </div>
                    </th>
                  </tr>

                  {slide ? (
                    <PinnedWeekRow asset={slide} kind="lecture" onOpen={onOpen} />
                  ) : (
                    <PinnedWeekEmptyRow
                      kind="lecture"
                      label={locale === "th" ? "ไม่มีสไลด์บรรยาย" : "No lecture slide"}
                    />
                  )}

                  {lab ? (
                    <PinnedWeekRow asset={lab} kind="lab" onOpen={onOpen} />
                  ) : (
                    <PinnedWeekEmptyRow
                      kind="lab"
                      label={
                        week === 7 && activeTrack === "hardware"
                          ? locale === "th"
                            ? "📝 สอบปฏิบัติการในห้องเรียน (Lab Exam)"
                            : "📝 In-class Practical Lab Exam"
                          : locale === "th"
                            ? "ไม่มีใบงานแล็บสัปดาห์นี้"
                            : "No lab worksheet this week"
                      }
                    />
                  )}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
