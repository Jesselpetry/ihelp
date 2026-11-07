"use client";

import {
  ExternalLink,
  GitCommitHorizontal,
  Sparkles,
  Code2,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GithubIcon, InstagramIcon } from "@/components/social-icons";
import { CHANGELOG, type Contributor, type VersionEntry } from "@/lib/docs/changelog";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const L = {
  profileTitle: { th: "ข้อมูลผู้ร่วมพัฒนา", en: "Contributor Profile" },
  contributions: { th: "ประวัติการร่วมพัฒนาใน iHelp", en: "Contributions in iHelp" },
  versionsCount: { th: "เวอร์ชันที่มีส่วนร่วม", en: "Versions Contributed" },
  openGithub: { th: "เปิด GitHub Profile", en: "Open GitHub Profile" },
  openInstagram: { th: "เปิด Instagram Profile", en: "Open Instagram Profile" },
  latestWork: { th: "ผลงานในเวอร์ชันนี้", en: "Work in this version" },
  inDevelopment: { th: "กำลังพัฒนา", en: "In Development" },
  viewCommit: { th: "ดู commit", en: "View commit" },
  viewDiff: { th: "ดู changes", en: "View changes" },
};

const AUTHOR_REGEX = /\s*\((?:โดย|by)\s+@([A-Za-z0-9_-]+)\)\s*$/i;

/** Parses and extracts author attribution like (โดย @user) or (by @user) from changelog text */
export function parseChangeText(text: string): { cleanText: string; author: string | null } {
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
    role: { th: "ผู้ก่อตั้งและผู้ดูแลหลัก (Lead Maintainer)", en: "Creator & Lead Maintainer" },
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
};

export function getContributorDetail(c: Contributor): ContributorDetail {
  const matchKey = Object.keys(KNOWN_CONTRIBUTORS).find(
    (k) => k.toLowerCase() === c.github.toLowerCase()
  );
  const known = matchKey ? KNOWN_CONTRIBUTORS[matchKey] : undefined;
  return {
    ...c,
    instagram: c.instagram || known?.instagram,
    role: (c as ContributorDetail).role || known?.role,
    bio: (c as ContributorDetail).bio || known?.bio,
  };
}

/** Tidy section header component without stretched/wide letter-spacing */
function SectionTitle({
  icon: Icon,
  children,
}: {
  icon?: typeof Code2;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-foreground/90">
      {Icon && <Icon className="size-3.5 text-primary" />}
      <span>{children}</span>
    </div>
  );
}

