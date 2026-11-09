# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = การเปลี่ยนสถาปัตยกรรมใหญ่ / Milestones หลัก, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อยตามรอบการพัฒนา)

วันที่ของทุกเวอร์ชันเขียนด้วยรูปแบบไทยและปีพุทธศักราช (เช่น `8 พฤศจิกายน 2569`)
เพื่อให้อ่านง่ายสำหรับผู้ใช้งานที่เป็นนักศึกษาไทย หัวข้อย่อยใช้ **เพิ่ม** / **ปรับปรุง** / **แก้ไข** /
**ความปลอดภัย** แทน Added / Changed / Fixed / Security และมีชื่อผู้พัฒนา `(โดย @username)` กำกับท้ายทุกรายการ

---

## [Unreleased]

### เพิ่ม

- **ระบบปุ่มฮีโร่สอบปลายภาคสีแดง, ศูนย์บัญชาการรบโต้ตอบ (Interactive War Room Portal), คลังข้อสอบจริง และชุดข้อสอบจำลองแคลคูลัส 25 ข้อ (โดย @Jesselpetry)** —
  1. ยกระดับการ์ดจุดพักสอบปลายภาคบนไทม์ไลน์รายวิชา (`components/course-exam-milestone.tsx`) ด้วยการ์ดสีแดงไล่เฉดมินิมอล (`bg-gradient-to-r from-red-600 via-rose-600 to-red-700`) ไร้เงา (no shadow) ไร้แบดจ์ (no badge) แสดงเฉพาะไอคอนเพียวๆ ร่วมกับตัวอักษรหนาสีขาวโดดเด่นสะดุดตา **"สอบปลายภาค"** ในดีไซน์ที่สะอาดและคลีนสูงสุด
  2. พัฒนาระบบศูนย์บัญชาการรบ `<MfitWarRoomPortal />` (`components/mfit-war-room-portal.tsx`) ในหน้า Final War Room โดยแยกออกจาก MD Viewer ให้อยู่ด้านบนด้วยฟอนต์มาตรฐาน (`font-sans`) พร้อมสร้างชุดคอมโพเนนต์มาตรฐานกลาง (`components/course-hub-shared.tsx`): แบนเนอร์มินิมอลทางการ `<ExamWarRoomBanner />` หัวเรื่องหลักตัวหนาคู่กับคำบรรยายรองขนาดเล็กน้ำหนักปกติ พร้อมลายน้ำตราคณะที่มุมขวาล่างขนาดกะทัดรัด, การ์ดทรัพยากรแถวเดี่ยว `<ResourceItemCard />` สะอาดเรียบง่าย ไร้ข้อความคำอธิบายหรือแบดจ์รกตา, ตัวคั่นหัวข้อมาตรฐาน `TopicHeader` แบบเดียวกับหน้ารายวิชาหลัก ("เนื้อหารายสัปดาห์ ครึ่งแรก / จุดพักสอบกลางภาค / ครึ่งหลัง") แบ่ง 4 เซกชันหลักแบบแนวตั้งคลีนสบายตา และให้ตัวอ่าน MD Viewer อยู่ด้านล่างสุดด้วยฟอนต์ `font-sarabun`:
     - 🎯 **ข้อสอบจำลองปลายภาค (Mock Exam Simulator)**: ระบบฝึกทำข้อสอบจำลอง 25 ข้อ ครบ 5 เสาหลัก หรือเลือกลุยเฉพาะเสาหลัก พร้อมคำอธิบายและแนวคิด Step-by-Step
     - 📚 **คลังข้อสอบเก่าฉบับจริง (Past Papers Vault)**: เชื่อมต่อบัคเก็ตลับ `ihelp-library-exams` แสดงรายการข้อสอบจริง 7 ชุด (ปี 2561, 2560, 2559, เฉลยลายมือ NoteLub, ชุดคลังกลาง, สำเนา 2559, ชุดคละบท) พร้อมปุ่มพรีวิวทันทีผ่าน `PreviewModal` และดาวน์โหลด
     - 📑 **ชีทสรุปสูตร & เอกสารทางการ (Official Formula Sheets)**: รวม 6 ฉบับทางการ (Useful Info 2569, Holy Shit Final Part 1, Final Recap W08–13, Diff & Int Recap, Cheat Sheets 2022 & 2023)
     - 📖 **คู่มือวิธีทำโจทย์และยุทธศาสตร์ (Deep Study Guide)**: เชื่อมโยงเข้าสู่เนื้อหาบทสรุปการคำนวณ 5 เสาหลัก, กลวิธีทำโจทย์ และตารางกับดักจุดตาย 10 จุดด้านล่างอย่างไร้รอยต่อ
  3. จัดทำชุดคลังข้อสอบจำลองแคลคูลัสปลายภาค 25 ข้อ (`lib/quiz/mfit-final-mock-exam.ts`) ครอบคลุม 5 เสาหลักตามโครงสร้างข้อสอบจริง 2559–2561 และสัดส่วน 35 คะแนน 1/2569 พร้อมผูกเชื่อมโยงเข้ากับระบบแบบทดสอบ `mock_exam` ใน `lib/courses/course-bindings.ts` และอัปเดตบทเรียนปลายภาคใน `lib/quiz/mfit-quiz.ts`
  4. ปรับมาตรฐานความกว้างของตัวอ่าน Markdown ทุกหน้าในระบบ (`components/module-reader.tsx` และ `components/library-reader.tsx`) ให้บีบเข้ามาตรงกลางด้วยขนาด `max-w-5xl xl:max-w-6xl` สำหรับหน้าหลัก และ `max-w-3xl xl:max-w-4xl mx-auto` สำหรับคอลัมน์เนื้อหาบทความ พร้อมระยะ Padding ซ้าย-ขวาที่สมดุล เพื่อประสบการณ์การอ่านที่สบายตา ไม่ยืดกว้างเกินไปบนจอภาพขนาดใหญ่

- **คลังสื่อการเรียนรู้สไลด์สรุปเนื้อหาแปลไทยวิชา ICS ครึ่งหลัง บทที่ 1–7 และแนวข้อสอบปลายภาค (โดย @PhuPunnavit)** —
  1. เพิ่มสไลด์สรุปเนื้อหาฮาร์ดแวร์ครึ่งหลังแปลไทยฉบับอ่านเข้าใจง่ายในหน้าเดียวจาก Figma รวม 7 บท (`ics-sheet-ch01-computer-system-th.pdf` ถึง `ics-sheet-ch07-alu-cpu-creation-th.pdf`) ครอบคลุม Computer System, Memory & I/O Addressing, MUX/Latch/Buffer, Counter & DAC/ADC (I/II), Memory Unit, และ ALU & CPU Creation
  2. เพิ่มชุดแนวข้อสอบปลายภาควิชา ICS พร้อมเฉลยคำตอบข้อเขียน (`ics-sheet-final-exam-guide-th.pdf`) อธิบายขั้นตอนการคำนวณและข้อเขียนอย่างละเอียด
  3. เชื่อมโยงสไลด์สรุปเข้าสู่ตารางเอกสารประจำสัปดาห์ของหน้าเนื้อหารายสัปดาห์วิชา ICS ครึ่งหลัง (`week01.md` ถึง `week07.md`) ในคลังเรียนรู้
  4. อัปเดตข้อมูลผู้ร่วมจัดทำของนายปัณณวิชญ์ ตั้งกลชาน (@PhuPunnavit) ในระบบ `lib/contributors/registry.ts` ให้ครอบคลุมทั้งวิชา ITF และ ICS
- **ชีตสรุปเข้มแคลคูลัสเตรียมสอบปลายภาค MFIT Holy Shit Final Part 1 (โดย @tammadon)** —
  1. นำเข้าชีตสรุปเนื้อหาแคลคูลัสลายมือจดละเอียดพร้อมเทคนิคคิดลัดฉบับเข้มข้น Part 1 รวม 21 หน้า (`mfit-sheet-holyshit-final-part1.pdf`) จัดทำโดย แบงค์ ธรรมดล ศึกษา (IT24) ลงในคลังเรียนรู้
  2. เชื่อมโยงเข้าสู่ตารางเอกสารติวเข้มในหน้าศูนย์บัญชาการสอบปลายภาค MFIT Final War Room (`study-guide-final-war-room.md`)
  3. ลงทะเบียนผลงานเข้าสู่โปรไฟล์ผู้จัดทำของนายธรรมดล ศึกษา (@tammadon) ใน `lib/contributors/registry.ts` รองรับการแสดงผลเครดิตในหน้ารายวิชา Math for IT
