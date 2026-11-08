"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  FileText,
  Target,
  Terminal,
  Upload,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/lib/contributors";
import { ContributorModal } from "@/components/contributor-modal";
import { SURFACE, TopicHeader } from "@/components/course-hub-shared";

export interface CourseContributorsProps {
  courseCode: string;
}

const L = {
  sectionTitle: {
    th: "ผู้จัดทำ",
    en: "Contributors",
  },
  viewAll: {
    th: "ดูทั้งหมด →",
    en: "View all →",
  },
  viewProfile: {
    th: "ดูรายละเอียดโปรไฟล์",
    en: "View profile details",
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
  contributionsInCourse: {
    th: "ผลงานและเอกสารในวิชานี้",
    en: "Contributions in this course",
  },
};

type EnrichedContributorProfile = ReturnType<typeof getContributorWithAcademicYear>;

/**
 * Formats university credentials into a single clean caption line:
 * e.g., "IT KMITL #24 · ปี 1 (69070027)"
 */
function formatCredentialLine(
  profile: EnrichedContributorProfile,
  locale: "th" | "en",
): string {
  const parts: string[] = [];

  if (profile.cohort) {
    const num = profile.cohort.replace(/^IT/i, "");
    parts.push(`IT KMITL #${num}`);
  } else if (profile.faculty) {
    parts.push(t(profile.faculty, locale));
  } else {
    parts.push("IT KMITL");
  }

  if (profile.academic) {
    parts.push(t(profile.academic.yearLabel, locale));
  }

  const base = parts.join(" · ");
  return profile.studentId ? `${base} (${profile.studentId})` : base;
}

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
 * Reusable clean row component for contributed materials in a course.
 * Borderless with hover highlight and subtle text tags.
 */
export function ContributorMaterialRow({
  material,
}: {
  material: ContributorMaterial;
}) {
  const { locale } = useLocale();
  const isExternal = Boolean(material.url && material.url.startsWith("http"));

  const rowContent = (
    <div className="group flex items-center justify-between gap-3 px-3 py-2 -mx-3 rounded-lg hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 transition-colors">
      {/* Left: Icon + Title & Description */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
          <MaterialIcon type={material.type} />
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
              {t(material.title, locale)}
            </span>
          </div>
          {material.description && (
            <p className="truncate text-[11px] text-muted-foreground mt-0.5">
              {t(material.description, locale)}
            </p>
          )}
        </div>
      </div>

      {/* Right: Subtle tag text + Action Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        {material.badge && (
          <span className="text-[11px] text-muted-foreground font-mono">
            {t(material.badge, locale)}
          </span>
        )}
        {material.url && (
          <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
            {isExternal ? (
              <ExternalLink className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            )}
          </span>
        )}
      </div>
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
    <Link
      href="/version"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
    >
      <span>{t(L.viewAll, locale)}</span>
    </Link>
  );

  return (
    <div className="pt-8 sm:pt-10">
      {/* ── Standard Topic Header: Title on left, text link on right without pills ── */}
      <TopicHeader
        id="course-contributors"
        title={t(L.sectionTitle, locale)}
        aside={aside}
      />

      {/* ── Contributor Cards (Clean, compact horizontal layout) ── */}
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
              className={`p-4 sm:p-5 space-y-3 ${SURFACE}`}
            >
              {/* Header: Avatar, Name, Single-line Metadata, Compact Icon Actions */}
              <div className="flex items-start justify-between gap-3">
                {/* Left: Compact Avatar (44-48px) + Identity */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => setSelectedContributor(rawContributor)}
                    className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Avatar className="size-11 sm:size-12 rounded-full ring-1 ring-border/60 shadow-xs hover:ring-primary/60 transition-all">
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
                  </button>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => setSelectedContributor(rawContributor)}
                        className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors truncate text-left"
                      >
                        {profile.name}
                      </button>

                      {/* Tiny Tag: Lead Maintainer / Primary Role */}
                      <span className="text-xs font-mono py-0.5 px-2 rounded bg-neutral-100 dark:bg-neutral-800 text-muted-foreground shrink-0">
                        {t(profile.primaryRole, locale)}
                      </span>
                    </div>

                    {/* Condensed single muted caption line: IT KMITL #24 · ปี 1 (69070027) */}
                    <p className="text-xs text-muted-foreground truncate">
                      {formatCredentialLine(profile, locale)}
                    </p>

                    {/* Bio / Scope text integrated right here, capped at 1 line */}
                    {profile.bio && (
                      <p className="text-xs text-muted-foreground/80 line-clamp-1 pt-0.5">
                        {t(profile.bio, locale)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Small Monochromatic Icon Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* GitHub Icon Action */}
                  {profile.socials.github && (
                    <a
                      href={`https://github.com/${profile.socials.github}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`GitHub: @${profile.socials.github}`}
                      className="size-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-colors"
                    >
                      <GithubIcon className="size-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  )}

                  {/* Instagram Icon Action */}
                  {profile.socials.instagram && (
                    <a
                      href={`https://instagram.com/${profile.socials.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Instagram: @${profile.socials.instagram}`}
                      className="size-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-colors"
                    >
                      <InstagramIcon className="size-4" />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}

                  {/* Notion Icon Action */}
                  {profile.socials.notion && (
                    <a
                      href={profile.socials.notion}
                      target="_blank"
                      rel="noreferrer"
                      title="Notion"
                      className="size-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-colors"
                    >
                      <NotionIcon className="size-4" />
                      <span className="sr-only">Notion</span>
                    </a>
                  )}

                  {/* Single Discreet Profile Details Action */}
                  <button
                    type="button"
                    onClick={() => setSelectedContributor(rawContributor)}
                    title={t(L.viewProfile, locale)}
                    className="size-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-colors"
                  >
                    <User className="size-4" />
                    <span className="sr-only">{t(L.viewProfile, locale)}</span>
                  </button>
                </div>
              </div>

              {/* Contributed Materials: Clean List */}
              {courseMaterials.length > 0 && (
                <div className="pt-2.5 border-t border-border/40 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <BookOpen className="size-3 text-primary" />
                    <span>{t(L.contributionsInCourse, locale)}:</span>
                  </div>

                  <div className="flex flex-col">
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

      {/* ── Community Invitation ── */}
      <div className={`mt-3 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-primary/20 dark:border-primary/15 ${SURFACE}`}>
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
