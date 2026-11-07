"use client";

import {
  ExternalLink,
  GitCommitHorizontal,
  Sparkles,
  Code2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  unreleased: { th: "กำลังพัฒนา (เร็วๆ นี้)", en: "In Development (Upcoming)" },
  viewCommit: { th: "ดู commit", en: "View commit" },
  viewDiff: { th: "ดู changes", en: "View changes" },
};

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
      <DialogContent className="max-w-lg p-0 overflow-hidden border shadow-xl rounded-2xl">
        {/* Cover gradient */}
        <div className="relative h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-muted border-b">
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-background/80 backdrop-blur-xs px-2.5 py-1 rounded-full border">
              <Code2 className="size-3 text-primary" />
              <span>{contributions.length} {t(L.versionsCount, locale)}</span>
            </span>
          </div>
        </div>

        {/* Profile info */}
        <div className="px-6 pb-6 pt-0 relative space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-3.5">
              <Avatar className="size-20 ring-4 ring-background shadow-md">
                <AvatarImage
                  src={`https://github.com/${detail.github}.png`}
                  alt={`@${detail.github}`}
                />
                <AvatarFallback className="text-lg font-bold">
                  {detail.github.slice(0, 2).toUpperCase()}
                </AvatarFallback>
                <AvatarBadge className="size-3.5 bg-emerald-500 ring-2 ring-background" />
              </Avatar>
              <div className="space-y-0.5 mb-1">
                <DialogTitle className="text-xl font-bold leading-tight">
                  {detail.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-mono">@{detail.github}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href={`https://github.com/${detail.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-background hover:bg-muted transition-colors shadow-2xs"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/15 transition-colors shadow-2xs"
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
          <div className="space-y-2 rounded-xl bg-muted/40 p-3.5 border">
            {detail.role && (
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-xs font-medium">
                  <Sparkles className="size-3 text-primary mr-1" />
                  {t(detail.role, locale)}
                </Badge>
              </div>
            )}
            {detail.bio && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(detail.bio, locale)}
              </p>
            )}
          </div>

          {/* Contributions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GitCommitHorizontal className="size-3.5 text-primary" />
              {t(L.contributions, locale)}
            </h4>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-border/60">
              {contributions.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">
                  {t({ th: "ยังไม่มีประวัติใน changelog", en: "No recorded changelog entries yet" }, locale)}
                </p>
              ) : (
                contributions.map((v) => {
                  const isUnreleased = !v.date;
                  return (
                    <div key={v.version} className="pt-2.5 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">
                            {isUnreleased ? v.version : `v${v.version}`}
                          </span>
                          {isUnreleased ? (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-amber-500/40 text-amber-600 dark:text-amber-400">
                              {t(L.unreleased, locale)}
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
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
                            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors font-mono"
                          >
                            <span>{v.commit.slice(0, 7)}</span>
                            <ExternalLink className="size-2.5" />
                          </a>
                        )}
                      </div>

                      <ul className="space-y-1 pl-2 border-l-2 border-border/60">
                        {v.changes.slice(0, 3).map((change, idx) => (
                          <li key={idx} className="text-[11px] text-foreground/80 line-clamp-2 leading-relaxed">
                            • {t(change.text, locale)}
                          </li>
                        ))}
                        {v.changes.length > 3 && (
                          <li className="text-[10px] text-muted-foreground italic">
                            + {v.changes.length - 3} {t({ th: "รายการเพิ่มเติม", en: "more changes" }, locale)}
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
      className="group inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted hover:border-primary/40 active:scale-95 transition-all shadow-2xs cursor-pointer text-left"
    >
      <Avatar size="sm" className="size-5">
        <AvatarImage
          src={`https://github.com/${detail.github}.png`}
          alt={`@${detail.github}`}
        />
        <AvatarFallback className="text-[9px]">
          {detail.github.slice(0, 2).toUpperCase()}
        </AvatarFallback>
        <AvatarBadge className="size-1.5 bg-emerald-500 ring-1 ring-background" />
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

