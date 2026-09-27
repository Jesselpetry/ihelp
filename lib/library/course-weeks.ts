import type { CourseSchedule, CourseWeek } from "@/lib/library/subject-library-ui";

/**
 * Week-by-week schedules for the courses whose library opens on the week view.
 *
 * One shape for every course, so ITF and ICS read the same way: a week is a
 * number, a topic and a half of the term, and the files come from the assets'
 * own `week`/`chapter`. Topics are taken from each course's summary.md (ITF) or
 * its lab handouts (ICS).
 *
 * Served only through /api/library/assets, next to the assets themselves, so the
 * OnLearn links stay behind the same KMITL sign-in as the slides. Import this
 * from server code only.
 */

const ONLEARN = "https://onlearn.it.kmitl.ac.th";
const onlearnVideo = (id: number) => `${ONLEARN}/mod/url/view.php?id=${id}`;

/** A week whose topic is the same English title in both languages. */
const en = (week: number, scope: CourseWeek["scope"], title: string, extra: Partial<CourseWeek> = {}): CourseWeek => ({
  week,
  scope,
  title: { th: title, en: title },
  ...extra,
});

const ITF_SCHEDULE: CourseSchedule = {
  source: `${ONLEARN}/course/view.php?id=1766`,
  parts: {
    midterm: {
      label: { th: "ขอบเขตกลางภาค", en: "Midterm scope" },
      detail: { th: "สอบ อ. 18 ส.ค. 2569", en: "Exam Tue 18 Aug 2026" },
    },
    final: {
      label: { th: "ขอบเขตปลายภาค", en: "Final scope" },
      detail: { th: "สอบ อ. 27 ต.ค. 2569", en: "Exam Tue 27 Oct 2026" },
    },
  },
  weeks: [
    { week: 0, title: { th: "แนะนำรายวิชา", en: "Course orientation" } },
    en(1, "midterm", "Introducing Today's Technology", { video: onlearnVideo(26557) }),
    en(2, "midterm", "Computers", { video: onlearnVideo(26477) }),
    en(3, "midterm", "Computing Components"),
    en(4, "midterm", "Input & Output"),
    en(5, "midterm", "Storage", { video: onlearnVideo(26478) }),
    en(6, "midterm", "Operating System"),
    en(7, "midterm", "Programs and Apps"),
    en(8, "final", "Database"),
    en(9, "final", "Ethical, Social & Legal Aspects of IT"),
    en(10, "final", "Working in the Enterprise"),
    en(11, "final", "Internet & Computer Networks 1"),
    en(12, "final", "Computer Networks 2"),
    en(13, "final", "Wireless / Wi-Fi", { upcoming: true }),
    en(14, "final", "Information Systems & System Development", { upcoming: true }),
    en(15, "final", "Focus on Web Technology", { upcoming: true }),
  ],
};

/**
 * ICS runs two tracks, each numbered week 1–7: digital logic before the
 * midterm, the hardware bench labs after it. `scope` is what tells the two
 * week 1s apart — it is also what every ICS asset already carries.
 */
const ICS_SCHEDULE: CourseSchedule = {
  parts: {
    midterm: {
      label: { th: "Track A · ตรรกศาสตร์ดิจิทัล & Logisim", en: "Track A · Digital Logic & Logisim" },
      detail: { th: "ศ.ดร. สุขสันต์", en: "Prof. Sooksan" },
    },
    final: {
      label: { th: "Track B · ฮาร์ดแวร์ & แล็บจริง", en: "Track B · Hardware & Bench Labs" },
      detail: { th: "ผศ.ดร. สุภกิจ", en: "Asst. Prof. Supakit" },
    },
  },
  weeks: [
    { week: 1, scope: "midterm", title: { th: "ระบบดิจิทัลเบื้องต้น และโปรแกรม Logisim", en: "Digital Systems Intro & Logisim" } },
    { week: 2, scope: "midterm", title: { th: "พีชคณิตบูลีน ทฤษฎีเดอมอร์แกน และเกตลอจิก", en: "Boolean Algebra & DeMorgan's Theorems" } },
    { week: 3, scope: "midterm", title: { th: "รูปแบบมาตรฐานคาโนนิคอล SOP & POS", en: "Canonical SOP & POS Forms" } },
    { week: 4, scope: "midterm", title: { th: "การลดรูปฟังก์ชันลอจิกด้วย K-map", en: "Logic Minimization via K-map" } },
    { week: 5, scope: "midterm", title: { th: "การตอบสนองเชิงเวลา (Time Response & Delay)", en: "Time Response & Propagation Delay" } },
    { week: 6, scope: "midterm", title: { th: "ระบบเลขฐานและการคำนวณเลขฐานสอง", en: "Number Systems & Binary Arithmetic" } },
    { week: 7, scope: "midterm", title: { th: "มัลติเพล็กเซอร์และดีมัลติเพล็กเซอร์ (MUX/DEMUX)", en: "Multiplexer & Demultiplexer" } },
    { week: 1, scope: "final", title: { th: "ภาพรวมระบบคอมพิวเตอร์ และการใช้มัลติมิเตอร์", en: "Computer Systems Overview & Multimeter" } },
    { week: 2, scope: "final", title: { th: "หน่วยความจำ แอดเดรส I/O และออสซิลโลสโคป", en: "Memory Addressing, I/O & Oscilloscope" } },
    { week: 3, scope: "final", title: { th: "มัลติเพล็กเซอร์ แลตช์ และเบรดบอร์ดเบื้องต้น", en: "MUX, Latch, Buffer & Breadboard Basics" } },
    { week: 4, scope: "final", title: { th: "ฟลิปฟล็อป เคาน์เตอร์ และวงจรออสซิลเลเตอร์", en: "Flip-Flops, Counters & Oscillator" } },
    { week: 5, scope: "final", title: { th: "วงจรแปลงสัญญาณ DAC/ADC และลอจิกเกต", en: "DAC/ADC & Multiplexers via Logic Gates" } },
    { week: 6, scope: "final", title: { th: "วงจรหน่วยความจำ และบอร์ด FPGA Basys2", en: "Memory Circuits & FPGA Basys2" } },
    { week: 7, scope: "final", title: { th: "วงจร ALU และซีพียู 4 บิต (สอบแล็บ)", en: "ALU & 4-bit CPU (lab exam)" } },
  ],
};

export const COURSE_SCHEDULES: Record<string, CourseSchedule> = {
  ITF: ITF_SCHEDULE,
  ICS: ICS_SCHEDULE,
};

export function scheduleForCourse(code: string): CourseSchedule | undefined {
  return COURSE_SCHEDULES[code.toUpperCase()];
}
