"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoogleMark } from "@/components/account/google-mark";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";
import { verifyKmitlIt } from "@/lib/auth/verify";
import type { MeResponse } from "@/app/api/me/route";
import { useLocale, t, type LText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const L: Record<string, LText> = {
  signInPrompt: {
    th: "เข้าสู่ระบบด้วย @kmitl.ac.th",
    en: "Sign in with @kmitl.ac.th",
  },
  studentPrefix: {
    th: "นักศึกษา IT KMITL",
    en: "IT KMITL Student",
  },
};

export function StudentProfileCapsule({ className }: { className?: string }) {
  const { locale } = useLocale();
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function apply(email: string | null | undefined) {
      const verified = verifyKmitlIt(email);
      if (cancelled) return;

      setSignedIn(verified.ok);
      setReady(true);

      if (!verified.ok) {
        setMe(null);
        return;
      }

      const res = await fetch("/api/me");
      if (cancelled) return;
      setMe(res.ok ? await res.json() : null);
    }

    if (!supabaseConfigured) {
      apply(null);
      return () => {
        cancelled = true;
      };
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => apply(data.user?.email));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      apply(session?.user.email)
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { hd: "kmitl.ac.th" },
      },
    });
  }

  // Hold placeholder size while resolving session
  if (!ready) {
    return (
      <div
        className={cn(
          "h-10 w-44 rounded-full border border-border/40 bg-muted/20 animate-pulse",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  // Not signed in: Clean Google Sign-in Capsule
  if (!signedIn) {
    return (
      <button
        type="button"
        onClick={signIn}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs transition-all hover:border-primary/40 hover:bg-accent hover:-translate-y-0.5 active:scale-95 dark:border-white/10 cursor-pointer",
          className
        )}
      >
        <GoogleMark className="size-4 shrink-0" />
        <span className="whitespace-nowrap">{t(L.signInPrompt, locale)}</span>
      </button>
    );
  }

  // Signed in: Clean 2-line Student Profile Pill (Avatar on left, Name on top, Student ID on bottom)
  const profileHref = me?.onboarded ? `/profile/${me.studentId}` : "/onboarding";
  const displayName = me?.displayName || me?.fullName || t(L.studentPrefix, locale);

  return (
    <Link
      href={profileHref}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card py-1.5 pl-1.5 pr-4 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5 dark:border-white/10 dark:bg-card cursor-pointer",
        className
      )}
    >
      <Avatar className="size-8 shrink-0 rounded-full border border-border/60">
        {me?.avatarUrl ? <AvatarImage src={me.avatarUrl} alt={displayName} className="object-cover" /> : null}
        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
          {me?.initial ?? "?"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 leading-tight">
        <div className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors max-w-[130px] sm:max-w-[160px]">
          {displayName}
        </div>
        {me?.studentId ? (
          <div className="font-mono text-[11px] font-semibold text-muted-foreground tabular-nums">
            {me.studentId}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground">
            {t(L.studentPrefix, locale)}
          </div>
        )}
      </div>
    </Link>
  );
}
