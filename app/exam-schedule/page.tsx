import { redirect } from "next/navigation";

export default async function ExamScheduleRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; tab?: string }>;
}) {
  const { id, tab } = await searchParams;
  if (id || tab) {
    const qs = new URLSearchParams();
    if (id) qs.set("id", id);
    if (tab) qs.set("tab", tab);
    redirect(`/exam-schedule/archive?${qs.toString()}`);
  }
  redirect("/grades");
}
