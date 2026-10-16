# ร่วมพัฒนา \<i\>Help

โปรเจกต์นี้เป็น open source ([MIT](./LICENSE)) — ยินดีรับทุก contribution
จากนักศึกษา ไม่ว่าจะเพิ่มวิชาใหม่ เขียนสรุป อัปโหลดสื่อการเรียน อัปเดตรายการโจทย์
แก้บั๊ก หรือเพิ่มฟีเจอร์ใหม่

> **AI agent:** เริ่มที่ [AGENTS.md](./AGENTS.md) — กฎที่พลาดง่ายและตาราง "แก้ที่ไหน"
> ไฟล์นี้คือขั้นตอนทีละงานที่ทั้งคนและ agent ใช้ร่วมกัน

ก่อนแตะโครงสร้างไฟล์ อ่าน **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** ก่อน —
มีตาราง "ถ้าจะแก้ X แก้ที่ไหน" กติกา path การตั้งชื่อ และ taxonomy กลางภาค/ปลายภาค อธิบายไว้ครบ

| อยากทำอะไร | ไปที่ |
| --- | --- |
| เพิ่มรายวิชา | ข้อ 1) |
| เขียน/แก้ภาพรวมรายวิชา (`summary.md`) หรือหน้ารายสัปดาห์ | ข้อ 2) |
| เพิ่มไฟล์สื่อการเรียน (PDF สไลด์ ภาพสแกน) | ข้อ 3) |
| อัปเดตโจทย์ PSCP | ข้อ 4) |
| แก้บั๊ก / เพิ่มฟีเจอร์ | ข้อ 5) |
| บันทึก CHANGELOG และเปิด PR | ข้อ 6) และหัวข้อ "เปิด Pull Request" |

## เริ่มต้น

```bash
# 1. Fork repo นี้บน GitHub แล้ว clone ของตัวเอง
git clone https://github.com/<ชื่อ GitHub ของคุณ>/ihelp.git
cd ihelp

# 2. ติดตั้ง ตั้งค่า และรัน
bun install
cp .env.example .env.local   # กรอกค่าที่ต้องใช้ — ตารางใน README.md หัวข้อ "วิธีรัน"
bun run dev                  # http://localhost:3000
```

ข้อควรระวัง: ใช้ `bun run dev` เท่านั้น ห้าม `bun --bun next ...`
(Next 16 build crash บน Bun 1.2.x) · ต้องใช้ Node ≥ 20.9 · `.env*` ถูก gitignore
(ยกเว้น `.env.example`) — อย่า commit key หรือ connection string ไม่ว่ากรณีใด

## 1) เพิ่มรายวิชาใหม่

รายวิชา “มีอยู่จริง” ก็ต่อเมื่ออยู่ใน `COURSES` ใน **`lib/courses/catalog.ts`** —
ทุกอย่างอื่นอ้างอิงจากที่นี่ แต่ catalog บอกแค่ว่า **วิชานี้คือวิชาอะไร** ส่วนว่าวิชานั้น
มีอะไรให้เรียนบ้างอยู่ใน **`lib/courses/course-bindings.ts`**

```ts
// lib/courses/catalog.ts — identity เท่านั้น
{
  code: "PSCP",                  // รหัสสั้น ใช้เป็น key ทุกที่ (ต้องไม่ซ้ำ)
  officialCode: "06066303",      // รหัสวิชาทางการ (ไม่บังคับ — CHEM ไม่มี)
  slug: "Problem-Solving-and-Computer-Programming",
  nameTh: "การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
  nameEn: "Problem Solving and Computer Programming",
  credits: "3 (2-2-5)",
  group: "Y1-S1",                // Y1-S1 | Y1-S2 | EN-KMITL
  portalHref: "/courses/06066303-Problem-Solving-and-Computer-Programming", // ไม่บังคับ
  officialUrl: "https://www.it.kmitl.ac.th/th/subjects/…",                  // ไม่บังคับ
}

// lib/courses/course-bindings.ts — เริ่มจาก baseline ได้ (ภาพรวมรายวิชา + คลังทรัพยากร)
BFIT: baseline("06066101-Business-for-IT"),
```

- **ต้องมี binding เสมอ** — วิชาที่อยู่ใน catalog แต่ไม่มีใน `COURSE_BINDINGS` ทำให้
  `bun run content:check` (และ `build`) fail
