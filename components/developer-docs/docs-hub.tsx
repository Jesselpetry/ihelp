"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocale, t } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { DevDocSection } from "@/lib/docs/dev-docs";

const L = {
  title: { th: "คลังเอกสารและสถาปัตยกรรมระบบ", en: "Developer Documentation Hub" },
  subtitle: {
    th: `ศูนย์รวมเอกสารทางเทคนิค พิมพ์เขียวสถาปัตยกรรม 12 ระบบหลัก และคู่มือพัฒนาของ ${SITE.plainName}`,
    en: `Central technical documentation, master architecture blueprints, and engineering standards for ${SITE.plainName}.`,
  },
  searchPlaceholder: { th: "ค้นหาเอกสาร...", en: "Search documentation..." },
  totalDocs: { th: "เอกสารทั้งหมด", en: "Total documents" },
  viewChangelog: { th: "ประวัติเวอร์ชันและ Changelog", en: "Version History & Changelog" },
  masterDoc: { th: "เอกสารแม่บทระบบ", en: "Master Architecture" },
  readDoc: { th: "อ่านเอกสาร", en: "Read doc" },
  docCount: { th: "ฉบับ", en: "docs" },
  noResults: { th: "ไม่พบเอกสารที่ค้นหา", en: "No matching documents" },
};

export function DocsHub({ sections }: { sections: DevDocSection[] }) {
  const { locale } = useLocale();
  const [search, setSearch] = useState("");

  const allDocs = useMemo(() => {
    return sections.flatMap((s) => s.docs.map((d) => ({ ...d, sectionTitle: s.title })));
  }, [sections]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return allDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q)
    );
  }, [allDocs, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-mono text-primary border-primary/30">
              Super Library
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {allDocs.length} {t(L.totalDocs, locale)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="size-7 sm:size-8 text-primary shrink-0" />
            <span>{t(L.title, locale)}</span>
          </h1>

          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {t(L.subtitle, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <Link
            href="/version"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-card hover:bg-muted text-xs font-medium text-foreground transition-all shadow-2xs"
          >
            <Tag className="size-3.5 text-primary" />
            <span>{t(L.viewChangelog, locale)}</span>
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t(L.searchPlaceholder, locale)}
          className="pl-9 text-sm rounded-xl bg-card/60"
        />
      </div>

      {/* Search Results if query exists */}
      {filtered ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {locale === "th" ? `ผลการค้นหา (${filtered.length})` : `Search Results (${filtered.length})`}
          </h2>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{t(L.noResults, locale)}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <Link
                  key={item.slug}
                  href={item.slug === "readme" ? "/docs" : `/docs/${item.slug}`}
                  className="group rounded-2xl border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono text-[11px]">{item.fileName}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-primary pt-2">
                    <span>{t(L.readDoc, locale)}</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Categorized Sections View */
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    <span>{t(section.title, locale)}</span>
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono">
                    {section.docs.length} {t(L.docCount, locale)}
                  </span>
                </div>
                {section.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(section.description, locale)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {section.docs.map((doc) => {
                  const isMaster = doc.slug === "readme";
                  return (
                    <Link
                      key={doc.slug}
                      href={isMaster ? "/docs" : `/docs/${doc.slug}`}
                      className={`
                        group rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-3
                        ${
                          isMaster
                            ? "bg-primary/[0.03] border-primary/30 hover:border-primary/60 shadow-xs"
                            : "bg-card/70 hover:bg-card hover:border-primary/40 hover:shadow-2xs"
                        }
                      `}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-muted-foreground">
                            docs/{doc.fileName}
                          </span>
                          {isMaster && (
                            <Badge className="text-[10px] px-2 py-0 bg-primary/15 text-primary border-primary/30">
                              <Sparkles className="size-2.5 mr-1" />
                              {t(L.masterDoc, locale)}
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {doc.description}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-medium text-primary pt-2">
                        <span>{t(L.readDoc, locale)}</span>
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
