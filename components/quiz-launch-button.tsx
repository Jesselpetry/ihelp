"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TechniqueQuiz } from "@/components/technique-quiz";
import { useLocale, t, type LText } from "@/lib/i18n";
import { QUIZ_BANK } from "@/lib/quiz-content";

const L: Record<string, LText> = {
  triggerLabel: {
    th: "ทดสอบความเข้าใจเทคนิคนี้",
    en: "Take a test on this technique",
  },
  dialogDescription: {
    th: "ตอบคำถามเพื่อทดสอบว่าเข้าใจเทคนิคของโจทย์นี้จริงหรือไม่",
    en: "Answer a short quiz to check your understanding of this problem's technique.",
  },
};

interface QuizLaunchButtonProps {
  problemId: number;
  problemName: string;
  nextSlug?: string | null;
  nextName?: string | null;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

export function QuizLaunchButton({
  problemId,
  problemName,
  nextSlug,
  nextName,
  variant = "outline",
  size = "sm",
  className,
}: QuizLaunchButtonProps) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const questions = QUIZ_BANK[problemId];

  if (!questions || questions.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className ?? "rounded-full gap-1.5"}
      >
        <GraduationCap className="size-3.5 shrink-0" />
        <span>{t(L.triggerLabel, locale)}</span>
      </Button>
      <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-xl rounded-3xl p-4 sm:p-6 border bg-card shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
            {t(L.triggerLabel, locale)} — {problemName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(L.dialogDescription, locale)}
          </DialogDescription>
        </DialogHeader>
        <TechniqueQuiz
          problemId={problemId}
          problemName={problemName}
          questions={questions}
          nextSlug={nextSlug}
          nextName={nextName}
        />
      </DialogContent>
    </Dialog>
  );
}
