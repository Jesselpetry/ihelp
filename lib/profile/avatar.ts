import type { User } from "@/db";
import { BUCKETS } from "@/lib/storage/buckets";
import { publicObjectUrl } from "@/lib/storage/public-url";

export const AVATAR_BUCKET = BUCKETS.avatars;

/** Square edge the cropper exports at. Large enough for a retina 96px avatar. */
export const AVATAR_SIZE = 512;

/** WebP at this quality keeps a 512px portrait comfortably under 100 KB. */
export const AVATAR_QUALITY = 0.85;

/** Guard against someone selecting a 40 MP camera original. */
export const MAX_AVATAR_INPUT_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/**
 * Which picture to show, in order: one they uploaded, then their Google
 * account picture, then nothing (the caller renders initials).
 *
 * `avatarUrl` holds a bucket object path, `googleAvatarUrl` an absolute URL,
 * so the two are not interchangeable - always resolve through here. Without a
 * configured Supabase URL an uploaded path cannot be turned into an address,
 * so it falls through to the Google picture like any other missing upload.
 */
export function resolveAvatarUrl(
  user: Pick<User, "avatarUrl" | "googleAvatarUrl">,
): string | null {
  const uploaded = user.avatarUrl
    ? publicObjectUrl("avatars", user.avatarUrl)
    : null;
  return uploaded ?? user.googleAvatarUrl ?? null;
}

/** Initials shown while an image loads, or when there is no picture at all. */
export function avatarInitial(
  user: Pick<User, "nickname" | "firstName" | "studentId">,
): string {
  return (user.nickname ?? user.firstName ?? user.studentId ?? "?")
    .charAt(0)
    .toUpperCase();
}
