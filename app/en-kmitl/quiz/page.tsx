import { redirect } from "next/navigation";

// Legacy route — ComPro quiz moved to /en-kmitl/compro/quiz
export default function OldQuizPage() {
  redirect("/en-kmitl/compro/quiz");
}
