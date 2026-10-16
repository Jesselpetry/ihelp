# พิมพ์เขียวการเรียนรู้ — สัญญาที่ทุกวิชาต้องเหมือนกัน

เอกสารกำกับสำหรับโครงสร้างการเรียนรู้ของ iHelp
คู่กับ [`../FILE_STRUCTURE.md`](../FILE_STRUCTURE.md) (สัญญาเรื่องไฟล์) และ
[`DROPZONE_SOP.md`](./DROPZONE_SOP.md) (ขั้นตอนนำเข้า)

ตรวจล่าสุด 15 ต.ค. 2569 — ชื่อไฟล์ ฟังก์ชัน และกฎในเอกสารนี้ตรวจกับโค้ด ณ วันนั้น
ตัวเลขที่เปลี่ยนบ่อยมีคำสั่งกำกับว่าวัดซ้ำได้อย่างไร

> **บังคับด้วยเครื่อง ไม่ใช่ด้วยวินัย**
> ทุกกฎในเอกสารนี้ที่ตรวจได้ ถูกตรวจโดย `bun run content:check`
> ([`../scripts/validate-content.ts`](../scripts/validate-content.ts)) และรันอัตโนมัติก่อน `bun run build`
> ผ่าน `prebuild` ใน `package.json` (repo นี้ไม่มี CI workflow — ด่านคือ build)
> ถ้าเขียนกฎไว้แล้วไม่มีเครื่องตรวจ ภายในสองสปรินต์กฎนั้นจะหายไป

---

## 1. ปัญหาที่พิมพ์เขียวนี้แก้

iHelp ไม่ได้ขาดเนื้อหา — ณ 15 ต.ค. 2569 คลังมี 705 ไฟล์ (13,173 หน้า PDF) ข้อสอบ 390 ข้อ
(308 ข้อในคลังที่ผูกกับรายวิชา + 82 ข้อรายโจทย์ PSCP) และภาพรวมรายวิชา 15 ชุด
วัดซ้ำได้จาก `bun run library:index` (พิมพ์ยอดคลัง) และ `bun run readiness` (พิมพ์ยอดโมดูล)
สิ่งที่ขาดคือ **สัญญาว่า "หนึ่งวิชา" แปลว่าอะไร**

เมื่อไม่มีสัญญา แต่ละวิชาถูกสร้างตามที่มีเวลาสร้าง ผลคือ 9 จาก 15 วิชาเหลือแค่เอกสารสรุปกับกองไฟล์
ไม่มีการประเมินใดๆ และการเพิ่มวิชาหนึ่งต้องแก้ 4–6 ไฟล์ที่ branch แตกต่างกันไปแล้วจริงๆ
(ประโยคนี้เล่าสถานะก่อนมี spine — วันนี้ 9 วิชานั้นยังมีแค่ภาพรวม + คลังไฟล์ คือใช้ `baseline()`
แต่ทุกวิชาผ่าน route เดียวกัน ดู §8)

ความไม่สม่ำเสมอไม่ได้เกิดจากคนขี้เกียจ แต่เกิดจาก **โครงสร้างที่ไม่บังคับ**

---

## 2. Spine — 11 โมดูล ที่ทุกวิชาต้อง**ประกาศ**

ประกาศไว้ที่เดียวใน [`../lib/courses/spine.ts`](../lib/courses/spine.ts) → `STANDARD_SPINE`

**"ประกาศ" ไม่ใช่ "มี"** — ทุกวิชาแสดงครบ 11 ช่องเสมอ
ช่องที่ยังไม่มี binding แสดงเป็น locked slot พร้อมบอกว่าขาดอะไร
พิมพ์เขียวนี้จะเพิ่มจำนวน locked slot มากขึ้นชั่วคราว — **นั่นถูกต้องแล้ว อย่าซ่อน**

เรียง A → D ตามสิ่งที่สมองต้องทำจริง: รับเข้า → บีบอัด → ดึงกลับ → พิสูจน์และซ่อม
ลำดับนี้มีความหมาย ไม่ใช่แค่การจัดกลุ่ม — นักศึกษาที่กระโดดจาก "อ่านสรุป" ไป "ข้อสอบจับเวลา"
โดยข้ามการดึงความจำแบบไม่จับเวลา จะได้คะแนนต่ำและสรุปผิดว่าตัวเองไม่เก่ง

