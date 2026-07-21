"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { GithubIcon } from "@/components/social-icons";
import { PushToGithubButton } from "@/components/github/push-to-github";
import { PushTargetPreview } from "@/components/github/push-target-preview";
import {
  useGithub,
  listRepos,
  saveLinkedRepo,
  type FileKind,
  type LinkedRepo,
} from "@/lib/github";
import { useLocale, t } from "@/lib/i18n";

const GH_BTN =
  "border-transparent bg-[#1f2328] text-white hover:bg-[#1f2328]/90 hover:text-white dark:bg-[#2d333b] dark:hover:bg-[#373e47]";

const L = {
  authorize: { th: "เชื่อมต่อ GitHub เพื่อ push", en: "Authorize with GitHub to push" },
  authHint: {
    th: "เชื่อมบัญชี GitHub เพื่อ push ไฟล์นี้เข้า repo ของคุณได้โดยตรง",
    en: "Connect your GitHub account to push this file straight to your repo.",
  },
  selectRepo: { th: "เลือก repository", en: "Select repository" },
  modalTitle: { th: "เลือก repository ปลายทาง", en: "Select target repository" },
  modalDesc: {
    th: "เลือก repository ที่จะ push ไฟล์เข้าไป แล้วกดยืนยันเพื่อไปต่อ",
    en: "Choose the repository to push files into, then confirm to continue.",
  },
  pickPlaceholder: { th: "เลือก repository...", en: "Pick a repository..." },
  confirm: { th: "ยืนยันเพื่อไปต่อ", en: "Confirm to continue" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  loading: { th: "กำลังโหลด repo...", en: "Loading repos..." },
  loadError: { th: "โหลด repo ไม่สำเร็จ", en: "Failed to load repositories" },
};

function repoKey(r: LinkedRepo) {
  return `${r.owner}/${r.repo}`;
}

// Self-contained GitHub push flow for the wizards:
//  - not connected  -> "Authorize with GitHub" (returns to this page)
//  - no repo linked -> auto-popup a modal to pick a repo + confirm
//  - ready          -> push button (GitHub color) above the target-file preview
export function GithubPushSection({
  problemId,
  kind,
  markdown,
  disabled,
}: {
  problemId: string;
  kind: FileKind;
  markdown: string;
  disabled?: boolean;
}) {
  const { locale } = useLocale();
  const gh = useGithub();

  const [repoModal, setRepoModal] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [repos, setRepos] = useState<LinkedRepo[] | null>(null);
  const [reposError, setReposError] = useState("");
  const [picked, setPicked] = useState("");
  const [saving, setSaving] = useState(false);

  // Auto-open the repo picker once, right after the user connects with no repo.
  useEffect(() => {
    if (gh.hydrated && gh.connected && !gh.repo && !autoOpened) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time popup once connected without a repo
      setRepoModal(true);
      setAutoOpened(true);
    }
  }, [gh.hydrated, gh.connected, gh.repo, autoOpened]);

  // Load the repo list whenever the picker opens.
  useEffect(() => {
    if (!repoModal) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- entering the async repo fetch; reset before it resolves
    setRepos(null);
    setReposError("");
    listRepos()
      .then((r) => !cancelled && setRepos(r))
      .catch(() => !cancelled && setReposError(t(L.loadError, locale)));
    return () => {
      cancelled = true;
    };
  }, [repoModal, locale]);

  function authorize() {
    const returnTo = window.location.pathname + window.location.search;
    window.location.href = `/api/github/login?returnTo=${encodeURIComponent(returnTo)}`;
  }

  async function confirmRepo() {
    const found = repos?.find((r) => repoKey(r) === picked);
    if (!found) return;
    setSaving(true);
    await saveLinkedRepo(found);
    setSaving(false);
    setRepoModal(false);
    gh.refresh();
  }

  if (!gh.hydrated) return null;

  return (
    <>
      {!gh.connected ? (
        <div className="space-y-2">
          <Button type="button" onClick={authorize} className={"w-full " + GH_BTN}>
            <GithubIcon className="size-4" />
            {t(L.authorize, locale)}
          </Button>
          <p className="text-xs text-muted-foreground">{t(L.authHint, locale)}</p>
        </div>
      ) : !gh.repo ? (
        <Button type="button" onClick={() => setRepoModal(true)} className={"w-full " + GH_BTN}>
          <GithubIcon className="size-4" />
          {t(L.selectRepo, locale)}
        </Button>
      ) : (
        <>
          <PushToGithubButton
            problemId={problemId}
            kind={kind}
            markdown={markdown}
            connected={gh.connected}
            repo={gh.repo}
            disabled={disabled}
            onPushed={gh.refreshStatus}
            className="w-full [&>button]:w-full"
          />
          <PushTargetPreview problemId={problemId} kind={kind} />
        </>
      )}

      <Dialog open={repoModal} onOpenChange={(o) => !saving && setRepoModal(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(L.modalTitle, locale)}</DialogTitle>
            <DialogDescription>{t(L.modalDesc, locale)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {repos === null ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                {t(L.loading, locale)}
              </div>
            ) : reposError ? (
              <p className="text-xs text-destructive">{reposError}</p>
            ) : (
              <Select value={picked} onValueChange={setPicked}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t(L.pickPlaceholder, locale)} />
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
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setRepoModal(false)} disabled={saving}>
                {t(L.cancel, locale)}
              </Button>
              <Button onClick={confirmRepo} disabled={saving || !picked} className={GH_BTN}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <GithubIcon className="size-4" />}
                {t(L.confirm, locale)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
