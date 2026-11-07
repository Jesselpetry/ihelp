"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Layers,
  Sparkles,
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
    th: "ดูโปรไฟล์ผู้ร่วมพัฒนา",
    en: "View Contributor Profile",
  },
  openNotion: {
    th: "เปิดอ่านบน Notion",
    en: "Open on Notion",
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
  studentIdPrefix: {
    th: "รหัส",
    en: "ID",
  },
  contributionsInCourse: {
    th: "ผลงานในวิชานี้",
    en: "Contributions in this course",
  },
};

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
    <section className="space-y-4 pt-2">
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
          className="text-xs text-muted-foreground hover:text-foreground h-8 self-start sm:self-auto"
        >
          <Link href="/version">
            <Layers className="size-3.5 mr-1 text-primary" />
            <span>{t(L.allContributorsButton, locale)}</span>
          </Link>
        </Button>
      </div>

      {/* ── Contributors Grid ── */}
      <div className="grid gap-3.5 sm:grid-cols-2">
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
              className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/70 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-xs"
            >
              <div className="space-y-3">
                {/* Header: Avatar, Name, Student ID, Auto-Year, Faculty */}
                <div className="flex items-start gap-3">
                  <Avatar className="size-12 shrink-0 ring-2 ring-border/60 group-hover:ring-primary/40 transition-all">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {profile.avatarFallback ??
                        profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {profile.name}
                      </span>
                      {profile.nickname && (
                        <span className="text-xs text-muted-foreground">
                          ({profile.nickname})
                        </span>
                      )}
                    </div>

                    {/* Metadata Pill Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {/* Auto-calculated Academic Year Badge */}
                      {profile.academic && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                          <GraduationCap className="size-3" />
                          <span>{t(profile.academic.yearLabel, locale)}</span>
                        </span>
                      )}

                      {/* Cohort Badge if available */}
                      {profile.cohort && (
                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                          {profile.cohort}
                        </span>
                      )}

                      {/* Student ID */}
                      {profile.studentId && (
                        <span className="px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-mono">
                          {profile.studentId}
                        </span>
                      )}

                      {/* Major / Department */}
                      {profile.major && (
                        <span className="px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                          {t(profile.major, locale)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Role Badge */}
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90 bg-muted/40 border border-border/50 px-2 py-0.5 rounded-md">
                    <Sparkles className="size-3 text-primary shrink-0" />
                    <span>{t(profile.primaryRole, locale)}</span>
                  </span>
                </div>

                {/* Contributions in THIS course */}
                {courseMaterials.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1">
                      <BookOpen className="size-3 text-primary" />
                      <span>{t(L.contributionsInCourse, locale)}:</span>
                    </p>

                    <ul className="space-y-1.5">
                      {courseMaterials.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] leading-relaxed text-muted-foreground bg-muted/30 rounded-lg p-2 border border-border/40"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-medium text-foreground/90">
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
                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                              {t(item.description, locale)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  {profile.socials.github && (
                    <a
                      href={`https://github.com/${profile.socials.github}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`GitHub: @${profile.socials.github}`}
                      className="size-7 rounded-full flex items-center justify-center border bg-card hover:bg-muted text-foreground/80 hover:text-primary transition-colors"
                    >
                      <GithubIcon className="size-3.5" />
                    </a>
                  )}

                  {profile.socials.instagram && (
                    <a
                      href={`https://instagram.com/${profile.socials.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Instagram: @${profile.socials.instagram}`}
                      className="size-7 rounded-full flex items-center justify-center border border-pink-500/20 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors"
                    >
                      <InstagramIcon className="size-3.5" />
                    </a>
                  )}

                  {profile.socials.notion && (
                    <a
                      href={profile.socials.notion}
                      target="_blank"
                      rel="noreferrer"
                      title={t(L.openNotion, locale)}
                      className="size-7 rounded-full flex items-center justify-center border border-muted-foreground/30 bg-muted/40 text-foreground hover:bg-muted transition-colors"
                    >
                      <NotionIcon className="size-3.5" />
                    </a>
                  )}

                  {profile.profilePath && (
                    <Link
                      href={profile.profilePath}
                      title={t(L.ihelpProfile, locale)}
                      className="size-7 rounded-full flex items-center justify-center border bg-card hover:bg-muted text-foreground/80 hover:text-primary transition-colors"
                    >
                      <User className="size-3.5" />
                    </Link>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContributor(rawContributor)}
                  className="text-[11px] h-7 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <span>{t(L.viewProfile, locale)}</span>
                  <ExternalLink className="size-3 ml-1 opacity-70" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Community Invitation / CTA Banner ── */}
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <Button asChild size="sm" variant="outline" className="text-xs h-8">
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
            github: selectedContributor.socials.github ?? selectedContributor.id,
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