| # | ModuleId | URL segment | เฟส | scope ปริยาย | คืออะไร |
|---|---|---|---|---|---|
| 1 | `orientation` | `overview` | A · เข้าใจ | ทั้งเทอม | ขอบเขตสอบ สัดส่วนคะแนน รูปแบบข้อสอบ เกณฑ์ได้ 0 และเสาหลักของวิชา |
| 2 | `syllabus_map` | `map` | A | ทั้งเทอม | กริดสัปดาห์/บท ที่แต่ละช่องบอกว่ามีสรุปไหม มีโจทย์กี่ข้อ มีสไลด์กี่ไฟล์ — ที่ทำแล้วเป็นเอกสาร Markdown ผูกด้วย binding: ITF และ ICS เป็นหน้ารายสัปดาห์ (`archive/weekNN.md`) · MFIT เป็นแผนที่เนื้อหาปลายภาค · กริดที่คำนวณจาก `chapter` ยังไม่มี |
| 3 | `deep_summary` | `summary` | A | ทั้งเทอม | สรุปเนื้อหาแยกบท พร้อมสารบัญด้านข้าง |
| 4 | `cram_sheet` | `cram` | B · ย่อ | กลางภาค | สรุปเร่งด่วนที่อ่านจบใน 10 นาทีจริง |
| 5 | `key_cards` | `cards` | B | ทั้งเทอม | บัตรคำ/บัตรสูตร + คิวทวนตามช่วงเวลา |
| 6 | `drill` | `quiz` | C · ฝึก | ทั้งเทอม | คลังโจทย์รายบท **ไม่จับเวลา** |
| 7 | `speed_quiz` | `speed` | C | กลางภาค | 12 ข้อ 10 นาที คละบทตามน้ำหนักการสอบ |
| 8 | `applied` | `labs` | C | ทั้งเทอม | คลังโจทย์ ห้องแลป หรือโจทย์สถานการณ์ |
| 9 | `mock_exam` | `mock` | D · พิสูจน์ | กลางภาค | ข้อสอบเสมือนจริง — **โหมด ไม่ใช่เอกสาร** |
| 10 | `weak_spot` | `weak-spots` | D | ทั้งเทอม | ข้อที่เคยตอบผิด ทำใหม่เฉพาะข้อนั้นได้ |
| 11 | `archive` | `library` | D | ทั้งเทอม | สไลด์ PDF ข้อสอบเก่า ภาพสมุดจด (ผูกบทแล้ว) |

"scope ปริยาย" คือ `scope` ใน `STANDARD_SPINE` — binding ของวิชาเขียนทับได้ (เช่น ITF `deep_summary`
เป็น `midterm`, MFIT `syllabus_map` เป็น `final`)

### URL segment ≠ ModuleId — โดยตั้งใจ

segment คงของเดิมไว้ทั้งหมด (`summary`, `quiz`, `library`, `cram`, `labs`)
เพราะเป็นลิงก์ที่คนแชร์กันไปแล้ว และถูกอ้างใน `alternates.canonical` กับ sitemap
เฉพาะโมดูลที่ใหม่จริงเท่านั้นที่ได้ segment ใหม่ · ของที่ย้ายมี redirect ใน `next.config.ts`
(`/exam` → `/mock` · `/plan` → `/cram` · `/analysis` → `/overview`)

ทุกโมดูลของทุกวิชาอยู่บน route เดียว `app/courses/[dir]/[module]/page.tsx`
(`moduleBySegment()` แปลง segment กลับเป็นโมดูล)

เหตุผลเดียวกับ scope-เป็น-metadata ใน `FILE_STRUCTURE.md` §3: **URL ที่ขยับ ทำลิงก์ที่ส่งไปแล้วพัง**

### นิยาม Done

แต่ละโมดูลมี `dod: LText[]` ใน `STANDARD_SPINE` — เกณฑ์ว่าโมดูลนั้นเสร็จจริงหรือยัง
**เครื่องไม่ได้ตรวจ DoD** (ยกเว้นข้อ "ทุกข้อมี chapter" ซึ่งเป็นกฎ `chapter` ใน §5) ใช้เป็นเช็กลิสต์ตอนเติมโมดูล
ที่ binding ปัจจุบันเติมแล้วแต่ยังไม่ถึง DoD ดู §6

