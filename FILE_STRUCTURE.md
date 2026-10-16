# โครงสร้างไฟล์ \<i\>Help

เอกสารนี้อธิบาย **ว่าไฟล์แต่ละอย่างอยู่ที่ไหน ตั้งชื่อยังไง และทำไม** เพื่อให้
repo ยังเป็นระเบียบเมื่อมีคนเพิ่มวิชาใหม่เข้ามาเรื่อย ๆ

อ่านคู่กับ [CONTRIBUTING.md](./CONTRIBUTING.md) (ขั้นตอนการส่ง PR),
[README.md](./README.md) (ภาพรวมโปรเจกต์), [AGENTS.md](./AGENTS.md) (จุดเริ่มต้นของ AI agent) และ
[docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md) (สัญญาว่า "หนึ่งวิชา" แปลว่าอะไร)

---

## แหล่งความจริง (source of truth) — ถ้าจะแก้ X แก้ที่ไหน

แต่ละอย่างมี **ที่เดียว** ที่ต้องแก้ ที่อื่นอ่านต่อหรือถูกสร้างจากที่นั่น —
แก้ที่ปลายทางโดยตรงแล้วจะถูกทับหรือไม่ตรงกัน

| ถ้าจะแก้ | แก้ที่ | แล้วรัน |
| --- | --- | --- |
| ตัวตนรายวิชา — code, ชื่อ, หน่วยกิต, กลุ่ม | `lib/courses/catalog.ts` (`COURSES`) | `content:check` |
| โมดูลของวิชา — เอกสาร/คลังข้อสอบที่ผูก | `lib/courses/course-bindings.ts` (`COURSE_BINDINGS`) | `readiness`, `library:index` |
| ภาพรวมรายวิชาที่นักศึกษาเห็น | `content/courses/<dir>/summary.md` ([มาตรฐาน](./docs/COURSE_OVERVIEW_STANDARD.md)) | `content:check` |
| หน้ารายสัปดาห์ของ ITF / ICS | `content/courses/<dir>/archive/weekNN.md` — หัวข้อบนการ์ดอยู่ใน `ITF_WEEKS` / `ICS_SESSIONS` ใน `course-bindings.ts` | `library:index`, `library:audit` |
| บันทึกสำหรับคนสร้างสื่อ (ไม่ render) | `content/courses/<dir>/blueprint.md` | — |
| metadata ของการ์ดในคลัง — ชื่อสองภาษา คำอธิบาย `scope` `week`/`chapter` `edition` `sourceUrl` | `lib/library/subject-library.ts` (`<CODE>_ASSETS`) | `library:build`, `library:audit` |
| ตารางสัปดาห์ในหน้าคลัง (ITF, ICS) | `lib/library/course-weeks.ts` (`COURSE_SCHEDULES`) | `library:index`, `library:audit` |
| ตัวไฟล์ | `public/assets/<ns>/<subject>/<category>/<kebab-name>` (gitignored) → Supabase Storage | `library:build` → `library:audit` → `assets:sync` |
| คลังข้อสอบ/ควิซ | `lib/quiz/*.ts` (เอกสารยาวที่เป็นที่มาอยู่ใน `data/<ns>/<subject>/`) | `content:check` |
| โจทย์ PSCP | branch `OP` ของ repo archive → `data/pscp/problems.json` | `pscp:build` |
| ไฟล์ที่ generate | **ห้ามแก้มือ** — แก้ต้นทางแล้ว regenerate (ตารางใน §4) | ตามตาราง §4 |

ชื่อหัวข้อสัปดาห์ของ ITF ประกาศ **สองที่** — `ITF_WEEKS` ใน `course-bindings.ts` (การ์ดหน้าสัปดาห์) และ
`ITF_SCHEDULE` ใน `course-weeks.ts` (ตารางในหน้าคลัง) ICS ก็เช่นกัน (`ICS_SESSIONS` กับ
`ICS_SCHEDULE`) — เปลี่ยนหัวข้อแล้วต้องแก้ทั้งคู่

### หาของในคลังโดยไม่ต้องเปิดไฟล์ใหญ่

`lib/library/subject-library.ts` ยาวกว่า 5,000 บรรทัด — อย่าอ่านทั้งไฟล์เพื่อหาการ์ดใบเดียว
ใช้ดัชนี `lib/library/resource-index.json` ที่ generate ไว้ (รวมรายวิชา โมดูล สัปดาห์ เอกสาร
และการ์ดทุกใบ แต่ละ field อธิบายใน `resource-index.schema.json`):

```bash
bun run library:find -- packet tracer --course ITF   # ค้นการ์ด
bun run library:find -- --course ITF --week 13       # ทุกอย่างที่จัดอยู่ในสัปดาห์นั้น
bun run library:find -- --docs --course ITF          # เอกสารของวิชา
jq '.totals' lib/library/resource-index.json         # จำนวนวิชา/เอกสาร/การ์ด/ไฟล์/ขนาด
jq '.courses.ITF.weeks[] | select(.week == 13)' lib/library/resource-index.json
jq '.assets["itf-lec-week08-database-2569"]' lib/library/resource-index.json
jq -r '.docs | to_entries[] | select(.value.unresolvedRefs | length > 0) | .key' lib/library/resource-index.json
```

คำค้นหลายคำต้องตรงทุกคำ (AND) ไม่สนตัวพิมพ์ใหญ่เล็ก · `--kind` คือหมวดของการ์ด (`lecture` `cheatsheet` `exam`
`exercise` `note` `reference`) หรือ role ของเอกสารเมื่อมี `--docs` · `--json` พิมพ์เรคคอร์ดดิบ ·
ดัชนีเป็น snapshot — เปลี่ยนแหล่งแล้วรัน `bun run library:build` ก่อนค้น

---

## 1. แผนผังระดับบนสุด

