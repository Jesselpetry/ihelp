import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QuickNavPillsSection } from "@/components/home/quick-nav-pills";
import { LearningLibrary } from "@/components/home/learning-library";
import { COURSES, courseDir, courseHref } from "@/lib/courses/catalog";
import { readinessIndex } from "@/lib/courses/course-spine";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `คลังเรียนรู้ IT KMITL — สรุป แบบทดสอบ และข้อสอบเก่า · ${SITE.name}`,
  alternates: { canonical: "/" },
};

// ItemList of every catalogued course for SEO
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
      inLanguage: SITE.locale,
      provider: {
        "@type": "CollegeOrUniversity",
        name: SITE.org.name.th,
        alternateName: SITE.org.name.en,
        url: SITE.org.url,
      },
      ...(courseHref(course) ? { url: courseHref(course) } : {}),
    },
  })),
};

export default function Home() {
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
      <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8 space-y-10 sm:space-y-12 animate-in fade-in-0 duration-500">
        {/* 1. Hero Highlights Carousel */}
        <HeroCarousel />

        {/* 2. Quick Navigation Pills & Student Greeting Bar */}
        <QuickNavPillsSection />

        {/* 3. Learning Library (Aligned Search, Filter Pills & Pinned Current Term) */}
        <LearningLibrary readiness={readiness} />
      </main>
    </>
  );
}
