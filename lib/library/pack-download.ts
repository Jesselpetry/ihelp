import JSZip from "jszip";
import { assetUrl } from "@/lib/library/asset-url";
import {
  formatBytes,
  resolveCategory,
  type AssetCategory,
  type SubjectAsset,
} from "@/lib/library/subject-library-ui";
import { t, type LText, type Locale } from "@/lib/i18n";

export interface PackItem {
  id?: string;
  title?: string | LText;
  fileName: string;
  url: string;
  category?: AssetCategory | string;
  scope?: string;
  chapter?: number;
  sizeBytes?: number;
}

export type PackPhase =
  | "idle"
  | "preparing"
  | "downloading"
  | "zipping"
  | "saving"
  | "done"
  | "cancelled"
  | "error";

export interface PackProgress {
  phase: PackPhase;
  current: number;
  total: number;
  percent: number;
  currentFileName?: string;
  error?: string;
  failedItems?: { fileName: string; reason: string }[];
  blobSize?: number;
}

export interface PackDownloadOptions {
  zipFileName: string;
  courseCode?: string;
  courseTitle?: string | LText;
  items: PackItem[];
  groupByCategory?: boolean;
  includeManifest?: boolean;
  locale?: Locale;
  signal?: AbortSignal;
  onProgress?: (progress: PackProgress) => void;
}

const CATEGORY_DIR_NAME: Record<string, string> = {
  exercise: "exercises",
  lecture: "lectures",
  cheatsheet: "cheatsheets",
  exam: "exams",
  note: "notes",
  reference: "references",
};

/**
 * Concurrency helper: processes items with up to `limit` active promises.
 */
async function pLimitMap<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
  signal?: AbortSignal,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from(
    { length: Math.min(limit, Math.max(1, items.length)) },
    async () => {
      while (currentIndex < items.length) {
        if (signal?.aborted) {
          throw new DOMException("Aborted", "AbortError");
        }
        const index = currentIndex++;
        results[index] = await fn(items[index], index);
      }
    },
  );

  await Promise.all(workers);
  return results;
}

/**
 * Converts a SubjectAsset into a PackItem.
 */
export function assetToPackItem(asset: SubjectAsset): PackItem {
  return {
    id: asset.id,
    title: asset.title,
    fileName: asset.fileName,
    url: asset.url,
    category: asset.category ?? resolveCategory(asset),
    scope: asset.scope,
    chapter: asset.chapter,
    sizeBytes: asset.sizeBytes,
  };
}

/**
 * Sanitizes a filename to ensure safe entry in ZIP archive.
 */
function sanitizeZipName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

/**
 * Downloads multiple assets, packages them into a .zip file in-memory using JSZip,
 * and triggers a native browser download.
 */
