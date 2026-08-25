import type { ReactNode } from "react";
import { resolveCourse, COURSE_COLORS } from "@/lib/catalog";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ dir: string }>;
}) {
  const { dir } = await params;
  const course = resolveCourse(dir);
  const courseColor = (course ? COURSE_COLORS[course.code] : undefined) ?? "#2357A5";

  return (
    <div
      style={
        {
          "--primary": courseColor,
          "--color-primary": courseColor,
          "--ring": courseColor,
          "--course-color": courseColor,
        } as React.CSSProperties
      }
      className="min-h-screen w-full"
    >
      {children}
    </div>
  );
}
