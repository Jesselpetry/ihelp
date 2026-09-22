/**
 * Shared constants and types for community uploads.
 *
 * Kept out of lib/actions/upload.ts because a "use server" module may only
 * export async functions — exporting a constant from one makes Next drop every
 * export in the module.
 */

export const RESOURCE_BUCKET = "ihelp-resources";

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

/** Public bucket, so an object path resolves to a stable public URL. */
export function resourcePublicUrl(objectPath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${RESOURCE_BUCKET}/${objectPath}`;
}
