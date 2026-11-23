"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import type { MeResponse } from "@/app/api/me/route";
import { TopicHeader } from "@/components/course-hub-shared";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SchedulePreset, UserScheduleSelection } from "@/lib/schedule/types";
import {
  detectScheduleClashes,
  getScheduledSlots,
} from "@/lib/schedule/y1s2-data";
import {
  getAllRegisteredTerms,
  getTermSchedule,
} from "@/lib/schedule/registry";
import type { StudentScheduleGroupInfo } from "@/lib/schedule/types";
import { ScheduleBanner } from "./schedule-banner";
import { ScheduleCourseAccordion } from "./schedule-course-accordion";
import { ScheduleExportCard } from "./schedule-export-card";
import { ScheduleGrid } from "./schedule-grid";
import { ScheduleSidebar } from "./schedule-sidebar";

const L = {
  facultyHeading: {
    th: "วิชาบังคับคณะ",
    en: "Faculty Core Courses",
  },
  genedHeading: {
    th: "วิชาศึกษาทั่วไป",
    en: "GenEd Electives",
  },
  exportHeading: {
    th: "ส่งออกข้อมูลตารางเรียน",
    en: "Export Timetable Data",
  },
  expandAll: { th: "เปิดทั้งหมด", en: "Expand all" },
  collapseAll: { th: "พับทั้งหมด", en: "Collapse all" },
} satisfies Record<string, LText>;

