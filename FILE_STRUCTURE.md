# โครงสร้างไฟล์ \<i\>Help

เอกสารนี้อธิบาย **ว่าไฟล์แต่ละอย่างอยู่ที่ไหน ตั้งชื่อยังไง และทำไม** เพื่อให้
repo ยังเป็นระเบียบเมื่อมีคนเพิ่มวิชาใหม่เข้ามาเรื่อย ๆ

อ่านคู่กับ [CONTRIBUTING.md](./CONTRIBUTING.md) (ขั้นตอนการส่ง PR),
[README.md](./README.md) (ภาพรวมโปรเจกต์) และ
[docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md) (สัญญาว่า "หนึ่งวิชา" แปลว่าอะไร)

---

## 1. แผนผังระดับบนสุด

```
ihelp/
├── app/                  หน้าเว็บ (Next.js App Router) + API routes
├── components/           React components (components/ui/ = shadcn-style primitives)
├── lib/                  logic ทั้งหมด: catalog, loader, i18n, quiz, markdown
├── content/              เนื้อหาแบบ Markdown ที่ render เป็นหน้าเว็บ
│   └── courses/          หนึ่งโฟลเดอร์ต่อหนึ่งรายวิชา
├── data/                 ข้อมูลรายวิชาแบบ JSON/Markdown ที่ไม่ผูกกับ route
├── public/assets/        ไฟล์จริง: PDF สไลด์ ข้อสอบ ภาพสมุดจด
├── scripts/              ตัวสร้าง manifest / stats (รันมือ ไม่ได้รันตอน build)
├── docs/                 SOP และเอกสารกระบวนการ
├── _dropzone/            staging ชั่วคราวสำหรับไฟล์ที่ยังไม่ได้จัดหมวด (gitignored)
└── FILE_STRUCTURE.md     ไฟล์นี้
```

หลักการแบ่ง — ถามว่า “ไฟล์นี้เป็นอะไร”:

| ถ้าเป็น                                        | เก็บที่               |
| ---------------------------------------------- | --------------------- |
| ไฟล์ binary ที่ผู้ใช้เปิด/ดาวน์โหลด (PDF, รูป) | `public/assets/`      |
| Markdown ที่ render เป็นหน้าเว็บของรายวิชา     | `content/courses/`    |
| JSON/Markdown ที่เป็น input ของฟีเจอร์         | `data/`               |
| คำอธิบาย/metadata ของไฟล์ใน `public/assets/`   | `lib/subject-library.ts` |

---

## 2. `public/assets/` — ไฟล์สื่อการเรียน

### กติกา path

```
public/assets/<namespace>/<subject>/<category>/<filename>
```

**บังคับ 4 ระดับเสมอ** — ไม่มีข้อยกเว้น ไฟล์ที่วางลอย ๆ ใต้ `<subject>/`
จะไม่ถูกหยิบเข้า manifest และจะไม่โผล่ในเว็บ

| ระดับ         | ค่าที่ใช้ได้                                                                            |
| ------------- | --------------------------------------------------------------------------------------- |
| `<namespace>` | `it-kmitl` (คณะ IT) · `en-kmitl` (วิชาคณะวิศวฯ ที่ลงข้ามคณะ)                              |
| `<subject>`   | รหัสสั้นตัวพิมพ์เล็ก ตรงกับ `code` ใน `lib/catalog.ts` เช่น `itf` `ics` `mfit` `pscp`     |
| `<category>`  | ดูตารางด้านล่าง                                                                          |
| `<filename>`  | kebab-case ดูหัวข้อ 2.2                                                                  |

### 2.1 `<category>` และชั้นวางที่แมปไป

`<category>` คือชื่อโฟลเดอร์จริงบนดิสก์ ส่วน “ชั้นวาง” (`AssetCategory`) คือ
chip ที่ใช้กรองใน gallery — แมปกันที่ `SHELF` ใน
[`scripts/build-library-manifest.mjs`](./scripts/build-library-manifest.mjs)

