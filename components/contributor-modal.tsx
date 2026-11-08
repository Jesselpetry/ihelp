"use client";

import { useState } from "react";
import {
  ExternalLink,
  GitCommitHorizontal,
  Code2,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GithubIcon,
  InstagramIcon,
  NotionIcon,
} from "@/components/social-icons";
import {
  CHANGELOG,
  type Contributor,
  type VersionEntry,
} from "@/lib/docs/changelog";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import {
  getContributorById,
  getContributorWithAcademicYear,
  type ContributorProfile,
} from "@/lib/contributors";

const L = {
  profileTitle: { th: "ข้อมูลผู้ร่วมพัฒนา", en: "Contributor Profile" },
  contributions: {
    th: "ประวัติการร่วมพัฒนา",
    en: "Contributions & Changelog",
  },
  versionsCount: { th: "เวอร์ชัน", en: "versions" },
  changesCount: { th: "รายการ", en: "changes" },
  materialsTitle: {
    th: "ผลงานและสื่อการเรียนรู้ในรายวิชา",
    en: "Course Materials & Resources",
  },
  openGithub: { th: "เปิด GitHub Profile", en: "Open GitHub Profile" },
  openInstagram: { th: "เปิด Instagram Profile", en: "Open Instagram Profile" },
  inDevelopment: { th: "กำลังพัฒนา", en: "In Development" },
  viewCommit: { th: "ดู commit", en: "View commit" },
  moreChanges: { th: "รายการเพิ่มเติม", en: "more changes" },
};

const AUTHOR_REGEX = /\s*\((?:โดย|by)\s+@([A-Za-z0-9_-]+)\)\s*$/i;

/** Parses and extracts author attribution like (โดย @user) or (by @user) from changelog text */
export function parseChangeText(text: string): {
  cleanText: string;
  author: string | null;
} {
  const match = text.match(AUTHOR_REGEX);
  if (match) {
    return {
      cleanText: text.replace(AUTHOR_REGEX, "").trim(),
      author: match[1],
    };
  }
  return { cleanText: text, author: null };
}

export interface ContributorDetail extends Contributor {
  instagram?: string;
  role?: { th: string; en: string };
  bio?: { th: string; en: string };
}

/** Known contributor registry with Instagram handles and roles */
export const KNOWN_CONTRIBUTORS: Record<string, ContributorDetail> = {
  Jesselpetry: {
    name: "Chatan Petry",
    github: "Jesselpetry",
    instagram: "chatann_",
    role: {
      th: "ผู้ก่อตั้งและผู้ดูแลหลัก (Lead Maintainer)",
      en: "Creator & Lead Maintainer",
    },
    bio: {
      th: "สถาปัตยกรรมหลักของ iHelp, ระบบตัดเกรด, ธีมมืด Figma, คลังเอกสาร และเครื่องมือเตรียมสอบ",
      en: "Core architecture of iHelp, Grade Calculator, Figma dark theme, Library & Exam tools",
    },
  },
  PhuPunnavit: {
    name: "Punnavit (Phu)",
    github: "PhuPunnavit",
    instagram: "priiu_i",
    role: { th: "ผู้ร่วมพัฒนา (Core Contributor)", en: "Core Contributor" },
    bio: {
      th: "ระบบแชทผู้ช่วยตอบคำถาม (Help-Desk Chat Widget) และสรุปฉบับแปลไทย ITF Lecture Weeks 08-15",
      en: "Help-Desk Chat Widget and Thai translated summaries for ITF Lecture Weeks 08-15",
    },
  },
  PGTHEGOD: {
    name: "Akarapach Yootsukprasert",
    github: "PGTHEGOD",
    instagram: "pgthegod_x",
    role: { th: "ผู้ร่วมพัฒนา (Contributor)", en: "Contributor" },
    bio: {
      th: "หน้า Landing Page /pro และการผูกระบบสำหรับ PG IJUDGE VS Code Extension",
      en: "/pro landing page and integration for PG IJUDGE VS Code Extension",
    },
  },
  Meaookung144: {
    name: "Kittinan Atthasiri (Meao)",
    github: "Meaookung144",
    instagram: "meaookung144",
    role: { th: "ผู้ร่วมพัฒนา (Contributor)", en: "Contributor" },
    bio: {
      th: "ระบบจัดการและส่งคำตอบ PSCP และ Learning Log Direct Edit",
      en: "PSCP Submission management and Learning Log direct edit workflow",
    },
  },
  tammadon: {
    name: "Tammadon Suksa (IT24)",
    github: "tammadon",
    role: {
      th: "ผู้ร่วมแบ่งปันบันทึกสรุป Notion (IT24)",
      en: "Notion Study Notes Author (IT24)",
    },
    bio: {
      th: "เพื่อนร่วมรุ่น IT24 ผู้จัดทำและแบ่งปันโน้ตสรุปวิชา ITF สัปดาห์ที่ 08–15 บน Notion พร้อม 79 ภาพสไลด์จดคำอธิบายละเอียด",
      en: "IT24 classmate who authored and shared ITF Notion notes for Weeks 08–15 with 79 annotated slide images",
    },
  },
};

