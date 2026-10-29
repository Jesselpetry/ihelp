import "server-only";

import { detectCourse, libraryLabel, type Bilingual, type ChatFile, type Lang } from "@/lib/chat/file-search";
import { COURSES, GROUPS, courseDir, courseHref, type CatalogCourse } from "@/lib/courses/catalog";
import { resolveModule } from "@/lib/courses/course-spine";
import { STANDARD_SPINE, type ModuleId } from "@/lib/courses/spine";
import { UPLOADS_ENABLED } from "@/lib/flags";
import {
  coursesWithAssets,
  isRestrictedAsset,
  mergedAssets,
  resolveCategory,
  type AssetCategory,
} from "@/lib/library/subject-library";
import { t, type LText } from "@/lib/ltext";

/**
 * Pre-written answers for the help chat: instant, the same every time, and
 * available when the model is not (OmniRoute off, quota out). Checked after a
 * confident file match ("ITF week 10") and before the model.
 *
 * Every fact here is taken from the site itself — routes, labels and rules in
 * the code, plus README.md. When a page or rule changes, change its answer.
 * Course answers are generated from the catalog and the course spine, so they
 * follow new courses and modules on their own.
 */

/** A button label in both languages; `resolve` picks one at reply time. */
export type FaqLink = { th: string; en: string; href: string };

const CATEGORY_TH: Record<AssetCategory, string> = { lecture: "สไลด์", cheatsheet: "สรุป", exam: "ข้อสอบเก่า", exercise: "แบบฝึกหัด", note: "โน้ต", reference: "อ้างอิง" };
const CATEGORY_EN: Record<AssetCategory, string> = { lecture: "slides", cheatsheet: "summary", exam: "past exam", exercise: "exercise", note: "notes", reference: "reference" };

export type FaqReply = { reply: Bilingual; links: FaqLink[] };

type Entry = {
  id: string;
  /** Every group needs at least one keyword in the question. */
  all?: string[][];
  /** Or: the whole message matches this (greetings, "ok", "555"). */
  re?: RegExp;
  th: string;
  en: string;
  links?: FaqLink[];
};

const page = (th: string, en: string, href: string): FaqLink => ({ th, en, href });

const resolve = (links: FaqLink[], locale: Lang): ChatFile[] =>
  links.map((l) => ({ title: l[locale], course: "iHelp", href: l.href }));

// ── shared keyword groups ───────────────────────────────────────────────────
const LOGIN = ["ล็อกอิน", "ล็อคอิน", "ลอคอิน", "ล็อกอิน", "login", "log in", "sign in", "signin", "เข้าสู่ระบบ", "เข้าระบบ"];
const WHAT = ["คือ", "อะไร", "what", "เกี่ยวกับ", "about", "ทำอะไร", "มีอะไร", "ใช้ทำ"];

const UPLOAD_ANSWER: Pick<Entry, "th" | "en" | "links"> = UPLOADS_ENABLED
  ? {
      th: "แชร์ไฟล์เข้าคลังได้ครับ 📤\n\n1. เข้าสู่ระบบด้วยบัญชี @kmitl.ac.th และตั้งค่าโปรไฟล์ให้เสร็จ\n2. กดปุ่ม 'แชร์' (ไอคอนก้อนเมฆ) มุมขวาบน\n3. เลือกไฟล์ PDF, PNG, JPG หรือ PPTX ขนาดไม่เกิน 25 MB\n4. ไฟล์ที่แชร์ถือเป็นสาธารณะ ห้ามแชร์ไฟล์ที่อาจารย์ไม่อนุญาต\n\nกดปุ่มด้านล่างเพื่อไปหน้าแชร์ไฟล์ได้เลยครับ 👇",
      en: "You can share files into the library 📤\n\n1. Sign in with your @kmitl.ac.th account and finish your profile\n2. Tap 'Share' (cloud icon) at the top right\n3. Pick a PDF, PNG, JPG or PPTX up to 25 MB\n4. Shared files are public — don't share anything your lecturer hasn't allowed\n\nTap the button below to open the share page 👇",
      links: [page("แชร์เข้าคลัง", "Share a file", "/upload")],
    }
  : {
      th: "ตอนนี้เว็บยังไม่เปิดให้อัปโหลดไฟล์ครับ 🙏\n\nถ้ามีสรุปหรือเอกสารอยากแบ่งปัน ติดต่อทีมงานได้ที่ IG @chatann_ นะครับ",
      en: "Uploading isn't open on the site yet 🙏\n\nIf you have notes or files to share, contact the team on IG @chatann_.",
    };

