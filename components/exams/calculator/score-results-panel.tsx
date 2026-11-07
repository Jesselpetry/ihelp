"use client";

import { Target, Check } from "lucide-react";
import type { CourseCalculator } from "@/lib/exams/grade-calculator";
import { calculateCourseResult, calculateFinalTargets } from "@/lib/exams/grade-calculator";

interface ScoreResultsPanelProps {
  course: CourseCalculator;
}

export function ScoreResultsPanel({ course }: ScoreResultsPanelProps) {
  const result = calculateCourseResult(course);
  const targets = calculateFinalTargets(course);
  const isPassFail = course.mode === "pass_fail";
  const minPassingScore = course.cutoffs[0]?.min || (course.id === "charm" ? 60 : 50);

  return (
    <div className="space-y-4">
      {/* ── 1. Total Score & Projected Grade ── */}
      <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 p-5 sm:p-6 shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          คะแนนรวมปัจจุบัน & เกรดที่คาดว่าจะได้
        </span>

        <div className="mt-3.5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-mono font-black text-foreground">
                {result.totalScore.toFixed(1)}
              </span>
              <span className="text-sm font-mono text-muted-foreground font-semibold">
                / {result.maxScore}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-0.5 block">
              คิดเป็น{" "}
              <span className="font-mono font-bold text-foreground">
                {result.percentage.toFixed(1)}%
              </span>{" "}
              ของวิชานี้
            </span>
          </div>

          {/* Grade Badge */}
          <div className="text-center shrink-0">
            <div
              className={`size-16 sm:size-18 rounded-2xl flex items-center justify-center font-mono font-black text-3xl sm:text-4xl shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] ${
                result.grade === "A" || result.grade === "S"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : result.grade === "F" || result.grade === "U"
                  ? "bg-destructive/15 text-destructive border border-destructive/30"
                  : "bg-primary/15 text-primary border border-primary/30"
              }`}
            >
              {result.grade}
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground mt-1 block">
              {isPassFail
                ? result.grade === "S"
                  ? "ผ่านเกณฑ์ (Pass)"
                  : "ยังไม่ผ่าน (Pending)"
                : `แต้ม ${result.point.toFixed(1)}`}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="h-2.5 w-full bg-muted dark:bg-black/30 dark:shadow-inner rounded-full overflow-hidden flex">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, result.percentage))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>0</span>
            {isPassFail ? (
              <>
                <span>เกณฑ์ผ่าน S &ge; {minPassingScore}</span>
                <span>100</span>
              </>
            ) : (
              <>
                <span>F &lt; 50</span>
                <span>C: 60</span>
                <span>B: 70</span>
                <span>A: 80</span>
                <span>100</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Final Exam Target Score Roadmap ── */}
      {targets && targets.finalCategory && (
        <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 p-5 shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Target className="size-4 text-primary shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                {isPassFail
                  ? "คะแนนที่ต้องได้ใน Final เพื่อผ่านเกณฑ์ (S)"
                  : "คะแนนที่ต้องได้ใน Final เพื่อเกรดเป้าหมาย"}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                คะแนนเก็บตอนนี้ {targets.currentWithoutFinal.toFixed(1)} · สัดส่วน Final{" "}
                {targets.finalCategory.weight}%
                {isPassFail ? ` · เกณฑ์ผ่าน ${minPassingScore} คะแนน` : ""}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {targets.targets.map((tgt) => {
              const isGradeS = tgt.grade === "S";

              return (
                <div
                  key={tgt.grade}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                    tgt.status === "achieved"
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200"
                      : tgt.status === "impossible"
                      ? "border-border/50 bg-muted/20 text-muted-foreground opacity-60"
                      : "border-border/80 dark:border-white/5 bg-background/50 dark:bg-black/20 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm w-7">{tgt.grade}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {isGradeS ? "(เกรดผ่านหลักสูตร)" : `(≥ ${tgt.minTotal} คะแนน)`}
                    </span>
                  </div>

                  <div className="text-right">
                    {tgt.status === "achieved" && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="size-3.5" />
                        <span>ผ่านเกณฑ์แล้ว 🎉</span>
                      </span>
                    )}

                    {tgt.status === "achievable" && (
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-bold text-primary">
                          ต้องการ {tgt.neededOnFinal.toFixed(1)} / {targets.finalCategory?.weight}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({tgt.percentageOfFinal}% ของข้อสอบไฟนอล)
                        </span>
                      </div>
                    )}

                    {tgt.status === "impossible" && (
                      <span className="text-[11px] text-destructive/80 font-medium">
                        {isGradeS ? "คะแนนเก็บไม่พอผ่านเกณฑ์ S" : "คะแนนเก็บไม่พอถึงเกรดนี้"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
