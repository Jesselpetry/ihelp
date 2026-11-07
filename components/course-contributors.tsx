"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Code2,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Sparkles,
  Target,
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
import { useLocale, t } from "@/lib/i18n";
import {
  getContributorsForCourse,
  getContributorWithAcademicYear,
  type ContributorMaterial,
  type ContributorProfile,
  type ContributorRole,
} from "@/lib/contributors";
import { ContributorModal } from "@/components/contributor-modal";
import { SURFACE, TopicHeader } from "@/components/course-hub-shared";

export interface CourseContributorsProps {
  courseCode: string;
}

const L = {
  sectionTitle: {
    th: "ผู้จัดทำและร่วมแบ่งปันเนื้อหา",
    en: "Course Contributors & Authors",
  },
  viewProfile: {
    th: "ดูรายละเอียด",
    en: "Details",
  },
  openNotion: {
    th: "Notion",
    en: "Notion",
  },
  ihelpProfile: {
    th: "Profile",
    en: "Profile",
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
    th: "ดูผู้พัฒนาทั้งหมด",
    en: "All Contributors",
  },
  contributionsInCourse: {
    th: "ผลงานและเอกสารในวิชานี้",
    en: "Contributions in this course",
  },
};

/**
 * Returns an appropriate icon based on material type
 */
function MaterialIcon({ type }: { type: ContributorMaterial["type"] }) {
  switch (type) {
    case "sheet":
      return <BookOpen className="size-3.5" />;
    case "slide":
      return <FileText className="size-3.5" />;
    case "notes":
      return <FileCheck2 className="size-3.5" />;
    case "mock_exam":
      return <Target className="size-3.5" />;
    case "code":
    case "tool":
      return <Terminal className="size-3.5" />;
    default:
      return <BookOpen className="size-3.5" />;
  }
}

/**
 * Reusable row component for contributed materials in a course.
 * Follows the standard stream row design used in CourseWeekCard and CourseExamMilestone.
 */
