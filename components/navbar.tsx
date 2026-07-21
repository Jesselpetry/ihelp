"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ExternalLink, History, Tag } from "lucide-react";
import { loadHistory, HISTORY_EVENT } from "@/lib/history";
import { useLocale, t, type LText } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS: { href: string; label: LText; icon: typeof BookOpen }[] = [
  {
    href: "/library",
    label: { th: "ห้องสมุด", en: "Library" },
    icon: BookOpen,
  },
  { href: "/history", label: { th: "ประวัติ", en: "History" }, icon: History },
  { href: "/version", label: { th: "เวอร์ชัน", en: "Version" }, icon: Tag },
];

export function Navbar() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const update = () => setHistoryCount(loadHistory().length);
    update();
    window.addEventListener(HISTORY_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(HISTORY_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return (
    <nav className="sticky top-0 z-10 h-16 bg-card border-b shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-none">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-xl font-bold flex items-center"
          >
            <span className="text-primary">&lt;i</span>help
            <span className="text-primary">&gt;</span>
          </Link>
          <span className="hidden lg:block text-sm text-muted-foreground">
            PSCP · IT KMITL
          </span>
          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted")
                  }
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{t(label, locale)}</span>
                  {href === "/history" && historyCount > 0 && (
                    <span
                      className={
                        "min-w-4.5 rounded-full px-1.5 py-px text-center text-[10px] font-semibold tabular-nums " +
                        (active
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary")
                      }
                    >
                      {historyCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border overflow-hidden text-xs font-semibold">
            {(["th", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={
                  "px-3 py-1.5 transition-colors " +
                  (locale === l
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground")
                }
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <a
            href="https://ijudge.it.kmitl.ac.th"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            iJudge
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
