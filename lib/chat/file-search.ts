import "server-only";

import { COURSES, courseDir, courseHref, findCourseByCode, type CatalogCourse } from "@/lib/courses/catalog";
import { scheduleForCourse } from "@/lib/library/course-weeks";
import {
  coursesWithAssets,
  isRestrictedAsset,
  mergedAssets,
  resolveCategory,
  type AssetCategory,
  type AssetScope,
  type SubjectAsset,
} from "@/lib/library/subject-library";
import type { LText } from "@/lib/ltext";

/**
 * File lookup for the help chat, over the same catalog the course pages read:
 * the curated SUBJECT_ASSETS plus everything scripts/build-library-manifest.mjs
 * found on disk. Uploading a file through the library pipeline therefore makes
 * it findable here with no extra step.
 *
 * Access mirrors app/api/library/assets: the library is for signed-in KMITL IT
 * students (open in dev), and past exams only ever for a signed-in student.
 * Results never carry a file URL — only the course page, where the file opens
 * through the normal gate.
 */

const MAX_RESULTS = 8;

const CATEGORY_TH: Record<AssetCategory, string> = {
  lecture: "สไลด์",
  cheatsheet: "สรุป",
  exam: "ข้อสอบเก่า",
  exercise: "แบบฝึกหัด",
  note: "โน้ต",
  reference: "อ้างอิง",
};

// Words a student types for each kind of file, Thai and English.
const CATEGORY_WORDS: Record<AssetCategory, string[]> = {
  lecture: ["สไลด์", "slide", "lecture", "เลคเชอร์", "ชีท"],
  cheatsheet: ["สรุป", "summary", "cheatsheet", "ชีทสรุป", "ย่อ", "ฉบับแปล", "แปลไทย", "แปลเป็นไทย", "ภาษาไทย", "translation", "translated"],
  exam: ["ข้อสอบ", "exam", "แนวข้อสอบ", "mock", "quiz", "ควิซ", "มิดเทอม", "ไฟนอล", "midterm", "final"],
  exercise: ["แบบฝึก", "exercise", "lab", "แล็บ", "worksheet", "การบ้าน", "homework"],
  note: ["โน้ต", "note", "จด", "กระดาน"],
  reference: ["ตาราง", "reference", "อ้างอิง"],
};

// "ครึ่งหลัง" and "หลังมิดเทอม" are the site's own words for the second half,
// and the chat uses them in its own replies, so a follow-up must understand them.
const SCOPE_WORDS = {
  midterm: ["มิดเทอม", "กลางภาค", "midterm", "ครึ่งแรก", "ก่อนมิดเทอม", "ก่อนกลางภาค", "first half", "mid"],
  final: ["ไฟนอล", "ปลายภาค", "final", "ครึ่งหลัง", "หลังมิดเทอม", "หลังกลางภาค", "second half", "2nd half"],
} as const;

/**
 * Who is asking. The file list needs a signed-in KMITL IT student (open in
 * dev), as /api/library/assets requires. Past exams are never searched, for
 * anyone: the chat deals only in what an ordinary student can open, and
 * insiders reach the exams through the library page itself.
 */
export type FileAccess = { signedIn: boolean; production: boolean };

/**
 * How students spell a course when they don't type its code. Keys are course
 * codes; the names in the catalog are matched too, so this only has to carry
 * what the catalog cannot.
 */
const COURSE_NICKNAMES: Record<string, string[]> = {
  ITF: ["ไอทีเอฟ", "itfundamentals"],
  ICS: ["ไอซีเอส", "คอมพิวเตอร์เบื้องต้น"],
  MFIT: ["เอ็มฟิต", "คณิตไอที", "คณิตสำหรับไอที", "mathit"],
  PSCP: ["พีเอสซีพี", "เขียนโปรแกรม", "โปรแกรมมิ่ง"],
  COMPRO: ["คอมโปร", "คอมพโปร", "computerprogramming"],
  DSA: ["ดีเอสเอ", "โครงสร้างข้อมูล"],
  OOP: ["โอโอพี", "เชิงวัตถุ"],
  PSTAT: ["สถิติ", "ความน่าจะเป็น"],
  BFIT: ["บีฟิต", "ธุรกิจไอที"],
  CHEM: ["เคมี"],
  DL: ["ดิจิทัลลิเทอเรซี", "ความฉลาดทางดิจิทัล"],
  CHARM: ["ชาร์ม", "สร้างเสน่ห์"],
  SPORT: ["กีฬา", "นันทนาการ"],
  FE: ["อิ้งพื้นฐาน", "อังกฤษพื้นฐาน"],
  FE2: ["อิ้งพื้นฐาน2", "อังกฤษพื้นฐาน2"],
};

