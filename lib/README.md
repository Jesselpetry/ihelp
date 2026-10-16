# `lib/` — คู่มือโฟลเดอร์

โค้ดที่ไม่ใช่หน้าจอทั้งหมดอยู่ที่นี่ ก่อนหน้านี้เป็นไฟล์แบน ๆ 70 กว่าไฟล์ในชั้นเดียว
ตอนนี้แบ่งตาม **โดเมน** คือแบ่งตามสิ่งที่ไฟล์นั้นพูดถึง ไม่ใช่แบ่งตามชนิดของโค้ด
(ไม่มีโฟลเดอร์ชื่อ `types/` `utils/` `constants/` เพราะแบ่งแบบนั้นแล้วหาไฟล์ไม่เจออยู่ดี)

ตรวจล่าสุด 15 ต.ค. 2569 — ตรงกับ `ls lib lib/*` ณ วันนั้น

```
lib/
├── courses/      รายวิชา: catalog, spine, bindings, เนื้อหา, ผู้สอน
├── library/      คลังสื่อการเรียน: metadata, manifest, index, storage, ข้อสอบเก่า, ตารางสัปดาห์
├── quiz/         คลังข้อสอบ/แบบทดสอบรายวิชา (ไฟล์ข้อมูลล้วน ขนาดใหญ่)
├── pscp/         PSCP · iJudge · ComPro — โจทย์ เทสเคส ตัวรัน Python
├── submission/   ตัวช่วยสร้างไฟล์ส่งงาน (wizard, markdown, draft)
├── docs/         เอกสารในเว็บ: สารบัญ ความคืบหน้าการอ่าน changelog ปลั๊กอิน remark
├── github/       การเชื่อมต่อ GitHub (หน้า /repo และการส่ง PR)
├── profile/      โปรไฟล์ผู้ใช้: รูป การครอป ฟอร์ม
├── actions/      Server Actions ("use server")
├── auth/         การยืนยันตัวตนและสิทธิ์
├── supabase/     ตัวเชื่อม Supabase แยกตามฝั่ง (client / server / admin)
├── schemas/      สัญญาของเนื้อหา ใช้โดย `bun run content:check`
└── *.ts          ของกลางที่ทุกโดเมนใช้ (i18n, theme, paths, flags, utils)
```

---

## กฎที่ต้องรู้ก่อนแก้

**1. import ด้วย `@/lib/...` เสมอ**
ไฟล์ในโฟลเดอร์เดียวกัน import แบบ `./x` ได้ ข้ามโฟลเดอร์ให้ใช้ alias
เวลาย้ายไฟล์จะได้แก้ที่เดียว

**2. Client Component ห้าม import ข้อมูลของคลังโดยตรง**
`lib/library/subject-library.ts` import `library-manifest.json` และ `library-stats.json`
(ไฟล์ละหลายร้อย KB) ที่ระดับ module ใครดึงไปก็ลาก metadata ของทุกไฟล์ในคลัง — รวมชื่อข้อสอบเก่า —
เข้า browser bundle ด้วย ฝั่ง client ให้ใช้ `lib/library/subject-library-ui.ts`
ซึ่งมีแต่ type กับค่าคงที่สำหรับแสดงผล

`lib/library/resource-index.json` (~1 MB) ห้าม import จากโค้ดใน `app/` `components/` `lib/`
ทุกกรณี — ในนั้นมีทุกการ์ดรวมข้อสอบเก่า ใช้ค้นผ่าน `bun run library:find` หรือ `jq` เท่านั้น

**3. ดูหัวไฟล์ว่าอยู่ฝั่งไหน**

| หัวไฟล์ | หมายถึง |
|---|---|
| `import "server-only"` | เรียกจาก Client Component ไม่ได้ build จะพัง — เช่น `library/exams.ts`, `library/library-exams.ts`, `auth/guards.ts`, `analytics.ts` |
| `"use client"` | มี state/localStorage/`window` — เช่น `docs/reading-progress.ts`, `submission/draft.ts`, `quiz/quiz.ts` |
| ไม่มีทั้งคู่ | ใช้ได้สองฝั่ง ให้คงสภาพนี้ไว้ อย่าเผลอ import ของที่ผูกกับฝั่งใดฝั่งหนึ่งเข้ามา |

ไฟล์ที่ **ไม่มี marker แต่ server-only โดยธรรมชาติ** (แตะ `fs` หรือดึง metadata ทั้งคลัง) ห้ามให้
Client Component import: `courses/course-spine.ts`, `courses/course-content.ts`,
`library/subject-library.ts`, `library/course-weeks.ts`

**4. ไฟล์ที่ห้ามแก้มือ**