| โฟลเดอร์      | ชั้นวาง      | ใช้กับ                                    |
| ------------- | ------------ | ----------------------------------------- |
| `lectures/`   | `lecture`    | สไลด์บรรยายจากผู้สอน                      |
| `slides/`     | `lecture`    | สไลด์ชุดแยก (เช่นปีการศึกษาอื่น)          |
| `sheets/`     | `cheatsheet` | ชีทสรุป ชีทสูตร recap เฉลย                |
| `exams/`      | `exam`       | ข้อสอบเก่า ควิซ mock exam                 |
| `exercises/`  | `exercise`   | แบบฝึกหัด การบ้าน pretest                 |
| `labs/`       | `exercise`   | ใบงานปฏิบัติการ                           |
| `activities/` | `exercise`   | In-Class Activity                         |
| `worksheets/` | `exercise`   | ใบงานเปล่าสำหรับกรอกส่ง                   |
| `cases/`      | `exercise`   | กรณีศึกษา                                 |
| `notes/`      | `note`       | ภาพสแกนสมุดจด ภาพถ่ายกระดาน               |
| `pages/`      | `note`       | ภาพรายหน้าของเอกสารชุดเดียว               |
| `references/` | `reference`  | ตารางค่าวิกฤต ตารางสูตร เอกสารอ้างอิง     |
| `misc/`       | `reference`  | ไฟล์ที่ยังไม่ได้จัดหมวด                   |

โฟลเดอร์ที่ไม่อยู่ในตารางจะตกไปชั้น `reference` อัตโนมัติ — ถ้าจะเพิ่มหมวดใหม่
ให้เพิ่มใน `SHELF` ด้วย ไม่งั้นมันจะกองรวมกับ reference

### 2.2 กติกาตั้งชื่อไฟล์

**kebab-case ล้วน** — ตัวพิมพ์เล็ก คั่นด้วย `-` ห้ามมีช่องว่าง ห้าม `_`
ห้ามตัวพิมพ์ใหญ่

```
✅ itf-lec-week08-database.pdf
✅ mfit-hw-week13-integration-ii.pdf
✅ ics-quiz1-a-answers.pdf
❌ ITF_Lec_Week08-Database.pdf      (ตัวพิมพ์ใหญ่ + underscore)
❌ Ch1 Atomic structure.pdf         (ช่องว่าง — ต้อง escape ใน URL)
```

รูปแบบที่แนะนำ:

```
<subject>-<doctype>-<หัวข้อ>.<ext>
```

`<doctype>` ที่ระบบรู้จัก (ใช้สร้างชื่อการ์ดอัตโนมัติ):
`lec` `sheet` `ex` `hw` `lab` `quiz` `note` `ref` `midterm` `final` `archive`

ตัวอย่างการอ่านกลับเป็นชื่อการ์ด:

| ชื่อไฟล์                          | ชื่อที่ขึ้นบนการ์ด           |
| --------------------------------- | ---------------------------- |
| `itf-lec-week08-database.pdf`     | Lecture · Week 08 Database   |
| `mfit-hw-week13-integration-ii.pdf` | Homework · Week 13 Integration II |
| `oop-final-2023.pdf`              | Final · 2023                 |

ถ้าไฟล์ชื่อซ้ำกันแต่คนละเนื้อหา (คนละปีการศึกษา) ให้ต่อท้ายด้วยเทอม:
`charm-ex-worksheet02-disc-swot-completed-y1-s1-2569.pdf`

### 2.3 นามสกุลที่รองรับ

| นามสกุล                       | `fileType` | การแสดงผล                    |
| ----------------------------- | ---------- | ---------------------------- |
| `.pdf`                        | `pdf`      | เปิดใน iframe                |
| `.jpg` `.png` `.webp`         | `image`    | เปิดในตัวดูภาพ ซูม/ลากได้     |
| `.md`                         | `md`       | render เป็น rich text        |
| อื่น ๆ (`.circ` `.xlsx` `.docx`) | `file`     | ดาวน์โหลดอย่างเดียว ไม่ preview |

---

## 3. taxonomy กลางภาค / ปลายภาค

**สำคัญ: ขอบเขตสอบเป็น _metadata_ ไม่ใช่ระดับโฟลเดอร์**

เราไม่แยกโฟลเดอร์ `midterm/` กับ `final/` โดยตั้งใจ เพราะ:

1. มีสื่อจำนวนหนึ่งที่ **คร่อมทั้งเทอม** — แผนการสอน ตารางค่าวิกฤต คู่มือส่งงาน
   ถ้าบังคับให้ลงกล่องใดกล่องหนึ่งจะกลายเป็นข้อมูลผิด
2. ไฟล์เดียวอาจเปลี่ยนขอบเขตได้เมื่อผู้สอนขยับสัปดาห์สอบ — แก้ field ง่ายกว่า
   ย้ายไฟล์แล้วต้องตาม fix URL ทุกที่
3. URL ของไฟล์ควรนิ่ง คนแชร์ลิงก์กันได้

### ทำงานยังไง

