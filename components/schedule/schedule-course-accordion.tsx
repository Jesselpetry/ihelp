"use client";

import { Calendar, Check, ChevronDown, Clock, MapPin, User } from "lucide-react";
import { SURFACE } from "@/components/course-hub-shared";
import { CourseCodeBadge } from "@/components/grades/course-code-badge";
import type { SectionEntry, TimetableCourse } from "@/lib/schedule/types";

/**
 * Standardized Section Selection Table Component
 * Used identically for both Theory (Lecture) and Practice (Lab) sections.
 */
function SectionSelectTable({
  title,
  sections,
  selectedSec,
  onSelectSec,
}: {
  title: string;
  sections: SectionEntry[];
  selectedSec: number;
  onSelectSec: (sec: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-bold text-foreground">
        {title}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
        <table className="w-full min-w-[880px] table-fixed text-left text-xs">
          <colgroup>
            <col className="w-12" />
            <col className="w-24" />
            <col className="w-20" />
            <col className="w-32" />
            <col className="w-24" />
            <col className="w-20" />
            <col className="w-48" />
            <col className="min-w-[280px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground font-semibold">
              <th className="w-12 py-3 px-3.5 text-center">เลือก</th>
              <th className="w-24 py-3 px-3.5">Section</th>
              <th className="w-20 py-3 px-3.5">วัน</th>
              <th className="w-32 py-3 px-3.5">เวลา</th>
              <th className="w-24 py-3 px-3.5">ห้องเรียน</th>
              <th className="w-20 py-3 px-3.5">อาคาร</th>
              <th className="w-48 py-3 px-3.5">อาจารย์ผู้สอน</th>
              <th className="py-3 px-3.5">เงื่อนไข / หมายเหตุ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sections.map((sec) => {
              const isSelected = sec.section === selectedSec;

              return (
                <tr
                  key={sec.section}
                  onClick={() => onSelectSec(sec.section)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/30 text-foreground"
                  }`}
                >
                  <td className="py-3 px-3.5 text-center align-middle">
                    <div
                      className={`mx-auto flex size-4 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                          : "border-border/80 bg-muted/30"
                      }`}
                    >
                      {isSelected && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 font-bold whitespace-nowrap">
                    Section {sec.section}
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
                      วัน{sec.timeSlot.day}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3 text-primary" />
                      <span>{sec.timeSlot.timeStr}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-primary" />
                      <span>{sec.timeSlot.room}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap text-muted-foreground">
                    {sec.timeSlot.building}
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="space-y-0.5 truncate">
                      {sec.instructors.slice(0, 2).map((inst, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs truncate">
                          <User className="size-2.5 shrink-0 text-primary" />
                          <span className="truncate">{inst}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-xs text-foreground/80 leading-relaxed">
                    {sec.condition}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ScheduleCourseAccordion({
  course,
  selectedTheorySec,
  selectedLabSec,
  isOpen,
  onToggle,
  onSelectTheorySec,
  onSelectLabSec,
}: {
  course: TimetableCourse;
  selectedTheorySec: number;
  selectedLabSec?: number;
  isOpen: boolean;
  onToggle: () => void;
  onSelectTheorySec: (sec: number) => void;
  onSelectLabSec?: (sec: number) => void;
}) {
  const theorySections = course.sections.filter((s) => s.type === "ทฤษฎี");
  const labSections = course.sections.filter((s) => s.type === "ปฏิบัติ");

  return (
    <div
      id={`course-${course.code}`}
      className={`${SURFACE} border border-border/40 overflow-hidden transition-all h-auto`}
    >
      {/* Clean Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-3.5 text-left transition-colors hover:bg-muted/40 sm:p-4 cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CourseCodeBadge code={course.abbr || course.code} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">
                {course.nameEn}
              </span>
              <span className="text-xs text-muted-foreground">
                ({course.code})
              </span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {course.nameTh}
            </div>
          </div>
        </div>

        {/* Section Badge aligned to the right, beside the toggle chevron */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary whitespace-nowrap">
            Sec {selectedTheorySec}
            {course.hasLab && selectedLabSec ? ` / Lab ${selectedLabSec}` : ""}
          </span>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content with smooth CSS Grid slide down/up animation */}
      <div
        className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/40 bg-muted/15 p-3.5 space-y-4 sm:p-4">
            {/* Exam Dates Info */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-card px-2.5 py-1 text-muted-foreground">
                <Calendar className="size-3 text-primary" />
                <span>
                  <strong>Midterm:</strong> {course.midterm.date}{" "}
                  {course.midterm.time !== "-" ? `(${course.midterm.time})` : ""}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-card px-2.5 py-1 text-muted-foreground">
                <Calendar className="size-3 text-primary" />
                <span>
                  <strong>Final:</strong> {course.final.date}{" "}
                  {course.final.time !== "-" ? `(${course.final.time})` : ""}
                </span>
              </div>
            </div>

            {/* Theory Section Table */}
            <SectionSelectTable
              title="กลุ่มเรียนทฤษฎี (Lecture)"
              sections={theorySections}
              selectedSec={selectedTheorySec}
              onSelectSec={onSelectTheorySec}
            />

            {/* Lab Section Table (if course has lab) */}
            {course.hasLab && labSections.length > 0 && onSelectLabSec && (
              <SectionSelectTable
                title="กลุ่มเรียนปฏิบัติ (Lab)"
                sections={labSections}
                selectedSec={selectedLabSec ?? labSections[0].section}
                onSelectSec={onSelectLabSec}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
