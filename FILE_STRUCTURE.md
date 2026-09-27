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
├── public/assets/        ไฟล์จริง (gitignored — เสิร์ฟจาก Supabase Storage)
├── scripts/              ตัวสร้าง manifest / stats (รันมือ ไม่ได้รันตอน build)
├── docs/                 SOP และเอกสารกระบวนการ
├── _dropzone/            staging ชั่วคราวสำหรับไฟล์ที่ยังไม่ได้จัดหมวด (gitignored)
└── FILE_STRUCTURE.md     ไฟล์นี้
```

หลักการแบ่ง — ถามว่า “ไฟล์นี้เป็นอะไร”:

| ถ้าเป็น                                        | เก็บที่               |
| ---------------------------------------------- | --------------------- |
| ไฟล์ binary ที่ผู้ใช้เปิด/ดาวน์โหลด (PDF, รูป) | `public/assets/` (ในเครื่อง) → Supabase Storage |
| Markdown ที่ render เป็นหน้าเว็บของรายวิชา     | `content/courses/`    |
| JSON/Markdown ที่เป็น input ของฟีเจอร์         | `data/`               |
| คำอธิบาย/metadata ของไฟล์ใน `public/assets/`   | `lib/library/subject-library.ts` |

---

## 2. `public/assets/` — ไฟล์สื่อการเรียน

> **ไม่ได้อยู่ใน git** — โฟลเดอร์นี้ถูก gitignore ไฟล์จริงอยู่บน Supabase Storage
> เก็บไว้ในเครื่องเพื่อให้ `library:build` scan ได้เท่านั้น เพิ่มไฟล์แล้วต้องรัน
> `bun run assets:sync` ด้วย มิฉะนั้นจะ 404 บน production
>
> เดิมไฟล์เหล่านี้อยู่ใน repo — PDF ~908 MB ดัน git pack ไป 881 MB และทำให้ build
> ของ Vercel เนื้อที่หมด (ENOSPC)
>
> **สอง bucket:** `ihelp-library` (สาธารณะ) และ `ihelp-library-exams` (ปิด
> เฉพาะ insider) `assets:sync` เลือก bucket ให้เองจาก `isRestrictedAsset()`

### กติกา path

```
public/assets/<namespace>/<subject>/<category>/<filename>
```

**บังคับ 4 ระดับเสมอ** — ไม่มีข้อยกเว้น ไฟล์ที่วางลอย ๆ ใต้ `<subject>/`
จะไม่ถูกหยิบเข้า manifest และจะไม่โผล่ในเว็บ

| ระดับ         | ค่าที่ใช้ได้                                                                            |
| ------------- | --------------------------------------------------------------------------------------- |
| `<namespace>` | `it-kmitl` (คณะ IT) · `en-kmitl` (วิชาคณะวิศวฯ ที่ลงข้ามคณะ)                              |
| `<subject>`   | รหัสสั้นตัวพิมพ์เล็ก ตรงกับ `code` ใน `lib/courses/catalog.ts` เช่น `itf` `ics` `mfit` `pscp`     |
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

field `scope` บน `SubjectAsset` ใน [`lib/library/subject-library.ts`](./lib/library/subject-library.ts):

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

## 4. `lib/library/subject-library.ts` กับ manifest อัตโนมัติ

การ์ดในหน้า Media Library มาจากสองชั้น ซ้อนกัน:

```
SUBJECT_ASSETS   (เขียนมือ)      ← ชนะเสมอเมื่อ url ตรงกัน
      +
