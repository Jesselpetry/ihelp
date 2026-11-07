"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Layers,
  Sparkles,
  Terminal,
  Upload,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  InstagramIcon,
  NotionIcon,
} from "@/components/social-icons";
import { useLocale, t, type LText } from "@/lib/i18n";
import {
  getContributorsForCourse,
  getContributorWithAcademicYear,
  type ContributorProfile,
  type ContributorRole,
} from "@/lib/contributors";
import { ContributorModal } from "@/components/contributor-modal";

export interface CourseContributorsProps {
  courseCode: string;
  courseName?: LText;
}

const L = {
  sectionTitle: {
    th: "ผู้จัดทำและร่วมแบ่งปันเนื้อหา",
    en: "Course Contributors & Authors",
  },
  sectionSubtitle: {
    th: "เนื้อหา ชีตสรุป สไลด์บรรยาย และบันทึกการเรียนรู้ในรายวิชานี้ ได้รับการแบ่งปันและเรียบเรียงโดยเพื่อน ๆ และรุ่นพี่ เพื่อประโยชน์ทางการศึกษาของนักศึกษา IT KMITL",
    en: "Study notes, cheat sheets, translated slides, and materials for this course are generously authored and shared by peers and alumni for IT KMITL students.",
  },
  viewProfile: {
    th: "ดูรายละเอียดโปรไฟล์",
    en: "View Full Profile",
  },
  openNotion: {
    th: "Notion Notes",
    en: "Notion Notes",
  },
  ihelpProfile: {
    th: "โปรไฟล์ iHelp",
    en: "iHelp Profile",
  },
  contributeTitle: {
    th: "มีชีตสรุปหรือบันทึกอยากแบ่งปัน?",
    en: "Have study notes or summaries to share?",
  },
  contributeDesc: {
    th: "ร่วมแชร์ชีตสรุป สไลด์ หรือข้อสอบจำลองของคุณ เพื่อช่วยเพื่อน ๆ และรับเครดิตในหน้ารายวิชาของ iHelp",
    en: "Share your own lecture summaries, slides, or mock exams to help fellow students and receive official credit on iHelp.",
  },
  contributeButton: {
    th: "วิธีส่งสรุปเข้าคลัง (Dropzone SOP)",
    en: "Contribution Guide (Dropzone SOP)",
  },
  allContributorsButton: {
    th: "ดูทีมผู้พัฒนาและผู้มีส่วนร่วมทั้งหมด",
    en: "View All Contributors",
  },
  contributionsInCourse: {
    th: "ผลงานและเอกสารในวิชานี้",
    en: "Contributions in this course",
  },
};

/**
 * Returns a fitting role icon:
 * - Developer / Lead maintainer -> Code2 / Terminal
 * - Content contributor / note author -> BookOpen
 * - Senior mentor -> GraduationCap
 */
function RoleIcon({ roles }: { roles: ContributorRole[] }) {
  if (roles.includes("lead-maintainer")) {
    return <Terminal className="size-3.5 text-primary shrink-0" />;
  }
  if (roles.includes("core-developer") || roles.includes("developer")) {
    return <Code2 className="size-3.5 text-primary shrink-0" />;
  }
  if (roles.includes("senior-mentor")) {
    return <GraduationCap className="size-3.5 text-primary shrink-0" />;
  }
  if (roles.includes("note-author") || roles.includes("content-contributor")) {
    return <BookOpen className="size-3.5 text-primary shrink-0" />;
  }
  return <Sparkles className="size-3.5 text-primary shrink-0" />;
}