---

## 3. Binding — วิชาส่งแค่ "ผูกอะไรกับอะไร"

[`../lib/courses/course-bindings.ts`](../lib/courses/course-bindings.ts) → `COURSE_BINDINGS`
เป็น**ทั้งหมด**ของ config ต่อหนึ่งวิชา

```ts
export interface ModuleBinding {
  docs?: ModuleDoc[];          // เอกสารที่โมดูลนี้ render
  bank?: () => QuizQuestion[]; // คลังข้อสอบ
  quizId?: number;             // คีย์เก็บ progress — บังคับเมื่อมี bank
  href?: string;               // override เมื่อโมดูลอยู่นอก /courses/<dir>/<segment>
  filled?: () => boolean;      // สำหรับโมดูลที่เนื้อหาอยู่ใน registry
  title?: LText; subtitle?: LText; scope?: ModuleScope; note?: LText;
}

export interface ModuleDoc {
  slug: string; title: LText;
  load: () => string | null;   // อ่าน Markdown — null เมื่อไฟล์ไม่อยู่ (หน้านั้นถูกข้าม)
  chapter?: number; scope?: "midterm" | "final";
}
```

โมดูลนับว่า "เติมแล้ว" (`status: "available"`) เมื่อมี `href` หรือ `filled()` เป็นจริง หรือ `bank()` ไม่ว่าง
หรือมี `docs` อย่างน้อยหนึ่งชิ้นที่ `load()` ไม่เป็น `null` — และสำหรับ `archive` เมื่อวิชานั้นมีการ์ดในคลัง
(`coursesWithAssets()`) ไม่ต้องเขียนอะไรใน binding นอกจาก `archive: {}`

ฟังก์ชันตัวช่วยใน binding: `baseline(dir)` (orientation + deep_summary จาก `summary.md` + archive) ·
`itfWeekDocs()` · `icsSessionDocs()` · `mfitWeekDocs()` (สร้าง `docs` จาก `archive/…` ด้วย `loadCourseDoc()`)

[`../lib/courses/course-spine.ts`](../lib/courses/course-spine.ts) เชื่อม spine กับ binding
ทุก route เรียก `resolveCourseSpine()` / `resolveModule()` เหมือนกันหมด — **ไม่มี `switch (course.code)` ที่ไหนอีก**
เหลือการเช็ก code ตรงๆ สองจุด (ไม่ใช่ `switch`): (1) โมดูล `applied` ที่ไม่มี `href` เรนเดอร์ `ComProLabHub`
ซึ่งเขียนไว้เฉพาะ COMPRO (`course.code !== "COMPRO"` → 404 ใน `app/courses/[dir]/[module]/page.tsx`) — วิชาอื่นที่มี
ห้องปฏิบัติของตัวเองต้องใช้ `href` (PSCP ใช้ `/pscp`) · (2) `components/subject-library.tsx` ซ่อนไฟล์ซ้ำเป็นค่าเริ่มต้น
เฉพาะ ICS (`courseCode === "ICS"`)

### แยกไฟล์เพราะ client boundary

- `lib/courses/spine.ts` — ข้อมูลล้วน (types + `STANDARD_SPINE` + labels) · client component import ได้
- `lib/courses/course-spine.ts` — เชื่อมกับ binding · แตะ `fs` · server เท่านั้น
- `ResolvedModule` ต้อง serialize ได้ (ไม่มี function) เพราะข้ามไป client component

---

## 4. `chapter` — กุญแจเชื่อมที่ทั้งระบบขาด

ฟิลด์เดียวที่ปลดล็อกหลายอย่างพร้อมกัน:

- สไลด์กรองตามสัปดาห์ได้ — ทำแล้วเฉพาะ ITF และ ICS (มุมมองรายสัปดาห์ จับคู่ด้วย `week` ถ้าไม่มีใช้ `chapter`
  ตารางสัปดาห์อยู่ใน `lib/library/course-weeks.ts`) วิชาอื่น เช่น MFIT PSTAT ยังเป็นชั้นวางแบน
