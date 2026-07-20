"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { useLocale, t, type LText } from "@/lib/i18n";

const ORDER: Theme[] = ["light", "dark", "system"];

const ICON = { light: Sun, dark: Moon, system: Monitor } as const;

const LABEL: Record<Theme, LText> = {
  light: { th: "สว่าง", en: "Light" },
  dark: { th: "มืด", en: "Dark" },
  system: { th: "ตามระบบ", en: "System" },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { locale } = useLocale();
  const Icon = ICON[theme];
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={(e) => {
        // Wipe originates from the button's centre, not the raw pointer, so
        // keyboard activation (which reports 0,0) still looks right.
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={t(LABEL[theme], locale)}
      title={`${t(LABEL[theme], locale)} → ${t(LABEL[next], locale)}`}
      className="inline-flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted active:scale-90 motion-reduce:active:scale-100"
    >
      {/* key remounts the icon so the spin-in animation replays each click */}
      <Icon key={theme} className="size-4 theme-toggle-icon" />
    </button>
  );
}
