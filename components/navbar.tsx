"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ExternalLink, History, Menu, Tag, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="sticky top-0 z-30 bg-card border-b shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-none">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="font-mono text-xl font-bold flex items-center shrink-0"
          >
            <span className="text-primary">&lt;i</span>help
            <span className="text-primary">&gt;</span>
          </Link>
          <span className="hidden lg:block text-sm text-muted-foreground">
            PSCP · IT KMITL
          </span>
          <div className="hidden md:flex items-center gap-1">
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
                  <span>{t(label, locale)}</span>
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
        <div className="hidden md:flex items-center gap-3">
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
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            iJudge
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        {/* Mobile controls & hamburger button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="border-b bg-card px-4 py-4 md:hidden flex flex-col gap-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium transition-colors " +
                    (active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground")
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5" />
                    <span>{t(label, locale)}</span>
                  </div>
                  {href === "/history" && historyCount > 0 && (
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums " +
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

          <hr className="border-border" />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                {locale === "th" ? "ภาษา" : "Language"}
              </span>
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
            </div>

            <a
              href="https://ijudge.it.kmitl.ac.th"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              iJudge
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