field `scope` บน `SubjectAsset` ใน [`lib/subject-library.ts`](./lib/subject-library.ts):

```ts
scope?: "midterm" | "final";
```

- `"midterm"` — เนื้อหาก่อนสอบกลางภาค
- `"final"` — เนื้อหาหลังกลางภาค / ขอบเขตปลายภาค
- **ไม่ใส่** — สื่อที่คร่อมทั้งเทอม จะโชว์ใต้ทั้งสองหมุด

UI จะจัดกลุ่มการ์ดตาม `scope` ให้เอง โดยใช้ `SCOPE_LABEL` / `SCOPE_HEADING`

### เส้นแบ่งมาจากไหน

**เอาจาก `content/courses/<dir>/summary.md` ของวิชานั้นเท่านั้น** ห้ามเดาจาก
เลขสัปดาห์ในชื่อไฟล์ เพราะแต่ละวิชาแบ่งไม่เหมือนกัน:

| วิชา                | เส้นแบ่ง          |
| ------------------- | ----------------- |
| ITF · ICS · MFIT · PSCP | จบสัปดาห์ที่ 7 |
| DSA · PSTAT         | จบบทที่ 7         |
| BFIT                | จบสัปดาห์ที่ 8    |

ด้วยเหตุนี้ `scripts/build-library-manifest.mjs` จึง **ไม่เดา `scope` ให้เลย** —
การ์ดที่สร้างอัตโนมัติจะไม่มีขอบเขตจนกว่าจะมีคนมาเขียน entry มือ

---

## 4. `lib/subject-library.ts` กับ manifest อัตโนมัติ

การ์ดในหน้า Media Library มาจากสองชั้น ซ้อนกัน:

```
SUBJECT_ASSETS   (เขียนมือ)      ← ชนะเสมอเมื่อ url ตรงกัน
      +
LIBRARY_MANIFEST (สร้างอัตโนมัติ) ← พื้นรองรับ ไฟล์ไหนไม่มีคนเขียนก็ยังโผล่
```

รวมกันที่ `mergedAssets(code)` แล้วเติมจำนวนหน้า/ขนาดไฟล์ด้วย `withAssetStats()`

**ชั้นเขียนมือ** (`SUBJECT_ASSETS`) ให้สิ่งที่ชื่อไฟล์ให้ไม่ได้:
ชื่อเรื่องสองภาษา คำอธิบาย แท็ก และ `scope`

**ชั้นอัตโนมัติ** (`lib/library-manifest.json`) รับประกันว่าไฟล์ที่วางลง
`public/assets/` ตามกติกาข้อ 2 จะขึ้นเว็บทันที ไม่ต้องรอใครมาเขียน entry

### ไฟล์ที่ generate ขึ้นมา — ห้ามแก้มือ

| ไฟล์                        | สร้างโดย                            |
| --------------------------- | ----------------------------------- |
| `lib/library-manifest.json` | `npm run library:manifest`          |
| `lib/library-stats.json`    | `npm run library:stats`             |

รันทั้งสองพร้อมกัน: `npm run library:build`

> `library-stats.json` เก็บจำนวนหน้า PDF และขนาดไฟล์ ที่ต้องนับตอน build
> เพราะการนับหน้าคือการ inflate content stream ของ PDF ทุกไฟล์ — ทำตอน request
> ไม่ไหว

---

## 5. `content/courses/` — Markdown ของรายวิชา

```
content/courses/<officialCode>-<slug>/
├── summary.md              ภาพรวมรายวิชา (โครงสร้างบังคับ 6 หัวข้อ)
├── midterm-study-guide.md  คู่มือทบทวน (ถ้ามี)
└── archive/                เอกสารจากคลังเดิม ไม่ผูก route
```

ชื่อโฟลเดอร์ต้องเป็น `<officialCode>-<slug>` ให้ตรงกับ `officialCode` และ `slug`
ใน `lib/catalog.ts` เป๊ะ ๆ — `lib/course-content.ts` ใช้ประกอบ path ตรง ๆ

### `summary.md`

โหลดโดย `loadCourseOverview()` ซึ่งมองหาชื่อ **`summary.md` เท่านั้น**
ไฟล์อื่นในโฟลเดอร์เดียวกันจะไม่ถูกอ่านโดยอัตโนมัติ

frontmatter:

```yaml
---
code: "06066303"
slug: Problem-Solving-and-Computer-Programming
shortCode: PSCP
nameTh: การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์
nameEn: Problem Solving and Computer Programming
credits: "3 (2-2-5)"
year: 1
term: 1
termId: Y1-S1
prerequisites: []
category: หมวดวิชาเฉพาะ
language: th
sources:
  - it-kmitl-curriculum-2565
---
```

