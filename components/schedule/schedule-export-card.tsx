"use client";

import { useState } from "react";
import { Calendar, Check, Copy, Download, FileCode2, FileSpreadsheet } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { Button } from "@/components/ui/button";
import {
  exportScheduleAsCsv,
  exportScheduleAsJson,
} from "@/lib/schedule/y1s2-data";
import { exportScheduleAsIcs } from "@/lib/schedule/ics-export";
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
  const [format, setFormat] = useState<"ics" | "json" | "csv">("ics");
  const [copied, setCopied] = useState(false);

  const icsContent = exportScheduleAsIcs(selection, courses, termInfo);
  const jsonContent = exportScheduleAsJson(selection, courses, termInfo);
  const csvContent = exportScheduleAsCsv(selection, courses);
  const activeContent =
    format === "ics" ? icsContent : format === "json" ? jsonContent : csvContent;

  function handleCopy() {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const termSuffix = termInfo ? `${termInfo.semester}_${termInfo.academicYear}` : "2_2569";
    const filename = `kmitl_it_schedule_${termSuffix}.${format}`;
    const mimeMap: Record<"ics" | "json" | "csv", string> = {
      ics: "text/calendar;charset=utf-8;",
      json: "application/json",
      csv: "text/csv;charset=utf-8;",
    };
    const blob = new Blob([activeContent], {
      type: mimeMap[format],
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
            ดาวน์โหลดไฟล์ปฏิทิน .ics สำหรับ Apple Calendar, Google Calendar, Outlook หรือส่งออก JSON / CSV เพื่อนำไปใช้ต่อ
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Format Switcher */}
          <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFormat("ics")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-mono transition-colors cursor-pointer ${
                format === "ics"
                  ? "bg-card text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="size-3.5 text-sky-400" />
              <span>ICS</span>
            </button>
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

      {format === "ics" && (
        <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs">
          <Calendar className="size-4 shrink-0 text-primary mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">
              คำนวณวันเรียนจริงตลอดภาคการศึกษา 2/2569
            </p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              ไฟล์ .ics ได้รับการคัดกรองวันหยุดราชการไทยและสัปดาห์สอบกลางภาคออกให้อัตโนมัติ พร้อมตั้งแจ้งเตือนล่วงหน้า 15 นาทีสำหรับคาบเรียน และ 1 วันสำหรับการสอบ
            </p>
          </div>
        </div>
      )}

      {/* Code preview block */}
      <div className="relative">
        <pre className="max-h-60 overflow-auto rounded-xl border border-border/50 bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground select-all">
          {activeContent}
        </pre>
      </div>
    </div>
  );
}
