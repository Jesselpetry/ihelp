# ร่วมพัฒนา \<i\>Help

โปรเจกต์นี้เป็น open source ([MIT](./LICENSE)) — ยินดีรับทุก contribution
จากนักศึกษา ไม่ว่าจะเพิ่มวิชาใหม่ เขียนสรุป อัปโหลดสื่อการเรียน อัปเดตรายการโจทย์
แก้บั๊ก หรือเพิ่มฟีเจอร์ใหม่

ก่อนแตะโครงสร้างไฟล์ อ่าน **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** ก่อน —
มีกติกา path การตั้งชื่อ และ taxonomy กลางภาค/ปลายภาค อธิบายไว้ครบ

## เริ่มต้น

```bash
# 1. Fork repo นี้บน GitHub แล้ว clone ของตัวเอง
git clone https://github.com/Jesselpetry/ihelp.git
cd ihelp

# 2. ติดตั้งและรัน
bun install
bun run dev   # http://localhost:3000
```

ข้อควรระวัง: ใช้ `bun run dev` เท่านั้น ห้าม `bun --bun next ...`
(Next 16 build crash บน Bun 1.2.x)

## 1) เพิ่มรายวิชาใหม่

รายวิชา “มีอยู่จริง” ก็ต่อเมื่ออยู่ใน `COURSES` ใน **`lib/catalog.ts`** —
ทุกอย่างอื่นอ้างอิงจากที่นี่

```ts
{
  code: "PSCP",                  // รหัสสั้น ใช้เป็น key ทุกที่ (ต้องไม่ซ้ำ)
  officialCode: "06066303",      // รหัสวิชาทางการ
  slug: "Problem-Solving-and-Computer-Programming",
  nameTh: "การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
  nameEn: "Problem Solving and Computer Programming",
  credits: "3 (2-2-5)",
  group: "Y1-S1",                // Y1-S1 | Y1-S2 | EN-KMITL
  tracks: { /* ใส่ทีหลัง ตอนที่ track นั้นเสร็จจริง */ },
}
```

**`tracks` ใส่เฉพาะ track ที่ render ได้จริงแล้ว** — ที่ไม่ได้ใส่จะโชว์เป็นช่องล็อก
ให้นักศึกษาเห็น roadmap ทั้งหมด ถ้าใส่ทั้งที่ยังไม่เสร็จ จะได้หน้า 404

## 2) เขียนสรุปรายวิชา (`summary.md`)

หนึ่งไฟล์ต่อหนึ่งวิชา ที่
`content/courses/<officialCode>-<slug>/summary.md` — ชื่อโฟลเดอร์ต้องตรงกับ
`officialCode` และ `slug` ใน `lib/catalog.ts` เป๊ะ ๆ เพราะ
`lib/course-content.ts` ประกอบ path ตรง ๆ

ต้องมี frontmatter และโครง **6 หัวข้อ** ครบ (ดูตัวอย่างเต็มใน
[FILE_STRUCTURE.md §5](./FILE_STRUCTURE.md)):

1. **ภาพรวมรายวิชา** — รหัส ชื่อ หน่วยกิต วิชาบังคับก่อน ผู้สอน สัดส่วนคะแนน
2. **ขอบเขตเนื้อหา** — ตารางรายสัปดาห์ **แยกกลางภาค / ปลายภาค**
3. **สรุปเนื้อหารายหัวข้อ** — มโนทัศน์ ศัพท์ สูตร ตารางเปรียบเทียบ
4. **พิมพ์เขียวสำหรับสร้างสื่อต่อยอด**
5. **แหล่งข้อมูลในคลัง** — ไฟล์ที่มีจริง พร้อมหมายเหตุว่าถอดข้อความได้ไหม

กติกาการเขียน:

- หัวข้อ 2 คือ **แหล่งความจริงของเส้นแบ่งกลางภาค/ปลายภาค** ของวิชานั้น
  ระบบไม่เดาเอง — เขียนผิดตรงนี้ การ์ดในคลังทรัพยากรจะจัดกลุ่มผิดตาม
