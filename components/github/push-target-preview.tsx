"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, FolderOpen, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/social-icons";
import { useGithub, listFiles, type RepoFile, type FileKind } from "@/lib/github";
import { buildTree, type TreeNode } from "@/lib/repo-tree";
import { useLocale, t } from "@/lib/i18n";

const L = {
  heading: { th: "ไฟล์นี้จะถูก push ไปที่ repo", en: "This file will be pushed to your repo" },
  willAdd: { th: "จะถูกเพิ่ม", en: "will be added" },
  willUpdate: { th: "จะถูกอัปเดต", en: "will be updated" },
  loading: { th: "กำลังโหลดไฟล์ใน repo...", en: "Loading repo files..." },
};

// Shows the linked repo's file tree (like /repo) with the file that WOULD be
// created/updated by a push highlighted and blinking, so the student sees
// exactly where oj<id>/<file>.md will land.
export function PushTargetPreview({
  problemId,
  kind,
}: {
  problemId: string;
  kind: FileKind;
}) {
  const { locale } = useLocale();
  const gh = useGithub();
  const [files, setFiles] = useState<RepoFile[] | null>(null);

  const fname = kind === "submission" ? "submission.md" : "ai_reflection.md";
  const pendingPath = `oj${problemId}/${fname}`;
  const exists =
    kind === "submission"
      ? gh.status[problemId]?.submission
      : gh.status[problemId]?.reflection;

  useEffect(() => {
    if (!gh.connected || !gh.repo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when disconnected; the primary branch is an async fetch
      setFiles(null);
      return;
    }
    let cancelled = false;
    listFiles(gh.repo)
      .then((f) => !cancelled && setFiles(f))
      .catch(() => !cancelled && setFiles([]));
    return () => {
      cancelled = true;
    };
  }, [gh.connected, gh.repo]);

  // Always include the pending file so it shows even before the first push.
  const tree = useMemo(() => {
    const list = files ? [...files] : [];
    if (!list.some((f) => f.path === pendingPath)) list.push({ path: pendingPath, size: 0 });
    return buildTree(list);
  }, [files, pendingPath]);

  if (!gh.connected || !gh.repo || !/^\d+$/.test(problemId)) return null;

  function renderNodes(nodes: TreeNode[], depth: number): React.ReactNode {
    return nodes.map((node) => {
      const indent = { paddingLeft: `${depth * 12}px` };
      if (node.isFile) {
        const isPending = node.path === pendingPath;
        return (
          <li key={node.path}>
            <div
              style={indent}
              className={
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-mono " +
                (isPending
                  ? "animate-pulse bg-primary/15 text-primary font-semibold ring-1 ring-primary/40"
                  : "text-muted-foreground")
              }
            >
              <FileText className={"size-3.5 shrink-0 " + (isPending ? "text-primary" : "")} />
              <span className="truncate">{node.name}</span>
              {isPending && (
                <span className="ml-auto shrink-0 rounded-full bg-primary/20 px-1.5 py-px text-[10px] font-semibold font-sans">
                  {t(exists ? L.willUpdate : L.willAdd, locale)}
                </span>
              )}
            </div>
          </li>
        );
      }
      return (
        <li key={node.path}>
          <div
            style={indent}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-mono font-semibold text-foreground/80"
          >
            <FolderOpen className="size-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{node.name}</span>
          </div>
          <ul>{renderNodes(node.children, depth + 1)}</ul>
        </li>
      );
    });
  }

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <GithubIcon className="size-3.5" />
        {t(L.heading, locale)}
        <code className="ml-auto font-mono text-[10px] text-muted-foreground/70">
          {gh.repo.owner}/{gh.repo.repo}
        </code>
      </div>
      {files === null ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground p-1">
          <Loader2 className="size-3.5 animate-spin" />
          {t(L.loading, locale)}
        </div>
      ) : (
        <ul className="max-h-56 overflow-y-auto">{renderNodes(tree, 0)}</ul>
      )}
    </div>
  );
}