// ── static entries ──────────────────────────────────────────────────────────
// Ordered by topic. On a tie the earlier entry wins, so put the more specific
// one first when two share keywords.
const STATIC: Entry[] = [
  // ── small talk ──
  {
    id: "greet",
    re: /^(hi|hello|hey|yo|สวัสดี\S*|หวัดดี\S*|ดีจ้า|ดีครับ|ดีค่ะ|ดีคับ|ฮัลโหล|ทัก)[\s!.~ๆ]*$/i,
    th: "สวัสดีครับ 👋 ผมช่วยหาไฟล์เรียนและตอบเรื่องการใช้เว็บ iHelp ได้\n\n• หาไฟล์: พิมพ์ชื่อวิชา + week เช่น \"ITF week 10\"\n• ถามการใช้งาน: เช่น \"ดูตารางสอบยังไง\"\n• ดูรายวิชา: \"มีวิชาอะไรบ้าง\"\n\nอยากให้ช่วยเรื่องไหนพิมพ์มาได้เลยครับ",
    en: "Hi 👋 I find course files and answer questions about using iHelp\n\n• Files: type a course + week, e.g. \"ITF week 10\"\n• How-to: e.g. \"how do I see my exam schedule\"\n• Courses: \"which courses are there\"\n\nWhat can I help with?",
  },
  {
    id: "thanks",
    all: [["ขอบคุณ", "ขอบใจ", "thank", "thx", "แต๊งกิ้ว", "เทงกิ้ว", "ขอบคุน"]],
    th: "ยินดีครับ 😊\n\nมีอะไรให้ช่วยอีก พิมพ์มาได้เลยนะครับ",
    en: "You're welcome 😊\n\nAsk anytime if you need anything else.",
  },
  {
    id: "bye",
    re: /^(บาย\S*|ไปก่อน\S*|ไปละ\S*|bye\S*|goodbye|see you\S*|ลาก่อน\S*|good ?night|ฝันดี\S*)[\s!.~ๆ]*$/i,
    th: "บายครับ 👋 ขอให้อ่านหนังสือสนุก สอบผ่านฉลุยนะครับ",
    en: "Bye 👋 Good luck with your studies!",
  },
  {
    id: "ack",
    re: /^(ok|okay|โอเค\S*|ครับ|ค่ะ|คับ|จ้า|จ้ะ|ได้ครับ|ได้ค่ะ|เข้าใจแล้ว\S*|เค|👍|🙏)[\s!.~ๆ]*$/i,
    th: "รับทราบครับ 👍\n\nถ้ามีอะไรอยากถามเพิ่ม พิมพ์มาได้เลยครับ",
    en: "Got it 👍\n\nAsk anytime if you need more.",
  },
  {
    id: "laugh",
    re: /^(5{3,}|ฮ่า+\S*|haha\S*|lol|555\S*)[\s!.~ๆ]*$/i,
    th: "😄\n\nมีอะไรให้ช่วยเรื่องเว็บหรือหาไฟล์เรียน บอกได้เลยครับ",
    en: "😄\n\nNeed help with the site or finding files? Just ask.",
  },
  {
    id: "how-are-you",
    all: [["สบายดีไหม", "สบายดีมั้ย", "สบายดีป่าว", "เป็นไงบ้าง", "how are you"]],
    th: "สบายดีครับ ขอบคุณที่ถาม 😊\n\nวันนี้อยากหาไฟล์วิชาไหน หรือมีอะไรให้ช่วยครับ",
    en: "Doing well, thanks for asking 😊\n\nWhich course files can I find for you today?",
  },
  {
    id: "who-are-you",
    all: [["คุณคือใคร", "เธอคือใคร", "นายคือใคร", "บอทคือ", "คุณเป็นใคร", "who are you", "what are you", "คุณชื่ออะไร", "บอทชื่ออะไร", "your name"]],
    th: "ผมคือผู้ช่วยของเว็บ iHelp ครับ 🤖\n\n• หาไฟล์เรียนในคลังทรัพยากร พร้อมปุ่มเปิดไฟล์\n• ตอบเรื่องการใช้เว็บ เช่น ตารางสอบ ล็อกอิน PSCP\n• ผมตอบได้อย่างเดียว แก้ไขหรือเข้าถึงระบบของเว็บไม่ได้\n\nลองพิมพ์ \"ITF week 10\" ดูได้เลยครับ",
    en: "I'm the iHelp assistant 🤖\n\n• I find course files and give you buttons to open them\n• I answer how-to questions: exam schedule, sign-in, PSCP…\n• I only answer — I can't change or reach into the site\n\nTry typing \"ITF week 10\".",
  },
  {
    id: "what-can-you-do",
    all: [["ทำอะไรได้", "ช่วยอะไรได้", "ถามอะไรได้", "what can you", "ใช้บอท", "วิธีใช้บอท", "วิธีใช้แชท", "ใช้แชทยังไง", "ถามยังไง", "ใช้ยังไงบอท"]],
    th: "ผมช่วยได้ 3 เรื่องหลักครับ 🙌\n\n1. หาไฟล์: พิมพ์วิชา + week/บทที่ เช่น \"ICS week 12\", \"บทที่ 3 COMPRO\"\n2. ข้อมูลวิชา: เช่น \"MFIT คือวิชาอะไร\", \"ITF มีกี่ week\"\n3. การใช้เว็บ: เช่น \"ดูตารางสอบยังไง\", \"ล็อกอินไม่ได้\"\n\nถ้ามีไฟล์ตรงกับที่ถาม จะมีปุ่มให้กดเปิดได้เลยครับ 👇",
    en: "I help with 3 things 🙌\n\n1. Files: course + week/chapter, e.g. \"ICS week 12\", \"COMPRO chapter 3\"\n2. Course info: e.g. \"what is MFIT\", \"how many weeks does ITF have\"\n3. Using the site: e.g. \"exam schedule\", \"can't sign in\"\n\nWhen files match, you get buttons to open them 👇",
  },
  {
    id: "bot-human",
    all: [["คนจริง", "คนตอบ", "เป็น ai", "เป็นai", "เป็นบอท", "เป็นคนหรือ", "human", "real person"]],
    th: "ผมเป็นบอทครับ 🤖\n\nคำถามที่พบบ่อยและการหาไฟล์ ผมตอบจากข้อมูลของเว็บโดยตรง ส่วนคำถามอื่นใช้ AI ช่วยตอบ ถ้าต้องการคุยกับทีมงาน ติดต่อ IG @chatann_ ได้ครับ",
    en: "I'm a bot 🤖\n\nCommon questions and file searches come straight from the site's own data; other questions are answered with AI. To reach the team, message IG @chatann_.",
  },
  {
    id: "bot-history",
    all: [["เก็บแชท", "บันทึกแชท", "ประวัติแชท", "chat history", "แชทหาย", "เก็บข้อความ", "ข้อความหาย"]],
    th: "แชทนี้ไม่ได้บันทึกไว้ในเว็บครับ 🔒\n\nข้อความอยู่ในหน้าต่างนี้เท่านั้น ปิดหรือรีเฟรชหน้าแล้วจะหายไป ห้ามพิมพ์รหัสผ่านหรือข้อมูลส่วนตัวลงในแชทนะครับ",
    en: "This chat isn't saved on the site 🔒\n\nMessages live only in this window and disappear when you close or refresh. Please don't type passwords or personal data here.",
  },
  {
    id: "bot-broken",
    all: [["ตอบไม่ได้", "ทำไมไม่ตอบ", "บอทไม่ตอบ", "บอทเสีย", "บอทพัง", "บอทค้าง", "แชทไม่ตอบ", "แชทเสีย"]],
    th: "ขอโทษครับ บางครั้งระบบ AI ที่ใช้ตอบคำถามทั่วไปไม่พร้อม 🙏\n\n• การหาไฟล์ยังใช้ได้เสมอ: เช่น \"ITF week 10\"\n• คำถามพบบ่อยยังตอบได้: เช่น \"ตารางสอบ\", \"ล็อกอิน\"\n• ลองถามใหม่อีกครั้งในอีกสักครู่\n\nถ้ายังมีปัญหา แจ้งทีมงานที่ IG @chatann_ ได้ครับ",
    en: "Sorry — the AI behind general answers is sometimes unavailable 🙏\n\n• File search always works: e.g. \"ITF week 10\"\n• Common questions still work: e.g. \"exam schedule\", \"sign in\"\n• Try again in a moment\n\nStill stuck? Tell the team on IG @chatann_.",
  },
  {
    id: "hide-chat",
    all: [["ปิดแชท", "ซ่อนแชท", "ปุ่มแชท", "hide chat", "close chat", "ปิดบอท"]],
    th: "กดปุ่ม X มุมขวาบนของหน้าต่างแชท หรือกดปุ่มกลมมุมขวาล่างอีกครั้งเพื่อปิดครับ 👌",
    en: "Tap the X at the top right of this window, or the round button at the bottom right again, to close it 👌",
  },

  // ── about the site ──
  {
    id: "what-is-ihelp",
    all: [["ihelp", "ไอเฮลป์", "ไอเฮล", "เว็บนี้", "this site", "this website"], WHAT],
    th: "iHelp คือคลังเรียนรู้ของนักศึกษา IT สจล. ปี 1 ครับ 📚\n\n• สรุปเนื้อหา สไลด์ ชีท แบบฝึกหัด ของแต่ละวิชา\n• แบบทดสอบรายบท แบบทดสอบจับเวลา และข้อสอบจำลอง\n• ตารางสอบและผังที่นั่งสอบ\n• เครื่องมือ PSCP: โจทย์ รันโค้ด Python และสร้างไฟล์ส่งงาน\n\nเริ่มได้จากหน้ารายวิชาครับ 👇",
    en: "iHelp is a learning hub for 1st-year IT KMITL students 📚\n\n• Notes, slides, cheat sheets and exercises for each course\n• Chapter drills, timed quizzes and mock exams\n• Exam schedule and seat map\n• PSCP tools: problems, in-browser Python and submission files\n\nStart from the course list 👇",
    links: [page("รายวิชาทั้งหมด", "All courses", "/")],
  },
  {
    id: "who-made",
    all: [["ใครทำ", "ใครสร้าง", "ผู้สร้าง", "ผู้พัฒนา", "คนทำเว็บ", "คนทำ", "developer", "who made", "who built", "who created", "เจ้าของเว็บ", "owner"]],
    th: "iHelp สร้างโดย เจส IT24 (Chatan Petry) ครับ 🧑‍💻\n\n• IG: @chatann_\n• GitHub: Jesselpetry/ihelp\n\nแจ้งปัญหาหรือเสนอแนะได้ทั้งสองช่องทางครับ",
    en: "iHelp is made by Jes, IT24 (Chatan Petry) 🧑‍💻\n\n• IG: @chatann_\n• GitHub: Jesselpetry/ihelp\n\nReport problems or ideas through either.",
  },
  {
    id: "official",
    all: [["ทางการ", "official", "ของมหาลัย", "ของมหาวิทยาลัย", "ของคณะ", "ของสถาบัน", "ของ สจล", "เว็บคณะ"]],
    th: "iHelp เป็นเว็บที่นักศึกษาทำขึ้นเพื่อช่วยกันเรียนครับ ไม่ใช่ระบบทางการของคณะ 🙏\n\nเรื่องวันสอบ คะแนน หรือกำหนดส่งงาน ให้ยึดประกาศของคณะและอาจารย์เป็นหลักนะครับ",
    en: "iHelp is built by students to help each other study — it isn't an official faculty system 🙏\n\nFor exam dates, grades and deadlines, the faculty's and lecturers' announcements always come first.",
  },
  {
    id: "free",
    // Not a bare "free": "free time" is not a pricing question.
    all: [["ฟรีไหม", "ฟรีมั้ย", "ฟรีป่าว", "ใช้ฟรี", "เสียเงิน", "ราคา", "ค่าใช้จ่าย", "is it free", "for free", "free to use", "price", "จ่ายเงิน", "กี่บาท"]],
    th: "ใช้เว็บ iHelp ได้เลยครับ ไม่ต้องจ่ายเงิน 🎉\n\nบางส่วน เช่น คลังทรัพยากร ต้องเข้าสู่ระบบด้วยบัญชี @kmitl.ac.th ของคณะ IT ก่อน",
    en: "You can use iHelp without paying anything 🎉\n\nSome parts, like the course library, need you to sign in with your @kmitl.ac.th IT account.",
  },
  {
    id: "contact",
    all: [["ติดต่อ", "แจ้งปัญหา", "แจ้งบัค", "แจ้งบั๊ก", "แจ้ง bug", "รายงานปัญหา", "report", "contact", "บัค", "บั๊ก", "feedback", "ข้อเสนอแนะ", "เสนอแนะ", "ติชม", "แนะนำฟีเจอร์"]],
    th: "ติดต่อทีมงานได้ทาง IG @chatann_ ครับ 📮\n\n• แจ้งไฟล์หาย/เปิดไม่ได้: บอกชื่อวิชาและชื่อไฟล์\n• แจ้งบัค: บอกหน้าที่เจอ และแคปหน้าจอมาด้วย\n• ข้อเสนอแนะ: ส่งมาได้เลย หรือเปิด issue ที่ GitHub Jesselpetry/ihelp",
    en: "Reach the team on IG @chatann_ 📮\n\n• Missing/broken file: send the course and file name\n• Bug: say which page, with a screenshot\n• Ideas: send them over, or open an issue at GitHub Jesselpetry/ihelp",
  },
  {
    id: "year-2",
    all: [["ปี 2", "ปี2", "ปีสอง", "ปี 3", "ปี3", "ปี 4", "ปี4", "year 2", "year 3", "second year", "ปีอื่น", "ปีโต"]],
    th: "ตอนนี้ iHelp มีเนื้อหาของปี 1 ครับ 📚\n\n• ปี 1 เทอม 1 และ เทอม 2\n• วิชาลงข้ามคณะ EN-KMITL: ComPro และ General Chemistry\n\nพิมพ์ \"มีวิชาอะไรบ้าง\" เพื่อดูรายชื่อทั้งหมดได้ครับ",
    en: "iHelp currently covers 1st year 📚\n\n• Year 1, semesters 1 and 2\n• EN-KMITL electives: ComPro and General Chemistry\n\nType \"which courses\" for the full list.",
  },
  {
    id: "other-faculty",
    all: [["คณะอื่น", "ไม่ใช่ไอที", "ไม่ใช่ it", "ไม่ได้อยู่ไอที", "ไม่ได้อยู่ it", "other faculty", "นอกคณะ", "วิศวะ"]],
    th: "หน้าส่วนใหญ่เปิดดูได้ทุกคนครับ 👀\n\n• สรุปเนื้อหา แบบทดสอบ หน้ารายวิชา: ดูได้เลย\n• คลังทรัพยากร (ไฟล์ของแต่ละวิชา): ต้องล็อกอินบัญชี @kmitl.ac.th ที่รหัสนักศึกษาเป็นของคณะ IT\n\nถ้าล็อกอินด้วยบัญชีคณะอื่นจะเข้าคลังไม่ได้ครับ",
    en: "Most pages are open to everyone 👀\n\n• Notes, quizzes and course pages: open\n• The course library (files): needs a @kmitl.ac.th account with an IT-faculty student ID\n\nAccounts from other faculties can't open the library.",
  },
  {
    id: "update",
    all: [["อัปเดต", "อัพเดท", "อัพเดต", "update", "ของใหม่", "มีอะไรใหม่", "what's new", "whats new", "changelog", "เวอร์ชัน", "เวอร์ชั่น", "version"]],
    th: "ดูว่าเว็บอัปเดตอะไรบ้างได้ที่หน้า 'เวอร์ชัน' ครับ 🆕\n\nอยู่ที่เมนูด้านบน (มือถือ: ปุ่ม ☰) มีรายการเปลี่ยนแปลงของแต่ละเวอร์ชัน\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇",
    en: "See what changed on the 'Version' page 🆕\n\nIt's in the top menu (on mobile: the ☰ button), with the changes in each release.\n\nTap the button below to open it 👇",
    links: [page("เวอร์ชัน", "Version", "/version")],
  },
  {
    id: "language",
    // A bare "english" is the FE course ("Foundation English คืออะไร"), so the
    // question has to ask for a change of language.
    all: [
      ["เปลี่ยน", "สลับ", "switch", "change", "ปุ่ม"],
      ["ภาษา", "language", "th/en", "ไทย", "อังกฤษ", "english", "thai"],
    ],
    th: "สลับภาษาได้ที่ปุ่ม TH / EN มุมขวาบนครับ 🌐\n\nบนมือถือ กดปุ่ม ☰ แล้วเลือกภาษาด้านล่างของเมนู แชทนี้ก็จะตอบตามภาษาที่เลือกครับ",
    en: "Switch language with the TH / EN button at the top right 🌐\n\nOn mobile, open ☰ and pick the language at the bottom of the menu. This chat follows the language you choose.",
  },
  {
    id: "dark-mode",
    all: [["โหมดมืด", "dark mode", "darkmode", "ธีมมืด", "สีมืด", "light mode", "โหมดสว่าง", "เปลี่ยนธีม", "เปลี่ยนสี", "แสบตา", "ตาลาย", "พื้นหลังดำ", "พื้นหลังขาว"]],
    th: "เปลี่ยนธีมได้ที่ปุ่มรูปพระอาทิตย์/พระจันทร์มุมขวาบนครับ 🌙\n\nกดวนได้ 3 แบบ: สว่าง → มืด → ตามระบบ (ตามการตั้งค่าเครื่อง)",
    en: "Change the theme with the sun/moon button at the top right 🌙\n\nIt cycles through 3 modes: light → dark → system.",
  },
  {
    id: "install-app",
    // Both halves required: "ติดตั้ง python" is not about installing iHelp.
    all: [
      ["ติดตั้ง", "ลง", "install", "เพิ่ม", "add"],
      ["แอป", "แอพ", "app", "home screen", "หน้าจอโฮม", "หน้าจอหลัก", "ihelp", "เว็บนี้"],
    ],
    th: "ติดตั้ง iHelp เป็นแอปบนเครื่องได้ครับ 📱\n\n• Chrome / Edge: กดเมนู ⋮ → 'ติดตั้งแอป' หรือไอคอนติดตั้งในแถบที่อยู่\n• iPhone (Safari): กดปุ่มแชร์ → 'เพิ่มไปยังหน้าจอโฮม'\n• Android (Chrome): เมนู ⋮ → 'เพิ่มลงในหน้าจอหลัก'",
    en: "You can install iHelp as an app 📱\n\n• Chrome / Edge: menu ⋮ → 'Install app', or the install icon in the address bar\n• iPhone (Safari): Share → 'Add to Home Screen'\n• Android (Chrome): menu ⋮ → 'Add to Home screen'",
  },
  {
    id: "mobile",
    all: [["มือถือ", "โทรศัพท์", "mobile", "iphone", "ไอโฟน", "android", "แอนดรอยด์", "ไอแพด", "ipad", "แท็บเล็ต", "tablet"]],
    th: "ใช้ iHelp บนมือถือได้เลยครับ 📱\n\n• เมนูทั้งหมดอยู่ที่ปุ่ม ☰ มุมขวาบน\n• ภาษา เข้าสู่ระบบ และธีม อยู่ในเมนูนั้นด้วย\n• ติดตั้งเป็นแอปได้ ลองพิมพ์ \"ติดตั้งแอป\" เพื่อดูวิธี",
    en: "iHelp works on phones 📱\n\n• Every menu is under the ☰ button at the top right\n• Language, sign-in and theme are in there too\n• You can install it as an app — type \"install app\" to see how",
  },
  {
    id: "offline",
    all: [["ออฟไลน์", "offline", "ไม่มีเน็ต", "ไม่มีอินเทอร์เน็ต", "no internet", "เน็ตหลุด"]],
    th: "เว็บต้องต่ออินเทอร์เน็ตครับ 📶\n\nถ้าจะอ่านตอนไม่มีเน็ต ให้กดดาวน์โหลดไฟล์ในคลังทรัพยากรเก็บไว้ก่อนครับ",
    en: "The site needs an internet connection 📶\n\nTo read offline, download the files from the course library beforehand.",
  },
  {
    id: "integrity",
    all: [["เฉลยข้อสอบจริง", "ข้อสอบจริง", "ข้อสอบหลุด", "leak", "โกงข้อสอบ", "ลอกงาน", "ลอกการบ้าน", "ทุจริต", "cheat", "ทำการบ้านให้", "ทำงานให้หน่อย", "เขียนโค้ดให้", "ทำแทน", "ส่งงานแทน"]],
    th: "ขอโทษครับ เรื่องนี้ช่วยไม่ได้ 🙏\n\n• สื่อและข้อสอบจำลองมีไว้ทบทวนและเตรียมสอบ ไม่ใช่เฉลยข้อสอบจริง\n• เครื่องมือในเว็บไม่คิดแทน ไม่แก้โจทย์ และไม่ส่งงานให้ คุณต้องเขียนและส่งงานเอง\n\nถ้าอยากฝึก ลองแบบทดสอบรายบทหรือข้อสอบจำลองในหน้ารายวิชาได้เลยครับ",
    en: "Sorry, I can't help with that 🙏\n\n• Materials and mock exams are for revision, not real exam answers\n• The site's tools don't think, solve or submit for you — you write and submit your own work\n\nTo practise, try the chapter drills or mock exams on a course page.",
  },
  {
    id: "privacy",
    all: [["ข้อมูลส่วนตัว", "ความเป็นส่วนตัว", "privacy", "pdpa", "ปลอดภัยไหม", "ปลอดภัยมั้ย", "เก็บข้อมูลอะไร", "ข้อมูลของฉัน"]],
    th: "iHelp เก็บข้อมูลเท่าที่จำเป็นครับ 🔒\n\n• ล็อกอินผ่าน Google ของ @kmitl.ac.th (เว็บไม่เห็นรหัสผ่านของคุณ)\n• โปรไฟล์: ชื่อเล่นและรูปที่คุณตั้งเอง\n• ประวัติไฟล์ส่งงาน PSCP เก็บในเบราว์เซอร์ของคุณ ไม่ส่งออกไปไหน\n• ถ้าเชื่อม GitHub ตัว token เก็บในคุกกี้ที่สคริปต์ในหน้าอ่านไม่ได้\n\nอยากลบข้อมูล ติดต่อ IG @chatann_ ได้ครับ",
    en: "iHelp keeps only what it needs 🔒\n\n• Sign-in is through Google with @kmitl.ac.th (the site never sees your password)\n• Profile: the nickname and picture you set\n• PSCP submission history stays in your browser\n• If you connect GitHub, the token sits in a cookie page scripts can't read\n\nTo have your data removed, contact IG @chatann_.",
  },

  // ── account ──
  {
    id: "login-fail",
    all: [["ล็อกอินไม่ได้", "ล็อคอินไม่ได้", "login ไม่ได้", "loginไม่ได้", "เข้าสู่ระบบไม่ได้", "เข้าระบบไม่ได้", "เข้าสู่ระบบไม่สำเร็จ", "login failed", "can't login", "cannot login", "can't sign in", "unauthorized", "ล็อกอินไม่ผ่าน", "ล็อกอินแล้วเด้ง", "เข้าสู่ระบบแล้วเด้ง"]],
    th: "ลองเช็กตามนี้ครับ 🔍\n\n1. ใช้บัญชี @kmitl.ac.th เท่านั้น (Gmail ส่วนตัวใช้ไม่ได้)\n2. รหัสนักศึกษาต้องเป็นของคณะ IT (รหัสคณะ 07)\n3. ถ้าหน้าต่าง Google ไม่ขึ้น ให้อนุญาต pop-up หรือลองเบราว์เซอร์อื่น\n4. ลองล้างคุกกี้ของเว็บแล้วล็อกอินใหม่\n\nถ้ายังไม่ได้ แจ้ง IG @chatann_ พร้อมแคปหน้าจอได้ครับ",
    en: "Check these 🔍\n\n1. Use your @kmitl.ac.th account only (personal Gmail won't work)\n2. Your student ID must be IT faculty (faculty code 07)\n3. If the Google window doesn't open, allow pop-ups or try another browser\n4. Clear the site's cookies and sign in again\n\nStill stuck? Send a screenshot to IG @chatann_.",
  },
  {
    id: "login-account",
    all: [["gmail", "อีเมลส่วนตัว", "บัญชีส่วนตัว", "personal email", "บัญชีไหน", "อีเมลไหน", "which account", "@kmitl", "kmitl.ac.th", "อีเมลมหาลัย", "อีเมลสถาบัน"]],
    th: "ใช้บัญชี Google ของสถาบัน @kmitl.ac.th ครับ 🎓\n\nและรหัสนักศึกษาต้องเป็นของคณะ IT (รหัสคณะ 07) ถึงจะเข้าคลังทรัพยากรได้ บัญชี Gmail ส่วนตัวใช้ไม่ได้ครับ",
    en: "Use your institute Google account, @kmitl.ac.th 🎓\n\nThe student ID must be IT faculty (code 07) to open the library. Personal Gmail accounts won't work.",
  },
  {
    id: "login",
    all: [LOGIN],
    th: "เข้าสู่ระบบได้ที่ปุ่ม 'เข้าสู่ระบบ' มุมขวาบนครับ 🔑\n\n1. กด 'เข้าสู่ระบบ' (มือถือ: อยู่ในเมนู ☰)\n2. เลือกบัญชี Google @kmitl.ac.th ของคุณ\n3. ครั้งแรกจะให้ตั้งชื่อเล่นและรูปโปรไฟล์\n\nใช้ได้เฉพาะนักศึกษาคณะ IT (รหัสคณะ 07) ครับ",
    en: "Sign in with the 'Sign in' button at the top right 🔑\n\n1. Tap 'Sign in' (mobile: inside the ☰ menu)\n2. Choose your @kmitl.ac.th Google account\n3. The first time, set a nickname and profile picture\n\nOnly IT-faculty students (faculty code 07) can sign in.",
  },
  {
    id: "logout",
    all: [["ออกจากระบบ", "logout", "log out", "sign out", "signout", "ล็อกเอาท์", "ล็อกเอ้าท์", "ล็อคเอาท์"]],
    th: "กดไอคอนออกจากระบบ (รูปประตู/ลูกศร) ที่อยู่ถัดจากชื่อของคุณมุมขวาบนครับ 👋\n\nบนมือถือ เปิดเมนู ☰ ก่อนแล้วจะเห็นปุ่มนี้ครับ",
    en: "Tap the sign-out icon (door/arrow) next to your name at the top right 👋\n\nOn mobile, open the ☰ menu first.",
  },
  {
    id: "profile",
    all: [["โปรไฟล์", "profile", "ชื่อเล่น", "nickname", "รูปโปรไฟล์", "avatar", "เปลี่ยนชื่อ", "เปลี่ยนรูป", "ชื่อที่แสดง"]],
    th: "จัดการโปรไฟล์ได้จากชื่อของคุณมุมขวาบนครับ 🙂\n\n1. เข้าสู่ระบบก่อน\n2. กดที่ชื่อ/รูปของคุณมุมขวาบน จะไปหน้าโปรไฟล์\n3. กด 'แก้ไขโปรไฟล์' เพื่อเปลี่ยนชื่อเล่นหรือรูป\n\nครั้งแรกที่ล็อกอิน ระบบจะพาไปตั้งค่าโปรไฟล์ให้เองครับ",
    en: "Manage your profile from your name at the top right 🙂\n\n1. Sign in first\n2. Tap your name/picture to open your profile\n3. Tap 'Edit profile' to change your nickname or picture\n\nThe first time you sign in, you're taken to profile setup automatically.",
  },
  {
    id: "insider",
    all: [["insider", "ทีมงาน", "สิทธิ์พิเศษ", "admin role", "role", "บทบาท", "สมัครทีม", "เป็นทีมงาน", "ขอสิทธิ์"]],
    th: "ทีมงานคือคนที่ช่วยดูแลและเพิ่มเนื้อหาในเว็บครับ 🙌\n\nถ้าอยากช่วยทำเนื้อหา ติดต่อ IG @chatann_ ได้เลยครับ",
    en: "The team are the people who maintain and add content to the site 🙌\n\nWant to help with content? Contact IG @chatann_.",
  },
  {
    id: "delete-account",
    all: [["ลบบัญชี", "delete account", "ลบโปรไฟล์", "ลบข้อมูลของฉัน", "ลบข้อมูลตัวเอง"]],
    th: "ขอลบบัญชีหรือข้อมูลของคุณได้โดยติดต่อทีมงานที่ IG @chatann_ ครับ 🙏\n\nบอกรหัสนักศึกษาของคุณไปด้วยนะครับ",
    en: "To have your account or data deleted, contact the team on IG @chatann_ 🙏\n\nInclude your student ID.",
  },

  // ── finding files ──
  {
    id: "old-exams",
    // Insiders asking this get the files themselves: the file search answers first.
    all: [["ข้อสอบเก่า", "past exam", "past paper", "ข้อสอบปีก่อน", "old exam", "คลังข้อสอบ", "ข้อสอบย้อนหลัง", "ข้อสอบปีที่แล้ว", "ข้อสอบไฟนอล", "ข้อสอบมิดเทอม", "ข้อสอบกลางภาค", "ข้อสอบปลายภาค", "ข้อสอบ final", "ข้อสอบ midterm"]],
    th: "ข้อสอบเก่าไม่ได้เปิดให้ใช้งานทั่วไปครับ 🙏\n\nถ้าอยากฝึกทำข้อสอบ ในหน้ารายวิชามี:\n• ข้อสอบเสมือนจริง (พร้อมเฉลยแสดงวิธีทำ)\n• แบบทดสอบเร่งด่วน 10 นาที\n• คลังโจทย์รายบท\n\nพิมพ์ชื่อวิชา + \"ข้อสอบจำลอง\" เช่น \"MFIT ข้อสอบจำลอง\" ได้เลยครับ",
    en: "Past exams aren't open for general use 🙏\n\nTo practise, course pages have:\n• Mock exams (with worked solutions)\n• 10-minute speed quizzes\n• Chapter drills\n\nType a course + \"mock exam\", e.g. \"MFIT mock exam\".",
  },
  {
    id: "file-not-found",
    all: [["หาไม่เจอ", "ไม่เจอไฟล์", "หาไฟล์ไม่เจอ", "ไม่พบไฟล์", "ไม่มีไฟล์", "file not found", "can't find", "cannot find", "ไม่เจอเลย"]],
    th: "ลองแบบนี้ดูครับ 🔍\n\n1. พิมพ์รหัสย่อวิชา + week เช่น \"ITF week 10\" (แม่นกว่าชื่อเต็ม)\n2. หรือใช้รหัส 8 หลัก เช่น 06016402\n3. ถ้าเป็นฉบับปีก่อน กดปุ่ม 'ฉบับเก่า' ในคลังทรัพยากร\n4. เช็กว่าเข้าสู่ระบบแล้ว (คลังต้องล็อกอิน)\n\nถ้ายังไม่เจอ อาจยังไม่มีไฟล์นั้นในคลัง แจ้ง IG @chatann_ ได้ครับ",
    en: "Try this 🔍\n\n1. Course code + week, e.g. \"ITF week 10\" (works better than the full name)\n2. Or the 8-digit code, e.g. 06016402\n3. For last year's edition, tap 'Older' in the library\n4. Make sure you're signed in (the library needs it)\n\nStill missing? It may not be in the library yet — tell IG @chatann_.",
  },
  {
    id: "find-files",
    all: [["หาไฟล์", "ค้นหาไฟล์", "หาเอกสาร", "หาชีท", "find file", "หาสไลด์", "ไฟล์อยู่ไหน", "ไฟล์อยู่ตรงไหน", "เอกสารอยู่ไหน", "search file", "คลังทรัพยากร", "คลังไฟล์", "library อยู่"]],
    th: "หาไฟล์ได้ 2 ทางครับ 📂\n\n• ถามผม: พิมพ์วิชา + week/บทที่ เช่น \"ITF week 10\" จะได้ปุ่มเปิดไฟล์เลย\n• หาเอง: หน้าแรก → ค้นหาวิชา → กดการ์ดวิชา → 'คลังทรัพยากร'\n\nคลังทรัพยากรต้องเข้าสู่ระบบด้วยบัญชี @kmitl.ac.th ของคณะ IT ก่อนครับ",
    en: "Two ways to find files 📂\n\n• Ask me: course + week/chapter, e.g. \"ITF week 10\", and you get open buttons\n• Browse: home → search the course → tap its card → 'Resources'\n\nThe library needs you to sign in with your @kmitl.ac.th IT account.",
    links: [page("รายวิชาทั้งหมด", "All courses", "/")],
  },
  {
    id: "download",
    all: [["ดาวน์โหลด", "โหลดไฟล์", "download", "เซฟไฟล์", "save file", "บันทึกไฟล์", "โหลดเก็บ", "โหลดยังไง"]],
    th: "ดาวน์โหลดไฟล์ได้จากคลังทรัพยากรครับ ⬇️\n\n1. เปิดหน้ารายวิชา → 'คลังทรัพยากร'\n2. กดปุ่มดาวน์โหลดข้างการ์ดไฟล์ หรือกดเปิดไฟล์แล้วกดดาวน์โหลดในหน้าตัวอย่าง\n\nหรือถามผมเป็นวิชา + week เพื่อเปิดไฟล์ตรงๆ เลยก็ได้ครับ",
    en: "Download from the course library ⬇️\n\n1. Open the course page → 'Resources'\n2. Tap the download button beside a file card, or open the file and download from the preview\n\nOr ask me with a course + week to jump straight to the file.",
  },
  {
    id: "file-broken",
    all: [["เปิดไฟล์ไม่ได้", "ไฟล์เสีย", "เปิดไม่ขึ้น", "ไฟล์ไม่ขึ้น", "pdf ไม่ขึ้น", "pdfไม่ขึ้น", "ไฟล์พัง", "broken file", "file error", "ไฟล์ error", "ไฟล์โหลดไม่ขึ้น", "ภาพไม่ขึ้น", "รูปไม่ขึ้น"]],
    th: "ลองแก้ตามนี้ครับ 🛠️\n\n1. รีเฟรชหน้า แล้วเปิดไฟล์ใหม่\n2. กดดาวน์โหลดแล้วเปิดด้วยแอปอ่าน PDF แทน\n3. ลองเบราว์เซอร์อื่น (Chrome / Edge)\n4. เช็กว่ายังล็อกอินอยู่\n\nถ้ายังเปิดไม่ได้ แจ้งชื่อวิชาและชื่อไฟล์ไปที่ IG @chatann_ ได้ครับ",
    en: "Try these 🛠️\n\n1. Refresh and open the file again\n2. Download it and open it in a PDF app\n3. Try another browser (Chrome / Edge)\n4. Check you're still signed in\n\nStill broken? Send the course and file name to IG @chatann_.",
  },
  {
    id: "print",
    all: [["ปริ้น", "ปริ้นท์", "พริ้น", "พิมพ์ไฟล์", "print", "พิมพ์ออกมา", "พิมพ์เอกสาร"]],
    th: "ดาวน์โหลดไฟล์ PDF จากคลังทรัพยากรแล้วสั่งพิมพ์จากแอปอ่าน PDF ได้เลยครับ 🖨️\n\nบางชีทมีทั้งฉบับย่อและฉบับพิมพ์ ให้เลือกฉบับพิมพ์จะอ่านง่ายกว่าครับ",
    en: "Download the PDF from the library and print it from your PDF app 🖨️\n\nSome sheets come in a compact and a print edition — the print one reads better on paper.",
  },
  {
    id: "old-edition",
    all: [["ฉบับเก่า", "ฉบับปีก่อน", "เวอร์ชันเก่า", "old version", "last year", "ปีที่แล้ว", "ของปีก่อน", "ของรุ่นพี่"]],
    th: "ไฟล์ฉบับปีก่อนยังอยู่ครับ 🗃️\n\nใน ITF และ ICS คลังเปิดเป็นมุมมองรายสัปดาห์ ฉบับเก่าถูกซ่อนไว้หลังปุ่ม 'ฉบับเก่า' กดเพื่อแสดงได้เลยครับ",
    en: "Last year's editions are still there 🗃️\n\nIn ITF and ICS the library opens on a weekly view; older editions sit behind the 'Older' button.",
  },
  {
    id: "exam-scope",
    all: [["ขอบเขตสอบ", "ออกสอบ", "สอบอะไรบ้าง", "เนื้อหาสอบ", "สอบถึงไหน", "สอบบทไหน", "exam scope", "ก่อนมิดเทอม", "หลังมิดเทอม", "สัดส่วนคะแนน", "เกณฑ์คะแนน", "เก็บคะแนน"]],
    th: "ดูขอบเขตสอบได้ในหน้ารายวิชาครับ 🎯\n\n• 'เข้าใจวิชานี้ใน 3 นาที': ขอบเขตสอบและสัดส่วนคะแนน\n• คลังทรัพยากร: แบ่งไฟล์เป็นก่อนมิดเทอม / หลังมิดเทอม ให้แล้ว\n\nพิมพ์ชื่อวิชา + \"ขอบเขตสอบ\" เช่น \"ITF ขอบเขตสอบ\" เพื่อเปิดหน้านั้นเลยครับ",
    en: "Exam scope is on each course page 🎯\n\n• 'This Course in 3 Minutes': exam scope and grade weighting\n• The library splits files into before / after midterm\n\nType a course + \"exam scope\", e.g. \"ITF exam scope\", to open it.",
  },
  {
    id: "week-view",
    all: [["มุมมองรายสัปดาห์", "ดูตามสัปดาห์", "ดูรายสัปดาห์", "week view", "weekly view", "แยกสัปดาห์", "เรียงตามสัปดาห์"]],
    th: "ITF และ ICS เปิดคลังเป็นมุมมองรายสัปดาห์ครับ 📅\n\n• ตารางเดียวแบ่งหัวข้อตามสัปดาห์\n• มีแถบกดกระโดดไปสัปดาห์ที่ต้องการ\n• ICS นับ week ใหม่หลังมิดเทอม (ครึ่งหลัง week 1–7)\n\nหรือพิมพ์ \"ITF week 10\" ให้ผมเปิดให้ก็ได้ครับ",
    en: "ITF and ICS open the library on a weekly view 📅\n\n• One table with a heading per week\n• A bar to jump to any week\n• ICS restarts week numbers after the midterm (2nd half weeks 1–7)\n\nOr type \"ITF week 10\" and I'll open it.",
  },
  {
    id: "source",
    all: [["ต้นทาง", "onlearn", "ออนเลิร์น", "ไฟล์ต้นฉบับ", "ไฟล์จากอาจารย์"]],
    th: "ไฟล์ที่มาจาก OnLearn มีปุ่ม 'ต้นทาง' ครับ 🔗\n\nกดแล้วจะเปิดหน้าไฟล์ต้นฉบับใน OnLearn (ต้องล็อกอิน OnLearn ด้วย)",
    en: "Files that come from OnLearn have a 'Source' button 🔗\n\nIt opens the original file page on OnLearn (you'll need to be signed in there).",
  },
  {
    id: "video",
    all: [["คลิป", "วิดีโอ", "วีดีโอ", "video", "อัดคลิป", "บันทึกการสอน", "lecture recording", "คลิปย้อนหลัง", "ดูย้อนหลัง"]],
    th: "คลิปบรรยายมีใน ITF ครับ 🎬\n\nในคลังทรัพยากรของ ITF (มุมมองรายสัปดาห์) สัปดาห์ที่มีคลิปจะมีลิงก์ไปที่ OnLearn ต้องเข้าสู่ระบบก่อนถึงจะเห็นครับ",
    en: "Lecture recordings are available for ITF 🎬\n\nIn ITF's library (weekly view), weeks with a recording link to it on OnLearn. Sign in to see them.",
  },
  {
    id: "lab-sheet",
    all: [["ใบงาน", "ใบแล็บ", "ใบแลป", "ใบทดลอง", "lab sheet", "worksheet"]],
    th: "ใบงานและใบแล็บอยู่ในคลังทรัพยากรของแต่ละวิชาครับ 🧪\n\nพิมพ์วิชา + week เช่น \"ICS week 3 ใบงาน\" หรือ \"ITF lab 10\" ผมจะหาให้พร้อมปุ่มเปิดครับ",
    en: "Lab sheets are in each course's library 🧪\n\nType a course + week, e.g. \"ICS week 3 lab\" or \"ITF lab 10\", and I'll find them with open buttons.",
  },
  {
    id: "course-modules",
    all: [["โมดูล", "module", "หน้ารายวิชามีอะไร", "ในวิชามีอะไร", "เร็วๆ นี้", "เร็วๆนี้", "coming soon", "11 ช่อง"]],
    th: "หน้ารายวิชามี 11 ช่อง เรียงจากเข้าใจ → ย่อ → ฝึก → พิสูจน์ครับ 🧭\n\n• เข้าใจ: ภาพรวม 3 นาที · แผนที่เนื้อหา · สรุปเนื้อหา\n• ย่อ: สรุปเร่งด่วน 10 นาที · บัตรคำ\n• ฝึก: คลังโจทย์รายบท · แบบทดสอบ 10 นาที · ห้องปฏิบัติ\n• พิสูจน์: ข้อสอบเสมือนจริง · ห้องซ่อมจุดอ่อน · คลังทรัพยากร\n\nช่องที่ขึ้น 'เร็วๆ นี้' คือวิชานั้นยังไม่มีเนื้อหาส่วนนั้นครับ",
    en: "Each course page has 11 modules: understand → compress → practise → prove 🧭\n\n• Understand: 3-minute overview · syllabus map · study notes\n• Compress: 10-minute cram sheet · key cards\n• Practise: chapter drill · 10-minute quiz · applied practice\n• Prove: mock exam · weak-spot room · resources\n\n'Soon' means that course doesn't have that part yet.",
  },
  {
    id: "practice",
    all: [["แบบทดสอบ", "ควิซ", "quiz", "ฝึกทำโจทย์", "ทดสอบตัวเอง", "ข้อสอบจำลอง", "ข้อสอบเสมือน", "mock", "ซ้อมสอบ", "ทำข้อสอบ", "แนวข้อสอบ", "แบบฝึกหัด"]],
    th: "ฝึกทำโจทย์ได้ในหน้ารายวิชาครับ ✍️\n\n• คลังโจทย์รายบท (ITF, ICS, MFIT, COMPRO, CHEM)\n• แบบทดสอบเร่งด่วน 10 นาที (ICS, MFIT)\n• ข้อสอบเสมือนจริง พร้อมเฉลย (ICS, MFIT, COMPRO)\n• โจทย์ PSCP รันโค้ดได้ที่ /pscp\n\nพิมพ์ชื่อวิชา + ชื่อส่วนนั้น เช่น \"MFIT ข้อสอบจำลอง\" ผมจะเปิดให้ครับ",
    en: "Practise from each course page ✍️\n\n• Chapter drills (ITF, ICS, MFIT, COMPRO, CHEM)\n• 10-minute speed quiz (ICS, MFIT)\n• Mock exams with solutions (ICS, MFIT, COMPRO)\n• PSCP problems you can run at /pscp\n\nType a course + the part, e.g. \"MFIT mock exam\".",
  },
  {
    id: "cram",
    all: [["อ่านไม่ทัน", "พรุ่งนี้สอบ", "ใกล้สอบ", "อ่านก่อนสอบ", "cram", "อ่านหนังสือไม่ทัน", "สอบพรุ่งนี้", "เหลือเวลาน้อย", "สรุปเร่งด่วน"]],
    th: "ใกล้สอบแล้วลองแบบนี้ครับ ⏱️\n\n1. 'สรุปเร่งด่วน 10 นาที' ของวิชานั้น\n2. 'บัตรคำ' ทบทวนสูตร/คำสำคัญ\n3. 'แบบทดสอบเร่งด่วน 10 นาที' เช็กความเข้าใจ\n\nพิมพ์ชื่อวิชา + \"สรุปเร่งด่วน\" เช่น \"ICS สรุปเร่งด่วน\" ผมจะเปิดให้ครับ สู้ๆ ครับ 💪",
    en: "Exam soon? Try this ⏱️\n\n1. The course's '10-Minute Cram Sheet'\n2. 'Key Cards' for formulas and terms\n3. The '10-Minute Speed Quiz' to check yourself\n\nType a course + \"cram\", e.g. \"ICS cram\", and I'll open it. Good luck 💪",
  },
  {
    id: "summary",
    all: [["สรุปเนื้อหา", "ชีทสรุป", "สรุปบทเรียน", "summary", "โน้ตสรุป", "สรุปวิชา"]],
    th: "สรุปเนื้อหาอยู่ในหน้ารายวิชาครับ 📝\n\n• 'สรุปเนื้อหา': ฉบับเต็มพร้อมสารบัญด้านข้าง\n• 'สรุปเร่งด่วน 10 นาที': ฉบับย่อก่อนสอบ\n• ชีทสรุปไฟล์ PDF: อยู่ในคลังทรัพยากร\n\nพิมพ์ชื่อวิชา + \"สรุป\" เช่น \"DSA สรุป\" ผมจะเปิดให้ครับ",
    en: "Notes are on each course page 📝\n\n• 'Study Notes': the full version with a side table of contents\n• '10-Minute Cram Sheet': the short pre-exam version\n• PDF cheat sheets: in the library\n\nType a course + \"summary\", e.g. \"DSA summary\", and I'll open it.",
  },
  {
    id: "cards",
    all: [["บัตรคำ", "บัตรสูตร", "flashcard", "flash card", "แฟลชการ์ด"]],
    th: "บัตรคำ / บัตรสูตร ยังไม่เปิดใช้งานครับ 🃏\n\nช่องนี้ขึ้นว่า 'เร็วๆ นี้' อยู่ทุกวิชา ระหว่างนี้ลองใช้แทนได้:\n• สรุปเร่งด่วน 10 นาที (ICS, MFIT)\n• ชีทสรุปในคลังทรัพยากร\n\nพิมพ์ เช่น \"ICS สรุปเร่งด่วน\" ได้เลยครับ",
    en: "Key cards aren't available yet 🃏\n\nEvery course still shows 'Soon' for them. In the meantime:\n• 10-Minute Cram Sheet (ICS, MFIT)\n• Cheat sheets in the course library\n\nTry e.g. \"ICS cram\".",
  },
  {
    id: "weak-spot",
    all: [["จุดอ่อน", "weak spot", "weakspot", "ห้องซ่อม", "ข้อที่ผิด", "ทบทวนข้อผิด"]],
    th: "'ห้องซ่อมจุดอ่อน' ยังไม่เปิดใช้งานครับ 🩹\n\nช่องนี้ขึ้นว่า 'เร็วๆ นี้' อยู่ทุกวิชา ระหว่างนี้ลองทบทวนด้วย:\n• คลังโจทย์รายบท (ITF, ICS, MFIT, COMPRO, CHEM)\n• ข้อสอบเสมือนจริง (ICS, MFIT, COMPRO)\n\nพิมพ์ เช่น \"MFIT ข้อสอบจำลอง\" ได้เลยครับ",
    en: "The 'Weak-Spot Room' isn't available yet 🩹\n\nEvery course still shows 'Soon'. To revise meanwhile:\n• Chapter drills (ITF, ICS, MFIT, COMPRO, CHEM)\n• Mock exams (ICS, MFIT, COMPRO)\n\nTry e.g. \"MFIT mock exam\".",
  },
  {
    id: "search-box",
    all: [["ค้นหาวิชา", "ช่องค้นหา", "ช่อง search", "หาวิชา", "search วิชา", "search course"]],
    th: "ช่องค้นหาวิชาอยู่ที่หน้าแรกครับ 🔎\n\nพิมพ์ได้ทั้งรหัสย่อ (PSCP), รหัส 8 หลัก (06066303) หรือชื่อวิชาไทย/อังกฤษ แล้วกดการ์ดวิชาที่ขึ้นมาได้เลยครับ",
    en: "The course search is on the home page 🔎\n\nType a short code (PSCP), the 8-digit code (06066303) or the Thai/English name, then tap the course card.",
    links: [page("รายวิชาทั้งหมด", "All courses", "/")],
  },

  // ── exam schedule ──
  {
    id: "exam-calendar",
    all: [["ปฏิทิน", "calendar", ".ics", "ไฟล์ ics", "ics file", "google calendar", "เพิ่มลงปฏิทิน"]],
    th: "เพิ่มวันสอบลงปฏิทินได้ครับ 📆\n\n1. เปิด 'ตารางสอบ' แล้วค้นหารหัสนักศึกษา\n2. กด 'เพิ่มลงปฏิทิน (.ics)'\n3. Google Calendar (เว็บ): ตั้งค่า → นำเข้าและส่งออก → นำเข้า → เลือกไฟล์ .ics\n4. iPhone: เปิดไฟล์ .ics → 'เพิ่มทั้งหมด'\n\nกดปุ่มด้านล่างเพื่อไปหน้าตารางสอบครับ 👇",
    en: "Add your exams to a calendar 📆\n\n1. Open 'Exams' and search your student ID\n2. Tap 'Add to calendar (.ics)'\n3. Google Calendar (web): Settings → Import & export → Import → pick the .ics\n4. iPhone: open the .ics → 'Add All'\n\nTap below to open the exam schedule 👇",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    id: "exam-seat",
    all: [["ผังที่นั่ง", "ที่นั่งสอบ", "นั่งตรงไหน", "seat", "เลขที่นั่ง", "โต๊ะสอบ", "นั่งไหน"]],
    th: "ดูผังที่นั่งสอบได้ในหน้าตารางสอบครับ 💺\n\n1. ค้นหารหัสนักศึกษาของคุณ\n2. กด 'ดูผังที่นั่ง' ที่วิชาที่ต้องการ\n3. ที่นั่งของคุณจะถูกไฮไลต์ แตะที่นั่งอื่นเพื่อดูเพื่อนร่วมห้อง\n\nถ้าขึ้น 'รอประกาศผังทางการ' แปลว่ายังไม่มีผังของห้องนั้นครับ",
    en: "See your exam seat on the exam schedule page 💺\n\n1. Search your student ID\n2. Tap 'View seat map' on the exam\n3. Your seat is highlighted; tap other seats to see classmates\n\n'Waiting for the official map' means that room's map isn't out yet.",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    id: "exam-friend",
    all: [["ตารางเพื่อน", "ตารางสอบเพื่อน", "ดูของเพื่อน", "ของเพื่อน", "friend's schedule"]],
    th: "ดูตารางสอบของเพื่อนได้ครับ 👥\n\nพิมพ์รหัสนักศึกษาของเพื่อนในช่องค้นหาที่หน้าตารางสอบ ดูเสร็จกด 'กลับไปตารางของฉัน' ได้เลยครับ",
    en: "You can look up a friend's exams 👥\n\nType their student ID into the search on the exam schedule page, then tap 'Back to my schedule'.",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    id: "exam-copy",
    all: [["คัดลอกตาราง", "copy ตาราง", "ก๊อปตาราง", "ก็อปตาราง", "copy table", "แชร์ตารางสอบ", "ส่งตารางสอบ"]],
    th: "กด 'คัดลอกตาราง' ในหน้าตารางสอบ แล้ววางในแชทหรือโน้ตได้เลยครับ 📋",
    en: "Tap 'Copy table' on the exam schedule page, then paste it into a chat or note 📋",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    id: "exam-not-found",
    all: [["ตารางสอบไม่ขึ้น", "ไม่เจอตารางสอบ", "ไม่พบข้อมูลที่นั่ง", "ตารางสอบผิด", "ไม่มีตารางสอบ", "รหัสไม่เจอ", "หาตารางสอบไม่เจอ"]],
    th: "ลองเช็กตามนี้ครับ 🔍\n\n1. พิมพ์รหัสนักศึกษาให้ครบ 8 หลัก\n2. เลือกให้ถูกว่ากลางภาคหรือปลายภาค\n3. ถ้าขึ้น 'รอประกาศผังทางการ' แปลว่ายังไม่ประกาศ\n\nข้อมูลในเว็บอาจคลาดเคลื่อน ให้ยึดประกาศทางการของคณะเป็นหลักนะครับ",
    en: "Check these 🔍\n\n1. Enter all 8 digits of the student ID\n2. Pick midterm or final correctly\n3. 'Waiting for the official map' means it isn't announced yet\n\nThe faculty's official announcement always wins if anything differs.",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    id: "exam-all",
    all: [["ตารางรวม", "ทั้งคณะ", "ตารางสอบทั้งหมด", "all exams", "ทุกวิชา"], ["สอบ", "exam"]],
    th: "ดูตารางสอบรวมทั้งคณะได้ครับ 🗓️\n\nในหน้าตารางสอบ เลือก 'ตารางรวมทั้งคณะ' กรองตามวันได้ และค้นหาด้วยรหัสวิชา ชื่อวิชา หรือห้องสอบได้ครับ",
    en: "You can see the whole faculty's exams 🗓️\n\nOn the exam schedule page pick 'Whole faculty', filter by day, and search by course code, name or room.",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    // Two groups, so a course name between the words doesn't break it:
    // "สอบ ICS วันไหน", "what room is my ITF exam".
    id: "exam-when",
    all: [
      ["สอบ", "exam"],
      ["วันไหน", "วันที่", "กี่โมง", "เมื่อไหร่", "ห้องไหน", "ห้องสอบ", "ที่ไหน", "ที่นั่ง", "ผัง", "ตาราง", "when", "room", "seat"],
    ],
    th: "ดูวันและห้องสอบได้ที่เมนู 'ตารางสอบ' ด้านบนครับ 📅\n\n1. พิมพ์รหัสนักศึกษา 8 หลัก (ถ้าล็อกอินอยู่จะขึ้นให้อัตโนมัติ)\n2. เลือกสอบกลางภาค / ปลายภาค\n3. กด 'ดูผังที่นั่ง' เพื่อดูที่นั่งของตัวเอง\n\nยึดประกาศทางการของคณะเป็นหลักนะครับ 👇",
    en: "Your exam dates and rooms are under 'Exams' in the top menu 📅\n\n1. Enter your 8-digit student ID (automatic if you're signed in)\n2. Pick midterm / final\n3. Tap 'View seat map' for your seat\n\nThe faculty's official announcement always wins 👇",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },
  {
    id: "exam-schedule",
    all: [["ตารางสอบ", "exam schedule", "วันสอบ", "สอบวันไหน", "สอบวันที่", "สอบกี่โมง", "ห้องสอบ", "สอบที่ไหน", "สอบห้อง", "สอบเมื่อไหร่", "สอบมิดเทอม", "สอบไฟนอล", "สอบกลางภาค", "สอบปลายภาค"]],
    th: "ดูตารางสอบได้ที่เมนู 'ตารางสอบ' ด้านบนครับ 📅\n\n1. พิมพ์รหัสนักศึกษา 8 หลัก (ถ้าล็อกอินอยู่จะขึ้นให้อัตโนมัติ)\n2. เลือกสอบกลางภาค / ปลายภาค\n3. กด 'ดูผังที่นั่ง' หรือ 'เพิ่มลงปฏิทิน (.ics)' ได้\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇",
    en: "Open 'Exams' in the top menu 📅\n\n1. Enter your 8-digit student ID (shown automatically if you're signed in)\n2. Pick midterm / final\n3. Tap 'View seat map' or 'Add to calendar (.ics)'\n\nTap below to open it 👇",
    links: [page("ตารางสอบ", "Exam schedule", "/exam-schedule")],
  },

  // ── PSCP ──
  {
    id: "pscp-submit-oj",
    all: [["ส่งงานให้", "ส่งเข้า oj", "ส่ง oj ให้", "ส่ง ijudge", "submit ให้", "ส่งให้อัตโนมัติ", "ส่งโค้ดให้"]],
    th: "เว็บไม่ส่งงานเข้า OJ ให้ครับ 🙅\n\nเครื่องมือในเว็บแค่ช่วยจัดไฟล์ที่คุณเขียนเองให้ตรง template คุณต้องส่งงานที่ iJudge เอง (ถ้าอยากส่งจาก VS Code ดู PSCP Pro ที่ /pro)",
    en: "The site never submits to the OJ for you 🙅\n\nIts tools only format files you wrote yourself into the template; you submit on iJudge yourself (to submit from VS Code, see PSCP Pro at /pro).",
    links: [page("PSCP Pro", "PSCP Pro", "/pro")],
  },
  {
    id: "pscp-pro",
    all: [["vs code", "vscode", "pscp pro", "ส่วนขยาย", "extension", "ส่งจาก vs"]],
    th: "PSCP Pro คือส่วนขยาย VS Code สำหรับวิชา PSCP ครับ 🧩\n\n• รันเทสต์เคสในเครื่อง เห็นผล pass / fail ทันที\n• เตือนคำที่ห้ามใช้/ต้องมี ก่อนส่ง\n• ส่งงานจาก VS Code ตรงเข้า iJudge ด้วยบัญชีของคุณเอง\n\nดูรายละเอียดที่หน้า PSCP Pro ครับ 👇",
    en: "PSCP Pro is a VS Code extension for PSCP 🧩\n\n• Run test cases locally and see pass / fail at once\n• Warns about banned/required words before you submit\n• Submit from VS Code straight to iJudge with your own account\n\nDetails on the PSCP Pro page 👇",
    links: [page("PSCP Pro", "PSCP Pro", "/pro")],
  },
  {
    id: "pscp-run",
    all: [["รันโค้ด", "รันโปรแกรม", "run code", "ตรวจโค้ด", "เทสโค้ด", "test case", "เทสเคส", "รัน python", "รันpython", "ลองรัน", "compiler", "คอมไพล์", "workspace"]],
    th: "รันโค้ด Python ในเบราว์เซอร์ได้ที่หน้า PSCP ครับ 🐍\n\n1. เปิดเมนู 'PSCP'\n2. กดโจทย์ที่ต้องการ จะเปิดพื้นที่ทำงาน\n3. เขียนโค้ดแล้วกดรัน เพื่อตรวจกับเทสเคสได้เลย\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇",
    en: "Run Python in your browser on the PSCP page 🐍\n\n1. Open 'PSCP' in the menu\n2. Tap a problem to open its workspace\n3. Write code and run it against the test cases\n\nTap below to open it 👇",
    links: [page("PSCP", "PSCP", "/pscp")],
  },
  {
    id: "pscp-recommended",
    all: [["โจทย์แนะนำ", "recommended", "14 ข้อ"]],
    th: "โจทย์แนะนำ PSCP มี 14 ข้อครับ ⭐\n\nแต่ละข้อมีคำอธิบายโจทย์ เทคนิค Python ที่ใช้ เทสเคส เฉลย และควิซทดสอบตัวเอง\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇",
    en: "There are 14 PSCP recommended problems ⭐\n\nEach has an explanation, the Python technique, test cases, a solution and a self-test quiz.\n\nTap below to open them 👇",
    links: [page("โจทย์แนะนำ", "Recommended problems", "/recommended")],
  },
  {
    id: "pscp-files",
    all: [["submission", "reflection", "learning log", "ai_reflection", "ไฟล์ส่งงาน", "รีเฟลก", "รีเฟล็ก", "รีเฟลค", "ล็อกการเรียน", "learning-log", "ซับมิชชัน"]],
    th: "สร้างไฟล์ submission.md และ ai_reflection.md ได้ทีละขั้นตอนครับ 📄\n\n1. ตอบคำถามตาม template ทางการของวิชา (เขียนเอง)\n2. ดูตัวอย่างก่อน แล้วกดดาวน์โหลด\n3. แบบร่างบันทึกอัตโนมัติในเบราว์เซอร์ แยกตามโจทย์\n4. ไฟล์ที่เคยสร้างดูย้อนหลังได้ที่ 'ประวัติ'\n\nเลือกไฟล์ที่จะสร้างด้านล่างได้เลยครับ 👇",
    en: "Build submission.md and ai_reflection.md step by step 📄\n\n1. Answer the official template's questions (in your own words)\n2. Preview, then download\n3. Drafts save automatically in your browser, per problem\n4. Past files are kept in 'History'\n\nPick which file to make 👇",
    links: [page("สร้าง submission.md", "Build submission.md", "/make/submission"), page("สร้าง ai_reflection.md", "Build ai_reflection.md", "/make/reflection"), page("ประวัติไฟล์", "History", "/history")],
  },
  {
    id: "pscp-history",
    all: [["ประวัติไฟล์", "ไฟล์ที่เคยสร้าง", "ประวัติการสร้าง", "หน้าประวัติ", "history page", "my history", "file history"]],
    th: "ไฟล์ส่งงานที่เคยสร้างดูได้ที่หน้า 'ประวัติ' ครับ 🕘\n\nเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น ดูย้อนหลัง โหลดซ้ำ หรือลบได้ (ถ้าล้างข้อมูลเบราว์เซอร์ ประวัติจะหายนะครับ)",
    en: "Files you've generated are on the 'History' page 🕘\n\nThey're stored only in your browser — view, re-download or delete them (clearing browser data wipes them).",
    links: [page("ประวัติไฟล์", "History", "/history")],
  },
  {
    id: "pscp-github",
    all: [["github", "กิตฮับ", "กิทฮับ", "commit", "คอมมิต", "push ขึ้น", "push ไฟล์", "push งาน", "push code", "repo"]],
    th: "Push ไฟล์ส่งงานขึ้น GitHub ได้ครับ 🐙 (ไม่บังคับ)\n\n1. กด 'เชื่อมต่อ GitHub' ที่แถบด้านบนของหน้า PSCP หรือในหน้าสร้างไฟล์\n2. เลือก repository ปลายทาง\n3. ไฟล์จะถูก push ไปที่ oj<id>/submission.md และ oj<id>/ai_reflection.md\n\nแก้ไฟล์ใน repo ได้ที่หน้า /repo ครับ",
    en: "You can push submission files to GitHub 🐙 (optional)\n\n1. Tap 'Connect GitHub' on the PSCP top bar or in the file builder\n2. Pick the target repository\n3. Files go to oj<id>/submission.md and oj<id>/ai_reflection.md\n\nEdit files in your repo at /repo.",
    links: [page("PSCP", "PSCP", "/pscp"), page("แก้ไฟล์ใน repo", "Edit repo files", "/repo")],
  },
  {
    id: "pscp-guidelines",
    all: [["ai guideline", "ai-guideline", "แนวทางใช้ ai", "แนวทางการใช้ ai", "หนังสือ ai", "ห้องสมุด"]],
    th: "อ่านเอกสาร AI-Guidelines-PSCP ทั้งชุดแบบหนังสือได้ที่ 'คลังเรียนรู้' ครับ 📖\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇",
    en: "Read the whole AI-Guidelines-PSCP set as a book in the 'Library' 📖\n\nTap below to open it 👇",
    links: [page("คลังเรียนรู้", "Library", "/library")],
  },
  {
    id: "pscp-pair",
    all: [["pair", "แพร์", "จับคู่", "ฟอร์มเช็คชื่อ", "เช็คชื่อ", "ทางลัด", "shortcut"]],
    th: "ลิงก์ประจำสัปดาห์ของ PSCP เช่น รายชื่อคู่ Pair programming และฟอร์มเช็คชื่อ อยู่ที่ 'ทางลัด' ด้านบนของหน้า PSCP ครับ 🔗",
    en: "PSCP's weekly links — pair lists, attendance forms — are in the shortcuts at the top of the PSCP page 🔗",
    links: [page("PSCP", "PSCP", "/pscp")],
  },
  {
    id: "pscp-deadline",
    all: [["ijudge", "ไอจัดจ์", "ไอจัด", "กำหนดส่ง", "deadline", "หมดเขต", "วันส่งงาน", "รายการโจทย์", "โจทย์ pscp", "โจทย์ oj"]],
    th: "รายการโจทย์ iJudge พร้อมกำหนดส่งอยู่ที่หน้า PSCP ครับ 🗒️\n\nมีระดับความยาก วันหมดเขต ป้าย Learning Log และแท็บกรองรายสัปดาห์ กดโจทย์เพื่อเปิดพื้นที่ทำงานได้เลย\n\nกดปุ่มด้านล่างเพื่อเปิดครับ 👇",
    en: "The iJudge problem list with deadlines is on the PSCP page 🗒️\n\nIt shows difficulty, due date, Learning Log badges and weekly tabs; tap a problem to open its workspace.\n\nTap below to open it 👇",
    links: [page("PSCP", "PSCP", "/pscp")],
  },
  {
    id: "pink",
    all: [["สีชมพู", "ชมพู", "pink"]],
    th: "หน้า PSCP ใช้ธีมสีชมพูประจำวิชาครับ 🌸\n\nหน้าอื่นใช้สีน้ำเงินตามปกติ แชทนี้ก็เปลี่ยนสีตามหน้าที่เปิดอยู่ครับ",
    en: "PSCP pages use the course's pink theme 🌸\n\nOther pages stay blue, and this chat follows the page you're on.",
  },

  // ── sharing ──
  {
    id: "upload",
    // The "…ไฟล์" forms outscore download's "โหลดไฟล์", which sits inside them.
    all: [["อัปโหลดไฟล์", "อัพโหลดไฟล์", "อัปโหลด", "อัพโหลด", "upload", "แชร์ไฟล์", "ฝากไฟล์", "แชร์เข้าคลัง", "เพิ่มไฟล์", "ลงไฟล์", "ส่งไฟล์เข้า"]],
    ...UPLOAD_ANSWER,
  },
  {
    id: "contribute",
    all: [["อยากช่วย", "ร่วมพัฒนา", "contribute", "ช่วยทำเว็บ", "ส่งสรุปให้", "มีไฟล์จะให้", "มีสรุปจะให้", "ช่วยเพิ่มเนื้อหา"]],
    th: "ขอบคุณที่อยากช่วยครับ 🙌\n\n• มีสรุป/ไฟล์: ติดต่อ IG @chatann_\n• เขียนโค้ดเป็น: ดู CONTRIBUTING.md ใน GitHub Jesselpetry/ihelp",
    en: "Thanks for wanting to help 🙌\n\n• Notes/files: contact IG @chatann_\n• Developers: see CONTRIBUTING.md in GitHub Jesselpetry/ihelp",
  },

  // ── troubleshooting ──
  {
    id: "popup",
    all: [["ป๊อปอัป", "ป็อปอัพ", "popup", "pop-up", "หน้าต่างเด้ง", "เด้งขึ้นมา", "ไม่ต้องแสดงอีก", "กล่องข้อความเด้ง"]],
    th: "หน้าต่างที่เด้งตอนเข้าเว็บ กด 'ไม่ต้องแสดงอีก' ได้เลยครับ 🙂\n\nถ้ายังเด้งทุกครั้ง อาจเพราะเบราว์เซอร์ล้างข้อมูลเว็บอัตโนมัติ (เช่นโหมดไม่ระบุตัวตน)",
    en: "For the window that pops up on arrival, tap 'Don't show this again' 🙂\n\nIf it keeps coming back, your browser may be clearing site data (e.g. private mode).",
  },
  {
    id: "site-error",
    all: [["เว็บพัง", "เว็บล่ม", "เว็บช้า", "โหลดช้า", "เข้าเว็บไม่ได้", "หน้าขาว", "เว็บ error", "เว็บค้าง", "หน้าไม่ขึ้น", "เว็บเข้าไม่ได้", "หน้าเว็บ error", "site error", "เปิดเว็บไม่ได้"]],
    th: "ลองแก้ตามนี้ครับ 🛠️\n\n1. รีเฟรชแบบล้างแคช: Ctrl + Shift + R (Mac: Cmd + Shift + R)\n2. ลองเบราว์เซอร์อื่นหรือโหมดไม่ระบุตัวตน\n3. เช็กอินเทอร์เน็ต\n\nถ้ายังไม่ได้ แจ้ง IG @chatann_ พร้อมแคปหน้าจอและบอกว่าเป็นหน้าไหนครับ",
    en: "Try these 🛠️\n\n1. Hard refresh: Ctrl + Shift + R (Mac: Cmd + Shift + R)\n2. Another browser or a private window\n3. Check your connection\n\nStill broken? Send a screenshot and the page to IG @chatann_.",
  },
];