- **ผูกเฉพาะโมดูลที่มีเนื้อหาจริงแล้ว** — โมดูลที่ไม่ได้ผูกโชว์เป็นช่อง "เร็วๆ นี้" ให้นักศึกษาเห็น
  roadmap ทั้งหมด ถ้าผูกทั้งที่ยังไม่มีไฟล์หรือคลังข้อสอบ ช่องจะยังเป็น "เร็วๆ นี้" และเปิด URL ตรง ๆ
  ได้ 404 (`bun run readiness` นับเฉพาะช่องที่เติมจริง)
- วิชาที่จะมีไฟล์ในคลัง: เพิ่มชื่อโฟลเดอร์ `<subject>` ใน `SUBJECT_CODE` ของ
  `scripts/build-library-manifest.mjs` ด้วย ไม่งั้นสคริปต์ข้ามไฟล์ (นับเป็น unmapped)
- สีประจำวิชา (`COURSE_COLORS`) ไม่บังคับ ค่าเริ่มต้นคือ `#2357A5`
- เช็คลิสต์ครบทุกขั้นอยู่ใน [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) §8

## 2) เขียนสรุปรายวิชา (`summary.md`)

หนึ่งไฟล์ต่อหนึ่งวิชา ที่
`content/courses/<officialCode>-<slug>/summary.md` — ชื่อโฟลเดอร์ต้องตรงกับ
`officialCode` และ `slug` ใน `lib/courses/catalog.ts` เป๊ะ ๆ เพราะ
`lib/courses/course-content.ts` ประกอบ path ตรง ๆ (วิชาที่ไม่มี `officialCode`
ใช้ `slug` ล้วน เช่น `General-Chemistry`)

ต้องเป็นไปตาม [มาตรฐานภาพรวมรายวิชา](./docs/COURSE_OVERVIEW_STANDARD.md) —
เริ่มจากแม่แบบ [`docs/templates/course-summary.md`](./docs/templates/course-summary.md)
frontmatter ครบ (คีย์และลำดับตายตัว) หัวเรื่อง `# <CODE> — …` บรรทัด **อัปเดตล่าสุด**
และหก `##` ตามนี้พอดี:

1. **ข้อมูลรายวิชา** — ตารางข้อมูลพื้นฐาน คำอธิบาย สัดส่วนคะแนน วันสำคัญ
2. **ขอบเขตเนื้อหา** — ตารางรายสัปดาห์ **แยกกลางภาค / ปลายภาค**
3. **สรุปเนื้อหารายหัวข้อ** — หนึ่ง `###` ต่อสัปดาห์/บท
4. **สิ่งที่ต้องจำ** — สูตร ตัวเลข ตารางเปรียบเทียบ
5. **การประเมินและเตรียมสอบ** — รูปแบบการประเมิน หัวข้อที่ออกบ่อย จุดที่มักพลาด
6. **แหล่งเรียนรู้** — ลิงก์ในเว็บและช่องทางทางการ

`bun run content:check` ตรวจโครงนี้ให้ (กฎ `overview-*`) และไม่ให้มี path ของ repo ในรูป code
(ขึ้นต้น `public/` `data/` `content/` `lib/` หรือ `scripts/`) หรือคำว่า `kmitl-archive` ในไฟล์นี้ —
สิ่งเหล่านั้นไปไว้ใน `blueprint.md` แก้เนื้อหาแล้วอย่าลืมปรับ `updated:` ใน frontmatter
กับบรรทัด **อัปเดตล่าสุด** พร้อมกัน

สเปกคลังข้อสอบ แบบฝึกที่จะสร้าง และรายการไฟล์พร้อม path ใส่ใน `blueprint.md`
ข้างกัน ([แม่แบบ](./docs/templates/course-blueprint.md)) ไม่ใช่ใน `summary.md`

