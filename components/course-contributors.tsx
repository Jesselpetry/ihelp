"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
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
import { cn } from "@/lib/utils";
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
  expand: {
    th: "กดดูเอกสาร",
    en: "View materials",
  },
  collapse: {
    th: "ซ่อน",
    en: "Hide",
  },
  itemsCount: {
    th: "รายการ",
    en: "items",
  },
};

type EnrichedContributorProfile = ReturnType<
  typeof getContributorWithAcademicYear
>;

/**
 * Formats student credentials into a clean, concise caption line:
 * e.g., "ชั้นปีที่ 1 (69070027)" or "ศิษย์เก่า (65070021)"
 */
function formatCredentialLine(
  profile: EnrichedContributorProfile,
  locale: "th" | "en",
): string {
  if (profile.academic) {
    const yearLabel = t(profile.academic.yearLabel, locale);
    return profile.studentId ? `${yearLabel} (${profile.studentId})` : yearLabel;
  }

  const parts: string[] = [];
  if (profile.faculty) {
    parts.push(t(profile.faculty, locale));
  } else {
    parts.push("IT KMITL");
  }

  const base = parts.join(" · ");
  return profile.studentId ? `${base} (${profile.studentId})` : base;
}

/**
 * Returns an academic role label tailored specifically to this course's contributed materials.
 * Excludes developer/maintainer labels on subject pages.
 */
function getAcademicRole(
  materials: ContributorMaterial[],
  locale: "th" | "en",
): string {
  const types = new Set(materials.map((m) => m.type));
  if (types.has("notes")) {
    return locale === "th" ? "ผู้แบ่งปันบันทึกสรุป" : "Study Notes";
  }
  if (types.has("slide")) {
    return locale === "th" ? "ผู้แปลสไลด์สรุป" : "Slide Summaries";
  }
  if (types.has("sheet")) {
    return locale === "th" ? "ผู้จัดทำชีตสรุป" : "Summary Author";
  }
  if (types.has("mock_exam")) {
    return locale === "th" ? "ผู้จัดทำข้อสอบจำลอง" : "Mock Exam Author";
  }
  return locale === "th" ? "ผู้แบ่งปันเนื้อหา" : "Contributor";
}

/**
 * Returns action button text based on material type
 */
function getMaterialActionLabel(
  type: ContributorMaterial["type"],
  locale: "th" | "en",
): string {
  switch (type) {
    case "mock_exam":
      return locale === "th" ? "ดูข้อสอบ" : "View Exam";
    case "sheet":
      return locale === "th" ? "ดูสรุป" : "View Sheet";
    case "slide":
      return locale === "th" ? "ดูสไลด์" : "View Slides";
    case "notes":
      return locale === "th" ? "เปิดอ่านโน้ต" : "View Notes";
    case "tool":
    case "code":
      return locale === "th" ? "เปิดใช้งาน" : "Open Tool";
    default:
      return locale === "th" ? "เปิดดู" : "Open";
  }
}

/**
 * Clean card component for each contributed material:
 * Features a plain bullet point dot indicator (no outer ring/frame), title, badge,
 * description, and an explicit action button on the right side.
 */
export function ContributorMaterialCard({
  material,
}: {
  material: ContributorMaterial;
}) {
  const { locale } = useLocale();
  const isExternal = Boolean(material.url && material.url.startsWith("http"));
  const actionLabel = getMaterialActionLabel(material.type, locale);

  return (
    <div className="group rounded-xl border border-border/50 bg-neutral-50/70 dark:bg-neutral-900/40 p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-border hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50 transition-all">
      {/* Left: Plain Bullet point dot indicator + Info */}
      <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
        {/* Clean, plain bullet point dot — strictly NO outer frame or ring */}
        <span
          className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0 mt-1.5 sm:mt-0 group-hover:bg-primary transition-colors"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {material.url ? (
              <a
                href={material.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors hover:underline underline-offset-2"
              >
                {t(material.title, locale)}
              </a>
            ) : (
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {t(material.title, locale)}
              </span>
            )}

            {material.badge && (
              <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-muted-foreground shrink-0 font-mono">
                {t(material.badge, locale)}
              </span>
            )}
          </div>

          {material.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {t(material.description, locale)}
            </p>
          )}
        </div>
      </div>

      {/* Right: Explicit action button */}
      {material.url && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 px-3 rounded-full text-xs font-medium shrink-0 self-start sm:self-auto shadow-2xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group/btn"
        >
          <a
            href={material.url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
          >
            <span>{actionLabel}</span>
            {isExternal ? (
              <ExternalLink className="size-3.5 ml-1 opacity-70 group-hover/btn:opacity-100" />
            ) : (
              <ChevronRight className="size-3.5 ml-0.5 transition-transform group-hover/btn:translate-x-0.5" />
            )}
          </a>
        </Button>
      )}
    </div>
  );
}

