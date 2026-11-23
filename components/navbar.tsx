"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  GraduationCap,
  Menu,
  Tag,
  X,
} from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccountMenu } from "@/components/account/account-menu";
import { Wordmark } from "@/components/brand/wordmark";

const NAV_LINKS: { href: string; label: LText; icon: typeof GraduationCap }[] = [
  {
    href: "/grades",
    label: { th: "ผลการเรียน", en: "Grades" },
    icon: GraduationCap,
  },
  {
    href: "/schedule",
    label: { th: "ตารางเรียน", en: "Schedule" },
    icon: Calendar,
  },
  { href: "/version", label: { th: "เวอร์ชัน", en: "Version" }, icon: Tag },
];

// "/" is an exact match only — otherwise the home link lights up everywhere.
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/version" && (pathname === "/docs" || pathname.startsWith("/docs/"))) {
    return true;
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-3 z-30 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border bg-card/85 pl-5 pr-3 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-none sm:pl-6 sm:pr-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="font-mono text-xl font-bold flex items-center shrink-0"
          >
            <Wordmark />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
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
          <AccountMenu />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <AccountMenu />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 rounded-2xl border bg-card/95 p-4 shadow-xl backdrop-blur-md md:hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium " +
                    (active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground")
                  }
                >
                  <Icon className="size-4" />
                  <span>{t(label, locale)}</span>
                </Link>
              );
            })}
            <div className="my-2 border-t" />
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-muted-foreground">ภาษา / Language</span>
              <div className="flex rounded-lg border overflow-hidden text-xs font-medium">
                {(["th", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLocale(l);
                      setIsOpen(false);
                    }}
                    className={
                      "px-2.5 py-1 transition-colors " +
                      (locale === l
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground")
                    }
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
