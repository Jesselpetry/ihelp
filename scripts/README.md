# Scripts Directory (`scripts/`)

คู่มือและเอกสารอ้างอิงสคริปต์ทั้งหมดในโปรเจกต์ **\<i\>Help** ใช้สำหรับ build pipelines, การตรวจสอบความถูกต้องของข้อมูล (validation & auditing), การสร้าง registry อัตโนมัติ และการดูแลรักษาระบบ

---

## 1. Pipelines & Execution Lifecycle

สคริปต์หลักถูกจัดเป็น Pipeline ที่ต้องรันตามลำดับเมื่อมีการเปลี่ยนแปลงข้อมูล:

```
[Media Library Pipeline]
public/assets/ (ไฟล์บนเครื่อง)
    │
    ├── 1. bun run library:manifest  ──▶ lib/library/library-manifest.json
    ├── 2. bun run library:stats     ──▶ lib/library/library-stats.json
    └── 3. bun run library:index     ──▶ lib/library/resource-index.json
         │
         ├── 4. bun run library:audit  (ตรวจสอบความถูกต้อง 100%)
         └── 5. bun run assets:sync   (อัปโหลดขึ้น Supabase Storage *ต้องขออนุมัติก่อน*)

[PSCP Problem Registry Pipeline]
OJ / Archive branch OP
    │
    ├── 1. bun run pscp:registry ──▶ data/it-kmitl/pscp/problems.json (273 problems)
    ├── 2. bun run pscp:edges    ──▶ data/it-kmitl/pscp/problems.json (+ edge testcases)
    └── 3. bun run pscp:verify   ──▶ ตรวจสอบ reference solutions 100% ผ่านทุกเคส
    (รันรวมทั้ง 3 ขั้นตอนด้วย: bun run pscp:build)

[Prebuild & Quality Gates]
    ├── bun run content:check    (validate-content.ts — รันอัตโนมัติก่อน build)
    ├── bun run readiness        (คำนวณคะแนนความพร้อม 11 โมดูลทุกวิชา)
    ├── bun run schedule:audit   (ตรวจ timetable, meeting dates, room slots)
    └── bun run docs:check       (ตรวจความถูกต้องของลิงก์ในเอกสาร Markdown)
```

---

## 2. สารบัญสคริปต์ทั้งหมด (Script Directory)

### 2.1 Media Library & Asset Management

| สคริปต์ | คำสั่งรัน | Input | Output | คำอธิบาย |
|---|---|---|---|---|
| `build-library-manifest.mjs` | `bun run library:manifest` | `public/assets/` | `lib/library/library-manifest.json` | สแกนโฟลเดอร์ไฟล์สื่อตามโครงสร้าง `namespace/subject/category/filename` แล้วสร้างการ์ดอัตโนมัติ |
| `build-library-stats.mjs` | `bun run library:stats` | `public/assets/` | `lib/library/library-stats.json` | อ่านขนาดไฟล์และจำนวนหน้าของเอกสาร PDF ทั้งหมด |
| `library-index.ts` | `bun run library:index` | `catalog.ts`, `course-bindings.ts`, `subject-library.ts`, docs | `lib/library/resource-index.json` | สร้างดัชนีสืบค้นรวม (Master Resource Index) เชื่อมโยงรายวิชา, สัปดาห์, เอกสาร และการ์ดสื่อ |
| `library-audit.ts` | `bun run library:audit` | manifests, stats, index, assets | รายงาน Terminal | ตรวจสอบความถูกต้องของการ์ดในคลัง: ID ชน, การ์ดตาย (dead card), ชื่อไฟล์ผิดกฎ, ลิงก์เสีย, และเปรียบเทียบกับ Supabase Storage (`-- --remote`) |
| `library-find.ts` | `bun run library:find -- <query>` | `resource-index.json` | ผลการค้นหา Terminal | เครื่องมือค้นหาการ์ดและเอกสารในคลังอย่างรวดเร็วโดยไม่ต้องเปิดไฟล์ TypeScript ขนาดใหญ่ |
| `sync-library-assets.ts` | `bun run assets:sync` | `public/assets/` | Supabase Storage (`ihelp-library`) | ซิงค์ไฟล์สื่อการเรียนขึ้น Cloud Storage (ต้องยืนยันก่อนรันเสมอ) |
| `compress-assets.sh` | `bun run assets:compress` | `public/assets/**/*.pdf` | PDF ขนาดเล็กลง | บีบอัดไฟล์ PDF สไลด์และชีทเรียนด้วย Ghostscript เพื่อประหยัดพื้นที่และ bandwidth |
| `library-shared.ts` | *(internal module)* | - | - | โมดูลกลางรวมฟังก์ชันเดินโครงสร้างเอกสาร (walkMarkdown), การจับคู่โมดูล และกฎเกณฑ์ของคลัง |
| `library-root.ts` | *(internal module)* | - | - | ยูทิลิตีค้นหา Path รากของโปรเจกต์สำหรับรัน CLI |
| `storage-keys.ts` | *(internal module)* | - | - | ฟังก์ชันคำนวณ Storage Object Key และ Bucket ของแต่ละ Asset อย่างเป็นระบบ |
| `ics-fix-misnamed-assets.sh` | `./scripts/ics-fix-misnamed-assets.sh` | assets เก่าของ ICS | renamed files | สคริปต์ปรับชื่อไฟล์ประวัติศาสตร์ของวิชา ICS ให้เป็น lowercase kebab-case ตามมาตรฐาน |

