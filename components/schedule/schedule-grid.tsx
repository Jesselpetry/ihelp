"use client";

import { useRef, useState } from "react";
import {
  CalendarDays,
  Camera,
  Check,
  Clock,
  LayoutGrid,
  MapPin,
  Printer,
  User,
} from "lucide-react";
import html2canvas from "html2canvas";
import { SURFACE } from "@/components/course-hub-shared";
import { CourseCodeBadge } from "@/components/grades/course-code-badge";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK, type ScheduledClassSlot } from "@/lib/schedule/y1s2-data";
import type { DayOfWeek } from "@/lib/schedule/types";

const DAY_BADGES: Record<
  DayOfWeek,
  {
    badge: string;
    text: string;
  }
> = {
  จันทร์: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
  },
  อังคาร: {
    badge: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
    text: "text-pink-600 dark:text-pink-400",
  },
  พุธ: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  พฤหัสบดี: {
    badge: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
  },
  ศุกร์: {
    badge: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
  },
};

interface GridCell {
  type: "class" | "lunch" | "empty";
  slot?: ScheduledClassSlot;
  colSpan: number;
  label?: string;
}

function buildDayCells(daySlots: ScheduledClassSlot[]): GridCell[] {
  const cells: GridCell[] = [];
  let h = 9;

  while (h <= 15) {
    const matching = daySlots.filter((s) => s.startHour === h);
    if (matching.length > 0) {
      const s = matching[0];
      const duration = s.endHour - s.startHour;
      cells.push({ type: "class", slot: s, colSpan: duration });
      h += duration;
    } else if (h === 12) {
      cells.push({ type: "lunch", colSpan: 1, label: "พักกลางวัน" });
      h += 1;
    } else {
      const emptyStart = h;
      while (h <= 15) {
        const hasClass = daySlots.some((s) => s.startHour === h);
        if (hasClass || h === 12) break;
        h += 1;
      }
      const span = h - emptyStart;
      const isMorning = emptyStart < 12;
      cells.push({
        type: "empty",
        colSpan: span,
        label: isMorning
          ? `ช่วงเช้าว่าง (${String(emptyStart).padStart(2, "0")}:00 - ${String(h).padStart(2, "0")}:00)`
          : `ช่วงบ่ายว่าง (${String(emptyStart).padStart(2, "0")}:00 - ${String(h).padStart(2, "0")}:00)`,
      });
    }
  }

  return cells;
}