LIBRARY_MANIFEST (สร้างอัตโนมัติ) ← พื้นรองรับ ไฟล์ไหนไม่มีคนเขียนก็ยังโผล่
```

รวมกันที่ `mergedAssets(code)` แล้วเติมจำนวนหน้า/ขนาดไฟล์ด้วย `withAssetStats()`

**ชั้นเขียนมือ** (`SUBJECT_ASSETS`) ให้สิ่งที่ชื่อไฟล์ให้ไม่ได้:
ชื่อเรื่องสองภาษา คำอธิบาย แท็ก และ `scope`

**ชั้นอัตโนมัติ** (`lib/library/library-manifest.json`) รับประกันว่าไฟล์ที่วางลง
`public/assets/` ตามกติกาข้อ 2 จะได้การ์ดของตัวเอง ไม่ต้องรอใครมาเขียน entry
(ยังต้อง `assets:sync` เพื่อให้ไฟล์ขึ้น production)

### ตารางรายสัปดาห์ — `lib/library/course-weeks.ts`

วิชาที่มี entry ใน `COURSE_SCHEDULES` (ตอนนี้ ITF และ ICS) จะเปิดคลังเป็นตารางรายสัปดาห์
แต่ละสัปดาห์มีแค่เลขสัปดาห์ หัวข้อ และ `scope` ส่วนไฟล์เข้าไปอยู่ใต้สัปดาห์ตาม `week`
(ถ้าไม่มีใช้ `chapter`) คู่กับ `scope` — ICS มี week 1–7 สองชุดจึงต้องใช้คู่นี้เป็นคีย์
ไฟล์ `status: "legacy"` / `isDuplicate` ซ่อนไว้หลังปุ่ม "ฉบับเก่า" ไฟล์ที่ไม่มีสัปดาห์
ไปรวมที่ "ใช้ได้ทั้งเทอม" ท้ายตาราง import ได้จากฝั่ง server เท่านั้น — ส่งถึง client
ผ่าน `/api/library/assets` หลังล็อกอิน

`sourceUrl` บน `SubjectAsset` คือหน้าไฟล์ต้นฉบับใน OnLearn แสดงเป็นปุ่ม "ต้นทาง"
ใส่เฉพาะไฟล์ที่มาจาก OnLearn จริง — ไฟล์ปีก่อนไม่ต้องใส่

### ไฟล์ที่ generate ขึ้นมา — ห้ามแก้มือ

| ไฟล์                        | สร้างโดย                            |
| --------------------------- | ----------------------------------- |
| `lib/library/library-manifest.json` | `bun run library:manifest`          |
| `lib/library/library-stats.json`    | `bun run library:stats`             |

รันทั้งสองพร้อมกัน: `bun run library:build`

> `library-stats.json` เก็บจำนวนหน้า PDF และขนาดไฟล์ ที่ต้องนับตอน build
> เพราะการนับหน้าคือการ inflate content stream ของ PDF ทุกไฟล์ — ทำตอน request
> ไม่ไหว

---

## 5. `content/courses/` — Markdown ของรายวิชา

```
content/courses/<officialCode>-<slug>/
├── summary.md              ภาพรวมรายวิชาสำหรับนักศึกษา (มาตรฐาน 6 หัวข้อ)
├── blueprint.md            พิมพ์เขียวสำหรับคนสร้างสื่อ — ไม่ถูก render ในเว็บ
├── midterm-study-guide.md  คู่มือทบทวน (ถ้ามี)
└── archive/                เอกสารอื่นของวิชา — ผูก route ผ่าน course-bindings.ts เท่านั้น
    ├── course-materials-2569.md   หน้าภาพรวมและตารางเรียนของโมดูล map
    └── weekNN.md                  หนึ่งหน้าต่อหนึ่งสัปดาห์ (ICS, ITF)