export function ContributorMaterialRow({
  material,
}: {
  material: ContributorMaterial;
}) {
  const { locale } = useLocale();
  const isExternal = Boolean(material.url && material.url.startsWith("http"));

  const rowContent = (
    <div className="group flex items-center gap-2.5 px-3 py-2 rounded-xl transition-[box-shadow,background-color] hover:bg-primary/[0.04] dark:hover:bg-primary/10 border border-border/50 bg-muted/20">
      {/* Circular type icon */}
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MaterialIcon type={material.type} />
      </span>

      {/* Title & description */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
            {t(material.title, locale)}
          </span>
          {material.badge && (
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 shrink-0 border-primary/30 text-primary"
            >
              {t(material.badge, locale)}
            </Badge>
          )}
        </div>
        {material.description && (
          <p className="truncate text-[11px] text-muted-foreground mt-0.5">
            {t(material.description, locale)}
          </p>
        )}
      </div>

      {/* Action / Arrow indicator */}
      {material.url && (
        <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors pl-1">
          {isExternal ? (
            <ExternalLink className="size-3.5 opacity-70 group-hover:opacity-100" />
          ) : (
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      )}
    </div>
  );

  if (material.url) {
    return (
      <a
        href={material.url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="block no-underline"
      >
        {rowContent}
      </a>
    );
  }

  return rowContent;
}

/**
 * Returns a fitting role icon:
 * - Developer / Lead maintainer -> Terminal / Code2
 * - Content contributor / note author -> BookOpen
 * - Senior mentor -> GraduationCap
 */
function RoleIcon({ roles }: { roles: ContributorRole[] }) {
  if (roles.includes("lead-maintainer")) {
    return <Terminal className="size-3 text-primary shrink-0" />;
  }
  if (roles.includes("core-developer") || roles.includes("developer")) {
    return <Code2 className="size-3 text-primary shrink-0" />;
  }
  if (roles.includes("senior-mentor")) {
    return <GraduationCap className="size-3 text-primary shrink-0" />;
  }
  if (roles.includes("note-author") || roles.includes("content-contributor")) {
    return <BookOpen className="size-3 text-primary shrink-0" />;
  }
  return <Sparkles className="size-3 text-primary shrink-0" />;
}

export function CourseContributors({
  courseCode,
}: CourseContributorsProps) {
  const { locale } = useLocale();
  const [selectedContributor, setSelectedContributor] =
    useState<ContributorProfile | null>(null);

  const contributors = getContributorsForCourse(courseCode);

  if (contributors.length === 0) {
    return null;
  }

  const aside = (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-medium text-primary">
        {contributors.length} {locale === "th" ? "ผู้จัดทำ" : "contributors"}
      </span>
      <Link
        href="/version"
        className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
      >
        <span>{t(L.allContributorsButton, locale)}</span>
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );

  return (
    <div className="pt-8 sm:pt-10">
      {/* ── Standard Topic Header (Same standard as weekly path & exam milestones) ── */}
      <TopicHeader
        id="course-contributors"
        title={t(L.sectionTitle, locale)}
        aside={aside}
      />

      {/* ── Contributor Cards (Horizontal Rows with fixed-size badges & rounded-full avatars) ── */}
      <div className="flex flex-col gap-3">
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
              className={`p-3.5 sm:p-4 space-y-3 ${SURFACE}`}
            >
              {/* Header: Avatar, Name, Metadata, Fixed-Size Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Avatar + Identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-11 sm:size-12 shrink-0 rounded-full ring-2 ring-border/60 shadow-xs">
                    <AvatarImage
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback className="text-xs font-bold rounded-full bg-primary/10 text-primary">
                      {profile.avatarFallback ??
                        profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                        {profile.name}
                      </h4>
                      {profile.nickname && (
                        <span className="text-xs text-muted-foreground truncate">
                          ({profile.nickname})
                        </span>
                      )}

                      {/* Primary Role Badge with Developer/Category Icon */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground/90 bg-muted/60 border border-border/60 px-2 py-0.5 rounded-full shrink-0">
                        <RoleIcon roles={profile.roles} />
                        <span>{t(profile.primaryRole, locale)}</span>
                      </span>
                    </div>

                    {/* Metadata Pills (Auto Year, Cohort, Student ID, Major) */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {profile.academic && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          <GraduationCap className="size-3" />
                          <span>{t(profile.academic.yearLabel, locale)}</span>
                        </span>
                      )}

                      {profile.cohort && (
                        <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
                          {profile.cohort}
                        </span>
                      )}

                      {profile.studentId && (
                        <span className="px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground font-mono">
                          {profile.studentId}
                        </span>
                      )}

                      {profile.major && (
                        <span className="px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                          {t(profile.major, locale)}
                        </span>
                      )}

                      {profile.faculty && (
                        <span className="px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground hidden md:inline-flex">
                          {t(profile.faculty, locale)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Fixed-Size Action Badges */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start sm:self-center">
                  {/* GitHub Full Badge */}
                  {profile.socials.github && (
                    <a
                      href={`https://github.com/${profile.socials.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-7 px-2.5 rounded-full border bg-background hover:bg-muted text-foreground/90 hover:text-primary inline-flex items-center gap-1.5 text-xs transition-colors shrink-0"
                    >
                      <GithubIcon className="size-3.5 shrink-0" />
                      <span className="font-medium">GitHub</span>
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
                      className="h-7 px-2.5 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/15 inline-flex items-center gap-1.5 text-xs transition-colors shrink-0"
                    >
                      <InstagramIcon className="size-3.5 text-pink-500 shrink-0" />
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
                      className="h-7 px-2.5 rounded-full border border-border/80 bg-background hover:bg-muted text-foreground/90 inline-flex items-center gap-1.5 text-xs transition-colors shrink-0"
                    >
                      <NotionIcon className="size-3.5 shrink-0" />
                      <span>{t(L.openNotion, locale)}</span>
                      <ExternalLink className="size-2.5 text-muted-foreground shrink-0" />
                    </a>
                  )}

                  {/* iHelp Profile Full Badge */}
                  {profile.profilePath && (
                    <Link
                      href={profile.profilePath}
                      className="h-7 px-2.5 rounded-full border bg-background hover:bg-muted text-foreground/90 hover:text-primary inline-flex items-center gap-1.5 text-xs transition-colors shrink-0"
                    >
                      <User className="size-3.5 shrink-0" />
                      <span>{t(L.ihelpProfile, locale)}</span>
                    </Link>
                  )}

                  {/* View Details Profile Modal Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContributor(rawContributor)}
                    className="h-7 px-2.5 rounded-full text-xs font-normal shrink-0"
                  >
                    <span>{t(L.viewProfile, locale)}</span>
                    <ExternalLink className="size-2.5 ml-1 opacity-70 shrink-0" />
                  </Button>
                </div>
              </div>

              {/* Bio if available */}
              {profile.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                  {t(profile.bio, locale)}
                </p>
              )}

              {/* Contributed Materials: Row by Row (เหมือนแถวเอกสารรายสัปดาห์) */}
              {courseMaterials.length > 0 && (
                <div className="pt-2 border-t border-border/40 space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <BookOpen className="size-3 text-primary" />
                    <span>{t(L.contributionsInCourse, locale)}:</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {courseMaterials.map((material, idx) => (
                      <ContributorMaterialRow key={idx} material={material} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Community Invitation (Standard card style matching milestones) ── */}
      <div className={`mt-4 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-primary/20 dark:border-primary/15 ${SURFACE}`}>
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload className="size-4" />
          </span>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {t(L.contributeTitle, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t(L.contributeDesc, locale)}
            </p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline" className="h-7.5 px-3 rounded-full text-xs shrink-0 self-start sm:self-auto">
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
    </div>
  );
}
