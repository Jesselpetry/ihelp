"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  AlertCircle,
  Archive,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  FlaskConical,
  FolderArchive,
  Layers,
  Package,
  ScrollText,
  Sigma,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  formatBytes,
  resolveCategory,
  type AssetCategory,
  type SubjectAsset,
} from "@/lib/library/subject-library-ui";
import {
  assetToPackItem,
  downloadAssetPack,
  type PackItem,
  type PackProgress,
} from "@/lib/library/pack-download";

export interface PackDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseCode?: string;
  courseTitle?: LText | string;
  assets?: SubjectAsset[];
  filteredAssets?: SubjectAsset[];
  initialCategory?: AssetCategory | "all" | "filtered";
  customItems?: PackItem[];
  customPackName?: string;
}

type PackTarget = "exercise" | "lecture" | "cheatsheet" | "exam" | "note" | "reference" | "filtered" | "all" | "custom";

export function PackDownloadModal({
  open,
  onOpenChange,
  courseCode = "iHelp",
  courseTitle,
  assets = [],
  filteredAssets,
  initialCategory = "exercise",
  customItems,
  customPackName,
}: PackDownloadModalProps) {
  const { locale } = useLocale();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Group assets by category
  const categorized = useMemo(() => {
    const map = new Map<AssetCategory, SubjectAsset[]>();
    for (const a of assets) {
      const cat = a.category ?? resolveCategory(a);
      const list = map.get(cat) ?? [];
      list.push(a);
      map.set(cat, list);
    }
    return map;
  }, [assets]);

  // Determine initial selection
  const defaultTarget = useMemo<PackTarget>(() => {
    if (customItems && customItems.length > 0) return "custom";
    if (initialCategory && initialCategory !== "all" && initialCategory !== "filtered") {
      if ((categorized.get(initialCategory)?.length ?? 0) > 0) return initialCategory;
    }
    if ((categorized.get("exercise")?.length ?? 0) > 0) return "exercise";
    if (filteredAssets && filteredAssets.length > 0 && filteredAssets.length < assets.length) {
      return "filtered";
    }
    return "all";
  }, [customItems, initialCategory, categorized, filteredAssets, assets.length]);

  const [selectedTarget, setSelectedTarget] = useState<PackTarget>(defaultTarget);
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [includeManifest, setIncludeManifest] = useState(true);
  const [progress, setProgress] = useState<PackProgress | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Sync default target when modal opens or initialCategory changes
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initialize target on open
      setSelectedTarget(defaultTarget);
      setIsDone(false);
      setProgress(null);
    }
  }, [open, defaultTarget]);

  // Items for the chosen pack target
  const chosenItems = useMemo<PackItem[]>(() => {
    if (selectedTarget === "custom" && customItems) {
      return customItems;
    }
    if (selectedTarget === "filtered" && filteredAssets) {
      return filteredAssets.map(assetToPackItem);
    }
    if (selectedTarget === "all") {
      return assets.map(assetToPackItem);
    }
    const catList = categorized.get(selectedTarget as AssetCategory) ?? [];
    return catList.map(assetToPackItem);
  }, [selectedTarget, customItems, filteredAssets, assets, categorized]);

  // Estimated total size
  const totalSizeBytes = useMemo(() => {
    let sum = 0;
    for (const item of chosenItems) {
      if (item.sizeBytes) sum += item.sizeBytes;
    }
    return sum;
  }, [chosenItems]);

  // Suggested zip file name
  const suggestedZipName = useMemo(() => {
    if (customPackName) {
      return customPackName.endsWith(".zip") ? customPackName : `${customPackName}.zip`;
    }
    const safeCode = courseCode.toUpperCase();
    if (selectedTarget === "exercise") return `${safeCode}-exercises-pack.zip`;
    if (selectedTarget === "cheatsheet") return `${safeCode}-cheatsheets-pack.zip`;
    if (selectedTarget === "lecture") return `${safeCode}-lectures-pack.zip`;
    if (selectedTarget === "exam") return `${safeCode}-past-papers-pack.zip`;
    if (selectedTarget === "filtered") return `${safeCode}-filtered-pack.zip`;
    if (selectedTarget === "all") return `${safeCode}-all-resources.zip`;
    return `${safeCode}-resource-pack.zip`;
  }, [customPackName, courseCode, selectedTarget]);

  async function handleStartDownload() {
    if (chosenItems.length === 0) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsDone(false);

    try {
      await downloadAssetPack({
        zipFileName: suggestedZipName,
        courseCode,
        courseTitle,
        items: chosenItems,
        groupByCategory: selectedTarget === "all" || selectedTarget === "filtered" ? groupByCategory : false,
        includeManifest,
        locale,
        signal: controller.signal,
        onProgress: (p) => {
          setProgress(p);
          if (p.phase === "done") {
            setIsDone(true);
          }
        },
      });
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        setProgress({
          phase: "cancelled",
          current: 0,
          total: chosenItems.length,
          percent: 0,
          error: locale === "th" ? "ยกเลิกการดาวน์โหลดแล้ว" : "Download cancelled",
        });
      } else {
        setProgress({
          phase: "error",
          current: 0,
          total: chosenItems.length,
          percent: 0,
          error: (err as Error)?.message || (locale === "th" ? "เกิดข้อผิดพลาดในการดาวน์โหลด" : "Download failed"),
        });
      }
    } finally {
      abortControllerRef.current = null;
    }
  }

  function handleCancel() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setProgress(null);
    setIsDone(false);
  }

  const isDownloading = progress && ["preparing", "downloading", "zipping", "saving"].includes(progress.phase);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isDownloading) {
          // If closing while in flight, confirm abort
          handleCancel();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl bg-card border-border/60 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <FolderArchive className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>{locale === "th" ? "ดาวน์โหลดชุดเอกสาร (.ZIP)" : "Download Resource Pack (.ZIP)"}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {courseCode}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {courseTitle ? `${typeof courseTitle === "object" ? t(courseTitle, locale) : courseTitle} · ` : ""}
                {locale === "th"
                  ? "รวมไฟล์เอกสารและแบบฝึกหัดเข้าด้วยกัน ดาวน์โหลดครั้งเดียวเปิดอ่านได้ทันที"
                  : "Bundle course resources into a single ZIP archive for offline study"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body Container */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Download in progress state */}
          {isDownloading ? (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 shadow-inner">
                {progress?.phase === "zipping" ? (
                  <Archive className="size-8 text-primary animate-pulse" />
                ) : (
                  <Download className="size-8 text-primary animate-bounce" />
                )}
              </div>

              <div className="space-y-1 max-w-xs">
                <h3 className="text-sm font-semibold text-foreground">
                  {progress?.phase === "zipping"
                    ? locale === "th"
                      ? "กำลังบีบอัดและสร้างไฟล์ ZIP..."
                      : "Compressing into ZIP archive..."
                    : progress?.phase === "saving"
                      ? locale === "th"
                        ? "กำลังส่งไฟล์เข้าสู่การดาวน์โหลด..."
                        : "Handing file to browser..."
                      : locale === "th"
                        ? `กำลังดาวน์โหลดไฟล์ (${progress?.current}/${progress?.total})`
                        : `Downloading files (${progress?.current}/${progress?.total})`}
                </h3>
                {progress?.currentFileName && (
                  <p className="text-[11px] text-muted-foreground truncate font-mono bg-muted/40 px-2 py-0.5 rounded-md">
                    {progress.currentFileName}
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted border border-border/40">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${progress?.percent ?? 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{progress?.percent}%</span>
                  <span>{progress?.current}/{progress?.total} {locale === "th" ? "ไฟล์" : "files"}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="rounded-full text-xs text-muted-foreground hover:text-foreground mt-2"
              >
                <X className="size-3 mr-1" />
                {locale === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
            </div>
          ) : isDone ? (
            /* Completed Success State */
            <div className="py-6 flex flex-col items-center text-center space-y-4 animate-in fade-in-0 duration-300">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  {locale === "th" ? "สร้างไฟล์ ZIP เรียบร้อยแล้ว!" : "Resource Pack Ready!"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {locale === "th"
                    ? "เบราว์เซอร์เริ่มดาวน์โหลดไฟล์แล้ว หากไม่ขึ้นกรุณากดปุ่มด้านล่าง"
                    : "Your browser has initiated the download."}
                </p>
              </div>

              {/* Summary Card */}
              <div className="w-full rounded-xl border border-border/50 bg-muted/30 p-3 text-left space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">{locale === "th" ? "ชื่อไฟล์:" : "Filename:"}</span>
                  <span className="font-mono text-foreground">{suggestedZipName}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">{locale === "th" ? "จำนวนไฟล์:" : "Total files:"}</span>
                  <span className="text-foreground">{chosenItems.length} {locale === "th" ? "ไฟล์" : "files"}</span>
                </div>
                {progress?.blobSize && (
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">{locale === "th" ? "ขนาด ZIP:" : "ZIP size:"}</span>
                    <span className="text-foreground">{formatBytes(progress.blobSize)}</span>
                  </div>
                )}
              </div>

              {/* Warning for skipped files if any */}
              {progress?.failedItems && progress.failedItems.length > 0 && (
                <div className="w-full text-left p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs space-y-1">
                  <div className="flex items-center gap-1 font-semibold">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{locale === "th" ? `ข้ามไป ${progress.failedItems.length} ไฟล์:` : `Skipped ${progress.failedItems.length} files:`}</span>
                  </div>
                  <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                    {progress.failedItems.map((f, i) => (
                      <li key={i} className="truncate">{f.fileName}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 w-full pt-2">
                <Button
                  variant="outline"
                  onClick={handleStartDownload}
                  className="flex-1 rounded-full text-xs"
                >
                  <Download className="size-3 mr-1" />
                  {locale === "th" ? "ดาวน์โหลดอีกครั้ง" : "Download Again"}
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 rounded-full text-xs font-semibold"
                >
                  <Check className="size-3 mr-1" />
                  {locale === "th" ? "เสร็จสิ้น" : "Done"}
                </Button>
              </div>
            </div>
          ) : (
            /* Selection State */
            <div className="space-y-4">
              {progress?.error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{progress.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {locale === "th" ? "เลือกชุดเอกสารที่ต้องการรวมแพ็ก:" : "Choose Resource Pack to Download:"}
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {/* Custom Target (if supplied) */}
                  {customItems && customItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("custom")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "custom"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                          <Package className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground truncate">
                            {customPackName || (locale === "th" ? "ชุดเอกสารที่เลือก" : "Selected Custom Pack")}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {customItems.length} {locale === "th" ? "ไฟล์" : "files"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "custom" && (
                        <Check className="size-4 text-primary shrink-0 ml-2" />
                      )}
                    </button>
                  )}

                  {/* Exercises Card — Highlighted */}
                  {(categorized.get("exercise")?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("exercise")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "exercise"
                          ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <FlaskConical className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <span>{locale === "th" ? "แบบฝึกหัดและการบ้านทั้งหมด" : "All Exercises & Labs"}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              {locale === "th" ? "แนะนำ" : "Popular"}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {categorized.get("exercise")?.length} {locale === "th" ? "ไฟล์โจทย์และแบบฝึกหัด" : "exercise sheets"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "exercise" && (
                        <Check className="size-4 text-emerald-500 shrink-0 ml-2" />
                      )}
                    </button>
                  )}

                  {/* Lecture Slides */}
                  {(categorized.get("lecture")?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("lecture")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "lecture"
                          ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <ScrollText className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground">
                            {locale === "th" ? "สไลด์บรรยายทั้งหมด" : "All Lecture Slides"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {categorized.get("lecture")?.length} {locale === "th" ? "ไฟล์สไลด์เรียน" : "slide decks"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "lecture" && (
                        <Check className="size-4 text-blue-500 shrink-0 ml-2" />
                      )}
                    </button>
                  )}

                  {/* Cheatsheets */}
                  {(categorized.get("cheatsheet")?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("cheatsheet")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "cheatsheet"
                          ? "border-yellow-500 bg-yellow-500/5 ring-1 ring-yellow-500/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                          <Sigma className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground">
                            {locale === "th" ? "ชีทสรุปสูตรทั้งหมด" : "All Formula Cheatsheets"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {categorized.get("cheatsheet")?.length} {locale === "th" ? "ฉบับสรุปก่อนสอบ" : "cheatsheets"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "cheatsheet" && (
                        <Check className="size-4 text-yellow-500 shrink-0 ml-2" />
                      )}
                    </button>
                  )}

                  {/* Past Exam Papers */}
                  {(categorized.get("exam")?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("exam")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "exam"
                          ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          <FileText className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground">
                            {locale === "th" ? "ข้อสอบเก่าทั้งหมด" : "All Past Exam Papers"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {categorized.get("exam")?.length} {locale === "th" ? "ชุดข้อสอบจริงพร้อมเฉลย" : "past papers & solutions"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "exam" && (
                        <Check className="size-4 text-purple-500 shrink-0 ml-2" />
                      )}
                    </button>
                  )}

                  {/* Active Filters (if active) */}
                  {filteredAssets && filteredAssets.length > 0 && filteredAssets.length < assets.length && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("filtered")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "filtered"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                          <Filter className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground">
                            {locale === "th" ? "ตามผลการค้นหา/ตัวกรองปัจจุบัน" : "Current Filter / Search Results"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {filteredAssets.length} {locale === "th" ? "ไฟล์ที่ตรงกับเงื่อนไข" : "matching files"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "filtered" && (
                        <Check className="size-4 text-primary shrink-0 ml-2" />
                      )}
                    </button>
                  )}

                  {/* All Course Materials */}
                  {assets.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedTarget("all")}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTarget === "all"
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                          <Layers className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground">
                            {locale === "th" ? "เอกสารทั้งหมดของวิชานี้ (All-in-One)" : "All Course Materials (All-in-One)"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {assets.length} {locale === "th" ? "ไฟล์ทั้งหมดในคลัง" : "total files in library"}
                          </div>
                        </div>
                      </div>
                      {selectedTarget === "all" && (
                        <Check className="size-4 text-primary shrink-0 ml-2" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="pt-2 border-t border-border/40 space-y-2 text-xs">
                {(selectedTarget === "all" || selectedTarget === "filtered") && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox
                      checked={groupByCategory}
                      onCheckedChange={(c) => setGroupByCategory(Boolean(c))}
                    />
                    <span className="text-foreground">
                      {locale === "th"
                        ? "จัดแยกโฟลเดอร์ตามหมวดหมู่ (exercises/, lectures/, ...)"
                        : "Organize into folders (exercises/, lectures/, ...)"}
                    </span>
                  </label>
                )}

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={includeManifest}
                    onCheckedChange={(c) => setIncludeManifest(Boolean(c))}
                  />
                  <span className="text-muted-foreground">
                    {locale === "th"
                      ? "แนบไฟล์ README.txt สรุปสารบัญและเครดิตใน ZIP"
                      : "Include README.txt index manifest in ZIP"}
                  </span>
                </label>
              </div>

              {/* Start Download Button */}
              <div className="pt-2">
                <Button
                  onClick={handleStartDownload}
                  disabled={chosenItems.length === 0}
                  className="w-full rounded-full py-2.5 text-xs font-semibold shadow-xs cursor-pointer gap-2"
                >
                  <Download className="size-4" />
                  <span>
                    {locale === "th"
                      ? `สร้างและเริ่มดาวน์โหลด ZIP (${chosenItems.length} ไฟล์${
                          totalSizeBytes > 0 ? ` · ~${formatBytes(totalSizeBytes)}` : ""
                        })`
                      : `Pack & Download ZIP (${chosenItems.length} files${
                          totalSizeBytes > 0 ? ` · ~${formatBytes(totalSizeBytes)}` : ""
                        })`}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
