"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Code2,
  ExternalLink,
  GitCommitHorizontal,
  Milestone,
  Sparkles,
  Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CHANGELOG,
  getCurrentVersion,
  MAJOR_EVOLUTION_MILESTONES,
  type ChangeKind,
  type Contributor,
  type VersionEntry,
} from "@/lib/docs/changelog";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import {
  ContributorBadge,
  ContributorCard,
  ContributorModal,
  KNOWN_CONTRIBUTORS,
  parseChangeText,
} from "@/components/contributor-modal";

const L = {
  title: { th: "เวอร์ชันและ Changelog", en: "Version & Changelog" },
  subtitle: {
    th: `ประวัติการอัปเดตของ ${SITE.plainName} แต่ละเวอร์ชัน พร้อมชื่อผู้ร่วมพัฒนา`,
    en: `Update history of ${SITE.plainName}, version by version, with contributor credits.`,
  },
  backToHome: { th: "กลับหน้ารวมรายวิชา", en: "Back to courses" },
  contributors: { th: "ผู้ร่วมพัฒนา", en: "Contributors" },
  teamAndContributors: { th: "ทีมผู้ร่วมพัฒนา", en: "Developers & Contributors" },
  currentVersion: { th: "เวอร์ชันปัจจุบัน", en: "Current Version" },
  latestRelease: { th: "ปล่อยล่าสุด", en: "Latest Release" },
  inDevelopment: { th: "กำลังพัฒนา", en: "In Development" },
  releasedOn: { th: "ปล่อยเมื่อ", en: "Released on" },
  fullChangelog: {
    th: "ดู CHANGELOG บน GitHub",
    en: "View CHANGELOG on GitHub",
  },
  versionGuide: {
    th: "คู่มือการจัดการเวอร์ชัน",
    en: "Version Control Guide",
  },
  viewCommit: { th: "ดู commit บน GitHub", en: "View commit on GitHub" },
  viewDiff: { th: "ดูการเปลี่ยนแปลงบน GitHub", en: "View changes on GitHub" },
  releaseTimeline: { th: "ประวัติการปล่อยเวอร์ชัน", en: "Release Timeline" },
  evolutionTitle: {
    th: "การนับลำดับวิวัฒนาการหลักของ <i>Help",
    en: "Major Evolution Milestones of <i>Help",
  },
  evolutionSubtitle: {
    th: "ลำดับหมุดหมายสำคัญจากจุดเริ่มต้นสู่ Production Release",
    en: "Key architectural milestones from inception to production release",
  },
};

const KIND_LABEL: Record<ChangeKind, { th: string; en: string }> = {
  added: { th: "เพิ่ม", en: "Added" },
  changed: { th: "ปรับปรุง", en: "Improved" },
  fixed: { th: "แก้ไข", en: "Fixed" },
  security: { th: "ความปลอดภัย", en: "Security" },
};

const KIND_VARIANT: Record<
  ChangeKind,
  "default" | "secondary" | "outline" | "destructive"
> = {
  added: "default",
  changed: "secondary",
  fixed: "outline",
  security: "destructive",
};

function formatDate(iso: string, locale: "th" | "en"): string {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
    dateStyle: "long",
  });
}

function githubHref(entry: VersionEntry): string | null {
  if (!entry.commit) return null;
  return entry.date
    ? `${SITE.repo.url}/commit/${entry.commit}`
    : `${SITE.repo.url}/compare/${entry.commit}...${SITE.repo.branch}`;
}