```
ihelp/
├── app/                  หน้าเว็บ (Next.js App Router) + API routes
├── components/           React components (components/ui/ = shadcn-style primitives)
├── lib/                  logic แบ่งตามโดเมน: courses, library, quiz, pscp, auth, supabase …
│                         (ดู lib/README.md)
├── content/              เนื้อหาแบบ Markdown ที่ render เป็นหน้าเว็บ
│   └── courses/          หนึ่งโฟลเดอร์ต่อหนึ่งรายวิชา
├── data/                 ข้อมูลที่ไม่ผูกกับ route: registry โจทย์ PSCP, template, เอกสารยาวของวิชา
├── db/                   Drizzle schema + migrations + SQL ที่ apply มือ (RLS)
├── public/assets/        ไฟล์จริง (gitignored — เสิร์ฟจาก Supabase Storage)
├── scripts/              เครื่องมือรันมือ: library:* assets:* pscp:* readiness
│                         (มีแค่ content:check ที่รันอัตโนมัติก่อน build)
├── docs/                 SOP มาตรฐาน พิมพ์เขียว และ templates
├── _dropzone/            staging ชั่วคราวสำหรับไฟล์ที่ยังไม่ได้จัดหมวด (gitignored)
├── _quarantine/          ไฟล์ที่ถอดออกจากคลังเพราะมีข้อมูลส่วนบุคคล (gitignored)
├── proxy.ts              Next 16 proxy: refresh session Supabase + กัน /onboarding /upload /exams
├── next.config.ts        redirect ของ route เก่า
├── AGENTS.md · CLAUDE.md จุดเริ่มต้นของ AI agent (CLAUDE.md แค่ include AGENTS.md)
├── CHANGELOG.md          บันทึกการเปลี่ยนแปลง (หัวข้อภาษาไทย)
└── FILE_STRUCTURE.md     ไฟล์นี้
```

หลักการแบ่ง — ถามว่า “ไฟล์นี้เป็นอะไร”:

| ถ้าเป็น                                        | เก็บที่               |
| ---------------------------------------------- | --------------------- |
| ไฟล์ binary ที่ผู้ใช้เปิด/ดาวน์โหลด (PDF, รูป) | `public/assets/` (ในเครื่อง) → Supabase Storage |
| Markdown ที่ render เป็นหน้าเว็บของรายวิชา     | `content/courses/`    |
| JSON/Markdown ที่เป็น input ของฟีเจอร์         | `data/`               |
| คำอธิบาย/metadata ของไฟล์ใน `public/assets/`   | `lib/library/subject-library.ts` |
| ดัชนีสำหรับค้นหา (คน/agent/สคริปต์ ไม่ใช่โค้ดแอป) | `lib/library/resource-index.json` (generated) |

---

## 2. `public/assets/` — ไฟล์สื่อการเรียน

> **ไม่ได้อยู่ใน git** — โฟลเดอร์นี้ถูก gitignore ไฟล์จริงอยู่บน Supabase Storage
> เก็บไว้ในเครื่องเพื่อให้ `library:build` scan ได้เท่านั้น เพิ่มไฟล์แล้วต้องรัน
> `bun run assets:sync` ด้วย มิฉะนั้นจะ 404 บน production
>
> เดิมไฟล์เหล่านี้อยู่ใน repo — PDF ~908 MB ดัน git pack ไป 881 MB และทำให้ build
> ของ Vercel เนื้อที่หมด (ENOSPC)
>
> **สอง bucket:** `ihelp-library` (**สาธารณะ** — ทุกไฟล์ยกเว้นข้อสอบเก่า) และ
> `ihelp-library-exams` (ปิด เฉพาะ insider) `assets:sync` เลือก bucket ให้เองจาก
> `isRestrictedAsset()` และใช้ object key เดียวกันทั้งสอง bucket · `assets:sync` มีแต่อัปโหลด
> ไม่ลบ object ที่มีอยู่ — สิทธิ์ของแต่ละส่วนอยู่ใน §9

### กติกา path

```
public/assets/<namespace>/<subject>/<category>/<filename>
```

**บังคับ 4 ระดับเสมอ** — ไม่มีข้อยกเว้น ไฟล์ที่วางลอย ๆ ใต้ `<subject>/`
จะไม่ถูกหยิบเข้า manifest และจะไม่โผล่ในเว็บ

| ระดับ         | ค่าที่ใช้ได้                                                                            |
| ------------- | --------------------------------------------------------------------------------------- |
| `<namespace>` | `it-kmitl` (คณะ IT) · `en-kmitl` (วิชาคณะวิศวฯ ที่ลงข้ามคณะ)                              |
| `<subject>`   | รหัสสั้นตัวพิมพ์เล็ก ตรงกับ `code` ใน `lib/courses/catalog.ts` เช่น `itf` `ics` `mfit` `pscp` และต้องอยู่ใน `SUBJECT_CODE` ของ `scripts/build-library-manifest.mjs` (วิชาใหม่ต้องเพิ่มที่นั่นด้วย ไม่งั้นไฟล์ถูกข้าม) |
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

ชั้น `exam` คือ **ข้อสอบเก่าที่จำกัดสิทธิ์** (§9) — ถ้าไฟล์เป็นข้อสอบแต่วางใน `notes/` หรือ `pages/`
(เช่นภาพถ่ายหน้าข้อสอบ) การ์ดของมันต้องตั้ง `category: "exam"` เอง ไม่งั้นจะถูกเสิร์ฟเป็นสาธารณะ

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

ถ้าไฟล์ชื่อซ้ำกันแต่คนละเนื้อหา (คนละปีการศึกษา) ให้ต่อท้ายด้วยปีหรือเทอม:
`itf-lec-week08-database-2569.pdf`,
`charm-ex-worksheet02-disc-swot-completed-y1-s1-2569.pdf`

### 2.3 นามสกุลที่รองรับ

| นามสกุล                       | `fileType` | การแสดงผล                    |
| ----------------------------- | ---------- | ---------------------------- |
| `.pdf`                        | `pdf`      | เปิดใน iframe                |
| `.jpg` `.jpeg` `.png` `.webp` | `image`    | เปิดในตัวดูภาพ ซูม/ลากได้     |
| `.md`                         | `md`       | render เป็น rich text        |
| อื่น ๆ (`.circ` `.xlsx` `.docx`) | `file`     | ดาวน์โหลดอย่างเดียว ไม่ preview |

การ์ด `md` บางใบ (ของ ITF, ICS, MFIT, ComPro, CHEM) มี `url` ชี้ไปหน้าในเว็บ เช่น `/courses/<dir>/summary` ไม่ใช่ไฟล์ใน bucket

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

field `scope` บน `SubjectAsset` ใน [`lib/library/subject-library-ui.ts`](./lib/library/subject-library-ui.ts):

```ts
scope?: "midterm" | "final";
```

