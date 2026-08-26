/**
 * Bilingual text, and the one function that reads it.
 *
 * Separate from lib/i18n.tsx because that module is `"use client"` — it owns
 * the locale context — and server code needs to read an LText too: route
 * metadata is generated on the server, and calling the client `t` from there
 * fails at build time. The provider and the hook stay client-side; the data
 * shape and the accessor live here, where both halves can reach them.
 */

export type Locale = "th" | "en";

/**
 * `en` is optional: content ported from Thai-only sources (course summaries,
 * the ITF question bank) omits it and falls back to Thai rather than shipping
 * a machine translation nobody proof-read.
 */
export interface LText {
  th: string;
  en?: string;
}

export function t(text: LText, locale: Locale): string {
  return text[locale] ?? text.th;
}