- จุดที่อนุมานเอาจากชื่อไฟล์หรือลายมือ **ต้องกำกับว่า _ยังไม่ยืนยัน_ เสมอ**
  อย่าตัดคำเตือนพวกนี้ออก
- ห้ามใส่ชื่อ-นามสกุลหรือรหัสนักศึกษาของคนอื่นลงในสรุป

## 3) เพิ่มสื่อการเรียน (PDF / สไลด์ / ภาพสแกน)

> **ทางลัด:** มีไฟล์กองใหญ่ที่ยังไม่ได้จัดหมวด — วางลง `_dropzone/` แล้วให้ AI agent
> ทำตาม [`docs/DROPZONE_SOP.md`](./docs/DROPZONE_SOP.md) จัดให้ทั้งชุด
> หัวข้อนี้คือขั้นตอนแบบทำมือ

วางไฟล์ตาม path บังคับ 4 ระดับ:

```
public/assets/<namespace>/<subject>/<category>/<filename>
```

- `<namespace>` = `it-kmitl` หรือ `en-kmitl`
- `<subject>` = รหัสสั้นตัวพิมพ์เล็ก ตรงกับ `code` ใน `lib/catalog.ts`
- `<category>` = `lectures` `sheets` `exams` `exercises` `labs` `notes`
  `references` … (ตารางเต็มใน FILE_STRUCTURE.md §2.1)
- `<filename>` = **kebab-case ล้วน** ห้ามช่องว่าง ห้าม `_` ห้ามตัวพิมพ์ใหญ่

```
✅ itf-lec-week08-database.pdf
❌ ITF_Lec_Week08-Database.pdf
❌ Ch1 Atomic structure.pdf
```

> **`public/assets/` ถูก gitignore** — วางไฟล์ไว้ในเครื่องเพื่อให้ `library:build`
> scan ได้ แต่ตัวไฟล์เสิร์ฟจาก Supabase Storage ต้องรัน `bun run assets:sync`
> ด้วย ไม่งั้นไฟล์จะเปิดได้ในเครื่องแต่ 404 บน production
>
> **ข้อสอบเก่าจำกัดสิทธิ์:** ไฟล์ที่ `category` เป็น `exam` (หรืออยู่ในโฟลเดอร์
> `exams/`) จะถูก `assets:sync` อัปโหลดเข้า bucket แบบปิดโดยอัตโนมัติ และเสิร์ฟ
> ผ่าน signed URL ให้เฉพาะ insider เท่านั้น — ไม่ต้องตั้งค่าเพิ่ม แต่ต้อง
> **ใส่ `category` ให้ถูก** เพราะการจัดประเภทดูจาก `category` ไม่ใช่ path

จากนั้น:

```bash
bun run library:build   # สร้าง manifest + stats ใหม่ — ต้องรันทุกครั้ง
```

ไฟล์จะขึ้นเว็บทันทีโดยยังไม่ต้องเขียน entry มือ ถ้าอยากให้การ์ดมีชื่อสองภาษา
คำอธิบาย และ **ขอบเขตสอบ** ให้เพิ่ม entry ใน `lib/subject-library.ts`:

```ts
{
  id: "itf-lec-week08",
  title: { th: "สัปดาห์ 8 — ฐานข้อมูล", en: "Week 8 — Databases" },
  description: { th: "...", en: "..." },
  tags: ["Week 08", "Database"],
  category: "lecture",
  scope: "final",          // ดูจาก summary.md ของวิชา ห้ามเดาจากเลขสัปดาห์
  fileType: "pdf",
  url: "/assets/it-kmitl/itf/lectures/itf-lec-week08-database.pdf",
  fileName: "itf-lec-week08-database.pdf",
}
```

entry ที่เขียนมือชนะ manifest เสมอเมื่อ `url` ตรงกัน

**เรื่องที่ต้องเช็คก่อนอัปโหลด:**

- **ลิขสิทธิ์** — สไลด์บรรยายและ workbook เป็นของผู้สอน/ผู้จัดพิมพ์
  ถ้า `summary.md` ของวิชานั้นมีหมายเหตุ `ห้ามเผยแพร่สาธารณะ` อย่าเพิ่งอัปโหลด
