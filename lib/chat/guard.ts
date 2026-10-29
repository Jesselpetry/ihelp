import type { Bilingual } from "@/lib/chat/file-search";

/**
 * The help chat only answers questions. It has no tools: it cannot read or
 * write files, call other APIs, or act as the user — its output is rendered as
 * plain text and nothing else. So "break the site" can never be carried out.
 *
 * This guard is the cheap first line, not the security boundary: it keeps the
 * obvious attempts away from the model (and off the bill) and gives a steady
 * refusal. A determined attacker can phrase around any keyword list, which is
 * why the real protections live elsewhere — the model has no tools, replies
 * are escaped text, only internal links are clickable, and the system prompt
 * refuses the same things in prose (lib/chat/system-prompt.ts).
 *
 * Two rules learned from testing:
 *  1. Normalize before matching. Zero-width characters, NBSP, full-width and
 *     Cyrillic look-alikes, and spaces inside a word all slipped a raw
 *     substring check.
 *  2. Match intent, not vocabulary. "bypass", "payload", "xss", "brute force"
 *     and "ทำลาย" are ITF / ICS / DSA / DL lecture words — on their own they
 *     are coursework, so each needs a verb or target that makes it a request.
 */

// Look-alikes seen in bypass attempts, mapped to the ASCII they imitate.
const LOOKALIKE: Record<string, string> = {
  а: "a", е: "e", і: "i", о: "o", р: "p", с: "c", ѕ: "s", у: "y", х: "x",
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s",
};

/**
 * Folds a message to a comparable form: NFKC, look-alikes to ASCII, then every
 * zero-width, punctuation and space character dropped. "s y s t e m",
 * "sys​tem" and "ѕy$t3m" all become "system", so the patterns below can be
 * written plainly. Thai has no word breaks, so dropping spaces costs nothing
 * there and closes the letter-spacing trick everywhere.
 *
 * Thai vowel and tone marks (category Mn) are KEPT. Stripping them turned
 * "ยิง" (shoot) into "ยง", which is inside the everyday "ยังไง" — the filter
 * then refused "ระบบคอมพิวเตอร์ทำงานยังไง".
 */
function fold(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[​-‏⁠﻿­]/gu, "")
    .replace(/[а-яіѕ0-9@$]/gu, (c) => LOOKALIKE[c] ?? c)
    .replace(/[^\p{L}\p{N}\p{M}]/gu, "");
}

/** Folded like the message, so patterns stay readable here. */
const f = fold;

/**
 * A phrase matches when any `verb` appears together with any `target` (order
 * does not matter), or when a `phrase` appears on its own because it has no
 * innocent reading. Written unfolded; folded at module load.
 */
type Rule = { verbs?: string[]; targets?: string[]; phrases?: string[] };

/** What "the site" can be called. Folding strips spaces, so "ไฟล์ web" → "ไฟล์web". */
const SITE = ["เว็บ", "เว็บไซต์", "web", "website", "site", "ระบบ", "เซิร์ฟเวอร์", "server", "ฐานข้อมูล", "database", "api", "ihelp", "backend"];

/** "ไฟล์เว็บ", "โค้ด web", "ข้อมูลระบบ"… — the site's own files, not the user's. */
const SITE_OWNED = ["ไฟล์", "โค้ด", "ข้อมูล", "file", "code", "data", "source"].flatMap((noun) =>
  SITE.map((s) => `${noun}${s}`).concat(SITE.map((s) => `${noun}ของ${s}`), SITE.map((s) => `${noun}ใน${s}`)),
);

/**
 * Thai puts the object after the verb, and that order is the whole difference
 * between a request and a report: "พังเว็บ" (break the site) is an attack,
 * "เว็บพัง" (the site is broken) is a student telling us something is wrong.
 * So these are matched as ordered phrases, never as a loose verb + target.
 */
const THAI_ATTACK = ["พัง", "ทำลาย", "แฮก", "แฮ็ก", "เจาะ", "โจมตี", "ถล่ม", "ป่วน", "ยิง", "ล้ม"].flatMap((verb) =>
  SITE.map((s) => `${verb}${s}`),
);

