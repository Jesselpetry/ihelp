import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { CourseDirectory } from "@/components/course-directory";
import { COURSES, courseHref } from "@/lib/catalog";
import { listCourseOverviews } from "@/lib/course-content";

export const metadata: Metadata = {
  title: "คลังเรียนรู้ IT KMITL — สรุป แบบทดสอบ และข้อสอบเก่า",
  description:
    "คลังเรียนรู้สำหรับนักศึกษาปี 1 คณะ IT สจล. — สรุปเนื้อหา แบบทดสอบ ข้อสอบเก่า และคลังสไลด์ ครบทุกวิชา PSCP ITF ICS MFIT",
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

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_LIST_JSONLD) }}
      />
      <Navbar />
      <CourseDirectory overviews={listCourseOverviews()} />
    </>
  );
}
