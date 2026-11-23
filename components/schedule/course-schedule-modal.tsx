"use client";

import { useState } from "react";
import {
  Calendar,
  CalendarOff,
  CheckCircle2,
  DoorClosed,
  User,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CourseCodeBadge } from "@/components/grades/course-code-badge";
import {
  getCourseSectionMeetingTimeline,
  type CourseMeetingItem,
} from "@/lib/schedule/ics-export";
import type { TimetableCourse } from "@/lib/schedule/types";

interface CourseScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: TimetableCourse;
  selectedTheorySec: number;
  selectedLabSec?: number;
}

export function CourseScheduleModal({
  isOpen,
  onClose,
  course,
  selectedTheorySec,
  selectedLabSec,
}: CourseScheduleModalProps) {
  const theorySections = course.sections.filter((s) => s.type === "ทฤษฎี");
  const labSections = course.sections.filter((s) => s.type === "ปฏิบัติ");

  // Allow student to switch between viewing Theory and Lab or other sections in modal
  const [activeType, setActiveType] = useState<"ทฤษฎี" | "ปฏิบัติ">("ทฤษฎี");
  const [activeSecNum, setActiveSecNum] = useState<number>(selectedTheorySec);

  // Sync with prop updates
  const currentSections = activeType === "ทฤษฎี" ? theorySections : labSections;
  const currentSec =
    currentSections.find((s) => s.section === activeSecNum) ??
    currentSections[0] ??
    course.sections[0];

  const timeline: CourseMeetingItem[] = currentSec
    ? getCourseSectionMeetingTimeline(currentSec)
    : [];

  const teachingSessionsCount = timeline.filter((t) => t.type === "class").length;
  const offDaysCount = timeline.filter((t) => t.type !== "class").length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] sm:w-full sm:max-w-2xl p-0 overflow-hidden border border-border/60 shadow-2xl rounded-2xl max-h-[88vh] flex flex-col bg-card"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 p-4 sm:p-5 bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CourseCodeBadge code={course.abbr || course.code} />
              <DialogTitle className="text-base font-bold text-foreground">
                {course.nameEn}
              </DialogTitle>
              <span className="text-xs text-muted-foreground font-mono">
                ({course.code})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{course.nameTh}</span>
              <span>•</span>
              <span>{course.credits}</span>
              <span>•</span>
              <span className="rounded-md bg-muted px-1.5 py-0.2 font-medium">
                {course.category}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Section Picker / Type Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-4 py-2.5 bg-muted/10 text-xs">
          {/* Theory vs Lab tabs (if course has lab) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveType("ทฤษฎี");
                setActiveSecNum(selectedTheorySec);
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                activeType === "ทฤษฎี"
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              ทฤษฎี (Lecture)
            </button>
            {course.hasLab && labSections.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveType("ปฏิบัติ");
                  setActiveSecNum(selectedLabSec ?? labSections[0].section);
                }}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  activeType === "ปฏิบัติ"
                    ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                ปฏิบัติ (Lab)
              </button>
            )}
          </div>

          {/* Section Number Selector pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-[11px]">เลือกดู Section:</span>
            <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5">
              {currentSections.map((sec) => (
                <button
                  key={sec.section}
                  type="button"
                  onClick={() => setActiveSecNum(sec.section)}
                  className={`rounded px-2 py-0.5 text-xs font-mono transition-colors cursor-pointer ${
                    currentSec?.section === sec.section
                      ? "bg-card text-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sec {sec.section}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Section Info Card */}
        {currentSec && (
          <div className="border-b border-border/40 bg-muted/20 px-4 py-3 sm:px-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {currentSec.type} Section {currentSec.section}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  วัน{currentSec.timeSlot.day} {currentSec.timeSlot.timeStr}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-400 px-2 py-0.5 font-medium">
                  <CheckCircle2 className="size-3" />
                  {teachingSessionsCount} คาบเรียน
                </span>
                {offDaysCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-400 px-2 py-0.5 font-medium">
                    <CalendarOff className="size-3" />
                    งดเรียน {offDaysCount} วัน
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <DoorClosed className="size-3.5 text-primary shrink-0" />
                <span>
                  ห้อง <strong className="text-foreground">{currentSec.timeSlot.room}</strong> (อาคาร {currentSec.timeSlot.building})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 text-primary shrink-0" />
                <span>
                  อาจารย์: <span className="text-foreground/90">{currentSec.instructors.join(", ")}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Meeting Timeline List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 divide-y-0">
          <div className="space-y-1.5">
            {timeline.map((item, idx) => {
              if (item.type === "class") {
                return (
                  <div
                    key={`${item.dateIso}-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold font-mono text-primary">
                        {item.sessionNumber}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {item.dateTh}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.timeStr} • ห้อง {item.room} ({item.building})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {item.note}
                      </span>
                    </div>
                  </div>
                );
              }

              // Holiday or Midterm Break
              const isMidterm = item.type === "midterm_break";
              return (
                <div
                  key={`${item.dateIso}-${idx}`}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 ${
                    isMidterm
                      ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
                      : "border-border/60 bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] text-muted-foreground">
                      <CalendarOff className="size-3.5" />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {item.dateTh}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.note}
                      </div>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                        isMidterm
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-border/60 bg-muted text-muted-foreground"
                      }`}
                    >
                      {isMidterm ? "สัปดาห์สอบกลางภาค" : "วันหยุดราชการ"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer with Exam Logistics & Close */}
        <div className="border-t border-border/60 bg-muted/20 p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-2">
          {/* Exam Logistics Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {course.midterm && course.midterm.date && (
              <div className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-card px-2 py-0.5 text-[11px]">
                <Calendar className="size-3 text-primary" />
                <span>
                  <strong>Midterm:</strong> {course.midterm.date} ({course.midterm.time})
                </span>
              </div>
            )}
            {course.final && course.final.date && (
              <div className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-card px-2 py-0.5 text-[11px]">
                <Calendar className="size-3 text-primary" />
                <span>
                  <strong>Final:</strong> {course.final.date} ({course.final.time})
                </span>
              </div>
            )}
          </div>

          <Button
            type="button"
            size="xs"
            variant="default"
            onClick={onClose}
            className="cursor-pointer font-semibold rounded-lg"
          >
            ปิดหน้าต่าง
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