- `"midterm"` — เนื้อหาก่อนสอบกลางภาค
- `"final"` — เนื้อหาหลังกลางภาค / ขอบเขตปลายภาค
- **ไม่ใส่** — สื่อที่คร่อมทั้งเทอม จะโชว์ใต้ทั้งสองหมุด

UI จะจัดกลุ่มการ์ดตาม `scope` ให้เอง โดยใช้ `SCOPE_LABEL` / `SCOPE_HEADING`

### เส้นแบ่งมาจากไหน

**เอาจาก `content/courses/<dir>/summary.md` ของวิชานั้นเท่านั้น** (หัวข้อ 2 ขอบเขตเนื้อหา)
ห้ามเดาจากเลขสัปดาห์ในชื่อไฟล์ เพราะแต่ละวิชาแบ่งไม่เหมือนกัน:

| วิชา                | เส้นแบ่ง          |
| ------------------- | ----------------- |
| ITF · ICS · MFIT · PSCP | จบสัปดาห์ที่ 7 |
| DSA · PSTAT · OOP   | จบบทที่ 7         |
| BFIT                | จบสัปดาห์ที่ 8    |

วิชาที่เหลือ (FE, FE2, ComPro, CHEM, CHARM, DL, SPORT) ดูหัวข้อ 2 ของ `summary.md` และตารางใน
[`docs/DROPZONE_SOP.md`](./docs/DROPZONE_SOP.md) — วิชาที่ไม่มีเส้นแบ่งที่ยืนยัน (กิจกรรมล้วน) ปล่อย `scope` ว่าง
ICS มีสัปดาห์ 1–7 สองชุด (ครึ่งแรก = กลางภาค, ครึ่งหลัง = ปลายภาค) จึงต้องดู `scope` คู่กับ `week` เสมอ

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

รวมกันที่ `mergedAssets(code)` (การ์ดเขียนมือก่อน ตามด้วยการ์ดอัตโนมัติที่เขียนมือยังไม่ครอบ
จับคู่ด้วย `url` ไม่รวม `#fragment`) จากนั้น `assetsForCourse()` กรองข้อสอบเก่าออก เติมจำนวนหน้า/ขนาดไฟล์
ด้วย `withAssetStats()` และแปลง `url` เป็น URL ของ bucket ด้วย `assetUrl()` ส่วน
`restrictedAssetsForCourse()` คืนเฉพาะข้อสอบเก่า (ยังเป็น path เดิม — ต้องผ่านการเช็คสิทธิ์ก่อนถึงจะได้ signed URL)

**ชั้นเขียนมือ** (`SUBJECT_ASSETS` — array ต่อวิชา เช่น `ITF_ASSETS`) ให้สิ่งที่ชื่อไฟล์ให้ไม่ได้:
ชื่อเรื่องสองภาษา คำอธิบาย แท็ก `scope` และสัปดาห์

**ชั้นอัตโนมัติ** (`lib/library/library-manifest.json`) รับประกันว่าไฟล์ที่วางลง
`public/assets/` ตามกติกาข้อ 2 จะได้การ์ดของตัวเอง ไม่ต้องรอใครมาเขียน entry
(ยังต้อง `assets:sync` เพื่อให้ไฟล์ขึ้น production) การ์ดอัตโนมัติมีแค่ชื่อที่อ่านจากชื่อไฟล์
กับ `chapter` ที่ชื่อไฟล์ระบุตรง ๆ (§7)

### field ของ `SubjectAsset`

นิยามเต็มอยู่ใน [`lib/library/subject-library-ui.ts`](./lib/library/subject-library-ui.ts)

| field | ใช้ทำอะไร |
| --- | --- |
| `id` `title` `description` `tags` `category` `fileType` `url` `fileName` | จำเป็น — `url` คือ path `/assets/…` (หรือหน้าในเว็บสำหรับการ์ด `md`) ส่วน `fileName` คือชื่อที่เสนอให้ตอนดาวน์โหลด และเป็นชื่อที่ตารางไฟล์ในเอกสารใช้จับคู่ (ปกติเท่ากับชื่อไฟล์จริง) |
| `scope` | `midterm` / `final` — ไม่ใส่ = คร่อมทั้งเทอม (§3) |
| `week` · `chapter` | สัปดาห์/บทที่ไฟล์สังกัด ตารางสัปดาห์จับคู่ด้วย `week` ก่อน ไม่มีก็ใช้ `chapter` |
| `edition` · `isCurrentYear` | ฉบับ (`"2569"`) และเป็นฉบับของปีปัจจุบันหรือไม่ |
| `status` | `primary` `current_year` `duplicate` `compact` `legacy` — `legacy` / `duplicate` ถูกซ่อนหลังปุ่ม "ฉบับเก่า" ในมุมมองสัปดาห์ |
| `isDuplicate` · `duplicateOf` | สำเนา และ id/ชื่อไฟล์ของต้นฉบับ |
| `groupId` | ชุดภาพสแกนที่ยุบเป็นกองเดียวในแกลเลอรี (key ของ `ASSET_GROUPS`) |
| `sourceUrl` | หน้าไฟล์ใน OnLearn → ปุ่ม "ต้นทาง" ใส่เฉพาะไฟล์ที่มาจาก OnLearn จริง — ไฟล์ปีก่อนไม่ต้องใส่ |
| `courseCode` | รหัสวิชาบนป้ายสันการ์ด (ไม่บังคับ) |
| `pages` · `sizeBytes` | **ห้ามใส่เอง** — `withAssetStats()` เติมจาก `library-stats.json` อย่าเขียนจำนวนหน้า/ขนาดลงในคำอธิบายด้วย |

### ตารางรายสัปดาห์ — `lib/library/course-weeks.ts`

วิชาที่มี entry ใน `COURSE_SCHEDULES` (ตอนนี้ ITF และ ICS) จะเปิดคลังเป็นตารางรายสัปดาห์
แต่ละสัปดาห์มีเลขสัปดาห์ หัวข้อ `scope` และถ้ามี `video` (ลิงก์คลิปบน OnLearn) หรือ `upcoming`
(ยังไม่ปล่อยบนเว็บรายวิชา — ไฟล์ใต้สัปดาห์นี้เป็นฉบับก่อน) ส่วนไฟล์เข้าไปอยู่ใต้สัปดาห์ตาม `week`
(ถ้าไม่มีใช้ `chapter`) คู่กับ `scope` — ICS มี week 1–7 สองชุดจึงต้องใช้คู่นี้เป็นคีย์
ไฟล์ `status: "legacy"` / `duplicate` หรือ `isDuplicate` ซ่อนไว้หลังปุ่ม "ฉบับเก่า" ไฟล์ที่ไม่มีสัปดาห์
ไปรวมที่ "ใช้ได้ทั้งเทอม" ท้ายตาราง import ได้จากฝั่ง server เท่านั้น — ส่งถึง client
ผ่าน `/api/library/assets` หลังล็อกอิน (ลิงก์วิดีโอ OnLearn มากับมัน)