```

### หน้ารายสัปดาห์ (`archive/weekNN.md`)

ICS และ ITF ใช้โครงเดียวกัน ผูกเข้าโมดูล `syllabus_map` (route `/map`) ผ่าน
`icsSessionDocs()` / `itfWeekDocs()` ใน `lib/courses/course-bindings.ts` —
หน้าไหนยังไม่มีไฟล์จะถูกข้ามเอง ไม่ต้องแก้ binding

| ส่วน | ใช้ทำอะไร |
|---|---|
| `# สัปดาห์ที่ N · หัวข้อ` + blockquote บรรทัดแรก | lead ของการ์ดในหน้ารวม — ผู้สอน · สไลด์ (จำนวนหน้า) · แล็บ |
| bullet list แรก | นับเป็น "เป้าหมาย" บนการ์ด — ITF ใช้หัวข้อ "อ่านจบแล้วต้องตอบได้" |
| ตาราง `เอกสาร \| หน้า \| ไฟล์ในคลัง` | MdView แปลงเป็นการ์ดเปิด/ดาวน์โหลดไฟล์ โดยจับคู่ `fileName` ใน registry |
| ` ```youtube ` | เล่นคลิปในหน้า (ICS) — คลิปที่อยู่หลังล็อกอิน OnLearn ให้ชี้ไปคลังแทน |

หัวตารางอื่นในหน้าห้ามมีคำว่า "คลัง" หรือมีทั้ง "เอกสาร" และ "ไฟล์" พร้อมกัน
ไม่อย่างนั้นจะถูกแปลงเป็นการ์ดไฟล์ (`parseSessionDocTable` ใน `components/md-view.tsx`)

ชื่อโฟลเดอร์ต้องเป็น `<officialCode>-<slug>` ให้ตรงกับ `officialCode` และ `slug`
ใน `lib/courses/catalog.ts` เป๊ะ ๆ — `lib/courses/course-content.ts` ใช้ประกอบ path ตรง ๆ

### `summary.md`

โหลดโดย `loadCourseOverview()` ซึ่งมองหาชื่อ **`summary.md` เท่านั้น**
ไฟล์อื่นในโฟลเดอร์เดียวกันจะไม่ถูกอ่านโดยอัตโนมัติ

เป็นไฟล์ที่นักศึกษาเห็นในการ์ด **ภาพรวมรายวิชา** บนหน้ารายวิชา ทุกวิชาใช้โครงเดียวกัน —
กติกาเต็ม frontmatter และแม่แบบอยู่ใน
[`docs/COURSE_OVERVIEW_STANDARD.md`](./docs/COURSE_OVERVIEW_STANDARD.md)
และ `bun run content:check` ตรวจให้ (กฎ `overview-*`)

หกหัวข้อ `##` ชื่อและลำดับตายตัว:

1. **ข้อมูลรายวิชา** — ตารางข้อมูลพื้นฐาน คำอธิบาย สัดส่วนคะแนน วันสำคัญ
2. **ขอบเขตเนื้อหา** — ตารางรายสัปดาห์ **แยกกลางภาค / ปลายภาค**
3. **สรุปเนื้อหารายหัวข้อ** — หนึ่ง `###` ต่อสัปดาห์/บท
4. **สิ่งที่ต้องจำ** — สูตร ตัวเลข ตารางเปรียบเทียบ
5. **การประเมินและเตรียมสอบ** — รูปแบบการประเมิน หัวข้อที่ออกบ่อย จุดที่มักพลาด
6. **แหล่งเรียนรู้** — ลิงก์ในเว็บและช่องทางทางการ

เส้นแบ่งกลางภาค/ปลายภาคใน §3 ของเอกสารนี้มาจากหัวข้อ 2 ห้ามใส่ path ในเครื่อง
หรือสเปกคลังข้อสอบใน `summary.md` — สิ่งเหล่านั้นอยู่ใน `blueprint.md`

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

## 7. `lib/courses/catalog.ts` + `lib/courses/course-bindings.ts` — จุดลงทะเบียนรายวิชา

หน้าที่แยกกันชัดเจน:

| ไฟล์ | ตอบคำถาม |
|---|---|
| `lib/courses/catalog.ts` | **วิชานี้คือวิชาอะไร** — code, officialCode, slug, ชื่อ, หน่วยกิต, group |
| `lib/courses/spine.ts` | **หนึ่งวิชาประกอบด้วยอะไรบ้าง** — 11 โมดูล เหมือนกันทุกวิชา |
| `lib/courses/course-bindings.ts` | **วิชานี้เติมโมดูลไหนได้บ้าง** — ผูกโมดูลกับ loader / คลังข้อสอบ |

