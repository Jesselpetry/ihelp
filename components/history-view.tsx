"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloadMarkdown } from "@/lib/draft";
import { MarkdownPreview } from "@/components/md-preview";
import {
  loadHistory,
  deleteHistoryEntry,
  updateHistoryEntry,
  clearHistory,
  type HistoryEntry,
  type HistoryKind,
} from "@/lib/history";
import { useLocale, t } from "@/lib/i18n";

const L = {
  title: { th: "ประวัติไฟล์ที่สร้าง", en: "Generated files history" },
  subtitle: {
    th: "ทุกไฟล์ที่คุณสร้าง (preview หรือดาวน์โหลด) ถูกบันทึกในเครื่องของคุณ ไม่ถูกส่งไปที่ใด",
    en: "Every file you generate (preview or download) is saved in this browser only — nothing is uploaded.",
  },
  empty: {
    th: "ยังไม่มีประวัติ — สร้างไฟล์แรกจากหน้ารายการโจทย์",
    en: "No history yet — generate your first file from the problems page.",
  },
  backToList: { th: "กลับหน้ารายการโจทย์", en: "Back to problems" },
  all: { th: "ทั้งหมด", en: "All" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  delete: { th: "ลบ", en: "Delete" },
  clearAll: { th: "ล้างประวัติทั้งหมด", en: "Clear all history" },
  confirmDelete: { th: "ลบรายการนี้?", en: "Delete this entry?" },
  confirmClear: { th: "ล้างประวัติทั้งหมด?", en: "Clear all history?" },
  showFile: { th: "ดูเนื้อหาไฟล์", en: "Show file content" },
  hideFile: { th: "ซ่อนเนื้อหาไฟล์", en: "Hide file content" },
  entries: { th: "รายการ", en: "entries" },
  edit: { th: "แก้ไข", en: "Edit" },
  save: { th: "บันทึก", en: "Save" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  editHint: {
    th: "แก้ไขเนื้อหาไฟล์ .md ได้โดยตรง แล้วกดบันทึก การเปลี่ยนแปลงถูกเก็บในเครื่องของคุณเท่านั้น",
    en: "Edit the .md content directly, then Save. Changes are kept in this browser only.",
  },
};

const KIND_LABEL: Record<HistoryKind, string> = {
  submission: "submission.md",
  reflection: "ai_reflection.md",
};

function formatDate(ts: number, locale: "th" | "en"): string {
  return new Date(ts).toLocaleString(locale === "th" ? "th-TH" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function EntryCard({
  entry,
  onDelete,
  onSave,
}: {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
  onSave: (id: string, markdown: string) => void;
}) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.markdown);
  return (
    <div className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={entry.kind === "submission" ? "default" : "secondary"}>
          {KIND_LABEL[entry.kind]}
        </Badge>
        <Badge variant="outline">{entry.fileLocale.toUpperCase()}</Badge>
        <span className="font-medium text-sm">{entry.ojTitle || entry.problemId}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDate(entry.createdAt, locale)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => downloadMarkdown(entry.fileName, entry.markdown)}
        >
          <Download className="size-3.5" />
          {t(L.download, locale)}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setOpen((o) => !o)}
          disabled={editing}
        >
          {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          {t(open ? L.hideFile : L.showFile, locale)}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => {
            setText(entry.markdown);
            setEditing(true);
            setOpen(true);
          }}
          disabled={editing}
        >
          <Pencil className="size-3.5" />
          {t(L.edit, locale)}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive ml-auto"
          onClick={() => {
            if (window.confirm(t(L.confirmDelete, locale))) onDelete(entry.id);
          }}
        >
          <Trash2 className="size-3.5" />
          {t(L.delete, locale)}
        </Button>
      </div>
      {editing ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t(L.editHint, locale)}</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onSave(entry.id, text);
                setEditing(false);
              }}
            >
              {t(L.save, locale)}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => {
                setText(entry.markdown);
                setEditing(false);
              }}
            >
              {t(L.cancel, locale)}
            </Button>
          </div>
        </div>
      ) : (
        open && <MarkdownPreview markdown={entry.markdown} />
      )}
    </div>
  );
}

export function HistoryView() {
  const { locale } = useLocale();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<HistoryKind | "all">("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
    setEntries(loadHistory());
    setHydrated(true);
  }, []);

  const shown = entries.filter((e) => filter === "all" || e.kind === filter);

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
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "submission", "reflection"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
              (filter === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground")
            }
          >
            {k === "all" ? t(L.all, locale) : KIND_LABEL[k]}
          </button>
        ))}
        <span className="text-xs text-muted-foreground">
          {shown.length} {t(L.entries, locale)}
        </span>
        {entries.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive ml-auto"
            onClick={() => {
              if (window.confirm(t(L.confirmClear, locale))) {
                clearHistory();
                setEntries([]);
              }
            }}
          >
            <Trash2 className="size-3.5" />
            {t(L.clearAll, locale)}
          </Button>
        )}
      </div>

      {hydrated && shown.length === 0 && (
        <p className="text-sm text-muted-foreground rounded-xl border border-dashed p-8 text-center">
          {t(L.empty, locale)}
        </p>
      )}

      <div className="space-y-3">
        {shown.map((e) => (
          <EntryCard
            key={e.id}
            entry={e}
            onDelete={(id) => {
              deleteHistoryEntry(id);
              setEntries((prev) => prev.filter((x) => x.id !== id));
            }}
            onSave={(id, markdown) => {
              updateHistoryEntry(id, markdown);
              setEntries((prev) =>
                prev.map((x) => (x.id === id ? { ...x, markdown } : x)),
              );
            }}
          />
        ))}
      </div>
    </main>
  );
}
