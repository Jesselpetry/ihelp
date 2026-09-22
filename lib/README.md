# `lib/` — คู่มือโฟลเดอร์

โค้ดที่ไม่ใช่หน้าจอทั้งหมดอยู่ที่นี่ ก่อนหน้านี้เป็นไฟล์แบน ๆ 70 กว่าไฟล์ในชั้นเดียว
ตอนนี้แบ่งตาม **โดเมน** คือแบ่งตามสิ่งที่ไฟล์นั้นพูดถึง ไม่ใช่แบ่งตามชนิดของโค้ด
(ไม่มีโฟลเดอร์ชื่อ `types/` `utils/` `constants/` เพราะแบ่งแบบนั้นแล้วหาไฟล์ไม่เจออยู่ดี)

```
lib/
├── courses/      รายวิชา: catalog, spine, bindings, เนื้อหา, ผู้สอน
├── library/      คลังสื่อการเรียน: metadata, manifest, storage, ข้อสอบเก่า
├── quiz/         คลังข้อสอบ/แบบทดสอบรายวิชา (ไฟล์ข้อมูลล้วน ขนาดใหญ่)
├── pscp/         PSCP · iJudge · ComPro — โจทย์ เทสเคส ตัวรัน Python
├── submission/   ตัวช่วยสร้างไฟล์ส่งงาน (wizard, markdown, draft)
├── docs/         เอกสารในเว็บ: สารบัญ ความคืบหน้าการอ่าน changelog
├── github/       การเชื่อมต่อ GitHub (หน้า /repo และการส่ง PR)
├── profile/      โปรไฟล์ผู้ใช้: รูป การครอป ฟอร์ม
├── actions/      Server Actions ("use server")
├── auth/         การยืนยันตัวตนและสิทธิ์
├── supabase/     ตัวเชื่อม Supabase แยกตามฝั่ง (client / server / admin)
├── schemas/      สัญญาของเนื้อหา ใช้โดย `npm run content:check`
└── *.ts          ของกลางที่ทุกโดเมนใช้ (i18n, theme, paths, flags, utils)
```

---

## กฎที่ต้องรู้ก่อนแก้

**1. import ด้วย `@/lib/...` เสมอ**
ไฟล์ในโฟลเดอร์เดียวกัน import แบบ `./x` ได้ ข้ามโฟลเดอร์ให้ใช้ alias
เวลาย้ายไฟล์จะได้แก้ที่เดียว

**2. Client Component ห้าม import `lib/library/subject-library.ts`**
ไฟล์นั้น import `library-manifest.json` (338 KB) และ `library-stats.json` (71 KB)
ที่ระดับ module ใครดึงไปก็ลาก metadata ของทุกไฟล์ในคลัง — รวมชื่อข้อสอบเก่า —
เข้า browser bundle ด้วย ฝั่ง client ให้ใช้ `lib/library/subject-library-ui.ts`
ซึ่งมีแต่ type กับค่าคงที่สำหรับแสดงผล

**3. ดูหัวไฟล์ว่าอยู่ฝั่งไหน**

| หัวไฟล์ | หมายถึง |
|---|---|
| `import "server-only"` | เรียกจาก Client Component ไม่ได้ build จะพัง — เช่น `library/exams.ts`, `auth/guards.ts`, `analytics.ts` |
| `"use client"` | มี state/localStorage/`window` — เช่น `docs/reading-progress.ts`, `submission/draft.ts` |
| ไม่มีทั้งคู่ | ใช้ได้สองฝั่ง ให้คงสภาพนี้ไว้ อย่าเผลอ import ของที่ผูกกับฝั่งใดฝั่งหนึ่งเข้ามา |

**4. ไฟล์ที่ห้ามแก้มือ**

| ไฟล์ | สร้างด้วย |
|---|---|
| `library/library-manifest.json` | `npm run library:manifest` |
| `library/library-stats.json` | `npm run library:stats` |
| `courses/it-kmitl-scraped.json` | สคริปต์ดึงจากเว็บคณะ |