export async function downloadAssetPack({
  zipFileName,
  courseCode = "iHelp",
  courseTitle,
  items,
  groupByCategory = true,
  includeManifest = true,
  locale = "th",
  signal,
  onProgress,
}: PackDownloadOptions): Promise<{ blob: Blob; failedItems: { fileName: string; reason: string }[] }> {
  if (items.length === 0) {
    throw new Error(locale === "th" ? "ไม่มีไฟล์ในรายการที่เลือก" : "No items selected to pack");
  }

  onProgress?.({
    phase: "preparing",
    current: 0,
    total: items.length,
    percent: 0,
    currentFileName: locale === "th" ? "กำลังเตรียมการ..." : "Preparing...",
  });

  const zip = new JSZip();
  const failedItems: { fileName: string; reason: string }[] = [];
  const usedPaths = new Set<string>();
  const packedEntries: { path: string; title: string; size?: number }[] = [];

  let completedFetches = 0;

  await pLimitMap(
    items,
    3,
    async (item) => {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      const resolvedUrl = item.url.startsWith("/assets/") ? assetUrl(item.url) : item.url;
      const cleanName = sanitizeZipName(item.fileName);
      const folder = groupByCategory && item.category ? CATEGORY_DIR_NAME[item.category] || "misc" : "";

      let targetPath = folder ? `${folder}/${cleanName}` : cleanName;

      // Handle duplicate paths by incrementing a counter
      if (usedPaths.has(targetPath.toLowerCase())) {
        const dotIndex = cleanName.lastIndexOf(".");
        const baseName = dotIndex !== -1 ? cleanName.slice(0, dotIndex) : cleanName;
        const ext = dotIndex !== -1 ? cleanName.slice(dotIndex) : "";
        let counter = 1;
        while (usedPaths.has((folder ? `${folder}/${baseName} (${counter})${ext}` : `${baseName} (${counter})${ext}`).toLowerCase())) {
          counter++;
        }
        targetPath = folder ? `${folder}/${baseName} (${counter})${ext}` : `${baseName} (${counter})${ext}`;
      }
      usedPaths.add(targetPath.toLowerCase());

      onProgress?.({
        phase: "downloading",
        current: completedFetches,
        total: items.length,
        percent: Math.round((completedFetches / items.length) * 85),
        currentFileName: item.fileName,
      });

      try {
        const response = await fetch(resolvedUrl, { signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.arrayBuffer();
        zip.file(targetPath, data);

        packedEntries.push({
          path: targetPath,
          title: typeof item.title === "object" ? t(item.title, locale) : (item.title || item.fileName),
          size: data.byteLength,
        });
      } catch (err: unknown) {
        if (signal?.aborted) throw err;
        const errorMsg = err instanceof Error ? err.message : "Download failed";
        failedItems.push({ fileName: item.fileName, reason: errorMsg });
      } finally {
        completedFetches++;
        onProgress?.({
          phase: "downloading",
          current: completedFetches,
          total: items.length,
          percent: Math.round((completedFetches / items.length) * 85),
          currentFileName: item.fileName,
        });
      }
    },
    signal,
  );

  if (packedEntries.length === 0) {
    throw new Error(
      locale === "th"
        ? "ไม่สามารถดาวน์โหลดไฟล์ใดได้เลย กรุณาตรวจสอบการเชื่อมต่อ"
        : "Failed to download all selected files. Please check your connection.",
    );
  }

  // Include Manifest / README inside ZIP
  if (includeManifest) {
    const courseTitleStr = typeof courseTitle === "object" ? t(courseTitle, locale) : (courseTitle || courseCode);
    const dateStr = new Date().toLocaleString(locale === "th" ? "th-TH" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const lines = [
      "================================================================================",
      `iHelp — IT KMITL Study Resource Pack (${courseCode})`,
      "================================================================================",
      `Course / รายวิชา: ${courseCode} — ${courseTitleStr}`,
      `Generated / สร้างเมื่อ: ${dateStr}`,
      `Files Packaged / จำนวนไฟล์ที่รวมได้: ${packedEntries.length} / ${items.length}`,
      `Folders Organized / แยกโฟลเดอร์ตามหมวดหมู่: ${groupByCategory ? "Yes (ใช่)" : "No (ไม่)"}`,
      "",
      "--------------------------------------------------------------------------------",
      "Included Files / รายการไฟล์ในแพ็กนี้:",
      "--------------------------------------------------------------------------------",
      ...packedEntries.map(
        (entry, i) =>
          `${String(i + 1).padStart(2, "0")}. [${entry.path}] — ${entry.title}${
            entry.size ? ` (${formatBytes(entry.size)})` : ""
          }`,
      ),
    ];

    if (failedItems.length > 0) {
      lines.push(
        "",
        "--------------------------------------------------------------------------------",
        "Failed / Skipped Files (ไฟล์ที่ไม่สามารถดาวน์โหลดได้):",
        "--------------------------------------------------------------------------------",
        ...failedItems.map((f) => `- ${f.fileName} (${f.reason})`),
      );
    }

    lines.push(
      "",
      "================================================================================",
      "iHelp — แหล่งรวมชีทสรุป แบบฝึกหัด และคลังข้อสอบ คณะเทคโนโลยีสารสนเทศ สจล.",
      "Website: https://ihelp.chatan.in.th",
      "================================================================================",
    );

    zip.file("README.txt", lines.join("\n"));
  }

  onProgress?.({
    phase: "zipping",
    current: items.length,
    total: items.length,
    percent: 88,
    currentFileName: locale === "th" ? "กำลังบีบอัดและสร้างไฟล์ ZIP..." : "Compressing into ZIP...",
  });

  const blob = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.({
        phase: "zipping",
        current: items.length,
        total: items.length,
        percent: 88 + Math.round((metadata.percent / 100) * 11),
        currentFileName: metadata.currentFile ?? undefined,
      });
    },
  );

  onProgress?.({
    phase: "saving",
    current: items.length,
    total: items.length,
    percent: 100,
    blobSize: blob.size,
  });

  // Trigger browser download
  const cleanZipName = zipFileName.endsWith(".zip") ? zipFileName : `${zipFileName}.zip`;
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = cleanZipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

  onProgress?.({
    phase: "done",
    current: packedEntries.length,
    total: items.length,
    percent: 100,
    blobSize: blob.size,
    failedItems: failedItems.length > 0 ? failedItems : undefined,
  });

  return { blob, failedItems };
}