/** Which catalog course a message is about: code, 8-digit code, name or nickname. */
export function detectCourse(q: string): CatalogCourse | undefined {
  // Spaces removed as well, so "ITFweek10" and "itf week 10" both resolve.
  const lower = q.toLowerCase();
  const tight = lower.replace(/\s+/g, "");
  // Longest first, so "FE2"/"Foundation English II" never resolves to "FE".
  const ordered = [...COURSES].sort((a, b) => b.code.length - a.code.length);
  const byCode = ordered.find((c) => {
    const code = c.code.toLowerCase();
    // `.ics` is a calendar file, not the ICS course, so a dot never starts a code.
    return (
      new RegExp(`(^|[^a-z0-9.])${code}([^a-z0-9]|$)`).test(lower) ||
      // "FE 2" is FE2 once spaces are gone...
      new RegExp(`(^|[^a-z0-9.])${code}([^a-z0-9]|$)`).test(tight) ||
      // ...and "ITFweek10" is a code glued to a number word, not to a letter.
      new RegExp(`(^|[^a-z0-9.])${code}(?=(week|wk|บท|สัปดาห์|lab|lec|ch)|\\d)`).test(tight)
    );
  });
  if (byCode) return byCode;

  const byName = [...COURSES]
    .sort((a, b) => b.nameEn.length - a.nameEn.length)
    .find(
      (c) =>
        (c.officialCode && lower.includes(c.officialCode)) ||
        lower.includes(c.nameTh.toLowerCase()) ||
        lower.includes(c.nameEn.toLowerCase()),
    );
  if (byName) return byName;

  // Nicknames last: they are the loosest match.
  const nick = Object.entries(COURSE_NICKNAMES)
    .flatMap(([code, names]) => names.map((n) => ({ code, n: n.replace(/\s+/g, "") })))
    .sort((a, b) => b.n.length - a.n.length)
    .find(({ n }) => tight.includes(n));
  return nick ? COURSES.find((c) => c.code === nick.code) : undefined;
}

function numberAfter(q: string, words: string[]): number | undefined {
  const m = q.match(new RegExp(`(?:${words.join("|")})\\s*\\.?\\s*(\\d{1,2})`, "i"));
  return m ? Number(m[1]) : undefined;
}

// Course codes say which course, not which file — every PSCP file is tagged
// "PSCP", so letting them score would rank the whole course equally.
const COURSE_WORDS = new Set(COURSES.map((c) => c.code.toLowerCase()));

/** Filler that carries no topic, so it should not rank a file. */
const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "what", "which", "where", "when", "how",
  "can", "could", "would", "please", "give", "show", "find", "need", "want", "have", "about",
  "all", "any", "some", "more", "most", "there", "here", "file", "files", "slide", "slides",
  "sheet", "sheets", "doc", "docs", "document", "documents", "download", "open", "get", "me",
  "my", "your", "course", "subject", "intro", "introduction", "systems", "system", "computer",
]);

const NUMBER_WORDS = ["บทที่", "บท", "ch", "chapter", "สัปดาห์ที่", "สัปดาห์", "week", "wk", "วีค", "lecture", "lec", "lab", "แล็บ", "แลป", "ใบงานที่", "ใบทดลองที่"];

/** The week a question asks for, in the course's own numbering. */
type WeekTarget = {
  /** Week (or chapter) number as the course's files carry it. */
  n: number;
  /** Set for courses whose second half restarts at week 1 (ICS). */
  scope?: AssetScope;
  /** The week as the student counts it through the term. */
  termWeek: number;
  topic?: LText;
};

/**
 * Most courses number weeks straight through the term (ITF: 1–15). ICS runs
 * two tracks that each start at week 1, so a student's "ICS week 12" is the
 * second half's week 5 — week numbers past the first half roll over into it,
 * the same way ITF's week 8 is the first week after the midterm. A smaller
 * number plus "ไฟนอล"/"final" means that half's own week.
 */