โครง 6 หัวข้อที่ทุกไฟล์ต้องมี:

1. **ภาพรวมรายวิชา** — รหัส ชื่อ หน่วยกิต วิชาบังคับก่อน ผู้สอน สัดส่วนคะแนน
2. **ขอบเขตเนื้อหา** — ตารางรายสัปดาห์ **แยกกลางภาค / ปลายภาค** (เส้นแบ่งใน
   หัวข้อ 3 มาจากตรงนี้)
3. **สรุปเนื้อหารายหัวข้อ** — มโนทัศน์หลัก ศัพท์ สูตร ตารางเปรียบเทียบ
4. **พิมพ์เขียวสำหรับสร้างสื่อต่อยอด** — สัดส่วนคลังข้อสอบ เทมเพลตโจทย์
5. **แหล่งข้อมูลในคลัง** — ไฟล์ที่มีจริง พร้อมหมายเหตุว่าถอดข้อความได้ไหม
6. (บทที่ 4 อาจเป็น **คลังโจทย์ OJ** สำหรับวิชาที่มี judge)

---

## 6. `data/` — ข้อมูลที่ไม่ผูก route

```
data/
├── oj_problems.json      รายการโจทย์ iJudge (override: env OJ_PROBLEMS_PATH)
├── ai-guidelines/        เอกสาร AI-Guidelines-PSCP (override: AI_GUIDELINES_PATH)
├── recommended/          โจทย์แนะนำ หนึ่งโฟลเดอร์ต่อโจทย์ + main.py
├── templates/            template ทางการของรายวิชา (.md / .th.md)
├── it-kmitl/<subject>/   สรุป วิเคราะห์ข้อสอบ ที่ใช้ป้อน quiz engine
└── en-kmitl/<subject>/   เหมือนกัน สำหรับวิชาคณะวิศวฯ
```

ไฟล์คู่ `.md` / `.th.md` = อังกฤษ / ไทย ระบบจับคู่ให้เองด้วย base name

---

## 7. `lib/catalog.ts` + `lib/course-bindings.ts` — จุดลงทะเบียนรายวิชา

หน้าที่แยกกันชัดเจน:

| ไฟล์ | ตอบคำถาม |
|---|---|
| `lib/catalog.ts` | **วิชานี้คือวิชาอะไร** — code, officialCode, slug, ชื่อ, หน่วยกิต, group |
| `lib/spine.ts` | **หนึ่งวิชาประกอบด้วยอะไรบ้าง** — 11 โมดูล เหมือนกันทุกวิชา |
| `lib/course-bindings.ts` | **วิชานี้เติมโมดูลไหนได้บ้าง** — ผูกโมดูลกับ loader / คลังข้อสอบ |

```ts
// lib/catalog.ts — identity เท่านั้น ไม่มี tracks อีกแล้ว
{
  code: "PSCP",
  officialCode: "06066303",
  slug: "Problem-Solving-and-Computer-Programming",
  nameTh: "...", nameEn: "...",
  credits: "3 (2-2-5)",
  group: "Y1-S1",                   // Y1-S1 | Y1-S2 | EN-KMITL
}

// lib/course-bindings.ts — วิชานี้เติมอะไรได้จริง
PSCP: {
  orientation:  { docs: [overview("06066303-...")] },
  deep_summary: { docs: [overview("06066303-...")] },
  applied:      { href: "/pscp" },
  archive:      {},
}
```

**ผูกเฉพาะโมดูลที่ทำเสร็จแล้ว** — โมดูลที่ไม่ได้ผูกยังโชว์ครบทั้ง 11 ช่อง แต่เป็นช่อง
ล็อก เพื่อให้นักศึกษาเห็น roadmap ทั้งหมด และแยกออกว่า "ยังไม่ทำ" กับ "ไม่มี"

รายละเอียดทั้งหมดอยู่ใน [docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md)

### `chapter` — ฟิลด์ที่เชื่อมสไลด์เข้ากับสัปดาห์

`SubjectAsset` และ `QuizQuestion` มี `chapter?: number` เหมือนกัน ทำให้ชั้นวาง
กรองตามสัปดาห์ได้ และข้อสอบชี้กลับไปสไลด์ที่มันมาจากได้

