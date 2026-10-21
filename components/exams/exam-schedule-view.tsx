"use client";

import { SITE } from "@/lib/site";

import { useState, useMemo, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Search,
  Clock,
  MapPin,
  User,
  Copy,
  Check,
  Download,
  Sparkles,
  Armchair,
  BookOpen,
  Filter,
  X,
  Layers,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Printer,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MeResponse } from "@/app/api/me/route";
import { GoogleMark } from "@/components/account/google-mark";
import { createClient } from "@/lib/supabase/client";
import { verifyKmitlIt } from "@/lib/auth/verify";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  getStudentProfile,
  getAllFacultyExams,
  getAllExamDates,
  generateICS,
  sanitizeStudentId,
  getRoomSeatingSession,
  getCoursePortalHref,
  findSeatingForCourse,
} from "@/lib/exams/schedule";
import type {
  StudentExamProfile,
  FacultyMasterExamItem,
  FinalExamItem,
  MidtermSeatingItem,
} from "@/lib/exams/types";
import { RoomSeatingChart } from "./room-seating-chart";

const L: Record<string, LText> = {
  title: { th: "ตารางสอบ & ผังที่นั่งสอบ", en: "Exam Schedule & Seating" },
  subtitle: {
    th: `ค้นหากำหนดการสอบปลายภาค ห้องสอบ และผังที่นั่งแบบห้องเรียนรายบุคคล ${SITE.org.name.th}`,
    en: `Find final exam dates, rooms, and classroom seating charts for ${SITE.org.short}`,
  },
  searchPlaceholder: {
    th: "พิมพ์รหัสนักศึกษา 8 หลักเพื่อค้นหาตารางสอบ...",
    en: "Enter 8-digit student ID to search schedule...",
  },
  searchButton: { th: "ค้นหา", en: "Search" },
  tabMySchedule: { th: "ตารางสอบของฉัน", en: "My Schedule" },
  tabAll: { th: "ตารางรวมทั้งคณะ", en: "All Faculty Exams" },
  filterAll: { th: "ทั้งหมด", en: "All Exams" },
  filterFinal: { th: "สอบปลายภาค", en: "Final Exams" },
  filterMidterm: { th: "สอบกลางภาค", en: "Midterm Exams" },
  downloadIcs: { th: "เพิ่มลงปฏิทิน (.ics)", en: "Add to Calendar (.ics)" },
  copiedText: { th: "คัดลอกตารางแล้ว!", en: "Schedule copied!" },
  copySchedule: { th: "คัดลอกตาราง", en: "Copy Schedule" },
  noStudentFound: {
    th: "ไม่พบข้อมูลที่นั่งสอบของรหัสนี้ กรุณาตรวจสอบรหัสนักศึกษา 8 หลักอีกครั้ง",
    en: "No student record found for this ID. Please double check your 8-digit student ID.",
  },
  allDates: { th: "ทุกวันสอบ", en: "All Dates" },
  filterByDate: { th: "กรองตามวัน:", en: "Filter Date:" },
  searchMaster: {
    th: "ค้นหารหัสวิชา ชื่อวิชา ห้องสอบ หรือช่วงรหัส...",
    en: "Search course code, name, room, or ID range...",
  },
  myScheduleBadge: { th: "ตารางสอบของคุณ", en: "My Schedule" },
  viewingOtherStudent: {
    th: "กำลังดูตารางสอบของเพื่อน",
    en: "Viewing another student's schedule",
  },
  viewMySchedule: { th: "กลับไปตารางของฉัน", en: "Back to my schedule" },
  signInPrompt: {
    th: "เข้าสู่ระบบด้วยอีเมล @kmitl.ac.th เพื่อดูตารางสอบของคุณโดยอัตโนมัติ",
    en: "Sign in with @kmitl.ac.th to automatically view your exam schedule",
  },
  signInButton: { th: "เข้าสู่ระบบด้วย Google", en: "Sign in with Google" },
};

const DISMISS_KEY = "ihelp_emergency_dismissed_until";