// ── course answers, generated from the catalog ──────────────────────────────
const COURSE_INTENT = ["คือ", "อะไร", "what", "เรียน", "ข้อมูล", "รายละเอียด", "about", "หน้าวิชา", "หน้ารายวิชา", "อยู่ไหน", "อยู่ตรงไหน", "ลิงก์", "link", "รหัสวิชา", "รหัส", "มีอะไรบ้าง", "เปิด", "ไปที่", "ดู"];

// What a student types for each module, keyed by the spine's module id.
const MODULE_WORDS: Record<ModuleId, string[]> = {
  orientation: ["ภาพรวม", "overview", "3 นาที", "ขอบเขตสอบ", "สัดส่วนคะแนน", "เกณฑ์คะแนน", "exam scope"],
  syllabus_map: ["แผนที่เนื้อหา", "syllabus map", "syllabus", "หัวข้อ", "แผนที่"],
  deep_summary: ["สรุปเนื้อหา", "สรุป", "summary", "โน้ต", "notes"],
  cram_sheet: ["สรุปเร่งด่วน", "สรุป 10 นาที", "cram", "อ่านก่อนสอบ", "ก่อนสอบ"],
  key_cards: ["บัตรคำ", "บัตรสูตร", "flashcard", "cards", "การ์ดสูตร"],
  drill: ["คลังโจทย์", "โจทย์รายบท", "แบบทดสอบรายบท", "drill", "quiz", "ควิซ", "แบบทดสอบ"],
  speed_quiz: ["แบบทดสอบเร่งด่วน", "จับเวลา", "speed quiz", "speed", "ควิซ 10 นาที"],
  applied: ["ห้องปฏิบัติ", "applied", "ปฏิบัติ", "labs"],
  mock_exam: ["ข้อสอบเสมือนจริง", "ข้อสอบจำลอง", "ข้อสอบเสมือน", "mock exam", "mock", "ซ้อมสอบ"],
  weak_spot: ["ห้องซ่อมจุดอ่อน", "จุดอ่อน", "weak spot", "weak"],
  // "หาไฟล์ ITF" with no week: the course's library beats the general how-to.
  archive: ["คลังทรัพยากร", "คลังไฟล์", "ไฟล์ทั้งหมด", "library", "resources", "หาไฟล์", "ไฟล์", "เอกสาร"],
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

/** Length of the longest keyword in `words` found in the (normalized) question, or 0. */
function hit(qn: string, words: string[]): number {
  return hitWord(qn, words).length;
}

/** The longest keyword from `words` present in `qn`, or "". */
function hitWord(qn: string, words: string[]): string {
  let best = "";
  for (const w of words) {
    const wn = norm(w);
    if (wn && qn.includes(wn) && wn.length > best.length) best = wn;
  }
  return best;
}

type CourseInfo = {
  course: CatalogCourse;
  dir: string;
  href: string | null;
  modules: { id: ModuleId; href: string; title: LText }[];
  hasLibrary: boolean;
};

// Built once per server instance: module availability reads course content.
let courseCache: Map<string, CourseInfo> | null = null;
function courseInfo(code: string): CourseInfo | undefined {
  if (!courseCache) {
    const withAssets = coursesWithAssets();
    courseCache = new Map<string, CourseInfo>(
      COURSES.map((course) => {
        const dir = courseDir(course);
        // `href` comes from the resolved module, not from `/courses/<dir>/<segment>`:
        // a course can bind a module elsewhere (PSCP's applied practice lives at
        // /pscp, and its /labs page 404s), and the course hub links the same way.
        const modules = STANDARD_SPINE.flatMap((spec) => {
          const mod = resolveModule(course.code, spec.id, dir);
          return mod?.href ? [{ id: spec.id, href: mod.href, title: spec.title }] : [];
        });
        return [course.code, { course, dir, href: courseHref(course), modules, hasLibrary: withAssets.has(course.code) }];
      }),
    );
  }
  return courseCache?.get(code);
}

const groupLabel = (course: CatalogCourse) => GROUPS.find((g) => g.id === course.group)?.label ?? { th: course.group, en: course.group };

function courseReply(info: CourseInfo): FaqReply {
  const { course, href, modules, hasLibrary, dir } = info;
  const group = groupLabel(course);
  const code = course.officialCode ? ` (${course.officialCode})` : "";
  const list = (lang: "th" | "en") =>
    modules.length
      ? modules.map((m) => `• ${t(m.title, lang)}`).slice(0, 6).join("\n") + (modules.length > 6 ? (lang === "th" ? `\n• และอีก ${modules.length - 6} ส่วน` : `\n• and ${modules.length - 6} more`) : "")
      : lang === "th"
        ? "• กำลังเพิ่มเนื้อหา"
        : "• Content coming soon";
  const links: FaqLink[] = [];
  if (href) links.push(page(`หน้ารายวิชา ${course.code}`, `${course.code} course page`, href));
  if (hasLibrary) links.push(page(libraryLabel(course.code, "th"), libraryLabel(course.code, "en"), `/courses/${dir}/library`));
  if (course.code === "PSCP") links.push(page("PSCP — โจทย์และเครื่องมือ", "PSCP — problems & tools", "/pscp"));
  return {
    reply: {
      th: `${course.code}${code} คือวิชา ${course.nameTh} ครับ 📘\n\n• ${course.nameEn} · ${group.th}\n${list("th")}\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇`,
      en: `${course.code}${code} is ${course.nameEn} 📘\n\n• ${course.nameTh} · ${group.en}\n${list("en")}\n\nTap a button below to open it 👇`,
    },
    links,
  };
}

function moduleReply(info: CourseInfo, id: ModuleId): FaqReply | null {
  const mod = info.modules.find((m) => m.id === id);
  const { course } = info;
  if (!mod) {
    const name: LText = STANDARD_SPINE.find((s) => s.id === id)?.title ?? { th: id, en: id };
    return info.href
      ? {
          reply: {
            th: `${course.code} ยังไม่มี '${t(name, "th")}' ครับ 🙏\n\nลองดูส่วนอื่นในหน้ารายวิชาแทนนะครับ 👇`,
            en: `${course.code} doesn't have '${t(name, "en")}' yet 🙏\n\nTry the other parts of the course page 👇`,
          },
          links: [page(`หน้ารายวิชา ${course.code}`, `${course.code} course page`, info.href)],
        }
      : null;
  }
  return {
    reply: {
      th: `${course.code} มี '${t(mod.title, "th")}' ครับ 📘\n\nกดปุ่มด้านล่างเพื่อเปิดได้เลยครับ 👇`,
      en: `${course.code} has '${t(mod.title, "en")}' 📘\n\nTap the button below to open it 👇`,
    },
    links: [page(`${t(mod.title, "th")} · ${course.code}`, `${t(mod.title, "en")} · ${course.code}`, mod.href)],
  };
}

function coursesReply(): FaqReply {
  const lines = (lang: "th" | "en") =>
    GROUPS.map((g) => `• ${g.label[lang]}: ${COURSES.filter((c) => c.group === g.id).map((c) => c.code).join(" · ")}`).join("\n");
  return {
    reply: {
      th: `ตอนนี้มี ${COURSES.length} วิชาครับ 📚\n\n${lines("th")}\n\nพิมพ์ชื่อวิชา เช่น \"MFIT คือวิชาอะไร\" เพื่อดูรายละเอียดได้ครับ`,
      en: `There are ${COURSES.length} courses 📚\n\n${lines("en")}\n\nType a course, e.g. \"what is MFIT\", for details.`,
    },
    links: [page("รายวิชาทั้งหมด", "All courses", "/")],
  };
}

/** "ITF มีกี่ไฟล์" — that course's own count, split by kind. */
function courseStatsReply(course: CatalogCourse): FaqReply {
  const assets = mergedAssets(course.code).filter((a) => !isRestrictedAsset(a));
  const info = courseInfo(course.code);
  const counts = new Map<AssetCategory, number>();
  for (const a of assets) counts.set(resolveCategory(a), (counts.get(resolveCategory(a)) ?? 0) + 1);
  const lines = (lang: Lang) =>
    [...counts].map(([cat, n]) => `• ${(lang === "th" ? CATEGORY_TH : CATEGORY_EN)[cat]} ${n}`).join("\n");
  const links: FaqLink[] = info?.hasLibrary
    ? [page(libraryLabel(course.code, "th"), libraryLabel(course.code, "en"), `/courses/${courseDir(course)}/library`)]
    : [];
  if (!assets.length) {
    return {
      reply: {
        th: `ตอนนี้ ${course.code} ยังไม่มีไฟล์ในคลังครับ 🙏`,
        en: `${course.code} has no files in its library yet 🙏`,
      },
      links,
    };
  }
  return {
    reply: {
      th: `${course.code} มีไฟล์ในคลัง ${assets.length} ไฟล์ครับ 📦\n\n${lines("th")}\n\nกดปุ่มด้านล่างเพื่อเปิดคลังได้เลยครับ 👇`,
      en: `${course.code} has ${assets.length} files in its library 📦\n\n${lines("en")}\n\nTap below to open it 👇`,
    },
    links,
  };
}

function statsReply(): FaqReply {
  const codes = [...coursesWithAssets()];
  const cards = codes.reduce((n, code) => n + mergedAssets(code).filter((a) => !isRestrictedAsset(a)).length, 0);
  return {
    reply: {
      th: `คลังทรัพยากรมีไฟล์ประมาณ ${cards.toLocaleString()} ไฟล์ จาก ${codes.length} วิชาครับ 📦\n\nพิมพ์วิชา + week เช่น \"ITF week 10\" เพื่อเปิดไฟล์ที่ต้องการได้เลยครับ`,
      en: `The library holds about ${cards.toLocaleString()} files across ${codes.length} courses 📦\n\nType a course + week, e.g. \"ITF week 10\", to open what you need.`,
    },
    links: [],
  };
}

const COURSE_LIST_WORDS = ["วิชาอะไรบ้าง", "มีวิชาอะไร", "มีกี่วิชา", "กี่วิชา", "รายวิชาทั้งหมด", "วิชาทั้งหมด", "which courses", "what courses", "list of courses", "all courses", "มีวิชาไหน", "เทอม 1 มี", "เทอม 2 มี"];
const STATS_WORDS = ["กี่ไฟล์", "ไฟล์ทั้งหมดกี่", "มีไฟล์เท่าไหร่", "how many files", "จำนวนไฟล์"];

/**
 * The best pre-written answer for a question, or null. Course-specific answers
 * (a module, or the course itself) beat general ones unless a general entry
 * matches on more text.
 */
export function faqReply(question: string, locale: "th" | "en"): { reply: string; files: ChatFile[] } | null {
  const q = question.trim().toLowerCase();
  const qn = norm(q);
  const pick = (r: FaqReply) => ({ reply: r.reply[locale], files: resolve(r.links, locale) });

  // Whole-message intents first: "hi", "ok", "555".
  for (const e of STATIC) if (e.re?.test(q)) return { reply: e[locale], files: resolve(e.links ?? [], locale) };

  if (hit(qn, COURSE_LIST_WORDS)) return pick(coursesReply());
  // "ITF มีกี่ไฟล์" is about that course, not the whole library.
  if (hit(qn, STATS_WORDS)) {
    const named = detectCourse(q);
    return pick(named ? courseStatsReply(named) : statsReply());
  }

  let best: { score: number; entry: Entry; words: string[] } | null = null;
  for (const entry of STATIC) {
    if (!entry.all) continue;
    let score = 0;
    const words: string[] = [];
    for (const group of entry.all) {
      const w = hitWord(qn, group);
      if (!w) {
        score = 0;
        break;
      }
      score += w.length;
      words.push(w);
    }
    if (score > (best?.score ?? 0)) best = { score, entry, words };
  }

  const course = detectCourse(q);
  const info = course ? courseInfo(course.code) : undefined;
  if (info) {
    // Just the course on its own ("PSCP", "06016402") — introduce it.
    const names = [course!.code, course!.nameTh, course!.nameEn, course!.officialCode ?? ""].map(norm);
    if (names.includes(qn)) return pick(courseReply(info));

    let mod: { id: ModuleId; score: number } | null = null;
    for (const [id, words] of Object.entries(MODULE_WORDS) as [ModuleId, string[]][]) {
      const h = hit(qn, words);
      if (h > (mod?.score ?? 0)) mod = { id, score: h };
    }
    const courseScore = (mod?.score ?? hit(qn, COURSE_INTENT)) + course!.code.length;
    // A written answer whose own keyword contains the course code is about
    // something more specific than the course — "pscp pro" is the VS Code
    // extension, not PSCP — so it wins outright.
    const aboutProduct = best?.words.some((w) => w !== norm(course!.code) && w.includes(norm(course!.code)));
    // Otherwise strictly greater, so a tie also goes to the written answer.
    if (!aboutProduct && (mod || hit(qn, COURSE_INTENT)) && courseScore > (best?.score ?? 0)) {
      const reply = mod ? moduleReply(info, mod.id) : courseReply(info);
      if (reply) return pick(reply);
    }
  }

  return best ? { reply: best.entry[locale], files: resolve(best.entry.links ?? [], locale) } : null;
}

/** For tests and the docs: how many fixed entries there are. */
export const FAQ_SIZE = STATIC.length;
