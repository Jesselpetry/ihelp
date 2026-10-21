"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { SITE } from "@/lib/site";

const SEEN_KEY = "ihelp-splash-seen";

// Terminal-style intro: types the wordmark with a blinking caret, then fades.
// Shown once per browser session, only on a full page load.
//
// The typing is pure CSS and counts characters, so it is tied to the length of
// the wordmark — 7 for "<ihelp>" — in three places that SITE.wordmark cannot
// feed: `steps(7,end)` and `w-[7ch]` below (Tailwind reads class names from
// source text, so a number interpolated at runtime would never become a class)
// and `to { width: 7ch }` in @keyframes ihelp-typing in app/globals.css. A
// wordmark of another length means changing all three by hand.
export function Splash() {
  const [phase, setPhase] = useState<"hidden" | "show" | "fade">("hidden");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // storage blocked: still show it once for this load
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time splash gate after mount (SSR-safe)
    setPhase("show");
    const fade = setTimeout(() => setPhase("fade"), 1400);
    const done = setTimeout(() => setPhase("hidden"), 1900);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className={
        "fixed inset-0 z-100 flex flex-col items-center justify-center gap-3 bg-background transition-opacity duration-500 " +
        (phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100")
      }
    >
      <p className="flex items-center font-mono text-4xl sm:text-5xl font-bold">
        <span className="inline-block overflow-hidden whitespace-nowrap animate-[ihelp-typing_0.9s_steps(7,end)_forwards] motion-reduce:animate-none motion-reduce:w-[7ch]">
          <Wordmark />
        </span>
        <span className="ml-1 inline-block h-[1em] w-[2px] bg-primary animate-[ihelp-caret_0.8s_step-end_infinite]" />
      </p>
      <p className="text-sm text-muted-foreground opacity-0 animate-[ihelp-fadeup_0.5s_ease-out_0.9s_forwards]">
        {SITE.tagline.th}
      </p>
    </div>
  );
}