หน้ารายสัปดาห์ (โมดูล `map`) เขียนเป็น `archive/weekNN.md` ตามโครงใน
[FILE_STRUCTURE.md](./FILE_STRUCTURE.md#หน้ารายสัปดาห์-archiveweeknnmd) —
ITF (สัปดาห์ 1–15) และ ICS (คาบ 1–7 ของครึ่งหลัง) เป็นตัวอย่าง `archive/week13.md` ของ ITF
ครบที่สุด ตารางไฟล์ในหน้าจับคู่กับการ์ดในคลังด้วย `fileName` — เพิ่มไฟล์ใหม่แล้วต้องใส่ชื่อไฟล์
ลงตารางด้วย และรัน `bun run library:audit` เพื่อเช็คว่าไม่มีการ์ดที่ชี้ไปหาไฟล์ที่ไม่มีอยู่

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
- `<subject>` = รหัสสั้นตัวพิมพ์เล็ก ตรงกับ `code` ใน `lib/courses/catalog.ts` (และอยู่ใน `SUBJECT_CODE` — ดูข้อ 1)
- `<category>` = `lectures` `sheets` `exams` `exercises` `labs` `notes`
  `references` … (ตารางเต็มใน FILE_STRUCTURE.md §2.1)
- `<filename>` = **kebab-case ล้วน** ห้ามช่องว่าง ห้าม `_` ห้ามตัวพิมพ์ใหญ่

```
✅ itf-lec-week08-database.pdf
❌ ITF_Lec_Week08-Database.pdf
❌ Ch1 Atomic structure.pdf
```

> **`public/assets/` ถูก gitignore** — ไฟล์ไม่ไปกับ commit/PR วางไว้ในเครื่องเพื่อให้
> `library:build` scan ได้ แต่ตัวไฟล์เสิร์ฟจาก Supabase Storage ต้องรัน `bun run assets:sync`
> ด้วย ไม่งั้นไฟล์จะเปิดได้ในเครื่องแต่ 404 บน production — `assets:sync` ต้องใช้
> `SUPABASE_SERVICE_ROLE_KEY` ของเจ้าของ repo ผู้ร่วมพัฒนาที่ไม่มี key ให้ส่ง PR ที่มี JSON ที่
> regenerate แล้ว ระบุใน PR ว่าไฟล์ไหนรออัปโหลด และส่งไฟล์ให้เจ้าของ repo
>
> **ไฟล์ทุกชิ้นนอกจากข้อสอบเก่าเป็นสาธารณะ** — อยู่ใน bucket สาธารณะ และ path อยู่ใน repo
> สาธารณะ การล็อกอินซ่อนแค่รายการบนหน้าคลัง ส่วน **ข้อสอบเก่า** (`category: "exam"` หรือ path ที่มี
> `exams/`) `assets:sync` อัปโหลดเข้า bucket แบบปิดโดยอัตโนมัติและเสิร์ฟผ่าน signed URL ให้เฉพาะ
> insider — ไม่ต้องตั้งค่าเพิ่ม แต่ต้อง **ใส่ `category` ให้ถูก** เพราะการจัดประเภทดูจาก
> `category` ไม่ใช่ path

จากนั้น:

```bash
bun run library:build   # manifest + stats + resource-index — ต้องรันทุกครั้ง
bun run library:audit   # แก้ error ที่คุณทำให้เกิด (ไฟล์หาย id/url ซ้ำ การ์ดอยู่ผิดวิชา การ์ดในเอกสารที่ไม่มีไฟล์) · warning อ่านแล้วตัดสินใจ
bun run assets:sync     # เจ้าของ repo — อัปโหลดเฉพาะไฟล์ที่ bucket ยังไม่มี (แยก bucket ให้เอง)
```

commit ไฟล์ที่ถูก regenerate (`library-manifest.json`, `library-stats.json`, `resource-index.json`)
ไปกับ PR — ตอน dev หน้า `/courses/<วิชา>/library` ไม่บังคับล็อกอิน ดูผลได้เลย

ไฟล์จะขึ้นเว็บทันทีโดยยังไม่ต้องเขียน entry มือ ถ้าอยากให้การ์ดมีชื่อสองภาษา
คำอธิบาย **ขอบเขตสอบ** และสัปดาห์ ให้เพิ่ม entry ใน `lib/library/subject-library.ts`
(array ของวิชานั้น เช่น `ITF_ASSETS`):

```ts
{
  id: "itf-lec-week08-database-2569",
  title: { th: "Lecture 08 — Database", en: "Lecture 08 — Database" },
  description: { th: "…เขียนจากเนื้อไฟล์จริง…", en: "…" },  // ไม่ต้องใส่จำนวนหน้า/ขนาดไฟล์
  tags: ["Week 08", "Database"],
  category: "lecture",
  scope: "final",          // ดูจาก summary.md ของวิชา ห้ามเดาจากเลขสัปดาห์
  chapter: 8,              // หรือ week — ใส่เมื่อไฟล์ยืนยันเองเท่านั้น
  edition: "2569",
  isCurrentYear: true,
  fileType: "pdf",
  url: "/assets/it-kmitl/itf/lectures/itf-lec-week08-database-2569.pdf",
  fileName: "itf-lec-week08-database-2569.pdf",
  sourceUrl: "https://onlearn.it.kmitl.ac.th/mod/resource/view.php?id=…", // เฉพาะไฟล์ที่มาจาก OnLearn
}
```

entry ที่เขียนมือชนะ manifest เสมอเมื่อ `url` ตรงกัน · จำนวนหน้ากับขนาดไฟล์มาจาก
`library-stats.json` เอง อย่าเขียนลงในคำอธิบาย · field ทั้งหมดของ `SubjectAsset`
(`week`, `status`, `isDuplicate`, `groupId` …) อธิบายใน FILE_STRUCTURE.md §4

**เรื่องที่ต้องเช็คก่อนอัปโหลด:**

- **ลิขสิทธิ์** — สไลด์บรรยายและ workbook เป็นของผู้สอน/ผู้จัดพิมพ์
  ถ้า `summary.md` ของวิชานั้นมีหมายเหตุ `ห้ามเผยแพร่สาธารณะ` ให้ถามเจ้าของ repo ก่อนเพิ่ม
- **ข้อมูลส่วนบุคคล** (กติกาของเจ้าของ repo ณ 15 ต.ค. 2569):

  | เพิ่มได้ | ห้ามเพิ่ม |
  | --- | --- |
  | เอกสารที่ผู้สอนหรือ TA แจกให้ทั้งชั้นเรียนบน OnLearn (ใบงานแล็บ สไลด์) แม้ภาพหน้าจอในนั้นจะมีชื่อหรือรหัสของ TA หรือนักศึกษาตัวอย่าง — ไม่ต้องชะลอหรือพักไว้ | งานของนักศึกษาคนอื่น (ใบงานที่ส่งแล้ว งานกลุ่มที่มีชื่อ/รหัสเพื่อน) · ข้อมูลส่วนบุคคลที่ไม่เคยถูกแจกให้ทั้งชั้นเรียน · ไฟล์ที่ตรวจให้คะแนนแล้ว (เช่น Cisco Packet Tracer `.pka`) · หน้าเว็บที่บันทึกจากบัญชีส่วนตัว (เช่น SecSpace) |

  ใบงานที่ทำแล้ว (`-completed`) มีชื่อ/รหัสผู้ทำอยู่ในเนื้อไฟล์ ใช้ได้เฉพาะงานของคุณเอง ส่วนงานกลุ่ม
  อาจมีชื่อเพื่อนร่วมกลุ่ม — ต้องเปิดเช็คเนื้อไฟล์ก่อนเสมอ ไม่แน่ใจให้ไม่อัปโหลดและถามเจ้าของ repo
- **ขนาด** — ไฟล์เกิน 20 MB ให้บีบก่อน (ขั้นตอนและเกณฑ์ตรวจว่าหน้าไม่หาย ภาพไม่เสีย อยู่ใน
  `docs/DROPZONE_SOP.md` Phase 3.5 — ห้ามบีบซ้ำ) แล้วถามเจ้าของ repo ก่อนเพิ่ม
- **ห้ามแก้มือ** `lib/library/library-manifest.json`, `lib/library/library-stats.json` และ
  `lib/library/resource-index.json` — ทั้งสามไฟล์ generate ขึ้นมา แก้ที่ต้นทางแล้วรัน
  `bun run library:build`
- **ลบหรือเปลี่ยนชื่อไฟล์ทีหลัง** — `assets:sync` มีแต่อัปโหลด ไม่ลบ object เดิมใน bucket
  (`library:audit -- --remote` จะเตือน `stale-object`) ให้เจ้าของ repo เป็นคนลบ Storage object

## 4) อัปเดตรายการโจทย์ (มีโจทย์สัปดาห์ใหม่)

ข้อมูลโจทย์ PSCP **ไม่ได้แก้มือใน repo นี้** — ต้นทางคือ branch `OP` ของ repo archive
(`pscp-69070027`) ซึ่งเก็บรายการโจทย์ที่ export จาก iJudge (เว็บนี้ไม่ fetch สดเพราะ iJudge
ไม่มี public API) รายละเอียดโจทย์ และเฉลยอ้างอิง `solutions/oj<id>/main.py`

| ข้อมูล | ไฟล์ใน repo นี้ | มาจาก |
| --- | --- | --- |
| registry ของ `/pscp` และ `/pscp/<slug>` | `data/pscp/problems.json` (generated) | `bun run pscp:build` |
| รายการโจทย์ที่ `/make/*` และ `/recommended` อ่าน | `data/oj_problems.json` · `data/all_problems_detail.json` | คัดลอกจาก `.op/data/` ของ archive repo (ยังไม่มีสคริปต์ sync) |

ขั้นตอน — ต้องมี archive repo และ worktree ของ branch `OP` ที่ `<archive repo>/.op`
(`git worktree add .op OP`) ตำแหน่งตั้งได้ด้วย `PSCP_ARCHIVE_REPO` / `PSCP_OP_ROOT`:

1. อัปเดตที่ archive repo (branch `OP`): ข้อมูลโจทย์และเฉลยอ้างอิง
2. คัดลอก `oj_problems.json` กับ `all_problems_detail.json` จาก `.op/data/` มาทับใน `data/`
   (ถ้าข้ามขั้นนี้ `/make/*` และ `/recommended` จะไม่เห็นโจทย์ใหม่)
3. `bun run pscp:build` = `pscp:registry` (`scripts/build_pscp_registry.py` รวมข้อมูลเป็น
   `data/pscp/problems.json`) → `pscp:edges` (เพิ่มเคสขอบ `edgeCases` จากเฉลย) →
   `pscp:verify` (รันเฉลยกับตัวอย่างทางการ ไม่ผ่านก็ exit ไม่เป็น 0)
4. `bun run dev` เช็คหน้า `/pscp` ว่าโจทย์ สัปดาห์ และป้าย Learning Log ถูกต้อง แล้วเปิด PR
   (`data/pscp/problems.json` + สองไฟล์ข้างบน)

ผู้ร่วมพัฒนาที่ไม่มี archive repo: เปิด GitHub Issue แจ้งโจทย์หรือสัปดาห์ที่ขาด เจ้าของ repo เป็นคน build ให้

สิ่งที่ต้องรู้:

- field ของแต่ละโจทย์ที่แอปใช้: `id` `name` `week` `difficulty` `expire_date`
  (รูปแบบ `"31 July 2026, 00:00"` เดือนภาษาอังกฤษ) `is_learning_log` `is_recommended`
  `is_midterm` `url` — ถ้าไม่มี `week` ตัวอ่านของ `/make/*` เดาจากวันหมดเขต (เร็วสุด = Week 1)
- `is_learning_log: true` = โจทย์ที่ต้องทำ submission.md (มีป้าย Learning Log และปุ่มสร้างไฟล์)
- เพิ่มโจทย์แนะนำใน `data/recommended/oj<id>-<ชื่อ>/` (`problem.md` `problem.th.md` `main.py`)
  ต้องเพิ่มรายการคู่ใน `QUIZ_BANK` (`lib/quiz/quiz-content.ts`), `TEST_CASES`
  (`lib/pscp/testcases.ts`), `PROBLEM_TAKEAWAYS` (`lib/pscp/problem-takeaways.ts`) และ
  `IJUDGE_SCRAPED_STATS` (`lib/pscp/recommended.ts`) — `content:check` fail ถ้าขาด

ลิงก์ประจำสัปดาห์ (ฟอร์มเช็คชื่อ, รายชื่อคู่ pair) แก้ที่ **`lib/courses/shortcuts.ts`**
(แสดงบนหัวหน้า `/pscp`) และเอกสารในห้องสมุด (`/library`) อยู่ที่ **`data/ai-guidelines/`**

## 5) ปรับปรุงระบบ (แก้บั๊ก / เพิ่มฟีเจอร์)

โครงสร้างหลัก:

| ที่ | คืออะไร |
| --- | --- |
| `app/` | หน้าเว็บ (App Router) + API routes |
| `components/` | React components (`components/ui/` = shadcn-style primitives) |
| `lib/` | logic แบ่งตามโดเมน: courses, library, quiz, pscp, auth, supabase … (ดู `lib/README.md`) |
| `data/` | ข้อมูลที่ไม่ผูก route: registry โจทย์ PSCP, template ทางการ, เอกสาร AI guidelines, เอกสารยาวของวิชา |
| `content/` | Markdown ของรายวิชา (`content/courses/<code>-<slug>/`) |
| `db/` | Drizzle schema + migrations + SQL ที่ apply มือ (RLS) |
| `public/assets/` | ไฟล์จริง (gitignore ไว้ — เสิร์ฟจาก Supabase Storage) |
| `scripts/` | เครื่องมือรันมือ: `library:*` `assets:*` `pscp:*` `readiness` — มีแค่ `content:check` ที่รันอัตโนมัติก่อน build |

ธรรมเนียมของโค้ดเบสนี้:

- TypeScript + Tailwind ทั้งหมด ตามสไตล์ไฟล์ข้างเคียง
- ข้อความ UI ทุกชิ้นต้องมีสองภาษา ผ่าน pattern `LText` (`{ th, en }`)
  แล้วเรียก `t(L.key, locale)` — ห้าม hardcode ภาษาเดียว
- ข้อมูลของเครื่องมือ PSCP (แบบร่าง ประวัติไฟล์ที่สร้าง ความคืบหน้าควิซ/โจทย์) เก็บใน
  localStorage เท่านั้น ห้ามส่งขึ้น server — ส่วนบัญชีผู้ใช้ (โปรไฟล์ ไฟล์ที่แชร์) อยู่ใน DB ผ่าน Server Action ตามที่ออกแบบไว้
- **Client Component ห้าม import จาก `lib/library/subject-library.ts`** — ไฟล์นั้น import
  `library-manifest.json` + `library-stats.json` ที่ระดับ module ถ้า client ดึงอะไร
  จากมันไป ชื่อไฟล์และ metadata ของสื่อทุกชิ้น (รวมข้อสอบเก่า) จะติดไปใน bundle
  ฝั่ง browser ด้วย ให้ import จาก `lib/library/subject-library-ui.ts` แทน — และห้าม import
  `lib/library/resource-index.json` จากโค้ดใน `app/` `components/` `lib/` เลย (มีทุกการ์ด
  รวมข้อสอบเก่า ไว้ให้สคริปต์กับ agent ค้นเท่านั้น)
- อะไรที่จำกัดสิทธิ์ ต้องกันตั้งแต่ฝั่ง server — อย่าซ่อนด้วย CSS หรือ overlay
  เพราะข้อมูลยังอยู่ใน payload
- หลักการสำคัญ: เว็บนี้ **ไม่เขียนเนื้อหาแทนนักศึกษา** —
  ฟีเจอร์ใหม่ต้องไม่ generate คำตอบ ไม่ solve โจทย์ และไม่ส่งอะไรไป OJ

ก่อนเปิด PR:

```bash
npx tsc --noEmit -p .   # type check — ต้อง exit 0
bun run lint            # ห้ามเพิ่ม error (ยังมี error เดิมค้างอยู่ — ดูหมายเหตุด้านล่าง)
bun run content:check   # สัญญาเนื้อหา (รันก่อน build อยู่แล้ว)
bun run library:build && bun run library:audit   # ถ้าแตะไฟล์ใน public/assets/ การ์ด หรือเอกสารที่ผูกกับการ์ด
bun run build           # ต้อง build ผ่าน
```

`lint` exit 1 ตั้งแต่ก่อนคุณแตะอะไร — รันก่อนแก้เพื่อจดค่าเริ่มต้น แล้วทำให้ไม่แย่ลง
(ณ 15 ต.ค. 2569 มี 14 error เดิม: 13 ใน `public/pyodide/pyodide.asm.js` ที่ vendor มา กับ 1 ใน
`lib/submission/draft.ts`) ส่วน `library:audit` ปกติ exit 0 (มีแต่ warning) — error เดิมที่ไม่เกี่ยวกับคุณ
ให้บอกใน PR ไม่ต้องแอบแก้

`assets:sync` (อัปโหลดไฟล์ใหม่ขึ้น Storage) เป็นขั้นของเจ้าของ repo ดูข้อ 3)