---

### 2.2 Content Verification & Blueprint Readiness

| สคริปต์ | คำสั่งรัน | Input | Output | คำอธิบาย |
|---|---|---|---|---|
| `validate-content.ts` | `bun run content:check` | `content/courses/`, `lib/quiz/`, `data/recommended/` | ผลตรวจ (Exit 0/1) | **หัวใจของการตรวจสอบก่อน build:** ตรวจสอบโครงสร้าง 6 หัวข้อของ `summary.md`, frontmatter schema, คลังข้อสอบควิซ, และโฟลเดอร์โจทย์แนะนำ |
| `readiness.ts` | `bun run readiness` | `course-bindings.ts`, `summary.md` | เมทริกซ์ความพร้อม Terminal | ประเมินคะแนนความพร้อมของ 11 โมดูลตามพิมพ์เขียว (Learning Blueprint) สำหรับทุกรายวิชา |
| `docs-check.ts` | `bun run docs:check` | `docs/**/*.md`, `content/**/*.md` | รายงานความสมบูรณ์ลิงก์ | ตรวจสอบ hyperlink, anchor hash, และ cross-reference ระหว่างเอกสาร Markdown ทั้งหมด |

---

### 2.3 PSCP & Programming Subsystem

| สคริปต์ | คำสั่งรัน | Input | Output | คำอธิบาย |
|---|---|---|---|---|
| `build_pscp_registry.py` | `bun run pscp:registry` | `data/it-kmitl/pscp/oj_problems.json`, `data/it-kmitl/pscp/all_problems_detail.json` | `data/it-kmitl/pscp/problems.json` | รวมโจทย์ทั้ง 273 ข้อเข้าด้วยกัน: คำอธิบาย, ข้อมูลนำเข้า/ส่งออก, ตัวอย่างทางการ, takeaway tags |
| `build_pscp_edge_cases.py` | `bun run pscp:edges` | `data/it-kmitl/pscp/problems.json`, reference Python | `data/it-kmitl/pscp/problems.json` | สังเคราะห์ Edge Cases 900+ เคส โดยรันเฉลยอ้างอิงกับชุดอินพุตขอบเขต แล้วบรรจุลงใน registry |
| `verify_solutions.py` | `bun run pscp:verify` | `data/it-kmitl/pscp/problems.json`, reference Python | ผลทดสอบ Terminal | รันโค้ดเฉลยภาษา Python ของโจทย์ทุกข้อเทียบกับ Testcases และ Edge Cases ยืนยันผลลัพธ์ถูกต้อง 100% |
| `copy-pyodide-assets.mjs` | `node scripts/copy-pyodide-assets.mjs` | `node_modules/pyodide` | `public/pyodide/` | คัดลอก WebAssembly runtime และ binaries ของ Pyodide มาไว้ที่ public สำหรับรัน Python บนเบราว์เซอร์ |

