"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Library, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LIBRARY_COMING_SOON } from "@/lib/flags";
import { useLocale, t, type LText } from "@/lib/i18n";

const ACK_KEY = "ihelp-destination-ack-v1";

/** Fired by DisclaimerModal so this can open in the same visit, not the next. */
export const DISCLAIMER_ACCEPTED_EVENT = "ihelp:disclaimer-accepted";

/** Set by DisclaimerModal. Kept here so the two keys live side by side. */
const DISCLAIMER_ACK_KEY = "ihelp-welcome-ack-v2";

const L: Record<string, LText> = {
  badge: { th: "อัปเดตใหม่", en: "What's new" },
  title: { th: "<i>help โฉมใหม่", en: "The new <i>help" },
  intro: {
    th: "เราจัดหน้าเว็บใหม่ทั้งหมด แล้ววันนี้อยากเริ่มจากตรงไหนดี?",
    en: "The site has been rebuilt. Where would you like to start?",
  },
  pscpTitle: { th: "PSCP — ห้องแลป Python", en: "PSCP — Python lab" },
  pscpDesc: {
    th: "ฝึกโจทย์ OJ รันโค้ดได้ในเบราว์เซอร์ พร้อมเฉลยและคำอธิบายทีละขั้น",
    en: "Practice OJ problems, run Python in the browser, with step-by-step solutions.",
  },
  libTitle: { th: "คลังทรัพยากร", en: "Resource library" },
  libDesc: {
    th: "สไลด์ ชีทสรุป และเอกสารประกอบการเรียนของทุกวิชาปี 1",
    en: "Slides, summary sheets, and course documents for every first-year subject.",
  },
  libSoon: { th: "เร็วๆ นี้", en: "Coming soon" },
  later: { th: "ไว้ทีหลัง ขอดูเองก่อน", en: "Maybe later, let me browse" },
};

function Choice({
  href,
  icon: Icon,
  title,
  description,
  badge,
  onSelect,
}: {
  href: string;
  icon: typeof Code2;
  title: string;
  description: string;
  badge?: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="group flex items-start gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors hover:border-primary/50 hover:bg-primary/[0.04] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-semibold">{title}</p>
          {badge ? (
            <Badge variant="secondary" className="text-[10px]">
              {badge}
            </Badge>
          ) : null}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>

      <ArrowRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/**
 * Asks first-time visitors where they want to go, once the disclaimer is out
 * of the way. Two doors rather than a menu: the home page opens on the course
 * directory, which buries both the Python lab and the library.
 */
export function WelcomeChoiceModal() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function acknowledged(key: string) {
      try {
        return Boolean(localStorage.getItem(key));
      } catch {
        // Private modes can throw on access; treat as "already seen" so the
        // dialog cannot reappear on every navigation.
        return true;
      }
    }

    // Queue behind the disclaimer: showing both at once stacks two modals.
    if (!acknowledged(ACK_KEY) && acknowledged(DISCLAIMER_ACK_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
      setOpen(true);
    }

    // First visit: the disclaimer is on screen right now, so wait for it.
    function onAccepted() {
      if (!acknowledged(ACK_KEY)) setOpen(true);
    }
    window.addEventListener(DISCLAIMER_ACCEPTED_EVENT, onAccepted);
    return () =>
      window.removeEventListener(DISCLAIMER_ACCEPTED_EVENT, onAccepted);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(ACK_KEY, "1");
    } catch {
      // Nothing to do - the dialog simply shows again next visit.
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : dismiss())}>
      <DialogContent className="p-5 sm:max-w-md sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          <Badge
            variant="outline"
            className="w-fit rounded-full border-primary/30 bg-primary/5 text-[11px] text-primary"
          >
            <Sparkles className="size-3" />
            {t(L.badge, locale)}
          </Badge>

          <DialogTitle className="font-mono text-lg font-bold sm:text-xl">
            <span className="text-primary">&lt;i</span>help
            <span className="text-primary">&gt;</span>{" "}
            {locale === "th" ? "โฉมใหม่" : "reimagined"}
          </DialogTitle>

          <DialogDescription className="text-xs leading-relaxed sm:text-sm">
            {t(L.intro, locale)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5">
          <Choice
            href="/pscp"
            icon={Code2}
            title={t(L.pscpTitle, locale)}
            description={t(L.pscpDesc, locale)}
            onSelect={dismiss}
          />
          <Choice
            href="/library"
            icon={Library}
            title={t(L.libTitle, locale)}
            description={t(L.libDesc, locale)}
            badge={LIBRARY_COMING_SOON ? t(L.libSoon, locale) : undefined}
            onSelect={dismiss}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={dismiss}
          className="mx-auto text-muted-foreground"
        >
          {t(L.later, locale)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
