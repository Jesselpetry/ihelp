// Server-only helpers for the GitHub integration. The OAuth access token is
// kept in an httpOnly cookie (never exposed to page JS); every GitHub REST
// call is proxied through the route handlers in app/api/github/* using it.

import { cookies } from "next/headers";

export const TOKEN_COOKIE = "gh_token";
export const USER_COOKIE = "gh_user"; // non-httpOnly: { login, avatar } for UI
export const REPO_COOKIE = "gh_repo"; // non-httpOnly: { owner, repo, branch }
export const STATE_COOKIE = "gh_oauth_state";
export const RETURN_COOKIE = "gh_return"; // where to send the user after OAuth

export const OAUTH_SCOPE = "public_repo";

// Non-sensitive UI identity carried in the readable gh_user cookie.
export interface GithubUser {
  login: string;
  avatar: string;
}

export function clientId(): string {
  const id = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!id) throw new Error("GITHUB_OAUTH_CLIENT_ID is not configured");
  return id;
}

export function clientSecret(): string {
  const secret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!secret) throw new Error("GITHUB_OAUTH_CLIENT_SECRET is not configured");
  return secret;
}

// Base URL used to build the OAuth redirect_uri. Prefer the explicitly
// configured app URL (must match the callback registered on the OAuth app);
// fall back to the incoming request's own origin for local/dev.
export function appBaseUrl(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");
  return new URL(req.url).origin;
}

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

// Thin wrapper over the GitHub REST API using the stored token.
export async function githubFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getToken();
  if (!token) throw new UnauthenticatedError();
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
}

export class UnauthenticatedError extends Error {
  constructor() {
    super("Not connected to GitHub");
    this.name = "UnauthenticatedError";
  }
}
