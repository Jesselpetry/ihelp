"use client";

import { Lock } from "lucide-react";
import { CourseWatermark } from "@/components/course-watermark";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IHELP_GRADIENT_CSS } from "@/lib/courses/course-theme";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SemesterTermInfo, StudentScheduleGroupInfo } from "@/lib/schedule/types";

const L = {
  title: {
    th: "ตารางเรียน",
    en: "Timetable",
  },
  subtitle: {
    th: "ตารางเรียนและข้อมูลรายวิชา ตรวจสอบ Section เวลาเรียน ห้องเรียน และตรวจการชนของคาบเรียนและวันสอบ",
    en: "Class schedules, sections, study hours, classroom venues, and timetable clash detection",
  },
  signedOutHint: {
    th: "เข้าสู่ระบบด้วย @kmitl.ac.th เพื่อดูตารางเรียนของคุณโดยอัตโนมัติ",
    en: "Sign in with @kmitl.ac.th to view your schedule automatically",
  },
} satisfies Record<string, LText>;

export function ScheduleBanner({
  viewerId,
  viewerFullName,
  viewerNickname,
  avatarUrl,
  avatarInitial,
  isSignedIn,
  groupName,
}: {
  viewerId: string | null;
  viewerFullName: string | null;
  viewerNickname: string | null;
  avatarUrl: string | null;
  avatarInitial: string;
  isSignedIn: boolean;
  assignedGroup?: StudentScheduleGroupInfo | null;
  termInfo?: SemesterTermInfo;
  groupName?: string;
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-0.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
          <span>{groupName || (locale === "th" ? "กลุ่ม 1" : "Group 1")}</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {t(L.title, locale)}
        </h1>
        <p className="max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
          {t(L.subtitle, locale)}
        </p>

        {/* Identity Pill directly under description on the left */}
        <div className="pt-1.5 flex flex-wrap items-center gap-2">
          {isSignedIn && viewerId ? (
            <>
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
                  <div className="text-[11px] font-semibold text-slate-500 tabular-nums">
                    {viewerId}
                  </div>
                  <div className="truncate text-xs font-bold text-slate-900">
                    {identityDisplay || viewerId}
                  </div>
                </div>
              </div>
            </>
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