export function ScheduleGrid({ slots }: { slots: ScheduledClassSlot[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "daily">("grid");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("จันทร์");
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const timetableRef = useRef<HTMLDivElement>(null);

  async function handleSaveImage() {
    if (!timetableRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(timetableRef.current, {
        scale: 2,
        backgroundColor: "#141416",
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "kmitl_it_timetable_2_2569.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      // ignore
    } finally {
      setIsExporting(false);
    }
  }

  function handlePrintPdf() {
    window.print();
  }

  // Filter slots for daily view
  const currentDaySlots = slots
    .filter((s) => s.day === selectedDay)
    .sort(
      (a, b) =>
        a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute),
    );

  return (
    <div className={`${SURFACE} border border-border/40 p-3 sm:p-4 space-y-3.5 overflow-hidden`}>
      {/* View Mode & Export Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        {/* Toggle Grid vs Daily View */}
        <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-card text-foreground font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-3.5 text-primary" />
            <span>ตารางรวมสัปดาห์ (Grid)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("daily")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              viewMode === "daily"
                ? "bg-card text-foreground font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="size-3.5 text-primary" />
            <span>มุมมองรายวัน (Daily)</span>
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={handleSaveImage}
            disabled={isExporting}
            className="cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="size-3 text-emerald-500 mr-1" />
                <span>บันทึกรูปภาพแล้ว</span>
              </>
            ) : (
              <>
                <Camera className="size-3 text-primary mr-1" />
                <span>{isExporting ? "กำลังประมวลผล..." : "เซฟเป็นรูป (PNG)"}</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={handlePrintPdf}
            className="cursor-pointer"
          >
            <Printer className="size-3 text-primary mr-1" />
            <span>พิมพ์ / เซฟ PDF</span>
          </Button>
        </div>
      </div>

      {/* Grid View: Fixed-size Columns and Fixed-height Cells */}
      {viewMode === "grid" && (
        <div ref={timetableRef} className="overflow-x-auto p-1 bg-card rounded-xl">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground font-semibold">
                <th className="w-[84px] py-2.5 px-2 text-center border-r border-border/40">
                  วัน
                </th>
                <th className="w-[128px] py-2.5 px-2 text-center">09:00 - 10:00</th>
                <th className="w-[128px] py-2.5 px-2 text-center">10:00 - 11:00</th>
                <th className="w-[128px] py-2.5 px-2 text-center">11:00 - 12:00</th>
                <th className="w-[88px] py-2.5 px-1 text-center bg-muted/60 text-muted-foreground/80">
                  12:00 - 13:00
                </th>
                <th className="w-[128px] py-2.5 px-2 text-center">13:00 - 14:00</th>
                <th className="w-[128px] py-2.5 px-2 text-center">14:00 - 15:00</th>
                <th className="w-[128px] py-2.5 px-2 text-center">15:00 - 16:00</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = slots.filter((s) => s.day === day);
                const cells = buildDayCells(daySlots);
                const badgeStyle = DAY_BADGES[day].badge;

                return (
                  <tr key={day} className="transition-colors hover:bg-muted/15">
                    {/* Fixed Day Column */}
                    <td className="w-[84px] py-2 px-2 text-center align-middle border-r border-border/40 bg-card">
                      <span
                        className={`inline-block w-full rounded-md border py-1.5 text-xs font-bold text-center ${badgeStyle}`}
                      >
                        วัน{day}
                      </span>
                    </td>

                    {/* Fixed Width & Height Class Cells */}
                    {cells.map((cell, idx) => {
                      if (cell.type === "class" && cell.slot) {
                        const s = cell.slot;
                        return (
                          <td
                            key={`cell-${day}-${idx}`}
                            colSpan={cell.colSpan}
                            className="p-1 align-top"
                          >
                            <div className="flex h-[105px] flex-col justify-between rounded-xl border border-border/70 bg-card p-2 shadow-2xs transition-all hover:border-primary/50">
                              <div className="space-y-0.5">
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <CourseCodeBadge
                                    code={s.abbr || s.courseCode}
                                    className="text-[10px] py-0 px-1.5 min-w-10"
                                  />
                                  <span className="rounded-md bg-muted px-1.5 py-0.2 text-[10px] font-semibold text-foreground">
                                    {s.type} Sec {s.section}
                                  </span>
                                </div>
                                <div className="text-xs font-bold text-foreground line-clamp-1">
                                  {s.courseNameEn}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground border-t border-border/40 pt-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="size-2.5 text-primary" />
                                  <span>{s.timeStr}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="size-2.5 text-primary" />
                                  <span>{s.room}</span>
                                </div>
                              </div>

                              {/* Separate instructors into 2 lines */}
                              <div className="space-y-0.5 text-[10px] text-muted-foreground">
                                {s.instructors.slice(0, 2).map((inst, i) => (
                                  <div key={i} className="flex items-center gap-1 truncate">
                                    <User className="size-2.5 shrink-0 text-primary" />
                                    <span className="truncate">{inst}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      if (cell.type === "lunch") {
                        return (
                          <td
                            key={`cell-${day}-${idx}`}
                            colSpan={cell.colSpan}
                            className="p-1 text-center align-middle"
                          >
                            <div className="flex h-[105px] items-center justify-center rounded-xl border border-dashed border-border/40 bg-muted/20 px-1 text-center text-xs text-muted-foreground">
                              {cell.label}
                            </div>
                          </td>
                        );
                      }

                      // Empty period
                      return (
                        <td
                          key={`cell-${day}-${idx}`}
                          colSpan={cell.colSpan}
                          className="p-1 text-center align-middle"
                        >
                          <div className="flex h-[105px] items-center justify-center rounded-xl border border-dashed border-border/40 bg-muted/10 px-2 text-center text-[11px] text-muted-foreground/70">
                            {cell.label}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Daily View Mode */}
      {viewMode === "daily" && (
        <div className="space-y-4">
          {/* Day Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS_OF_WEEK.map((day) => {
              const isCurrent = selectedDay === day;
              const count = slots.filter((s) => s.day === day).length;
              const badgeStyle = DAY_BADGES[day].badge;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isCurrent
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                      : "border-border/50 bg-card hover:bg-muted/40"
                  }`}
                >
                  <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${badgeStyle}`}>
                    วัน{day}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ({count} คาบ)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards for the selected day */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentDaySlots.map((s, idx) => (
              <div
                key={`${s.courseCode}-${s.section}-${idx}`}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-3 transition-all hover:border-primary/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <CourseCodeBadge code={s.abbr || s.courseCode} />
                      <span className="text-xs text-muted-foreground">
                        {s.courseCode}
                      </span>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                      {s.type} Sec {s.section}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {s.courseNameEn}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.courseNameTh}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-border/40 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    <span>{s.timeStr}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    <span>ห้อง {s.room} (อาคาร {s.building})</span>
                  </div>
                  <div className="space-y-0.5 pt-1">
                    {s.instructors.slice(0, 2).map((inst, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <User className="size-3.5 text-primary" />
                        <span>{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {currentDaySlots.length === 0 && (
              <div className="col-span-full flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-border/40 p-4 text-center text-xs text-muted-foreground">
                <CalendarDays className="size-6 text-muted-foreground/50 mb-1.5" />
                <span>ไม่มีคาบเรียนในวัน{selectedDay}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