function resolveWeek(code: string | undefined, q: string): WeekTarget | undefined {
  const n = numberAfter(q, NUMBER_WORDS);
  if (n === undefined) return undefined;
  const weeks = code ? scheduleForCourse(code)?.weeks ?? [] : [];
  const restarts = weeks.some((w) => w.scope === "final" && w.week === 1);
  if (!restarts) {
    return { n, termWeek: n, topic: weeks.find((w) => w.week === n)?.title };
  }
  const firstHalf = Math.max(...weeks.filter((w) => w.scope === "midterm").map((w) => w.week));
  const askedFinal = SCOPE_WORDS.final.some((w) => q.includes(w));
  const target =
    n > firstHalf
      ? { n: n - firstHalf, scope: "final" as const }
      : { n, scope: askedFinal ? ("final" as const) : ("midterm" as const) };
  return {
    ...target,
    termWeek: target.scope === "final" ? target.n + firstHalf : target.n,
    topic: weeks.find((w) => w.week === target.n && w.scope === target.scope)?.title,
  };
}

/**
 * Is this asset the one for week/chapter n?
 *
 * An asset that declares a week or chapter is judged on that alone. Reading
 * the number out of its text as well was how "ITF สัปดาห์ 1" surfaced the
 * week-11 deck (its description cites Kurose "บทที่ 1") and how summaries
 * titled "บทที่ 1–6" answered for every chapter. Only assets with no number
 * of their own fall back to their title and filename.
 */
function hasNumber(asset: SubjectAsset, title: string, n: number): boolean {
  if (asset.week !== undefined || asset.chapter !== undefined) {
    return asset.week === n || asset.chapter === n;
  }
  // A range ("บทที่ 1–6", "Week 1-7") covers the whole term — not an answer
  // to one week.
  if (/(\d{1,2})\s*[–—-]\s*(\d{1,2})/.test(title)) return false;
  return new RegExp(`(ch\\.?|chapter|lecture|lec|week|lab|บทที่|สัปดาห์|ใบงานที่|ใบทดลองที่)\\s*0?${n}(?!\\d)`).test(title);
}

function score(asset: SubjectAsset, q: string, tokens: string[], week?: WeekTarget): number {
  const hay = [asset.title.th, asset.title.en, asset.description.th, asset.description.en, asset.fileName, ...asset.tags]
    .join(" ")
    .toLowerCase();
  let s = 0;
  // Latin words from the question found in the asset...
  for (const tok of tokens) if (hay.includes(tok)) s += 2;
  // ...and the asset's own tags found in the question (Thai has no spaces to split on).
  // Latin tags must be whole words, or the "IC" tag would match "ics".
  for (const tag of asset.tags) {
    const t = tag.toLowerCase();
    if (t.length < 2 || COURSE_WORDS.has(t)) continue;
    const hit = /^[\x20-\x7e]+$/.test(t)
      ? new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(q)
      : q.includes(t);
    if (hit) s += 3;
  }
  if (CATEGORY_WORDS[resolveCategory(asset)].some((w) => q.includes(w))) s += 3;
  // Generated cards carry no `scope`, only "Final · 2560"-style titles, so the
  // title counts too; a file explicitly in the other half is pushed down.
  for (const [scope, words] of Object.entries(SCOPE_WORDS)) {
    if (!words.some((w) => q.includes(w))) continue;
    if (asset.scope === scope || words.some((w) => w.length > 3 && hay.includes(w))) s += 3;
    else if (asset.scope) s -= 2;
  }
  // The site matches a week against `week`, falling back to `chapter`; so do
  // we. For ICS the half must match too, or "week 5" would hit both tracks.
  // Only the title and filename are searched for a loose number — a passing
  // mention in a description is not what the file is about.
  if (week) {
    const label = [asset.title.th, asset.title.en, asset.fileName].join(" ").toLowerCase();
    if (hasNumber(asset, label, week.n) && (!week.scope || asset.scope === week.scope)) s += 6;
  }
  if (asset.status === "duplicate" || asset.isDuplicate) s -= 2;
  if (asset.status === "legacy") s -= 1;
  return s;
}

function line(asset: SubjectAsset, code: string): string {
  const course = findCourseByCode(code);
  const meta = [
    CATEGORY_TH[resolveCategory(asset)],
    asset.scope === "midterm" ? "มิดเทอม" : asset.scope === "final" ? "ไฟนอล" : null,
    asset.chapter ? `บทที่ ${asset.chapter}` : null,
    asset.week ? `สัปดาห์ ${asset.week}` : null,
    asset.fileType.toUpperCase(),
  ].filter(Boolean);
  const where = course ? courseHref(course) : null;
  return `- [${code}] ${asset.title.th} (${meta.join(", ")})${where ? ` → ${where}` : ""}`;
}

