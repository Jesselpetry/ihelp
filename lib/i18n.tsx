"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { Locale } from "@/lib/ltext";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "th", setLocale: () => {} });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    const saved = window.localStorage.getItem("ihelp-locale");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
    if (saved === "en" || saved === "th") setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    window.localStorage.setItem("ihelp-locale", l);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

// The shape and the accessor live in lib/ltext.ts so server code can read an
// LText without crossing the client boundary; re-exported here because every
// existing call site imports them from this module.
export { t, type LText, type Locale } from "@/lib/ltext";