---

### 2.4 Timetable, Schedule & Exams

| สคริปต์ | คำสั่งรัน | Input | Output | คำอธิบาย |
|---|---|---|---|---|
| `audit-schedule.ts` | `bun run schedule:audit` | `data/schedule/`, `lib/schedule/` | รายงาน Audit Terminal | ตรวจสอบตารางสอน Y1-S2, ความถูกต้องของกลุ่มเรียน, วันหยุด/วันสอนชดเชย, การชนกันของคาบเรียน, และโควต้าห้องสอบ |
| `sync-scores.ts` | `bun run scores:sync` | Score CSV/Sheets | Database/Local Cache | นำเข้าและประมวลผลคะแนนดิบสอบกลางภาค/ปลายภาค เพื่อใช้ในระบบคำนวณและสถิติ |

---

### 2.5 Cross-Faculty & Media Generation

| สคริปต์ | คำสั่งรัน | Input | Output | คำอธิบาย |
|---|---|---|---|---|
| `build_compro_labs.py` | `bun run compro:labs` | Raw ComPro lab files | `data/en-kmitl/compro/labs.json` | สร้าง JSON รวมโจทย์แล็บคอมโปรของคณะวิศวกรรมศาสตร์ (01006012) |
| `generate_og_images.py` | `bun run og:build` | `catalog.ts`, course metadata | `public/og/*.png` | สร้างภาพ Open Graph Card ขนาด 1200x630 px สำหรับแชร์ลงโซเชียลมีเดีย |
| `sync-readme-stats.ts` | `tsx scripts/sync-readme-stats.ts` | `resource-index.json` | `README.md`, `docs/FULL_README.md` | อัปเดตตัวเลขนับจำนวนการ์ด สื่อการเรียน และสถิติวิชาในไฟล์ README อัตโนมัติ |

---

## 3. กฎเกณฑ์สำหรับนักพัฒนาและ AI Agent

1. **ห้ามแก้มือไฟล์ Output ที่สร้างจากสคริปต์:**
   - ห้ามแก้ไข `data/it-kmitl/pscp/problems.json`, `lib/library/library-manifest.json`, `lib/library/library-stats.json`, หรือ `lib/library/resource-index.json` ด้วยมือโดยเด็ดขาด หากต้องการแก้ไข ให้แก้ที่ต้นทาง (Source of Truth) แล้วสั่งรันสคริปต์สร้างใหม่
2. **การเลือกภาษาของสคริปต์:**
   - **TypeScript (`tsx`):** ใช้กับสคริปต์ที่ต้องอิง types จากโมเดลหลัก, เชื่อมโยง Supabase, Drizzle ORM, หรือประมวลผล AST ของเว็บ
   - **Python 3:** ใช้กับงานประมวลผลด้าน Algorithms, การรัน Test Suite กับไพทอนโค้ด (เช่น PSCP/Pyodide), และการวาดภาพกราฟิกด้วย Pillow
   - **Node.js (`.mjs`):** ใช้สำหรับงาน build-time เบาๆ หรือ prepack ที่ไม่จำเป็นต้องคอมไพล์ TypeScript
3. **การเข้าถึง Path และ Environment:**
   - ใช้ `ROOT` หรือ `PROJECT` จาก `lib/paths.ts` เสมอ ห้ามฮาร์ดโค้ดพาธแบบ absolute
   - Path overrides ใน development ต้องครอบด้วย `if (process.env.NODE_ENV !== "production")` เสมอ เพื่อป้องกันไม่ให้ Turbopack ดึงไฟล์ทั้งโปรเจกต์เข้าไปใน bundle จนเกิดดิสก์เต็ม (ENOSPC)
4. **ความปลอดภัย:**
   - ห้ามรัน `assets:sync` หรือการกระทำที่มีการอัปโหลดหรือแก้ไขข้อมูลภายนอก repository โดยไม่ได้รับความยินยอมจากผู้ใช้