| ไฟล์ | สร้างด้วย |
|---|---|
| `library/library-manifest.json` | `bun run library:manifest` |
| `library/library-stats.json` | `bun run library:stats` |
| `library/resource-index.json` | `bun run library:index` (โครงสร้างอธิบายใน `library/resource-index.schema.json`) |
| ทั้งสามไฟล์ข้างบน | `bun run library:build` (= manifest + stats + index ตามลำดับ) |
| `courses/it-kmitl-scraped.json` | ดึงมาจากหน้าวิชาของคณะ — ไม่มีสคริปต์สร้างซ้ำใน repo นี้ ข้อมูลทางการ แก้มือแล้วจะไม่ตรงต้นทาง |

`resource-index.json` เป็น snapshot ของ TypeScript และ Markdown — แก้การ์ด binding ตารางสัปดาห์
หรือเอกสารแล้วต้อง rebuild ใหม่ `bun run library:audit` จะบอกเมื่อมันเก่า

`courses/it-kmitl-staff.json` **แก้มือได้** — เป็นทะเบียนอาจารย์ที่คัดมาจาก
[หน้าบุคลากรของคณะ](https://www.it.kmitl.ac.th/th/staffs/academic) อ่านผ่าน `courses/staff.ts`

**5. ไฟล์ใหม่ไปโฟลเดอร์ไหน** — ถามว่า *"ไฟล์นี้พูดถึงอะไร"* ไม่ใช่ *"ไฟล์นี้เป็นโค้ดชนิดไหน"*
ถ้าไม่เข้าโดเมนไหนเลยและทุกโดเมนใช้ร่วมกัน (เช่น `i18n`, `paths`) ค่อยวางที่ราก `lib/`

---

## `lib/courses/` — รายวิชา

จุดลงทะเบียนรายวิชาอยู่ที่นี่ทั้งหมด เพิ่มวิชาใหม่ให้ไล่ตาม
[CONTRIBUTING.md](../CONTRIBUTING.md) ข้อ "เพิ่มรายวิชาใหม่" และ
[docs/LEARNING_BLUEPRINT.md](../docs/LEARNING_BLUEPRINT.md) §8

| ไฟล์ | หน้าที่ |
|---|---|
| `catalog.ts` | **วิชานี้คือวิชาอะไร** — code, slug, ชื่อสองภาษา, หน่วยกิต, กลุ่ม (identity เท่านั้น ไม่มี `tracks` แล้ว) |
| `spine.ts` | **หนึ่งวิชาประกอบด้วยอะไร** — 11 โมดูลมาตรฐาน เหมือนกันทุกวิชา · ข้อมูลล้วน Client import ได้ |
| `course-bindings.ts` | **วิชานี้เติมโมดูลไหนได้จริง** — `COURSE_BINDINGS` ผูกโมดูลเข้ากับเอกสาร/คลังข้อสอบ · `baseline()` คือค่าเริ่มต้นของวิชาที่มีแค่ภาพรวม |
| `course-spine.ts` | รวมสองอันบนเข้าด้วยกันเป็นสิ่งที่หน้าเว็บเรนเดอร์ (`resolveCourseSpine()` · `resolveModule()` · `moduleBinding()` · `readinessIndex()`) |
| `course-content.ts` | อ่าน `content/courses/<dir>/summary.md` (`loadCourseOverview`) และเอกสารอื่นในโฟลเดอร์วิชา (`loadCourseDoc` · `loadCourseJson`) · ข้อมูลที่ดึงจากหน้าวิชาของคณะ |
| `course-chapters.ts` | รายชื่อบท/สัปดาห์ต่อวิชา (`COURSE_CHAPTERS_MAP` ครบทั้ง 15 วิชา) พร้อมขอบเขตกลางภาค–ปลายภาค · ถ้าวิชาใหม่ยังไม่ลงทะเบียนจะอ่านตารางใต้ `## 2.` ของ `summary.md` แทน |
| `curriculum.ts` | สเปกหลักสูตรแบบ JSON ที่วิชาแนบมาได้ (ตอนนี้มีแต่ MFIT: `archive/study-guide-curriculum.json`) · **ยังไม่มีโค้ดส่วนไหนเรียก `loadCurriculum()`** |
| `it-kmitl.ts`, `en-kmitl.ts` | โหลดเนื้อหาของสองคณะจาก `data/it-kmitl/` และ `data/en-kmitl/` พร้อม override path สำหรับ dev |
| `staff.ts` + `it-kmitl-staff.json` | ทะเบียนอาจารย์ 43 คน ชื่อไทย/อังกฤษพร้อมตำแหน่งวิชาการ |
| `course.ts` | ข้อมูลวิชา PSCP บนหน้าแรก (มาก่อน catalog จึงแยกอยู่) |
| `majors.ts`, `shortcuts.ts` | สาขาในคณะ (key ตรงกับ `ihelp.users.major`) · ทางลัดประจำสัปดาห์บนหน้าแรก |

## `lib/library/` — คลังสื่อการเรียน

| ไฟล์ | หน้าที่ |
|---|---|
| `subject-library.ts` | entry ที่เขียนมือของทุกไฟล์ในคลัง (`*_ASSETS`) + รวมกับ manifest อัตโนมัติ (`mergedAssets()`) · `assetsForCourse()` ไม่รวมข้อสอบเก่า · **server เท่านั้น** |
| `subject-library-ui.ts` | type และค่าคงที่ฝั่งแสดงผล (`SubjectAsset` `AssetScope` `CourseSchedule` `isRestrictedAsset()`…) — ฝั่ง client import อันนี้ |
| `course-weeks.ts` | ตารางรายสัปดาห์ของวิชาที่คลังเปิดเป็นมุมมองรายสัปดาห์ (`COURSE_SCHEDULES`: ITF, ICS) · มีลิงก์วิดีโอ OnLearn จึงส่งผ่าน `/api/library/assets` หลังล็อกอินเท่านั้น · **server เท่านั้น** |
| `library-manifest.json` · `library-stats.json` | ผลลัพธ์ของสคริปต์ (การ์ดที่สร้างจากไฟล์ใน `public/assets/` · ขนาดและจำนวนหน้า) ห้ามแก้มือ |
| `resource-index.json` · `resource-index.schema.json` | ผลลัพธ์ของ `bun run library:index` — ไฟล์เดียวที่ join วิชา (โมดูล สัปดาห์ เอกสาร) เอกสาร (บทบาท ใครแสดง ไฟล์ที่อ้าง) และการ์ดทุกใบ (path, bucket, สิทธิ์, ขนาด, `onDisk`, `usedBy`) · ห้ามแก้มือ ห้าม import จากโค้ดแอป · schema คือคำอธิบายแต่ละฟิลด์ |
| `asset-url.ts` | แปลง path ของไฟล์ไปเป็น URL จริง (public bucket `ihelp-library` หรือ path เดิมถ้าไม่ได้ตั้ง Supabase) |
| `storage-key.ts` | แปลง path เป็น object key ของ bucket (Supabase ไม่รับคีย์ที่ไม่ใช่ ASCII) — ตัวอัปโหลดกับตัว resolve ใช้ฟังก์ชันเดียวกัน |
| `library-exams.ts` | ข้อสอบเก่าในคลัง เปิดได้เฉพาะ role insider/admin ผ่าน signed URL จาก bucket ปิด `ihelp-library-exams` · **server-only** |
| `exams.ts` | คลังข้อสอบ `/exams` (ตาราง `ihelp.exams`) ซึ่งเป็นคนละ bucket กับข้างบน (`ihelp-exams`) · **server-only** |
| `library.ts` | หนังสือ AI-Guidelines-PSCP ที่ผูกมากับโปรเจกต์ (`data/ai-guidelines/`) |
| `resources.ts` | ค่าคงที่ของงานอัปโหลดจากชุมชน (แยกจาก `actions/upload.ts` เพราะ "use server" export ค่าคงที่ไม่ได้) · ปิดอยู่ด้วย `UPLOADS_ENABLED` ใน `flags.ts` |

**ใครเห็นอะไร:** รายการไฟล์ของคลังมาจาก `app/api/library/assets/route.ts` ซึ่งต้องล็อกอิน IT KMITL
(หน้า `/courses/<dir>/library` เป็นหน้าสถิตที่ไม่มีข้อมูลการ์ด) แต่ไฟล์ที่ไม่ใช่ข้อสอบอยู่ใน bucket
**สาธารณะ** และ path ของมันอยู่ใน repo สาธารณะ — "หลังล็อกอิน" ไม่เท่ากับส่วนตัว ยิ่งกว่านั้นหน้าโมดูลที่
render เอกสาร (เช่นหน้ารายสัปดาห์ของ ITF/ICS) ไม่ได้อยู่หลังล็อกอิน และรับการ์ดที่ไม่ใช่ข้อสอบของวิชานั้น
เป็น props เพื่อจับคู่กับตารางไฟล์ในเอกสาร
มีแค่ข้อสอบเก่า (`isRestrictedAsset()`: `category === "exam"` หรือ path มี `/exams/`) ที่อยู่ bucket ปิด

## `lib/quiz/` — คลังข้อสอบ

ไฟล์ข้อมูลล้วน หนึ่งไฟล์ต่อหนึ่งคลัง: `ics-quiz` `itf-quiz` `mfit-quiz` `chem-quiz`
`en-kmitl-quiz` `en-kmitl-mock-exam` `quiz-content` (คลังรายโจทย์ของ PSCP) โดยมี `quiz.ts`
เป็นชนิดข้อมูลกลางและที่เก็บ progress ใน localStorage
ทุกข้อต้องผ่าน `bun run content:check` — ต้องมีแหล่งอ้างอิง ตัวเลือกห้าม id ซ้ำ
และ progress key (`quizId` ใน binding) ห้ามชนกัน

## `lib/pscp/` — PSCP · iJudge · ComPro

`pscp.ts` (registry จาก `scripts/build_pscp_registry.py` → `data/pscp/problems.json`) ·
`recommended.ts` (โจทย์แนะนำ) · `testcases.ts` · `problem-takeaways.ts` · `pscp-tags.ts` ·
`pscp-learning-log-hints.ts` · `compro-labs.ts` + `compro-lessons.ts` (ฝั่ง EN-KMITL) ·
`pep8-rules.ts` + `grader-types.ts` (ตัวตรวจ) · `pyodide-client.ts` (รัน Python ใน worker) ·
`master.ts` (รูปร่างของ `oj_problems.json`) · `pscp-client.ts` + `recommended-client.ts`
(เก็บความคืบหน้าและสถานะโจทย์ใน localStorage · `"use client"`)

## `lib/submission/` — ตัวช่วยสร้างไฟล์ส่งงาน

`wizard-fields.ts` และ `statements.ts` คือสัญญาของฟอร์ม · `wizard-content.ts` คือข้อความแนะนำและ
ตัวอย่างของแต่ละขั้น · `markdown.ts` เติมข้อมูลลงเทมเพลต ·
`md-parse.ts` อ่านกลับจากไฟล์ที่ commit แล้วเป็น draft (เป็นด้านกลับของ `markdown.ts`
ถ้าแก้อันหนึ่งต้องแก้อีกอัน) · `draft.ts` + `history.ts` เก็บงานไว้ใน localStorage ·
`validation.ts` กฎ "ต้องกรอกจริง ๆ"

## โฟลเดอร์ที่เหลือ

| โฟลเดอร์ | ไฟล์ |
|---|---|
| `docs/` | `doc-index.ts` (สิ่งที่เอกสารบอกเกี่ยวกับตัวเองก่อนเปิด) · `toc.ts` · `reading-progress.ts` · `changelog.ts` (ข้อมูลของหน้า `/version`) · `remark-notebook.ts` (ไวยากรณ์ `{==…==}` `{++…++}` และ `<sub>`/`<sup>` ของ MdView — ดู [docs/FONTS.md](../docs/FONTS.md) §8) |
| `github/` | `github.ts` (ฝั่ง client) · `github-server.ts` (ถือ OAuth token) · `repo-tree.ts` |
| `profile/` | `avatar.ts` · `image-crop.ts` · `profile-form.ts` |
| `actions/` | Server Actions: `onboarding` `profile` `upload` |
| `auth/` | `guards.ts` (สิทธิ์ฝั่ง Drizzle) · `verify.ts` (ประตู KMITL IT แบบ pure ทดสอบได้) |
| `supabase/` | `client` (browser) · `server` (RSC/actions) · `admin` (service role ข้าม RLS) · `proxy-session` |
| `schemas/` | `content.ts` — สัญญาของเนื้อหาในรูปแบบที่เครื่องตรวจได้ (Zod + `checkBank()`) |

## ของกลางที่ราก `lib/`

| ไฟล์ | หน้าที่ |
|---|---|
| `ltext.ts` | ข้อความสองภาษา และฟังก์ชันเดียวที่อ่านมัน — ฝั่ง server ใช้ได้ |
| `i18n.tsx` | React context ของภาษา (ฝั่ง client) |
| `theme.tsx` | ธีม inline ใน `<head>` ก่อน paint แรก |
| `paths.ts` | ตำแหน่งของข้อมูลที่ผูกมากับโปรเจกต์ |
| `flags.ts` | feature flag ที่อ่านตอน build (`NEXT_PUBLIC_*`) |
| `analytics.ts` | นับผู้เข้าชมแบบไม่ระบุตัวตน · **server-only** |
| `utils.ts` | `cn()` ของ Tailwind เท่านั้น |

---

## ตรวจหลังแก้

```bash
bunx tsc --noEmit     # ทุก import ต้องผ่าน
bun run content:check # คลังข้อสอบและ binding ของรายวิชา (รันก่อน build อัตโนมัติ)
bun run lint          # มี error เดิมค้างเฉพาะใน public/pyodide/ กับ lib/submission/draft.ts
bun run library:audit # ถ้าแตะ lib/library/ การ์ด ตารางสัปดาห์ หรือเอกสารที่อ้างไฟล์ในคลัง
bun run build         # ด่านสุดท้าย จับ client/server ที่ปนกัน
```