export function VersionView() {
  const { locale } = useLocale();
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);

  const current = getCurrentVersion();
  const allCoreMembers: Contributor[] = Object.values(KNOWN_CONTRIBUTORS);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" />
            {t(L.backToHome, locale)}
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t(L.title, locale)}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t(L.subtitle, locale)}
          </p>
        </div>

        {/* Current Version Pill — Top Right (Clean, no green dot) */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-card/90 shadow-sm text-xs">
            <Tag className="size-3.5 text-primary" />
            <span className="text-muted-foreground">{t(L.currentVersion, locale)}:</span>
            <span className="font-mono font-bold text-primary">v{current.version}</span>
          </div>
        </div>
      </div>

      {/* 2-Panel Layout: Main Timeline (Left) & GitHub-style Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left Panel: Release Timeline */}
        <div className="space-y-6">
          {/* Major Evolution Milestones Card */}
          <section className="rounded-2xl border bg-card/60 p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Milestone className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground/90">
                  {t(L.evolutionTitle, locale)}
                </h2>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {MAJOR_EVOLUTION_MILESTONES.length} milestones
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(L.evolutionSubtitle, locale)}
            </p>

            <div className="relative border-l-2 border-border/40 pl-6 space-y-3.5 my-2">
              {MAJOR_EVOLUTION_MILESTONES.map((item) => (
                <div
                  key={item.version}
                  className="relative flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 text-xs"
                >
                  <span
                    className={`absolute -left-[29px] top-1 size-2 rounded-full ring-4 ${
                      item.highlight
                        ? "bg-primary ring-primary/20"
                        : "bg-muted-foreground/40 ring-background"
                    }`}
                  />
                  <span
                    className={`font-mono text-[11px] font-semibold shrink-0 px-2 py-0.5 rounded ${
                      item.highlight
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-muted text-foreground/80"
                    }`}
                  >
                    {item.version}
                  </span>
                  <span
                    className={`leading-relaxed ${
                      item.highlight
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(item.summary, locale)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
              <Tag className="size-4 text-primary" />
              <span>{t(L.releaseTimeline, locale)}</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({CHANGELOG.length})
              </span>
            </div>

            <a
              href={`${SITE.repo.url}/blob/${SITE.repo.branch}/CHANGELOG.md`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span>{t(L.fullChangelog, locale)}</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="space-y-5">
            {CHANGELOG.map((v, index) => {
              const href = githubHref(v);
              const isLatest = index === 0 && Boolean(v.date);
              const isInDev = !v.date;

              return (
                <div
                  key={v.version}
                  className="rounded-2xl border bg-card shadow-sm p-5 sm:p-6 space-y-4 hover:border-primary/25 transition-colors"
                >
                  {/* Version Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          title={t(v.date ? L.viewCommit : L.viewDiff, locale)}
                          className="group inline-flex items-center gap-1.5"
                        >
                          <span className="font-mono text-xl sm:text-2xl font-bold text-primary transition-colors group-hover:underline">
                            v{v.version}
                          </span>
                          <GitCommitHorizontal className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        </a>
                      ) : (
                        <span className="font-mono text-xl sm:text-2xl font-bold text-primary">
                          v{v.version}
                        </span>
                      )}

                      {isLatest && (
                        <Badge
                          variant="default"
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 shadow-sm"
                        >
                          <Sparkles className="size-3 mr-1" />
                          {t(L.latestRelease, locale)}
                        </Badge>
                      )}

                      {isInDev && (
                        <Badge
                          variant="outline"
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border-amber-500/40 text-amber-600 dark:text-amber-400"
                        >
                          {t(L.inDevelopment, locale)}
                        </Badge>
                      )}

                      {v.date && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                          <Calendar className="size-3 text-muted-foreground/80" />
                          {formatDate(v.date, locale)}
                        </span>
                      )}
                    </div>

                    {/* Contributors in this version */}
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {v.contributors.map((c) => (
                          <ContributorBadge
                            key={c.github}
                            contributor={c}
                            onClick={() => setSelectedContributor(c)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Changes List */}
                  <ul className="space-y-3 pt-1">
                    {v.changes.map((change, i) => {
                      const rawText = t(change.text, locale);
                      const { cleanText, author } = parseChangeText(rawText);
                      const contributorObj = author
                        ? Object.values(KNOWN_CONTRIBUTORS).find(
                            (c) => c.github.toLowerCase() === author.toLowerCase()
                          )
                        : null;

                      return (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <Badge
                            variant={KIND_VARIANT[change.kind]}
                            className="mt-0.5 shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {t(KIND_LABEL[change.kind], locale)}
                          </Badge>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <span className="text-foreground/90 leading-relaxed text-[13px] sm:text-sm block break-words">
                              {cleanText}
                            </span>
                            {/* Attributed Contributor Badge in a separate row */}
                            {author && (
                              <div className="pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (contributorObj) {
                                      setSelectedContributor(contributorObj);
                                    }
                                  }}
                                  className="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer"
                                >
                                  <Avatar size="sm" className="size-4 shrink-0">
                                    <AvatarImage
                                      src={`https://github.com/${author}.png`}
                                      alt={`@${author}`}
                                    />
                                    <AvatarFallback className="text-[7px]">
                                      {author.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-[11px] font-mono group-hover:text-primary transition-colors">
                                    {locale === "th" ? `โดย @${author}` : `by @${author}`}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: GitHub-style Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20">
          {/* Current Version Card (Clean, no green dot) */}
          <div className="rounded-2xl border bg-card/60 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {t(L.currentVersion, locale)}
              </span>
              <Tag className="size-3.5 text-muted-foreground/80" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  v{current.version}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                  {current.commit?.slice(0, 7) || SITE.repo.branch}
                </Badge>
              </div>

              {current.date && (
                <p className="text-xs text-muted-foreground">
                  {t(L.releasedOn, locale)}: {formatDate(current.date, locale)}
                </p>
              )}
            </div>

            {current.commit && (
              <a
                href={`${SITE.repo.url}/commit/${current.commit}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium pt-1"
              >
                <GitCommitHorizontal className="size-3.5" />
                <span>{t(L.viewCommit, locale)}</span>
                <ExternalLink className="size-2.5 opacity-70" />
              </a>
            )}
          </div>

          {/* Contributors List — Clean borderless cards */}
          <div className="rounded-2xl border bg-card/40 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-primary" />
                <h2 className="text-xs font-semibold text-foreground/90">
                  {t(L.teamAndContributors, locale)}
                </h2>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {allCoreMembers.length}
              </span>
            </div>

            <div className="space-y-1">
              {allCoreMembers.map((member) => (
                <ContributorCard
                  key={member.github}
                  contributor={member}
                  onClick={() => setSelectedContributor(member)}
                />
              ))}
            </div>
          </div>

          {/* Docs & Repository Links */}
          <div className="rounded-2xl border bg-muted/20 p-4 shadow-sm space-y-2.5 text-xs text-muted-foreground">
            <p className="font-medium text-foreground/90">
              {SITE.name} · Open Source
            </p>
            <p className="leading-relaxed">
              {locale === "th"
                ? "ข้อมูลเวอร์ชันถูกซิงค์จาก CHANGELOG.md และคลัง Git อัตโนมัติ"
                : "Version history synced from CHANGELOG.md and Git commits."}
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <a
                href={`${SITE.repo.url}/blob/${SITE.repo.branch}/docs/VERSION_CONTROL_GUIDE.md`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <Tag className="size-3" />
                <span>{t(L.versionGuide, locale)}</span>
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
              <a
                href={SITE.repo.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Contributor Profile Modal */}
      <ContributorModal
        contributor={selectedContributor}
        open={Boolean(selectedContributor)}
        onOpenChange={(open) => {
          if (!open) setSelectedContributor(null);
        }}
      />
    </main>
  );
}