`scripts/build-library-manifest.mjs` อ่าน `chapter` **เฉพาะเมื่อชื่อไฟล์ระบุตรงๆ**
(`week08`, `ch3`, `lec02`, `unit4`) เลขลอยๆ เช่นปี พ.ศ. ถูกข้าม — chapter ที่ผิด
แย่กว่าไม่มี chapter

**`chapter` เป็น metadata ไม่ใช่ระดับโฟลเดอร์** ด้วยเหตุผลเดียวกับ `scope` ในข้อ 3

### ไวยากรณ์เน้นข้อความในเนื้อหา

`==คำสำคัญ|def==` — ชนิด: `def` / `formula` / `example` / `trap` / `term` / `exam-hot`
คำที่ซ้ำๆ ประกาศไว้ใน `content/courses/<dir>/glossary.json` แล้วระบบไฮไลต์ให้เอง
(ยังไม่ได้ทำ — อยู่ในเฟส 1 ของพิมพ์เขียว)

---

## 7.5 `_dropzone/` — รับไฟล์ที่ยังไม่ได้จัดหมวด

วางไฟล์ดิบลง `_dropzone/` แล้วชี้ AI agent ไปที่
[`docs/DROPZONE_SOP.md`](./docs/DROPZONE_SOP.md) — agent จะอ่านเนื้อไฟล์
จัดวิชา/หมวด/ขอบเขตสอบ เปลี่ยนชื่อเป็น kebab-case ย้ายเข้าที่ อัปเดต catalog
แล้วล้างโฟลเดอร์ให้

เนื้อหาใน `_dropzone/` ถูก gitignore (ยกเว้น `.gitkeep` กับ `README.md`)
ไฟล์ที่ agent จัดหมวดไม่ได้จะถูกพักไว้ที่ `_dropzone/_hold/` พร้อมเหตุผล
แทนที่จะเดา

---

## 8. เพิ่มวิชาใหม่ — checklist

1. `lib/catalog.ts` → เพิ่ม entry ใน `COURSES` (identity เท่านั้น)
2. `content/courses/<officialCode>-<slug>/summary.md` → เขียนตามโครง 5 ส่วน
3. `lib/course-bindings.ts` → เพิ่ม binding เริ่มที่ `baseline(dir)` ก็ได้
4. `public/assets/<ns>/<subject>/<category>/` → วางไฟล์ ตั้งชื่อ kebab-case
   (ใส่ `week08` / `ch3` ในชื่อไฟล์ ถ้าอยากให้ `chapter` ถูกอ่านอัตโนมัติ)
5. `npm run library:build` → สร้าง manifest + stats ใหม่
6. `lib/subject-library.ts` → เขียน entry มือให้ไฟล์เด่น ๆ พร้อม `scope` + `chapter`
   (ไฟล์ที่เหลือ manifest จัดการให้แล้ว)
7. `npm run content:check` → สัญญาพิมพ์เขียวต้องผ่าน
8. `npm run readiness` → ดูว่าวิชาใหม่ได้กี่ /11
9. `npm run lint && npm run build` → ต้องผ่านทั้งคู่

**ไม่ต้องแตะ route ใดเลย** — `app/courses/[dir]/[module]/page.tsx` รองรับทุกวิชา
และทุกโมดูลอยู่แล้ว

---

## 9. ข้อควรระวังก่อน deploy สาธารณะ

repo นี้เก็บสื่อการเรียนจริงจากคลัง `kmitl-archive` ซึ่งมีสองเรื่องต้องเคลียร์
ก่อนเปิดสาธารณะ:

- **ลิขสิทธิ์** — สไลด์บรรยายและ workbook (โดยเฉพาะ Edusoft ของ FE) เป็นของ
  ผู้สอน/ผู้จัดพิมพ์ บาง `summary.md` มีหมายเหตุ `ห้ามเผยแพร่สาธารณะ` กำกับไว้
- **ข้อมูลส่วนบุคคล** — ไฟล์ที่ลงท้าย `-completed` เป็นใบงานที่ทำแล้ว มีชื่อและ
  รหัสนักศึกษาอยู่ในเนื้อไฟล์ ส่วนใหญ่เป็นของเจ้าของ repo เอง **แต่ไฟล์งานกลุ่ม
  เช่น `lab06-lab-work-group-1.pdf` อาจมีชื่อเพื่อนร่วมกลุ่ม** ต้องตรวจก่อน

ทั้งสองอย่างถูก ingest เข้ามาแล้วโดยตั้งใจ เพราะยังไม่ deploy — ให้เคลียร์เรื่อง
สิทธิ์และ sanitize PII ก่อน publish จริง