`courses/it-kmitl-staff.json` **แก้มือได้** — เป็นทะเบียนอาจารย์ที่คัดมาจาก
[หน้าบุคลากรของคณะ](https://www.it.kmitl.ac.th/th/staffs/academic) อ่านผ่าน `courses/staff.ts`

**5. ไฟล์ใหม่ไปโฟลเดอร์ไหน** — ถามว่า *"ไฟล์นี้พูดถึงอะไร"* ไม่ใช่ *"ไฟล์นี้เป็นโค้ดชนิดไหน"*
ถ้าไม่เข้าโดเมนไหนเลยและทุกโดเมนใช้ร่วมกัน (เช่น `i18n`, `paths`) ค่อยวางที่ราก `lib/`

---

## `lib/courses/` — รายวิชา

จุดลงทะเบียนรายวิชาอยู่ที่นี่ทั้งหมด เพิ่มวิชาใหม่ให้ไล่ตาม
[CONTRIBUTING.md](../CONTRIBUTING.md) ข้อ "เพิ่มรายวิชา"

| ไฟล์ | หน้าที่ |
|---|---|
| `catalog.ts` | **วิชานี้คือวิชาอะไร** — code, slug, ชื่อสองภาษา, หน่วยกิต, กลุ่ม |
| `spine.ts` | **หนึ่งวิชาประกอบด้วยอะไร** — 11 โมดูลมาตรฐาน เหมือนกันทุกวิชา |
| `course-bindings.ts` | **วิชานี้เติมโมดูลไหนได้จริง** — ผูกโมดูลเข้ากับเอกสาร/คลังข้อสอบ |
| `course-spine.ts` | รวมสองอันบนเข้าด้วยกันเป็นสิ่งที่หน้าเว็บเรนเดอร์ |
| `course-content.ts` | อ่าน `content/courses/<dir>/summary.md` และเอกสารอื่นในโฟลเดอร์วิชา |
| `course-chapters.ts` | บท/สัปดาห์มาตรฐาน และขอบเขตกลางภาค–ปลายภาค |
| `curriculum.ts` | สเปกหลักสูตรแบบ JSON ที่วิชาแนบมาได้ (ตอนนี้มีแต่ MFIT) |
| `it-kmitl.ts`, `en-kmitl.ts` | โหลดเนื้อหาของสองคณะ พร้อม override path สำหรับ dev |
| `staff.ts` + `it-kmitl-staff.json` | ทะเบียนอาจารย์ 43 คน ชื่อไทย/อังกฤษพร้อมตำแหน่งวิชาการ |
| `course.ts` | ข้อมูลวิชา PSCP บนหน้าแรก (มาก่อน catalog จึงแยกอยู่) |
| `majors.ts`, `shortcuts.ts` | สาขาในคณะ · ทางลัดประจำสัปดาห์บนหน้าแรก |

## `lib/library/` — คลังสื่อการเรียน

| ไฟล์ | หน้าที่ |
|---|---|
| `subject-library.ts` | entry ที่เขียนมือของทุกไฟล์ในคลัง + รวมกับ manifest อัตโนมัติ · **server เท่านั้น** |
| `subject-library-ui.ts` | type และค่าคงที่ฝั่งแสดงผล — ฝั่ง client import อันนี้ |
| `library-manifest.json` · `library-stats.json` | ผลลัพธ์ของสคริปต์ ห้ามแก้มือ |
| `asset-url.ts` | แปลง path ของไฟล์ไปเป็น URL จริง (public หรือ Supabase Storage) |
| `storage-key.ts` | แปลง path เป็น object key ของ bucket (Supabase ไม่รับคีย์ที่ไม่ใช่ ASCII) |
| `library-exams.ts` | ข้อสอบเก่าในคลัง เปิดได้เฉพาะคนในคณะ · **server-only** |
| `exams.ts` | คลังข้อสอบ `/exams` ซึ่งเป็นคนละ bucket กับข้างบน · **server-only** |
| `library.ts` | หนังสือ AI-Guidelines-PSCP ที่ผูกมากับโปรเจกต์ |
| `resources.ts` | ค่าคงที่ของงานอัปโหลดจากชุมชน (แยกจาก `actions/upload.ts` เพราะ "use server" export ค่าคงที่ไม่ได้) |

## `lib/quiz/` — คลังข้อสอบ

ไฟล์ข้อมูลล้วน หนึ่งไฟล์ต่อหนึ่งคลัง: `ics-quiz` `itf-quiz` `mfit-quiz` `chem-quiz`
`en-kmitl-quiz` `en-kmitl-mock-exam` `quiz-content` โดยมี `quiz.ts` เป็นชนิดข้อมูลกลาง
ทุกข้อต้องผ่าน `npm run content:check` — ต้องมีแหล่งอ้างอิง ตัวเลือกห้าม id ซ้ำ
และ progress key ห้ามชนกัน

## `lib/pscp/` — PSCP · iJudge · ComPro

`pscp.ts` (registry จาก `scripts/build_pscp_registry.py`) · `recommended.ts` (โจทย์แนะนำ) ·
`testcases.ts` · `problem-takeaways.ts` · `pscp-tags.ts` · `pscp-learning-log-hints.ts` ·
`compro-labs.ts` + `compro-lessons.ts` (ฝั่ง EN-KMITL) · `pep8-rules.ts` +
`grader-types.ts` (ตัวตรวจ) · `pyodide-client.ts` (รัน Python ใน worker) ·
`master.ts` (รูปร่างของ `oj_problems.json`)

## `lib/submission/` — ตัวช่วยสร้างไฟล์ส่งงาน

`wizard-fields.ts` และ `statements.ts` คือสัญญาของฟอร์ม · `markdown.ts` เติมข้อมูลลงเทมเพลต ·
`md-parse.ts` อ่านกลับจากไฟล์ที่ commit แล้วเป็น draft (เป็นด้านกลับของ `markdown.ts`
ถ้าแก้อันหนึ่งต้องแก้อีกอัน) · `draft.ts` + `history.ts` เก็บงานไว้ใน localStorage ·
`validation.ts` กฎ "ต้องกรอกจริง ๆ"

## โฟลเดอร์ที่เหลือ

| โฟลเดอร์ | ไฟล์ |
|---|---|
| `docs/` | `doc-index.ts` (สิ่งที่เอกสารบอกเกี่ยวกับตัวเองก่อนเปิด) · `toc.ts` · `reading-progress.ts` · `changelog.ts` (ข้อมูลของหน้า `/version`) |
| `github/` | `github.ts` (ฝั่ง client) · `github-server.ts` (ถือ OAuth token) · `repo-tree.ts` |
| `profile/` | `avatar.ts` · `image-crop.ts` · `profile-form.ts` |
| `actions/` | Server Actions: `onboarding` `profile` `upload` |
| `auth/` | `guards.ts` (สิทธิ์ฝั่ง Drizzle) · `verify.ts` (ประตู KMITL IT แบบ pure ทดสอบได้) |
| `supabase/` | `client` (browser) · `server` (RSC/actions) · `admin` (service role ข้าม RLS) · `proxy-session` |
| `schemas/` | `content.ts` — สัญญาของเนื้อหาในรูปแบบที่เครื่องตรวจได้ |

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
npx tsc --noEmit     # ทุก import ต้องผ่าน
npm run content:check # คลังข้อสอบและ binding ของรายวิชา
npm run lint          # มี error เดิมค้างอยู่ใน public/pyodide/ กับ lib/submission/draft.ts
npm run build         # ด่านสุดท้าย จับ client/server ที่ปนกัน
```