- **ศูนย์บัญชาการสอบปลายภาค MFIT Final Exam War Room (`study-guide-final-war-room.md`)** — จัดทำหน้าคู่มือทบทวนและยุทธศาสตร์การทำข้อสอบปลายภาคแบบ Exclusive ณ จุดพักสอบปลายภาค (`/courses/06016401-Math-for-IT/summary?doc=final-war-room`) พร้อมเชื่อมโยงกับปุ่ม 'คู่มือทบทวน' ในแถบไทม์ไลน์รายวิชา (`lib/courses/course-timeline.ts` และ `lib/courses/course-bindings.ts`):
  1. วิเคราะห์และแจกแจงโครงสร้างข้อสอบปลายภาค 1/2569 สัดส่วน 35 คะแนนเต็ม (ข้อเขียนอัตนัย 100%) แยกตาม 5 เสาหลักแคลคูลัส (Pillars 1–5): Limits & Continuity, Differentiation & Applications, Optimization & Related Rates, Indefinite & Definite Integration, Integration Applications (Area & Volume)
  2. สรุปกลยุทธ์และสูตรลัดเฉพาะทาง: การแก้ Limit รูปแบบ 0/0 และสังยุค/L'Hôpital, อนุพันธ์ฟังก์ชันแฝง (Implicit Differentiation), การตั้งสมการและโมเดล Optimization, การอินทิเกรตเปลี่ยนตัวแปร ($u$-Substitution), ตาราง DI Method สำหรับ Integration by Parts, และสูตรทรงตันจากการหมุนแบบจาน (Disk) vs วงแหวน (Washer)
  3. รวบรวมตารางเตือนจุดผิดอันตรายที่มักเสียคะแนนฟรี 10 ประการ (10 All-or-Nothing Deadly Traps) เพื่อป้องกันข้อผิดพลาดทางพีชคณิตและแคลคูลัส
  4. รวบรวมชุดสรุปสูตรและเอกสารทางการสำหรับทบทวน: เอกสารข้อมูลที่เป็นประโยชน์ (Useful Information 2569), แผ่นสรุปสูตร Calculus Week 08–13, ชีตรวมสูตรแคลคูลัสฉบับพกพา NoteLub พร้อมสารบัญข้อสอบเก่าย้อนหลังพร้อมสถิติการออกสอบ (2559, 2560, 2561, สรุป NoteLub) ในคลังเรียนรู้ (โดย @Jesselpetry)
- **คลังสื่อการเรียนรู้และตารางสรุปเอกสารประจำสัปดาห์ครึ่งหลังวิชา MFIT (Weeks 08–15 Session Materials Decks)** —
  1. เพิ่มตารางโครงสร้างสัปดาห์ `MFIT_SCHEDULE` ใน `lib/library/course-weeks.ts` ครอบคลุม 15 สัปดาห์ (กลางภาค Week 01–07, ปลายภาค Week 08–15) และลงทะเบียนเข้าสู่ `COURSE_SCHEDULES`
  2. ลงทะเบียนเอกสารประกอบการเรียนวิชา Math for IT ครึ่งหลังทั้งหมดใน `lib/library/subject-library.ts` แยกบทเรียน (Chapter 8–15) ชัดเจนระหว่างสไลด์และชีตคำสั่ง (`lecture`), โจทย์การบ้าน 2569 (`exercise` พร้อมแฟล็ก `isCurrentYear: true`), เฉลยการบ้านฉบับพิมพ์ทางการ และเฉลยลายมือ v2
  3. ฝังตารางเอกสาร `## 📚 เอกสารประจำสัปดาห์` ในหน้าสรุปรายสัปดาห์ `study-guide-week08-summary.md` ถึง `week15-summary.md` ทั้ง 8 สัปดาห์ เชื่อมโยงกับคอมโพเนนต์ `SessionMaterialsDeck` แสดงผลแบบโต้ตอบทั้งการ์ดและตาราง พร้อมปุ่มเปิดดู PDF ในระบบทันที (โดย @Jesselpetry)