const CATEGORY_EN: Record<AssetCategory, string> = {
  lecture: "slides",
  cheatsheet: "summary",
  exam: "past exam",
  exercise: "exercise",
  note: "notes",
  reference: "reference",
};

// A confident match: the question names a course and the best file hits at
// least a chapter/week number or a kind plus a half (score >= 6). Those are
// answered straight from the catalog, with no model call.
const CONFIDENT_SCORE = 6;
// Files within this many points of the best one are shown with it; the rest
// are noise (e.g. "Lecture 00" riding along on the word "slide").
const NEAR_TOP = 3;
const MAX_QUICK_FILES = 4;

/** A file the chat can offer as an "open" button. */
export type ChatFile = { title: string; course: string; href: string };

export type Bilingual = { th: string; en: string };

/** Which language the buttons are labelled in. */
export type Lang = "th" | "en";

export type FileContext = {
  /**
   * locked: signed out (production) · weeks: "how many weeks" · match: files
   * found (quick only when confident) · overview: course named, nothing
   * matched · none: nothing found.
   */
  kind: "locked" | "weeks" | "match" | "overview" | "none";
  /** Appended to the system prompt when the model answers. */
  text: string;
  files: ChatFile[];
  /** A finished reply, when the catalog alone answers the question. */
  quick: Bilingual | null;
};

/**
 * The course's library page with `?open=` set, which makes SubjectLibrary open
 * the file's preview on load. The page fetches the file list behind the usual
 * sign-in, so the button grants nothing the library would not.
 */
function libraryHref(code: string, assetId?: string): string | null {
  const course = findCourseByCode(code);
  if (!course) return null;
  const base = `/courses/${courseDir(course)}/library`;
  return assetId ? `${base}?open=${encodeURIComponent(assetId)}` : base;
}

/** "คลังทรัพยากร ITF" / "ITF resources". */
export function libraryLabel(code: string, lang: Lang): string {
  return lang === "en" ? `${code} resources` : `คลังทรัพยากร ${code}`;
}

function toButton({ asset, code }: { asset: SubjectAsset; code: string }, lang: Lang): ChatFile[] {
  const href = libraryHref(code, asset.id);
  return href ? [{ title: asset.title[lang] || asset.title.th, course: code, href }] : [];
}

/** "ITF มีกี่ week" — answered from the course's week schedule, if it has one. */
function weekOverview(code: string, lang: Lang): FileContext | null {
  const weeks = (scheduleForCourse(code)?.weeks ?? []).filter((w) => w.week > 0);
  if (!weeks.length) return null;
  const first = weeks.filter((w) => w.scope === "midterm");
  const second = weeks.filter((w) => w.scope === "final");
  const restarts = second.some((w) => w.week === 1);
  const range = (ws: typeof weeks, offset = 0) =>
    `${Math.min(...ws.map((w) => w.week)) + offset}–${Math.max(...ws.map((w) => w.week)) + offset}`;
  const firstMax = Math.max(0, ...first.map((w) => w.week));
  const secondTerm = range(second, restarts ? firstMax : 0);
  const note = (th: boolean) =>
    restarts ? (th ? ` (ในคลังนับใหม่เป็น week ${range(second)})` : ` (numbered ${range(second)} in the library)`) : "";
  const library = libraryHref(code);
  return {
    kind: "weeks",
    text: "",
    files: library ? [{ title: libraryLabel(code, lang), course: code, href: library }] : [],
    quick: {
      th: `${code} เรียนทั้งหมด ${weeks.length} week ครับ 📅\n\n• ครึ่งแรก (ก่อนมิดเทอม): week ${range(first)}\n• ครึ่งหลัง (หลังมิดเทอม): week ${secondTerm}${note(true)}\n\nพิมพ์ เช่น "${code} week ${firstMax + 1}" เพื่อเปิดไฟล์ของ week นั้นได้เลยครับ 👇`,
      en: `${code} runs ${weeks.length} weeks 📅\n\n• First half (before midterm): week ${range(first)}\n• Second half (after midterm): week ${secondTerm}${note(false)}\n\nType e.g. "${code} week ${firstMax + 1}" to open that week's files 👇`,
    },
  };
}

