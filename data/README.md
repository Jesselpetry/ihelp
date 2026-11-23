# Data Directory Architecture & Navigation (`data/`)

ศูนย์รวมข้อมูล static data, registries, เอกสารวิชาการขนาดยาว, ตารางเรียน/ตารางสอบ, ชุดโจทย์การเขียนโปรแกรม และแนวทางการใช้งาน AI สำหรับโปรเจกต์ **\<i\>Help**

---

## 1. ขอบเขตและหน้าที่ของ `data/`

โฟลเดอร์ `data/` ถูกออกแบบมาสำหรับจัดเก็บข้อมูลที่ **ไม่ผูกกับ Web Route โดยตรง** (Data without direct route binding) ซึ่งต่างจากโฟลเดอร์อื่น ๆ ดังนี้:
- `content/courses/`: สำหรับไฟล์ Markdown ที่เรนเดอร์เป็นหน้าเว็บของแต่ละรายวิชาโดยตรง (`summary.md`, `weekNN.md`)
- `public/assets/`: สำหรับไฟล์ไบนารีจริง (PDF, สไลด์, รูปภาพ) ที่ซิงค์กับ Supabase Storage
- `lib/`: สำหรับตรรกะโปรแกรม (Business Logic), Types, และตัวเชื่อมต่อฐานข้อมูล
- **`data/`**: ข้อมูลนำเข้าของฟีเจอร์ต่าง ๆ (Registries, Timetable, Seating Index, Problem Banks, Master Catalogs)

---

## 2. แผนผังนำทางโครงสร้างข้อมูล (Navigation Map)

```
data/
├── courses/                      # ข้อมูลรายวิชามาตรฐานกลาง (Master Course Catalog)
│   └── courses-master.json       # สเปกรายวิชา รหัส ชื่อ ย่อ หน่วยกิต สีประจำวิชา
│
├── schedule/                     # ข้อมูลตารางเรียนและปฏิทินการศึกษา
│   ├── teach-table-2569-2.json   # ตารางสอนภาค 2/2569 จากระบบทะเบียน (KMITL Registrar API)
│   ├── y1s2-student-groups.json  # กฎการจัดกลุ่มนักศึกษาปี 1 (IT กลุ่ม 1-3, DSBA, AIT)
│   └── y1s2-meeting-dates.json   # ปฏิทินวันเรียน วันหยุด และวันสอนชดเชย 16 สัปดาห์
│
├── exams/                        # ข้อมูลการสอบและผังที่นั่งสอบ
│   ├── final-exams.json          # ตารางสอบทางการ (วัน เวลา รายวิชา)
│   ├── student-seating-index.json# ดัชนีค้นหาเลขที่นั่งสอบจากรหัสนักศึกษา 8 หลัก
│   ├── room-seating-map.json     # ผังที่นั่งสอบและ Grid Layout ของแต่ละห้องสอบ
│   └── faculty-07-master.json    # รายชื่อวิชาและกลุ่มสอบของคณะ IT
│
├── it-kmitl/                     # เอกสารและชุดข้อมูลของคณะ IT
│   ├── itf/                      # Information Technology Fundamentals (06016402)
│   ├── ics/                      # Intro to Computer Systems (06016411)
│   ├── mfit/                     # Mathematics for IT (06016401)
│   └── pscp/                     # Problem Solving and Computer Programming (06066303)
│       ├── problems.json         # Master Registry โจทย์ 273 ข้อ (สร้างโดย bun run pscp:build)
│       ├── oj_problems.json      # รายการโจทย์ iJudge 273 ข้อ (คัดลอกจาก OP branch)
│       ├── all_problems_detail.json # รายละเอียดโจทย์ + Official Testcases (input ของ pscp:build)
│       └── seat-map.ts           # ผังที่นั่งสอบแล็บปฏิบัติการ
│
├── en-kmitl/                     # เอกสารและแล็บของวิชาข้ามคณะ (วิศวกรรมศาสตร์)
│   ├── chem/                     # Chemistry (01006004)
│   └── compro/                   # Computer Programming (01006012)
│       └── labs.json             # คลังโจทย์แล็บคอมโปร (สร้างโดย bun run compro:labs)
│
├── recommended/                  # โฟลเดอร์โจทย์แนะนำ 15 ข้อ (problem.md, problem.th.md, main.py)
├── templates/                    # แม่แบบสำหรับส่งงานและการสะท้อนคิด (Learning Log Wizard)
│
└── ai-guidelines/                # นโยบายและแนวทางการใช้งาน AI สำหรับการศึกษา
    ├── instructions/             # คำแนะนำการใช้งาน
    ├── policies/                 # นโยบายความซื่อสัตย์ทางวิชาการ
    ├── workflows/                # เวิร์กโฟลว์การแก้ปัญหา
    ├── templates/                # แม่แบบเอกสารทางการ
    └── examples/                 # ตัวอย่างการเขียนโค้ดและส่งงาน
```

