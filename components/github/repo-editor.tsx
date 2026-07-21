"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FilePlus2,
  FileText,
  Folder,
  FolderOpen,
  Loader2,
  RefreshCw,
  Save,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmissionFields } from "@/components/github/submission-fields";
import { ReflectionFields } from "@/components/github/reflection-fields";
import {
  useGithub,
  listFiles,
  getFile,
  commitFile,
  type RepoFile,
  type FileContent,
  type LinkedRepo,
} from "@/lib/github";
import { parseSubmissionMd, parseReflectionMd } from "@/lib/md-parse";
import { basename, dirname, buildTree, type TreeNode } from "@/lib/repo-tree";
import {
  emptySubmissionDraft,
  emptyReflectionDraft,
  submissionFieldsFromDraft,
  reflectionFieldsFromDraft,
  type SubmissionDraft,
  type ReflectionDraft,
} from "@/lib/wizard-fields";
import { useLocale, t } from "@/lib/i18n";

type Kind = "submission" | "reflection";

const L = {
  back: { th: "กลับหน้ารายการโจทย์", en: "Back to problems" },
  title: { th: "ไฟล์ใน repo", en: "Repo files" },
  notConnected: {
    th: "ยังไม่ได้เชื่อม GitHub หรือยังไม่ได้เลือก repo — กลับไปหน้าแรกเพื่อเชื่อมต่อ",
    en: "Not connected to GitHub or no repo selected — go to the home page to connect.",
  },
  files: { th: "ไฟล์ทั้งหมด", en: "All files" },
  viewFlat: { th: "รายการ", en: "Files" },
  viewTree: { th: "โฟลเดอร์", en: "Folders" },
  newFile: { th: "ไฟล์ใหม่", en: "New file" },
  refresh: { th: "รีเฟรช", en: "Refresh" },
  empty: { th: "ไม่มีไฟล์ใน repo นี้", en: "No files in this repo" },
  pickFile: { th: "เลือกไฟล์จากด้านซ้ายเพื่อแก้ไข", en: "Select a file on the left to edit" },
  raw: { th: "Raw", en: "Raw" },
  steps: { th: "ทีละขั้นตอน", en: "Step-by-step" },
  save: { th: "บันทึก (commit)", en: "Save (commit)" },
  commitTitle: { th: "commit ไฟล์ขึ้น GitHub", en: "Commit file to GitHub" },
  commitDesc: {
    th: "ตั้งข้อความ commit แล้วกดยืนยันเพื่อบันทึกขึ้น repo",
    en: "Set a commit message, then confirm to save it to the repo.",
  },
  commitLabel: { th: "ข้อความ commit", en: "Commit message" },
  confirmCommit: { th: "ยืนยัน commit", en: "Commit" },
  saving: { th: "กำลังบันทึก...", en: "Saving..." },
  saved: { th: "บันทึกแล้ว", en: "Saved" },
  view: { th: "ดูบน GitHub", en: "View on GitHub" },
  binary: {
    th: "ไฟล์นี้เป็นไฟล์ไบนารี แก้ไขในเว็บนี้ไม่ได้",
    en: "This is a binary file and can't be edited here.",
  },
  noTemplate: {
    th: "ไฟล์นี้ไม่ตรงกับ template ทางการ จึงแก้แบบทีละขั้นตอนไม่ได้ — แก้ในโหมด Raw ได้",
    en: "This file doesn't match the official template, so step-by-step is unavailable — edit it in Raw.",
  },
  loading: { th: "กำลังโหลด...", en: "Loading..." },
  unsaved: {
    th: "มีการแก้ไขที่ยังไม่ได้บันทึก จะทิ้งการแก้ไขนี้หรือไม่?",
    en: "You have unsaved changes. Discard them?",
  },
  newOjId: { th: "เลข OJ (เช่น 213)", en: "OJ id (e.g. 213)" },
  create: { th: "สร้าง", en: "Create" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  newTitle: { th: "สร้างไฟล์ใหม่", en: "Create a new file" },
  newTypeLabel: { th: "ชนิดไฟล์", en: "File type" },
  textFile: { th: "ไฟล์ข้อความ (.txt)", en: "Text file (.txt)" },
  newPathLabel: { th: "ตำแหน่ง/ชื่อไฟล์", en: "File path / name" },
  newPathPlaceholder: { th: "เช่น notes.txt หรือ oj213/notes.txt", en: "e.g. notes.txt or oj213/notes.txt" },
};

function fileKind(path: string): Kind | null {
  const b = basename(path);
  if (b === "submission.md") return "submission";
  if (b === "ai_reflection.md") return "reflection";
  return null;
}

export function RepoEditor() {
  const { locale } = useLocale();
  const gh = useGithub();
  const repo = gh.repo;

  const [files, setFiles] = useState<RepoFile[] | null>(null);
  const [filesError, setFilesError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"flat" | "tree">("tree");
  // folders collapsed by the user; empty = everything expanded
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const tree = useMemo(() => (files ? buildTree(files) : []), [files]);

  const [file, setFile] = useState<FileContent | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const [mode, setMode] = useState<"raw" | "steps">("raw");
  const [rawText, setRawText] = useState("");
  const [draft, setDraft] = useState<SubmissionDraft | ReflectionDraft | null>(null);
  const [draftKind, setDraftKind] = useState<Kind | null>(null);
  const [parseFailed, setParseFailed] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [commitOpen, setCommitOpen] = useState(false);
  const [commitMsg, setCommitMsg] = useState("");

  const [creating, setCreating] = useState(false);
  const [newId, setNewId] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newType, setNewType] = useState<Kind | "text">("submission");

  const loadFiles = useCallback(async (r: LinkedRepo) => {
    setFilesError("");
    try {
      setFiles(await listFiles(r));
    } catch (e) {
      setFilesError((e as Error).message);
      setFiles([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async repo file list fetch; state updates land after await
    if (repo) loadFiles(repo);
  }, [repo, loadFiles]);

  // Deep link: /repo?path=oj<id>/submission.md opens that file ready to edit.
  useEffect(() => {
    if (!repo || selected) return;
    const p = new URLSearchParams(window.location.search).get("path");
    if (p) openFile(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once the repo is ready; openFile/selected intentionally excluded
  }, [repo]);

  async function buildMarkdown(kind: Kind, d: SubmissionDraft | ReflectionDraft): Promise<string> {
    const fields =
      kind === "submission"
        ? submissionFieldsFromDraft(d as SubmissionDraft)
        : reflectionFieldsFromDraft(d as ReflectionDraft);
    const res = await fetch(`/api/generate/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: d.file_locale, fields }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "generation failed");
    return data.markdown as string;
  }

  function parseInto(kind: Kind, md: string): boolean {
    const parsed = kind === "submission" ? parseSubmissionMd(md) : parseReflectionMd(md);
    if (!parsed) return false;
    setDraft(parsed);
    setDraftKind(kind);
    return true;
  }

  async function openFile(path: string) {
    if (dirty && !window.confirm(t(L.unsaved, locale))) return;
    if (!repo) return;
    setSelected(path);
    setFileLoading(true);
    setFileError("");
    setSaveError("");
    setSavedUrl(null);
    setDirty(false);
    setIsNew(false);
    setParseFailed(false);
    setDraft(null);
    setDraftKind(null);
    try {
      const f = await getFile(repo, path);
      setFile(f);
      setRawText(f.content ?? "");
      const kind = fileKind(path);
      if (!f.isBinary && kind && parseInto(kind, f.content ?? "")) {
        setMode("steps");
      } else {
        setMode("raw");
        setParseFailed(Boolean(kind) && !f.isBinary);
      }
    } catch (e) {
      setFileError((e as Error).message);
      setFile(null);
    } finally {
      setFileLoading(false);
    }
  }

  async function switchMode(next: "raw" | "steps") {
    if (next === mode) return;
    const kind = fileKind(selected ?? "");
    if (next === "raw") {
      // steps -> raw: regenerate the markdown from the current draft
      if (draftKind && draft) {
        try {
          setRawText(await buildMarkdown(draftKind, draft));
        } catch (e) {
          setSaveError((e as Error).message);
          return;
        }
      }
      setMode("raw");
    } else {
      // raw -> steps: re-parse; fall back with a notice on failure
      if (kind && parseInto(kind, rawText)) {
        setParseFailed(false);
        setMode("steps");
      } else {
        setParseFailed(true);
      }
    }
  }

  const updateDraft = <T extends SubmissionDraft | ReflectionDraft>(fn: (d: T) => T) => {
    setDraft((d) => (d ? fn(d as T) : d));
    setDirty(true);
    setSavedUrl(null);
  };

  function openCommit() {
    if (!selected) return;
    setSaveError("");
    setCommitMsg(`${isNew ? "Add" : "Update"} ${selected}`);
    setCommitOpen(true);
  }

  async function save() {
    if (!repo || !selected) return;
    setSaving(true);
    setSaveError("");
    setSavedUrl(null);
    try {
      const content =
        mode === "steps" && draftKind && draft
          ? await buildMarkdown(draftKind, draft)
          : rawText;
      const res = await commitFile({
        repo,
        path: selected,
        content,
        message: commitMsg.trim() || undefined,
        sha: file?.sha || undefined,
      });
      setCommitOpen(false);
      setSavedUrl(res.html_url);
      setFile((f) => (f ? { ...f, sha: res.sha ?? f.sha } : f));
      setDirty(false);
      setIsNew(false);
      await loadFiles(repo);
      gh.refreshStatus();
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function startNew() {
    if (dirty && !window.confirm(t(L.unsaved, locale))) return;
    setNewId("");
    setNewPath("");
    setNewType("submission");
    setCreating(true);
  }

  function finishNew(path: string, kind: Kind | null) {
    setCreating(false);
    setSelected(path);
    setFile({ path, sha: "", size: 0, isBinary: false, content: "", download_url: null });
    setRawText("");
    if (kind) {
      setDraft(kind === "submission" ? emptySubmissionDraft("") : emptyReflectionDraft(""));
      setDraftKind(kind);
      setMode("steps");
    } else {
      setDraft(null);
      setDraftKind(null);
      setMode("raw");
    }
    setParseFailed(false);
    setIsNew(true);
    setDirty(true);
    setSavedUrl(null);
    setSaveError("");
  }

  const newFileValid =
    newType === "text" ? newPath.trim().length > 0 : /^\d+$/.test(newId.trim());

  function confirmNew() {
    if (newType === "text") {
      let path = newPath.trim().replace(/^\/+/, "");
      if (!path) return;
      if (!/\.[^/]+$/.test(path)) path += ".txt"; // default extension
      finishNew(path, null);
      return;
    }
    if (!/^\d+$/.test(newId.trim())) return;
    const fname = newType === "submission" ? "submission.md" : "ai_reflection.md";
    finishNew(`oj${newId.trim()}/${fname}`, newType);
  }

  function toggleCollapse(path: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function renderTree(nodes: TreeNode[], depth: number) {
    return nodes.map((node) => {
      const indent = { paddingLeft: `${depth * 12 + 8}px` };
      if (node.isFile) {
        const known = fileKind(node.path);
        const active = node.path === selected;
        return (
          <li key={node.path}>
            <button
              type="button"
              onClick={() => openFile(node.path)}
              title={node.path}
              style={indent}
              className={
                "w-full text-left rounded-md pr-2 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors " +
                (active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <FileText className={"size-3.5 shrink-0 " + (known ? "text-primary" : "")} />
              <span className="truncate font-medium text-foreground/90">{node.name}</span>
            </button>
          </li>
        );
      }
      const open = !collapsed.has(node.path);
      return (
        <li key={node.path}>
          <button
            type="button"
            onClick={() => toggleCollapse(node.path)}
            style={indent}
            className="w-full text-left rounded-md pr-2 py-1.5 text-xs font-mono flex items-center gap-1 text-foreground/80 hover:bg-muted transition-colors"
          >
            {open ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0" />}
            {open ? <FolderOpen className="size-3.5 shrink-0 text-primary/70" /> : <Folder className="size-3.5 shrink-0 text-primary/70" />}
            <span className="truncate font-semibold">{node.name}</span>
          </button>
          {open && <ul className="space-y-0.5">{renderTree(node.children, depth + 1)}</ul>}
        </li>
      );
    });
  }

  if (gh.hydrated && (!gh.connected || !repo)) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" />
          {t(L.back, locale)}
        </Link>
        <p className="mt-6 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t(L.notConnected, locale)}
        </p>
      </main>
    );
  }

  const kindOfSelected = fileKind(selected ?? "");

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" />
            {t(L.back, locale)}
          </Link>
          <h1 className="text-2xl font-bold mt-1">{t(L.title, locale)}</h1>
          {repo && (
            <code className="text-xs font-mono text-muted-foreground">
              {repo.owner}/{repo.repo} · {repo.branch}
            </code>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* file list */}
        <aside className="rounded-xl border bg-card shadow-sm p-3 h-fit lg:sticky lg:top-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-auto">
              {t(L.files, locale)}
            </span>
            <Button size="icon-sm" variant="ghost" onClick={() => repo && loadFiles(repo)} title={t(L.refresh, locale)}>
              <RefreshCw className="size-3.5" />
            </Button>
            <Button size="sm" variant="outline" onClick={startNew}>
              <FilePlus2 className="size-3.5" />
              {t(L.newFile, locale)}
            </Button>
          </div>

          {/* view tabs: flat list vs folder tree */}
          <div className="mb-2 flex rounded-lg border overflow-hidden text-xs font-semibold">
            {(["tree", "flat"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={
                  "flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 transition-colors " +
                  (view === v ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")
                }
              >
                {v === "tree" ? <Folder className="size-3.5" /> : <FileText className="size-3.5" />}
                {t(v === "tree" ? L.viewTree : L.viewFlat, locale)}
              </button>
            ))}
          </div>

          {files === null ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="size-3.5 animate-spin" />
              {t(L.loading, locale)}
            </div>
          ) : filesError ? (
            <p className="text-xs text-destructive p-2">{filesError}</p>
          ) : files.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2">{t(L.empty, locale)}</p>
          ) : view === "tree" ? (
            <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto">{renderTree(tree, 0)}</ul>
          ) : (
            <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto">
              {[...files]
                .sort((a, b) => a.path.localeCompare(b.path))
                .map((f) => {
                  const known = fileKind(f.path);
                  const active = f.path === selected;
                  const dir = dirname(f.path);
                  return (
                    <li key={f.path}>
                      <button
                        type="button"
                        onClick={() => openFile(f.path)}
                        title={f.path}
                        className={
                          "w-full text-left rounded-md px-2 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors " +
                          (active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground")
                        }
                      >
                        <FileText className={"size-3.5 shrink-0 " + (known ? "text-primary" : "")} />
                        <span className="truncate">
                          {dir && <span className="text-muted-foreground/60">{dir}/</span>}
                          <span className="font-medium text-foreground/90">{basename(f.path)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          )}
        </aside>

        {/* editor */}
        <section className="rounded-xl border bg-card shadow-sm p-4 min-h-[50vh]">
          {!selected ? (
            <p className="text-sm text-muted-foreground p-8 text-center">{t(L.pickFile, locale)}</p>
          ) : fileLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-8">
              <Loader2 className="size-4 animate-spin" />
              {t(L.loading, locale)}
            </div>
          ) : fileError ? (
            <p className="text-sm text-destructive p-4">{fileError}</p>
          ) : file?.isBinary ? (
            <div className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <TriangleAlert className="size-4" />
                {t(L.binary, locale)}
              </p>
              {file.download_url && (
                <a href={file.download_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  {t(L.view, locale)}
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <code className="text-sm font-mono font-medium mr-auto">{selected}</code>
                {/* mode tabs — steps only for the two known md types */}
                <div className="flex rounded-full border overflow-hidden text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => switchMode("raw")}
                    className={"px-3 py-1.5 transition-colors " + (mode === "raw" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}
                  >
                    {t(L.raw, locale)}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("steps")}
                    disabled={!kindOfSelected}
                    className={
                      "px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed " +
                      (mode === "steps" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")
                    }
                  >
                    {t(L.steps, locale)}
                  </button>
                </div>
              </div>

              {parseFailed && mode === "raw" && kindOfSelected && (
                <p className="text-xs rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-2.5 flex items-center gap-2">
                  <TriangleAlert className="size-3.5 shrink-0" />
                  {t(L.noTemplate, locale)}
                </p>
              )}

              {mode === "raw" ? (
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setDirty(true);
                    setSavedUrl(null);
                  }}
                  rows={22}
                  spellCheck={false}
                  className="w-full rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              ) : draftKind === "submission" ? (
                <SubmissionFields draft={draft as SubmissionDraft} update={updateDraft} />
              ) : (
                <ReflectionFields draft={draft as ReflectionDraft} update={updateDraft} />
              )}

              <div className="flex flex-wrap items-center gap-3 border-t pt-3">
                <Button onClick={openCommit} disabled={saving || (!dirty && !isNew)}>
                  <Save className="size-4" />
                  {t(L.save, locale)}
                </Button>
                {savedUrl && (
                  <a href={savedUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:underline">
                    {t(L.saved, locale)} · {t(L.view, locale)}
                    <ExternalLink className="size-3" />
                  </a>
                )}
                {saveError && <span className="text-xs text-destructive">{saveError}</span>}
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(L.newTitle, locale)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {t(L.newTypeLabel, locale)}
              </label>
              <Select value={newType} onValueChange={(v) => setNewType(v as Kind | "text")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submission">submission.md</SelectItem>
                  <SelectItem value="reflection">ai_reflection.md</SelectItem>
                  <SelectItem value="text">{t(L.textFile, locale)}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newType === "text" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {t(L.newPathLabel, locale)}
                </label>
                <Input
                  placeholder={t(L.newPathPlaceholder, locale)}
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newFileValid) confirmNew();
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {t(L.newOjId, locale)}
                </label>
                <Input
                  placeholder={t(L.newOjId, locale)}
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newFileValid) confirmNew();
                  }}
                  inputMode="numeric"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground font-mono">
                  oj{newId.trim() || "<id>"}/
                  {newType === "submission" ? "submission.md" : "ai_reflection.md"}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setCreating(false)}>
                {t(L.cancel, locale)}
              </Button>
              <Button onClick={confirmNew} disabled={!newFileValid}>
                <FilePlus2 className="size-4" />
                {t(L.create, locale)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={commitOpen} onOpenChange={(o) => !saving && setCommitOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(L.commitTitle, locale)}</DialogTitle>
            <DialogDescription>{t(L.commitDesc, locale)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selected && (
              <code className="block text-xs font-mono text-muted-foreground truncate">
                {selected}
              </code>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {t(L.commitLabel, locale)}
              </label>
              <Input
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && commitMsg.trim() && !saving) save();
                }}
                autoFocus
              />
            </div>
            {saveError && <p className="text-xs text-destructive">{saveError}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setCommitOpen(false)} disabled={saving}>
                {t(L.cancel, locale)}
              </Button>
              <Button onClick={save} disabled={saving || !commitMsg.trim()}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {saving ? t(L.saving, locale) : t(L.confirmCommit, locale)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