- ข้อสอบลิงก์ไปสไลด์ที่มันมาจากได้ — ยังไม่ทำ
- ห้องซ่อมจุดอ่อนบอกได้ว่าอ่อน**บทไหน** ไม่ใช่แค่ผิดกี่ข้อ — ยังไม่ทำ (โมดูล `weak_spot` ว่างทั้ง 15 วิชา)
- หน้าสรุปโชว์ "ซ้อมบทนี้ 12 ข้อ" ได้ — ยังไม่ทำ

อยู่บนทั้ง `SubjectAsset` และ `QuizQuestion` ส่วน `SubjectAsset` มี `week` อีกฟิลด์ (สัปดาห์ในตารางสอน 1..15
หรือคาบ 1..7) ไว้จับคู่กับ `CourseWeek` — วัดว่าการ์ดแต่ละวิชาผูก `week`/`scope` แล้วเท่าไรได้จาก
`courses.<CODE>.counts` (`withWeek`, `withScope`) ใน `lib/library/resource-index.json`

**`scripts/build-library-manifest.mjs` อ่าน `chapter` เฉพาะเมื่อชื่อไฟล์ระบุตรงๆ**
(`week08`, `ch3`, `lec02`, `unit4` และรูปย่อ `wk` `chapter` `lecture` เลข 1–20) — นั่นคือข้อเท็จจริงที่ไฟล์ประกาศเกี่ยวกับตัวเอง
ไม่ใช่การเดา เลขลอยๆ ในชื่อไฟล์ (`2564`) ถูกข้าม เพราะ **chapter ที่ผิด แย่กว่าไม่มี chapter**

> ### ⛔ ห้ามทำ `chapter` เป็นระดับโฟลเดอร์
> ด้วยเหตุผลเดียวกับ `scope` ใน `FILE_STRUCTURE.md` §3:
> URL ต้องนิ่ง และอาจารย์เลื่อนสัปดาห์สอบได้เสมอ — แก้ field ถูกกว่าย้ายไฟล์แล้วตาม fix ทุก URL

---

## 5. สัญญาของเนื้อหา — กฎที่ `content:check` บังคับ

[`../lib/schemas/content.ts`](../lib/schemas/content.ts) — Zod + กฎที่ตรวจได้ (`checkBank()`)
และ [`../scripts/validate-content.ts`](../scripts/validate-content.ts) — รวมทุกกฎ

### error — build พัง

| กฎ | ตรวจอะไร |
|---|---|
| `schema` | โครงสร้างตรงกับ `quizQuestionSchema` — รวมถึง `sourceRef` ต้องไม่ว่าง (ทุกข้อต้องบอกได้ว่ามาจากบรรทัดไหนของสื่อต้นทาง) |
| `correct-id` | `correctId` ต้องอยู่ใน option ids |
| `option-count` | จำนวนตัวเลือกตรงกับ kind (mcq · predict-output · spot-the-bug · pep8 = 4–5 · true-false = 2 · short-answer = 0) |
| `option-id` | option id ห้ามซ้ำ ไม่งั้นการสลับตัวเลือกทำให้ตรวจผิด |
| `duplicate-id` | question id ห้ามซ้ำในคลังเดียวกัน |
| `missing-quiz-id` | มี `bank` ต้องมี `quizId` |
| `quiz-id-collision` | `quizId` ห้ามชนกัน ไม่งั้นคะแนนสองโมดูลถูกรวมกัน |
| `unknown-module` · `spine-size` · `spine-segment` · `course-spine` · `no-binding` | สัญญา spine: binding ชี้โมดูลที่ไม่มี · spine ต้องมี 11 โมดูล · URL segment ห้ามซ้ำ · ทุกวิชา resolve ได้ 11 ช่อง · ทุกวิชาใน catalog ต้องมี binding |
| `recommended-file` · `recommended-registry` | โจทย์แนะนำใน `data/recommended/`: `problem.md` `problem.th.md` `main.py` ต้องไม่ว่าง และต้องมี entry ใน `QUIZ_BANK` `TEST_CASES` `PROBLEM_TAKEAWAYS` `IJUDGE_SCRAPED_STATS` ครบ (และไม่มี entry กำพร้า) — คลังข้อสอบรายโจทย์ผ่าน `checkBank()` ชุดเดียวกัน |
| `overview-frontmatter` · `overview-title` · `overview-updated` · `overview-sections` · `overview-internal-path` | มาตรฐานภาพรวมรายวิชา — ดู [`COURSE_OVERVIEW_STANDARD.md`](./COURSE_OVERVIEW_STANDARD.md) |

