"use client";

import { useState } from "react";
import { Check, Copy, Download, FileCode2, FileSpreadsheet } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { Button } from "@/components/ui/button";
import {
  exportScheduleAsCsv,
  exportScheduleAsJson,
} from "@/lib/schedule/y1s2-data";
import type {
  SemesterTermInfo,
  TimetableCourse,
  UserScheduleSelection,
} from "@/lib/schedule/types";

export function ScheduleExportCard({
  selection,
  courses,
  termInfo,
}: {
  selection: UserScheduleSelection;
  courses?: TimetableCourse[];
  termInfo?: SemesterTermInfo;
}) {
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [copied, setCopied] = useState(false);

  const jsonContent = exportScheduleAsJson(selection, courses, termInfo);
  const csvContent = exportScheduleAsCsv(selection, courses);
  const activeContent = format === "json" ? jsonContent : csvContent;

  function handleCopy() {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const termSuffix = termInfo ? `${termInfo.semester}_${termInfo.academicYear}` : "2_2569";
    const filename = `kmitl_it_schedule_${termSuffix}.${format}`;
    const blob = new Blob([activeContent], {
      type: format === "json" ? "application/json" : "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  return (
    <div id="export" className={`${SURFACE} border border-border/40 p-3.5 space-y-3 sm:p-4`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            ส่งออกข้อมูลตารางเรียน (Export Formats)
          </h3>
          <p className="text-xs text-muted-foreground">
            สามารถคัดลอกหรือดาวน์โหลดไฟล์ JSON หรือ CSV เพื่อนำไปใช้ต่อในระบบอื่นหรือแชร์ให้เพื่อน
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Format Switcher */}
          <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFormat("json")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-mono transition-colors cursor-pointer ${
                format === "json"
                  ? "bg-card text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCode2 className="size-3.5 text-primary" />
              <span>JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-mono transition-colors cursor-pointer ${
                format === "csv"
                  ? "bg-card text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileSpreadsheet className="size-3.5 text-emerald-500" />
              <span>CSV</span>
            </button>
          </div>

          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={handleCopy}
            className="cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-500 mr-1" />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="size-3 mr-1" />
                <span>คัดลอก</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            size="xs"
            variant="default"
            onClick={handleDownload}
            className="cursor-pointer"
          >
            <Download className="size-3 mr-1" />
            <span>ดาวน์โหลด</span>
          </Button>
        </div>
      </div>

      {/* Code preview block */}
      <div className="relative">
        <pre className="max-h-60 overflow-auto rounded-xl border border-border/50 bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground select-all">
          {activeContent}
        </pre>
      </div>
    </div>
  );
}
