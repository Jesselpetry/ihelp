"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Y1_S1_PRESETS,
  evaluateMathExpression,
  type CourseCalculator,
  type SubScoreItem,
} from "@/lib/exams/grade-calculator";
import { CalculatorHeader } from "./calculator/calculator-header";
import { CourseNav } from "./calculator/course-nav";
import { ScoreInputForm } from "./calculator/score-input-form";
import { ScoreResultsPanel } from "./calculator/score-results-panel";

const STORAGE_KEY = "ihelp_grade_calculator_v2";

export function GradeCalculator() {
  const [courses, setCourses] = useState<CourseCalculator[]>(() => {
    if (typeof window === "undefined") return Y1_S1_PRESETS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CourseCalculator[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Y1_S1_PRESETS.map((preset) => {
            const matched = parsed.find((p) => p.id === preset.id);
            if (!matched) return preset;
            return {
              ...preset,
              categories: preset.categories.map((cat) => {
                const savedCat = matched.categories?.find((c) => c.id === cat.id);
                if (!savedCat) return cat;
                return {
                  ...cat,
                  rawInput: savedCat.rawInput || "",
                  score: typeof savedCat.score === "number" ? savedCat.score : 0,
                  showSubScores: savedCat.showSubScores,
                  subScores: savedCat.subScores || cat.subScores,
                };
              }),
            };
          });
        }
      }
    } catch {
      // Fallback to presets
    }
    return Y1_S1_PRESETS;
  });

  const [activeCourseId, setActiveCourseId] = useState<string>("itf");
  const isFirstRender = useRef(true);

  // Save changes to localStorage after initial mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // Ignore quota error
    }
  }, [courses]);

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === activeCourseId) || courses[0];
  }, [courses, activeCourseId]);

  // Update active course categories
  const updateActiveCourse = (updater: (prev: CourseCalculator) => CourseCalculator) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === activeCourse.id ? updater(c) : c))
    );
  };

  // Handle score input with math evaluation (e.g. "10+5+8.5")
  const handleCategoryInputChange = (categoryId: string, rawVal: string) => {
    updateActiveCourse((course) => {
      const updatedCategories = course.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;

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

  // Toggle sub-scores drawer
  const handleToggleSubScores = (categoryId: string) => {
    updateActiveCourse((course) => {
      return {
        ...course,
        categories: course.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;

          const nextShow = !cat.showSubScores;
          let subScores = cat.subScores;

          // If opening for first time and empty, add 2 sample slots
          if (nextShow && (!subScores || subScores.length === 0)) {
            subScores = [
              { id: `sub-1`, label: "ส่วนที่ 1", score: 0, maxScore: Math.round(cat.weight / 2) },
              { id: `sub-2`, label: "ส่วนที่ 2", score: 0, maxScore: Math.round(cat.weight / 2) },
            ];
          }

          const totalSubScore = subScores?.reduce((sum, s) => sum + (s.score || 0), 0) || 0;

          return {
            ...cat,
            showSubScores: nextShow,
            subScores,
            score: nextShow ? totalSubScore : cat.score,
            rawInput: nextShow ? String(totalSubScore) : cat.rawInput,
          };
        }),
      };
    });
  };

  // Add a new sub-score item
  const handleAddSubScore = (categoryId: string) => {
    updateActiveCourse((course) => {
      return {
        ...course,
        categories: course.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          const currentSubs = cat.subScores || [];
          const newSub: SubScoreItem = {
            id: `sub-${Date.now()}`,
            label: `รายการที่ ${currentSubs.length + 1}`,
            score: 0,
            maxScore: 10,
          };
          return {
            ...cat,
            subScores: [...currentSubs, newSub],
          };
        }),
      };
    });
  };

  // Update a sub-score item value
  const handleSubScoreChange = (
    categoryId: string,
    subId: string,
    field: "label" | "score" | "maxScore",
    val: string
  ) => {
    updateActiveCourse((course) => {
      return {
        ...course,
        categories: course.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;

          const updatedSubs = (cat.subScores || []).map((sub) => {
            if (sub.id !== subId) return sub;
            if (field === "label") return { ...sub, label: val };

            const numVal = parseFloat(val);
            return {
              ...sub,
              [field]: isNaN(numVal) ? 0 : numVal,
            };
          });

          const totalScore = updatedSubs.reduce((sum, s) => sum + (s.score || 0), 0);

          return {
            ...cat,
            subScores: updatedSubs,
            score: totalScore,
            rawInput: String(totalScore),
          };
        }),
      };
    });
  };

  // Delete a sub-score item
  const handleDeleteSubScore = (categoryId: string, subId: string) => {
    updateActiveCourse((course) => {
      return {
        ...course,
        categories: course.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          const updatedSubs = (cat.subScores || []).filter((s) => s.id !== subId);
          const totalScore = updatedSubs.reduce((sum, s) => sum + (s.score || 0), 0);
          return {
            ...cat,
            subScores: updatedSubs,
            score: totalScore,
            rawInput: String(totalScore),
          };
        }),
      };
    });
  };

  // Reset scores for active course back to empty
  const handleResetCourse = () => {
    updateActiveCourse((course) => {
      const defaultCourse = Y1_S1_PRESETS.find((p) => p.id === course.id);
      if (!defaultCourse) return course;

      return {
        ...defaultCourse,
        categories: defaultCourse.categories.map((cat) => ({
          ...cat,
          rawInput: "",
          score: 0,
          showSubScores: false,
          subScores: cat.subScores?.map((s) => ({ ...s, score: 0 })),
        })),
      };
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-0 duration-300">
      {/* ── TOP PANEL: Standardized Header + Static Subject Navigator ── */}
      <div className="space-y-3">
        <CalculatorHeader course={activeCourse} onResetCourse={handleResetCourse} />
        <CourseNav
          courses={courses}
          activeCourseId={activeCourse.id}
          onSelectCourse={setActiveCourseId}
        />
      </div>

      {/* ── TWO-COLUMN WORKSPACE: Left (Input Form) & Right (Results & Targets) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Standardized Score Form (7 cols) */}
        <div className="lg:col-span-7">
          <ScoreInputForm
            course={activeCourse}
            onCategoryInputChange={handleCategoryInputChange}
            onToggleSubScores={handleToggleSubScores}
            onAddSubScore={handleAddSubScore}
            onSubScoreChange={handleSubScoreChange}
            onDeleteSubScore={handleDeleteSubScore}
          />
        </div>

        {/* Right Column: Projected Grade & Final Target Score Roadmap (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <ScoreResultsPanel course={activeCourse} />
        </div>
      </div>
    </div>
  );
}