---

## 3. สถาปัตยกรรมคลังโจทย์ PSCP (`data/it-kmitl/pscp/`)

ชุดข้อมูลหลักของวิชา PSCP ทั้งหมดได้รับการจัดระเบียบรวมอยู่ภายใต้ `data/it-kmitl/pscp/` เพื่อให้เป็นมาตรฐานเดียวกันกับวิชาอื่น ๆ ของคณะ IT (`itf`, `ics`, `mfit`):

1. **การรวมศูนย์ไฟล์โจทย์ PSCP:**
   - `problems.json`: Master registry ของโจทย์ทั้ง 273 ข้อพร้อมเคสทดสอบและ Edge Cases
   - `oj_problems.json`: ดัชนีโจทย์ดิบจาก iJudge (สถิติ, ความยาก, สัปดาห์, Deadline)
   - `all_problems_detail.json`: รายละเอียดโจทย์และ Official Testcases ที่ scraped จากระบบ
   - `seat-map.ts`: ผังที่นั่งสอบแล็บคอมพิวเตอร์
2. **การแยกโฟลเดอร์แบบฝึกหัดและแม่แบบ:**
   - `data/recommended/`: คัดเลือกโจทย์แนะนำ 15 ข้อสำหรับการฝึกเขียนโค้ดและทำควิซ
   - `data/templates/`: แม่แบบ Markdown สำหรับสร้างเอกสารส่งงานและสะท้อนคิด (Learning Log Wizard)
   - แยกโฟลเดอร์เหล่านี้ไว้ที่รากของ `data/` เพื่อไม่ให้ตัวรวบรวมดัชนีคลังสื่อ (`DOC_ROOTS` ใน `scripts/library-shared.ts`) สแกนไฟล์ Markdown ของโจทย์เหล่านี้เป็นเอกสารสรุปประจำวิชา ซึ่งจะทำให้เกิดข้อผิดพลาด `orphan-doc`
3. **การเข้าถึงผ่านตัวแปรกลางที่ได้มาตรฐาน:**
   - โค้ดทั้งหมดเข้าถึงข้อมูล PSCP ผ่านตัวแปรและฟังก์ชันกลางใน `@/lib/paths` และ `@/lib/pscp/` เสมอ:
     - `OJ_PROBLEMS_FILE` (จาก `@/lib/paths`) ➔ `data/it-kmitl/pscp/oj_problems.json`
     - `REGISTRY_FILE` (จาก `@/lib/pscp/pscp`) ➔ `data/it-kmitl/pscp/problems.json`
     - `getRecommendedDir()` (จาก `@/lib/pscp/recommended`) ➔ `data/recommended`
     - `submissionTemplatePath()` และ `reflectionTemplatePath()` (จาก `@/lib/paths`) ➔ `data/templates`

---

## 4. ความชัดเจนเกี่ยวกับคำว่า `ITGG`

ในโค้ดเบสของโปรเจกต์ มีการอ้างอิงถึง `ITGG` ใน 2 บริบท ซึ่งทั้งสองบริบทถูกต้องตามมาตรฐานและเจตนาของระบบ:

