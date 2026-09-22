import type { LText } from "@/lib/ltext";

// Display metadata for the concept tags that `scripts/build_pscp_registry.py`
// derives from each reference solution's AST. Tag ids are produced by that
// script; keep the two in sync when adding a rule there.

export type TagFamily =
  | "control"
  | "branching"
  | "data"
  | "text"
  | "number"
  | "io"
  | "abstraction";

// Pastel badge palettes, one per family, in the same light/dark shape the
// week badges use so the two read as one system. Deliberately blue-free: on
// the PSCP Pink theme a blue chip reads as an accent from a different system.
export const FAMILY_STYLES: Record<TagFamily, string> = {
  control:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  branching:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900",
  data: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  text: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-900",
  number:
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900",
  io: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
  abstraction:
    "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-900",
};

export interface TagMeta {
  label: LText;
  family: TagFamily;
}

export const TAG_META: Record<string, TagMeta> = {
  recursion: { label: { th: "เรียกซ้ำ (Recursion)", en: "Recursion" }, family: "abstraction" },
  functions: { label: { th: "ฟังก์ชัน", en: "Functions" }, family: "abstraction" },
  "error-handling": { label: { th: "ดักข้อผิดพลาด", en: "Error Handling" }, family: "abstraction" },

  "nested-loops": { label: { th: "ลูปซ้อนลูป", en: "Nested Loops" }, family: "control" },
  "loops-for": { label: { th: "ลูป for", en: "For Loops" }, family: "control" },
  "loops-while": { label: { th: "ลูป while", en: "While Loops" }, family: "control" },
  ranges: { label: { th: "range()", en: "Ranges" }, family: "control" },
  accumulator: { label: { th: "ตัวสะสม", en: "Accumulator" }, family: "control" },

  conditionals: { label: { th: "เงื่อนไข if/else", en: "Conditionals" }, family: "branching" },
  "chained-conditionals": { label: { th: "if-elif ต่อกัน", en: "If-Elif Ladder" }, family: "branching" },
  "nested-conditionals": { label: { th: "เงื่อนไขซ้อน", en: "Nested Conditionals" }, family: "branching" },
  "boolean-logic": { label: { th: "ตรรกะ and/or/not", en: "Boolean Logic" }, family: "branching" },

  "nested-lists": { label: { th: "ลิสต์ซ้อน (ตาราง 2 มิติ)", en: "Nested Lists" }, family: "data" },
  lists: { label: { th: "ลิสต์", en: "Lists" }, family: "data" },
  dictionaries: { label: { th: "ดิกชันนารี", en: "Dictionaries" }, family: "data" },
  sets: { label: { th: "เซ็ต", en: "Sets" }, family: "data" },
  sorting: { label: { th: "การเรียงลำดับ", en: "Sorting" }, family: "data" },
  comprehension: { label: { th: "Comprehension", en: "Comprehension" }, family: "data" },
  aggregation: { label: { th: "sum/max/min/len", en: "Aggregation" }, family: "data" },

  strings: { label: { th: "สตริง", en: "Strings" }, family: "text" },
  "string-slicing": { label: { th: "ตัดสตริง [::]", en: "String Slicing" }, family: "text" },
  "string-methods": { label: { th: "เมท็อดสตริง", en: "String Methods" }, family: "text" },

  math: { label: { th: "คณิตศาสตร์", en: "Math" }, family: "number" },
  modulo: { label: { th: "มอดุโล %", en: "Modulo" }, family: "number" },
  "integer-division": { label: { th: "หารปัดลง //", en: "Integer Division" }, family: "number" },
  exponentiation: { label: { th: "ยกกำลัง **", en: "Exponentiation" }, family: "number" },
  "type-casting": { label: { th: "แปลงชนิดข้อมูล", en: "Type Casting" }, family: "number" },

  io: { label: { th: "input/print", en: "Input & Output" }, family: "io" },
  formatting: { label: { th: "f-string", en: "Formatting" }, family: "io" },
  "decimal-formatting": { label: { th: "ทศนิยม :.2f", en: "Decimal Format" }, family: "io" },
};

export function tagLabel(tag: string): LText {
  return TAG_META[tag]?.label ?? { th: tag, en: tag };
}

export function tagStyle(tag: string): string {
  const family = TAG_META[tag]?.family ?? "io";
  return FAMILY_STYLES[family];
}
