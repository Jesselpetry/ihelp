"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/account/google-mark";
import { SubjectLibrary } from "@/components/subject-library";
import { createClient } from "@/lib/supabase/client";
import { useLocale, t, type LText } from "@/lib/i18n";
import type { SubjectAsset } from "@/lib/subject-library-ui";

const L: Record<string, LText> = {
  badge: { th: "เฉพาะนักศึกษา IT", en: "IT students only" },
  title: { th: "คลังเรียนรู้ IT KMITL", en: "IT KMITL Learning Library" },
  body: {
    th: "ต้องเข้าสู่ระบบก่อนจึงจะเปิดคลังเรียนรู้ได้ — เฉพาะนักศึกษาคณะเทคโนโลยีสารสนเทศ สจล. ที่ใช้อีเมล @kmitl.ac.th เท่านั้น",
    en: "Sign in to open the learning library — KMITL Faculty of IT students only, using your @kmitl.ac.th address.",
  },
  why: {
    th: "สื่อการสอนบางส่วนเป็นลิขสิทธิ์ของผู้สอนและผู้จัดพิมพ์ จึงเผยแพร่สาธารณะไม่ได้",
    en: "Some of this material belongs to the lecturers and publishers, so it cannot be shared publicly.",
  },
  signIn: { th: "เข้าสู่ระบบด้วย KMITL", en: "Sign in with KMITL" },
  back: { th: "กลับไปหน้ารายวิชา", en: "Back to the course" },
  loading: { th: "กำลังเปิดคลัง…", en: "Opening the library…" },
};

type State =
  | { status: "loading" }
  | { status: "locked" }
  | { status: "ready"; assets: SubjectAsset[] };

/**
 * Fetches a course's library and, without a session, shows the sign-in gate
 * instead.
 *
 * The gate is real, not cosmetic. /courses/[dir]/library stays statically
 * prerendered and ships no asset data whatsoever; the list arrives from
 * /api/library/assets, which requires a verified KMITL IT student. So a signed
 * out reader has nothing to find in the HTML, in the RSC payload, or by calling
 * the endpoint directly — which is what the copyright notes in the Foundation
 * English and IT-Fundamentals summary.md files actually require.
 */
export function SubjectLibraryGate({
  courseCode,
  backHref,
  backLabel,
  title,
  subtitle,
}: {
  courseCode: string;
  backHref: string;
  backLabel: LText;
  title: LText;
  subtitle: LText;
}) {
  const { locale } = useLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/library/assets?course=${encodeURIComponent(courseCode)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401) return setState({ status: "locked" });
        if (!res.ok) return setState({ status: "ready", assets: [] });
        const body = (await res.json()) as { assets?: SubjectAsset[] };
        setState({ status: "ready", assets: body.assets ?? [] });
      })
      // An aborted fetch is the effect cleaning up, not a failure. Anything else
      // leaves the gate up rather than pretending the library is empty.
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "locked" });
      });
    return () => controller.abort();
  }, [courseCode]);

  async function signIn() {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        // Come back to this library rather than the home page, so signing in
        // does not cost the reader their place.
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          window.location.pathname,
        )}`,
        // Narrows Google's account chooser to KMITL accounts. The real gate is
        // still server-side, in app/auth/callback/route.ts and in the API route.
        queryParams: { hd: "kmitl.ac.th" },
      },
    });
  }

  if (state.status === "loading") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">{t(L.loading, locale)}</p>
      </main>
    );
  }

  if (state.status === "locked") {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="size-7" />
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-primary/30 bg-primary/5 text-primary"
        >
          {t(L.badge, locale)}
        </Badge>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-balance sm:text-2xl">
            {t(L.title, locale)}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {t(L.body, locale)}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            {t(L.why, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={signIn}>
            <GoogleMark className="size-4" />
            {t(L.signIn, locale)}
          </Button>
          <Button asChild variant="outline">
            <Link href={backHref}>
              <ArrowLeft />
              {t(L.back, locale)}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <SubjectLibrary
      assets={state.assets}
      courseCode={courseCode}
      backHref={backHref}
      backLabel={backLabel}
      title={title}
      subtitle={subtitle}
    />
  );
}
