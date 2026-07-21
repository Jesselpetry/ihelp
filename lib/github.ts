"use client";

// Client-side GitHub integration state + helpers. The OAuth token lives in an
// httpOnly cookie handled by app/api/github/* — this file only keeps the
// non-sensitive "which repo am I pushing to" config in localStorage (mirroring
// the pattern in lib/history.ts) and wraps the proxy routes.

import { useCallback, useEffect, useState } from "react";

export type FileKind = "submission" | "reflection";

export interface LinkedRepo {
  owner: string;
  repo: string;
  branch: string;
}

export interface GithubUser {
  login: string;
  avatar: string;
}

export interface RepoStatus {
  [problemId: string]: { submission: boolean; reflection: boolean };
}

const REPO_KEY = "ihelp-github-repo";
// Fired whenever the linked repo changes so all live UI can refresh.
export const GITHUB_EVENT = "ihelp-github-changed";

function notify() {
  window.dispatchEvent(new Event(GITHUB_EVENT));
}

export function loadLinkedRepo(): LinkedRepo | null {
  try {
    const raw = window.localStorage.getItem(REPO_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && typeof p.owner === "string" && typeof p.repo === "string") {
      return { owner: p.owner, repo: p.repo, branch: p.branch || "main" };
    }
  } catch {
    // corrupted config: ignore
  }
  return null;
}

// Persist the linked repo both in the session cookie (source of truth, set via
// the server so it survives and the server can read it) and in localStorage
// (fast fallback for the first paint before the session round-trips).
export async function saveLinkedRepo(repo: LinkedRepo): Promise<void> {
  window.localStorage.setItem(REPO_KEY, JSON.stringify(repo));
  await fetch("/api/github/repo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(repo),
  });
  notify();
}

export async function clearLinkedRepo(): Promise<void> {
  window.localStorage.removeItem(REPO_KEY);
  await fetch("/api/github/repo", { method: "DELETE" });
  notify();
}

export async function getSession(): Promise<{
  connected: boolean;
  user: GithubUser | null;
  repo: LinkedRepo | null;
}> {
  const res = await fetch("/api/github/session", { cache: "no-store" });
  if (!res.ok) return { connected: false, user: null, repo: null };
  return res.json();
}

export async function listRepos(): Promise<LinkedRepo[]> {
  const res = await fetch("/api/github/repos", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to list repositories");
  return data.repos;
}

export async function logout(): Promise<void> {
  await fetch("/api/github/logout", { method: "POST" });
}

export async function getRepoStatus(repo: LinkedRepo): Promise<RepoStatus> {
  const params = new URLSearchParams({
    owner: repo.owner,
    repo: repo.repo,
    branch: repo.branch,
  });
  const res = await fetch(`/api/github/status?${params}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load repo status");
  return data.status;
}

export interface RepoFile {
  path: string;
  size: number;
}

export interface FileContent {
  path: string;
  sha: string;
  size: number;
  isBinary: boolean;
  content: string | null;
  download_url: string | null;
}

export async function listFiles(repo: LinkedRepo): Promise<RepoFile[]> {
  const params = new URLSearchParams({
    owner: repo.owner,
    repo: repo.repo,
    branch: repo.branch,
  });
  const res = await fetch(`/api/github/files?${params}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to list files");
  return data.files;
}

export async function getFile(repo: LinkedRepo, path: string): Promise<FileContent> {
  const params = new URLSearchParams({
    owner: repo.owner,
    repo: repo.repo,
    branch: repo.branch,
    path,
  });
  const res = await fetch(`/api/github/file?${params}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to read file");
  return data;
}

export async function commitFile(args: {
  repo: LinkedRepo;
  path: string;
  content: string;
  message?: string;
  sha?: string;
}): Promise<{ path: string; sha: string | null; html_url: string | null; commit: string | null }> {
  const res = await fetch("/api/github/commit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: args.repo.owner,
      repo: args.repo.repo,
      branch: args.repo.branch,
      path: args.path,
      content: args.content,
      message: args.message,
      sha: args.sha,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Commit failed");
  return data;
}

export interface PushResult {
  path: string;
  html_url: string | null;
  commit: string | null;
}

export async function pushFile(args: {
  repo: LinkedRepo;
  problemId: string;
  kind: FileKind;
  markdown: string;
}): Promise<PushResult> {
  const res = await fetch("/api/github/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: args.repo.owner,
      repo: args.repo.repo,
      branch: args.repo.branch,
      problemId: args.problemId,
      kind: args.kind,
      markdown: args.markdown,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Push failed");
  return data;
}

// Shared hook: connection state, linked repo, and the repo's upload status.
export function useGithub() {
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repo, setRepo] = useState<LinkedRepo | null>(null);
  const [status, setStatus] = useState<RepoStatus>({});
  const [hydrated, setHydrated] = useState(false);

  const refreshStatus = useCallback(async (r: LinkedRepo | null) => {
    if (!r) {
      setStatus({});
      return;
    }
    try {
      setStatus(await getRepoStatus(r));
    } catch {
      setStatus({});
    }
  }, []);

  const refresh = useCallback(async () => {
    const session = await getSession();
    // Session cookie is the source of truth; fall back to localStorage for the
    // first paint, and mirror the session repo back into localStorage.
    const linked = session.repo ?? loadLinkedRepo();
    if (session.repo) {
      window.localStorage.setItem(REPO_KEY, JSON.stringify(session.repo));
    }
    setConnected(session.connected);
    setUser(session.user);
    setRepo(session.connected ? linked : null);
    setHydrated(true);
    if (session.connected) await refreshStatus(linked);
    else setStatus({});
  }, [refreshStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async session/status fetch; state updates land after await
    refresh();
    const onChange = () => refresh();
    window.addEventListener(GITHUB_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(GITHUB_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    connected,
    user,
    repo,
    status,
    hydrated,
    refresh,
    refreshStatus: () => refreshStatus(loadLinkedRepo()),
  };
}