/** Backward-compatibility alias */
export const ContributorMaterialRow = ContributorMaterialCard;

/**
 * Individual Contributor Card:
 * Keeps the contributor card clean and compact by showing only the profile section
 * by default, with an expandable button to reveal contributed materials in this course.
 */
export function CourseContributorCard({
  rawContributor,
  courseCode,
  onSelectProfile,
}: {
  rawContributor: ContributorProfile;
  courseCode: string;
  onSelectProfile: (contributor: ContributorProfile) => void;
}) {
  const { locale } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);
  const profile = getContributorWithAcademicYear(rawContributor);

  // Only academic materials for this subject (excludes site developer tools)
  const courseMaterials = profile.materials.filter(
    (m) =>
      m.courseCode.toUpperCase() === courseCode.toUpperCase() &&
      m.type !== "tool",
  );

  if (courseMaterials.length === 0) return null;

  const academicRole = getAcademicRole(courseMaterials, locale);

  return (
    <div className={`p-4 sm:p-5 space-y-3 ${SURFACE}`}>
      {/* Header: Avatar, Name, Pill Badge, Credential Line, Compact Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Compact Avatar (44-48px) + Identity */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onSelectProfile(rawContributor)}
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

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => onSelectProfile(rawContributor)}
                className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors truncate text-left"
              >
                {profile.name}
              </button>

              {/* Circular/Pill Badge: Academic Role in this Subject */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-foreground/80 border border-border/50 shrink-0 shadow-2xs">
                <span
                  className="size-1.5 rounded-full bg-primary shrink-0"
                  aria-hidden="true"
                />
                {academicRole}
              </span>
            </div>

            {/* Clean caption line: ชั้นปีที่ 1 (69070027) */}
            <p className="text-xs text-muted-foreground truncate">
              {formatCredentialLine(profile, locale)}
            </p>
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
            onClick={() => onSelectProfile(rawContributor)}
            title={t(L.viewProfile, locale)}
            className="size-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-colors"
          >
            <User className="size-4" />
            <span className="sr-only">{t(L.viewProfile, locale)}</span>
          </button>
        </div>
      </div>

      {/* Expand/Collapse Toggle Button for Contributed Materials */}
      {courseMaterials.length > 0 && (
        <div className="pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="w-full flex items-center justify-between py-1 text-xs text-muted-foreground hover:text-foreground transition-colors group/toggle focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-3.5 text-primary" />
              <span className="font-medium text-foreground/90">
                {t(L.contributionsInCourse, locale)}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-muted-foreground font-semibold">
                {courseMaterials.length}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover/toggle:text-foreground transition-colors">
              <span>{isExpanded ? t(L.collapse, locale) : t(L.expand, locale)}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            </div>
          </button>

          {/* Collapsible Materials List */}
          {isExpanded && (
            <div className="flex flex-col gap-2 pt-2.5 animate-in fade-in-50 duration-200">
              {courseMaterials.map((material, idx) => (
                <ContributorMaterialCard key={idx} material={material} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CourseContributors({ courseCode }: CourseContributorsProps) {
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
    <div>
      {/* ── Standard Topic Header: Title on left, text link on right without pills ── */}
      <TopicHeader
        id="course-contributors"
        title={t(L.sectionTitle, locale)}
        aside={aside}
      />

      {/* ── Contributor Cards (Clean, compact collapsible cards) ── */}
      <div className="flex flex-col gap-3">
        {contributors.map((rawContributor) => (
          <CourseContributorCard
            key={rawContributor.id}
            rawContributor={rawContributor}
            courseCode={courseCode}
            onSelectProfile={setSelectedContributor}
          />
        ))}
      </div>

      {/* ── Community Invitation ── */}
      <div
        className={`mt-3 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-primary/20 dark:border-primary/15 ${SURFACE}`}
      >
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

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-7.5 px-3 rounded-full text-xs shrink-0 self-start sm:self-auto"
        >
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