### ไฟล์ที่ generate ขึ้นมา — ห้ามแก้มือ

| ไฟล์                        | สร้างโดย                            | คืออะไร |
| --------------------------- | ----------------------------------- | ------- |
| `lib/library/library-manifest.json` | `bun run library:manifest`          | การ์ดอัตโนมัติจากการ scan `public/assets/` (ต่อวิชา) |
| `lib/library/library-stats.json`    | `bun run library:stats`             | ขนาดไฟล์ + จำนวนหน้า PDF ต่อ url |
| `lib/library/resource-index.json`   | `bun run library:index`             | ดัชนีรวม `courses` · `docs` · `assets` (ตาม [`resource-index.schema.json`](./lib/library/resource-index.schema.json)) |
| ทั้งสามไฟล์ข้างบน ตามลำดับ | `bun run library:build`             | |
| `data/pscp/problems.json`           | `bun run pscp:build`                | registry โจทย์ PSCP (§6) |
| `data/en-kmitl/compro/labs.json`    | `bun run compro:labs`               | โจทย์แล็บ ComPro |

> `library-stats.json` เก็บจำนวนหน้า PDF และขนาดไฟล์ ที่ต้องนับตอน build
> เพราะการนับหน้าคือการ inflate content stream ของ PDF ทุกไฟล์ — ทำตอน request
> ไม่ไหว
>
> `resource-index.json` เป็น snapshot ของ TypeScript กับ Markdown: ไม่มี timestamp (รันซ้ำได้ไบต์เดียวกัน
> diff ของไฟล์ = diff ของคลัง) แก้การ์ด binding ตารางสัปดาห์หรือเอกสารแล้วต้อง rebuild
> **ห้ามแก้มือ และห้าม import จากโค้ดใน `app/` `components/` `lib/`** — ในนั้นมีทุกการ์ดรวมข้อสอบเก่า
> ถ้าเข้า client bundle จะเป็นการเปิดรายชื่อข้อสอบทั้งหมด ใช้ค้นผ่าน `library:find` หรือ `jq` เท่านั้น

### ตรวจความสอดคล้อง — `bun run library:audit`

คลังอยู่ห้าที่ที่ต้องตรงกัน: การ์ดใน TypeScript, manifest + stats, เอกสาร Markdown ที่อ้างการ์ดด้วยชื่อไฟล์,
ไฟล์ใน `public/assets/` และ bucket — ไม่มีอะไรเตือนเมื่อมันเพี้ยน การ์ดที่ไฟล์ถูกเปลี่ยนชื่อก็แค่ 404
รัน audit หลัง `library:build` ทุกครั้งที่แตะไฟล์ การ์ด หรือเอกสารที่อ้างถึงการ์ด

- exit **1** ถ้ามี error · **0** ถ้าไม่มี · **2** ถ้ารันไม่ได้ (อาร์กิวเมนต์ผิด หรือ `--remote` แต่ไม่มี key / ต่อ Storage ไม่ได้)
- `-- --course ITF` เฉพาะวิชา · `-- --json` พิมพ์เป็น JSON · `-- --remote` เทียบกับ bucket **แบบอ่านอย่างเดียว**
  (ต้องมี `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`)
- กฎที่ต้องใช้ไฟล์จริงใน `public/assets/` จะถูกข้ามและบอกไว้ในสรุปเมื่อโฟลเดอร์ไม่มี (เช่นใน CI)
- ข้อความของแต่ละ finding ลงท้ายด้วย `→` บอกวิธีแก้

| ระดับ | กฎ | หมายถึง |
| --- | --- | --- |
| error | `missing-file` | การ์ดชี้ไปที่ไฟล์ที่ไม่มีอยู่ (เช็คกับ `public/assets/` ถ้ามี ไม่งั้นเช็คกับ manifest) |
| error | `id-collision` | `id` ของการ์ดซ้ำกัน |
| error | `duplicate-url` | การ์ดเขียนมือสองใบในวิชาเดียวกันใช้ `url` เดียวกัน (แยกกันได้ด้วย `#page=`) |
| error | `course-mismatch` | ไฟล์ของการ์ดอยู่ในโฟลเดอร์ของอีกวิชา |
| error | `dead-doc-card` | ตารางไฟล์ในเอกสารที่ถูก render ระบุชื่อไฟล์ที่ไม่มีการ์ดตรง จึงกลายเป็นการ์ดที่เปิดไม่ได้ |
| error (`--remote`) | `not-uploaded` | ไฟล์ยังไม่อยู่ใน bucket → production ตอบ 404 |
| error (`--remote`) | `insider-in-public-bucket` | ข้อสอบเก่าอ่านได้ใน bucket สาธารณะ — รั่ว |
| warning | `unmapped-file` | ไฟล์ที่ manifest ข้าม (ตื้นกว่า 4 ระดับ หรือโฟลเดอร์ `<subject>` ไม่อยู่ใน `SUBJECT_CODE`) จึงไม่มีการ์ด เว้นแต่มีการ์ดเขียนมือ |
| warning | `filename-mismatch` | `fileName` ของการ์ดไม่ตรงชื่อไฟล์จริง — ยกเว้นเป็นชื่อจริงที่มีคำนำหน้า (เช่น `ics-2564-pg-01.jpg` สำหรับ `pg-01.jpg`) เพราะ `fileName` คือชื่อที่เสนอให้ตอนดาวน์โหลด · ถ้าเอกสารอ้างชื่อจริง จะกลายเป็น `dead-doc-card` อีกที |
| warning | `bad-filename` | ชื่อไฟล์ไม่ใช่ kebab-case ตัวพิมพ์เล็ก (§2.2) |
| warning | `duplicate-content` | ไฟล์ใน `public/assets/` ที่ไบต์เหมือนกันทุกตัว |
| warning | `stale-generated` | manifest / stats / ดัชนีที่ commit ไม่ตรงกับต้นทางหรือกับดิสก์ → `library:build` |
| warning | `orphan-doc` | เอกสารใน `content/courses/` ที่ไม่มีโมดูลไหน render (blueprint กับ README ไม่นับ) |
| warning | `week-not-in-schedule` | `week` ของการ์ด (คู่กับ `scope`) ไม่ตรงแถวไหนในตารางสัปดาห์ของวิชา |
| warning | `status-conflict` | `isCurrentYear` ขัดกับ `status` เป็น legacy/duplicate หรือ `duplicateOf` ชี้ไปที่ไม่มี |
| warning (`--remote`) | `wrong-bucket` | ไฟล์ทั่วไปมีแต่ใน bucket ปิด ผู้เข้าชมเปิดไม่ได้ |
| warning (`--remote`) | `stale-object` | object ใน bucket ที่ไม่มีไฟล์ใน `public/assets/` แล้ว |
| info | `coverage` | สรุปต่อวิชา: จำนวนการ์ด / ที่สร้างอัตโนมัติล้วน / ที่ไม่มี scope / ที่ไม่มี week |

