"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CHANGELOG, type ChangeKind } from "@/lib/changelog";
import { useLocale, t } from "@/lib/i18n";

const L = {
  title: { th: "เวอร์ชันและ Changelog", en: "Version & Changelog" },
  subtitle: {
    th: "ประวัติการอัปเดตของ ihelp แต่ละเวอร์ชัน พร้อมชื่อผู้ร่วมพัฒนา",
    en: "Update history of ihelp, version by version, with contributor credits.",
  },
  backToList: { th: "กลับหน้ารายการโจทย์", en: "Back to problems" },
  contributors: { th: "ผู้ร่วมพัฒนา", en: "Contributors" },
  fullChangelog: {
    th: "ดูฉบับเต็มบน GitHub",
    en: "View the full changelog on GitHub",
  },
};

const KIND_LABEL: Record<ChangeKind, { th: string; en: string }> = {
  added: { th: "เพิ่ม", en: "Added" },
  changed: { th: "เปลี่ยนแปลง", en: "Changed" },
  fixed: { th: "แก้ไข", en: "Fixed" },
};

const KIND_VARIANT: Record<ChangeKind, "default" | "secondary" | "outline"> = {
  added: "default",
  changed: "secondary",
  fixed: "outline",
};

function formatDate(iso: string, locale: "th" | "en"): string {
  return new Date(iso).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
    dateStyle: "long",
  });
}

export function VersionView() {
  const { locale } = useLocale();
  return (
    <main className="max-w-3xl mx-auto px-6 py-8 w-full space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          {t(L.backToList, locale)}
        </Link>
        <h1 className="text-2xl font-bold mt-2">{t(L.title, locale)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t(L.subtitle, locale)}</p>
        <a
          href="https://github.com/Jesselpetry/ihelp/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs text-muted-foreground hover:text-primary mt-1"
        >
          {t(L.fullChangelog, locale)}
        </a>
      </div>

      <div className="space-y-4">
        {CHANGELOG.map((v) => (
          <div key={v.version} className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-bold">v{v.version}</span>
              {v.date && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(v.date, locale)}
                </span>
              )}
              <span className="ml-auto flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {t(L.contributors, locale)}:
                {v.contributors.map((c) => (
                  <a
                    key={c.github}
                    href={`https://github.com/${c.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {c.name}
                  </a>
                ))}
              </span>
            </div>
            <ul className="space-y-1.5">
              {v.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Badge variant={KIND_VARIANT[change.kind]} className="mt-0.5 shrink-0">
                    {t(KIND_LABEL[change.kind], locale)}
                  </Badge>
                  <span>{t(change.text, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
