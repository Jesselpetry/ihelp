"use client";

import { useEffect, useState } from "react";
import type { MeResponse } from "@/app/api/me/route";
import { TopicHeader } from "@/components/course-hub-shared";
import { Button } from "@/components/ui/button";
import {
  Y1_S1_GRADE_COURSES,
  matchScoreForCourse,
} from "@/lib/grades/y1s1-courses";
import { useLocale, t, type LText } from "@/lib/i18n";
import type {
  CourseScoreViewResponse,
  GradesOverviewResponse,
} from "@/lib/scores/types";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";
import { GradeCourseAccordion } from "./grade-course-accordion";
import { GradesBanner } from "./grades-banner";
import { GradesOverviewTable } from "./grades-overview-table";
import { GradesSidebar } from "./grades-sidebar";

const L = {
  overviewHeading: { th: "ภาพรวมคะแนนทั้งหมด", en: "All courses overview" },
  detailsHeading: { th: "รายละเอียดแต่ละรายวิชา", en: "Course details" },
  expandAll: { th: "เปิดทั้งหมด", en: "Expand all" },
  collapseAll: { th: "พับทั้งหมด", en: "Collapse all" },
} satisfies Record<string, LText>;

export function GradesHub() {
  const { locale } = useLocale();
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
  const [scores, setScores] = useState<CourseScoreViewResponse[]>([]);
  const [hasLocalSheets, setHasLocalSheets] = useState(false);

  const [activeSection, setActiveSection] = useState<string>("overview");
  const [openCodes, setOpenCodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const [meResult, overviewResult] = await Promise.allSettled([
        fetch("/api/me", { signal: controller.signal }),
        fetch("/api/local-scores/overview", { signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

      let authenticated = false;
      let nextViewer = {
        studentId: null as string | null,
        fullName: null as string | null,
        nickname: null as string | null,
        avatarUrl: null as string | null,
        avatarInitial: "I",
      };

      if (meResult.status === "fulfilled" && meResult.value.ok) {
        const me = (await meResult.value.json()) as MeResponse;
        if (controller.signal.aborted) return;
        authenticated = true;
        nextViewer = {
          studentId: me.studentId,
          fullName: me.fullName ?? me.displayName ?? null,
          nickname: me.nickname ?? null,
          avatarUrl: me.avatarUrl ?? null,
          avatarInitial:
            me.initial || (me.studentId ? me.studentId.charAt(0) : "I"),
        };
      }

      if (overviewResult.status === "fulfilled") {
        const res = overviewResult.value;
        if (res.ok) {
          const data = (await res.json()) as GradesOverviewResponse;
          if (controller.signal.aborted) return;
          authenticated = true;
          nextViewer = {
            ...nextViewer,
            studentId: data.viewerId || nextViewer.studentId,
            fullName: data.viewerFullName ?? nextViewer.fullName,
            nickname: data.viewerNickname ?? nextViewer.nickname,
            avatarInitial:
              nextViewer.avatarInitial !== "I"
                ? nextViewer.avatarInitial
                : (data.viewerFullName || data.viewerId || "I").charAt(0),
          };
          setScores(data.courses);
          setHasLocalSheets(data.courses.length > 0);
        } else if (res.status === 401) {
          authenticated = false;
          setHasLocalSheets(true);
        } else {
          setHasLocalSheets(false);
        }
      }

      setViewer(nextViewer);
      setAuthStatus(authenticated ? "authenticated" : "unauthenticated");
    }

    void load();
    return () => controller.abort();
  }, []);

  async function signInWithKmitl() {
    if (!supabaseConfigured) return;
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          "/grades",
        )}`,
        queryParams: { hd: "kmitl.ac.th" },
      },
    });
  }

  function scrollToElement(id: string) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function handleSelectOverview() {
    setActiveSection("overview");
    scrollToElement("overview");
  }

  function handleSelectCourse(code: string) {
    setActiveSection(code);
    setOpenCodes((prev) => ({ ...prev, [code]: true }));
    scrollToElement(`course-${code}`);
  }

  function handleToggleCourse(code: string) {
    setActiveSection(code);
    setOpenCodes((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  const allExpanded = Y1_S1_GRADE_COURSES.every((c) => Boolean(openCodes[c.code]));

  function handleToggleAll() {
    const nextValue = !allExpanded;
    const nextState: Record<string, boolean> = {};
    for (const c of Y1_S1_GRADE_COURSES) {
      nextState[c.code] = nextValue;
    }
    setOpenCodes(nextState);
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 px-3 py-5 sm:px-5 sm:py-6">
      <GradesBanner
        viewerId={viewer.studentId}
        viewerFullName={viewer.fullName}
        viewerNickname={viewer.nickname}
        avatarUrl={viewer.avatarUrl}
        avatarInitial={viewer.avatarInitial}
        isSignedIn={authStatus === "authenticated"}
      />

      <div className="grid gap-5 lg:grid-cols-[268px_minmax(0,1fr)] lg:gap-6">
        <GradesSidebar
          courses={Y1_S1_GRADE_COURSES}
          activeSection={activeSection}
          onSelectOverview={handleSelectOverview}
          onSelectCourse={handleSelectCourse}
        />

        <div className="min-w-0 space-y-6">
          <section className="space-y-2.5">
            <TopicHeader id="overview" title={t(L.overviewHeading, locale)} />
            <GradesOverviewTable
              courses={Y1_S1_GRADE_COURSES}
              scores={scores}
              authStatus={authStatus}
              hasLocalSheets={hasLocalSheets}
              onSignIn={() => void signInWithKmitl()}
              onSelectCourse={handleSelectCourse}
            />
          </section>

          <section aria-labelledby="courses" className="space-y-2.5">
            <TopicHeader
              id="courses"
              title={t(L.detailsHeading, locale)}
              aside={
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  aria-expanded={allExpanded}
                  onClick={handleToggleAll}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {allExpanded
                    ? t(L.collapseAll, locale)
                    : t(L.expandAll, locale)}
                </Button>
              }
            />

            <div className="space-y-2.5">
              {Y1_S1_GRADE_COURSES.map((course) => (
                <GradeCourseAccordion
                  key={course.code}
                  course={course}
                  score={matchScoreForCourse(course, scores)}
                  isOpen={Boolean(openCodes[course.code])}
                  onToggle={() => handleToggleCourse(course.code)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
