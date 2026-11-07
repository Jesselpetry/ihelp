"use client";

import { Calculator, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseCalculator } from "@/lib/exams/grade-calculator";

interface CalculatorHeaderProps {
  course: CourseCalculator;
  onResetCourse: () => void;
}

export function CalculatorHeader({ course, onResetCourse }: CalculatorHeaderProps) {
  return (
    <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 p-4 sm:p-5 shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Course Info & Title */}
        <div className="flex items-center gap-3">
          <div className="size-11 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
            <Calculator className="size-5.5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-white shadow-2xs"
                style={{ backgroundColor: course.color || "#4c93ff" }}
              >
                {course.shortCode}
              </span>
              <span className="font-mono text-xs text-muted-foreground font-semibold">
                {course.code}
              </span>
              <Badge variant="secondary" className="text-[10px] font-normal py-0 px-2 h-4.5">
                {course.credits} หน่วยกิต
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold py-0 px-2 h-4.5 ${
                  course.mode === "pass_fail"
                    ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                    : "border-primary/40 text-primary bg-primary/10"
                }`}
              >
                {course.mode === "pass_fail" ? "ตัดเกรด S / U" : "ตัดเกรด A – F"}
              </Badge>
            </div>
            <h2 className="mt-0.5 text-base sm:text-lg font-bold text-foreground truncate">
              {course.nameTh}
              <span className="ml-2 text-xs font-normal text-muted-foreground hidden sm:inline">
                ({course.nameEn})
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Reset Action */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetCourse}
            title="ล้างคะแนนที่กรอกในวิชานี้"
            className="h-8.5 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80"
          >
            <RotateCcw className="size-3.5" />
            <span>ล้างคะแนนวิชานี้</span>
          </Button>
        </div>
      </div>

      {course.notes && (
        <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground/90 flex items-center gap-1.5">
          <span className="font-medium text-foreground/80">เกณฑ์ประมวลการสอน:</span>
          <span>{course.notes}</span>
        </div>
      )}
    </div>
  );
}

