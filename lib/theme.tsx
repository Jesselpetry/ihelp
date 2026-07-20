"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark" | "system";

export const THEME_KEY = "ihelp-theme";

// Inlined into <head> in app/layout.tsx and run before first paint, so the
// .dark class is already on <html> when the browser paints. Without this the
// page flashes light before the provider hydrates. Keep the localStorage key
// and the class name in sync with the provider below.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})()`;

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme, origin?: { x: number; y: number }) => void;
  resolved: "light" | "dark";
}>({ theme: "system", setTheme: () => {}, resolved: "light" });

function systemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && systemDark());
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return dark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const initial =
      saved === "light" || saved === "dark" || saved === "system"
        ? saved
        : "system";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount, matching LocaleProvider in lib/i18n.tsx
    setThemeState(initial);
    setResolved(apply(initial));
  }, []);

  // Follow the OS while the user is on "system".
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(apply("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  // `origin` is the click position; the new theme wipes in as a circle growing
  // from there. Falls back to an instant swap when the browser lacks View
  // Transitions (Firefox) or the user asked for reduced motion.
  function setTheme(t: Theme, origin?: { x: number; y: number }) {
    window.localStorage.setItem(THEME_KEY, t);

    const commit = () => {
      flushSync(() => {
        setThemeState(t);
        setResolved(apply(t));
      });
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduced || !document.startViewTransition) {
      commit();
      return;
    }

    // Radius must reach the farthest corner or the circle stops short.
    const { x, y } = origin;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeTransition = "";

    const transition = document.startViewTransition(commit);
    transition.finished.finally(() => {
      delete root.dataset.themeTransition;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