## 6) อัปเดต Changelog / Version History

ทุกครั้งที่ PR มีผลต่อผู้ใช้ (ฟีเจอร์ใหม่, แก้บั๊ก, เปลี่ยนพฤติกรรม) ให้แก้ **`CHANGELOG.md`** ด้วย:

1. เพิ่มรายการใต้หัวข้อ `## [Unreleased]` แบ่งตามหมวดที่ไฟล์นี้ใช้จริง — **หัวข้อภาษาไทย**:
   `### เพิ่ม` · `### ปรับปรุง` · `### แก้ไข` · `### ความปลอดภัย` (ตรงกับ Added / Changed /
   Fixed / Security ของ [Keep a Changelog](https://keepachangelog.com/en/1.1.0/))
   หมวดไหนไม่มีรายการก็ไม่ต้องใส่
2. เขียนสั้น ๆ ว่าเปลี่ยนอะไร ผู้ใช้เห็นผลยังไง — ไม่ต้อง detail ระดับโค้ด รูปแบบรายการ:
   `- **หัวข้อสั้น ๆ** — คำอธิบาย` ตามรายการเดิมในไฟล์
3. ไม่ต้องตั้งเลขเวอร์ชันเอง — คนดูแล repo จะเป็นคนตัดสินใจตอน release ว่ารอบนี้เป็น
   `MAJOR` (breaking change) / `MINOR` (ฟีเจอร์ใหม่) / `PATCH` (แก้บั๊ก/ปรับเล็กน้อย)
   ตาม [Semantic Versioning](https://semver.org/lang/th/) แล้วย้าย `[Unreleased]`
   ไปเป็นหัวข้อ `## [x.y.z] - 22 กันยายน 2569` (วันที่แบบไทย พ.ศ.) พร้อมแก้ `version` ใน
   `package.json` กับป้ายเวอร์ชันใน README และคัดรายการไปไว้ใน `lib/docs/changelog.ts`
   ซึ่งเป็นข้อมูลของหน้า `/version` (คัดลอกมือ สองภาษา — หน้าที่ของคนดูแล ไม่ต้องแก้ใน PR ทั่วไป)
4. อย่าเขียนใน CHANGELOG ถึงรายละเอียดของเนื้อหาที่จำกัดสิทธิ์ (จำนวนหรือรายชื่อไฟล์
   วิธีออก signed URL) หรือรายละเอียดด้านความปลอดภัยที่ชี้ช่องให้คนไปขุดหา — ใช้หมวด `ความปลอดภัย`
   บอกแค่ผลที่ผู้ใช้ได้รับ

ตอน release แต่ละเวอร์ชันจะมีบรรทัด **ผู้ร่วมพัฒนา** ระบุชื่อ + GitHub handle ของทุกคน
ที่มี commit ในเวอร์ชันนั้น (ดูตัวอย่างได้ใน `CHANGELOG.md`) — ถ้า PR ของคุณถูก merge
เข้าเวอร์ชันไหน ชื่อคุณจะไปโผล่ในเวอร์ชันนั้น

## เปิด Pull Request

1. สร้าง branch จาก `main` เช่น `fix/week-badge` หรือ `feat/itf-week-14`
2. Commit สั้น ๆ ตรงประเด็น ตาม [Conventional Commits](https://www.conventionalcommits.org/)
   แบบมี scope — `type(scope): สรุป` ตามที่ใช้ใน git log เช่น
   `feat(itf): weekly sessions + exam notes on the map module` ·
   `fix(reader): keep wide tables inside the card on phones` ·
   `chore(pscp): rebuild registry` · `docs: document the week view` ·
   type ที่ใช้: `feat` `fix` `docs` `chore` `refactor` `style` `build` `perf` · scope คือพื้นที่ที่แตะ
   (`itf` `library` `reader` `pscp` `courses` …) เรื่องกว้างไม่ต้องมี scope ก็ได้
3. เปิด PR อธิบายว่าแก้อะไร ทำไม พร้อม screenshot ถ้าเป็นเรื่อง UI
4. แก้ `CHANGELOG.md` ตามข้อ 6) ด้านบนไว้ในรอบ PR เดียวกัน
5. เจอบั๊กแต่ยังไม่มีเวลาแก้ — เปิด GitHub Issue ไว้ก็ช่วยมากแล้ว

ขอบคุณที่ช่วยกันทำให้เครื่องมือนี้ดีขึ้น 🙌