export function getContributorDetail(c: Contributor): ContributorDetail {
  const matchKey = Object.keys(KNOWN_CONTRIBUTORS).find(
    (k) => k.toLowerCase() === c.github.toLowerCase(),
  );
  const known = matchKey ? KNOWN_CONTRIBUTORS[matchKey] : undefined;
  return {
    ...c,
    instagram: c.instagram || known?.instagram,
    role: (c as ContributorDetail).role || known?.role,
    bio: (c as ContributorDetail).bio || known?.bio,
  };
}

export function ContributorModal({
  contributor,
  profile: explicitProfile,
  open,
  onOpenChange,
}: {
  contributor: Contributor | null;
  profile?: ContributorProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useLocale();

  // Accordion state: both open by default
  const [openMaterials, setOpenMaterials] = useState(true);
  const [openChangelog, setOpenChangelog] = useState(true);

  if (!contributor && !explicitProfile) return null;

  // Resolve full profile if available
  const rawProfile =
    explicitProfile ??
    (contributor ? getContributorById(contributor.github) : undefined);
  const profile = rawProfile
    ? getContributorWithAcademicYear(rawProfile)
    : undefined;

  const detail = contributor
    ? getContributorDetail(contributor)
    : {
        name: profile?.name ?? "Contributor",
        github: profile?.socials.github ?? profile?.id ?? "contributor",
        instagram: profile?.socials.instagram,
        role: profile?.primaryRole,
        bio: profile?.bio,
      };

  // Find all versions this contributor participated in
  const githubHandle = profile?.socials.github ?? detail.github;
  const contributions: VersionEntry[] = CHANGELOG.filter((v) =>
    v.contributors.some(
      (c) => c.github.toLowerCase() === githubHandle.toLowerCase(),
    ),
  );

  // Calculate total changes or commits attributed
  const totalAttributedChanges = contributions.reduce((acc, v) => {
    const userChanges = v.changes.filter((c) => {
      const { author } = parseChangeText(t(c.text, "en"));
      return !author || author.toLowerCase() === githubHandle.toLowerCase();
    });
    return acc + (userChanges.length > 0 ? userChanges.length : 1);
  }, 0);

  const materials = profile?.materials ?? [];
  const avatarUrl =
    profile?.avatarUrl ?? `https://github.com/${detail.github}.png`;

  // Concise student meta string without pill wrapping: e.g. "IT KMITL #24 · ชั้นปีที่ 1 · รหัส 69070027"
  const metaParts: string[] = [];
  if (profile?.cohort) {
    const cohortNumber = profile.cohort.replace(/[^0-9]/g, "");
    metaParts.push(cohortNumber ? `IT KMITL #${cohortNumber}` : profile.cohort);
  } else if (profile?.faculty) {
    metaParts.push(t(profile.faculty, locale));
  }

  if (profile?.academic?.yearLabel) {
    metaParts.push(t(profile.academic.yearLabel, locale));
  }

  if (profile?.studentId) {
    metaParts.push(
      `${t({ th: "รหัส", en: "ID" }, locale)} ${profile.studentId}`,
    );
  }

  const studentMetaString = metaParts.join(" · ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-xl p-0 overflow-hidden border border-border/60 shadow-xl rounded-2xl max-h-[88dvh] flex flex-col bg-card">
        {/* Scrollable Container */}
        <div className="overflow-y-auto min-w-0 flex-1 overscroll-contain">
          {/* Cover gradient banner — clean, no duplicate floating badges */}
          <div className="relative h-24 sm:h-28 bg-gradient-to-r from-primary/15 via-primary/5 to-muted/30 border-b border-border/40 overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
          </div>

          {/* Profile Content Body */}
          <div className="px-5 sm:px-6 pb-6 pt-0 space-y-6">
            {/* Header: Avatar, Name, Handle, Subtitle, Bio, and Actions */}
            <div className="space-y-3.5 -mt-11 sm:-mt-13 relative z-10">
              {/* Avatar — rounded-full with background ring */}
              <Avatar className="size-20 sm:size-22 rounded-full ring-4 ring-card shadow-md shrink-0 bg-card">
                <AvatarImage
                  src={avatarUrl}
                  alt={detail.name}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="rounded-full text-base sm:text-lg font-bold bg-muted text-foreground">
                  {profile?.avatarFallback ??
                    detail.github.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Identity & Subtitle (No truncation!) */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {detail.name}
                  </DialogTitle>
                  {profile?.nickname && (
                    <span className="text-sm text-muted-foreground font-normal">
                      ({profile.nickname})
                    </span>
                  )}
                </div>

                {/* Subtitle / Meta Line */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="text-muted-foreground font-mono">
                    @{detail.github}
                  </span>

                  {studentMetaString && (
                    <>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-muted-foreground">
                        {studentMetaString}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Role Badge & Bio (Integrated cleanly below name, no boxed container) */}
              {(detail.role || detail.bio) && (
                <div className="space-y-1.5 pt-0.5">
                  {detail.role && (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center text-[11px] font-medium text-foreground/90 bg-muted px-2 py-0.5 rounded">
                        {t(detail.role, locale)}
                      </span>
                    </div>
                  )}
                  {detail.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                      {t(detail.bio, locale)}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons — Unified secondary outline style */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {detail.github && (
                  <a
                    href={`https://github.com/${detail.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border/60 bg-muted/30 hover:bg-muted hover:border-border text-foreground/80 hover:text-foreground transition-colors shadow-2xs"
                    title={t(L.openGithub, locale)}
                  >
                    <GithubIcon className="size-3.5" />
                    <span>GitHub</span>
                    <ExternalLink className="size-3 text-muted-foreground/60" />
                  </a>
                )}

                {detail.instagram && (
                  <a
                    href={`https://instagram.com/${detail.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border/60 bg-muted/30 hover:bg-muted hover:border-border text-foreground/80 hover:text-foreground transition-colors shadow-2xs"
                    title={t(L.openInstagram, locale)}
                  >
                    <InstagramIcon className="size-3.5 text-pink-500" />
                    <span className="font-mono">@{detail.instagram}</span>
                    <ExternalLink className="size-3 text-muted-foreground/60" />
                  </a>
                )}

                {profile?.socials.notion && (
                  <a
                    href={profile.socials.notion}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border/60 bg-muted/30 hover:bg-muted hover:border-border text-foreground/80 hover:text-foreground transition-colors shadow-2xs"
                  >
                    <NotionIcon className="size-3.5" />
                    <span>Notion</span>
                    <ExternalLink className="size-3 text-muted-foreground/60" />
                  </a>
                )}
              </div>
            </div>

            {/* ── De-boxed Sections (Clean borderless containers with thin dividers) ── */}
            <div className="space-y-6 pt-3 border-t border-border/40">
              {/* Section 1: Course Materials (Clean divide-y list, no card nesting) */}
              {materials.length > 0 && (
                <div className="space-y-2">
                  {/* Section Heading */}
                  <button
                    type="button"
                    onClick={() => setOpenMaterials(!openMaterials)}
                    className="w-full flex items-center justify-between py-1 hover:text-foreground transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-4 text-primary shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {t(L.materialsTitle, locale)}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ({materials.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform duration-200 ${
                        openMaterials ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Section List: Thin divide-y lines */}
                  {openMaterials && (
                    <div className="divide-y divide-border/40">
                      {materials.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Neutral low-contrast course badge */}
                              <span className="bg-muted text-muted-foreground font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 font-normal">
                                {item.courseCode}
                              </span>
                              <span className="text-xs font-medium text-foreground/90 group-hover:text-primary transition-colors">
                                {t(item.title, locale)}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                  · {t(item.badge, locale)}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
                                {t(item.description, locale)}
                              </p>
                            )}
                          </div>

                          {/* Right-aligned clean arrow icon */}
                          {item.url && (
                            <a
                              href={item.url}
                              target={
                                item.url.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                item.url.startsWith("http")
                                  ? "noreferrer"
                                  : undefined
                              }
                              className="shrink-0 p-1 text-muted-foreground hover:text-primary transition-colors mt-0.5"
                              title={t({ th: "เปิดดู", en: "Open" }, locale)}
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Section 2: Contributions & Commit History (Clean divide-y list) */}
              {contributions.length > 0 && (
                <div className="space-y-2">
                  {/* Section Heading */}
                  <button
                    type="button"
                    onClick={() => setOpenChangelog(!openChangelog)}
                    className="w-full flex items-center justify-between py-1 hover:text-foreground transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-primary shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {t(L.contributions, locale)}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ({contributions.length} {t(L.versionsCount, locale)} ·{" "}
                        {totalAttributedChanges} {t(L.changesCount, locale)})
                      </span>
                    </div>
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform duration-200 ${
                        openChangelog ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Section List: Thin divide-y lines */}
                  {openChangelog && (
                    <div className="divide-y divide-border/40 pt-1">
                      {contributions.map((v) => {
                        const isInDev = !v.date;
                        return (
                          <div key={v.version} className="py-3 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-primary text-xs">
                                  v{v.version}
                                </span>
                                {isInDev ? (
                                  <span className="text-[10px] text-amber-500 font-medium">
                                    ({t(L.inDevelopment, locale)})
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground/70">
                                    {new Date(v.date!).toLocaleDateString(
                                      locale === "th" ? "th-TH" : "en-GB",
                                      {
                                        dateStyle: "medium",
                                      },
                                    )}
                                  </span>
                                )}
                              </div>

                              {v.commit && (
                                <a
                                  href={
                                    v.date
                                      ? `${SITE.repo.url}/commit/${v.commit}`
                                      : `${SITE.repo.url}/compare/${v.commit}...${SITE.repo.branch}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-mono text-muted-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
                                >
                                  <GitCommitHorizontal className="size-3 text-primary/70" />
                                  <span>{v.commit.slice(0, 7)}</span>
                                  <ExternalLink className="size-2.5 opacity-60" />
                                </a>
                              )}
                            </div>

                            <ul className="space-y-1 pl-2 border-l border-primary/25">
                              {v.changes.slice(0, 4).map((change, idx) => {
                                const { cleanText } = parseChangeText(
                                  t(change.text, locale),
                                );
                                return (
                                  <li
                                    key={idx}
                                    className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5"
                                  >
                                    <span className="text-primary/60 shrink-0 select-none">
                                      –
                                    </span>
                                    <span>{cleanText}</span>
                                  </li>
                                );
                              })}
                              {v.changes.length > 4 && (
                                <li className="text-[10px] text-muted-foreground/70 italic pl-2.5">
                                  + {v.changes.length - 4}{" "}
                                  {t(L.moreChanges, locale)}
                                </li>
                              )}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Clean borderless card for sidebar in GitHub Releases style
 */
export function ContributorCard({
  contributor,
  onClick,
}: {
  contributor: Contributor;
  onClick?: () => void;
}) {
  const detail = getContributorDetail(contributor);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group w-full flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all duration-150 hover:bg-muted/60 active:scale-[0.99] cursor-pointer text-left"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="size-10 shrink-0 shadow-2xs ring-1 ring-border/50 rounded-full">
          <AvatarImage
            src={`https://github.com/${detail.github}.png`}
            alt={`@${detail.github}`}
            className="rounded-full object-cover"
          />
          <AvatarFallback className="text-xs font-semibold rounded-full">
            {detail.github.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {detail.name}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate">
            @{detail.github}
          </p>
        </div>
      </div>

      {/* Social action icons — Rounded full & clean */}
      <div
        className="flex items-center gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href={`https://github.com/${detail.github}`}
          target="_blank"
          rel="noreferrer"
          title={`GitHub: @${detail.github}`}
          className="size-7 rounded-full flex items-center justify-center border border-border/60 bg-muted/30 hover:bg-muted hover:border-border text-foreground/80 hover:text-primary transition-colors shadow-2xs"
        >
          <GithubIcon className="size-3.5" />
        </a>

        {detail.instagram && (
          <a
            href={`https://instagram.com/${detail.instagram}`}
            target="_blank"
            rel="noreferrer"
            title={`Instagram: @${detail.instagram}`}
            className="size-7 rounded-full flex items-center justify-center border border-border/60 bg-muted/30 hover:bg-muted hover:border-border text-foreground/80 hover:text-pink-500 transition-colors shadow-2xs"
          >
            <InstagramIcon className="size-3.5 text-pink-500" />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Capsule badge for compact inline display
 */
export function ContributorBadge({
  contributor,
  onClick,
}: {
  contributor: Contributor;
  onClick?: () => void;
}) {
  const detail = getContributorDetail(contributor);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted hover:border-primary/40 active:scale-95 transition-all shadow-2xs cursor-pointer text-left"
    >
      <Avatar size="sm" className="size-5 rounded-full">
        <AvatarImage
          src={`https://github.com/${detail.github}.png`}
          alt={`@${detail.github}`}
          className="rounded-full object-cover"
        />
        <AvatarFallback className="text-[9px] rounded-full">
          {detail.github.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-foreground font-mono text-[11px] group-hover:text-primary transition-colors">
        @{detail.github}
      </span>
      {detail.instagram && (
        <span
          title={`Instagram: @${detail.instagram}`}
          className="text-pink-500/80 group-hover:text-pink-600 transition-colors"
        >
          <InstagramIcon className="size-3" />
        </span>
      )}
    </button>
  );
}
