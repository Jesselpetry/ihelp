"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale, t, type LText } from "@/lib/i18n";

const L: Record<string, LText> = {
  badge: { th: "กำลังจัดเตรียม", en: "In preparation" },
  title: { th: "คลังทรัพยากรกำลังจะมา", en: "The resource library is coming" },
  body: {
    th: "เรากำลังจัดหมวดหมู่สไลด์ ชีทสรุป และข้อสอบเก่าของวิชานี้ให้เรียบร้อยก่อนเปิดให้ใช้งาน อีกไม่นานเกินรอ",
    en: "We are sorting this course's slides, summary sheets, and past papers before opening them up. It will not be long.",
  },
  back: { th: "กลับไปหน้ารายวิชา", en: "Back to the course" },
};

/**
 * Dims and disables `children`, and floats a "coming soon" card over them.
 *
 * A cover, not a lock: the children are still rendered and still in the page
 * payload, so this is the right tool for "not ready to show off yet" and the
 * wrong one for "must not be read yet" — see RESOURCE_LIBRARY_COMING_SOON in
 * lib/flags.ts.
 *
 * `inert` does the part that matters for it being a real block rather than a
 * decoration: it takes the whole subtree out of the tab order and hides it from
 * assistive tech, so the covered gallery cannot be reached with a keyboard or a
 * screen reader the way a purely visual scrim would allow.
 *
 * A client component because the copy is bilingual and the locale lives in a
 * context — rendering on the server would pin this to Thai regardless of the
 * language toggle.
 */
export function ComingSoonOverlay({
  children,
  backHref,
}: {
  children: ReactNode;
  backHref: string;
}) {
  const { locale } = useLocale();

  return (
    <div className="relative isolate">
      <div inert aria-hidden="true" className="pointer-events-none select-none blur-[6px] saturate-50 opacity-45">
        {children}
      </div>

      {/*
        Sits at z-20, below the navbar's z-30, so the cover blocks the gallery
        without trapping the reader on the page — the nav is still there to
        leave by. The card is sticky inside a full-height column so it stays
        centred in the viewport however far down the covered content runs.
      */}
      <div className="absolute inset-0 z-20 bg-background/55 backdrop-blur-[2px]">
        <div className="sticky top-0 flex h-[100dvh] items-center justify-center px-4">
          <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border bg-card/95 p-8 text-center shadow-lg">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Hammer className="size-7" />
            </div>

            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/5 text-primary"
            >
              {t(L.badge, locale)}
            </Badge>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-balance sm:text-2xl">
                {t(L.title, locale)}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {t(L.body, locale)}
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href={backHref}>
                <ArrowLeft />
                {t(L.back, locale)}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