/**
 * Searches the catalog for a question. Returns null when the message is not
 * about files; otherwise model context, buttons, and — for a sign-in notice,
 * a course overview or a confident match — a finished reply.
 */
export function fileContext(question: string, access: FileAccess, lang: Lang = "th"): FileContext | null {
  const q = question.toLowerCase();
  // "สอบ ITF วันไหน", "what room is my ITF exam" — about the exam timetable,
  // not about files. Left to the FAQ, which answers with the schedule page.
  if (/สอบ|exam/.test(q) && /วันไหน|วันที่|กี่โมง|เมื่อไหร่|ห้องสอบ|ห้องไหน|ที่ไหน|ที่นั่ง|ผัง|ตารางสอบ|when is|what room|which room|seat/.test(q)) {
    return null;
  }
  const course = detectCourse(q);
  const asksForFiles =
    Object.values(CATEGORY_WORDS).flat().some((w) => q.includes(w)) ||
    /ไฟล์|เอกสาร|file|pdf|โหลด|download/.test(q);
  if (!course && !asksForFiles) return null;

  // The week schedule is public (it is the syllabus, not the files), so this
  // is answered before the sign-in gate.
  if (course && /กี่\s*(week|สัปดาห์|วีค)|how many weeks?/.test(q)) {
    const overview = weekOverview(course.code, lang);
    if (overview) return overview;
  }

  if (!access.signedIn && access.production) {
    return {
      kind: "locked",
      text: "# ผลค้นหาไฟล์\nผู้ใช้ยังไม่ได้เข้าสู่ระบบ จึงดูรายการไฟล์ไม่ได้ ห้ามบอกชื่อไฟล์ใดๆ",
      files: [],
      quick: {
        th: "ต้องเข้าสู่ระบบก่อนนะครับ 🔒\n\n1. กดปุ่ม 'เข้าสู่ระบบ' มุมขวาบน\n2. เลือกบัญชี @kmitl.ac.th ของคณะ IT\n3. กลับมาถามผมใหม่ แล้วจะมีปุ่มเปิดไฟล์ให้เลยครับ",
        en: "Please sign in first 🔒\n\n1. Tap 'Sign in' at the top right\n2. Choose your @kmitl.ac.th IT account\n3. Ask me again and I'll give you buttons to open the files",
      },
    };
  }

  const week = resolveWeek(course?.code, q);
  const codes = course ? [course.code] : [...coursesWithAssets()];
  const pool = codes.flatMap((code) =>
    mergedAssets(code)
      .filter((a) => !isRestrictedAsset(a))
      .map((asset) => ({ asset, code })),
  );

  // Only words that could name a topic are scored. "week" and "ch" frame the
  // question, the course is already resolved, and the words of the course's
  // own name match nearly everything it owns ("Intro to Computer Systems
  // week 12" was answered with chapter-1 files).
  const courseName = course
    ? new Set(`${course.nameEn} ${course.nameTh}`.toLowerCase().match(/[a-z][a-z0-9]+/g) ?? [])
    : new Set<string>();
  const tokens = (q.match(/[a-z][a-z0-9]+/g) ?? []).filter(
    (tok) =>
      !COURSE_WORDS.has(tok) &&
      !NUMBER_WORDS.includes(tok) &&
      !courseName.has(tok) &&
      !STOPWORDS.has(tok),
  );
  const scored = pool
    .map((r) => ({ ...r, s: score(r.asset, q, tokens, week) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  // When a week was asked for, files that really are that week win outright;
  // anything else is at best a near-miss and must not look like the answer.
  const weekHits = week
    ? scored.filter((r) => {
        const label = [r.asset.title.th, r.asset.title.en, r.asset.fileName].join(" ").toLowerCase();
        return hasNumber(r.asset, label, week.n) && (!week.scope || r.asset.scope === week.scope);
      })
    : [];
  const pickFrom = week && weekHits.length ? weekHits : scored;
  const top = pickFrom[0]?.s ?? 0;
  const ranked = pickFrom.filter((r) => r.s >= top - NEAR_TOP).slice(0, MAX_RESULTS);

  const examNote = "\n(ห้ามพูดถึงหรือแนะนำข้อสอบเก่า ให้แนะนำเฉพาะไฟล์ในรายการนี้)";

  if (ranked.length) {
    const shown = ranked.slice(0, MAX_QUICK_FILES);
    // A week question is only answered confidently by files from that week.
    const confident = Boolean(course) && top >= CONFIDENT_SCORE && (!week || weekHits.length > 0);
    // `l` rather than `lang`: these build both languages for `quick`, while
    // the outer `lang` is the one the buttons are labelled in.
    const list = (l: Lang) =>
      shown
        .map(({ asset }) => {
          const kind = (l === "th" ? CATEGORY_TH : CATEGORY_EN)[resolveCategory(asset)];
          return `• ${asset.title[l] || asset.title.th} (${kind})`;
        })
        .join("\n");
    const code = course?.code ?? "";
    // "ICS week 12 = 2nd half week 5 · DAC/ADC…", so the rollover is visible.
    const weekLine = (l: Lang) => {
      // Only courses with a week schedule (ITF, ICS) speak in weeks.
      if (!week || !course || !scheduleForCourse(course.code)) return "";
      const topic = week.topic ? ` · ${week.topic[l]}` : "";
      const half =
        week.scope === "final" && week.n !== week.termWeek
          ? l === "th"
            ? ` = ครึ่งหลัง week ${week.n}`
            : ` = 2nd half week ${week.n}`
          : "";
      return `📅 ${code} week ${week.termWeek}${half}${topic}\n\n`;
    };
    return {
      kind: "match",
      text: `# ผลค้นหาไฟล์จากคลังของเว็บ (ใช้ข้อมูลนี้เท่านั้น ห้ามแต่งชื่อไฟล์)\nไฟล์อยู่ใน 'คลังทรัพยากร' ของหน้ารายวิชาตามลิงก์\n${ranked.map((r) => line(r.asset, r.code)).join("\n")}${examNote}`,
      files: shown.flatMap((r) => toButton(r, lang)),
      quick: confident
        ? {
            th: `เจอแล้วครับ 📚 ${code} มี ${shown.length} ไฟล์ที่ตรงกับที่ถาม\n\n${weekLine("th")}${list("th")}\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇`,
            en: `Found it 📚 ${code} has ${shown.length} matching file${shown.length > 1 ? "s" : ""}\n\n${weekLine("en")}${list("en")}\n\nTap a button below to open it 👇`,
          }
        : null,
    };
  }

  if (course) {
    const counts = new Map<AssetCategory, number>();
    for (const { asset } of pool) {
      const cat = resolveCategory(asset);
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    const href = courseHref(course);
    const summary = (labels: Record<AssetCategory, string>) =>
      [...counts].map(([cat, n]) => `• ${labels[cat]} ${n}`).join("\n");
    const library = pool.length ? libraryHref(course.code) : null;
    return {
      kind: "overview",
      text: `# ผลค้นหาไฟล์จากคลังของเว็บ\nไม่พบไฟล์ที่ตรงกับคำถามโดยตรง วิชา ${course.code} มีไฟล์ทั้งหมด: ${summary(CATEGORY_TH).replace(/\n/g, ", ") || "ยังไม่มีไฟล์"}${href ? ` → ${href}` : ""}${examNote}`,
      files: library ? [{ title: libraryLabel(course.code, lang), course: course.code, href: library }] : [],
      quick: library
        ? {
            th: `ยังไม่เจอไฟล์ที่ตรงเป๊ะครับ 🔍 แต่ใน ${course.code} มี\n\n${summary(CATEGORY_TH)}\n\nกดปุ่มด้านล่างเพื่อเปิดคลังทรัพยากรได้เลยครับ 👇`,
            en: `No exact match 🔍 but ${course.code} has\n\n${summary(CATEGORY_EN)}\n\nTap the button below to open its library 👇`,
          }
        : {
            th: `ตอนนี้ ${course.code} ยังไม่มีไฟล์ในคลังครับ 🙏 ลองดูหน้ารายวิชาแทนนะครับ${href ? `\n${href}` : ""}`,
            en: `${course.code} has no files in its library yet 🙏 Try the course page instead${href ? `\n${href}` : ""}`,
          },
    };
  }

  return {
    kind: "none",
    text: "# ผลค้นหาไฟล์จากคลังของเว็บ\nไม่พบไฟล์ที่ตรงกับคำถาม ให้แนะนำผู้ใช้ระบุชื่อวิชาหรือรหัสวิชา หรือลองคีย์เวิร์ดอื่น",
    files: [],
    quick: null,
  };
}