ขั้นตอนหลังเพิ่ม/เปลี่ยนชื่อไฟล์: `library:build` → `library:audit` → `assets:sync` (อัปโหลดเฉพาะที่ bucket
ยังไม่มี — เจ้าของ repo เป็นคนรัน) → commit JSON ที่ถูก regenerate

---

## 5. `content/courses/` — Markdown ของรายวิชา

```
content/courses/<officialCode>-<slug>/     วิชาที่ไม่มี officialCode ใช้ <slug> ล้วน (General-Chemistry)
├── summary.md              ภาพรวมรายวิชาสำหรับนักศึกษา (มาตรฐาน 6 หัวข้อ)
├── blueprint.md            พิมพ์เขียวสำหรับคนสร้างสื่อ — ไม่ถูก render ในเว็บ
├── midterm-study-guide.md  คู่มือทบทวน (ITF เท่านั้น — ผูกที่โมดูล deep_summary)
└── archive/                เอกสารอื่นของวิชา — ผูก route ผ่าน course-bindings.ts เท่านั้น
    ├── course-materials-2569.md   หน้าภาพรวมและตารางเรียนของโมดูล map (ITF, ICS)
    ├── weekNN.md                  หนึ่งหน้าต่อหนึ่งสัปดาห์ (ITF 01–15, ICS 01–07)
    ├── study-guide-*.md           สรุปและควิซรายสัปดาห์ของ MFIT (+ study-guide-curriculum.json)
    └── links.md · readme.md       โน้ตลิงก์ภายนอก — ไม่มีโมดูลไหนแสดง
```

ไฟล์ Markdown ที่ไม่มี binding จะไม่ถูกอ่านเลย (ดัชนีระบุ `rendered: false` — ICS มี
`RESOURCES_MANIFEST.md` ที่รากโฟลเดอร์เป็นทะเบียนสื่อสำหรับคนทำงาน ไม่ใช่เนื้อหาของเว็บ)

### หน้ารายสัปดาห์ (`archive/weekNN.md`)

ICS และ ITF ใช้โครงเดียวกัน ผูกเข้าโมดูล `syllabus_map` (route `/map`) ผ่าน
`icsSessionDocs()` / `itfWeekDocs()` ใน `lib/courses/course-bindings.ts` —
หน้าไหนยังไม่มีไฟล์จะถูกข้ามเอง ไม่ต้องแก้ binding

| | ITF | ICS |
| --- | --- | --- |
| ไฟล์ | `week01.md`–`week15.md` | `week01.md`–`week07.md` |
| หมายถึง | สัปดาห์ที่ N ของภาค (กลางภาค 1–7, ปลายภาค 8–15) · ตั้ง `chapter` = เลขสัปดาห์ | คาบที่ N ของ **ครึ่งหลัง** (ครั้งที่ 8–15 ของประมวลการสอน · `scope` ปลายภาค) · ไม่ตั้ง `chapter` เพราะไม่ตรงกับเลขบทของคลังข้อสอบ |
| ชื่อบนการ์ด | `สัปดาห์ที่ N — <หัวข้อ>` จาก `ITF_WEEKS` | `คาบที่ N — <หัวข้อ>` จาก `ICS_SESSIONS` |
| หน้าแรก | `archive/course-materials-2569.md` | `archive/course-materials-2569.md` |