- **ข้อมูลส่วนบุคคล** — ห้ามอัปโหลดไฟล์ที่มีชื่อหรือรหัสนักศึกษาของคนอื่น
  ใบงานที่ทำแล้ว (`-completed`) และงานกลุ่มต้องเช็คในเนื้อไฟล์ก่อนเสมอ
- **ขนาด** — ไฟล์เกิน 20 MB ให้บีบก่อน; GitHub ปฏิเสธไฟล์เกิน 100 MB ทันที
- **ห้ามแก้มือ** `lib/library-manifest.json` และ `lib/library-stats.json`
  ทั้งสองไฟล์ generate ขึ้นมา — แก้ที่ต้นทางแล้วรัน `bun run library:build`

## 4) อัปเดตรายการโจทย์ (มีโจทย์สัปดาห์ใหม่)

รายการโจทย์ทั้งหมดอยู่ในไฟล์เดียว: **`data/oj_problems.json`**
(export มาจาก iJudge — เว็บนี้ไม่ fetch สดเพราะ iJudge ไม่มี public API)

แต่ละโจทย์เป็น object หน้าตาแบบนี้:

```json
{
  "id": 2981,
  "name": "สวัสดี: ชื่อ",
  "difficulty": 0,
  "expire_date": "31 July 2026, 00:00",
  "is_learning_log": false,
  "url": "https://ijudge.it.kmitl.ac.th/problems/2981/description?problemPage=0"
}
```

สิ่งที่ต้องรู้:

- แอปใช้แค่ field ข้างบนนี้ — field ต่อคน (`status`, `passed_count`,
  `percentage`, ฯลฯ) ติดมาได้แต่จะถูก ignore
- `expire_date` ต้องเป็นรูปแบบ `"31 July 2026, 00:00"` (เดือนภาษาอังกฤษ)
  เพราะระบบใช้คำนวณ **Week**: วันหมดเขตที่เร็วสุด = Week 1, วันถัดไป = Week 2, ...
- `is_learning_log: true` = โจทย์ที่ต้องทำ submission.md (จะมีป้าย Learning Log
  และปุ่มสร้างไฟล์)

ขั้นตอน: แก้/แทนที่ `data/oj_problems.json` → รัน `bun run dev`
เช็คหน้าแรกว่าโจทย์ + week + ป้ายถูกต้อง → เปิด PR

ลิงก์ประจำสัปดาห์ (ฟอร์มเช็คชื่อ, รายชื่อคู่ pair) แก้ที่ **`lib/shortcuts.ts`**
และเอกสารในห้องสมุด (`/library`) อยู่ที่ **`data/ai-guidelines/`**

## 5) ปรับปรุงระบบ (แก้บั๊ก / เพิ่มฟีเจอร์)

โครงสร้างหลัก:

| ที่           | คืออะไร                                                       |
| ------------- | ------------------------------------------------------------- |
| `app/`        | หน้าเว็บ (App Router) + API routes สร้างไฟล์ md               |
| `components/` | React components (`components/ui/` = shadcn-style primitives) |
| `lib/`        | logic: โหลดโจทย์, สร้าง markdown, ประวัติ, i18n, ฯลฯ          |
| `data/`       | ข้อมูลรายวิชา: โจทย์, template ทางการ, เอกสาร AI guidelines   |
| `content/`    | Markdown ของรายวิชา (`content/courses/<code>-<slug>/`)        |
| `public/assets/` | ไฟล์จริง (gitignore ไว้ — เสิร์ฟจาก Supabase Storage)      |
| `scripts/`    | ตัวสร้าง manifest / stats (รันมือ ไม่ได้รันตอน build)          |

ธรรมเนียมของโค้ดเบสนี้:

- TypeScript + Tailwind ทั้งหมด ตามสไตล์ไฟล์ข้างเคียง
- ข้อความ UI ทุกชิ้นต้องมีสองภาษา ผ่าน pattern `LText` (`{ th, en }`)
  แล้วเรียก `t(L.key, locale)` — ห้าม hardcode ภาษาเดียว
