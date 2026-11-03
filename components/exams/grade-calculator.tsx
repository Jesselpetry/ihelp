"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  FileSpreadsheet,
  Check,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Target,
  Trophy,
  X,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Y1_S1_PRESETS,
  DEFAULT_CUTOFFS,
  evaluateMathExpression,
  calculateCourseResult,
  calculateFinalTargets,
  calculateSemesterGPA,
  parseExcelOrTextCategories,
  type CourseCalculator,
  type ScoreCategory,
  type SubScoreItem,
} from "@/lib/exams/grade-calculator";

const STORAGE_KEY = "ihelp_grade_calculator_v1";

export function GradeCalculator() {
  const [courses, setCourses] = useState<CourseCalculator[]>(Y1_S1_PRESETS);
  const [activeCourseId, setActiveCourseId] = useState<string>("itf");
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteRawText, setPasteRawText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          setActiveCourseId(parsed[0].id);
        }
      }
    } catch {
      // Fallback to presets
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // Ignore quota error
    }
  }, [courses, isLoaded]);

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === activeCourseId) || courses[0];
  }, [courses, activeCourseId]);

  const activeResult = useMemo(() => {
    if (!activeCourse) return null;
    return calculateCourseResult(activeCourse);
  }, [activeCourse]);

  const activeTargets = useMemo(() => {
    if (!activeCourse) return null;
    return calculateFinalTargets(activeCourse);
  }, [activeCourse]);

  const semesterSummary = useMemo(() => {
    return calculateSemesterGPA(courses);
  }, [courses]);

  // Update a single course in the list
  const updateActiveCourse = (updater: (prev: CourseCalculator) => CourseCalculator) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === activeCourse.id ? updater(c) : c))
    );
  };

  // Handle category raw input change with expression evaluation
  const handleCategoryInputChange = (categoryId: string, rawVal: string) => {
    updateActiveCourse((course) => {
      const updatedCategories = course.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;

        // Clean evaluated score
        const evaluated = evaluateMathExpression(rawVal);
        const score = evaluated !== null ? evaluated : 0;

        return {
          ...cat,
          rawInput: rawVal,
          score,
        };
      });

      return {
        ...course,
        categories: updatedCategories,
      };
    });
  };

  // Handle category weight edit
  const handleCategoryWeightChange = (categoryId: string, weightVal: number) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, weight: Math.max(0, weightVal) } : cat
      ),
    }));
  };

  // Toggle category isFinal
  const handleToggleFinal = (categoryId: string) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.map((cat) => ({
        ...cat,
        isFinal: cat.id === categoryId,
      })),
    }));
  };

  // Add new category
  const handleAddCategory = () => {
    const newId = `cat-${Date.now()}`;
    updateActiveCourse((course) => ({
      ...course,
      categories: [
        ...course.categories,
        {
          id: newId,
          name: "หมวดคะแนนใหม่",
          weight: 10,
          rawInput: "",
          score: 0,
        },
      ],
    }));
  };

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.filter((c) => c.id !== categoryId),
    }));
  };

  // Toggle sub-scores visibility
  const handleToggleSubScores = (categoryId: string) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const currentShow = Boolean(cat.showSubScores);
        let subScores = cat.subScores;
        if (!subScores || subScores.length === 0) {
          subScores = [
            { id: `sub-${Date.now()}-1`, label: "ส่วนที่ 1", score: 0, maxScore: Math.round(cat.weight / 2) },
            { id: `sub-${Date.now()}-2`, label: "ส่วนที่ 2", score: 0, maxScore: Math.round(cat.weight / 2) },
          ];
        }
        return {
          ...cat,
          showSubScores: !currentShow,
          subScores,
        };
      }),
    }));
  };

  // Add sub-score item
  const handleAddSubScore = (categoryId: string) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const existing = cat.subScores || [];
        const nextNum = existing.length + 1;
        const newSub: SubScoreItem = {
          id: `sub-${Date.now()}`,
          label: `คะแนนย่อย ${nextNum}`,
          score: 0,
          maxScore: 5,
        };
        const updatedSubs = [...existing, newSub];
        const sumScore = updatedSubs.reduce((acc, s) => acc + (s.score || 0), 0);
        return {
          ...cat,
          subScores: updatedSubs,
          score: sumScore,
          rawInput: String(sumScore),
        };
      }),
    }));
  };

  // Update sub-score value
  const handleSubScoreChange = (
    categoryId: string,
    subId: string,
    field: "label" | "score" | "maxScore",
    val: string | number
  ) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const updatedSubs = (cat.subScores || []).map((s) => {
          if (s.id !== subId) return s;
          if (field === "score") {
            return { ...s, score: Math.max(0, Number(val) || 0) };
          }
          if (field === "maxScore") {
            return { ...s, maxScore: Math.max(0, Number(val) || 0) };
          }
          return { ...s, label: String(val) };
        });
        const sumScore = updatedSubs.reduce((acc, s) => acc + (s.score || 0), 0);
        return {
          ...cat,
          subScores: updatedSubs,
          score: sumScore,
          rawInput: String(sumScore),
        };
      }),
    }));
  };

  // Delete sub-score
  const handleDeleteSubScore = (categoryId: string, subId: string) => {
    updateActiveCourse((course) => ({
      ...course,
      categories: course.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const updatedSubs = (cat.subScores || []).filter((s) => s.id !== subId);
        const sumScore = updatedSubs.reduce((acc, s) => acc + (s.score || 0), 0);
        return {
          ...cat,
          subScores: updatedSubs,
          score: sumScore,
          rawInput: String(sumScore),
        };
      }),
    }));
  };

  // Add custom course
  const handleAddCustomCourse = () => {
    const newId = `custom-${Date.now()}`;
    const newCourse: CourseCalculator = {
      id: newId,
      code: "NEW",
      shortCode: "CUSTOM",
      nameTh: "วิชาเลือก / วิชาเพิ่มเติม",
      nameEn: "Custom Course",
      credits: 3,
      mode: "letter",
      categories: [
        { id: `c-${Date.now()}-1`, name: "สอบกลางภาค (Midterm)", weight: 30, rawInput: "", score: 0 },
        { id: `c-${Date.now()}-2`, name: "สอบปลายภาค (Final)", weight: 35, rawInput: "", score: 0, isFinal: true },
        { id: `c-${Date.now()}-3`, name: "งานและการบ้าน (Assignments)", weight: 35, rawInput: "", score: 0 },
      ],
      cutoffs: [...DEFAULT_CUTOFFS],
      notes: "วิชาที่สร้างขึ้นเอง",
    };
    setCourses((prev) => [...prev, newCourse]);
    setActiveCourseId(newId);
  };

  // Reset to original syllabus presets
  const handleResetToPresets = () => {
    if (confirm("ต้องการรีเซ็ตวิชาและคะแนนทั้งหมดกลับเป็นเกณฑ์มาตรฐานของปี 1 เทอม 1 ใช่หรือไม่?")) {
      setCourses(Y1_S1_PRESETS);
      setActiveCourseId("itf");
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Parse Excel Preview
  const excelPreview = useMemo(() => {
    return parseExcelOrTextCategories(pasteRawText);
  }, [pasteRawText]);

  // Apply parsed Excel categories
  const handleApplyExcel = (asNewCourse: boolean) => {
    if (!excelPreview || excelPreview.length === 0) return;

    if (asNewCourse) {
      const newId = `excel-${Date.now()}`;
      const newCourse: CourseCalculator = {
        id: newId,
        code: "EXCEL",
        shortCode: "XLS",
        nameTh: "วิชาที่นำเข้าจาก Excel",
        nameEn: "Imported from Excel",
        credits: 3,
        mode: "letter",
        categories: excelPreview,
        cutoffs: [...DEFAULT_CUTOFFS],
        notes: "นำเข้าจากไฟล์ Excel / ตารางเกณฑ์การให้คะแนน",
      };
      setCourses((prev) => [...prev, newCourse]);
      setActiveCourseId(newId);
    } else {
      updateActiveCourse((course) => ({
        ...course,
        categories: excelPreview,
      }));
    }

    setPasteRawText("");
    setShowPasteModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* ── 1. Top Overview & Semester GPA Banner ── */}
      <div className="rounded-3xl border bg-card/90 p-4 sm:p-6 shadow-xs backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Calculator className="size-4.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                ระบบคำนวณคะแนน & ตัดเกรด (Grade & Exam Calculator)
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              สัดส่วนคะแนนมาตรฐานวิชา ปี 1 เทอม 1 IT KMITL · รองรับการบวกเลขแบบเครื่องคิดเลข{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-foreground font-semibold">10+5+8.5</code>{" "}
              พร้อมคำนวณคะแนนที่ต้องได้ใน Final อัตโนมัติ
            </p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasteModal(true)}
              className="h-8.5 rounded-xl text-xs gap-1.5 border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 text-foreground"
            >
              <FileSpreadsheet className="size-3.5 text-emerald-500" />
              <span>วางจาก Excel</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCustomCourse}
              className="h-8.5 rounded-xl text-xs gap-1.5 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
            >
              <Plus className="size-3.5 text-primary" />
              <span>เพิ่มวิชาใหม่</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetToPresets}
              title="รีเซ็ตเกณฑ์และคะแนนทั้งหมดกลับเป็นค่าเริ่มต้น"
              className="h-8.5 rounded-xl text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">รีเซ็ต</span>
            </Button>
          </div>
        </div>

        {/* Semester GPA Stats Row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
          <div className="rounded-2xl border bg-background/50 p-3">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-primary" />
              เกรดเฉลี่ยจำลอง (GPS)
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-extrabold text-foreground">
                {semesterSummary.gpa.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">/ 4.00</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/50 p-3">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <Trophy className="size-3.5 text-amber-500" />
              หน่วยกิตรวมที่คิดเกรด
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-extrabold text-foreground">
                {semesterSummary.evaluatedCredits}
              </span>
              <span className="text-xs text-muted-foreground">หน่วยกิต</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/50 p-3">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-emerald-500" />
              วิชาที่ผ่านเกณฑ์ (Pass)
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {courses.filter((c) => calculateCourseResult(c).status === "pass").length}
              </span>
              <span className="text-xs text-muted-foreground font-medium">/ {courses.length} วิชา</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-background/50 p-3">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-violet-500" />
              แต้มรวมสะสม (Points)
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-extrabold text-foreground">
                {semesterSummary.cumulativePoints.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">คะแนน</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Horizontal Course Navigation Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {courses.map((course) => {
          const res = calculateCourseResult(course);
          const isSelected = course.id === activeCourse.id;
          return (
            <button
              key={course.id}
              onClick={() => setActiveCourseId(course.id)}
              className={`group flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "border-primary/50 bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20 font-semibold"
                  : "bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border/80"
              }`}
            >
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: course.color || "#4c93ff" }}
              />
              <span className="font-bold font-mono">{course.shortCode}</span>
              <span className="max-w-[7rem] truncate text-[11px]">{course.nameTh}</span>
              <Badge
                variant="outline"
                className={`ml-1 text-[10px] font-bold px-1.5 py-0 h-4 ${
                  res.grade === "A"
                    ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : res.grade === "F"
                    ? "border-destructive/40 text-destructive bg-destructive/10"
                    : "border-primary/40 text-primary bg-primary/5"
                }`}
              >
                {res.grade}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* ── 3. Active Course Calculator Card ── */}
      {activeCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Category inputs & calculations (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border bg-card/90 p-4 sm:p-6 shadow-xs backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-white"
                      style={{ backgroundColor: activeCourse.color || "#4c93ff" }}
                    >
                      {activeCourse.shortCode}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {activeCourse.code}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {activeCourse.credits} หน่วยกิต
                    </Badge>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-foreground">
                    {activeCourse.nameTh}
                  </h3>
                  <p className="text-xs text-muted-foreground">{activeCourse.nameEn}</p>
                </div>

                {/* Course Grade Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">ตัดเกรด:</span>
                  <div className="flex rounded-lg border bg-muted/40 p-0.5 text-xs">
                    <button
                      onClick={() =>
                        updateActiveCourse((c) => ({ ...c, mode: "letter" }))
                      }
                      className={`px-2 py-1 rounded-md transition-colors ${
                        activeCourse.mode === "letter"
                          ? "bg-card text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      A - F
                    </button>
                    <button
                      onClick={() =>
                        updateActiveCourse((c) => ({ ...c, mode: "pass_fail" }))
                      }
                      className={`px-2 py-1 rounded-md transition-colors ${
                        activeCourse.mode === "pass_fail"
                          ? "bg-card text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      S / U
                    </button>
                  </div>
                </div>
              </div>

              {activeCourse.notes && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-muted/30 p-2.5 text-xs text-muted-foreground">
                  <HelpCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{activeCourse.notes}</span>
                </div>
              )}

              {/* Category Rows */}
              <div className="mt-4 space-y-3">
                {activeCourse.categories.map((cat, idx) => {
                  const hasMathExpr = cat.rawInput && /[+\-*/]/.test(cat.rawInput);
                  const isFinal = Boolean(cat.isFinal);
                  const showSubScores = Boolean(cat.showSubScores);

                  return (
                    <div
                      key={cat.id}
                      className={`rounded-2xl border p-3.5 transition-all ${
                        isFinal
                          ? "border-primary/40 bg-primary/[0.02]"
                          : "border-border/80 bg-background/40 hover:border-border"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Category Name & Flags */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-foreground">
                              {cat.name}
                            </span>
                            {isFinal && (
                              <Badge
                                variant="outline"
                                className="text-[10px] border-primary/40 text-primary bg-primary/10 gap-1"
                              >
                                <Target className="size-2.5" />
                                ปลายภาค (Final)
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            น้ำหนักสัดส่วน:{" "}
                            <span className="font-mono font-bold text-foreground">
                              {cat.weight}%
                            </span>
                          </span>
                        </div>

                        {/* Score Input Box with Calculator Math Expression Support */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="relative">
                            <Input
                              type="text"
                              value={cat.rawInput}
                              onChange={(e) =>
                                handleCategoryInputChange(cat.id, e.target.value)
                              }
                              placeholder={`0 - ${cat.weight}`}
                              disabled={showSubScores}
                              className={`w-32 h-9 font-mono text-sm font-bold text-right pr-3 rounded-xl ${
                                showSubScores ? "bg-muted/60 opacity-80 cursor-not-allowed" : ""
                              }`}
                            />
                            {hasMathExpr && !showSubScores && (
                              <span className="absolute -bottom-4 right-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                = {cat.score}
                              </span>
                            )}
                          </div>

                          <span className="text-xs font-mono text-muted-foreground">
                            / {cat.weight}
                          </span>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleSubScores(cat.id)}
                              title={
                                showSubScores
                                  ? "ซ่อนคะแนนย่อย"
                                  : "เพิ่มคะแนนย่อยแบบละเอียด (Quiz 1, 2, ...)"
                              }
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                showSubScores
                                  ? "bg-primary/10 border-primary/30 text-primary"
                                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {showSubScores ? (
                                <ChevronUp className="size-3.5" />
                              ) : (
                                <Plus className="size-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleFinal(cat.id)}
                              title={
                                isFinal
                                  ? "หมวดนี้ถูกตั้งเป็น Final แล้ว"
                                  : "ตั้งหมวดนี้เป็นข้อสอบ Final เพื่อคำนวณเป้าหมาย"
                              }
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                isFinal
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Target className="size-3.5" />
                            </button>

                            {activeCourse.categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id)}
                                title="ลบหมวดนี้"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sub-Scores Drawer ("เพิ่มตัวเลขอีกไหม") */}
                      {showSubScores && (
                        <div className="mt-3 pt-3 border-t border-border/40 space-y-2 animate-in fade-in-50 duration-150">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-medium">
                              คะแนนย่อยในหมวดนี้ (รวมอัตโนมัติ: {cat.score} / {cat.weight}):
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddSubScore(cat.id)}
                              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              <Plus className="size-3" />
                              <span>เพิ่มคะแนนย่อยอีก</span>
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {(cat.subScores || []).map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-2 rounded-xl border bg-card/60 px-3 py-1.5 text-xs"
                              >
                                <Input
                                  value={sub.label}
                                  onChange={(e) =>
                                    handleSubScoreChange(
                                      cat.id,
                                      sub.id,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                  className="h-7 text-xs flex-1 rounded-lg border-transparent focus:border-border"
                                />
                                <div className="flex items-center gap-1 font-mono">
                                  <Input
                                    type="number"
                                    value={sub.score || ""}
                                    onChange={(e) =>
                                      handleSubScoreChange(
                                        cat.id,
                                        sub.id,
                                        "score",
                                        e.target.value
                                      )
                                    }
                                    placeholder="0"
                                    className="w-16 h-7 text-xs text-right rounded-lg font-bold"
                                  />
                                  <span className="text-muted-foreground">/</span>
                                  <Input
                                    type="number"
                                    value={sub.maxScore || ""}
                                    onChange={(e) =>
                                      handleSubScoreChange(
                                        cat.id,
                                        sub.id,
                                        "maxScore",
                                        e.target.value
                                      )
                                    }
                                    placeholder="เต็ม"
                                    className="w-14 h-7 text-xs text-right rounded-lg text-muted-foreground"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubScore(cat.id, sub.id)}
                                  className="text-muted-foreground hover:text-destructive p-1 rounded"
                                >
                                  <X className="size-3" />
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

              {/* Add Category Button */}
              <div className="mt-4 flex justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCategory}
                  className="rounded-xl text-xs gap-1.5 border-dashed hover:border-primary/50 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="size-3.5" />
                  <span>เพิ่มหมวดคะแนน</span>
                </Button>

                <div className="text-xs text-muted-foreground font-mono">
                  สัดส่วนคะแนนรวม:{" "}
                  <span
                    className={`font-bold ${
                      activeCourse.categories.reduce((a, b) => a + b.weight, 0) === 100
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-500"
                    }`}
                  >
                    {activeCourse.categories.reduce((a, b) => a + b.weight, 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Projected Grade & Final Target Score Roadmap (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Score Summary Box */}
            <div className="rounded-3xl border bg-card/90 p-5 sm:p-6 shadow-xs backdrop-blur-md">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                คะแนนรวมปัจจุบัน & เกรดที่คาดว่าจะได้
              </span>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-mono font-extrabold text-foreground">
                      {activeResult?.totalScore.toFixed(1)}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">
                      / {activeResult?.maxScore}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    คิดเป็น {activeResult?.percentage.toFixed(1)}% ของวิชานี้
                  </span>
                </div>

                <div className="text-center">
                  <div
                    className={`size-16 rounded-2xl flex items-center justify-center font-mono font-black text-3xl shadow-sm ${
                      activeResult?.grade === "A"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : activeResult?.grade === "F"
                        ? "bg-destructive/15 text-destructive border border-destructive/30"
                        : "bg-primary/15 text-primary border border-primary/30"
                    }`}
                  >
                    {activeResult?.grade}
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground mt-1 block">
                    แต้ม {activeResult?.point.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, activeResult?.percentage || 0))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>0</span>
                  <span>F &lt; 50</span>
                  <span>C: 60</span>
                  <span>B: 70</span>
                  <span>A: 80</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Target Final Score Roadmap */}
            <div className="rounded-3xl border bg-card/90 p-5 shadow-xs backdrop-blur-md">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <Target className="size-4 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    คะแนนที่ต้องได้ใน Final เพื่อเกรดเป้าหมาย
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    คำนวณจากคะแนนเก็บตอนนี้ ({activeTargets?.currentWithoutFinal.toFixed(1)}{" "}
                    คะแนน) กับสัดส่วน Final ({activeTargets?.finalCategory?.weight || 0}%)
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {activeTargets?.targets.map((tgt) => {
                  return (
                    <div
                      key={tgt.grade}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                        tgt.status === "achieved"
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200"
                          : tgt.status === "impossible"
                          ? "border-border/50 bg-muted/20 text-muted-foreground opacity-60"
                          : "border-border/80 bg-background/50 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm w-7">{tgt.grade}</span>
                        <span className="text-[11px] text-muted-foreground">
                          (&ge; {tgt.minTotal} คะแนน)
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
                              ต้องการ {tgt.neededOnFinal.toFixed(1)} /{" "}
                              {activeTargets.finalCategory?.weight}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({tgt.percentageOfFinal}% ของข้อสอบไฟนอล)
                            </span>
                          </div>
                        )}

                        {tgt.status === "impossible" && (
                          <span className="text-[11px] text-destructive/80 font-medium">
                            คะแนนเก็บไม่พอถึงเกรดนี้
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Paste from Excel Modal ── */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-emerald-500" />
                <h3 className="text-base font-bold text-foreground">
                  วางข้อมูลสัดส่วนคะแนนจาก Excel / ตาราง
                </h3>
              </div>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              คัดลอกเซลล์ตารางสัดส่วนคะแนนจากไฟล์ Excel หรือ Google Sheets แล้วกดวาง (Ctrl+V) ได้เลย
              ระบบจะตรวจจับชื่อหมวด สัดส่วนเปอร์เซ็นต์ และคะแนนที่ได้ให้อัตโนมัติ:
            </p>

            <textarea
              value={pasteRawText}
              onChange={(e) => setPasteRawText(e.target.value)}
              placeholder={`ตัวอย่างที่คัดลอกมาจาก Excel:
สอบกลางภาค\t30\t24.5
สอบปลายภาค\t30\t
งานแล็บและการบ้าน\t30\t28
เข้าเรียน\t10\t10`}
              rows={6}
              className="w-full rounded-2xl border bg-background p-3 font-mono text-xs leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {/* Live Parsing Preview */}
            {excelPreview && excelPreview.length > 0 && (
              <div className="rounded-2xl border bg-background/50 p-3 space-y-2">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-500" />
                  ตรวจพบ {excelPreview.length} หมวดคะแนน:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1 text-xs">
                  {excelPreview.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1 border-b border-border/40 text-muted-foreground"
                    >
                      <span className="truncate max-w-[14rem] font-medium text-foreground">
                        {item.name}
                      </span>
                      <span className="font-mono">
                        {item.weight}% {item.score > 0 ? `(ได้ ${item.score})` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPasteModal(false)}
                className="rounded-xl text-xs text-muted-foreground"
              >
                ยกเลิก
              </Button>
              <Button
                size="sm"
                disabled={!excelPreview || excelPreview.length === 0}
                onClick={() => handleApplyExcel(false)}
                className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                บันทึกทับวิชานี้ ({activeCourse.shortCode})
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!excelPreview || excelPreview.length === 0}
                onClick={() => handleApplyExcel(true)}
                className="rounded-xl text-xs font-semibold"
              >
                สร้างเป็นวิชาใหม่
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