- **ระบบป้ายไฮไลต์และแบนเนอร์ข้อแนะนำก่อนวันสอบวิชา PSCP จากพี่ๆ TA (`ExamRecommendBanner`, Highlight Badges & Recommended Filter)** —
  1. เพิ่มแบนเนอร์ข้อแนะนำก่อนวันสอบ (`ExamRecommendBanner` ใน `components/pscp/exam-recommend-banner.tsx`) รวบรวม 8 โจทย์สำคัญที่พี่ๆ TA แนะนำสำหรับเตรียมตัวสอบปลายภาค (Final Prep): CuteCat CuteFox (#3476), Members (#3753), 3nPlus1 (#3609), 08.00 - B RNG (#3644), PhoneNumber (#3645), BookWorm (#3650), นับสระและหาสระเรียงกันยาวที่สุด (#3672) และ Who's the author (#3752) พร้อมปุ่มคลิกทำโจทย์ใน iHelp ทันทีและลิงก์เปิดบน iJudge
  2. เพิ่มป้ายไฮไลต์สีอำพันทอง (`TA Recommend`) พร้อมประกายไฟ (Sparkles) บนการ์ดโจทย์ (`ProblemCard`), ตารางโจทย์ (`ProblemRow`), แผงหัวข้อโจทย์ (`ProblemHeader`), แผงสรุปประจำสัปดาห์ (`WeeklyGuidePanel`) และตารางโจทย์มาร์กดาวน์ (`OjProblemsDeck`)
  3. เพิ่มตัวกรอง "โจทย์แนะนำ ★" ในแถบ Segmented Controls ของหน้ารายการโจทย์ (`components/pscp/problem-list.tsx` และ `components/problems-view.tsx`) ให้ค้นหาและคัดกรองโจทย์แนะนำทั้งหมด 18 ข้อ (กลางภาค 10 ข้อ + ปลายภาค 8 ข้อ) ได้ในคลิกเดียว
  4. ปรับลำดับการจัดเรียง (Priority Sorting) ให้โจทย์แนะนำก่อนวันสอบจาก TA ทั้ง 8 ข้อ ลอยตัวขึ้นมาแสดงผลอยู่บนสุดของหน้ารวมโจทย์ PSCP เสมอ โดยไม่ถูกบดบังหรือลดความทึบแสงจากสถานะหมดเขตส่ง เพื่อให้นักศึกษาเข้าถึงและฝึกทำได้ทันทีก่อนเข้าห้องสอบ (โดย @Jesselpetry)
- **ระบบสภาพแวดล้อมทำโจทย์ PSCP Workspace สถาปัตยกรรมใหม่ (Embedded Code Editor & Tabbed Test Case Runner)** — พัฒนาคอมโพเนนต์ย่อยแยกส่วน 4 ชิ้นสำหรับพื้นที่ทำงานทำโจทย์วิชา PSCP (`/pscp`, `/pscp/[slug]` และ `/recommended/[slug]/grade`):
  1. `ProblemHeader` (`components/pscp/problem-header.tsx`): ส่วนหัวโจทย์แบบรวมศูนย์ด้วย Breadcrumb แนวนอน (`PSCP / Week N (Midterm) / #ID`), ไอคอนดาวบุ๊กมาร์กติดกับชื่อโจทย์แบบคลิกบันทึกได้, ชิปหัวข้อแท็กสีเดียว (Monochromatic text chips), และแถบข้อมูลสถิติ/ข้อจำกัด/กำหนดส่งแบบ Tabular พร้อมจุดคั่นกลาง (`·`) โดยไม่ใช้สีแดงกับสถิติทั่วไป
  2. `ProblemIOSection` (`components/pscp/problem-io-section.tsx`): แยกบล็อกรูปแบบข้อมูลอินพุต (Input Format Row) พร้อมตัวอย่างดิบที่คัดลอกได้ในคลิกเดียว, เส้นคั่นบาง, บล็อกรูปแบบข้อมูลเอาต์พุต (Output Format Row) ระบุเงื่อนไข Exact Match / ตัวพิมพ์เล็กใหญ่, และกล่องเตือนจุดที่มักพลาด (Pitfalls) แบบ Low-contrast Alert Callout
  3. `CodeEditor` (`components/pscp/code-editor.tsx`): เอดิเตอร์เขียนโค้ด Python แบบเต็มรูปแบบด้วย CodeMirror 6 และ `@codemirror/lang-python` รองรับการตัดคำ ไฮไลต์คำสั่ง การเยื้องแท็บ 4 ช่อง เลขบรรทัด จับคู่วงเล็บ บันทึกร่างอัตโนมัติลง localStorage (`pscp_problem_${id}` ควบคู่กับ legacy key), แถบเครื่องมือบน (Python 3.11, สถานะ Saved, Reset Code ↺, Format Code, Copy All, Fullscreen), แถบล่างพร้อมปุ่ม Run Tests (`Ctrl+Enter` / `⌘Enter`), Export (.py / .json) และตัวจับเวลาการรัน
  4. `TestCaseNavigator` (`components/pscp/test-case-navigator.tsx`): แทนที่แถบ Accordion ซ้อนยาวด้วย Numbered Tab Strip แนวนอน `[ 1 ] [ 2 ] ... [ + Custom Input ]` พร้อมจุดสถานะ ผ่าน (เขียว) / ไม่ผ่าน (แดง) / ยังไม่รัน (วงกลมโปร่ง), แถบสรุปผลลัพธ์รวม (Batch Summary Chip: e.g. `Passed: 5/5`), แผงตรวจสอบแบบ 2 คอลัมน์ (stdin ซ้าย, expected & actual ขวา พร้อมปุ่มสลับ Diff View เปรียบเทียบตัวอักษร) และแท็บรันอินพุตกำหนดเอง (Custom Input Runner) (โดย @Jesselpetry)
- **จัดทำคู่มือและสรุปเนื้อหารายสัปดาห์ 14 สัปดาห์สำหรับวิชา PSCP (`archive/week01.md` – `week14.md`)** — จัดทำเนื้อหาวิชา Problem Solving and Computer Programming ครบ 14 สัปดาห์ ครอบคลุมตั้งแต่ Algorithm/Flowchart, ตัวแปรและชนิดข้อมูล, Conditionals, Loops, Strings, Functions, กลยุทธ์สอบกลางภาค, Nested Loops/Pattern Printing, Lists, Tuples, 2D Lists/Matrices, Dictionaries & Sets, Recursion/File I/O, ไปจนถึง Sorting Algorithms/Binary Search และกลยุทธ์สอบปลายภาค พร้อมตารางเอกสารประกอบการเรียนและกรอบข้อความข้อสอบเก่า (โดย @Jesselpetry)
- **เพิ่มแผงสรุปและแนะนำประจำสัปดาห์บนหน้าโจทย์ PSCP (`components/pscp/weekly-guide-panel.tsx`)** — เมื่อเลือกดูสัปดาห์ในหน้า `/pscp?week=N` แผงสรุปประจำสัปดาห์จะแสดงหัวข้อสองภาษา แบดจ์ช่วงสอบ (Midterm/Final) สถิติจำนวนโจทย์รวมและโจทย์ Learning Log พร้อมแถบวัดความคืบหน้า (Solved Meter), กล่องสรุปเนื้อหาแบบย่อที่พับขยายได้ (Notebook summary), ปุ่มพรีวิวสไลด์/แบบฝึกหัด PDF ทันทีผ่าน Preview Modal และปุ่มทางลัดเข้าสู่ระบบอ่านเต็มรูปแบบใน Course Reader (โดย @Jesselpetry)
- **เชื่อมโยงหลักสูตรรายสัปดาห์ PSCP เข้ากับระบบ Course Spine (`lib/courses/course-bindings.ts`) และ Course Weeks (`lib/library/course-weeks.ts`)** — รองรับโมดูล `syllabus_map` (`/courses/06066303-problem-solving-and-computer-programming/map`) ให้แสดง 14 สัปดาห์แบบโต้ตอบได้สมบูรณ์แบบพร้อมตารางเอกสารคลังสื่อ (โดย @Jesselpetry)
- **ระบบฝังตารางโจทย์ iJudge ประจำสัปดาห์สู่การ์ดและตารางโต้ตอบ (Weekly iJudge Problems Deck) เชื่อมโยงเข้าสู่ระบบฝึกทำโจทย์ใน iHelp โดยตรง** — พัฒนา parser ดักจับตารางโจทย์ในมาร์กดาวน์ (`lib/docs/oj-table.ts`) และคอมโพเนนต์แสดงผล `OjProblemsDeck` (`components/pscp/oj-problems-deck.tsx`) ในรูปแบบเดียวกับระบบฝังสไลด์และเอกสาร (`SessionMaterialsDeck`) รองรับทั้งมุมมองการ์ดบนมือถือและตารางบนเดสก์ท็อป แสดงป้ายระดับความยาก (Level 0–3+), แบดจ์ Learning Log [LL], คำแนะนำ/แนวคิดสำคัญ และปุ่ม 'ทำโจทย์ใน iHelp' ที่เปิด Workspace ทำโจทย์ Python ทันทีบนหน้า `/pscp` หรือนำทางเข้าสู่ `/pscp/[slug]` ใน iHelp โดยตรง (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับดีไซน์หน้าต่างพรีวิวเอกสารและ PDF (`PreviewModal` ใน `components/preview-modal.tsx`) สู่ Bottom Sheet สไตล์ Drawer เลื่อนขึ้นมาจากด้านล่างหน้าจอ** — ปรับตำแหน่งหน้าต่างพรีวิวให้อยู่ชิดขอบล่าง พร้อมขอบซ้าย-ขวาแนบสนิทพื้นผิวจอ (`items-end w-full rounded-t-2xl sm:rounded-t-3xl rounded-b-none`), เสริมแถบ Grab Bar ด้านบนเพื่อสื่อถึงแผงเลื่อนขึ้น (Drawer affordance), เพิ่มแอนิเมชันสไลด์ขึ้นอย่างนุ่มนวล (`slide-in-from-bottom duration-300 ease-out`) และรองรับระยะ Safe Area Inset ด้านล่างสำหรับอุปกรณ์พกพา (โดย @Jesselpetry)
- **เพิ่มแบดจ์ขอบเขตและสัดส่วนคะแนนบนเส้นคั่นหัวข้อจุดพักสอบ MFIT (`components/course-exam-milestone.tsx`, `lib/courses/course-timeline.ts`, `components/course-hub-shared.tsx`)** — แสดงแบดจ์ **"แคลคูลัส Week 08–15 · 35 คะแนน"** ทางฝั่งขวามือของเส้นคั่นหัวข้อ 'จุดพักสอบปลายภาค' (และ "พีชคณิตเชิงเส้น Week 01–07 · 35 คะแนน" สำหรับจุดพักสอบกลางภาค) สอดรับกับการปรับการ์ดเข้า War Room สีแดงให้มินิมอลไร้เงาไร้แบดจ์ภายใน พร้อมเพิ่ม `shrink-0` ในคอนเทนเนอร์ `aside` ของ `TopicHeader` เพื่อป้องกันการบีบอัดตัวอักษรของแบดจ์บนหน้าจอทุกขนาด (โดย @Jesselpetry)
- **ปรับปรุงการ์ดทรัพยากร (`ResourceItemCard` ใน `components/course-hub-shared.tsx`) ให้คลิกได้ทั้งการ์ด (Full-Card Clickable)** — พัฒนาให้สามารถคลิกที่บริเวณใดก็ได้บนตัวการ์ดเพื่อเปิดพรีวิวดูตัวอย่างเอกสารได้ทันที (`role="button"`, `tabIndex={0}`, รองรับการกดแป้นพิมพ์ Enter / Space) พร้อมตัดปุ่ม 'ดูตัวอย่าง' ที่ซ้ำซ้อนออกทั้งหมดเพื่อความสะอาดตา โดยยังคงปุ่มดาวน์โหลดเอกสารโดยตรงทางขวามือไว้พร้อม `stopPropagation()` ป้องกันการเปิดพรีวิวซ้ำซ้อน (โดย @Jesselpetry)
- **อัปเกรดเอนจินแสดงผลสูตรคณิตศาสตร์สู่ MathJax v3 SVG เต็มรูปแบบ (`rehype-mathjax/svg`) ทั้งใน Reader และ Quiz (`components/md-view.tsx`, `components/math-text.tsx`)** — เปลี่ยนผ่านจาก KaTeX สู่ MathJax v3 SVG Engine พร้อมตั้งค่า local font caching (`MATHJAX_OPTIONS`) เพื่อเรนเดอร์สมการคณิตศาสตร์และตัวเลือกคำตอบเป็นเวกเตอร์ SVG คมชัด ไร้ปัญหา Font Metrics Desync หรือการซ้อนทับกันของตัวแปร (โดย @Jesselpetry)
- **ปรับแต่งการ์ดและหัวข้อคั่นหมวดหมู่ข้อสอบจำลองปลายภาค MFIT (`components/course-hub-shared.tsx`, `components/mfit-war-room-portal.tsx`)** — เพิ่มพร็อพ `description` ในคอมโพเนนต์ `TopicHeader` เพื่อย้ายข้อความอธิบายที่มาของข้อสอบจำลอง ("จำลองจากสถิติข้อสอบจริง 2559–2561 (22–26 ข้อ) ข้อเขียน 100% คิดมือล้วน พร้อมเฉลยละเอียดและวิเคราะห์วิธีทำทีละขั้น") ไปแสดงอยู่ใต้เส้นคั่นหัวข้อหลักของส่วน 'ข้อสอบจำลองปลายภาค 25 ข้อ (Final Mock Exam)' และปรับการ์ดกดเริ่มทำข้อสอบให้เป็นแถวเดี่ยวกะทัดรัด (Single-row) สะอาดตาในระดับเดียวกับการ์ดทรัพยากรอื่น ๆ (โดย @Jesselpetry)
- **ยกระดับ UI ผู้จัดทำรายวิชา (Course Contributors) สู่ระบบพับขยายผลงาน (Collapsible), จุดบูลเล็ตสะอาดตา และจัดมาตรฐานเครดิตผลงาน (`components/course-contributors.tsx`, `lib/contributors/registry.ts`)** —
  1. **ยุบรายการผลงานเป็นค่าเริ่มต้น (Collapsible UI):** แสดงผลเฉพาะส่วนหัวโปรไฟล์ (Avatar, ชื่อ, แบดจ์บทบาททรงกลม, ชั้นปีและรหัสนักศึกษา, ปุ่มโซเชียล) และเปลี่ยนส่วน "ผลงานและเอกสารในวิชานี้" เป็นปุ่มพับ-ขยาย (`isExpanded`) พร้อมไอคอน Chevron และตัวนับรายการ เพื่อลดความยาวของการ์ดและให้ผู้ใช้เลือกกดดูเอกสารได้ตามต้องการ
  2. **จุดบูลเล็ตมินิมอลไร้กรอบ (Frameless Plain Bullet Dot):** ปรับแต่งจุดนำหน้าผลงานในรายการเป็นจุดบูลเล็ตมินิมอลแบบเรียบกลมเปล่า ๆ (`size-1.5 rounded-full bg-muted-foreground/50`) โดยตัดกรอบวงแหวนหนา (`ring-4 ring-primary/10`) ออกทั้งหมดเพื่อความสะอาดตา
  3. **มาตรฐานชื่อผลงานและแบดจ์ (Credit & Title Standardization):** ตัดเลขจำนวนหน้าและคำอธิบายรูปแบบที่ปะปนในชื่อผลงานออกทั้งหมด (เช่น ตัด `(21 หน้า)` ในชีต Holy Shit Final Part 1 ของ @tammadon, ตัด `(PDF 8 สัปดาห์)` และ `(Figma แปลไทย 7 บท)` ของ @PhuPunnavit, ตัด `(ปี 65 โดยพี่ฟิว)` ของ @fewIt25) ให้คงเหลือเฉพาะชื่อสาระของผลงานอย่างเป็นมาตรฐาน พร้อมปรับแบดจ์ประเภทเอกสารเป็นคำมาตรฐาน (`ชีตสรุป`, `สไลด์แปลไทย`, `แนวข้อสอบ`, `บันทึก Notion`, `ข้อสอบจำลอง`)
  4. **จำแนกเครดิตผู้จัดทำเนื้อหารายวิชาตรงตามความเป็นจริง:** ถอดรายการสรุปข้อสอบ Math for IT (Q1–Q10) และเอกสารสมมติออกจากโปรไฟล์ผู้ก่อตั้ง (@Jesselpetry) ใน `registry.ts` โดยสงวนเครดิตในหน้ารายวิชาเฉพาะผู้จัดทำเนื้อหาการเรียนการสอนจริง (ชีตสรุป แคลคูลัสปลายภาค โดย @tammadon และสไลด์สรุป ICS โดย @PhuPunnavit) ขณะที่ @Jesselpetry ได้รับการระบุเครดิตในฐานะผู้ก่อตั้งและสถาปัตยกรรมระบบแพลตฟอร์มส่วนกลาง (`courseCode: "ALL"`) (โดย @Jesselpetry)
- **ปรับปรุงการจัดระเบียบคลังเรียนรู้และการนำทางไทม์ไลน์รายวิชา MFIT (`lib/library/subject-library.ts`, `lib/courses/course-timeline.ts`)** —
  1. เพิ่ม `courseCode: "MFIT"` และ `chapter: 1..7` ให้กับเอกสารครึ่งแรกทั้งหมดใน `subject-library.ts` เพื่อให้ระบบคัดกรองแยกสัปดาห์ทำงานได้อย่างแม่นยำ ไม่ปะปนกัน
  2. ปรับแต่ง `course-timeline.ts` ให้จุดพักสอบปลายภาค (Final Milestone) ของ MFIT ลิงก์ตรงเข้าสู่หน้า Final Exam War Room เพื่อให้นักศึกษาเข้าถึงยุทธการสอบและข้อสอบเก่าได้ในคลิกเดียว (โดย @Jesselpetry)
- **ปรับปรุงการแสดงผลการ์ดผู้จัดทำและรายการผลงานในหน้ารายวิชาสู่ดีไซน์มินิมอลโมเดิร์น (`components/course-contributors.tsx`)** —
  1. ลดทอนความหนาแน่นของส่วนหัวโปรไฟล์: ตัดคำนำหน้ารุ่น/สถาบันซ้ำซ้อนออก เหลือเพียงชั้นปีและรหัสนักศึกษา `ชั้นปีที่ 1 (69070027)` และตัดบรรทัดชื่อเอกสารซ้ำซ้อนใต้ชื่อออก เพื่อให้การ์ดดูโปร่ง สะอาดตา
  2. ปรับแบดจ์บทบาทผู้จัดทำเป็นทรงแคปซูลมนกลม (`rounded-full`) พร้อมจุด Indicator สไตล์มินิมอล (`size-1.5 rounded-full bg-primary`)
  3. ออกแบบส่วนหัวหมวดหมู่ผลงานใหม่ (`ContributorSectionHeader`) พร้อมเคาน์เตอร์แคปซูลแสดงจำนวนผลงานในวิชาอย่างเป็นสัดส่วน
  4. แปลงรายการผลงานเป็นการ์ดเดี่ยว (`ContributorMaterialCard`) พร้อมบูลเล็ตพอยต์และปุ่ม Action ด้านขวา (ดูสรุป, ดูข้อสอบ, ดูสไลด์ ฯลฯ) ที่นำทางไปยังไฟล์หรือหน้าเอกสารได้อย่างสะดวกและสะอาดตา (โดย @Jesselpetry)
- **อัปเดตชุดโจทย์ PSCP และเฉลยอ้างอิงให้เป็นปัจจุบันตามคลังต้นทาง (`branch OP`)** — อัปเดตข้อมูลโจทย์ใน `data/oj_problems.json`, รายละเอียดโจทย์ใน `data/all_problems_detail.json` และสร้าง registry `data/pscp/problems.json` ใหม่ รวมทั้งหมด 273 ข้อ ครอบคลุมโจทย์สัปดาห์ที่ 15 และ 16 (เพิ่มโจทย์ oj3642 ถึง oj3680 รวม 38 ข้อใหม่) พร้อมชุดเคสทดสอบทางการ (Official Cases), เคสขอบเขตที่สร้างขึ้น (Edge Cases 919 เคส) และตรวจสอบการทำงานของเฉลยอ้างอิงผ่าน `pscp:verify` ครบทุกข้อ (โดย @Jesselpetry)
- **ยกเครื่องหน้าจอทำโจทย์และพื้นที่ทำงาน PSCP Workspace สู่ระบบ Code Editor และ Tabbed Test Runner เต็มรูปแบบ (`components/pscp/`)** —
  1. **แผงซ้าย (Problem Header & Meta Refactoring):** รวบรวมข้อมูลส่วนหัวด้วย Breadcrumbs แบบมินิมอล (`PSCP / Week X / #ID`), หัวข้อโจทย์ H1 พร้อมปุ่มบุ๊กมาร์กดาวแบบอินไลน์, ปรับป้ายแท็กหัวข้อสู่ชิปโมโนโครม (`bg-muted/60 text-muted-foreground`), แถบสถิติแนวนอนรวม Pass rate, Limit (เวลา/แรม) และกำหนดส่งด้วยจุดคั่น (`·`) โดยสงวนสีแดงไว้เฉพาะเมื่อหมดเขต
  2. **แยกแถวรูปแบบอินพุต/เอาต์พุต (Problem I/O Section):** จัดวางกล่อง Input Specification และ Output Specification แยกแถวชัดเจนพร้อมบล็อกตัวอย่างดิบที่คัดลอกได้ในคลิกเดียว และปรับกรอบแจ้งเตือนข้อควรระวัง/จุดที่มักพลาด (Pitfalls) สู่ Alert Callout สไตล์ Low-contrast แถบสีอำพัน
  3. **แผงขวาแบ่ง 2 ส่วนแนวตั้ง (Coding Panel มืดสไตล์ IDE & Test Case Panel ธีมมาตรฐาน):** ออกแบบพื้นที่ฝั่งขวาแยกเป็น 2 ส่วนชัดเจน โดยส่วนบนเป็นตัวเขียนโค้ดและรันเนอร์สีมืดสนิทสไตล์ IDE มืออาชีพ (`#0d0d11`, `#141419`) ขับเคลื่อนด้วย CodeMirror 6 รองรับ Python 3 ไฮไลต์ไวยากรณ์, Indentation Tab 4 เคาะ, ตัวเลขบรรทัดและ Active Line Gutter, Bracket matching, Auto-closing quotes, คีย์ลัดสลับคอมเมนต์ และบันทึกร่างโค้ดอัตโนมัติลง localStorage (`pscp_problem_${id}`) พร้อมแถบเครื่องมือ Reset, Format Code, Copy All, Fullscreen และแถบล่างพร้อมปุ่ม Run Tests (`Ctrl+Enter`), เมนู Export (.py / .json) และมาตรวัดเวลาประมวลผล ขณะที่ส่วนล่างและองค์ประกอบแวดล้อมใช้สีธีมปกติของระบบ (`bg-card`, กรอบมาตรฐาน)
  4. **ระบบชุดทดสอบปุ่มวงกลมตรงกลางและตำแหน่งล็อกคงที่ (Top-Centered Circular Buttons & Fixed Static 2-Column Runner):** ออกแบบปุ่มหมายเลขเคสทดสอบ `1` `2` `3` `4` `5` และปุ่มบวก (`+`) สำหรับ Custom Input เป็นปุ่มวงกลม (`rounded-full size-8`) จัดวางกึ่งกลางแนวนอนด้านบนของ Test Case Panel พร้อมจุดสถานะผ่าน/ไม่ผ่านบนปุ่ม และล็อกตำแหน่งคงที่ (Fixed Static Location) ไม่ขยับไปไหน โดยกล่อง Input (stdin) อยู่ฝั่งซ้ายเสมอ และกล่อง Output (Expected ด้านบน, Actual / Diff ด้านล่าง) อยู่ฝั่งขวาเสมอด้วยความสูงที่แน่นอน ไม่มีการกระตุกหรือขยายตัวของเลย์เอาต์เมื่อรันหรือสลับเคส (โดย @Jesselpetry)
- **จัดระเบียบเนื้อหาส่วนล่างหน้ารายวิชา (Course Hub Stream Order & Academic Contributors)** — ย้าย 'ข้อชี้แจงเกี่ยวกับแนวข้อสอบ' ไปอยู่ด้านล่างต่อจาก 'ผู้จัดทำ', ลด Spacing ช่องว่างด้านบนของส่วนผู้จัดทำ และกรองรายชื่อผู้จัดทำในหน้ารายวิชาให้แสดงเฉพาะผลงานทางวิชาการ (สรุป, สไลด์แปลไทย, บันทึก Notion, ข้อสอบจำลอง) ในวิชานั้น ๆ โดยตัดระบบและเครื่องมือพัฒนาเว็บไซต์ออก 100% (โดย @Jesselpetry)
- **ปรับปรุงการ์ดผู้จัดทำในหน้ารายวิชา (Course Contributors Section) สู่ดีไซน์กะทัดรัด คลีน และ De-boxed** — ลด Padding เหลือ p-4/p-5, ปรับ Avatar สู่ 44–48px, รวมข้อมูลการศึกษาเป็นบรรทัดเดียว 'IT KMITL #24 · ปี 1 (รหัสนักศึกษา)', แปลงกลุ่มปุ่มโซเชียลเป็นไอคอนโมโนโครมขนาดกะทัดรัด (w-8 h-8), ปรับรายการผลงานเป็น Borderless List พร้อม Hover Highlight และปรับหัวข้อหมวดให้เรียบง่ายไร้ Badge ซ้ำซ้อน (โดย @Jesselpetry)
- **ย้ายปุ่มสลับรูปแบบภาพรวม (ฉบับย่อ / ทางการ) จากแบนเนอร์วิชาไปยังหัวข้อภาพรวม (`components/course-overview.tsx`, `components/course-banner.tsx`)** — ปลดล็อคแบนเนอร์รายวิชาให้สะอาดตาและคงทนต่อการแสดงผล นำปุ่มสลับเวอร์ชันแคปซูลไปวางไว้ข้างหัวข้อ "ภาพรวม" (Overview) ซึ่งเป็นตำแหน่งที่ควบคุมเนื้อหาโดยตรง พร้อมปุ่มทางลัดไปยังเว็บคณะฯ หรือปุ่มย่อเนื้อหาเมื่อขยาย (โดย @Jesselpetry)
- **จัดโครงสร้างหน้ารายวิชาแบบ Dual-Panel สไตล์ Classroom พร้อมการเลื่อนแบบธรรมชาติ (`components/subject-hub.tsx`, `components/course-sidebar.tsx`)** — คงโครงสร้างแบนเนอร์ด้านบนและการเลื่อนหน้าตามธรรมชาติ (Natural Page Scroll) โดยเมื่อเลื่อนหน้าจอ แบนเนอร์จะเลื่อนตามขึ้นไป และแผงนำทางด้านซ้าย (ช่วงสอบและหัวข้อ) จะ Sticky อยู่ใต้ขอบบนอย่างลงตัว ควบคู่ไปกับแผงสตรีมเนื้อหารายสัปดาห์ด้านขวา (โดย @Jesselpetry)
- **รวมศูนย์มาตรฐานสัญลักษณ์ลายน้ำและพื้นหลังแกรเดียนต์รายวิชา (`lib/courses/course-theme.ts`, `components/course-watermark.tsx`)** — สร้างโมดูลธีม `IHELP_GRADIENT_CSS` และคอมโพเนนต์ `CourseWatermark` แสดงตรา GE สีขาวสำหรับ Charm School และ Foundation English, ตราพระจอมเกล้าสำหรับวิชา EN-KMITL และตราคณะไอทีสำหรับวิชาไอที ทั้งบนการ์ดหน้ารวมและแบนเนอร์หน้ารายวิชา (โดย @Jesselpetry)

### แก้ไข

- **ฝังเอนจิน KaTeX Math Renderer สำหรับแสดงผลสูตรคณิตศาสตร์ในข้อสอบจำลองและตัวเลือกคำตอบ (`components/math-text.tsx`, `components/technique-quiz.tsx`)** —
  1. สร้างคอมโพเนนต์ `<MathText />` รองรับการถอดรหัสและเรนเดอร์สมการคณิตศาสตร์และสัญลักษณ์ LaTeX ทั้งแบบ Inline (`$...$`, `\(...\)`) และ Display (`$$...$$`, `\[...\]`) ด้วย KaTeX โดยคงข้อความภาษาไทย/อังกฤษแวดล้อมไว้อย่างสมบูรณ์
  2. ผูกเอนจิน `MathText` เข้ากับส่วนแสดงผลของโจทย์ (`question.prompt`), ช้อยส์ตัวเลือกคำตอบ (`opt.label`), กล่องคำอธิบายเฉลยย่อย (`opt.why`) และรายการทบทวนคำตอบตอนจบแบบทดสอบใน `TechniqueQuiz` ส่งผลให้ข้อสอบจำลอง MFIT Final 25 ข้อ และ 99 ช้อยส์แคลคูลัส (ลิมิต, อนุพันธ์, ปริพันธ์, เมทริกซ์ ฯลฯ) แสดงผลสูตรคณิตศาสตร์ที่คมชัด สวยงาม ถูกต้องตามหลักไวยากรณ์ (โดย @Jesselpetry)
- **แก้ไขการแสดงผลไอคอน Notion SVG ในแถบโซเชียลผู้จัดทำ (`components/social-icons.tsx`)** — อัปเดต Path SVG ของ Notion สู่มาตรฐานทางการของ Simple Icons ขนาด 24x24 คมชัด ไร้บั๊กการแสดงผลเพี้ยนหรือทึบตัน (โดย @Jesselpetry)
- **แก้ปัญหาสูตรคณิตศาสตร์ซ้อนทับกัน (LaTeX Display Stack Overlap & Math Isolation)** — แก้ไขปัญหาตัวแปร, เศษส่วน (`\frac`), ลิมิต (`\lim`) และเลขยกกำลังในเนื้อหาวิชา Math for IT และ Logic ซ้อนทับกันอันเนื่องมาจาก `white-space: normal` และการตัดคำของพารากราฟ (`overflow-wrap: anywhere`) โดยกำหนดการคำนวณ Strut และพื้นที่แสดงผลสูตรคณิตศาสตร์ใน `app/globals.css` (`white-space: nowrap !important; display: inline-block; min-width: 100%; text-align: center; overflow-wrap: normal !important;`) ควบคู่กับการรองรับ MathJax/KaTeX SVG Styling สำหรับโหมดสมุดเลกเชอร์ (โดย @Jesselpetry)
- **แก้ไขปัญหาสระภาษาไทยลอยและแปลงบล็อกข้อความจำลองโค้ด (Pseudo-code Markdown Textarea) ในเอกสารคู่มือเตรียมสอบสู่ตารางและรายการตามมาตรฐาน** —
  - ปรับปรุงการจัดรูปแบบสูตรคณิตศาสตร์และข้อความภาษาไทยใน Math Renderer (`app/globals.css`, `components/md-view.tsx`) ป้องกันการแตกคำและสระวรรณยุกต์ภาษาไทยลอย/แยกส่วน (`overflow-wrap: normal !important; word-break: normal !important;`) และใช้ฟอนต์ `IBM Plex Sans Thai` ในการจัดเรียงอักษรควบคู่กับ KaTeX
  - แปลงบล็อกโค้ดธรรมดา (Textarea Code Blocks) ที่บันทึกขั้นตอนคำนวณและตาราง ASCII ในคู่มือสรุปวิชา Math for IT (Week 08–15, Mock Exam, Quizzes), IT Fundamentals (Midterm & Final Guides), Business for IT (สมการบัญชี งบการเงิน EOQ) และ General Chemistry (สูตรและสิ่งที่ต้องจำ บทที่ 1–5) ให้กลายเป็น Markdown Table, Numbered Steps และสมการคณิตศาสตร์ LaTeX ที่ถูกต้องและอ่านง่ายในทุกขนาดหน้าจอ (โดย @Jesselpetry)

---

## [1.0.0] - 8 พฤศจิกายน 2569

> **วิวัฒนาการหลัก (v1.0.0):** Production Release: สถาปัตยกรรม Weekly Learning Path, ICS Track A และระบบ Contributor Credit System สมบูรณ์แบบ

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ปรับโครงสร้างหน้าหลักรายวิชาสู่ระบบเส้นทางการเรียนรู้รายสัปดาห์ (Weekly Learning Path)** — แยกเนื้อหาครึ่งแรก/ครึ่งหลัง คั่นด้วยจุดพักสอบกลางภาคและปลายภาค (Isolated Exam Milestones) พร้อมช่องค้นหาแคปซูลแบบ Real-time และตัวกรองช่วงสอบ (โดย @Jesselpetry)
- **จัดทำเอกสารและหน้ารายสัปดาห์สำหรับวิชา ICS ครึ่งแรก (Track A: Digital Logic สัปดาห์ที่ 1–7)** — เพิ่มเอกสาร 7 บท (`archive/logic-week01.md` ถึง `logic-week07.md`) ครอบคลุมดิจิทัลลอจิก, พีชคณิตบูลีน, SOP/POS, K-map, Time Response, เลขฐาน และ MUX/DEMUX พร้อมตารางเชื่อมโยงสไลด์และแล็บ Logisim (โดย @Jesselpetry)
- **ระบบ Contributor Credit และโปรไฟล์ผู้ร่วมแบ่งปันเนื้อหาท้ายหน้ารายวิชา (`lib/contributors/`)** — รวมศูนย์ข้อมูลผู้ร่วมพัฒนาและผู้แบ่งปันเนื้อหา พร้อมระบบคำนวณและเลื่อนชั้นปีอัตโนมัติตามรหัสนักศึกษา (Auto Academic Year Engine) (โดย @Jesselpetry)
- **ระบบตรวจสอบความถูกต้องของรุ่นนักศึกษาไอที (KMITL IT Cohort Formula & Auditing Rule: IT<yy-45>)** — ตรวจสอบความถูกต้องของเลขรุ่นกับรหัสนักศึกษา (รหัส 69 = IT24, 68 = IT23, 67 = IT22) เชื่อมต่อกระบวนการตรวจสอบอัตโนมัติใน `content:check` (โดย @Jesselpetry)

### ปรับปรุง

- **รวมศูนย์มาตรฐานสัญลักษณ์และธีมแบนเนอร์รายวิชา (Unified Course Watermark & Gradient Banner System)** — พัฒนาคอมโพเนนต์ร่วม `CourseWatermark` และโมดูลธีม `lib/courses/course-theme.ts` เพื่อรวมศูนย์การจัดการไล่เฉดสีฟ้าอันเป็นเอกลักษณ์ (`IHELP_GRADIENT_CSS` / `.bg-ihelp-gradient`) เส้นขอบขาวโปร่งแสง (`border-white/10`) และเงาละมุน พร้อมเชื่อมโยงการแสดงผลบนแบนเนอร์หน้ารายวิชา (`components/course-banner.tsx`) ให้สอดคล้องกับภาพย่อการ์ดรายวิชา (`components/course-book-card.tsx`) ครอบคลุมทั้งวิชา IT, GE (Charm School, Foundation English) และ EN-KMITL (โดย @Jesselpetry)
- **ปรับปรุงโครงสร้าง Contributor Profile Modal ให้ Responsive 100% และไม่โดนแบนเนอร์บดบัง** — ปรับ Avatar ทรงกลมมน (`rounded-full`), จัดลำดับข้อมูล คณะ > สาขา > ชั้นปี > รหัสนักศึกษา > รุ่น IT พร้อมระบบ Accordion พับ-ขยายสำหรับผลงานรายวิชาและประวัติ Commit (โดย @Jesselpetry)
- **ปรับปรุงการ์ดเครดิตผู้จัดทำและร่วมแบ่งปันเนื้อหาท้ายหน้ารายวิชาสู่ดีไซน์แนวนอนแบบกว้าง (Wide Horizontal Cards)** — แสดงผลงานรายวิชาแนวนอน พร้อมไอคอน Dev/Terminal สำหรับ Lead Maintainer และปุ่มโซเชียลแบดจ์เต็ม (โดย @Jesselpetry)
- **ปรับปรุงระบบเลย์เอาต์หน้ารายวิชา (`/courses/[dir]`) คืนสู่ระบบการเลื่อนหน้าแบบธรรมชาติ (Natural Page Scroll)** — เลื่อนหน้าพร้อมกันอย่างลื่นไหลและเชื่อมโยง Sidebar Jump Links อัตโนมัติ (โดย @Jesselpetry)
- **ปรับปรุงแถบค้นหารายวิชาและการ์ดรายวิชากะทัดรัด แนวนอน สไตล์ MIT OpenCourseWare (`/`)** — เพิ่ม Mini Calendar Y1·S1, กรอบไล่เฉดสีฟ้า iHelp Blue Gradient และคู่มือมาตรฐานแบรนด์ [`docs/BRANDING.md`](./docs/BRANDING.md) (โดย @Jesselpetry)
- **ปรับเปลี่ยนลายน้ำตราสัญลักษณ์บนการ์ดรายวิชา Charm School และ FE เป็นตรา GE สีขาว และวิชา EN-KMITL เป็นตราสถาบัน** — แสดงตราสำนักวิชาศึกษาทั่วไปและตราพระจอมเกล้าลาดกระบังตามสังกัดวิชา (โดย @Jesselpetry)

### แก้ไข

- **แก้ไขปัญหาลิงก์สัปดาห์ที่ 7 (MUX/DEMUX) ของวิชา ICS จับคู่ผิดสโคปไปยังครึ่งหลัง (ALU/CPU)** — แยกสโคป `scope: "midterm"` และ `scope: "final"` ออกจากกันอย่างเด็ดขาด และแก้ไขลิงก์สัปดาห์ที่ 0 404 (โดย @Jesselpetry)

---

## [0.9.0] - 7 พฤศจิกายน 2569

> **วิวัฒนาการหลัก (v0.9.x):** REST API คลังสื่อสาธารณะ, ยกเครื่อง Grade Calculator 3 แผง และหน้ารวมผู้พัฒนา

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **Public API คลังสื่อการเรียนรู้ `/api/library/catalog`** — REST API endpoint สาธารณะความเร็วสูงสำหรับ AI Agents และบุคคลภายนอก ค้นหาและกรอง Dictionary สื่อ 570 รายการ ปลอดภัยด้วย Zero-Trust ตัดเอกสารลับ 100% (โดย @Jesselpetry)
- **จัดทำเอกสารสถาปัตยกรรมคลังสื่อฉบับสมบูรณ์และคู่มือการจัดการเวอร์ชัน** — เผยแพร่ [`docs/LIBRARY_ARCHITECTURE_AND_WORKFLOW.md`](./docs/LIBRARY_ARCHITECTURE_AND_WORKFLOW.md) และ [`docs/VERSION_CONTROL_GUIDE.md`](./docs/VERSION_CONTROL_GUIDE.md) (โดย @Jesselpetry)

### ปรับปรุง

- **ยกเครื่องระบบคำนวณคะแนนและตัดเกรด `/grade-calculator` สู่สถาปัตยกรรม 3 แผง** — แบ่งสัดส่วน CourseNav / ScoreInputs / ResultsPanel พร้อมแผนที่เป้าหมายคะแนน Final, แผนภูมิ GPS Simulator และคำนวณสูตรสด (โดย @Jesselpetry)
- **ปรับโฉมหน้าประวัติเวอร์ชันและผู้ร่วมพัฒนา `/version` สไตล์ GitHub Releases** — แบ่งเลย์เอาต์ 2 แผง พร้อมป้ายระบุเวอร์ชันปัจจุบัน และการ์ดข้อมูลผู้ร่วมพัฒนาแบบคลีนไม่มีเส้นขอบ (โดย @Jesselpetry)
- **ยกเครื่อง Contributor Profile Modal ให้ Responsive** — ปรับปุ่มโซเชียลเป็นทรงมน (`rounded-full`) เงา `shadow-sm`/`shadow-md` และแจกแจงประวัติการพัฒนาละเอียด (โดย @Jesselpetry)

### แก้ไข

- **นำจุดเขียว AvatarBadge (online status indicator) ออกจาก Avatar ผู้ร่วมพัฒนาทั้งหมด** — เพื่อไม่ให้บดบังรูปโปรไฟล์ (โดย @Jesselpetry)

---

## [0.8.5] - 3 พฤศจิกายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบคำนวณคะแนนและตัดเกรดรุ่นแรก (`/grade-calculator`)** — คำนวณคะแนนตามสัดส่วนวิชา ปี 1 เทอม 1 IT KMITL, คิดเลขสดในช่อง (`10+5+8.5`), ตัดเกรด A-F และ S/U, และรองรับการวางข้อมูลจาก Excel/TSV (โดย @Jesselpetry)
- **ITF ชุดเตรียมสอบปลายภาค Week 08–15** — คู่มือทบทวนและวิธีคำนวณ IP Subnet ละเอียด พร้อมแนวข้อสอบ 60 ข้อพร้อมเฉลย (โดย @Jesselpetry)
- **ITF โน้ตสรุปจาก Notion ของ Tammadon Suksa (IT24)** — 79 ภาพสไลด์พร้อมจดโน้ตทับ ในหน้าสรุปรายสัปดาห์ Week 08-15 (โดย @Jesselpetry)
- **ลิงก์สไลด์เสริม Infraclover ITCAMP20 สำหรับสัปดาห์เน็ตเวิร์ก** — สไลด์อ่านเสริมเรื่องเครือข่ายแปะไว้ต้นหน้าสัปดาห์ (โดย @Jesselpetry)

### ปรับปรุง

- **ยกเครื่องพาเลทสีโหมดมืดสู่ Neutral Charcoal สไตล์ Figma (`#141416`, `#1c1c1f`, `#222226`)** — มิติความลึกคมชัด สบายตา ลดการเมื่อยล้าสายตาด้วยข้อความ Off-white (`#f4f4f6`) (โดย @Jesselpetry)

---

## [0.8.4] - 30 ตุลาคม 2569

**ผู้ร่วมพัฒนา:** PhuPunnavit ([@PhuPunnavit](https://github.com/PhuPunnavit), IG: [@priiu_i](https://instagram.com/priiu_i)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ฟีเจอร์ Chat Help-Desk มุมขวาล่าง** — ผู้ช่วยตอบคำถามการใช้งานทันใจด้วย FAQ กว่า 75 ข้อ ค้นหาไฟล์ในคลังรายวิชาแบบเรียลไทม์ และระบบ AI สตรีมมิ่ง พร้อม Guard Rails เข้มงวด (โดย @PhuPunnavit)
- **ITF สไลด์บรรยายฉบับสรุปแปลไทย Week 08–15** — เลกเชอร์ครึ่งหลังแปลไทยย่อจบใน 1 หน้าต่อสัปดาห์ ออกแบบใน Figma บรรจุในคลังเอกสารและหน้าสัปดาห์เรียน พร้อมคำค้นหา 'แปลไทย' (โดย @PhuPunnavit)

### ปรับปรุง

- **เชื่อมโยงสไลด์แปลไทยเข้ากับระบบค้นหาของ Help-Desk Chat และหน้าสารบัญสัปดาห์เรียน** — รองรับคำค้นหาฉบับแปลไทยและเปิดดูตัวอย่างได้ทันใจ (โดย @PhuPunnavit)

---

## [0.8.3] - 22 ตุลาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ตารางสอบและผังที่นั่งสอบรายบุคคล (`/exam-schedule`)** — ค้นหากำหนดการสอบ ห้องสอบ และเลขที่นั่งสอบด้วยรหัสนักศึกษา 8 หลัก พร้อมผังที่นั่ง Interactive Seating Map ในห้องเรียน และส่งออกปฏิทิน .ics (โดย @Jesselpetry)
- **ตัวนับถอยหลังพร้อมเสียงเตือนขอยกเลิกสอบ (Resign countdown sound & loud-mode config)** — ตัวช่วยแจ้งเตือนและระบบยืนยันความพร้อม (โดย @Jesselpetry)
- **พื้นที่อ่านหนังสือสอบปลายภาค (`/profile/<รหัส>/study`)** — หน้าโฟกัสพร้อมตัวจับเวลา Standby โควตา 112 ชั่วโมง และบันทึกเวลาในเครื่อง (โดย @Jesselpetry)
- **ระบบภาพแชร์ OpenGraph Card (`/og/*.png`) และคำอธิบาย Meta อัตโนมัติ** — รองรับทุกหน้ารายวิชา โมดูล คลังเอกสาร และตารางสอบ (โดย @Jesselpetry)

---

## [0.8.2] - 17 ตุลาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ดัชนีคลังรวมศูนย์ `resource-index.json` และชุดคำสั่ง CLI** — สคริปต์ `library:audit` สำหรับตรวจสอบความสอดคล้องของคลัง และ `library:find` สำหรับค้นหาทรัพยากร (โดย @Jesselpetry)
- **ซิงก์เนื้อหา OnLearn ITF Week 11-15** — เพิ่มใบงานแล็บ 04, 05, 12, 13 และฝังวิดีโอบันทึกการสอน Lab 13-14 บนหน้าสัปดาห์ (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับเลย์เอาต์แบนเนอร์รายวิชาสไตล์ Google Classroom** — พร้อมลายน้ำรหัสวิชาโปร่งแสงและลดความสูงให้กะทัดรัด (โดย @Jesselpetry)
- **แยกโครงสร้างเนื้อหาและข้อสอบครึ่งแรก/ครึ่งหลังของวิชา ICS ออกจากกันชัดเจน** — แยกระหว่าง Track A (Digital Logic) และ Track B (Computer Hardware) (โดย @Jesselpetry)

---

## [0.8.1] - 27 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **มุมมองคลังทรัพยากรรายสัปดาห์แบบเดียวกันทั้ง ITF และ ICS** — จัดกลุ่มตามสัปดาห์และช่วงสอบ พร้อมลิงก์ต้นทาง OnLearn (โดย @Jesselpetry)
- **หน้าคาบเรียนรายสัปดาห์วิชา ITF (`/courses/06016402-IT-Fundamentals/map`) ครบ 15 สัปดาห์** — พร้อมสรุปอ่านสอบและแบบทดสอบตนเอง (โดย @Jesselpetry)
- **มาตรฐานภาพรวมรายวิชา `summary.md`** — โครงสร้างเดียวกัน 6 หัวข้อสำหรับทุกรายวิชา ตรวจสอบผ่าน `content:check` (โดย @Jesselpetry)

### แก้ไข

- **ปรับปรุงการจัดหน้าตารางกว้างในตัวอ่าน Markdown ไม่ให้ล้นการ์ดบนสมาร์ตโฟน** — จัดการ Responsive Table บนอุปกรณ์จอเล็ก (โดย @Jesselpetry)

---

## [0.8.0] - 22 กันยายน 2569

> **วิวัฒนาการหลัก (v0.8.x):** คลังสื่อเปิดเต็มรูปแบบ, ตารางสอบผังที่นั่ง, Help-Desk Chat โดย PhuPunnavit, สไลด์แปลไทย และเครื่องคิดเกรด

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **สื่อแต่ละชิ้นมีข้อมูลกำกับรุ่นและสัปดาห์ (`edition`, `week`, `isCurrentYear`)** — จับคู่สไลด์กับแล็บและซ่อนไฟล์เก่าอัตโนมัติ (โดย @Jesselpetry)
- **ทำเนียบอาจารย์ผู้สอนคณะ IT KMITL** — จัดมาตรฐานชื่ออาจารย์ผู้สอนทุกรายวิชา (โดย @Jesselpetry)
- **ฟอนต์ TH Sarabun New สำหรับตัวอ่านเอกสาร Markdown** — พร้อมชุดแต่งสมุดบันทึกเส้นแดง (Red Ink Notebook variant) (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับโครงสร้างหน้ารายวิชาสู่ 4 หมวดตามจุดประสงค์การเรียนรู้** — ปูพื้นฐาน, ย่อสอบ, ตะลุยโจทย์, จำลองสอบ (โดย @Jesselpetry)
- **เปิดให้บริการคลังทรัพยากร `/library` อย่างเป็นทางการเต็มรูปแบบ** — นำหน้าคลุม Coming Soon ออก (โดย @Jesselpetry)

---

## [0.7.0] - 22 กันยายน 2569

> **วิวัฒนาการหลัก (v0.7.x):** PWA ออฟไลน์ และคาบเรียนรายสัปดาห์ ICS พร้อมวิดีโอ YouTube

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ติดตั้งเป็น Progressive Web App (PWA)** — พร้อม Service Worker (`sw.js`) แคชเฉพาะไฟล์จำเป็น และหน้าออฟไลน์ภาษาไทย (โดย @Jesselpetry)
- **หน้ารวมเอกสารก่อนเข้าอ่าน (Module Index)** — ตรวจนับจำนวนไฟล์จริงจาก Markdown และจำสถานะการเปิดอ่านในเครื่อง (โดย @Jesselpetry)
- **หน้าคาบเรียนรายสัปดาห์ ICS พร้อมเครื่องเล่นวิดีโอ YouTube ฝังในตัว 35 คลิป** — พร้อมทะเบียนถาวร `RESOURCES_MANIFEST.md` (โดย @Jesselpetry)
- **ระบบเปิดดูตัวอย่างไฟล์ PDF/รูปภาพ (Preview) ได้ทันทีจากในหน้าเว็บ** — ผ่านระบบสิทธิ์ของคลังโดยตรง (โดย @Jesselpetry)

### ความปลอดภัย

- **ลบประวัติและข้อมูลรหัสนักศึกษาอื่น (PII) ออกจาก Storage และป้องกันข้อมูลสื่อรั่วไหลเข้า Bundle** — รักษาความเป็นส่วนตัวและลดขนาดไฟล์ JS (โดย @Jesselpetry)

---

## [0.6.2] - 15 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### ปรับปรุง

- **ย้ายโดเมนหลักอย่างเป็นทางการสู่ `ihelp.chatan.in.th`** — พร้อม redirect เส้นทางเดิมอย่างไร้รอยต่อ (โดย @Jesselpetry)
- **รีแบรนด์ Site Metadata จาก PSCP สู่ศูนย์กลางการเรียนรู้คณะ IT KMITL (iHelp) ครบวงจร** — ตั้งค่า OpenGraph และ SEO ให้ครอบคลุมทุกวิชา (โดย @Jesselpetry)

---

## [0.6.1] - 10 กันยายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **โจทย์สัปดาห์ 8–9 เข้าสู่ระบบการเรียนรู้ครบวงจร** — พร้อมเฉลยอ้างอิงและ Concept Tags จากโค้ดจริง 27 ข้อ (โดย @Jesselpetry)
- **โจทย์แนะนำเพิ่มเป็น 14 ข้อ (BigFrame, Left Arrow, กองชาม, Shorten)** — พร้อมคู่มือ 2 ภาษา (โดย @Jesselpetry)
- **สคริปต์ตรวจความถูกต้องของเฉลยอ้างอิงทั้งคลัง `scripts/verify_solutions.py`** — ทดสอบครอบคลุมทุกข้อสอบ (โดย @Jesselpetry)

### ปรับปรุง

- **หน้ารายการโจทย์ PSCP แสดงผลแบบตาราง (Table View) เป็นค่าเริ่มต้น** — พร้อมมาตรวัดความยากดาว 5 ดวง (โดย @Jesselpetry)

---

## [0.6.0] - 30 สิงหาคม 2569

> **วิวัฒนาการหลัก (v0.6.x):** ระบบสมาชิกไอที (@kmitl.ac.th), ย้ายสื่อขึ้น Supabase Storage และรีแบรนด์สู่ iHelp

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบบัญชีผู้ใช้และยืนยันตัวตนด้วย Google `@kmitl.ac.th`** — ตรวจรหัสคณะ IT 8 หลักเฉพาะนักศึกษาคณะ IT (โดย @Jesselpetry)
- **หน้าโปรไฟล์นักศึกษาสาธารณะ `/profile/[รหัส]`** — แสดงชื่อเล่น สาขา และผลงานที่แบ่งปัน พร้อมตัวนับผู้เข้าชมที่เคารพความเป็นส่วนตัวที่ Footer (โดย @Jesselpetry)
- **ย้ายสื่อการเรียนรู้ทั้งหมดออกจาก Git ไปเก็บยัง Supabase Storage** — แยก Bucket สาธารณะและ Bucket ข้อสอบลับ (โดย @Jesselpetry)

### ความปลอดภัย

- **กั้นสิทธิ์คลังทรัพยากรเฉพาะนักศึกษาคณะ IT ที่ล็อกอิน และกั้นข้อสอบเก่าเฉพาะ Insider** — ป้องกันข้อสอบหลุดสู่สาธารณะ (โดย @Jesselpetry)

---

## [0.5.2] - 26 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **รวมเส้นทางรายวิชาทั้งหมดเป็นต้นไม้เดียว `/courses/[dir]` และฮับห้องแลป `/pscp`** — รองรับทุกวิชาอย่างเป็นระบบ (โดย @Jesselpetry)
- **พิมพ์เขียวการเรียนรู้ 11 โมดูลมาตรฐาน (`lib/spine.ts`)** — สัญญาเดียวเชื่อมโยงทุกรายวิชาในระบบ (โดย @Jesselpetry)
- **นำเข้าชุดสื่อการเรียนปี 1 จากคลัง `kmitl-archive` (662 ไฟล์)** — และสร้างเวิร์กโฟลว์จัดการไฟล์ `_dropzone/` (โดย @Jesselpetry)

### ปรับปรุง

- **บีบอัดเอกสาร PDF ทั้งหมดผ่าน Visual Regression Gate ลดขนาดลง 32%** — ประหยัดแบนด์วิดท์โดยไม่เสียความคมชัด (โดย @Jesselpetry)
- **ปรับชื่อไฟล์สื่อการสอนทั้งหมดเป็นรูปแบบมาตรฐาน kebab-case** — สะอาดและปลอดภัยต่อ URL (โดย @Jesselpetry)

### แก้ไข

- **แก้ไขปัญหาสูตรคณิตศาสตร์ `$$...$$` หลายบรรทัดกลืนเนื้อหาในตัวอ่าน Markdown** — แก้ไขจุดปิด KaTeX ใน `MdView` (โดย @Jesselpetry)

---

## [0.5.1] - 22 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ขยายฮับสู่หลายรายวิชา** — CE-KMITL, EN-KMITL (ข้อสอบเคมี 60 ข้อ และคอมโปร), ICS Digital Logic และ MFIT Linear Algebra (โดย @Jesselpetry)
- **แผนอ่านติวเข้ม MFIT 6 ชั่วโมง** — พร้อมชุดฝึกจับเวลา และสรุปตามพิมพ์เขียวข้อสอบจริง (โดย @Jesselpetry)
- **สารบัญด้านข้างแบบโต้ตอบ (Interactive Real-Time TOC)** — พร้อม Scroll Spy และค้นหาหัวข้อในหน้าอ่านเอกสาร (โดย @Jesselpetry)

---

## [0.5.0] - 17 สิงหาคม 2569

> **วิวัฒนาการหลัก (v0.5.x):** ห้องแลปโจทย์แนะนำ, Client-Side WASM Grader, Technique Quiz และการขยายสู่ 11 โมดูล (Spine)

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_)), Akarapach Yootsukprasert ([@PGTHEGOD](https://github.com/PGTHEGOD), IG: [@pgthegod_x](https://instagram.com/pgthegod_x))

### เพิ่ม

- **ฮับโจทย์แนะนำ 10 ข้อหลัก (`/recommended`)** — พร้อมบทวิเคราะห์จุดสำคัญและสถิติจริงจาก iJudge (โดย @Jesselpetry)
- **ระบบ Client-Side Python Grader** — ตรวจโค้ดในเบราว์เซอร์ 100% ด้วย WebAssembly (Pyodide in Web Worker) (โดย @Jesselpetry)
- **ระบบ Technique Quiz Active-Recall 60 ข้อ** — พร้อมคำอธิบายเฉลย 2 ภาษา (โดย @Jesselpetry)
- **หน้าจอ Splitter Panel Workspace ลากปรับขนาดได้** — พร้อม Foldable Expected I/O และ Diff View (โดย @Jesselpetry)
- **ระบบตรวจสอบสไตล์โค้ด PEP-8 & PSCP Rules และคีย์ลัดสั่งรันโค้ดทันที** — อำนวยความสะดวกในการฝึกทำโจทย์ (โดย @Jesselpetry)

### ปรับปรุง

- **ยกระดับ UI มือถือเต็มรูปแบบ** — แท็บปรับตามความกว้างจอ และตัวแปร CSS สำหรับ Split Layout (โดย @Jesselpetry)

### แก้ไข

- **แก้ไขการ Hydrate ข้อมูล Primitive String ใน `useDraft`** — ป้องกันข้อผิดพลาด `[object Object]` (โดย @Jesselpetry)

---

## [0.4.2] - 13 สิงหาคม 2569

**ผู้ร่วมพัฒนา:** Akarapach Yootsukprasert ([@PGTHEGOD](https://github.com/PGTHEGOD), IG: [@pgthegod_x](https://instagram.com/pgthegod_x)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **หน้า Landing Page `/pro` สำหรับ PG IJUDGE · VS Code Extension** — แนะนำส่วนขยายส่งโค้ดตรงเข้า iJudge, รันเทสต์ในเครื่อง, เทสต์เคสซ่อน, ทำงานออฟไลน์ และขอรับ License Key ผ่าน IG @pgthegod_x (โดย @PGTHEGOD)

### ปรับปรุง

- **ผูก Metadata SEO และโครงสร้างเส้นทางสำหรับส่วนขยายเครื่องมือช่วยเขียนโค้ด** — ตกแต่งธีมเอกลักษณ์ PSCP Pink และเอฟเฟกต์ Glow/Grid สวยงาม (โดย @PGTHEGOD)

---

## [0.4.1] - 31 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **แบนเนอร์ประกาศเตรียมตัวสอบสัมภาษณ์โค้ด (Code Interview)** — แจ้งเตือนนักศึกษาล่วงหน้า (โดย @Jesselpetry)
- **เพิ่มชุดโจทย์ OJ Week 4 และ Week 5 (รหัส 3101–3116)** — พร้อมสคริปต์ตรวจสถานะซิงก์จาก iJudge (โดย @Jesselpetry)

### ปรับปรุง

- **แผงพรีวิวไฟล์เลื่อนไปยังไฟล์ที่รอ Push อัตโนมัติ (Auto-scroll target preview)** — ไม่ต้องเลื่อนหาเองในหน้าจอ (โดย @Jesselpetry)

---

## [0.4.0] - 21 กรกฎาคม 2569

> **วิวัฒนาการหลัก (v0.4.x):** การเชื่อมต่อ GitHub OAuth โดย Meaookung144 และหน้า /pro โดย PGTHEGOD

**ผู้ร่วมพัฒนา:** Meaookung144 ([@Meaookung144](https://github.com/Meaookung144), IG: [@meaookung144](https://instagram.com/meaookung144)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบเชื่อมต่อ GitHub OAuth และ Push ไฟล์ `submission.md` / `ai_reflection.md` เข้า Repository โดยตรง** — ส่งงานได้ในคลิกเดียว (โดย @Meaookung144)
- **ตัวแก้ไขไฟล์ออนไลน์ (`/repo`)** — ตรวจทานและแก้ไขโค้ดใน Repo ก่อนกด Push (โดย @Meaookung144)
- **หน้าประวัติเวอร์ชันและผู้ร่วมพัฒนา (`/version`)** — พร้อม Changelog workflow ในการปล่อยเวอร์ชัน (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุง Navbar รองรับ Mobile Responsive** — พร้อมเมนู Hamburger และ Contributor Avatars (โดย @Jesselpetry)

### แก้ไข

- **ปรับปรุงการทำงานของ Folder Component ในหน้าจัดการ Repo** — จัดการโครงสร้างโฟลเดอร์ให้ถูกต้อง (โดย @Meaookung144)

---

## [0.3.0] - 20 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบสลับธีม Light / Dark Mode** — พร้อมปุ่ม Toggle แอนิเมชันนุ่มนวล (โดย @Jesselpetry)

---

## [0.2.0] - 18 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ประกาศเปิดโจทย์ Week 3** — ต้อนรับเนื้อหาสัปดาห์ใหม่ของวิชา PSCP (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุงการจัดเรียงโจทย์และเพิ่มคีย์ลัดประจำสัปดาห์ `lib/shortcuts.ts`** — อำนวยความสะดวกในการค้นหา (โดย @Jesselpetry)
- **อัปเดตข้อมูลโจทย์ใน `data/oj_problems.json`** — สถิติและการจัดหมวดหมู่ล่าสุด (โดย @Jesselpetry)

---

## [0.1.1] - 13 กรกฎาคม 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### ปรับปรุง

- **บังคับยืนยันว่าอ่านเงื่อนไขและแนวปฏิบัติ AI ของวิชาก่อนดาวน์โหลดไฟล์** — ป้องกันการส่งงานโดยไม่อ่านกติกา (โดย @Jesselpetry)

### แก้ไข

- **แก้ไข Path การสร้างไฟล์ของโจทย์ Week 2** — ชี้ไปยังโฟลเดอร์ที่ถูกต้อง (โดย @Jesselpetry)

---

## [0.1.0] - 12 กรกฎาคม 2569

> **วิวัฒนาการหลัก (v0.1.x):** จุดเริ่มต้น PSCP Learning-Log Maker & AI Guidelines

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ระบบสร้าง `submission.md` และ `ai_reflection.md` สำหรับวิชา PSCP ทีละขั้นตอน (Wizard)** — ผู้ช่วยกรอกคำตอบและฟอร์แมตเอกสารส่งการบ้าน (โดย @Jesselpetry)
- **รายการโจทย์พร้อมระดับความยาก วันหมดเขต และแท็บกรองรายสัปดาห์** — รวมศูนย์ข้อมูลโจทย์ PSCP (โดย @Jesselpetry)
- **หน้า `/library` อ่านเอกสารแนวปฏิบัติการใช้ AI ของวิชา PSCP** — อ่านแนวทางทางการของคณะ (โดย @Jesselpetry)
- **หน้า `/history` จัดเก็บประวัติไฟล์ที่เคยสร้างไว้ในเครื่อง** — กู้คืนงานที่เคยทำได้ตลอดเวลา (โดย @Jesselpetry)
- **ระบบบันทึกแบบร่างอัตโนมัติแยกตามโจทย์ และหน้า Splash Screen** — ไม่สูญเสียข้อมูลขณะกรอก (โดย @Jesselpetry)

### ปรับปรุง

- **ปรับปรุงสีทั่วทั้งเว็บไซต์ให้ผ่านมาตรฐานความคมชัด WCAG AA** — สีอ่านง่ายสบายตา (โดย @Jesselpetry)

### แก้ไข

- **ปรับแก้ไอคอน Instagram และ case ของข้อความบางจุด** — ความถูกต้องของ UI (โดย @Jesselpetry)
