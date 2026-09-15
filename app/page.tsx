import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { CourseDirectory } from "@/components/course-directory";
import { COURSES, courseDir, courseHref } from "@/lib/catalog";
import { readinessIndex } from "@/lib/course-spine";

// No `description` here on purpose: the home page is the site, so it inherits
// DESCRIPTION from app/layout.tsx. Overriding it locally is how og:description
// and <meta name="description"> drifted apart.
export const metadata: Metadata = {
  // The root layout's `%s · <i>Help` template does NOT apply here — a template
  // only reaches CHILD segments, and app/page.tsx is the same segment as
  // app/layout.tsx. So the brand suffix has to be written out by hand to
  // match what every other page renders.
  title: "คลังเรียนรู้ IT KMITL — สรุป แบบทดสอบ และข้อสอบเก่า · <i>Help",
  alternates: { canonical: "/" },
};

// ItemList of every catalogued course, so search engines can surface a single
// subject ("สรุป MFIT สจล") rather than only the site root.
const COURSE_LIST_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "รายวิชา IT KMITL ชั้นปีที่ 1",
  itemListElement: COURSES.map((course, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: `${course.code} — ${course.nameTh}`,
      alternateName: course.nameEn,
      ...(course.officialCode ? { courseCode: course.officialCode } : {}),
      inLanguage: "th",
      provider: {
        "@type": "CollegeOrUniversity",
        name: "คณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
        alternateName: "School of Information Technology, KMITL",
        url: "https://www.it.kmitl.ac.th",
      },
      ...(courseHref(course) ? { url: courseHref(course) } : {}),
    },
  })),
};

export default function Home() {
  // How much of the eleven-module spine each course actually fills. Counted
  // here rather than declared so a course's badge moves the moment content
  // lands, and so the platform has one number that answers "is this getting
  // better".
  const readiness = Object.fromEntries(
    COURSES.map((course) => [course.code, readinessIndex(course.code, courseDir(course))]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_LIST_JSONLD) }}
      />
      <Navbar />
      <CourseDirectory readiness={readiness} />
    </>
  );
}
