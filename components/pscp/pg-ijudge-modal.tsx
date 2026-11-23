"use client";

import {
  Code2,
  Send,
  Play,
  FlaskConical,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { InstagramIcon } from "@/components/social-icons";
import { useLocale, t, type LText } from "@/lib/i18n";

const IG_CREATOR = "https://www.instagram.com/pgthegod_x/";

const L: Record<string, LText> = {
  dialogTitle: {
    th: "PG IJUDGE Pro · VS Code Extension",
    en: "PG IJUDGE Pro · VS Code Extension",
  },
  dialogSubtitle: {
    th: "ส่วนขยายสำหรับส่งโค้ดเข้า iJudge ตรงจาก Visual Studio Code โดยไม่ต้องสลับหน้าต่าง",
    en: "Submit code straight to iJudge from Visual Studio Code without window switching",
  },
  featureHeader: {
    th: "ความสามารถเด่นของส่วนขยาย",
    en: "Key Extension Capabilities",
  },
  feature1Title: {
    th: "ส่งตรงเข้า iJudge ทันที",
    en: "Submit Straight to iJudge",
  },
  feature1Body: {
    th: "เขียนโค้ดเสร็จแล้วกดส่งตรงจากแถบเครื่องมือ เห็นผลตรวจ Pass / Fail รายเทสต์เคสในเอดิเตอร์",
    en: "One-click submit straight from the editor with per-testcase verdict feedback",
  },
  feature2Title: {
    th: "รันตัวอย่างในเครื่อง (Ctrl+Alt+R)",
    en: "Run Samples Locally (Ctrl+Alt+R)",
  },
  feature2Body: {
    th: "ตรวจสอบกับ sample testcases ในเครื่องก่อนส่งจริง ช่วยเจอบั๊กไวและประหยัดจำนวนครั้งส่ง",
    en: "Check sample testcases offline before submitting to catch edge cases early",
  },
  feature3Title: {
    th: "ประวัติและการตรวจ Hidden Case",
    en: "Submission History & Hidden Verdicts",
  },
  feature3Body: {
    th: "บันทึกประวัติการส่งโค้ดย้อนหลัง พร้อมรายงานกรณีติด Time Limit หรือ Memory Limit",
    en: "Keep track of past submission runs with clear Time/Memory limit indicators",
  },
  setupHeader: {
    th: "ขั้นตอนการติดตั้งและเริ่มใช้งาน",
    en: "Setup & Activation Steps",
  },
  step1: {
    th: "เปิด Visual Studio Code แล้วไปที่แท็บ Extensions (Ctrl+Shift+X หรือ Cmd+Shift+X)",
    en: "Open VS Code and navigate to Extensions tab (Ctrl+Shift+X / Cmd+Shift+X)",
  },
  step2: {
    th: "ค้นหา 'PG IJUDGE' จากเมนูค้นหา แล้วกด Install",
    en: "Search for 'PG IJUDGE' and click Install",
  },
  step3: {
    th: "ทักขอ License Key จากผู้พัฒนา (@pgthegod_x) บน Instagram แล้วนำมากรอกใน Extension",
    en: "Request your activation License Key from the developer (@pgthegod_x) on Instagram",
  },
  requestKeyBtn: {
    th: "ติดต่อขอ License Key (@pgthegod_x)",
    en: "Request License Key (@pgthegod_x)",
  },
  authorCredit: {
    th: "พัฒนาโดย Akarapach Yootsukprasert (IT KMITL)",
    en: "Developed by Akarapach Yootsukprasert (IT KMITL)",
  },
  closeBtn: {
    th: "ปิดหน้าต่าง",
    en: "Close",
  },
};

export function PgIjudgeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 dark:bg-[#1c1c1f]">
        <DialogHeader className="space-y-2 border-b border-border/70 pb-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Code2 className="size-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  {t(L.dialogTitle, locale)}
                </DialogTitle>
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-mono">
                  v1.0
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                {t(L.dialogSubtitle, locale)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* ── Key Capabilities ── */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(L.featureHeader, locale)}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Send className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {t(L.feature1Title, locale)}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    {t(L.feature1Body, locale)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Play className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {t(L.feature2Title, locale)}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    {t(L.feature2Body, locale)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                  <FlaskConical className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {t(L.feature3Title, locale)}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    {t(L.feature3Body, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Steps ── */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(L.setupHeader, locale)}
            </h4>
            <ol className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2 rounded-lg bg-muted/20 p-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  1
                </span>
                <span>{t(L.step1, locale)}</span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-muted/20 p-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  2
                </span>
                <span>{t(L.step2, locale)}</span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-muted/20 p-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  3
                </span>
                <span>{t(L.step3, locale)}</span>
              </li>
            </ol>
          </div>
        </div>

        {/* ── Actions & Creator Credit ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/70 pt-4">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            {t(L.authorCredit, locale)}
          </p>

          <div className="flex items-center gap-2 justify-end">
            <a
              href={IG_CREATOR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <InstagramIcon className="size-3.5 fill-current" />
              <span>{t(L.requestKeyBtn, locale)}</span>
              <ExternalLink className="size-3 opacity-70" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