- ข้อมูลผู้ใช้ (แบบร่าง, ประวัติ) เก็บใน localStorage เท่านั้น
  ห้ามส่งขึ้น server
- **Client Component ห้าม import จาก `lib/subject-library.ts`** — ไฟล์นั้น import
  `library-manifest.json` + `library-stats.json` ที่ระดับ module ถ้า client ดึงอะไร
  จากมันไป ชื่อไฟล์และ metadata ของสื่อทุกชิ้น (รวมข้อสอบเก่า) จะติดไปใน bundle
  ฝั่ง browser ด้วย ให้ import จาก `lib/subject-library-ui.ts` แทน
- อะไรที่จำกัดสิทธิ์ ต้องกันตั้งแต่ฝั่ง server — อย่าซ่อนด้วย CSS หรือ overlay
  เพราะข้อมูลยังอยู่ใน payload
- หลักการสำคัญ: เว็บนี้ **ไม่เขียนเนื้อหาแทนนักศึกษา** —
  ฟีเจอร์ใหม่ต้องไม่ generate คำตอบ ไม่ solve โจทย์ และไม่ส่งอะไรไป OJ

ก่อนเปิด PR:

```bash
bun run library:build   # ถ้าแตะไฟล์ใน public/assets/
bun run assets:sync     # อัปโหลดไฟล์ใหม่ขึ้น Storage (แยก bucket ให้เอง)
bun run lint            # ต้องผ่าน ไม่มี error
bun run build           # ต้อง build ผ่าน
```

## 6) อัปเดต Changelog / Version History

ทุกครั้งที่ PR มีผลต่อผู้ใช้ (ฟีเจอร์ใหม่, แก้บั๊ก, เปลี่ยนพฤติกรรม) ให้แก้ **`CHANGELOG.md`** ด้วย:

1. เพิ่มรายการใต้หัวข้อ `## [Unreleased]` แบ่งตามหมวด `Added` / `Changed` / `Fixed`
   (ตามรูปแบบ [Keep a Changelog](https://keepachangelog.com/en/1.1.0/))
2. เขียนสั้น ๆ ว่าเปลี่ยนอะไร ผู้ใช้เห็นผลยังไง — ไม่ต้อง detail ระดับโค้ด
3. ไม่ต้องตั้งเลขเวอร์ชันเอง — คนดูแล repo จะเป็นคนตัดสินใจตอน release ว่ารอบนี้เป็น
   `MAJOR` (breaking change) / `MINOR` (ฟีเจอร์ใหม่) / `PATCH` (แก้บั๊ก/ปรับเล็กน้อย)
   ตาม [Semantic Versioning](https://semver.org/lang/th/) แล้วย้าย `[Unreleased]`
   ไปเป็นหัวข้อเวอร์ชันใหม่พร้อมวันที่

ตอน release แต่ละเวอร์ชันจะมีบรรทัด **ผู้ร่วมพัฒนา** ระบุชื่อ + GitHub handle ของทุกคน
ที่มี commit ในเวอร์ชันนั้น (ดูตัวอย่างได้ใน `CHANGELOG.md`) — ถ้า PR ของคุณถูก merge
เข้าเวอร์ชันไหน ชื่อคุณจะไปโผล่ในเวอร์ชันนั้น

## เปิด Pull Request

1. สร้าง branch จาก `main` เช่น `fix/week-badge` หรือ `data/week-3-problems`
2. Commit สั้น ๆ ตรงประเด็น (เช่น `data: add week 3 problems`)
3. เปิด PR อธิบายว่าแก้อะไร ทำไม พร้อม screenshot ถ้าเป็นเรื่อง UI
4. แก้ `CHANGELOG.md` ตามข้อ 6) ด้านบนไว้ในรอบ PR เดียวกัน
5. เจอบั๊กแต่ยังไม่มีเวลาแก้ — เปิด GitHub Issue ไว้ก็ช่วยมากแล้ว

ขอบคุณที่ช่วยกันทำให้เครื่องมือนี้ดีขึ้น 🙌