1. **`itgg_2026` Database Schema (ใน `db/itgg.ts`, `app/onboarding/page.tsx`):**
   - ฐานข้อมูล PostgreSQL บน Supabase ใช้งานร่วมกันระหว่าง 2 แอปพลิเคชันของคณะ:
     - `itgg-2026`: เว็บกิจกรรมรับน้อง/ปฐมนิเทศ ซึ่งเป็นเจ้าของ schema `itgg_2026` และตาราง `itgg_2026.students` (รหัสนักศึกษา, คำนำหน้าชื่อ, ชื่อ, นามสกุล)
     - `ihelp`: เว็บศูนย์การเรียนรู้นี้ ซึ่งเป็นเจ้าของ schema `ihelp`
   - เมื่อนักศึกษาเข้าสู่ระบบด้วย Google KMITL ครั้งแรก หน้า `/onboarding` จะอ่านข้อมูลชื่อ-นามสกุลภาษาไทยจาก `itgg_2026.students` แบบ **Read-Only** เพื่ออำนวยความสะดวกให้นักศึกษาไม่ต้องพิมพ์ชื่อเอง
   - ระบบแยกระดับความปลอดภัยอย่างเคร่งครัด: `drizzle.config.ts` จะไม่จัดการ migration ข้ามไปแตะ `itgg_2026` และ RLS ไม่อนุญาตให้ client ยิงตรงผ่าน anon key ได้
2. **กิจกรรม ITGG ในคำอธิบายโจทย์ PSCP (ใน `data/all_problems_detail.json`, `data/pscp/problems.json`):**
   - โจทย์ข้อ oj3283 ใน iJudge มีเนื้อหาเกี่ยวกับกิจกรรมแข่งขันเกม e-sports ภายในคณะ IT KMITL (กิจกรรม ITGG / IT Good Game) ซึ่งเป็นโจทย์จริงที่ใช้ในการเรียนการสอน

---

## 5. ตารางเส้นทางการโหลดข้อมูล (Data Loaders & Source of Truth)

| ข้อมูล | ไฟล์ต้นทาง | โมดูลที่รับผิดชอบการโหลด | ขอบเขตการทำงาน |
|---|---|---|---|
| Master Courses | `data/courses/courses-master.json` | `lib/courses/catalog.ts` | Server & Client |
| Semester Timetable | `data/schedule/teach-table-2569-2.json` | `lib/schedule/registry.ts`, `y1s2-data.ts` | Server & Client |
| Student Groups | `data/schedule/y1s2-student-groups.json` | `lib/schedule/registry.ts` | Server & Client |
| Exam Schedule | `data/exams/final-exams.json` | `lib/exams/schedule.ts` | Server & Client |
| Exam Seating | `data/exams/student-seating-index.json` | `lib/exams/schedule.ts` | Server & Client |
| Course Docs (IT) | `data/it-kmitl/<subject>/` | `lib/courses/it-kmitl.ts` | Server-only |
| Course Docs (EN) | `data/en-kmitl/<subject>/` | `lib/courses/en-kmitl.ts` | Server-only |
| PSCP Registry | `data/it-kmitl/pscp/problems.json` | `lib/pscp/pscp.ts` | Server-only |
| PSCP OJ Master | `data/it-kmitl/pscp/oj_problems.json` | `lib/paths.ts`, `lib/pscp/master.ts` | Server-only |
| PSCP Problem Details | `data/it-kmitl/pscp/all_problems_detail.json` | `scripts/build_pscp_registry.py` | Build scripts |
| Recommended OJ | `data/recommended/` | `lib/pscp/recommended.ts` | Server-only |
| Submission Templates | `data/templates/` | `lib/paths.ts`, `lib/submission/markdown.ts` | Server-only |

---

## 6. แนวทางปฏิบัติสำหรับ AI Agent (AI Agent Guidelines for Data Standardization)