```ts
// lib/courses/catalog.ts — identity เท่านั้น ไม่มี tracks อีกแล้ว
{
  code: "PSCP",
  officialCode: "06066303",
  slug: "Problem-Solving-and-Computer-Programming",
  nameTh: "...", nameEn: "...",
  credits: "3 (2-2-5)",
  group: "Y1-S1",                   // Y1-S1 | Y1-S2 | EN-KMITL
}

// lib/courses/course-bindings.ts — วิชานี้เติมอะไรได้จริง
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

1. `lib/courses/catalog.ts` → เพิ่ม entry ใน `COURSES` (identity เท่านั้น)
2. `content/courses/<officialCode>-<slug>/summary.md` → เขียนตาม [มาตรฐานภาพรวมรายวิชา](./docs/COURSE_OVERVIEW_STANDARD.md) (แม่แบบใน `docs/templates/`)
3. `lib/courses/course-bindings.ts` → เพิ่ม binding เริ่มที่ `baseline(dir)` ก็ได้
4. `public/assets/<ns>/<subject>/<category>/` → วางไฟล์ ตั้งชื่อ kebab-case
   (ใส่ `week08` / `ch3` ในชื่อไฟล์ ถ้าอยากให้ `chapter` ถูกอ่านอัตโนมัติ)
5. `bun run library:build` → สร้าง manifest + stats ใหม่
6. `lib/library/subject-library.ts` → เขียน entry มือให้ไฟล์เด่น ๆ พร้อม `scope` + `chapter`
   (ไฟล์ที่เหลือ manifest จัดการให้แล้ว)
7. `bun run content:check` → สัญญาพิมพ์เขียวต้องผ่าน
8. `bun run readiness` → ดูว่าวิชาใหม่ได้กี่ /11
9. `bun run lint && bun run build` → ต้องผ่านทั้งคู่

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

### สถานะ ณ ปัจจุบัน (ตรวจแล้ว)

**เคลียร์แล้ว**

- ตัว repo ไม่มี secret ใด ๆ — ไม่มี key ของ Supabase, ไม่มี connection string
  ทั้งใน working tree และใน history (`.env*` ไม่เคยถูก commit)
- ข้อสอบเก่า 169 ไฟล์ ย้ายเข้า bucket แบบปิดแล้ว สาธารณะเข้าไม่ถึง
- ไฟล์สื่อทั้งหมดออกจาก git แล้ว การ clone repo ไม่ได้สื่อการเรียนติดไปด้วย

**ยังค้าง — ต้องตัดสินใจ**

| เรื่อง | จำนวน | หมายเหตุ |
| --- | --- | --- |
| สไลด์ ITF ที่ `summary.md` เขียนว่าห้ามเผยแพร่ | **แก้แล้ว** | คลังทั้งหมดอยู่หลังล็อกอินแล้ว |
| workbook FE (Edusoft) ที่ระบุว่าให้อยู่หลังล็อกอิน | **แก้แล้ว** | ตรงตามที่ `summary.md` เรียกร้องพอดี |
| ไฟล์ `-completed` (งานที่ทำส่งแล้ว) | 27 ไฟล์ หลังล็อกอิน | ไม่สาธารณะแล้ว แต่นักศึกษา IT คนอื่นยังเห็น — ถ้าไม่ต้องการ ต้องจำกัดเพิ่ม |
| งานกลุ่ม `lab06-*group*` | 2 ไฟล์ หลังล็อกอิน | มีรหัสนักศึกษาที่ไม่ใช่ของเจ้าของ repo (`66899515`) — เพื่อนร่วมกลุ่มไม่ได้ให้ความยินยอม ควรถอดออก |
| ชื่อไฟล์ข้อสอบใน `lib/library/library-manifest.json` | 159 entry | ตัวไฟล์ปิดแล้ว แต่ *รายชื่อ* ยัง commit อยู่ใน repo สาธารณะ |

กลไกพร้อมแล้ว: ทำให้เป็น `category` ที่จำกัดสิทธิ์ หรือย้ายเข้า
`ihelp-library-exams` แล้วเสิร์ฟผ่าน `libraryExamsForInsider()` เหมือนข้อสอบเก่า