export function CourseContributors({
  courseCode,
  courseName,
}: CourseContributorsProps) {
  const { locale } = useLocale();
  const [selectedContributor, setSelectedContributor] =
    useState<ContributorProfile | null>(null);

  const contributors = getContributorsForCourse(courseCode);

  if (contributors.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 pt-4 border-t border-border/60">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-4 text-primary shrink-0" />
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              {t(L.sectionTitle, locale)}
            </h3>
            <Badge
              variant="secondary"
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            >
              {contributors.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            {courseName
              ? locale === "th"
                ? `เนื้อหา ชีตสรุป สไลด์บรรยาย และบันทึกการเรียนรู้ในวิชา ${t(courseName, locale)} ได้รับการแบ่งปันและเรียบเรียงโดยเพื่อน ๆ และรุ่นพี่ เพื่อประโยชน์ทางการศึกษาของนักศึกษา IT KMITL`
                : `Study notes, cheat sheets, and materials for ${t(courseName, locale)} are generously authored and shared by peers and alumni for IT KMITL students.`
              : t(L.sectionSubtitle, locale)}
          </p>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-8 self-start sm:self-auto shrink-0"
        >
          <Link href="/version">
            <Layers className="size-3.5 mr-1 text-primary" />
            <span>{t(L.allContributorsButton, locale)}</span>
          </Link>
        </Button>
      </div>

      {/* ── Wide Horizontal Contributor Cards (การ์ดแนวนอนยาว) ── */}
      <div className="space-y-4">
        {contributors.map((rawContributor) => {
          const profile = getContributorWithAcademicYear(rawContributor);
          const courseMaterials = profile.materials.filter(
            (m) =>
              m.courseCode.toUpperCase() === courseCode.toUpperCase() ||
              m.courseCode === "ALL",
          );

          return (
            <div
              key={profile.id}
              className="group relative w-full rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-sm space-y-4"
            >
              {/* Top Row: Avatar + Info + Full Badges on the right */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left: Avatar + Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <Avatar className="size-14 sm:size-16 shrink-0 rounded-2xl ring-2 ring-border/60 group-hover:ring-primary/40 shadow-sm transition-all">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary rounded-2xl">
                      {profile.avatarFallback ??
                        profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Name & Nickname & Role Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                        {profile.name}
                      </h4>
                      {profile.nickname && (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          ({profile.nickname})
                        </span>
                      )}

                      {/* Primary Role Badge with Developer/Category Icon */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90 bg-muted/60 border border-border/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <RoleIcon roles={profile.roles} />
                        <span>{t(profile.primaryRole, locale)}</span>
                      </span>
                    </div>

                    {/* Metadata Pill Tags (Auto Year, Cohort, Student ID, Major) */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {/* Auto-calculated Academic Year Badge */}
                      {profile.academic && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                          <GraduationCap className="size-3" />
                          <span>{t(profile.academic.yearLabel, locale)}</span>
                        </span>
                      )}

                      {/* Cohort Badge if available */}
                      {profile.cohort && (
                        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono font-medium">
                          {profile.cohort}
                        </span>
                      )}

                      {/* Student ID */}
                      {profile.studentId && (
                        <span className="px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-mono">
                          {profile.studentId}
                        </span>
                      )}

                      {/* Major / Department */}
                      {profile.major && (
                        <span className="px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                          {t(profile.major, locale)}
                        </span>
                      )}

                      {/* Faculty */}
                      {profile.faculty && (
                        <span className="px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground hidden sm:inline-flex">
                          {t(profile.faculty, locale)}
                        </span>
                      )}
                    </div>

                    {/* Bio / Description */}
                    {profile.bio && (
                      <p className="text-xs text-muted-foreground leading-relaxed pt-0.5 max-w-2xl">
                        {t(profile.bio, locale)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Full Social Badges & Profile Button */}
                <div className="flex flex-wrap items-center gap-2 self-start shrink-0 pt-1 lg:pt-0">
                  {/* GitHub Full Badge */}
                  {profile.socials.github && (
                    <a
                      href={`https://github.com/${profile.socials.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border bg-background hover:bg-muted text-foreground/90 hover:text-primary transition-all shadow-2xs"
                    >
                      <GithubIcon className="size-3.5" />
                      <span>GitHub</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        @{profile.socials.github}
                      </span>
                    </a>
                  )}

                  {/* Instagram Full Badge */}
                  {profile.socials.instagram && (
                    <a
                      href={`https://instagram.com/${profile.socials.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/15 transition-all shadow-2xs"
                    >
                      <InstagramIcon className="size-3.5 text-pink-500" />
                      <span className="font-mono text-[11px]">
                        @{profile.socials.instagram}
                      </span>
                    </a>
                  )}

                  {/* Notion Full Badge */}
                  {profile.socials.notion && (
                    <a
                      href={profile.socials.notion}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-border/80 bg-background hover:bg-muted text-foreground/90 transition-all shadow-2xs"
                    >
                      <NotionIcon className="size-3.5" />
                      <span>{t(L.openNotion, locale)}</span>
                      <ExternalLink className="size-3 text-muted-foreground ml-0.5" />
                    </a>
                  )}

                  {/* iHelp Profile Full Badge */}
                  {profile.profilePath && (
                    <Link
                      href={profile.profilePath}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border bg-background hover:bg-muted text-foreground/90 hover:text-primary transition-all shadow-2xs"
                    >
                      <User className="size-3.5" />
                      <span>{t(L.ihelpProfile, locale)}</span>
                    </Link>
                  )}

                  {/* View Details Profile Modal Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContributor(rawContributor)}
                    className="rounded-full text-xs h-7.5 px-3 bg-muted/40 hover:bg-muted"
                  >
                    <span>{t(L.viewProfile, locale)}</span>
                    <ExternalLink className="size-3 ml-1 opacity-70" />
                  </Button>
                </div>
              </div>

              {/* Bottom Row: Contributions in THIS Course */}
              {courseMaterials.length > 0 && (
                <div className="pt-2 border-t border-border/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                    <BookOpen className="size-3.5 text-primary" />
                    <span>{t(L.contributionsInCourse, locale)}:</span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {courseMaterials.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-muted/30 p-2.5 border border-border/40 text-xs flex flex-col justify-between gap-1.5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-foreground/90 leading-snug">
                              {t(item.title, locale)}
                            </span>
                            {item.badge && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 shrink-0 border-primary/30 text-primary"
                              >
                                {t(item.badge, locale)}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {t(item.description, locale)}
                            </p>
                          )}
                        </div>

                        {item.url && (
                          <div className="pt-1">
                            <a
                              href={item.url}
                              target={item.url.startsWith("http") ? "_blank" : undefined}
                              rel={item.url.startsWith("http") ? "noreferrer" : undefined}
                              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                            >
                              <span>เปิดดูเอกสาร / ลิงก์</span>
                              <ExternalLink className="size-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Community Invitation / CTA Banner ── */}
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Upload className="size-3.5 text-primary" />
            <span>{t(L.contributeTitle, locale)}</span>
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            {t(L.contributeDesc, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="outline" className="text-xs h-8 rounded-full">
            <a
              href="https://github.com/Jesselpetry/ihelp/blob/staging/docs/DROPZONE_SOP.md"
              target="_blank"
              rel="noreferrer"
            >
              <span>{t(L.contributeButton, locale)}</span>
              <ExternalLink className="size-3 ml-1 opacity-70" />
            </a>
          </Button>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedContributor && (
        <ContributorModal
          contributor={{
            name: selectedContributor.name,
            github:
              selectedContributor.socials.github ?? selectedContributor.id,
            instagram: selectedContributor.socials.instagram,
          }}
          profile={selectedContributor}
          open={Boolean(selectedContributor)}
          onOpenChange={(open) => {
            if (!open) setSelectedContributor(null);
          }}
        />
      )}
    </section>
  );
}
