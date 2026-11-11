"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { GoogleMark } from "@/components/account/google-mark";
import { SCORES_ANCHOR, SCORES_TITLE, SURFACE, TopicHeader } from "@/components/course-hub-shared";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { CourseScoreViewResponse } from "@/lib/scores/types";
import { createClient } from "@/lib/supabase/client";
import { ScoreAccordionCard } from "./score-accordion-card";
import { formatScoreDate } from "./score-utils";

const L = {
  lockTitle: {
    th: "เข้าสู่ระบบด้วยอีเมล @kmitl.ac.th เพื่อดูคะแนน",
    en: "Sign in with @kmitl.ac.th to view course scores",
  },
  lockCaption: {
    th: "แสดงเฉพาะนักศึกษาคณะ IT KMITL ที่ยืนยันตัวตนแล้ว",
    en: "Restricted to verified IT KMITL students",
  },
  signIn: { th: "เข้าสู่ระบบด้วย KMITL", en: "Sign in with KMITL" },
  updatedAt: { th: "อัปเดต", en: "Updated" },
} satisfies Record<string, LText>;

type SectionState =
  | { status: "checking" }
  | { status: "none" }
  | { status: "unauthenticated" }
  | { status: "ready"; data: CourseScoreViewResponse };

export function CourseScoreSection({
  courseCode,
  officialCode,
  onVisibilityChange,
}: {
  courseCode: string;
  officialCode?: string;
  onVisibilityChange?: (visible: boolean) => void;
}) {
  const { locale } = useLocale();
  const lookupCode = officialCode || courseCode;
  const [state, setState] = useState<SectionState>({ status: "checking" });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/local-scores/${encodeURIComponent(lookupCode)}/hub`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (controller.signal.aborted) return;
        if (res.status === 401) {
          setState({ status: "unauthenticated" });
          onVisibilityChange?.(true);
          return;
        }
        if (!res.ok) {
          setState({ status: "none" });
          onVisibilityChange?.(false);
          return;
        }
        const data = (await res.json()) as CourseScoreViewResponse;
        if (controller.signal.aborted) return;
        setState({ status: "ready", data });
        onVisibilityChange?.(true);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: "none" });
          onVisibilityChange?.(false);
        }
      });

    return () => controller.abort();
  }, [lookupCode, onVisibilityChange]);

  async function signIn() {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          window.location.pathname,
        )}`,
        queryParams: { hd: "kmitl.ac.th" },
      },
    });
  }

  if (state.status === "checking" || state.status === "none") {
    return null;
  }

  if (state.status === "unauthenticated") {
    return (
      <section>
        <TopicHeader id={SCORES_ANCHOR} title={t(SCORES_TITLE, locale)} />
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3.5 py-3 border border-border/40 ${SURFACE}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                {t(L.lockTitle, locale)}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {t(L.lockCaption, locale)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={signIn}
            className="h-8 gap-1.5 rounded-full px-3.5 text-xs font-medium shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <GoogleMark className="size-3.5" />
            <span>{t(L.signIn, locale)}</span>
          </Button>
        </div>
      </section>
    );
  }

  const aside = (
    <span className="rounded-full bg-muted/70 border border-border/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
      {t(L.updatedAt, locale)} {formatScoreDate(state.data.lastUpdated, locale)}
    </span>
  );

  return (
    <section>
      <TopicHeader
        id={SCORES_ANCHOR}
        title={t(SCORES_TITLE, locale)}
        aside={aside}
      />
      <ScoreAccordionCard data={state.data} lookupCode={lookupCode} />
    </section>
  );
}

