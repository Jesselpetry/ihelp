"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
import type { MeResponse } from "@/app/api/me/route";
import { TopicHeader } from "@/components/course-hub-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SchedulePreset, UserScheduleSelection } from "@/lib/schedule/types";
import {
  getAllRegisteredTerms,
  getTermSchedule,
} from "@/lib/schedule/registry";
import type { StudentScheduleGroupInfo } from "@/lib/schedule/types";
import { ScheduleBanner } from "./schedule-banner";
import { ScheduleCourseAccordion } from "./schedule-course-accordion";
import { ScheduleExportCard } from "./schedule-export-card";
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

function getInitialStudentId(): string | null {
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlId = urlParams.get("id");
      if (urlId) {
        return urlId.replace(/\D/g, "").trim() || null;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function getInitialSelection(
  termId: string,
  defaultSelections: UserScheduleSelection,
  presets: SchedulePreset[],
  getStudentGroup?: (
    id: string | null | undefined,
  ) => StudentScheduleGroupInfo | null,
): UserScheduleSelection {
  if (typeof window !== "undefined") {
    try {
      const urlId = getInitialStudentId();
      if (urlId && getStudentGroup) {
        const group = getStudentGroup(urlId);
        if (group) {
          const matched = presets.find((p) => p.id === group.presetId);
          if (matched) return matched.selections;
        }
      }

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

  // Student ID search & active group detection
  const [studentIdInput, setStudentIdInput] = useState<string>(
    () => getInitialStudentId() ?? "",
  );
  const [activeStudentId, setActiveStudentId] = useState<string | null>(
    () => getInitialStudentId(),
  );
  const [searchFeedback, setSearchFeedback] = useState<{
    type: "found" | "not_found";
    message: string;
  } | null>(null);
  const [activeGroup, setActiveGroup] =
    useState<StudentScheduleGroupInfo | null>(() => {
      const id = getInitialStudentId();
      return id && termData.getStudentGroup
        ? termData.getStudentGroup(id)
        : null;
    });

  // Schedule State: Selectable courses
  const [selection, setSelection] = useState<UserScheduleSelection>(() =>
    getInitialSelection(
      termInfo.id,
      termData.defaultSelections,
      presets,
      termData.getStudentGroup,
    ),
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

            // If no active student ID was already set from URL, auto-set viewer's ID and group
            setActiveStudentId((prev) => {
              if (prev) return prev;
              if (groupInfo) {
                setActiveGroup(groupInfo);
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
              return me.studentId;
            });
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

  function handleApplyStudentId(rawId: string) {
    const cleanId = rawId.replace(/\D/g, "").trim();
    if (!cleanId) return;

    setActiveStudentId(cleanId);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("id", cleanId);
      window.history.replaceState(null, "", `?${params.toString()}`);
    }

    if (termData.getStudentGroup) {
      const groupInfo = termData.getStudentGroup(cleanId);
      if (groupInfo) {
        setActiveGroup(groupInfo);
        const matchedPreset = presets.find((p) => p.id === groupInfo.presetId);
        if (matchedPreset) {
          saveSelection(matchedPreset.selections);
        }
        setSearchFeedback({
          type: "found",
          message: `พบข้อมูลกลุ่มเรียนสำหรับรหัส ${cleanId}: ${groupInfo.name} (เลือก Section ให้แล้ว)`,
        });
      } else {
        setActiveGroup(null);
        setSearchFeedback({
          type: "not_found",
          message: `ไม่พบข้อมูลกลุ่มเรียนสำหรับรหัส ${cleanId} (คุณสามารถเลือก Section ได้เองในตารางด้านล่าง)`,
        });
      }
    }
  }

  function handleResetStudentId() {
    setStudentIdInput("");
    setSearchFeedback(null);
    if (viewer.studentId) {
      handleApplyStudentId(viewer.studentId);
    } else {
      setActiveStudentId(null);
      setActiveGroup(null);
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.delete("id");
        window.history.replaceState(
          null,
          "",
          params.toString() ? `?${params.toString()}` : window.location.pathname,
        );
      }
    }
  }

  function handleSelectGroupTheorySec(sec: number) {
    const labSec = sec + 3;
    const next: UserScheduleSelection = {
      ...selection,
      theory: {
        ...selection.theory,
        "06016409": sec, // OOP
        "06016410": sec, // DSA
        "06016403": sec, // PSTAT
        "06016408": sec, // BFIT
      },
      lab: {
        ...selection.lab,
        "06016409": labSec, // OOP Lab
        "06016410": labSec, // DSA Lab
      },
    };
    const groupNum = (sec === 2 ? 2 : sec === 3 ? 3 : 1) as 1 | 2 | 3;
    const presetId = `group-${groupNum}` as "group-1" | "group-2" | "group-3";
    setActiveGroup({
      group: groupNum,
      name: `กลุ่ม ${groupNum}`,
      presetId,
    });
    setSearchFeedback(null);
    saveSelection(next);
  }

  function handleSelectGroupLabSec(sec: number) {
    const next: UserScheduleSelection = {
      ...selection,
      lab: {
        ...selection.lab,
        "06016409": sec, // OOP Lab
        "06016410": sec, // DSA Lab
      },
    };
    saveSelection(next);
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

  const isSignedIn = authStatus === "authenticated";
  const isAutoAssigned =
    isSignedIn &&
    Boolean(assignedGroup) &&
    (!activeStudentId || activeStudentId === viewer.studentId);

  // Effective group context (defaults to Group 1 if not set)
  const effectiveGroup = activeGroup || {
    group: 1,
    name: "กลุ่ม 1",
    presetId: "group-1",
  };

  const currentTheorySec =
    selection.theory["06016409"] ??
    effectiveGroup.group;

  const currentLabSec =
    selection.lab["06016409"] ??
    (effectiveGroup.group + 3);

  const displayGroupName = (() => {
    if (isAutoAssigned && assignedGroup) return assignedGroup.name;
    if (activeGroup?.name) return activeGroup.name;
    if (currentTheorySec === 1 && currentLabSec === 4) return "กลุ่ม 1";
    if (currentTheorySec === 2 && currentLabSec === 5) return "กลุ่ม 2";
    if (currentTheorySec === 3 && currentLabSec === 6) return "กลุ่ม 3";
    return `กลุ่ม ${currentTheorySec} (Lab ${currentLabSec})`;
  })();

  const dcCourse = courses.find((c) => c.code === "90641007" || c.abbr === "DC");
  const feCourse = courses.find((c) => c.code === "90644008" || c.abbr === "FE2");
  const dcSections = dcCourse?.sections.map((s) => s.section) ?? [601, 602, 603, 604];
  const feSections = feCourse?.sections.map((s) => s.section) ?? [
    921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931,
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 px-3 py-5 sm:px-5 sm:py-6">
      {/* Standardized IT Banner */}
      <ScheduleBanner
        viewerId={viewer.studentId}
        viewerFullName={viewer.fullName}
        viewerNickname={viewer.nickname}
        avatarUrl={viewer.avatarUrl}
        avatarInitial={viewer.avatarInitial}
        isSignedIn={isSignedIn}
        assignedGroup={assignedGroup}
        termInfo={termInfo}
        groupName={displayGroupName}
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
              title={locale === "th" ? "ตารางเรียน" : "Timetable"}
              aside={
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {totalCredits} หน่วยกิต ({courses.length} วิชา)
                </span>
              }
            />

            {/* Search Input Box (Course Directory Design - Full Width) */}
            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApplyStudentId(studentIdInput);
                }}
                role="search"
                className="relative flex items-center shadow-xs rounded-full border border-border/70 bg-card p-1.5 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
              >
                <Search className="ml-3.5 size-4 text-muted-foreground shrink-0" />
                <Input
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  placeholder="พิมพ์รหัสนักศึกษา 8 หลักเพื่อดูตารางเรียน (เช่น 69070123)..."
                  maxLength={10}
                  className="h-9 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {studentIdInput && (
                  <button
                    type="button"
                    onClick={handleResetStudentId}
                    title="ล้างคำค้นหา"
                    className="p-1 text-muted-foreground hover:text-foreground mr-1 transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full px-5 text-xs font-semibold cursor-pointer shrink-0"
                >
                  ค้นหา
                </Button>
              </form>
            </div>

            {/* Search Feedback Note */}
            {searchFeedback && (
              <div
                className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-xs transition-all ${
                  searchFeedback.type === "found"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-border/60 bg-muted/40 text-muted-foreground"
                }`}
              >
                <span>{searchFeedback.message}</span>
                <button
                  type="button"
                  onClick={() => setSearchFeedback(null)}
                  className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {/* Return to personal schedule if signed-in user searched another ID */}
            {isSignedIn && viewer.studentId && activeStudentId && activeStudentId !== viewer.studentId && (
              <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs">
                <span className="text-muted-foreground">
                  กำลังดูตารางของรหัส <strong className="text-foreground">{activeStudentId}</strong>
                </span>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    handleApplyStudentId(viewer.studentId!);
                    setSearchFeedback(null);
                  }}
                  className="rounded-full text-xs cursor-pointer"
                >
                  กลับไปตารางของฉัน
                </Button>
              </div>
            )}

            {/* Redesigned Assigned Sections Table */}
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3.5">หมวดวิชา</th>
                    <th className="py-2.5 px-3.5">รายวิชา</th>
                    <th className="py-2.5 px-3.5">Section</th>
                    <th className="py-2.5 px-3.5 text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {/* Row 1: Theory */}
                  <tr>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      <div className="font-semibold text-foreground">
                        วิชาทฤษฎี
                      </div>
                      <div className="text-[11px] text-muted-foreground font-normal">
                        Lecture
                      </div>
                    </td>
                    <td className="py-3 px-3.5 align-middle">
                      <div className="font-medium text-foreground">
                        OOP, DSA, PSTAT, BFIT
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        วิชาบังคับคณะ 4 รายวิชา
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      {isAutoAssigned && assignedGroup ? (
                        <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-xs font-bold inline-flex items-center">
                          Section {assignedGroup.group}
                        </span>
                      ) : (
                        <Select
                          value={String(currentTheorySec)}
                          onValueChange={(val) =>
                            handleSelectGroupTheorySec(Number(val))
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-7 w-[105px] rounded-full border-primary/40 bg-primary/10 text-primary font-bold text-xs hover:bg-primary/15 transition-colors focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3].map((s) => (
                              <SelectItem
                                key={s}
                                value={String(s)}
                                className="text-xs font-medium cursor-pointer"
                              >
                                Section {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3" />
                        {isAutoAssigned ? "เลือกให้อัตโนมัติแล้ว" : "เลือกเองได้"}
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: Lab */}
                  <tr>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      <div className="font-semibold text-foreground">
                        วิชาปฏิบัติ
                      </div>
                      <div className="text-[11px] text-muted-foreground font-normal">
                        Lab
                      </div>
                    </td>
                    <td className="py-3 px-3.5 align-middle">
                      <div className="font-medium text-foreground">
                        OOP Lab, DSA Lab
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        ปฏิบัติการวันศุกร์
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      {isAutoAssigned && assignedGroup ? (
                        <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-xs font-bold inline-flex items-center">
                          Section {assignedGroup.group + 3}
                        </span>
                      ) : (
                        <Select
                          value={String(currentLabSec)}
                          onValueChange={(val) =>
                            handleSelectGroupLabSec(Number(val))
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-7 w-[105px] rounded-full border-primary/40 bg-primary/10 text-primary font-bold text-xs hover:bg-primary/15 transition-colors focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[4, 5, 6].map((s) => (
                              <SelectItem
                                key={s}
                                value={String(s)}
                                className="text-xs font-medium cursor-pointer"
                              >
                                Section {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3" />
                        {isAutoAssigned ? "เลือกให้อัตโนมัติแล้ว" : "เลือกเองได้"}
                      </span>
                    </td>
                  </tr>

                  {/* Row 3: Digital Citizen (GenEd) */}
                  <tr>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      <div className="font-semibold text-foreground">
                        วิชาศึกษาทั่วไป
                      </div>
                      <div className="text-[11px] text-muted-foreground font-normal">
                        GenEd
                      </div>
                    </td>
                    <td className="py-3 px-3.5 align-middle">
                      <div className="font-medium text-foreground">
                        Digital Citizen (พลเมืองดิจิทัล)
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        เรียนวันพุธ 09:00 - 12:00
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      <Select
                        value={String(
                          selection.theory["90641007"] ?? (600 + effectiveGroup.group)
                        )}
                        onValueChange={(val) =>
                          handleSelectTheorySec("90641007", Number(val))
                        }
                      >
                        <SelectTrigger
                          size="sm"
                          className="h-7 w-[96px] rounded-full border-primary/40 bg-primary/10 text-primary font-bold text-xs hover:bg-primary/15 transition-colors focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dcSections.map((s) => (
                            <SelectItem
                              key={s}
                              value={String(s)}
                              className="text-xs font-medium cursor-pointer"
                            >
                              Sec {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3" />
                        เลือกแล้ว (เปลี่ยนได้)
                      </span>
                    </td>
                  </tr>

                  {/* Row 4: Foundation English 2 (GenEd) */}
                  <tr>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      <div className="font-semibold text-foreground">
                        วิชาศึกษาทั่วไป
                      </div>
                      <div className="text-[11px] text-muted-foreground font-normal">
                        GenEd
                      </div>
                    </td>
                    <td className="py-3 px-3.5 align-middle">
                      <div className="font-medium text-foreground">
                        Foundation English 2 (ภาษาอังกฤษพื้นฐาน 2)
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        เรียนวันพฤหัสบดี
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                      <Select
                        value={String(
                          selection.theory["90644008"] ?? (920 + effectiveGroup.group)
                        )}
                        onValueChange={(val) =>
                          handleSelectTheorySec("90644008", Number(val))
                        }
                      >
                        <SelectTrigger
                          size="sm"
                          className="h-7 w-[96px] rounded-full border-primary/40 bg-primary/10 text-primary font-bold text-xs hover:bg-primary/15 transition-colors focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {feSections.map((s) => (
                            <SelectItem
                              key={s}
                              value={String(s)}
                              className="text-xs font-medium cursor-pointer"
                            >
                              Sec {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3" />
                        เลือกแล้ว (เปลี่ยนได้)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