| ส่วนในหน้า | ใช้ทำอะไร |
| --- | --- |
| blockquote ย่อหน้าแรก | "lead" ของการ์ดในหน้ารวม — ผู้สอน · สไลด์ (จำนวนหน้า) · แล็บ (ไม่มี blockquote ใช้ย่อหน้าแรกของเนื้อหา) |
| bullet list แรก | นับเป็น "เป้าหมาย" บนการ์ด — ITF ใช้หัวข้อ "อ่านจบแล้วต้องตอบได้" ICS ใช้ "เป้าหมายของคาบนี้" |
| ตาราง `เอกสาร \| หน้า \| ไฟล์ในคลัง` | MdView แปลงเป็นการ์ดเปิด/ดาวน์โหลดไฟล์ โดยจับคู่ `fileName` กับการ์ดของวิชา (ไม่สนนามสกุล) |
| ` ```youtube ` | เล่นคลิปในหน้า (ICS) บรรทัดละคลิป `videoId \| คำอธิบาย` — คลิปที่อยู่หลังล็อกอิน OnLearn ฝังไม่ได้ ให้ใส่เป็น `video` ในตารางสัปดาห์ของคลังแทน |
| ชื่อไฟล์ (`.pdf .zip .docx .pptx .ova`) ในเนื้อหา | นับเป็น "ไฟล์" บนการ์ด (นับชื่อที่ไม่ซ้ำ นอก code fence) |

หัวตารางอื่นในหน้าห้ามมีคำว่า "คลัง" หรือมีทั้ง "เอกสาร" (หรือ "ชื่อ") และ "ไฟล์" พร้อมกัน
ไม่อย่างนั้นจะถูกแปลงเป็นการ์ดไฟล์ (`parseSessionDocTable` ใน `components/md-view.tsx`) —
ตารางที่หัวมีคำว่า "สถานะ" / "ผลกระทบ" จะไม่ถูกแปลง · ตารางไฟล์จับคู่กับการ์ดของวิชาที่ไม่ใช่ข้อสอบเก่า
(`assetsForCourse()`) ชื่อไฟล์ที่ไม่มีการ์ดจะกลายเป็นแถวที่เปิดไม่ได้ และ `library:audit` รายงานเป็น `dead-doc-card`

ชื่อโฟลเดอร์ต้องเป็น `<officialCode>-<slug>` ให้ตรงกับ `officialCode` และ `slug`
ใน `lib/courses/catalog.ts` เป๊ะ ๆ — `lib/courses/course-content.ts` ใช้ประกอบ path ตรง ๆ

### `summary.md`

โหลดโดย `loadCourseOverview()` ซึ่งมองหาชื่อ **`summary.md` เท่านั้น**
ไฟล์อื่นในโฟลเดอร์เดียวกันจะไม่ถูกอ่านโดยอัตโนมัติ (ต้องผูกผ่าน `loadCourseDoc()` ใน binding)

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
├── pscp/problems.json       registry โจทย์ PSCP — generated (bun run pscp:build) ห้ามแก้มือ
│                            (override: env PSCP_REGISTRY_PATH — dev เท่านั้น)
├── oj_problems.json         รายการโจทย์ iJudge คัดลอกจาก branch OP ของ repo archive — ใช้โดย /make/*
│                            และ /recommended (override: env OJ_PROBLEMS_PATH — dev เท่านั้น)
├── all_problems_detail.json รายละเอียดโจทย์ + ตัวอย่างทางการ (คัดลอกจาก OP) — input ของ pscp:registry
├── ai-guidelines/           เอกสาร AI-Guidelines-PSCP (override: AI_GUIDELINES_PATH — dev เท่านั้น)
├── recommended/             โจทย์แนะนำ หนึ่งโฟลเดอร์ต่อโจทย์ (problem.md · problem.th.md · main.py)
├── templates/               template ทางการ submission / ai_reflection (.md / .th.md)
├── it-kmitl/<subject>/      เอกสารยาวของวิชา (สรุป วิเคราะห์ข้อสอบ ข้อสอบจำลอง) ที่ใช้ป้อนโมดูล
└── en-kmitl/                เหมือนกัน สำหรับวิชาคณะวิศวฯ (compro/labs.json = generated โดย bun run compro:labs)
```

ไฟล์คู่ `.md` / `.th.md` = อังกฤษ / ไทย ระบบจับคู่ให้เองด้วย base name

เอกสารใน `data/it-kmitl/` และ `data/en-kmitl/` ไม่ถูกอ่านอัตโนมัติ — loader เฉพาะวิชา
(`lib/courses/it-kmitl.ts`, `en-kmitl.ts`) อ่านตามชื่อไฟล์ แล้ว `course-bindings.ts` ผูกเข้าโมดูล
ไฟล์ใหม่ที่นี่จึงต้องมีทั้ง loader และ binding

---

## 7. `lib/courses/catalog.ts` + `lib/courses/course-bindings.ts` — จุดลงทะเบียนรายวิชา

หน้าที่แยกกันชัดเจน:

| ไฟล์ | ตอบคำถาม |
|---|---|
| `lib/courses/catalog.ts` | **วิชานี้คือวิชาอะไร** — code, officialCode, slug, ชื่อ, หน่วยกิต, group |
| `lib/courses/spine.ts` | **หนึ่งวิชาประกอบด้วยอะไรบ้าง** — 11 โมดูล เหมือนกันทุกวิชา |
| `lib/courses/course-bindings.ts` | **วิชานี้เติมโมดูลไหนได้บ้าง** — ผูกโมดูลกับ loader / คลังข้อสอบ |
| `lib/courses/course-spine.ts` | รวม spine กับ bindings เป็นสิ่งที่หน้าเว็บ render (`resolveCourseSpine()` · server เท่านั้น) |

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
(`bun run readiness` นับช่องที่เติมจริงต่อวิชา)

รายละเอียดทั้งหมดอยู่ใน [docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md)

### `chapter` — ฟิลด์ที่เชื่อมสไลด์เข้ากับสัปดาห์

`SubjectAsset` และ `QuizQuestion` มี `chapter?: number` เหมือนกัน ทำให้ชั้นวาง
กรองตามสัปดาห์ได้ และข้อสอบชี้กลับไปสไลด์ที่มันมาจากได้

`scripts/build-library-manifest.mjs` อ่าน `chapter` **เฉพาะเมื่อชื่อไฟล์ระบุตรงๆ**
(`week08`, `ch3`, `lec02`, `unit4`) เลขลอยๆ เช่นปี พ.ศ. ถูกข้าม — chapter ที่ผิด
แย่กว่าไม่มี chapter

**`chapter` เป็น metadata ไม่ใช่ระดับโฟลเดอร์** ด้วยเหตุผลเดียวกับ `scope` ในข้อ 3

### ไวยากรณ์พิเศษในเนื้อหา Markdown

Markdown ของวิชา render ด้วย `react-markdown` + GFM + KaTeX (`$…$`, `$$…$$`) และใช้ได้เพิ่มอีกสี่อย่าง — สามอย่างแรกมาจากปลั๊กอิน
`remarkNotebook` ([`lib/docs/remark-notebook.ts`](./lib/docs/remark-notebook.ts)) ส่วน fence `youtube` จัดการใน `components/md-view.tsx`:

| เขียน | ได้ |
| --- | --- |
| `{==คำสำคัญ==}` | ไฮไลต์ (`<mark>`) |
| `{++คำสำคัญ++}` | ขีดเส้นใต้ (`<u>`) |
| `<sub>x</sub>` · `<sup>x</sup>` | ตัวห้อย / ตัวยก |
| ` ```youtube ` บรรทัดละ `videoId \| คำอธิบาย` | ตัวเล่นวิดีโอ |

ใช้วงเล็บปีกกาครอบ เพราะ `==` กับ `++` เปล่า ๆ ชนกับโค้ดที่เขียนในเนื้อหา (`C++`, `==`) · HTML ดิบอื่นถูกตัดทิ้ง
(ไม่ใช้ `rehype-raw`) จึงฝัง iframe เองไม่ได้ — ใช้ fence `youtube` เท่านั้น

---

## 7.5 `_dropzone/` — รับไฟล์ที่ยังไม่ได้จัดหมวด

วางไฟล์ดิบลง `_dropzone/` แล้วชี้ AI agent ไปที่
[`docs/DROPZONE_SOP.md`](./docs/DROPZONE_SOP.md) — agent จะอ่านเนื้อไฟล์
จัดวิชา/หมวด/ขอบเขตสอบ เปลี่ยนชื่อเป็น kebab-case บีบอัด ย้ายเข้า `public/assets/`
อัปเดตการ์ด รัน `library:build` + `library:audit` แล้วล้างโฟลเดอร์ให้
(`assets:sync` agent ต้องถามเจ้าของ repo ก่อนทุกครั้ง)

เนื้อหาใน `_dropzone/` ถูก gitignore (ยกเว้น `.gitkeep` กับ `README.md`)
ไฟล์ที่ agent จัดหมวดไม่ได้ หรือเป็นงานของคนอื่น/ข้อมูลส่วนบุคคลที่ยังไม่เคยแจกทั้งชั้น
จะถูกพักไว้ที่ `_dropzone/_hold/<วิชา>-<เหตุผล>/` พร้อมเหตุผล แทนที่จะเดา (กติกาใน §9.2)

---

## 8. เพิ่มวิชาใหม่ — checklist

1. `lib/courses/catalog.ts` → เพิ่ม entry ใน `COURSES` (identity เท่านั้น)
2. `lib/courses/course-bindings.ts` → เพิ่ม binding ของวิชา (**บังคับ** — วิชาที่มีใน catalog แต่ไม่มี binding
   ทำให้ `content:check` fail) เริ่มที่ `baseline(dir)` ก็ได้
3. `content/courses/<officialCode>-<slug>/summary.md` → เขียนตาม [มาตรฐานภาพรวมรายวิชา](./docs/COURSE_OVERVIEW_STANDARD.md)
   (แม่แบบใน `docs/templates/`) และ `blueprint.md` ข้างกัน
4. `scripts/build-library-manifest.mjs` → เพิ่ม `<subject>` ใน `SUBJECT_CODE` (ถ้าวิชามีไฟล์ในคลัง)
5. `public/assets/<ns>/<subject>/<category>/` → วางไฟล์ ตั้งชื่อ kebab-case
   (ใส่ `week08` / `ch3` ในชื่อไฟล์ ถ้าอยากให้ `chapter` ถูกอ่านอัตโนมัติ)
6. `bun run library:build` → สร้าง manifest + stats + ดัชนีใหม่
7. `lib/library/subject-library.ts` → เขียน entry มือให้ไฟล์เด่น ๆ พร้อม `scope` + `chapter`/`week`
   (ไฟล์ที่เหลือ manifest จัดการให้แล้ว) — วิชาใหม่ที่เขียนมือให้สร้าง array `<CODE>_ASSETS` แล้วลงทะเบียนใน `SUBJECT_ASSETS`
8. `bun run content:check` → สัญญาพิมพ์เขียวต้องผ่าน
9. `bun run readiness` → ดูว่าวิชาใหม่ได้กี่ /11
10. `bun run library:audit` → ไม่มี error ใหม่จากสิ่งที่เพิ่ม
11. `npx tsc --noEmit -p .` · `bun run lint` (ห้ามเพิ่ม error) · `bun run build` → ต้องผ่าน
12. ที่อื่นที่อาจต้องแตะ: `COURSE_COLORS` ใน `catalog.ts` (สีประจำวิชา ไม่บังคับ),
    `lib/courses/course-chapters.ts` (บท/สัปดาห์ของ quiz เมื่อวิชามีคลังข้อสอบ),
    ตารางรหัสวิชาใน `docs/DROPZONE_SOP.md` และ `content/courses/README.md`

**ไม่ต้องแตะ route ใดเลย** — `app/courses/[dir]/[module]/page.tsx` รองรับทุกวิชา
และทุกโมดูลอยู่แล้ว

---

## 9. สิทธิ์การเข้าถึง ลิขสิทธิ์ และข้อมูลส่วนบุคคล

ตรวจกับโค้ดเมื่อ 15 ต.ค. 2569 (`app/api/library/assets/route.ts`, `lib/library/subject-library.ts`,
`lib/library/library-exams.ts`, `lib/supabase/proxy-session.ts`) — สื่อการเรียนมาจากคลัง `kmitl-archive`
และ OnLearn ซึ่งมีสองเรื่องต้องระวังตลอด: **ลิขสิทธิ์** (สไลด์บรรยายและ workbook โดยเฉพาะ Edusoft ของ FE
เป็นของผู้สอน/ผู้จัดพิมพ์ บาง `summary.md` มีหมายเหตุ `ห้ามเผยแพร่สาธารณะ`) และ **ข้อมูลส่วนบุคคล**

### 9.1 อะไรเปิด อะไรปิด

| ส่วน | ใครเข้าถึงได้ | กลไก |
| --- | --- | --- |
| รายการสื่อบนหน้า `/courses/<dir>/library` (และตารางสัปดาห์ + ลิงก์วิดีโอ OnLearn ที่มากับมัน) | นักศึกษา IT ที่ล็อกอินแล้ว — `verifyKmitlIt()` (`lib/auth/verify.ts`): อีเมล `@kmitl.ac.th` รหัสนักศึกษา 8 หลัก หลักที่ 3–4 เป็น `07` | หน้า prerender เป็น static ไม่มีข้อมูลไฟล์ในหน้า รายการมาจาก `GET /api/library/assets?course=<CODE>` ซึ่งตอบ 401 ถ้าไม่มี session ที่ผ่านการยืนยัน (เฉพาะ production — ตอน dev ไม่บังคับล็อกอิน) |
| **ตัวไฟล์ทั่วไป** — ทุก `category` ยกเว้น `exam` | **ใครก็ได้ที่มี URL** | bucket **สาธารณะ** `ihelp-library` (URL แบบ `…/storage/v1/object/public/ihelp-library/<key>` — `assetUrl()`) path ของไฟล์อยู่ใน repo สาธารณะ (`library-manifest.json`, `subject-library.ts`) หน้าโมดูลอื่นที่มีตารางไฟล์ (เช่นหน้าสัปดาห์ของ ITF/ICS) แสดงการ์ดของไฟล์เดียวกันโดยไม่ต้องล็อกอิน — `proxy.ts` กันแค่ `/onboarding` `/upload` `/exams` |
| **ข้อสอบเก่า** — `isRestrictedAsset()`: `category === "exam"` หรือ path มี `/exams/` | insider / admin (`isInsider()` — role ใน `ihelp.users`) | bucket **ปิด** `ihelp-library-exams` · `libraryExamsForInsider()` เซ็น signed URL อายุ 10 นาทีหลังเช็คสิทธิ์ · ถูกกรองออกจาก `assetsForCourse()` ก่อน จึงไม่ติดไปกับ HTML ของหน้าที่ prerender |
| คลังข้อสอบ `/exams` (แถวใน `ihelp.exams`) | insider / admin | bucket ปิด `ihelp-exams` + `requireInsider()` — แยกจากคลังข้างบน |
| ไฟล์ที่ผู้ใช้แชร์ · รูปโปรไฟล์ | สาธารณะ | `ihelp-resources` · `ihelp-avatars` (การแชร์ปิดโดยค่าเริ่มต้น — `NEXT_PUBLIC_UPLOADS_ENABLED`) |

**สรุป: การล็อกอินซ่อนรายการบนหน้าคลัง ไม่ได้ทำให้ไฟล์เป็นส่วนตัว** — มีแค่ข้อสอบเก่าที่ปิดจริง
ก่อนเพิ่มไฟล์ ให้ถือว่าไฟล์ทุกชิ้นนอกจากข้อสอบเก่าเป็นสาธารณะ

กติกาที่ตามมา:

- การจัดประเภทดูจาก `category` **ไม่ใช่ path** อย่างเดียว — หน้าข้อสอบที่ถ่ายภาพเก็บใน `notes/` หรือ `pages/`
  ก็ยังเป็นข้อสอบ ต้องตั้ง `category: "exam"` ถ้าไม่แน่ใจว่าไฟล์ไหนเป็นข้อสอบ ให้ถือว่าเป็นแล้วรายงานไว้
- อะไรที่จำกัดสิทธิ์ต้องกันที่ฝั่ง server ตั้งแต่ต้นทาง ไม่ใช่ซ่อนด้วย UI — Client Component จึงห้าม import
  `subject-library.ts` และ `resource-index.json` (มีชื่อข้อสอบเก่าทั้งหมด)
- ชื่อและ path ของข้อสอบเก่ายังอยู่ใน repo สาธารณะ (`library-manifest.json`, `subject-library.ts`) แม้ตัวไฟล์ปิด

### 9.2 กติกาก่อนเพิ่มไฟล์

| กลุ่ม | ตัวอย่าง | ทำอย่างไร |
| --- | --- | --- |
| **เพิ่มได้ ไม่ต้องพัก** | เอกสารที่ผู้สอน/TA แจกทั้งชั้นเรียนบน OnLearn (สไลด์ ใบงานแล็บ) แม้ภาพหน้าจอมีชื่อหรือรหัสของ TA หรือนักศึกษาตัวอย่าง (กติกาของเจ้าของ repo 15 ต.ค. 2569) | จัดเข้าคลังตามปกติ |
| **ต้องเช็คเนื้อไฟล์ก่อน** | ไฟล์ลงท้าย `-completed` (ใบงานที่ทำแล้ว มีชื่อ/รหัสผู้ทำอยู่ในเนื้อไฟล์) · งานกลุ่ม (`*group*`) ที่อาจมีชื่อเพื่อนร่วมกลุ่ม | เพิ่มได้เฉพาะงานของเจ้าของ repo/ผู้ส่งเองที่ไม่มีชื่อหรือรหัสคนอื่น ไม่แน่ใจ → พักที่ `_dropzone/_hold/` แล้วถาม |
| **ห้ามเพิ่ม — พักไว้แล้วรายงาน** | งานของนักศึกษาคนอื่น (ใบงานที่ส่งแล้ว งานกลุ่มที่มีชื่อ/รหัสเพื่อน) · ข้อมูลส่วนบุคคลที่ไม่เคยถูกแจกให้ทั้งชั้นเรียน | `_dropzone/_hold/<วิชา>-<เหตุผล>/` |
| **ห้ามเพิ่ม — ข้ามแล้วรายงาน** | ไฟล์ที่ตรวจให้คะแนนแล้ว (เช่น Cisco Packet Tracer `.pka`) · หน้าเว็บที่บันทึกจากบัญชีส่วนตัว (เช่น SecSpace) | ไม่ต้องพัก |

เนื้อหา Markdown ของวิชา (`summary.md` ฯลฯ) ห้ามระบุชื่อหรือรหัสนักศึกษาคนอื่น · ไฟล์ที่เคยถอดออกจากคลังเพราะมีข้อมูลส่วนบุคคล
ถูกพักที่ `_quarantine/` (gitignored) — ห้ามนำกลับเข้า `public/assets/`

### 9.3 ถ้าเผลอเพิ่มของที่ไม่ควรเพิ่ม

1. ลบไฟล์ออกจาก `public/assets/` และการ์ดออกจาก `subject-library.ts` แล้วรัน `bun run library:build`
2. `assets:sync` **ไม่ลบ object ใน bucket** — แจ้งเจ้าของ repo ให้ลบ object (การลบ Storage object ต้องได้รับอนุมัติเสมอ)
   `bun run library:audit -- --remote` จะรายงานว่า `stale-object`
3. ชื่อไฟล์ที่เคย commit ใน `library-manifest.json` ยังอยู่ใน git history — แจ้งเจ้าของ repo ตัดสินใจ

### 9.4 เรื่องที่ยังเปิดอยู่ — เจ้าของ repo ต้องตัดสินใจ

- **ลิขสิทธิ์ที่ขัดกับ bucket สาธารณะ** — `summary.md` ของ Foundation English ให้เก็บ workbook ของ Edusoft ไว้หลังระบบล็อกอินเท่านั้น
  และของ IT-Fundamentals ระบุว่าสไลด์บรรยายห้ามเผยแพร่สาธารณะ แต่ตอนนี้ล็อกอินกั้นแค่รายการบนหน้าคลัง ตัวไฟล์อยู่ใน
  bucket สาธารณะ (§9.1) ถ้าจะให้ตรงตามที่ `summary.md` ระบุ ต้องย้ายไฟล์กลุ่มนี้ไป bucket แบบปิด หรือแก้หมายเหตุใน `summary.md`

หมายเหตุ: ตัวเลขปัจจุบันของแต่ละกลุ่มไม่จดในเอกสาร (เก่าเร็ว) — ดูจากดัชนี เช่น
`jq '[.assets[] | select(.access == "insider")] | length' lib/library/resource-index.json` (นับข้อสอบเก่า)
