"use client";

import {
  Send,
  Play,
  FlaskConical,
  Archive,
  WifiOff,
  ShieldCheck,
  History,
  Clock,
  LayoutDashboard,
  Search,
  FileCode2,
  Code2,
  Trophy,
  Wand2,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/social-icons";
import { useLocale, t, type LText } from "@/lib/i18n";

const IG = "https://www.instagram.com/pgthegod_x/";

/* -------------------------------------------------------- bilingual copy */

const feature = (icon: typeof Send, title: LText, body: LText, span = "") => ({
  icon,
  title,
  body,
  span,
});

const FEATURES = [
  feature(
    Send,
    { th: "ส่งจาก VS Code ตรงเข้า IJUDGE", en: "Submit straight to IJUDGE" },
    {
      th: "เขียนเสร็จกดปุ่มเดียว เห็นผล pass / fail รายเทสต์เคสในเอดิเตอร์ ไม่ต้องสลับไปเปิดเว็บอีกต่อไป",
      en: "One keypress, verdicts per test case right in the editor. Never open the website again.",
    },
    "lg:col-span-3 lg:row-span-2",
  ),
  feature(
    Play,
    { th: "รันตัวอย่างในเครื่อง", en: "Run samples locally" },
    {
      th: "กด Ctrl+Alt+R เทียบกับ sample ก่อนส่งจริง เจอบั๊กไวขึ้นมาก",
      en: "Ctrl+Alt+R checks the samples before you submit for real.",
    },
    "lg:col-span-3",
  ),
  feature(
    FlaskConical,
    { th: "Hidden testcase", en: "Hidden test cases" },
    {
      th: "เทสต์เคสซ่อนจากผู้สอน ช่วยจับ edge case ที่ตัวอย่างไม่ครอบ",
      en: "Instructor-authored edge cases the samples don't cover.",
    },
    "lg:col-span-3",
  ),
  feature(
    Archive,
    { th: "คลังโจทย์", en: "Problem archive" },
    {
      th: "เก็บโจทย์และโค้ดไว้ ย้อนดูได้แม้ IJUDGE ปิดข้อไปแล้ว",
      en: "Keeps problems + code viewable even after IJUDGE closes them.",
    },
    "lg:col-span-2",
  ),
  feature(
    WifiOff,
    { th: "เซิร์ฟเวอร์ล่มก็ไม่สะดุด", en: "Survives outages" },
    {
      th: "แคชคอร์ส/โจทย์ที่เคยเปิดไว้ เปิดดูต่อได้แม้เน็ตหรือเซิร์ฟเวอร์มีปัญหา",
      en: "Caches what you've loaded, so an outage never blanks the panel.",
    },
    "lg:col-span-2",
  ),
  feature(
    ShieldCheck,
    { th: "เช็คคำต้องห้าม", en: "Keyword guard" },
    {
      th: "เตือนคำที่ห้ามใช้/ต้องมี ก่อนกดส่ง ไม่ให้โดนตัดสินตกฟรี ๆ",
      en: "Warns about banned / required keywords before you submit.",
    },
    "lg:col-span-2",
  ),
];

const STEPS = [
  {
    n: "1",
    title: { th: "ใส่ License Key", en: "Enter your License Key" },
    body: {
      th: "วางคีย์ที่ได้รับลงในแถบ PG IJUDGE ครั้งเดียว",
      en: "Paste your key into the PG IJUDGE panel, once.",
    },
  },
  {
    n: "2",
    title: { th: "ล็อกอิน IJUDGE", en: "Log in to IJUDGE" },
    body: {
      th: "ใช้บัญชี IT KMITL เดิม — รหัสอยู่ในเครื่องคุณ ไม่ถูกส่งออกไปไหน",
      en: "Your existing IT KMITL account — credentials never leave your machine.",
    },
  },
  {
    n: "3",
    title: { th: "เขียนแล้วกด Submit", en: "Write, then Submit" },
    body: {
      th: "เขียนโค้ด กดส่ง เห็นผลตัดสินทันทีในเอดิเตอร์",
      en: "Write code, hit submit, watch the verdict land in the editor.",
    },
  },
];

const MORE: { icon: typeof Send; label: LText }[] = [
  { icon: History, label: { th: "ประวัติการส่ง + diff", en: "History + diff" } },
  { icon: Clock, label: { th: "เตือนกำหนดส่ง", en: "Deadline reminders" } },
  { icon: LayoutDashboard, label: { th: "แดชบอร์ดความคืบหน้า", en: "Progress dashboard" } },
  { icon: Search, label: { th: "ค้นหา + กรองยังไม่ผ่าน", en: "Search & filter unsolved" } },
  { icon: FileCode2, label: { th: "สร้างไฟล์ + จับโจทย์อัตโนมัติ", en: "Auto file + problem detect" } },
  { icon: Code2, label: { th: "Python · C · C++ และอื่น ๆ", en: "Python · C · C++ & more" } },
  { icon: Trophy, label: { th: "จัดอันดับโค้ด best-practice", en: "Best-practice ranking" } },
  { icon: Wand2, label: { th: "gen hidden test จากเฉลย", en: "Generate hidden tests" } },
];

/* --------------------------------------------------------------- page */

export default function ProPage() {
  const { locale } = useLocale();
  const tr = (x: LText) => t(x, locale);

  return (
    <div className="pscp-theme min-h-screen w-full">
      <Navbar />
      <ProStyles />

      <main className="overflow-x-clip">
        {/* ---------------------------------------------------------- hero */}
        <section className="relative">
          {/* pink field + faint grid, behind everything */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="pro-orb absolute -top-32 right-[-8%] h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl" />
            <div className="absolute inset-0 pro-grid opacity-[0.35] dark:opacity-20" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-24 lg:pb-28">
            <div>
              <span className="pro-fade inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                PG IJUDGE · VSCODE - Extension
              </span>

              <h1 className="pro-fade pro-d1 mt-5 text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
                ส่งโค้ดเข้า IJUDGE จาก VS&nbsp;Code
                <br className="hidden sm:block" />{" "}
                <span className="text-primary">ไม่ต้องเปิดเว็บ</span>
              </h1>

              <p className="pro-fade pro-d2 mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                เขียน รัน ส่ง แล้วเห็นผล pass / fail รายเทสต์เคส ครบในเอดิเตอร์เดียว —
                พร้อม hidden testcase, คลังโจทย์ และเตือนกำหนดส่ง สำหรับชาว PSCP · IT&nbsp;KMITL
              </p>

              <div className="pro-fade pro-d3 mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-11 px-5 text-[0.95rem]">
                  <a href={IG} target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="size-4" />
                    ขอ License Key
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 px-5 text-[0.95rem]"
                >
                  <a href="#features">
                    ดูฟีเจอร์ทั้งหมด
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>

              <ul className="pro-fade pro-d4 mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["เขียน", "รันในเครื่อง", "ส่ง", "เห็นผลทันที"].map((w, i) => (
                  <li key={w} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span className="text-border select-none" aria-hidden>
                        ·
                      </span>
                    )}
                    <Check className="size-4 text-primary" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* the product visual */}
            <div className="pro-fade pro-d2 lg:pl-4">
              <EditorMock />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="pro-reveal max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              ทุกอย่างที่ต้องใช้ อยู่ในที่เดียว
            </h2>
            <p className="mt-3 text-lg text-muted-foreground text-pretty">
              เลิกสลับหน้าต่างไปมา — PG IJUDGE ยกงานตัดสินมาไว้ข้าง ๆ โค้ดของคุณ
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(0,1fr)]">
            {FEATURES.map((f, i) => (
              <article
                key={tr(f.title)}
                className={`pro-reveal pro-tile group relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgba(198,45,88,0.5)] ${f.span}`}
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {tr(f.title)}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {tr(f.body)}
                </p>

                {/* the large tile carries a live verdict strip */}
                {i === 0 && (
                  <div className="mt-auto pt-6">
                    <VerdictStrip />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------- how it works */}
        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="pro-reveal max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                เริ่มใช้ใน 3 ขั้น
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                ติดตั้งส่วนขยาย แล้วพร้อมส่งงานภายในไม่กี่นาที
              </p>
            </div>

            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.n} className="pro-reveal relative">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-5xl font-bold text-primary/25 tabular-nums">
                      {s.n}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className="hidden h-px flex-1 translate-y-[-0.4rem] bg-gradient-to-r from-border to-transparent md:block"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">
                    {tr(s.title)}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {tr(s.body)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------- more chips */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="pro-reveal max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              และรายละเอียดเล็ก ๆ ที่ช่วยได้จริง
            </h2>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MORE.map((m) => (
              <li
                key={tr(m.label)}
                className="pro-reveal flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5"
              >
                <m.icon className="size-4.5 shrink-0 text-primary" />
                <span className="text-[0.95rem] font-medium">{tr(m.label)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------------- cta */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="pro-reveal relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/[0.06] px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="pro-orb pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            />
            <h2 className="relative text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              พร้อมส่งงานให้ไวขึ้นหรือยัง?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-muted-foreground text-pretty">
              PG IJUDGE เป็นแบบสมาชิก — ทักมาขอ License Key ได้เลย
              เดี๋ยวพาติดตั้งให้พร้อมใช้
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-6 text-[0.95rem]">
                <a href={IG} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="size-4" />
                  ทักไปที่ @pgthegod_x
                </a>
              </Button>
            </div>
            <p className="relative mt-6 text-sm text-muted-foreground">
              Build with{" "}
              <span className="text-primary" aria-hidden>
                ♥
              </span>{" "}
              by{" "}
              <a
                href={IG}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                @pgthegod
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------------------------------------------- product visual */

function EditorMock() {
  return (
    <div className="pro-float relative">
      {/* window */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12161c] text-[13px] shadow-2xl shadow-black/40 ring-1 ring-black/5">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#0e1217] px-4 py-2.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-zinc-400">
            milk.py — PG IJUDGE
          </span>
        </div>

        <div className="grid grid-cols-[9.5rem_1fr] sm:grid-cols-[11rem_1fr]">
          {/* sidebar tree */}
          <aside className="border-r border-white/[0.07] bg-[#0f141a] py-3 text-[12px]">
            <div className="px-3 pb-2 font-mono text-[10px] tracking-wide text-zinc-500 uppercase">
              PG IJUDGE
            </div>
            <TreeRow depth={0} label="PSCP · IT KMITL" muted book />
            <TreeRow depth={1} label="Milk" state="pass" />
            <TreeRow depth={1} label="RectangleArea" state="pass" />
            <TreeRow depth={1} label="Conan" state="active" />
            <TreeRow depth={1} label="พีระมิด" state="todo" />
          </aside>

          {/* editor */}
          <div className="bg-[#12161c] py-3 font-mono leading-6">
            <CodeLine n={1} indent={0}>
              <span className="text-[#c586c0]">n</span>{" "}
              <span className="text-zinc-500">=</span>{" "}
              <span className="text-[#dcdcaa]">int</span>
              <span className="text-zinc-300">(</span>
              <span className="text-[#dcdcaa]">input</span>
              <span className="text-zinc-300">())</span>
            </CodeLine>
            <CodeLine n={2} indent={0}>
              <span className="text-[#dcdcaa]">print</span>
              <span className="text-zinc-300">(</span>
              <span className="text-[#c586c0]">n</span>{" "}
              <span className="text-zinc-500">*</span>{" "}
              <span className="text-[#c586c0]">n</span>
              <span className="text-zinc-300">)</span>
              <span className="pro-caret ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] bg-[#f0708f]" />
            </CodeLine>
            <CodeLine n={3} indent={0} />
            <CodeLine n={4} indent={0}>
              <span className="text-zinc-600"># กด Ctrl+Alt+R เพื่อรัน sample</span>
            </CodeLine>
          </div>
        </div>

        {/* verdict bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] bg-[#0e1217] px-4 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#28c840]/15 px-2 py-1 text-[12px] font-semibold text-[#3fd35b]">
            <Check className="size-3.5" />
            Accepted · 7/7
          </span>
          <span className="font-mono text-[11px] text-zinc-500">75 ms</span>
          <div className="ml-auto flex items-center gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="pro-dot size-2 rounded-full bg-[#28c840]"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeRow({
  depth,
  label,
  state,
  muted,
  book,
}: {
  depth: number;
  label: string;
  state?: "pass" | "active" | "todo";
  muted?: boolean;
  book?: boolean;
}) {
  const dot =
    state === "pass"
      ? "bg-[#3fd35b]"
      : state === "active"
        ? "bg-[#f0708f]"
        : state === "todo"
          ? "bg-zinc-600"
          : "";
  return (
    <div
      className={`flex items-center gap-2 py-[3px] pr-2 ${
        state === "active" ? "bg-[#f0708f]/10" : ""
      }`}
      style={{ paddingLeft: `${0.75 + depth * 0.85}rem` }}
    >
      {book ? (
        <span className="size-3 rounded-[3px] border border-zinc-600" />
      ) : (
        <span className={`size-2.5 rounded-full ${dot}`} />
      )}
      <span
        className={
          muted
            ? "text-[11px] text-zinc-500"
            : state === "active"
              ? "text-[#f0a8ba]"
              : state === "todo"
                ? "text-zinc-500"
                : "text-zinc-300"
        }
      >
        {label}
      </span>
    </div>
  );
}

function CodeLine({
  n,
  indent,
  children,
}: {
  n: number;
  indent: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex px-1">
      <span className="w-7 shrink-0 pr-3 text-right text-[11px] text-zinc-600 select-none">
        {n}
      </span>
      <span style={{ paddingLeft: `${indent}rem` }}>{children}</span>
    </div>
  );
}

function VerdictStrip() {
  return (
    <div className="rounded-xl border border-primary/10 bg-muted/50 p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#28c840]/15 px-2 py-1 text-xs font-semibold text-[#1a9e3a] dark:text-[#3fd35b]">
          <Check className="size-3.5" />
          Accepted
        </span>
        <span className="font-mono text-xs text-muted-foreground">7/7 · 75 ms</span>
        <div className="ml-auto flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="size-2 rounded-full bg-[#28c840]" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- scoped motion */

function ProStyles() {
  return (
    <style>{`
      .pro-orb {
        background: radial-gradient(closest-side, var(--primary) 0%, transparent 72%);
      }
      .pro-grid {
        background-image:
          linear-gradient(to right, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: radial-gradient(120% 80% at 70% 0%, #000 20%, transparent 75%);
      }
      .pro-fade { animation: pro-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .pro-d1 { animation-delay: 0.06s; }
      .pro-d2 { animation-delay: 0.12s; }
      .pro-d3 { animation-delay: 0.18s; }
      .pro-d4 { animation-delay: 0.24s; }
      @keyframes pro-fade-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      /* Scroll-driven reveal. Visible by default (no JS, no-support, reduced
         motion all fall through to opacity:1); only browsers that support a
         view() timeline enhance it, and even then above-fold elements evaluate
         as fully in — nothing ever ships blank. */
      .pro-reveal { opacity: 1; }
      @media (prefers-reduced-motion: no-preference) {
        @supports (animation-timeline: view()) {
          .pro-reveal {
            animation: pro-rise linear both;
            animation-timeline: view();
            animation-range: entry 2% cover 22%;
          }
        }
      }
      @keyframes pro-rise {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .pro-float { animation: pro-float 7s ease-in-out infinite; }
      @keyframes pro-float {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-9px); }
      }
      .pro-caret { animation: pro-blink 1.1s step-end infinite; }
      @keyframes pro-blink { 50% { opacity: 0; } }
      .pro-dot { animation: pro-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes pro-pop {
        from { transform: scale(0); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        .pro-fade, .pro-float, .pro-caret, .pro-dot { animation: none; }
        .pro-reveal { transition: none; }
      }
    `}</style>
  );
}
