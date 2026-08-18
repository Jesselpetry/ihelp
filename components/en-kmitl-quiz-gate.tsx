"use client";

import { useState } from "react";
import { EnKmitlSyllabus } from "@/components/en-kmitl-syllabus";
import { TechniqueQuiz } from "@/components/technique-quiz";
import { EN_KMITL_QUIZ, EN_KMITL_QUIZ_ID } from "@/lib/en-kmitl-quiz";

export function EnKmitlQuizGate() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <EnKmitlSyllabus questions={EN_KMITL_QUIZ} onStart={() => setStarted(true)} />;
  }

  return (
    <TechniqueQuiz
      problemId={EN_KMITL_QUIZ_ID}
      problemName="EN-KMITL Computer Programming"
      questions={EN_KMITL_QUIZ}
    />
  );
}
