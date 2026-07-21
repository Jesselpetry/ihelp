"use client";

import { useState } from "react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/social-icons";
import { pushFile, type FileKind, type LinkedRepo } from "@/lib/github";
import { useLocale, t } from "@/lib/i18n";

const L = {
  push: { th: "Push ขึ้น GitHub", en: "Push to GitHub" },
  pushing: { th: "กำลัง push...", en: "Pushing..." },
  pushed: { th: "Push แล้ว", en: "Pushed" },
  connectFirst: { th: "เชื่อม GitHub ก่อน", en: "Connect GitHub first" },
  noRepo: { th: "เลือก repo ก่อน", en: "Pick a repo first" },
  view: { th: "ดูไฟล์", en: "View file" },
};

// Push a generated/edited markdown file to oj<id>/<file>.md in the linked repo.
// Parent passes the connection state (from useGithub) so many buttons on one
// page don't each re-fetch the session.
export function PushToGithubButton({
  problemId,
  kind,
  markdown,
  connected,
  repo,
  disabled,
  onPushed,
  size = "sm",
  className,
}: {
  problemId: string;
  kind: FileKind;
  markdown: string;
  connected: boolean;
  repo: LinkedRepo | null;
  disabled?: boolean;
  onPushed?: () => void;
  size?: "sm" | "default";
  className?: string;
}) {
  const { locale } = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  // Entries without an OJ problem id (e.g. "custom") can't map to oj<id>/.
  const pushable = /^\d+$/.test(problemId);
  if (!pushable) return null;

  const blocked = !connected
    ? t(L.connectFirst, locale)
    : !repo
      ? t(L.noRepo, locale)
      : "";

  async function onClick() {
    if (!repo) return;
    setBusy(true);
    setError("");
    try {
      const res = await pushFile({ repo, problemId, kind, markdown });
      setUrl(res.html_url);
      onPushed?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={"flex flex-wrap items-center gap-2 " + (className ?? "")}>
      <Button
        type="button"
        size={size}
        onClick={onClick}
        disabled={busy || disabled || Boolean(blocked)}
        title={blocked || undefined}
        className="border-transparent bg-[#1f2328] text-white hover:bg-[#1f2328]/90 hover:text-white dark:bg-[#2d333b] dark:hover:bg-[#373e47]"
      >
        {busy ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : url ? (
          <Check className="size-3.5 text-green-400" />
        ) : (
          <GithubIcon className="size-3.5" />
        )}
        {busy ? t(L.pushing, locale) : url ? t(L.pushed, locale) : t(L.push, locale)}
      </Button>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          {t(L.view, locale)}
          <ExternalLink className="size-3" />
        </a>
      )}
      {blocked && !url && (
        <span className="text-xs text-muted-foreground">{blocked}</span>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