### warn — หนี้เนื้อหาที่ยังไม่ได้ซ่อม (นับไว้ ไม่ทำ build พัง)

| กฎ | หนี้ | `bun run content:check` 15 ต.ค. 2569 |
|---|---|---:|
| `why-duplicate` | ตัวลวงสองตัวใช้คำอธิบายเดียวกัน — ตัวหนึ่งไม่ได้สอนอะไร | 66 (COMPRO `mock_exam` 60 · CHEM `drill` 6) |
| `why-placeholder` | คำอธิบายเป็นประโยคกลวง เช่น `"ตัวเลือกนี้ไม่ถูก — ดูคำอธิบายเต็มด้านล่าง"` (รายการเต็มคือ `PLACEHOLDER_WHY`) | 0 (ดูข้อยกเว้นข้างล่าง) |
| `fake-bilingual` | `en` copy ค่าไทยมาทั้งดุ้น — ประกาศสองภาษาที่ไม่มีจริง (ให้ **ละ `en`** แทน) ตรวจทั้งในคลังข้อสอบและ `subtitle` ของ binding | 157 (ทั้งหมดอยู่ที่ COMPRO `mock_exam`) |
| `chapter` | ข้อในคลังที่ผูก `drill`/`speed_quiz`/`mock_exam` ไม่มี `chapter` | 0 |

**ทำไมเริ่มเป็น warn:** หนี้กลายเป็นตัวเลขที่ขยับได้ แทนที่จะเป็นย่อหน้าในรายงาน
เมื่อซ่อมครบแล้วให้เลื่อนเป็น `error` เพื่อไม่ให้กลับมาอีก — ตอนนี้ `chapter` เป็น 0 แล้ว เข้าเงื่อนไขเลื่อน
แต่โค้ดยังเป็น `warn`

**ข้อยกเว้นที่ตั้งใจ:** ข้อที่มี `explanationMd` ไม่ถูกตรวจ `why` รายตัวเลือก
เพราะ engine render คำอธิบายก้อนเดียวแทน per-option — เป็นโหมดที่ออกแบบไว้ ไม่ใช่ช่องโหว่
ผลข้างเคียงที่ต้องรู้: `why-placeholder` เป็น 0 **เพราะข้อยกเว้นนี้** ไม่ใช่เพราะมีใครซ่อม —
`lib/quiz/itf-quiz.ts` ยังมีสตริง placeholder 141 จุดค้างในข้อที่ใช้ `explanationMd` (นักศึกษาไม่เห็น เพราะ engine
ข้ามไปแสดงคำอธิบายก้อนเดียว) ตัวเลข 0 จึงบอกไม่ได้ว่าข้อเหล่านั้นมีคำอธิบายที่ดีแล้ว

---

## 6. Readiness Index

`bun run readiness` — คะแนน x/11 ต่อวิชา (นับโมดูลที่ `status === "available"` จาก `resolveCourseSpine()`)
ตามด้วยค่าเฉลี่ยและรายการโมดูลที่วิชาส่วนใหญ่ยังไม่เติม

เป็นทั้งตัวเลขเดียวที่ตอบว่า "แพลตฟอร์มดีขึ้นไหม" และ backlog การผลิตเนื้อหาที่เรียงลำดับตัวเอง:
แถวล่างสุดคือที่ที่เนื้อหาชิ้นถัดไปควรไปลง

ผลเมื่อ 15 ต.ค. 2569 (working tree) — เฉลี่ย **3.9/11 (36%)** ทั้ง 15 วิชา:

