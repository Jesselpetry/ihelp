"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, Sparkles, BookOpen, BrainCircuit, FileCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  GithubIcon,
  InstagramIcon,
  GITHUB_URL,
  INSTAGRAM_URL,
} from "@/components/social-icons";
import { useLocale, t, type LText } from "@/lib/i18n";

const ACK_KEY = "ihelp-welcome-ack-v2";

const L: Record<string, LText> = {
  title: { th: "ยินดีต้อนรับสู่ ihelp", en: "Welcome to ihelp" },
  subtitleBadge: { th: "IT KMITL Open Learning Hub", en: "IT KMITL Open Learning Hub" },
  intro: {
    th: "ศูนย์รวมคลังสื่อการเรียนรู้ สรุปเนื้อหารายวิชา คลังข้อสอบจำลอง และเครื่องมือช่วยเตรียมตัวสอบสำหรับนักศึกษา IT KMITL",
    en: "An open learning hub featuring course summaries, resource libraries, mock exams, and prep tools for IT KMITL students.",
  },
  featuresTitle: { th: "สิ่งที่คุณสามารถใช้งานได้ใน ihelp", en: "What you can explore" },
  feat1Title: { th: "คลังสื่อการเรียนและชีทสรุป", en: "Resource Library & Summaries" },
  feat1Desc: {
    th: "สไลด์ เอกสารประกอบการสอน สรุปเนื้อหารายสัปดาห์ และสูตรสำคัญของทุกวิชา",
    en: "Slides, lecture notes, weekly syllabus summaries, and formula cheat sheets.",
  },
  feat2Title: { th: "คลังข้อสอบและแบบทดสอบจำลอง", en: "Interactive Quizzes & Mock Exams" },
  feat2Desc: {
    th: "ฝึกทำโจทย์เตรียมสอบกลางภาค-ปลายภาค พร้อมเฉลยละเอียดและจับเวลา",
    en: "Practice midterm/final question banks with step-by-step solutions.",
  },
  feat3Title: { th: "เครื่องมือจัดเตรียมเอกสารส่งงาน", en: "Submission & Reflection Tools" },
  feat3Desc: {
    th: "ช่วยจัดรูปแบบ submission.md และ ai_reflection.md ตาม template ทางการของรายวิชา",
    en: "Formats your own written reflection and submission files into official templates.",
  },
  guidelinesTitle: { th: "ข้อแนะนำและจริยธรรมการใช้งาน", en: "Usage Guidelines & Integrity" },
  guide1: {
    th: "สื่อและข้อสอบจำลองมีไว้เพื่อทบทวนมโนทัศน์และเตรียมความพร้อม ไม่ใช่การแจกเฉลยข้อสอบจริง",
    en: "Materials and quizzes are designed for concept mastery and exam prep, not real exam leaks.",
  },
  guide2: {
    th: "เครื่องมือไม่คิดแทน ไม่แก้โจทย์ และไม่ส่งงานให้ — คุณยังต้องเขียนและส่งงานด้วยตนเอง",
    en: "The tools do not think for you or submit on your behalf — you write and submit your own work.",
  },
  note: {
    th: "สร้างขึ้นเพื่อสนับสนุนการเรียนรู้ร่วมกันของนักศึกษาอย่างสร้างสรรค์และเคารพกฎระเบียบของสถาบัน",
    en: "Built to foster collaborative learning while strictly upholding academic integrity.",
  },
  accept: { th: "เข้าใจแล้ว เริ่มใช้งาน", en: "Get Started" },
  dontShow: { th: "ไม่ต้องแสดงอีก", en: "Don't show this again" },
  by: { th: "By เจส IT24", en: "Made by Jes · IT24" },
};

export function DisclaimerModal() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount (SSR-safe)
      if (!localStorage.getItem(ACK_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function accept() {
    if (dontShow) {
      try {
        localStorage.setItem(ACK_KEY, "1");
      } catch {}
    }
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg p-5 sm:p-6"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-2xl font-bold tracking-tight">
              <span className="text-primary">&lt;i</span>help
              <span className="text-primary">&gt;</span>
            </p>
            <Badge variant="outline" className="rounded-full text-[11px] font-medium border-primary/30 text-primary bg-primary/5">
              <Sparkles className="size-3 mr-1 text-primary" />
              {t(L.subtitleBadge, locale)}
            </Badge>
          </div>

          <DialogTitle className="text-lg sm:text-xl font-bold">
            {t(L.title, locale)}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t(L.intro, locale)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Features Section */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(L.featuresTitle, locale)}
            </p>
            <div className="grid gap-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 rounded-xl border bg-muted/30 p-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                  <BookOpen className="size-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t(L.feat1Title, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(L.feat1Desc, locale)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border bg-muted/30 p-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                  <BrainCircuit className="size-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t(L.feat2Title, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(L.feat2Desc, locale)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border bg-muted/30 p-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                  <FileCode className="size-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t(L.feat3Title, locale)}</p>
                  <p className="text-xs text-muted-foreground">{t(L.feat3Desc, locale)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Integrity & Guidelines */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              {t(L.guidelinesTitle, locale)}
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                <span>{t(L.guide1, locale)}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                <span>{t(L.guide2, locale)}</span>
              </li>
            </ul>
          </div>

          <p className="rounded-xl border border-dashed bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
            {t(L.note, locale)}
          </p>
        </div>

        {/* Don't show again toggle */}
        <label className="flex cursor-pointer items-center gap-2 px-0.5">
          <Checkbox
            checked={dontShow}
            onCheckedChange={(v) => setDontShow(v === true)}
          />
          <Label className="cursor-pointer text-xs text-muted-foreground">
            {t(L.dontShow, locale)}
          </Label>
        </label>

        {/* Footer */}
        <DialogFooter className="sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{t(L.by, locale)}</span>
            <span className="text-border">·</span>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon />
            </Link>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
            >
              <InstagramIcon />
            </Link>
          </div>
          <Button onClick={accept} className="w-full sm:w-auto rounded-xl px-5 h-9 font-medium shadow-xs">
            {t(L.accept, locale)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
