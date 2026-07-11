"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Check, X } from "lucide-react";
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
import {
  GithubIcon,
  InstagramIcon,
  GITHUB_URL,
  INSTAGRAM_URL,
} from "@/components/social-icons";
import { useLocale, t, type LText } from "@/lib/i18n";

const ACK_KEY = "ihelp-disclaimer-ack-v1";

const L: Record<string, LText> = {
  title: { th: "ก่อนเริ่มใช้งาน", en: "Before you start" },
  intro: {
    th: "เครื่องมือนี้ไม่ได้ละเมิดกฎของรายวิชานี้ สิ่งนี้ถูกสร้างขึ้นมาเพื่อช่วยในการสร้างไฟล์ submission.md และ ai_reflection.md ตาม template ทางการของรายวิชา โดยใช้คำพูดของคุณเอง",
    en: "This tool does not violate the rules of this course. It was built to help you assemble your submission.md and ai_reflection.md files from the official course templates, using your own words.",
  },
  doesTitle: { th: "เครื่องมือนี้ทำ", en: "What it does" },
  does1: {
    th: "จัดรูปแบบคำตอบที่คุณเขียนเองให้ตรงกับ template ทางการ",
    en: "Formats the answers you write yourself into the official template.",
  },
  does2: {
    th: "ให้คุณดาวน์โหลดไฟล์ไปเก็บและส่งด้วยตัวเอง",
    en: "Lets you download the file to keep and submit by yourself.",
  },
  dontTitle: { th: "เครื่องมือนี้ไม่ทำ", en: "What it never does" },
  dont1: {
    th: "ไม่เขียนเนื้อหา ไม่แก้โจทย์ และไม่คิดแทนคุณ",
    en: "It does not write content, solve problems, or think for you.",
  },
  dont2: {
    th: "ไม่ส่งโค้ดหรือไฟล์ใด ๆ ไปยัง iJudge ให้",
    en: "It does not submit any code or file to iJudge for you.",
  },
  note: {
    th: "คุณยังต้องเขียน รัน และทดสอบโค้ดของคุณเองใน VS Code แล้วส่งด้วยตัวเอง",
    en: "You must still write, run, and test your own code in VS Code, then submit it yourself.",
  },
  accept: { th: "เข้าใจแล้ว เริ่มใช้งาน", en: "I understand, continue" },
  dontShow: { th: "ไม่ต้องแสดงอีก", en: "Don't show this again" },
  by: { th: "By เจส IT24", en: "Made by Jes · IT24" },
};

export function DisclaimerModal() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(true);

  useEffect(() => {
    try {
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
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{t(L.title, locale)}</DialogTitle>
          <DialogDescription>{t(L.intro, locale)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(L.doesTitle, locale)}
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {[L.does1, L.does2].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span>{t(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(L.dontTitle, locale)}
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {[L.dont1, L.dont2].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <span>{t(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {t(L.note, locale)}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 px-0.5">
          <Checkbox
            checked={dontShow}
            onCheckedChange={(v) => setDontShow(v === true)}
          />
          <Label className="cursor-pointer text-sm text-muted-foreground">
            {t(L.dontShow, locale)}
          </Label>
        </label>

        <DialogFooter className="sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t(L.by, locale)}</span>
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
          <Button onClick={accept} className="w-full sm:w-auto">
            {t(L.accept, locale)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
