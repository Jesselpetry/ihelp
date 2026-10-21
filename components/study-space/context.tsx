"use client";

import { createContext, useContext, useMemo } from "react";
import { studyStoreFor, useStudyProgress, type StudyStore } from "@/lib/study-space/storage";
import type { StudyPlan, UserProgressData } from "@/lib/study-space/types";

/**
 * The plan (from the server, owner-checked) and this student's progress
 * store, shared by every component on the page. Nothing below imports a plan
 * module — the plan only ever arrives through here.
 */

interface StudySpaceValue {
  plan: StudyPlan;
  studentId: string;
  store: StudyStore;
  data: UserProgressData;
}

const StudySpaceContext = createContext<StudySpaceValue | null>(null);

export function StudySpaceProvider({
  plan,
  studentId,
  children,
}: {
  plan: StudyPlan;
  studentId: string;
  children: React.ReactNode;
}) {
  const store = studyStoreFor(studentId);
  const data = useStudyProgress(store);
  const value = useMemo(() => ({ plan, studentId, store, data }), [plan, studentId, store, data]);
  return <StudySpaceContext.Provider value={value}>{children}</StudySpaceContext.Provider>;
}

export function useStudySpace(): StudySpaceValue {
  const value = useContext(StudySpaceContext);
  if (!value) throw new Error("useStudySpace must be used inside <StudySpaceProvider>");
  return value;
}