AI Agent ทุกตัวที่ทำงานในโปรเจกต์นี้ **ต้องปฏิบัติตามกฎเหล่านี้อย่างเคร่งครัด**:

### กฎข้อที่ 1: Source of Truth และห้ามแก้มือไฟล์ Generated
- หากต้องการแก้ไขข้อมูลที่สร้างจากสคริปต์ (เช่น `problems.json`, `library-manifest.json`, `resource-index.json`) **ต้องแก้ไขที่ไฟล์ต้นทางแล้วสั่งรันคำสั่ง build ตามตารางใน `AGENTS.md` เสมอ**
- ห้ามเขียนสคริปต์แก้ไฟล์ปลายทางโดยตรง เพราะจะถูกทับเมื่อมีการรัน build pipeline

### กฎข้อที่ 2: ใช้รหัสย่อรายวิชามาตรฐานเดียวกันทั้งโปรเจกต์
รหัสย่อของรายวิชาทั้งหมดต้องตรงตาม `lib/courses/catalog.ts` และ `data/courses/courses-master.json` เสมอ:
- **ภาคการศึกษา 1 (Y1S1):** `ITF`, `ICS`, `MFIT`, `PSCP`, `FE`, `CHARM`
- **ภาคการศึกษา 2 (Y1S2):**
  - `06066101`: `BFIT` (Business Fundamentals for Information Technology) — **ห้ามใช้** BF, BIZ, หรือ Business
  - `06066001`: `PSTAT` (Probability and Statistics for IT) — **ห้ามใช้** STAT หรือ ProbStat
  - `06016408`: `OOP` (Object-Oriented Programming)
  - `06066301`: `DSA` (Data Structures and Algorithms)
  - `90644008`: `FE2` (Foundation English 2) — **ห้ามใช้** ENG2 หรือ ENGL2
  - `90641007` / `90641002`: `DC` / `DL` (Digital Citizenship / Digital Literacy)

### กฎข้อที่ 3: กฎการตั้งชื่อไฟล์ (File Naming Discipline)
- ไฟล์ข้อมูลและโฟลเดอร์ใหม่ทั้งหมดต้องใช้ **lowercase kebab-case** (เช่น `teach-table-2569-2.json`, `y1s2-student-groups.json`)
- ห้ามมีช่องว่าง ห้ามใช้ตัวพิมพ์ใหญ่ ห้ามใช้อักขระพิเศษ ยกเว้นเอกสารภาษาไทยดั้งเดิมที่มีอยู่แล้วใน `data/en-kmitl/`

### กฎข้อที่ 4: การป้องกัน Client Bundle รั่วไหล (Client Boundary Isolation)
- คอมโพเนนต์ที่เป็น Client Component (`"use client"`) **ห้ามนำเข้าไฟล์ข้อมูลขนาดใหญ่โดยตรง** โดยเฉพาะ `lib/library/subject-library.ts` และ `lib/library/resource-index.json`
- สำหรับข้อมูลคลังสื่อ ให้ใช้ `lib/library/subject-library-ui.ts` และดึงข้อมูลผ่าน API Route เท่านั้น

### กฎข้อที่ 5: การแยก Scope ของข้อมูลอย่างถูกต้อง
- การแบ่งกลางภาค / ปลายภาค (`midterm` / `final`) ต้องยึดจากข้อ 2 ของ `content/courses/<dir>/summary.md` เท่านั้น ห้ามเดาจากเลขสัปดาห์ในชื่อไฟล์

### กฎข้อที่ 6: ความซื่อสัตย์ทางวิชาการและความเป็นส่วนตัว (Academic Integrity & Privacy)
- ห้ามเผยแพร่หรือเขียนโค้ดเฉลยแบบฝึกหัด/ข้อสอบที่กำลังดำเนินการอยู่ลงใน repository
- ห้ามใส่ข้อมูลส่วนบุคคลที่ไม่ได้รับอนุญาต หรือผลการสอบเดี่ยวที่ไม่ได้ประกาศสาธารณะ
