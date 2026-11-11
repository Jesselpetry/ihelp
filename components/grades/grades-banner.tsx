"use client";

import { Lock } from "lucide-react";
import { CourseWatermark } from "@/components/course-watermark";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";
import { useLocale, t, type LText } from "@/lib/i18n";

const L = {
  title: {
    th: "ผลการเรียนและคะแนนสะสม",
    en: "Grades & Accumulated Scores",
  },
  subtitle: {
    th: "รวมคะแนนที่ประกาศแล้ว สัดส่วนการประเมิน และคำนวณ GPA ทั้ง 7 รายวิชา ชั้นปีที่ 1 ภาคเรียนที่ 1",
    en: "Announced scores, syllabus weights, and GPA calculator across all 7 Year-1 Semester-1 courses",
  },
  signedOutHint: {
    th: "เข้าสู่ระบบด้วย @kmitl.ac.th เพื่อดูคะแนนรายบุคคล",
    en: "Sign in with @kmitl.ac.th to view your personal scores",
  },
} satisfies Record<string, LText>;

export function GradesBanner({
  viewerId,
  viewerFullName,
  viewerNickname,
  avatarUrl,
  avatarInitial,
  isSignedIn,
}: {
  viewerId: string | null;
  viewerFullName: string | null;
  viewerNickname: string | null;
  avatarUrl: string | null;
  avatarInitial: string;
  isSignedIn: boolean;
}) {
  const { locale } = useLocale();

  const identityDisplay = [
    viewerFullName,
    viewerNickname ? `(${viewerNickname})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className="relative overflow-hidden rounded-2xl border border-white/10 p-4 shadow-sm sm:p-5"
      style={{ background: IHELP_GRADIENT_CSS }}
    >
      <CourseWatermark code="IT" size="banner" />

      <div className="relative z-10 min-w-0 space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {t(L.title, locale)}
        </h1>
        <p className="max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
          {t(L.subtitle, locale)}
        </p>

        {/* Clean White Rounded-Full Identity Pill directly under description on the left */}
        <div className="pt-1.5">
          {isSignedIn && viewerId ? (
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-slate-900 shadow-xs">
              <Avatar className="size-8 shrink-0 border border-slate-200">
                {avatarUrl && (
                  <AvatarImage
                    src={avatarUrl}
                    alt={identityDisplay || viewerId}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-slate-100 text-xs font-bold text-slate-700">
                  {avatarInitial || viewerId.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 leading-tight">
                <div className="font-mono text-[11px] font-semibold text-slate-500 tabular-nums">
                  {viewerId}
                </div>
                <div className="truncate text-xs font-bold text-slate-900">
                  {identityDisplay || viewerId}
                </div>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-xs">
              <Lock className="size-3.5 shrink-0 text-white/85" />
              <span>{t(L.signedOutHint, locale)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