| วิชา | x/11 | เติมแล้ว |
|---|---:|---|
| MFIT | 8 | orientation · syllabus_map · deep_summary · cram_sheet · drill · speed_quiz · mock_exam · archive |
| ICS | 6 | orientation · syllabus_map · deep_summary · drill · mock_exam · archive |
| COMPRO | 6 | orientation · deep_summary · drill · applied · mock_exam · archive |
| ITF | 5 | orientation · syllabus_map · deep_summary · drill · archive |
| PSCP | 4 | orientation · deep_summary · applied · archive |
| CHEM | 4 | orientation · deep_summary · drill · archive |
| CHARM · FE · BFIT · DSA · OOP · PSTAT · FE2 · DL | 3 | orientation · deep_summary · archive (`baseline()`) |
| SPORT | 2 | orientation · deep_summary (ไม่มีไฟล์ในคลัง จึงไม่มี archive) |

โมดูลที่ยังไม่มีวิชาใดเติม: `key_cards` และ `weak_spot` (0/15) · ที่เติมน้อยสุด: `cram_sheet` และ `speed_quiz`
(1/15, เฉพาะ MFIT) · `applied` 2/15 (PSCP, COMPRO) · `mock_exam` 3/15 (ICS, MFIT, COMPRO) · `syllabus_map` 3/15
(ITF, ICS, MFIT) · `drill` 5/15 (ITF, ICS, MFIT, COMPRO, CHEM) · `archive` 14/15

**"เติมแล้ว" ไม่เท่ากับ "ถึง DoD"** — readiness นับว่ามีเนื้อหาผูกอยู่ ไม่ได้ตรวจเกณฑ์ใน §2:
`speed_quiz` ของ MFIT และ `mock_exam` ของ ICS/MFIT เป็นเอกสาร Markdown ไม่ใช่โหมดจับเวลา ·
`mock_exam` ของ COMPRO เป็นคลัง 60 ข้อ (โมดูลของตัวเอง `quizId` แยกจาก `drill`) แต่ยังไม่มีตัวจับเวลา ·
`drill` ทุกวิชายังเริ่มจากหน้ารวมบททั้งหมด (ปุ่มเริ่มปุ่มเดียว) ยังเลือกทำทีละบทไม่ได้

---

## 7. สิ่งที่ห้ามทำพัง

1. **`sourceRef` บังคับ และขั้นตอนตรวจที่ต้อง "รันจริง"**
   วินัยนี้เคยอยู่ใน comment หัวไฟล์ `lib/quiz/quiz-content.ts` เท่านั้น
   ตอนนี้เป็นกฎของ `content:check` แล้ว (ด่านคือ `prebuild`) — **ห้ามย้ายคลังก่อนแปลงกฎเป็นเครื่องตรวจ**
2. **`scope` เป็น metadata ไม่ใช่ระดับโฟลเดอร์** (และ `chapter` ก็เช่นกัน)
3. **สถานะความล้มเหลวที่ซื่อสัตย์** — locked slot · `LText` ที่ยอมตกกลับเป็นไทยแทนแปลด้วยเครื่อง ·
   ไฟล์ที่ไม่มั่นใจถูกพักไว้ไม่เดา · ทั้งสามอย่างคือเหตุผลที่ผู้ใช้เชื่อระบบ

---

## 8. เพิ่มวิชาใหม่ให้ครบพิมพ์เขียว

1. เพิ่ม record ใน [`../lib/courses/catalog.ts`](../lib/courses/catalog.ts) — **identity เท่านั้น**
   (code / officialCode / slug / nameTh / nameEn / credits / group / officialUrl) และสีใน `COURSE_COLORS`
2. สร้าง `content/courses/<officialCode>-<Slug>/summary.md` ตาม [`COURSE_OVERVIEW_STANDARD.md`](./COURSE_OVERVIEW_STANDARD.md)
   และ `blueprint.md` (แม่แบบใน [`templates/`](./templates/))
3. เพิ่ม binding ใน [`../lib/courses/course-bindings.ts`](../lib/courses/course-bindings.ts) — เริ่มที่ `baseline(dir)` ก็ได้
   (3/11 · ถ้ายังไม่มีไฟล์ในคลังใช้ `baseline(dir, { archive: false })` = 2/11 เหมือน SPORT)
