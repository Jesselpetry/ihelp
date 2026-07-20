"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderGit2, Loader2, Plug, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GithubIcon } from "@/components/social-icons";
import {
  listRepos,
  logout,
  saveLinkedRepo,
  clearLinkedRepo,
  type LinkedRepo,
} from "@/lib/github";
import { useLocale, t } from "@/lib/i18n";

const L = {
  title: { th: "ซิงก์กับ GitHub repo", en: "Sync with a GitHub repo" },
  desc: {
    th: "เชื่อมบัญชี GitHub เพื่อ push submission.md / ai_reflection.md เข้า repo ของคุณที่ oj<id>/ ได้โดยตรง",
    en: "Connect GitHub to push submission.md / ai_reflection.md straight into your repo under oj<id>/",
  },
  connect: { th: "เชื่อมต่อ GitHub", en: "Sign in with GitHub" },
  connectedAs: { th: "เชื่อมต่อในชื่อ", en: "Connected as" },
  repoLabel: { th: "Repository ปลายทาง", en: "Target repository" },
  pickRepo: { th: "เลือก repository...", en: "Pick a repository..." },
  change: { th: "เปลี่ยน repo", en: "Change repo" },
  browse: { th: "เปิดไฟล์ใน repo", en: "Browse repo files" },
  disconnect: { th: "ตัดการเชื่อมต่อ", en: "Disconnect" },
  loading: { th: "กำลังโหลด repo...", en: "Loading repos..." },
  loadError: { th: "โหลด repo ไม่สำเร็จ", en: "Failed to load repositories" },
  linked: { th: "กำลัง push ไปที่", en: "Pushing to" },
  errorHint: {
    th: "เชื่อม GitHub ไม่สำเร็จ ลองใหม่อีกครั้ง",
    en: "GitHub connection failed — please try again.",
  },
};

function repoKey(r: LinkedRepo) {
  return `${r.owner}/${r.repo}`;
}

// Connect panel: sign in, pick the destination repo, disconnect. Consumes the
// shared useGithub state via props so the parent owns a single session fetch.
export function GithubConnect({
  connected,
  user,
  repo,
  hydrated,
  onChanged,
}: {
  connected: boolean;
  user: { login: string; avatar: string } | null;
  repo: LinkedRepo | null;
  hydrated: boolean;
  onChanged: () => void;
}) {
  const { locale } = useLocale();
  const [repos, setRepos] = useState<LinkedRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState("");
  const [picking, setPicking] = useState(false);
  const [oauthError, setOauthError] = useState(false);

  // Surface ?github=error from the OAuth callback redirect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the OAuth callback result from the URL after mount
    if (params.get("github") === "error") setOauthError(true);
  }, []);

  const showPicker = connected && (!repo || picking);

  useEffect(() => {
    if (!showPicker) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- entering the async repo fetch; loading flag is intentional
    setLoadingRepos(true);
    setReposError("");
    listRepos()
      .then((r) => !cancelled && setRepos(r))
      .catch(() => !cancelled && setReposError(t(L.loadError, locale)))
      .finally(() => !cancelled && setLoadingRepos(false));
    return () => {
      cancelled = true;
    };
  }, [showPicker, locale]);

  async function selectRepo(key: string) {
    const found = repos.find((r) => repoKey(r) === key);
    if (!found) return;
    await saveLinkedRepo(found);
    setPicking(false);
    onChanged();
  }

  async function onDisconnect() {
    await logout();
    await clearLinkedRepo();
    onChanged();
  }

  return (
    <section className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
      <div className="flex items-start gap-3">
        <GithubIcon className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0">
          <h2 className="font-semibold text-sm">{t(L.title, locale)}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t(L.desc, locale)}</p>
        </div>
      </div>

      {oauthError && (
        <p className="text-xs text-destructive">{t(L.errorHint, locale)}</p>
      )}

      {!hydrated ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
        </div>
      ) : !connected ? (
        <Button asChild size="sm">
          <a href="/api/github/login">
            <GithubIcon className="size-4" />
            {t(L.connect, locale)}
          </a>
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {user?.avatar && (
              // eslint-disable-next-line @next/next/no-img-element -- external GitHub avatar, no optimization needed
              <img src={user.avatar} alt="" className="size-6 rounded-full" />
            )}
            <span className="text-muted-foreground text-xs">
              {t(L.connectedAs, locale)}
            </span>
            <span className="font-medium">{user?.login}</span>
          </div>

          {showPicker ? (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                {t(L.repoLabel, locale)}
              </label>
              {loadingRepos ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  {t(L.loading, locale)}
                </div>
              ) : reposError ? (
                <p className="text-xs text-destructive">{reposError}</p>
              ) : (
                <Select
                  value={repo ? repoKey(repo) : undefined}
                  onValueChange={selectRepo}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t(L.pickRepo, locale)} />
                  </SelectTrigger>
                  <SelectContent>
                    {repos.map((r) => (
                      <SelectItem key={repoKey(r)} value={repoKey(r)}>
                        {repoKey(r)}
                        {r.branch ? ` (${r.branch})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            repo && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xs text-muted-foreground">
                  {t(L.linked, locale)}
                </span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  {repoKey(repo)}
                  <span className="text-muted-foreground"> · {repo.branch}</span>
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => setPicking(true)}
                >
                  <Plug className="size-3.5" />
                  {t(L.change, locale)}
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/repo">
                    <FolderGit2 className="size-3.5" />
                    {t(L.browse, locale)}
                  </Link>
                </Button>
              </div>
            )
          )}

          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={onDisconnect}
          >
            <Unplug className="size-3.5" />
            {t(L.disconnect, locale)}
          </Button>
        </div>
      )}
    </section>
  );
}