function getInitialSelection(
  termId: string,
  defaultSelections: UserScheduleSelection,
): UserScheduleSelection {
  if (typeof window !== "undefined") {
    try {
      const storageKey = `ihelp_schedule_selection_${termId}`;
      const saved =
        localStorage.getItem(storageKey) ||
        (termId === "2569-2"
          ? localStorage.getItem("ihelp_y1s2_schedule_selection_v3")
          : null);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.theory && parsed?.lab) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return defaultSelections;
}

export function ScheduleHub({
  initialTermId,
}: {
  initialTermId?: string;
} = {}) {
  const { locale } = useLocale();

  const [selectedTermId, setSelectedTermId] = useState<string>(
    initialTermId || "2569-2",
  );
  const termData = getTermSchedule(selectedTermId);
  const allTerms = getAllRegisteredTerms();
  const { termInfo, courses, presets } = termData;

  const facultyCourses = courses.filter((c) => c.category === "วิชาบังคับ");
  const genedCourses = courses.filter((c) => c.category === "วิชาเลือก / GenEd");
  const totalCredits = courses.reduce((acc, c) => acc + c.creditHours, 0);

  // Authentication & Viewer state
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const [viewer, setViewer] = useState<{
    studentId: string | null;
    fullName: string | null;
    nickname: string | null;
    avatarUrl: string | null;
    avatarInitial: string;
  }>({
    studentId: null,
    fullName: null,
    nickname: null,
    avatarUrl: null,
    avatarInitial: "I",
  });
  const [assignedGroup, setAssignedGroup] =
    useState<StudentScheduleGroupInfo | null>(null);

  // Schedule State: Selectable courses
  const [selection, setSelection] = useState<UserScheduleSelection>(() =>
    getInitialSelection(termInfo.id, termData.defaultSelections),
  );

  const [activeSection, setActiveSection] = useState<string>("timetable");
  // All accordions auto-hidden / collapsed by default
  const [openCodes, setOpenCodes] = useState<Record<string, boolean>>({});

  // Load user from /api/me
  useEffect(() => {
    const controller = new AbortController();

    async function loadMe() {
      try {
        const res = await fetch("/api/me", { signal: controller.signal });
        if (res.ok) {
          const me = (await res.json()) as MeResponse;
          setViewer({
            studentId: me.studentId,
            fullName: me.fullName ?? me.displayName ?? null,
            nickname: me.nickname ?? null,
            avatarUrl: me.avatarUrl ?? null,
            avatarInitial:
              me.initial || (me.studentId ? me.studentId.charAt(0) : "I"),
          });
          setAuthStatus("authenticated");

          if (me.studentId && termData.getStudentGroup) {
            const groupInfo = termData.getStudentGroup(me.studentId);
            setAssignedGroup(groupInfo);
            // If user never had custom localStorage selection, auto-apply student group preset
            if (groupInfo) {
              const storageKey = `ihelp_schedule_selection_${termInfo.id}`;
              const saved =
                typeof window !== "undefined"
                  ? localStorage.getItem(storageKey) ||
                    localStorage.getItem("ihelp_y1s2_schedule_selection_v3")
                  : null;
              if (!saved) {
                const matchedPreset = presets.find(
                  (p) => p.id === groupInfo.presetId,
                );
                if (matchedPreset) {
                  setSelection(matchedPreset.selections);
                }
              }
            }
          }
        } else {
          setAuthStatus("unauthenticated");
        }
      } catch {
        setAuthStatus("unauthenticated");
      }
    }

    void loadMe();

    return () => controller.abort();
  }, [termData, termInfo.id, presets]);

  function saveSelection(next: UserScheduleSelection) {
    setSelection(next);
    try {
      const storageKey = `ihelp_schedule_selection_${termInfo.id}`;
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function handleApplyPreset(preset: SchedulePreset) {
    saveSelection(preset.selections);
  }

  function isMatchingPreset(preset: SchedulePreset): boolean {
    for (const [code, sec] of Object.entries(preset.selections.theory)) {
      if (selection.theory[code] !== sec) return false;
    }
    for (const [code, sec] of Object.entries(preset.selections.lab)) {
      if (selection.lab[code] !== sec) return false;
    }
    return true;
  }

  function handleSelectTheorySec(courseCode: string, sec: number) {
    const next: UserScheduleSelection = {
      ...selection,
      theory: {
        ...selection.theory,
        [courseCode]: sec,
      },
    };
    saveSelection(next);
  }

  function handleSelectLabSec(courseCode: string, sec: number) {
    const next: UserScheduleSelection = {
      ...selection,
      lab: {
        ...selection.lab,
        [courseCode]: sec,
      },
    };
    saveSelection(next);
  }

  function scrollToElement(id: string) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function handleSelectSidebar(id: string) {
    setActiveSection(id);
    if (id === "timetable" || id === "export") {
      scrollToElement(id);
    } else {
      // Auto-hide other open accordions when selecting from sidebar
      setOpenCodes({ [id]: true });
      scrollToElement(`course-${id}`);
    }
  }

  function handleToggleCourse(code: string) {
    setActiveSection(code);
    setOpenCodes((prev) => {
      const isCurrentlyOpen = Boolean(prev[code]);
      if (isCurrentlyOpen) {
        // Close (auto-hide)
        return {};
      }
      // Open selected course and auto-hide all others
      return { [code]: true };
    });
  }

  const allFacultyExpanded = facultyCourses.every((c) =>
    Boolean(openCodes[c.code]),
  );

  function handleToggleAllFaculty() {
    const nextValue = !allFacultyExpanded;
    const nextState: Record<string, boolean> = { ...openCodes };
    for (const c of facultyCourses) {
      nextState[c.code] = nextValue;
    }
    setOpenCodes(nextState);
  }

  const allGenedExpanded = genedCourses.every((c) =>
    Boolean(openCodes[c.code]),
  );

  function handleToggleAllGened() {
    const nextValue = !allGenedExpanded;
    const nextState: Record<string, boolean> = { ...openCodes };
    for (const c of genedCourses) {
      nextState[c.code] = nextValue;
    }
    setOpenCodes(nextState);
  }

  // Calculated Slots & Conflicts
  const slots = getScheduledSlots(selection, courses);
  const conflicts = detectScheduleClashes(slots);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 px-3 py-5 sm:px-5 sm:py-6">
      {/* Standardized IT Banner */}
      <ScheduleBanner
        viewerId={viewer.studentId}
        viewerFullName={viewer.fullName}
        viewerNickname={viewer.nickname}
        avatarUrl={viewer.avatarUrl}
        avatarInitial={viewer.avatarInitial}
        isSignedIn={authStatus === "authenticated"}
        assignedGroup={assignedGroup}
        termInfo={termInfo}
      />

      <div className="grid gap-5 lg:grid-cols-[268px_minmax(0,1fr)] lg:gap-6">
        {/* Left Side Panel */}
        <ScheduleSidebar
          facultyCourses={facultyCourses}
          genedCourses={genedCourses}
          activeSection={activeSection}
          onSelectSection={handleSelectSidebar}
        />

        {/* Right Main Panel */}
        <div className="min-w-0 space-y-6">
          {/* Section 1: Weekly Timetable Grid */}
          <section className="space-y-3">
            {allTerms.length > 1 && (
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  ภาคการศึกษา:
                </span>
                <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
                  {allTerms.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTermId(t.id)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        selectedTermId === t.id
                          ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {locale === "th" ? t.labelTh : t.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <TopicHeader
              id="timetable"
              title={
                locale === "th"
                  ? `ตารางเรียนประจำสัปดาห์ (${termInfo.semester}/${termInfo.academicYear})`
                  : `Weekly Timetable (${termInfo.semester}/${termInfo.academicYear})`
              }
              aside={
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {totalCredits} หน่วยกิต ({courses.length} วิชา)
                </span>
              }
            />

            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-card/60 p-2.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                สูตรตารางล่วงหน้า:
              </span>
              {presets.map((preset) => {
                const isActive = isMatchingPreset(preset);
                const isStudentGroup = assignedGroup?.presetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs font-semibold"
                        : "border-border/60 bg-muted/40 hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>
                      {preset.name.split(" ")[0]}{" "}
                      {preset.name.split(" ")[1] || ""}
                    </span>
                    {isStudentGroup && (
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary/15 text-primary"
                        }`}
                      >
                        <Sparkles className="size-2.5" />
                        กลุ่มคุณ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {conflicts.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 text-destructive mt-0.5" />
                <div className="min-w-0 space-y-0.5">
                  <div className="font-bold">
                    พบเวลาเรียนชนกัน ({conflicts.length} รายการ)
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-destructive/90">
                    {conflicts.map((c, i) => (
                      <li key={i}>{c.details}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <ScheduleGrid slots={slots} />
          </section>

          {/* Section 2: Faculty Courses Section */}
          <section aria-labelledby="faculty-courses" className="space-y-3">
            <TopicHeader
              id="faculty-courses"
              title={
                locale === "th"
                  ? `วิชาบังคับคณะ (${facultyCourses.length} วิชา)`
                  : `Faculty Core Courses (${facultyCourses.length})`
              }
              aside={
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  aria-expanded={allFacultyExpanded}
                  onClick={handleToggleAllFaculty}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {allFacultyExpanded
                    ? t(L.collapseAll, locale)
                    : t(L.expandAll, locale)}
                </Button>
              }
            />

            <div className="space-y-2.5">
              {facultyCourses.map((course) => (
                <ScheduleCourseAccordion
                  key={course.code}
                  course={course}
                  selectedTheorySec={selection.theory[course.code] ?? 1}
                  selectedLabSec={selection.lab[course.code]}
                  isOpen={Boolean(openCodes[course.code])}
                  onToggle={() => handleToggleCourse(course.code)}
                  onSelectTheorySec={(sec) =>
                    handleSelectTheorySec(course.code, sec)
                  }
                  onSelectLabSec={
                    course.hasLab
                      ? (sec) => handleSelectLabSec(course.code, sec)
                      : undefined
                  }
                />
              ))}
            </div>
          </section>

          {/* Section 3: GenEd Elective Courses Section */}
          <section aria-labelledby="gened-courses" className="space-y-3">
            <TopicHeader
              id="gened-courses"
              title={
                locale === "th"
                  ? `วิชาศึกษาทั่วไป (${genedCourses.length} วิชา)`
                  : `GenEd Electives (${genedCourses.length})`
              }
              aside={
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  aria-expanded={allGenedExpanded}
                  onClick={handleToggleAllGened}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {allGenedExpanded
                    ? t(L.collapseAll, locale)
                    : t(L.expandAll, locale)}
                </Button>
              }
            />

            <div className="space-y-2.5">
              {genedCourses.map((course) => (
                <ScheduleCourseAccordion
                  key={course.code}
                  course={course}
                  selectedTheorySec={selection.theory[course.code] ?? 1}
                  selectedLabSec={selection.lab[course.code]}
                  isOpen={Boolean(openCodes[course.code])}
                  onToggle={() => handleToggleCourse(course.code)}
                  onSelectTheorySec={(sec) =>
                    handleSelectTheorySec(course.code, sec)
                  }
                  onSelectLabSec={
                    course.hasLab
                      ? (sec) => handleSelectLabSec(course.code, sec)
                      : undefined
                  }
                />
              ))}
            </div>
          </section>

          {/* Section 4: Export Card */}
          <section className="space-y-3">
            <TopicHeader id="export" title={t(L.exportHeading, locale)} />
            <ScheduleExportCard
              selection={selection}
              courses={courses}
              termInfo={termInfo}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
