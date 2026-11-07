"use client";

import { Plus, ChevronUp, X, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { CourseCalculator } from "@/lib/exams/grade-calculator";

interface ScoreInputFormProps {
  course: CourseCalculator;
  onCategoryInputChange: (categoryId: string, rawVal: string) => void;
  onToggleSubScores: (categoryId: string) => void;
  onAddSubScore: (categoryId: string) => void;
  onSubScoreChange: (
    categoryId: string,
    subId: string,
    field: "label" | "score" | "maxScore",
    val: string
  ) => void;
  onDeleteSubScore: (categoryId: string, subId: string) => void;
}

export function ScoreInputForm({
  course,
  onCategoryInputChange,
  onToggleSubScores,
  onAddSubScore,
  onSubScoreChange,
  onDeleteSubScore,
}: ScoreInputFormProps) {
  const totalWeight = course.categories.reduce((acc, cat) => acc + cat.weight, 0);

  return (
    <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 p-4 sm:p-6 shadow-xs dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            กรอกคะแนนตามสัดส่วนวิชา
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            ใส่คะแนนดิบ หรือพิมพ์บวกเลขในช่องได้เลย เช่น{" "}
            <code className="rounded bg-muted px-1 py-0.2 text-[10px] font-mono text-foreground font-semibold">
              10+5+8.5
            </code>
          </p>
        </div>

        <Badge
          variant="outline"
          className={`font-mono text-xs font-semibold px-2.5 py-0.5 ${
            totalWeight === 100
              ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
              : "border-amber-500/40 text-amber-600 bg-amber-500/10"
          }`}
        >
          สัดส่วนรวม {totalWeight}%
        </Badge>
      </div>

      {/* Standardized Category Fields List */}
      <div className="space-y-3">
        {course.categories.map((cat) => {
          const hasMathExpr = cat.rawInput && /[+\-*/]/.test(cat.rawInput);
          const isFinal = Boolean(cat.isFinal);
          const showSubScores = Boolean(cat.showSubScores);

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border transition-all p-3.5 ${
                isFinal
                  ? "border-primary/40 bg-primary/[0.03] dark:bg-primary/[0.02]"
                  : "border-border/70 dark:border-white/5 bg-background/50 dark:bg-black/15 hover:border-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Field Label & Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {cat.name}
                    </span>
                    {isFinal && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-primary/40 text-primary bg-primary/10 gap-1 font-semibold"
                      >
                        <Target className="size-2.5" />
                        ปลายภาค (Final)
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-0.5 block">
                    น้ำหนักสัดส่วน:{" "}
                    <span className="font-mono font-bold text-foreground">
                      {cat.weight}%
                    </span>
                  </span>
                </div>

                {/* Standardized Input & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      value={cat.rawInput}
                      onChange={(e) => onCategoryInputChange(cat.id, e.target.value)}
                      placeholder={`0 - ${cat.weight}`}
                      disabled={showSubScores}
                      className={`w-32 h-9 font-mono text-sm font-bold text-right pr-7 rounded-xl border-border/80 dark:border-white/10 dark:bg-black/25 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] ${
                        showSubScores ? "bg-muted/60 opacity-80 cursor-not-allowed" : ""
                      }`}
                    />
                    {cat.rawInput && !showSubScores && (
                      <button
                        type="button"
                        onClick={() => onCategoryInputChange(cat.id, "")}
                        className="absolute right-2 text-muted-foreground/60 hover:text-foreground cursor-pointer p-0.5 rounded-full hover:bg-muted"
                        title="ล้างค่า"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                    {hasMathExpr && !showSubScores && (
                      <span className="absolute -bottom-4 right-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        = {cat.score}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-muted-foreground w-12 text-left">
                    / {cat.weight}
                  </span>

                  {/* Toggle Sub-Scores Drawer */}
                  <button
                    type="button"
                    onClick={() => onToggleSubScores(cat.id)}
                    title={
                      showSubScores
                        ? "ซ่อนคะแนนย่อย"
                        : "เพิ่มหรือแก้ไขคะแนนย่อย (Quiz, แล็บ ฯลฯ)"
                    }
                    className={`size-8 rounded-xl border flex items-center justify-center text-xs transition-colors cursor-pointer ${
                      showSubScores
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/80 dark:border-white/10"
                    }`}
                  >
                    {showSubScores ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-Scores Drawer (Expandable for detailed quizzes/assignments) */}
              {showSubScores && (
                <div className="mt-3 pt-3 border-t border-border/40 space-y-2 animate-in fade-in-50 duration-150">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-[11px]">
                      คะแนนย่อยในหมวดนี้ (รวมอัตโนมัติ:{" "}
                      <span className="font-mono font-bold text-foreground">
                        {cat.score}
                      </span>{" "}
                      / {cat.weight}):
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddSubScore(cat.id)}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>เพิ่มคะแนนย่อย</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {(cat.subScores || []).map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 rounded-xl border border-border/60 dark:border-white/5 bg-card/60 px-3 py-1.5 text-xs"
                      >
                        <Input
                          value={sub.label}
                          onChange={(e) =>
                            onSubScoreChange(cat.id, sub.id, "label", e.target.value)
                          }
                          placeholder="ชื่อรายการ เช่น Quiz 1"
                          className="h-7 text-xs flex-1 rounded-lg border-transparent focus:border-border"
                        />
                        <div className="flex items-center gap-1 font-mono">
                          <Input
                            type="number"
                            value={sub.score || ""}
                            onChange={(e) =>
                              onSubScoreChange(cat.id, sub.id, "score", e.target.value)
                            }
                            placeholder="0"
                            className="w-16 h-7 text-xs text-right rounded-lg font-bold"
                          />
                          <span className="text-muted-foreground">/</span>
                          <Input
                            type="number"
                            value={sub.maxScore || ""}
                            onChange={(e) =>
                              onSubScoreChange(cat.id, sub.id, "maxScore", e.target.value)
                            }
                            placeholder="เต็ม"
                            className="w-14 h-7 text-xs text-right rounded-lg text-muted-foreground"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteSubScore(cat.id, sub.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded cursor-pointer"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