export function ContributorModal({
  contributor,
  open,
  onOpenChange,
}: {
  contributor: Contributor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useLocale();

  if (!contributor) return null;
  const detail = getContributorDetail(contributor);

  // Find all versions this contributor participated in
  const contributions: VersionEntry[] = CHANGELOG.filter((v) =>
    v.contributors.some((c) => c.github.toLowerCase() === contributor.github.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full sm:max-w-lg p-0 overflow-hidden border shadow-md rounded-2xl max-h-[88dvh] flex flex-col">
        {/* Cover gradient */}
        <div className="relative h-20 sm:h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-muted border-b shrink-0">
          {/* Badge moved to top-left to avoid colliding with top-right dialog close button */}
          <div className="absolute top-3 left-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground/90 bg-background/90 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-full border shadow-sm">
              <Code2 className="size-3 text-primary" />
              <span>
                {contributions.length} {t(L.versionsCount, locale)}
              </span>
            </span>
          </div>
        </div>

        {/* Profile info - Responsive scrolling content */}
        <div className="px-4 sm:px-6 pb-6 pt-0 relative space-y-4 sm:space-y-5 overflow-y-auto min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-10 sm:-mt-12">
            <div className="flex items-end gap-3 sm:gap-3.5 min-w-0">
              <Avatar className="size-16 sm:size-20 ring-4 ring-background shadow-md shrink-0">
                <AvatarImage
                  src={`https://github.com/${detail.github}.png`}
                  alt={`@${detail.github}`}
                />
                <AvatarFallback className="text-base sm:text-lg font-bold">
                  {detail.github.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 mb-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold leading-tight text-foreground truncate">
                  {detail.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-mono truncate">@{detail.github}</p>
              </div>
            </div>

            {/* Social Links — Rounded Full & Wrap nicely */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://github.com/${detail.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-full border bg-background hover:bg-muted transition-colors shadow-sm"
                title={t(L.openGithub, locale)}
              >
                <GithubIcon className="size-3.5" />
                <span>GitHub</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>

              {detail.instagram && (
                <a
                  href={`https://instagram.com/${detail.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-full border bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/15 transition-colors shadow-sm"
                  title={t(L.openInstagram, locale)}
                >
                  <InstagramIcon className="size-3.5 text-pink-500" />
                  <span className="font-mono">@{detail.instagram}</span>
                  <ExternalLink className="size-3 text-pink-500/70" />
                </a>
              )}
            </div>
          </div>

          {/* Role badge & bio */}
          <div className="space-y-2 rounded-xl bg-muted/40 p-3 sm:p-3.5 border shadow-sm">
            {detail.role && (
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-xs font-medium rounded-full py-0.5">
                  <Sparkles className="size-3 text-primary mr-1" />
                  {t(detail.role, locale)}
                </Badge>
              </div>
            )}
            {detail.bio && (
              <p className="text-xs text-muted-foreground leading-relaxed break-words">
                {t(detail.bio, locale)}
              </p>
            )}
          </div>

          {/* Contributions List */}
          <div className="space-y-3">
            <SectionTitle icon={Code2}>
              {t(L.contributions, locale)}
            </SectionTitle>

            <div className="space-y-3 divide-y divide-border/60">
              {contributions.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  {t({ th: "ยังไม่มีประวัติใน changelog", en: "No recorded changelog entries yet" }, locale)}
                </p>
              ) : (
                contributions.map((v) => {
                  const isInDev = !v.date;
                  return (
                    <div key={v.version} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono font-bold text-primary text-sm">
                            v{v.version}
                          </span>
                          {isInDev ? (
                            <Badge variant="outline" className="text-[10px] py-0 px-2 border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-full">
                              {t(L.inDevelopment, locale)}
                            </Badge>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                              <Calendar className="size-3 text-muted-foreground/70" />
                              {new Date(v.date!).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
                                dateStyle: "medium",
                              })}
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
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors font-mono bg-muted/40 hover:bg-muted px-2 py-0.5 rounded border shadow-sm shrink-0"
                          >
                            <GitCommitHorizontal className="size-3 text-primary" />
                            <span>{v.commit.slice(0, 7)}</span>
                            <ExternalLink className="size-2.5 ml-0.5 opacity-60" />
                          </a>
                        )}
                      </div>

                      <ul className="space-y-1.5 pl-3 border-l-2 border-primary/30">
                        {v.changes.slice(0, 4).map((change, idx) => {
                          const { cleanText } = parseChangeText(t(change.text, locale));
                          return (
                            <li key={idx} className="text-[12px] text-foreground/85 leading-relaxed flex items-start gap-1.5">
                              <span className="text-primary/70 mt-1 shrink-0 text-xs">•</span>
                              <span className="break-words min-w-0">{cleanText}</span>
                            </li>
                          );
                        })}
                        {v.changes.length > 4 && (
                          <li className="text-[11px] text-muted-foreground italic pl-3">
                            + {v.changes.length - 4} {t({ th: "รายการเพิ่มเติมในเวอร์ชันนี้", en: "more changes in this version" }, locale)}
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })
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
        <Avatar className="size-10 shrink-0 shadow-sm ring-1 ring-border/50">
          <AvatarImage
            src={`https://github.com/${detail.github}.png`}
            alt={`@${detail.github}`}
          />
          <AvatarFallback className="text-xs font-semibold">
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
      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        <a
          href={`https://github.com/${detail.github}`}
          target="_blank"
          rel="noreferrer"
          title={`GitHub: @${detail.github}`}
          className="size-7 rounded-full flex items-center justify-center border bg-card hover:bg-muted hover:border-primary/40 text-foreground/80 hover:text-primary transition-colors shadow-sm"
        >
          <GithubIcon className="size-3.5" />
        </a>

        {detail.instagram && (
          <a
            href={`https://instagram.com/${detail.instagram}`}
            target="_blank"
            rel="noreferrer"
            title={`Instagram: @${detail.instagram}`}
            className="size-7 rounded-full flex items-center justify-center border border-pink-500/20 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 hover:border-pink-500/40 transition-colors shadow-sm"
          >
            <InstagramIcon className="size-3.5" />
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
      className="group inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted hover:border-primary/40 active:scale-95 transition-all shadow-sm cursor-pointer text-left"
    >
      <Avatar size="sm" className="size-5">
        <AvatarImage
          src={`https://github.com/${detail.github}.png`}
          alt={`@${detail.github}`}
        />
        <AvatarFallback className="text-[9px]">
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