const RULES: Rule[] = [
  // Attacking or breaking the site. The attack techniques sit in `verbs`, not
  // `phrases`: naming one is coursework ("sql injection คืออะไร"), aiming it
  // at the site is not.
  {
    verbs: ["hack", "attack", "exploit", "breach", "take down", "bring down", "crash", "destroy", "deface", "pwn", "sql injection", "sqli", "xss", "csrf", "ddos"],
    targets: SITE,
  },
  { phrases: [...THAI_ATTACK, "ทำให้เว็บล่ม", "ทำให้เว็บพัง", "ทำให้ระบบล่ม", "ทำเว็บล่ม", "ทำเว็บพัง"] },
  { phrases: ["ddos attack", "dos attack", "remote code execution", "reverse shell", "rm -rf", "drop table", "delete from", "truncate table", "or 1=1", "union select", "path traversal", "directory traversal", "เจาะระบบ", "แฮกเว็บ", "พังเว็บ", "ล่มเว็บ", "ทำเว็บพัง", "ทำเว็บล่ม"] },
  // Getting past the login or acting as someone else.
  {
    verbs: ["ข้าม", "หลบ", "เลี่ยง", "ปลอม", "แฮก", "bypass", "skip", "get past", "get around", "forge", "fake", "spoof", "escalate"],
    targets: ["ล็อกอิน", "login", "เข้าสู่ระบบ", "sign in", "auth", "การยืนยันตัวตน", "สิทธิ์", "permission", "role", "admin", "paywall", "session", "cookie", "rls"],
  },
  { phrases: ["ข้ามล็อกอิน", "ข้ามการล็อกอิน", "brute force password", "brute force login", "crack password", "แครกรหัสผ่าน", "เดารหัสผ่าน"] },
  // Changing or destroying what the site holds.
  {
    verbs: ["ลบ", "แก้", "แก้ไข", "เปลี่ยน", "เขียนทับ", "delete", "drop", "wipe", "erase", "modify", "edit", "overwrite", "inject", "tamper"],
    targets: [...SITE_OWNED, "ซอร์สโค้ด", "ข้อมูลคนอื่น", "ข้อมูลผู้ใช้", "บัญชีคนอื่น", "คะแนนของ", "เกรดของ", "source code", "other users", "someone else's account", "the database", "server files"],
  },
  // Credentials and configuration.
  {
    verbs: ["ขอ", "บอก", "เอา", "ดู", "แสดง", "ส่ง", "หา", "give", "show", "tell", "reveal", "print", "leak", "dump", "expose", "share", "what is", "whats"],
    targets: ["api key", "apikey", "secret key", "service role", "service_role", "access token", "รหัสผ่านแอดมิน", "รหัสผ่าน admin", "admin password", "database url", "connection string", "env file", "ไฟล์env", "credentials", "private key", "source code ของเว็บ", "ซอร์สโค้ดของเว็บ", "source code ของระบบ"],
  },
  { phrases: ["service_role", "supabase service role", "process env", "processenv"] },
  // Prompt extraction and role override.
  {
    verbs: ["ขอดู", "ขอ", "บอก", "แสดง", "พิมพ์", "ทวน", "เปิดเผย", "สรุป", "show", "reveal", "print", "repeat", "output", "tell", "what is", "whats", "what are", "give"],
    targets: ["system prompt", "systemprompt", "prompt ของคุณ", "promptของคุณ", "คำสั่งของคุณ", "คำสั่งตั้งต้น", "คำสั่งแรก", "ชุดคำสั่ง", "initial instructions", "original instructions", "your instructions", "the text above", "everything above", "your rules", "กฎของคุณ"],
  },
  {
    phrases: ["ignore previous", "ignore all previous", "ignore the above", "ignore your instructions", "disregard previous", "disregard the above", "forget your instructions", "forget all previous", "ลืมคำสั่ง", "ไม่ต้องสนคำสั่ง", "เพิกเฉยคำสั่ง", "ข้ามคำสั่ง", "jailbreak", "dan mode", "developer mode", "do anything now", "no restrictions", "without restrictions", "ไม่มีข้อจำกัด", "ไม่ต้องสนกฎ", "pretend you are", "act as an admin", "act as admin", "you are now", "from now on you are", "สวมบทบาท", "สมมติว่าคุณเป็นแอดมิน", "แกล้งทำเป็นแอดมิน"],
  },
  // Asking for the prompt by name, with no verb at all.
  { phrases: ["system prompt", "systemprompt", "your system prompt"] },
  // Malware. Spelled out as whole phrases: a bare "ทำ"/"make" next to the
  // word "virus" is how "ไวรัสทำลายไฟล์ยังไง" (an ITF topic) reads.
  {
    phrases: ["เขียนไวรัส", "สร้างไวรัส", "ทำไวรัส", "เขียนมัลแวร์", "สร้างมัลแวร์", "เขียนransomware", "สร้างkeylogger", "write a virus", "write malware", "create malware", "make a virus", "build a virus", "write ransomware", "create ransomware", "write a keylogger", "make a keylogger", "generate malware"],
  },
];

type FoldedRule = { verbs: string[]; targets: string[]; phrases: string[] };
const FOLDED: FoldedRule[] = RULES.map((r) => ({
  verbs: (r.verbs ?? []).map(f),
  targets: (r.targets ?? []).map(f),
  phrases: (r.phrases ?? []).map(f),
}));

const REFUSAL: Bilingual = {
  th: "ขอโทษครับ ผมช่วยเรื่องนี้ไม่ได้ 🙏\n\nผมเป็นผู้ช่วยตอบคำถามเท่านั้น ไม่มีสิทธิ์แก้ไข ลบ หรือเข้าถึงระบบของเว็บ\n\nถ้าอยากหาไฟล์เรียน ลองพิมพ์ เช่น \"ITF week 10\" ได้เลยครับ",
  en: "Sorry, I can't help with that 🙏\n\nI only answer questions — I have no access to change, delete or reach into the site.\n\nLooking for course files? Try e.g. \"ITF week 10\".",
};

function matches(folded: string): boolean {
  return FOLDED.some(
    (rule) =>
      rule.phrases.some((p) => folded.includes(p)) ||
      (rule.verbs.length > 0 &&
        rule.verbs.some((v) => folded.includes(v)) &&
        rule.targets.some((t) => folded.includes(t))),
  );
}

/**
 * A fixed refusal when any user turn is an attack, tampering or
 * prompt-injection request; null otherwise.
 *
 * Every user turn is checked, not just the last: the client sends the history
 * back with each request, so an injection planted in an earlier turn would
 * otherwise reach the model behind an innocent-looking question.
 */
export function blockedReply(messages: { role: string; content: string }[]): Bilingual | null {
  return messages.some((m) => m.role === "user" && matches(fold(m.content))) ? REFUSAL : null;
}