4. ลงทะเบียนรายชื่อบท/สัปดาห์ใน `COURSE_CHAPTERS_MAP` ของ [`../lib/courses/course-chapters.ts`](../lib/courses/course-chapters.ts)
   — ถ้าไม่ลง ตัวสำรองจะอ่านตารางใต้ `## 2.` ของ `summary.md` แทน
5. วางไฟล์สื่อตามกติกา 4 ระดับใน `FILE_STRUCTURE.md` §2 และเพิ่มโฟลเดอร์ `<subject>` ใน `SUBJECT_CODE`
   ของ `scripts/build-library-manifest.mjs` — **ถ้าไม่เพิ่ม manifest จะข้ามไฟล์ของวิชานั้นทั้งหมด**
   (นับเป็น "unmapped, skipped") ส่วน entry เขียนมือเพิ่มเป็น array `<CODE>_ASSETS` แล้วลงทะเบียนใน `SUBJECT_ASSETS`
   ของ `lib/library/subject-library.ts`
6. รัน `bun run library:build` แล้ว `bun run library:audit` (ลำดับเต็มและการอัปโหลดอยู่ใน [`DROPZONE_SOP.md`](./DROPZONE_SOP.md) Phase 5)
7. รัน `bun run content:check` และ `bun run readiness`

ไม่ต้องแตะ route ใดเลย — `app/courses/[dir]/[module]/page.tsx` รองรับทุกวิชาและทุกโมดูล

---

## 9. ส่วนที่ยังไม่ได้ทำ

พิมพ์เขียวเต็มยังมีอีก 4 เฟส (นับตามแผนต้นฉบับ ไม่ได้ตรวจ): ภาษาภาพ 3 ชั้น (shimmer + pastel highlighter +
typography ไทย), ห้องซ่อมจุดอ่อน, drill เลือกบท, cram 15 วิชา, บัตรคำ, quiz engine v2 (`numeric` / `cloze` /
`matching` / `ordering`), timer แบบสงบ, ธงความมั่นใจ

ตรวจกับโค้ด 15 ต.ค. 2569:

| รายการ | สถานะ |
|---|---|
| ห้องซ่อมจุดอ่อน (`weak_spot`) | ยังไม่ทำ — ไม่มี route; `missed[]` ถูกบันทึกใน localStorage แต่มีแค่ `recommended-hub.tsx` ที่อ่านความคืบหน้ากลับ |
| drill เลือกบท | ยังไม่ทำ — `SubjectQuizGate` แสดงรายการบทกับจำนวนข้อ แต่มีปุ่มเริ่มปุ่มเดียว |
| cram 15 วิชา | ทำแล้ว 1 วิชา (MFIT) |
| บัตรคำ (`key_cards`) | ยังไม่ทำ — ไม่มี route |
| quiz engine v2 | ยังไม่ทำ — `QuizKind` มีหกชนิดเดิม (`mcq` `predict-output` `spot-the-bug` `pep8` `true-false` `short-answer`) |
| timer แบบสงบ | ยังไม่ทำ — ไม่มีตัวจับเวลาใน `technique-quiz.tsx` |
| ธงความมั่นใจ | ยังไม่ทำ — ไม่พบในโค้ด |
| ภาษาภาพ 3 ชั้น | ทำบางส่วน — มี `animate-shimmer` ในบางการ์ด ตัวอ่านแบบ notebook (หมึกแดง ไฮไลต์) และ THSarabunNew ดู [`FONTS.md`](./FONTS.md); ไม่ได้ตรวจว่าครบสามชั้นตามแผนหรือยัง |
| ไฮไลต์คำศัพท์อัตโนมัติ (`glossary.json`) | ยังไม่ทำ — ไม่มีไฟล์ `glossary.json` ใน `content/` หรือ `data/` และไม่มีโค้ดอ่าน (มีแค่ไวยากรณ์ `{==…==}` ที่เขียนมือ ดู [`FONTS.md`](./FONTS.md) §8) |

ดูแผนเต็มที่ artifact `cb6dbc2d` (อ้างอิงภายนอก repo — ไม่ได้ตรวจ) และหัวข้อ "สิ่งที่ห้ามทำพัง" ข้างบนใช้ได้กับทุกเฟส