export function ExamScheduleView({ isHardReload = false }: { isHardReload?: boolean }) {
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlId = searchParams.get("id") || "";
  const [studentIdInput, setStudentIdInput] = useState(urlId || "");
  const [activeStudentId, setActiveStudentId] = useState(urlId || "");
  const [activeMainTab, setActiveMainTab] = useState<"my_schedule" | "all">("my_schedule");
  const [scheduleFilter, setScheduleFilter] = useState<"all" | "final" | "midterm">("all");
  const [copied, setCopied] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
  const lobotomyAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check 24-hour dismissal status or hard reload reset
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const forceReset =
        isHardReload ||
        urlParams.get("emergency") === "1" ||
        urlParams.get("reset") === "1";

      if (forceReset) {
        try {
          localStorage.removeItem(DISMISS_KEY);
        } catch {}
        setShowEmergencyModal(true);
        return;
      }

      try {
        const raw = localStorage.getItem(DISMISS_KEY);
        if (raw) {
          const until = Number.parseInt(raw, 10);
          if (!Number.isNaN(until) && Date.now() < until) {
            setShowEmergencyModal(false);
            return;
          }
        }
      } catch {}

      setShowEmergencyModal(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [isHardReload]);

  const dismissEmergencyModal = () => {
    setShowEmergencyModal(false);
    try {
      // Dismiss for 24 hours (86,400,000 ms)
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
    } catch {}
  };

  const triggerEmergencyResign = () => {
    setShowResignModal(true);
    try {
      if (!lobotomyAudioRef.current) {
        lobotomyAudioRef.current = new Audio("/audio/lobotomy.mp3");
      }
      lobotomyAudioRef.current.currentTime = 0;
      lobotomyAudioRef.current.volume = 0.85;
      lobotomyAudioRef.current.play().catch((e) => {
        console.warn("SFX autoplay blocked:", e);
      });
    } catch (e) {
      console.warn("Failed to play audio:", e);
    }
  };

  const closeResignModal = () => {
    if (lobotomyAudioRef.current) {
      lobotomyAudioRef.current.pause();
    }
    setShowResignModal(false);
  };

  useEffect(() => {
    if (!showResignModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeResignModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResignModal]);

  // Expanded inline seating chart course code
  const [expandedCourseCode, setExpandedCourseCode] = useState<string | null>(null);

  // User session state
  const [loggedInStudentId, setLoggedInStudentId] = useState<string | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<MeResponse | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Master schedule filters
  const [masterSearch, setMasterSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("ALL");

  // Sync with Supabase Auth session & auto-search logged-in student's schedule
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function applySession(email: string | null | undefined) {
      const verified = verifyKmitlIt(email);
      if (cancelled) return;

      setAuthChecked(true);

      if (verified.ok) {
        const studentId = verified.studentId;
        setLoggedInStudentId(studentId);

        try {
          const res = await fetch("/api/me");
          if (res.ok && !cancelled) {
            const data: MeResponse = await res.json();
            setCurrentUserInfo(data);
          }
        } catch {
          // non-critical me fetch
        }

        const currentUrlId = searchParams.get("id");
        if (!currentUrlId) {
          setStudentIdInput(studentId);
          setActiveStudentId(studentId);
          window.localStorage.setItem("ihelp-exam-student-id", studentId);
          startTransition(() => {
            const params = new URLSearchParams(window.location.search);
            params.set("id", studentId);
            router.replace(`?${params.toString()}`);
          });
        }
      } else {
        setLoggedInStudentId(null);
        const currentUrlId = searchParams.get("id");
        if (!currentUrlId) {
          const saved = window.localStorage.getItem("ihelp-exam-student-id");
          if (saved) {
            setStudentIdInput(saved);
            setActiveStudentId(saved);
          } else {
            setStudentIdInput("69070027");
            setActiveStudentId("69070027");
          }
        }
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      applySession(data.user?.email);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user?.email);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [searchParams, router]);

  useEffect(() => {
    if (urlId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- URL param sync
      setStudentIdInput(urlId);
      setActiveStudentId(urlId);
    }
  }, [urlId]);

  const profile: StudentExamProfile | null = useMemo(() => {
    if (!activeStudentId || activeStudentId.length < 8) return null;
    return getStudentProfile(activeStudentId);
  }, [activeStudentId]);

  // Seating lookup map by course code
  const seatingByCourseCode = useMemo(() => {
    const map = new Map<string, MidtermSeatingItem>();
    if (!profile) return map;
    profile.midterm_exams.forEach((item) => {
      map.set(item.course_code, item);
      // Also map PSCP aliases
      if (item.course_code === "06066303") map.set("06016409", item);
      if (item.course_code === "06016409") map.set("06066303", item);
    });
    return map;
  }, [profile]);

  // Next Upcoming Final Exam (Hero item)
  const upcomingExam = useMemo(() => {
    if (!profile || profile.final_exams.length === 0) return null;
    const sorted = [...profile.final_exams].sort((a, b) =>
      a.final_exam.date_iso.localeCompare(b.final_exam.date_iso),
    );
    return sorted[0] || null;
  }, [profile]);

  const allExamDates = useMemo(() => getAllExamDates(), []);
  const masterExams = useMemo(
    () => getAllFacultyExams(masterSearch, selectedDate),
    [masterSearch, selectedDate],
  );

  // ── Group Final Exams by Date (Chronological) ──
  const finalExamsByDate = useMemo(() => {
    if (!profile) return [];
    const dateMap = new Map<
      string,
      { dateTh: string; dateEn: string; dateIso: string; exams: FinalExamItem[] }
    >();

    profile.final_exams.forEach((exam) => {
      const iso = exam.final_exam.date_iso;
      if (!dateMap.has(iso)) {
        dateMap.set(iso, {
          dateTh: exam.final_exam.date_th,
          dateEn: exam.final_exam.date_en,
          dateIso: iso,
          exams: [],
        });
      }
      dateMap.get(iso)!.exams.push(exam);
    });

    return Array.from(dateMap.values()).sort((a, b) =>
      a.dateIso.localeCompare(b.dateIso),
    );
  }, [profile]);

  // ── Group Master Exams by Date ──
  const masterExamsByDate = useMemo(() => {
    const dateMap = new Map<string, FacultyMasterExamItem[]>();
    masterExams.forEach((exam) => {
      const d = exam.exam_date;
      if (!dateMap.has(d)) dateMap.set(d, []);
      dateMap.get(d)!.push(exam);
    });
    return Array.from(dateMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [masterExams]);

  function handleSearch(idToSearch?: string) {
    const target = sanitizeStudentId(idToSearch || studentIdInput);
    if (!target) return;
    setStudentIdInput(target);
    setActiveStudentId(target);
    window.localStorage.setItem("ihelp-exam-student-id", target);

    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("id", target);
      router.replace(`?${params.toString()}`);
    });
  }

  function toggleCourseSeating(courseCode: string) {
    setExpandedCourseCode((prev) => (prev === courseCode ? null : courseCode));
  }

  async function handleSignIn() {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/exam-schedule`,
        queryParams: { hd: "kmitl.ac.th" },
      },
    });
  }

  function handleDownloadICS() {
    if (!profile || profile.final_exams.length === 0) return;
    const icsContent = generateICS(profile.final_exams, profile.student_id, profile.name);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kmitl-final-exams-${profile.student_id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleCopySchedule() {
    if (!profile) return;
    let text = `📅 ตารางสอบ IT KMITL - ${profile.student_id} ${profile.name || ""}\n\n`;

    if (profile.final_exams.length > 0) {
      text += `📌 กำหนดการสอบปลายภาค (เทอม 1/2569):\n`;
      finalExamsByDate.forEach((group) => {
        text += `\n🗓️ วัน${group.dateTh}:\n`;
        group.exams.forEach((item) => {
          text += `  • ${item.course_code} ${item.short_name || item.course_name} (${item.final_exam.time} น.)\n`;
          const seat = seatingByCourseCode.get(item.course_code);
          if (seat) {
            text += `    ห้องสอบ: ${seat.building} ${seat.room} | ที่นั่ง: ${seat.seat}\n`;
          }
          if (item.sections?.theory?.section) {
            text += `    กลุ่ม: Sec ${item.sections.theory.section}\n`;
          }
        });
      });
      text += `\n`;
    }

    if (profile.midterm_exams.length > 0) {
      text += `📌 ผังที่นั่งสอบ & ห้องสอบ:\n`;
      profile.midterm_exams.forEach((item) => {
        text += `• ${item.course_code} ${item.short_name ? `${item.short_name} — ` : ""}${item.course_name}\n`;
        text += `  ห้องสอบ: ${item.building} ${item.room} | ที่นั่ง: ${item.seat} (ลำดับที่ ${item.seq})\n`;
        text += `  วัน-เวลา: ${item.exam_date} (${item.time} น.)\n`;
      });
    }

    const origin = typeof window !== "undefined" ? window.location.origin : SITE.url;
    text += `\nตรวจตารางสอบผ่าน ${SITE.shortName}: ${origin}/exam-schedule`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function getDaysRemaining(isoDate: string): number {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const exam = new Date(`${isoDate}T00:00:00+07:00`).getTime();
    return Math.max(0, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-6 sm:py-10 animate-in fade-in-0 duration-500">
      {/* ── Page Header ── */}
      <div className="mb-8 text-center animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <CalendarDays className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t(L.title, locale)}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t(L.subtitle, locale)}
        </p>
      </div>

      {/* ── Search Input Box ── */}
      <div className="mx-auto mb-8 max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center shadow-sm rounded-full border bg-card/90 p-1.5 backdrop-blur-md transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
        >
          <Search className="ml-3 size-4 text-muted-foreground shrink-0" />
          <Input
            value={studentIdInput}
            onChange={(e) => setStudentIdInput(e.target.value)}
            placeholder={t(L.searchPlaceholder, locale)}
            maxLength={10}
            className="h-9 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {studentIdInput && (
            <button
              type="button"
              onClick={() => {
                setStudentIdInput("");
                setActiveStudentId("");
                const params = new URLSearchParams(window.location.search);
                params.delete("id");
                router.replace(
                  params.toString() ? `?${params.toString()}` : window.location.pathname,
                );
              }}
              className="p-1 text-muted-foreground hover:text-foreground mr-1"
            >
              <X className="size-4" />
            </button>
          )}
          <Button type="submit" size="sm" className="rounded-full px-5 text-xs font-semibold">
            {t(L.searchButton, locale)}
          </Button>
        </form>

        {/* Logged in helper / Quick switch to My Schedule */}
        {loggedInStudentId && activeStudentId && activeStudentId !== loggedInStudentId && (
          <div className="mt-2.5 flex items-center justify-center gap-2 text-xs animate-in fade-in-0">
            <span className="text-muted-foreground">{t(L.viewingOtherStudent, locale)}</span>
            <button
              type="button"
              onClick={() => handleSearch(loggedInStudentId)}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <User className="size-3" />
              <span>{t(L.viewMySchedule, locale)} ({loggedInStudentId})</span>
            </button>
          </div>
        )}

        {/* Sign in prompt if not logged in */}
        {authChecked && !loggedInStudentId && !activeStudentId && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{t(L.signInPrompt, locale)}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignIn}
              className="h-7 rounded-full text-xs gap-1.5 px-3 border-dashed hover:border-primary"
            >
              <GoogleMark className="size-3.5" />
              <span>{t(L.signInButton, locale)}</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Main Tab Navigation (Unified My Schedule vs Faculty Master) ── */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full border bg-muted/40 p-1 text-xs font-medium backdrop-blur-md">
          <button
            onClick={() => setActiveMainTab("my_schedule")}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 transition-all ${
              activeMainTab === "my_schedule"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>{t(L.tabMySchedule, locale)}</span>
            {profile && profile.final_exams.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {profile.final_exams.length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveMainTab("all")}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 transition-all ${
              activeMainTab === "all"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>{t(L.tabAll, locale)}</span>
          </button>
        </div>
      </div>

      {/* ── Student Profile Header Banner (Polished & Professional) ── */}
      {activeMainTab === "my_schedule" && profile && (
        <div className="mb-6 rounded-3xl border bg-card/90 p-4 sm:p-5 shadow-xs backdrop-blur-md transition-all">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: User Avatar & Profile Info */}
              <div className="flex items-center gap-4">
                {/* Rounded-Full User Profile Avatar */}
                <Avatar className="size-14 sm:size-16 shrink-0 rounded-full border border-border shadow-xs">
                  {currentUserInfo && currentUserInfo.studentId === profile.student_id && currentUserInfo.avatarUrl ? (
                    <AvatarImage
                      src={currentUserInfo.avatarUrl}
                      alt={profile.name || profile.student_id}
                      className="rounded-full object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-lg sm:text-xl">
                    {profile.name
                      ? profile.name.charAt(0)
                      : profile.student_id
                        ? profile.student_id.slice(-2)
                        : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                      {profile.name || `นักศึกษา ${profile.student_id}`}
                    </h2>
                    <Badge variant="outline" className="font-mono text-xs font-semibold px-2 py-0.5 bg-muted/40">
                      {profile.student_id}
                    </Badge>
                    {loggedInStudentId === profile.student_id && (
                      <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1">
                        <Check className="size-3" />
                        <span>{t(L.myScheduleBadge, locale)}</span>
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{profile.faculty}</span>
                    {profile.year && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-primary">ชั้นปีที่ {profile.year}</span>
                      </>
                    )}
                    {profile.cohort_order && (
                      <>
                        <span>•</span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                          {profile.cohort_order}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: 2 Stacked Clean Buttons Aligned Right */}
              <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                {profile.final_exams.length > 0 && (
                  <Button
                    onClick={handleDownloadICS}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs gap-1.5 h-8.5 px-3.5 border-border hover:border-primary/50 hover:bg-primary/5 transition-all justify-center sm:justify-start"
                  >
                    <Download className="size-3.5 text-primary" />
                    <span>{t(L.downloadIcs, locale)}</span>
                  </Button>
                )}

                <Button
                  onClick={handleCopySchedule}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 h-8.5 px-3.5 border-border hover:border-primary/50 hover:bg-primary/5 transition-all justify-center sm:justify-start"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5 text-muted-foreground" />}
                  <span>{copied ? t(L.copiedText, locale) : t(L.copySchedule, locale)}</span>
                </Button>
              </div>
            </div>
          </div>
      )}

      {/* ── Not Found State ── */}
      {activeMainTab === "my_schedule" && activeStudentId && !profile && (
        <div className="mb-6 rounded-2xl border border-dashed p-8 text-center bg-card/40">
          <User className="mx-auto size-8 text-muted-foreground/60 mb-2" />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t(L.noStudentFound, locale)}
          </p>
        </div>
      )}

      {/* ── UNIFIED MY SCHEDULE VIEW ── */}
      {activeMainTab === "my_schedule" && profile && (
        <div className="space-y-6 animate-in fade-in-0 duration-300">
          {/* Filter Pills for Schedule */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setScheduleFilter("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                scheduleFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterAll, locale)} ({profile.final_exams.length + profile.midterm_exams.length})
            </button>
            <button
              onClick={() => setScheduleFilter("final")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                scheduleFilter === "final"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterFinal, locale)} ({profile.final_exams.length})
            </button>
            <button
              onClick={() => setScheduleFilter("midterm")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                scheduleFilter === "midterm"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(L.filterMidterm, locale)} ({profile.midterm_exams.length})
            </button>
          </div>

          {/* 🌟 1. Upcoming Hero Exam Card */}
          {upcomingExam && (scheduleFilter === "all" || scheduleFilter === "final") && (() => {
            const upcomingDays = getDaysRemaining(upcomingExam.final_exam.date_iso);
            const upcomingSeat =
              seatingByCourseCode.get(upcomingExam.course_code) ||
              findSeatingForCourse(profile.midterm_exams, upcomingExam.course_code);
            const portalHref = getCoursePortalHref(upcomingExam.course_code);
            const isChartOpen = expandedCourseCode === upcomingExam.course_code;
            const seatingSession = upcomingSeat
              ? getRoomSeatingSession(
                  upcomingSeat.course_code,
                  upcomingSeat.room,
                  upcomingSeat.exam_date,
                )
              : null;

            return (
              <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/[0.04] p-5 sm:p-6 shadow-sm transition-all hover:border-primary/40">
                {/* Top Bar: Hero Badge & Countdown Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="font-semibold text-xs px-2.5 py-0.5 bg-primary text-primary-foreground shadow-xs">
                      วิชาสอบถัดไป
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Clock className="size-3.5 text-primary" />
                    <span>{upcomingDays === 0 ? "สอบวันนี้!" : `อีก ${upcomingDays} วัน`}</span>
                  </div>
                </div>

                {/* Course Info Header */}
                <div className="mb-4">
                  {portalHref ? (
                    <Link
                      href={portalHref}
                      className="group/link inline-flex items-baseline gap-2 flex-wrap"
                    >
                      {upcomingExam.short_name ? (
                        <>
                          <h3 className="font-bold text-xl sm:text-2xl tracking-tight text-foreground group-hover/link:text-primary transition-colors">
                            {upcomingExam.short_name}
                          </h3>
                          <span className="text-sm sm:text-base font-normal text-muted-foreground group-hover/link:text-foreground transition-colors">
                            {upcomingExam.course_name}
                          </span>
                        </>
                      ) : (
                        <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover/link:text-primary transition-colors">
                          {upcomingExam.course_name}
                        </h3>
                      )}
                    </Link>
                  ) : (
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {upcomingExam.short_name ? (
                        <>
                          <h3 className="font-bold text-xl sm:text-2xl tracking-tight text-foreground">
                            {upcomingExam.short_name}
                          </h3>
                          <span className="text-sm sm:text-base font-normal text-muted-foreground">
                            {upcomingExam.course_name}
                          </span>
                        </>
                      ) : (
                        <h3 className="font-bold text-lg sm:text-xl text-foreground">
                          {upcomingExam.course_name}
                        </h3>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-mono font-medium">{upcomingExam.course_code}</span>
                    {upcomingExam.course_name_th && <span> • {upcomingExam.course_name_th}</span>}
                  </p>
                </div>

                {/* Exam Logistics & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs">
                  {/* Logistics: Date, Time, Room & Seat */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 font-medium text-foreground bg-muted/60 px-2.5 py-1.5 rounded-xl">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span>วัน{upcomingExam.final_exam.date_th}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 font-semibold text-foreground bg-muted/60 px-2.5 py-1.5 rounded-xl">
                      <Clock className="size-3.5 text-primary shrink-0" />
                      <span>{upcomingExam.final_exam.time} น.</span>
                    </div>

                    {upcomingSeat ? (
                      <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-xl font-medium">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="text-foreground">อาคาร {upcomingSeat.building} ห้อง {upcomingSeat.room}</span>
                        <span>•</span>
                        <span>ที่นั่ง</span>
                        <span className="font-bold text-orange-600 dark:text-orange-400">{upcomingSeat.seat}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-xl">
                        <MapPin className="size-3.5 shrink-0" />
                        <span>ห้องสอบ: รอประกาศผังทางการ</span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Hero gets Solid Blue Primary Button */}
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                    {portalHref && (
                      <Link
                        href={portalHref}
                        className="inline-flex items-center gap-1.5 rounded-xl text-xs px-3 py-1.5 border hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors h-8.5"
                      >
                        <BookOpen className="size-3.5 text-primary" />
                        <span>หน้ารายวิชา</span>
                        <ExternalLink className="size-3 text-muted-foreground" />
                      </Link>
                    )}

                    {seatingSession && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => toggleCourseSeating(upcomingExam.course_code)}
                        className="rounded-xl text-xs gap-1.5 h-8.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs transition-all"
                      >
                        <Armchair className="size-3.5" />
                        <span>{isChartOpen ? "ซ่อนผังที่นั่ง" : "ดูผังที่นั่ง"}</span>
                        {isChartOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline Seating Chart Drawer */}
                {isChartOpen && seatingSession && (
                  <div className="mt-5 pt-4 border-t animate-in fade-in-0 duration-300">
                    <RoomSeatingChart
                      session={seatingSession}
                      mySeat={upcomingSeat?.seat}
                      myStudentId={profile.student_id}
                      onClose={() => setExpandedCourseCode(null)}
                    />
                  </div>
                )}
              </div>
            );
          })()}

          {/* 🗓️ 2. Final Exam Timeline Cards */}
          {(scheduleFilter === "all" || scheduleFilter === "final") && (
            <div className="space-y-6">
              <div className="border-b pb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  <span>กำหนดการสอบปลายภาค (Final Examination Schedule)</span>
                </h4>
                <Badge variant="outline" className="text-xs">
                  {profile.final_exams.length} วิชา
                </Badge>
              </div>

              {finalExamsByDate.map((group) => {
                const days = getDaysRemaining(group.dateIso);

                return (
                  <div key={group.dateIso} className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-primary" />
                        <h5 className="font-semibold text-sm sm:text-base text-foreground">
                          วัน{group.dateTh}
                        </h5>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {days === 0 ? "สอบวันนี้!" : `อีก ${days} วัน`}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {group.exams.map((exam) => {
                        const seatInfo =
                          seatingByCourseCode.get(exam.course_code) ||
                          findSeatingForCourse(profile.midterm_exams, exam.course_code);
                        const portalHref = getCoursePortalHref(exam.course_code);
                        const isChartOpen = expandedCourseCode === exam.course_code;
                        const seatingSession = seatInfo
                          ? getRoomSeatingSession(
                              seatInfo.course_code,
                              seatInfo.room,
                              seatInfo.exam_date,
                            )
                          : null;

                        return (
                          <div
                            key={exam.course_code}
                            className="group rounded-2xl border bg-card p-4 sm:p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-xs"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                              {/* Left: Course Info (Short name prominent, clean subtitle without pill clutter) */}
                              <div className="min-w-0 flex-1">
                                {portalHref ? (
                                  <Link
                                    href={portalHref}
                                    className="group/link inline-flex items-baseline gap-2 flex-wrap"
                                  >
                                    {exam.short_name ? (
                                      <>
                                        <span className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover/link:text-primary transition-colors">
                                          {exam.short_name}
                                        </span>
                                        <span className="text-xs sm:text-sm font-normal text-muted-foreground group-hover/link:text-foreground transition-colors">
                                          {exam.course_name}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-base font-bold text-foreground group-hover/link:text-primary transition-colors">
                                        {exam.course_name}
                                      </span>
                                    )}
                                  </Link>
                                ) : (
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    {exam.short_name ? (
                                      <>
                                        <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                                          {exam.short_name}
                                        </span>
                                        <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                                          {exam.course_name}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-base font-bold text-foreground">
                                        {exam.course_name}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <p className="text-xs text-muted-foreground mt-0.5">
                                  <span className="font-mono font-medium">{exam.course_code}</span>
                                  {exam.course_name_th && <span> • {exam.course_name_th}</span>}
                                </p>
                              </div>

                              {/* Right: Logistics (Time, Room, Seat) & Actions */}
                              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50">
                                {/* Logistics Pill Group: Visual Grouping for Time, Room, and Seat */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <div className="inline-flex items-center gap-1.5 font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                                    <Clock className="size-3.5 text-primary shrink-0" />
                                    <span>{exam.final_exam.time} น.</span>
                                  </div>

                                  {seatInfo ? (
                                    <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg font-medium">
                                      <MapPin className="size-3.5 text-primary shrink-0" />
                                      <span className="text-foreground">อาคาร {seatInfo.building} ห้อง {seatInfo.room}</span>
                                      <span>•</span>
                                      <span>ที่นั่ง</span>
                                      <span className="font-bold text-orange-600 dark:text-orange-400">{seatInfo.seat}</span>
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg">
                                      <MapPin className="size-3.5 shrink-0" />
                                      <span>รอประกาศผัง</span>
                                    </div>
                                  )}
                                </div>

                                {/* Actions: Soft Button + Subtle Link */}
                                <div className="flex items-center gap-1.5 shrink-0 ml-auto lg:ml-0">
                                  {portalHref && (
                                    <Link
                                      href={portalHref}
                                      className="inline-flex items-center gap-1 rounded-xl text-xs px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors h-8"
                                      title="เปิดหน้ารายวิชา"
                                    >
                                      <BookOpen className="size-3.5 text-primary" />
                                      <span className="hidden sm:inline">วิชา</span>
                                      <ExternalLink className="size-3 text-muted-foreground" />
                                    </Link>
                                  )}

                                  {seatingSession && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => toggleCourseSeating(exam.course_code)}
                                      className="rounded-xl text-xs gap-1.5 h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary border-0 font-medium transition-all"
                                    >
                                      <Armchair className="size-3.5" />
                                      <span>{isChartOpen ? "ซ่อนผัง" : "ดูผังที่นั่ง"}</span>
                                      {isChartOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Inline Expandable Seating Chart */}
                            {isChartOpen && seatingSession && (
                              <div className="mt-4 pt-4 border-t animate-in fade-in-0 duration-300">
                                <RoomSeatingChart
                                  session={seatingSession}
                                  mySeat={seatInfo?.seat}
                                  myStudentId={profile.student_id}
                                  onClose={() => setExpandedCourseCode(null)}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 📋 3. Midterm Seating List (When filter includes Midterm) */}
          {(scheduleFilter === "all" || scheduleFilter === "midterm") && profile.midterm_exams.length > 0 && (
            <div className="space-y-4 pt-6">
              <div className="border-b pb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Armchair className="size-4 text-orange-500" />
                  <span>ผังที่นั่งและห้องสอบกลางภาค (Midterm Seating & Venue)</span>
                </h4>
                <Badge variant="outline" className="text-xs">
                  {profile.midterm_exams.length} วิชา
                </Badge>
              </div>

              <div className="space-y-3">
                {profile.midterm_exams.map((seat) => {
                  const portalHref = getCoursePortalHref(seat.course_code);
                  const isChartOpen = expandedCourseCode === `midterm-${seat.course_code}-${seat.room}`;
                  const seatingSession = getRoomSeatingSession(
                    seat.course_code,
                    seat.room,
                    seat.exam_date,
                  );

                  return (
                    <div
                      key={`midterm-${seat.course_code}-${seat.room}`}
                      className="group rounded-2xl border bg-card p-4 sm:p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-xs"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                        {/* Left: Course Info */}
                        <div className="min-w-0 flex-1">
                          {portalHref ? (
                            <Link
                              href={portalHref}
                              className="group/link inline-flex items-baseline gap-2 flex-wrap"
                            >
                              <h5 className="font-semibold text-base text-foreground group-hover/link:text-primary transition-colors">
                                {seat.short_name ? `${seat.short_name} — ` : ""}{seat.course_name}
                              </h5>
                            </Link>
                          ) : (
                            <h5 className="font-semibold text-base text-foreground">
                              {seat.short_name ? `${seat.short_name} — ` : ""}{seat.course_name}
                            </h5>
                          )}

                          <p className="text-xs text-muted-foreground mt-0.5">
                            {seat.course_name_th && <span>{seat.course_name_th} • </span>}
                            <span className="font-mono font-medium">{seat.course_code}</span>
                            <span> • Sec {seat.section}</span>
                            <span> • วันที่ {seat.exam_date}</span>
                          </p>
                        </div>

                        {/* Right: Logistics (Time, Room, Seat) & Actions */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50">
                          {/* Logistics Pill Group */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="inline-flex items-center gap-1.5 font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                              <Clock className="size-3.5 text-primary shrink-0" />
                              <span>{seat.time} น.</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg font-medium">
                              <MapPin className="size-3.5 text-primary shrink-0" />
                              <span className="text-foreground">อาคาร {seat.building} ห้อง {seat.room}</span>
                              <span>•</span>
                              <span>ที่นั่ง</span>
                              <span className="font-bold text-orange-600 dark:text-orange-400">{seat.seat}</span>
                            </div>
                          </div>

                          {/* Actions: Soft Button + Subtle Link */}
                          <div className="flex items-center gap-1.5 shrink-0 ml-auto lg:ml-0">
                            {portalHref && (
                              <Link
                                href={portalHref}
                                className="inline-flex items-center gap-1 rounded-xl text-xs px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors h-8"
                                title="เปิดหน้ารายวิชา"
                              >
                                <BookOpen className="size-3.5 text-primary" />
                                <span className="hidden sm:inline">วิชา</span>
                                <ExternalLink className="size-3 text-muted-foreground" />
                              </Link>
                            )}

                            {seatingSession && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  toggleCourseSeating(`midterm-${seat.course_code}-${seat.room}`)
                                }
                                className="rounded-xl text-xs gap-1.5 h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary border-0 font-medium transition-all"
                              >
                                <Armchair className="size-3.5" />
                                <span>{isChartOpen ? "ซ่อนผัง" : "ดูผังที่นั่ง"}</span>
                                {isChartOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inline Expandable Seating Chart */}
                      {isChartOpen && seatingSession && (
                        <div className="mt-4 pt-4 border-t animate-in fade-in-0 duration-300">
                          <RoomSeatingChart
                            session={seatingSession}
                            mySeat={seat.seat}
                            myStudentId={profile.student_id}
                            onClose={() => setExpandedCourseCode(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          {/* ── 4. Compact GenEd Section ── */}
          {profile.in_class_exams.length > 0 && (
            <div className="mt-8 rounded-2xl border bg-card/60 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b">
                <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-muted-foreground" />
                  <span>รายวิชาศึกษาทั่วไป (GenEd) • ผู้สอนนัดหมายการประเมินในคาบเรียน</span>
                </h4>
                <span className="text-[11px] text-muted-foreground">
                  ไม่มีสอบส่วนกลาง
                </span>
              </div>

              <div className="mt-2.5 divide-y divide-border/50">
                {profile.in_class_exams.map((item) => {
                  const portalHref = getCoursePortalHref(item.course_code);

                  return (
                    <div
                      key={item.course_code}
                      className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs hover:bg-muted/30 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[11px]">
                          {item.course_code}
                        </Badge>
                        {item.short_name && (
                          <Badge variant="secondary" className="font-mono text-[10px] font-semibold">
                            {item.short_name}
                          </Badge>
                        )}
                        <span className="font-semibold text-foreground">{item.course_name}</span>
                        <span className="text-muted-foreground hidden sm:inline">({item.course_name_th})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] rounded-full px-2.5 py-0.5">
                          จัดสอบเองในคาบ
                        </Badge>
                        {portalHref && (
                          <Link
                            href={portalHref}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                          >
                            <span>หน้ารายวิชา</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        </div>
      )}

      {/* ── TAB 2: 📋 Master Faculty Schedule (Grouped by Date) ── */}
      {activeMainTab === "all" && (
        <div className="space-y-6 animate-in fade-in-0 duration-300">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-card/60 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={masterSearch}
                onChange={(e) => setMasterSearch(e.target.value)}
                placeholder={t(L.searchMaster, locale)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0">
                <Filter className="size-3.5" />
                {t(L.filterByDate, locale)}
              </span>
              <button
                onClick={() => setSelectedDate("ALL")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors shrink-0 ${
                  selectedDate === "ALL"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(L.allDates, locale)}
              </button>
              {allExamDates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors shrink-0 ${
                    selectedDate === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d.slice(5)}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground px-1 flex items-center justify-between">
            <span>พบทั้งหมด {masterExams.length} ห้องสอบ</span>
            <span>ตารางรวมคณะเทคโนโลยีสารสนเทศ (เรียงตามวัน)</span>
          </div>

          <div className="space-y-6">
            {masterExamsByDate.map(([examDate, items]) => (
              <div key={examDate} className="space-y-2.5">
                <div className="flex items-center gap-2 border-b pb-2 pt-1">
                  <Calendar className="size-4 text-primary" />
                  <h4 className="font-semibold text-sm text-foreground">
                    วันที่สอบ: {examDate}
                  </h4>
                  <Badge variant="outline" className="rounded-full text-[11px]">
                    {items.length} ห้องสอบ
                  </Badge>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.course_code}-${item.room}-${item.section}-${idx}`}
                      className="group flex flex-col justify-between rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 sm:flex-row sm:items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono font-bold text-xs">
                            {item.course_code}
                          </Badge>
                          <span className="font-medium text-foreground">Sec {item.section}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-medium text-muted-foreground">
                            {item.student_count || "-"} คน
                          </span>
                        </div>
                        <h5 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.course_name}
                        </h5>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="text-foreground font-medium">
                            อาคาร {item.building} • ห้อง {item.room}
                          </span>
                          <span>แถวที่นั่ง: {item.seat_rows || "-"}</span>
                          <span className="font-mono text-muted-foreground/80">({item.student_id_range || "-"})</span>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 font-mono font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                        {item.time} น.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {/* Emergency Action Banner */}
      {showEmergencyModal && (
        <div className="fixed bottom-3 inset-x-3 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-2xl z-50 animate-in slide-in-from-bottom-3 duration-300">
          <div className="relative rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-3.5 py-2.5 sm:px-4 sm:py-3 text-white shadow-lg shadow-black/20 border border-white/25">
            {/* Animated shimmer beam confined to inner card */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <span className="absolute inset-0 -translate-x-full animate-[emergency-shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Protruding Close Button on Top-Right Corner */}
            <button
              type="button"
              onClick={dismissEmergencyModal}
              className="absolute -top-2.5 -right-2 sm:-top-3 sm:-right-2.5 z-20 size-6 sm:size-7 rounded-full bg-white text-red-600 hover:bg-rose-50 hover:scale-110 active:scale-95 shadow-md shadow-black/25 border border-red-200/80 flex items-center justify-center transition-all cursor-pointer group"
              aria-label="ปิดแถบฉุกเฉิน (ซ่อน 24 ชั่วโมง)"
              title="ปิดแถบฉุกเฉิน (ซ่อน 24 ชั่วโมง)"
            >
              <X className="size-3.5 sm:size-4 stroke-[2.5] text-red-600 group-hover:rotate-90 transition-transform" />
            </button>

            <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
              {/* Left: Punchy title & tag */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 bg-white text-red-600 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce shadow-xs inline-flex items-center gap-1">
                  <span>ด่วนพิเศษ</span>
                  <span>🔥</span>
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-white tracking-tight truncate drop-shadow-xs">
                  อ่านหนังสือไม่ทัน? เครียดจนรับไม่ไหว?
                </h4>
              </div>

              {/* Right: CTA button */}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={triggerEmergencyResign}
                  title="เปิดใบคำร้องขอลาออกฉุกเฉิน (KMITL Protocol)"
                  className="relative group overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-red-600 font-extrabold text-xs sm:text-sm h-8 sm:h-8.5 px-3 sm:px-3.5 shadow-sm hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>กดเลย</span>
                  <ExternalLink className="size-3.5 text-red-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 Minimal Dark Resignation Document Modal */}
      {showResignModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeResignModal();
          }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200"
        >
          {/* Centered Document */}
          <div className="relative w-full max-w-4xl h-[78vh] sm:h-[82vh] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">
            <iframe
              src="/docs/kmitl-resign-form.pdf#toolbar=1&navpanes=0"
              title="ใบคำร้องขอลาออกจากการเป็นนักศึกษา สจล."
              className="w-full flex-1 border-0 bg-white"
            />
          </div>

          {/* Action Buttons Below Document - Centered */}
          <div className="relative z-10 w-full max-w-4xl flex items-center justify-center mt-3 sm:mt-4 px-1 gap-3 sm:gap-4 flex-wrap">
            <button
              type="button"
              onClick={closeResignModal}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              ยังไหวอยู่ ขอกลับไปอ่านหนังสือ
            </button>

            <button
              type="button"
              onClick={() => window.open("/docs/kmitl-resign-form.pdf", "_blank")}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Printer className="size-4 text-zinc-900" />
              <span>พิมพ์เอกสาร</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
