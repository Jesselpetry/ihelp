/**
 * Shared constants and types for community uploads.
 *
 * Kept out of lib/actions/upload.ts because a "use server" module may only
 * export async functions — exporting a constant from one makes Next drop every
 * export in the module.
 */

import { BUCKETS } from "@/lib/storage/buckets";
import { publicObjectUrl } from "@/lib/storage/public-url";

export const RESOURCE_BUCKET = BUCKETS.resources;

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "pptx",
] as const;

export type UploadState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Public bucket, so an object path resolves to a stable public URL. Without a
 * configured Supabase URL there is no file to link to, so the link is "#".
 */
export function resourcePublicUrl(objectPath: string): string {
  return publicObjectUrl("resources", objectPath) ?? "#";
}
