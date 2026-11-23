# \<i\>Help — คลังการเรียนรู้ IT KMITL

![iHelp](/og-image-hd.png)

ศูนย์รวมสื่อการเรียนของนักศึกษา IT สจล. ปี 1 — สรุปเนื้อหา สไลด์บรรยาย ข้อสอบเก่า
แบบฝึกหัด และเครื่องมือสร้าง Learning Log ของวิชา PSCP รวมอยู่ในเว็บเดียว
ดีไซน์ตามสไตล์ [iJudge](https://ijudge.it.kmitl.ac.th) · เว็บจริง: <https://ihelp.chatan.in.th>

<!-- stats:start -->
| 📚 รายวิชาในระบบ | 🗂️ วิชามีคลังสื่อ | 📄 การ์ดสื่อการเรียน | 💾 ไฟล์เอกสารจริง | 📖 จำนวนหน้าเอกสาร | 🗓️ อัปเดตล่าสุด |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **15** วิชา | **14** วิชา | **750** รายการ | **733** ไฟล์ | **13,622** หน้า | พฤศจิกายน 2569 |
<!-- stats:end -->

![Version](https://img.shields.io/badge/version-1.5.0-db2777?style=flat-square)
![Staging Branch](https://img.shields.io/badge/branch-staging-blue?style=flat-square)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=000000)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![App Router](https://img.shields.io/badge/router-App-000000?style=flat-square)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=000000)
![Supabase](https://img.shields.io/badge/Supabase-Storage%20%2B%20Auth-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![MIT](https://img.shields.io/badge/license-MIT-3da639?style=flat-square)

> **AI agent:** เริ่มที่ [AGENTS.md](../AGENTS.md) — กฎที่พลาดง่าย ตาราง "แก้ที่ไหน" และวิธีค้นหาในคลัง
>
> **Branching & Staging:** การพัฒนาและรวมงานหลักจะทำบนกิ่ง `staging` ก่อนทดสอบและผสานเข้าสู่ `main`

## วิธีรัน

ใช้ [Bun](https://bun.sh) เป็น package manager / script runner โดย Next.js รันบน Node (ต้องการ Node ≥ 20.9)

```bash
cd ihelp
git checkout staging         # กิ่งหลักในการพัฒนา
bun install                  # ครั้งแรกครั้งเดียว
cp .env.example .env.local   # แล้วกรอกค่า — ดูตารางด้านล่าง
bun run dev                  # http://localhost:3000
```

หมายเหตุ: ห้ามใช้ `bun --bun next ...` — Next 16 build จะ crash บน Bun 1.2.x (SIGTRAP)

| ตัวแปรใน `.env.local` | ใช้กับ | ถ้าไม่ตั้ง |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | login, session (`proxy.ts` รันแทบทุก request), URL ของไฟล์ใน bucket | ตอน dev ระบบ degrade ให้รันต่อได้โดยไม่ต้องมี credentials · ใน production `proxy.ts` สร้าง client ไม่ได้จะ error |
| `DATABASE_URL` | Drizzle (`db/index.ts`) — โปรไฟล์ บทบาท insider ข้อสอบ ไฟล์ที่แชร์ | `@/db` throw ตอน import — route ที่ใช้ DB error |
| `SUPABASE_SERVICE_ROLE_KEY` | signed URL ข้อสอบเก่า · `assets:sync` | ข้อสอบเก่าและการอัปโหลดใช้ไม่ได้ |
| `ANALYTICS_SALT` | ตัวนับผู้เข้าชมที่ footer (`/api/views`) | `lib/analytics.ts` throw |
| `GITHUB_OAUTH_CLIENT_ID` · `GITHUB_OAUTH_CLIENT_SECRET` · `NEXT_PUBLIC_APP_URL` | Push ขึ้น GitHub (ดูหัวข้อด้านล่าง) | ฟีเจอร์ GitHub ใช้ไม่ได้ |
| `NEXT_PUBLIC_UPLOADS_ENABLED` | เปิดการแชร์ไฟล์ (`/upload`) | ค่าเริ่มต้นคือปิด (`0`) |
| `AI_BASE_URL` · `AI_MODEL` · `AI_API_KEY` | แชทผู้ช่วยตอบคำถาม (`/api/chat` · LLM ทางเลือก) | ไม่บังคับ — แชทยังคงค้นหาไฟล์ในคลังและตอบ FAQ (~75 ข้อ) ได้ตามปกติ แต่ไม่ยิงหาโมเดลภายนอก |

ตัวแปร `*_PATH` ที่ override ที่เก็บข้อมูล (`OJ_PROBLEMS_PATH`, `PSCP_REGISTRY_PATH`,
`AI_GUIDELINES_PATH` ฯลฯ) ใช้ได้เฉพาะตอน dev — production ไม่อ่านค่าพวกนี้

## ภาพรวม

เนื้อหาแบ่งเป็น **โมดูล** ต่อรายวิชา — ทุกวิชาประกาศครบ 11 โมดูลเหมือนกัน (`STANDARD_SPINE`
ใน `lib/courses/spine.ts`) เรียงตามสิ่งที่สมองต้องทำ: เข้าใจ → ย่อ → ฝึก → พิสูจน์
นักศึกษาไล่จากบนลงล่างได้เลย

| เฟส | โมดูล (`/courses/<วิชา>/…`) | คืออะไร |
| --- | --- | --- |
| เข้าใจ | `overview` · `map` · `summary` | ภาพรวมรายวิชา (ขอบเขตสอบ สัดส่วนคะแนน) · แผนที่เนื้อหา — ITF และ ICS มีหนึ่งหน้าต่อสัปดาห์ (เอกสาร สรุปอ่านสอบ ทดสอบตัวเอง ใบงานแล็บ) · สรุปเนื้อหาพร้อมสารบัญด้านข้าง |
| ย่อ | `cram` · `cards` | สรุปเร่งด่วน · บัตรคำ |
| ฝึก | `quiz` · `speed` · `labs` | แบบทดสอบรายบทพร้อมคำอธิบายว่าทำไมตัวเลือกอื่นผิด · ชุดจับเวลา · คลังโจทย์/ห้องแลป (PSCP ไปที่ `/pscp`) |
| พิสูจน์ | `mock` · `weak-spots` · `library` | ข้อสอบจำลองพร้อมเฉลยแสดงวิธีทำ · ห้องซ่อมจุดอ่อน · คลังทรัพยากร (สไลด์ PDF ข้อสอบเก่า ภาพสมุดจด) |

โมดูลที่วิชานั้นยังไม่มีเนื้อหาจะโชว์เป็นช่อง "เร็วๆ นี้" เพื่อให้เห็น roadmap ทั้งหมด และแยกออกว่า
"ยังไม่ทำ" กับ "ไม่มี" — `bun run readiness` พิมพ์ว่าแต่ละวิชาเติมได้กี่ช่องจาก 11
สัญญาของโมดูลอยู่ใน [docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md)

ภาพรวมรายวิชาทุกวิชาใช้โครงเดียวกันหกหัวข้อตาม
**[docs/COURSE_OVERVIEW_STANDARD.md](./docs/COURSE_OVERVIEW_STANDARD.md)** —
`bun run content:check` ตรวจให้ก่อน build ทุกครั้ง

### รายวิชาที่มีอยู่

**ปี 1 เทอม 1** — ITF · ICS · MFIT · PSCP · CHARM · FE · SPORT
**ปี 1 เทอม 2** — BFIT · DSA · OOP · PSTAT · FE2 · DL
**EN-KMITL** (ลงข้ามคณะ) — ComPro · General Chemistry

รายชื่อและรหัสวิชาอยู่ใน `lib/courses/catalog.ts`

### คลังทรัพยากร (Media Library)

สื่อทุกชิ้นจัดกลุ่มตาม **ขอบเขตสอบ** — ก่อนมิดเทอม / หลังมิดเทอม — โดยเส้นแบ่งของ
แต่ละวิชาอ่านจาก `summary.md` ของวิชานั้น ไม่ได้เดาจากเลขสัปดาห์ในชื่อไฟล์
(ITF/ICS/MFIT/PSCP แบ่งที่สัปดาห์ 7, DSA/PSTAT/OOP ที่บทที่ 7, BFIT ที่สัปดาห์ 8)
สื่อที่คร่อมทั้งเทอม เช่นแผนการสอนหรือตารางค่าวิกฤต จะโชว์ใต้ทั้งสองหมุด

ITF และ ICS เปิดคลังมาเป็น**มุมมองรายสัปดาห์** — ตารางเดียวแบ่งหัวแถวตามสัปดาห์
พร้อมแถบกระโดดไปสัปดาห์ และซ่อนฉบับปีก่อนไว้หลังปุ่ม "ฉบับเก่า" ตารางสัปดาห์อยู่ใน
`lib/library/course-weeks.ts` ไฟล์ที่มาจาก OnLearn มีปุ่ม **ต้นทาง** (`sourceUrl`)
เปิดหน้าไฟล์ต้นฉบับ

การ์ดมาจากสองชั้น: entry ที่เขียนมือใน `lib/library/subject-library.ts` (มีชื่อสองภาษา
คำอธิบาย ขอบเขตสอบ สัปดาห์) ซ้อนบน manifest ที่ scan จากไฟล์จริง — ไฟล์ที่วางลง
`public/assets/` ตามกติกาจะได้การ์ดของตัวเองโดยไม่ต้องรอใครมาเขียน entry
(การ์ดอัตโนมัติไม่มีขอบเขตสอบและมีชื่อจากชื่อไฟล์เท่านั้น)

**ตัวไฟล์ไม่ได้อยู่ใน repo** — `public/assets/` ถูก gitignore ไว้ ไฟล์จริงอยู่บน
Supabase Storage และเว็บเสิร์ฟจากที่นั่น (`lib/library/asset-url.ts` แปลง path
`/assets/…` เป็น URL ของ bucket) เก็บไฟล์ไว้ในเครื่องต่อได้เพื่อให้
`library:build` scan ได้ แต่ต้องรัน `assets:sync` เพื่ออัปโหลดขึ้น bucket
ไม่งั้นไฟล์จะ 404 บน production ทั้งที่เปิดได้ในเครื่อง

เหตุผล: ตอนที่ PDF (~908 MB) ยังอยู่ใน repo git pack โตถึง 881 MB และ build output
ทะลุ 1 GB จน build container ของ Vercel เนื้อที่หมด (ENOSPC)

**เพิ่ม/เปลี่ยนชื่อไฟล์:** วางตามกติกาใน `public/assets/` → `bun run library:build` →
`bun run library:audit` (แก้ error ที่คุณทำให้เกิด) → `bun run assets:sync` → commit JSON ที่ถูก regenerate

**ค้นหาในคลัง:** `bun run library:find -- <คำค้น> [--course ITF] [--week 13]` หรือ `jq` บน
`lib/library/resource-index.json` — ไฟล์ที่ generate ขึ้นมารวมรายวิชา โมดูล สัปดาห์ เอกสาร
และการ์ดทุกใบไว้ที่เดียว (ห้ามแก้มือ ห้าม import จากโค้ดของแอป)

### สิทธิ์การเข้าถึงคลัง — อะไรเปิด อะไรปิด

| ส่วน | ใครเข้าถึงได้ | อยู่ที่ไหน |
| --- | --- | --- |
| **รายการสื่อบนหน้า** `/courses/<วิชา>/library` | นักศึกษา IT ที่เข้าสู่ระบบแล้ว — อีเมล `@kmitl.ac.th` ที่รหัสนักศึกษามีรหัสคณะ `07` (`lib/auth/verify.ts`) | หน้านี้ prerender เป็น static ไม่มีข้อมูลไฟล์ในหน้า รายการมาจาก `/api/library/assets` ซึ่งตอบ 401 ถ้าไม่มี session ที่ผ่านการยืนยัน (ตอน dev ไม่บังคับล็อกอิน) |
| **ตัวไฟล์ทั่วไป** — สไลด์ ใบงาน ชีท ภาพสมุดจด | ใครก็ได้ที่มี URL | bucket **สาธารณะ** `ihelp-library` และ path ของไฟล์อยู่ใน repo สาธารณะ (`library-manifest.json`, `subject-library.ts`) |

การล็อกอินจึง**ซ่อนรายการบนหน้าคลัง ไม่ได้ทำให้ไฟล์เป็นส่วนตัว** — ก่อนอัปโหลด
ให้ถือว่าไฟล์ทุกชิ้นในคลังเป็นสาธารณะ ห้ามนำเข้าข้อมูลส่วนบุคคลที่ไม่ได้รับอนุญาตโดยเด็ดขาด

รายละเอียดโครงสร้าง กติกาตั้งชื่อ และ taxonomy กลางภาค/ปลายภาค อยู่ใน
**[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)**

มีไฟล์กองใหญ่ที่ยังไม่ได้จัดหมวด — วางลง `_dropzone/` แล้วชี้ AI agent ไปที่
**[docs/DROPZONE_SOP.md](./docs/DROPZONE_SOP.md)** เดี๋ยวจัดให้ทั้งชุด

## ฟีเจอร์เครื่องมือ PSCP

> เว็บนี้ไม่เขียนเนื้อหาแทนคุณ — เครื่องมือสร้างไฟล์ทุกตัวเก็บคำตอบที่คุณเขียนเอง
> แล้วจัดลง template ทางการของรายวิชา ไม่มีการส่งอะไรไปที่ OJ

- **รายการโจทย์** (`/pscp`) — จาก registry `data/pscp/problems.json` พร้อมระดับความยาก
  วันหมดเขต ป้าย Learning Log / แนะนำ และแท็บกรองรายสัปดาห์ กดโจทย์เพื่อเปิด workspace
  (drawer บนหน้ารายการ หรือหน้า `/pscp/<slug>`) ที่ตรวจโค้ดในเบราว์เซอร์ได้
- **registry ไม่ได้แก้มือ** — `bun run pscp:build` สร้างจาก branch `OP` ของ repo archive
  (`pscp-69070027`: รายการโจทย์ รายละเอียด และเฉลยอ้างอิง `solutions/oj<id>/main.py`)
  ดูขั้นตอนใน [CONTRIBUTING.md](./CONTRIBUTING.md) ข้อ 4)
- **โจทย์แนะนำ** (`/recommended`) — อ่านโจทย์พร้อมอธิบายเทคนิค เทสเคส เฉลย และควิซ
  (ข้อมูลอยู่ใน `data/recommended/`)
- **Wizard ทีละขั้นตอน** (`/make/submission`, `/make/reflection`) ตาม template ทางการ
  พร้อมคำแนะนำและตัวอย่างจากรายวิชา
- **Preview + ดาวน์โหลด** ไฟล์ `submission.md` / `ai_reflection.md`
- **แบบร่างบันทึกอัตโนมัติ** ใน browser (localStorage) แยกตามโจทย์
- **ประวัติไฟล์ที่สร้าง** (`/history`) — เก็บในเครื่อง ดูย้อนหลัง โหลดซ้ำ ลบได้
  ไม่มีข้อมูลออกจาก browser
- **ห้องสมุด** (`/library`) — อ่านเอกสาร AI-Guidelines-PSCP ทั้งชุดแบบหนังสือ
  (bundle อยู่ใน `data/ai-guidelines/`, override ด้วย env `AI_GUIDELINES_PATH` เฉพาะตอน dev)
  คนละอย่างกับหน้าคลังของแต่ละวิชา (`/courses/<วิชา>/library`)
- **ทางลัดประจำสัปดาห์** บนหัวหน้า `/pscp` — แก้ลิงก์ได้ที่ `lib/courses/shortcuts.ts`
- **สลับ TH / EN** ทั้ง UI และภาษาของ template ที่ใช้สร้างไฟล์
- **Push ขึ้น GitHub** (ไม่บังคับ) — push ไฟล์เข้า repo ของคุณที่
  `oj<id>/submission.md` และ `oj<id>/ai_reflection.md` ได้โดยตรง ทั้งจากหน้า wizard
  และหน้า `/history` หน้า `/pscp` จะแสดงป้ายว่าโจทย์ไหน upload แล้ว
- **หน้าแก้ไฟล์ใน repo** (`/repo`) — ดูไฟล์ทั้งหมดใน repo, แก้ `submission.md` /
  `ai_reflection.md` ได้ทั้งแบบ **Raw** และ **ทีละขั้นตอน** (ถอดกลับจากไฟล์เป็น
  ฟอร์มคำถามอัตโนมัติ), สร้างไฟล์ใหม่ และ commit ขึ้น repo ได้จากหน้าเดียว

## ตั้งค่า Push ขึ้น GitHub (ไม่บังคับ)

ฟีเจอร์นี้ใช้ GitHub OAuth App — access token เก็บใน httpOnly cookie เท่านั้น
(ไม่อยู่ใน localStorage) ทุก request ไป GitHub ผ่าน route ฝั่ง server ที่
`app/api/github/*`

1. สร้าง OAuth App ที่ <https://github.com/settings/developers> → **New OAuth App**
   - Authorization callback URL: `<app-url>/api/github/callback`
     (เพิ่ม `http://localhost:3000/api/github/callback` สำหรับ dev)
2. ใส่ `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` และ `NEXT_PUBLIC_APP_URL`
   ใน `.env.local` (ดูตัวแปรทั้งหมดในตาราง "วิธีรัน")
3. รันแอป กด **เชื่อมต่อ GitHub** ที่แถบด้านบนของ `/pscp` (หรือในหน้า wizard) แล้วเลือก repository ปลายทาง

> scope ที่ขอคือ `public_repo` (เขียน public repo ได้) หากต้องการ push เข้า
> private repo เปลี่ยนเป็น `repo` ที่ `OAUTH_SCOPE` ใน `lib/github/github-server.ts`

## ระบบคำนวณคะแนนและตัดเกรด (`/grade-calculator` — พัฒนาบนกิ่ง `staging`)

เครื่องมือวางแผนการเรียนและประเมินผลสอบสำหรับนักศึกษา IT KMITL (อยู่ในระหว่างการทดสอบบนกิ่ง `staging` เข้าถึงได้ที่ `/grade-calculator` หรือ redirect จาก `/calculator`):

- **แม่แบบสัดส่วนคะแนน 7 รายวิชา ปี 1 เทอม 1** — ITF, ICS, MFIT, PSCP, FE, CHARM, SPORT อ้างอิงตามประมวลการสอน 1/2569
- **สถาปัตยกรรม 3 แผง (Top / Left / Right)** — สรุปคะแนนรวม & เกรดคาดการณ์ด้านบน, รายชื่อวิชาด้านซ้าย, และฟอร์มกรอกคะแนนละเอียดด้านขวา
- **เครื่องคิดเลขคณิตศาสตร์ปลอดภัยในช่องกรอก** — รองรับนิพจน์เลขเช่น `10 + 5.5 + 8` หรือ `15 * 0.8` โดยไม่ใช้ `eval`
- **แผนที่เป้าหมายคะแนนสอบปลายภาค (Target Final Score)** — คำนวณให้อัตโนมัติว่าต้องทำข้อสอบ Final อีกกี่คะแนนจึงจะได้เกรด A, B+, B, C+, C, D+ หรือ S
- **ตัดเกรดแม่นยำตามระบบมหาวิทยาลัย** — แยกโหมดเกรดแบบตัวอักษร (A–F) และแบบผ่าน/ไม่ผ่าน (S/U สำหรับ CHARM และ SPORT) พร้อมจำลอง GPA
- **ลิ้นชักคะแนนย่อย (Subscores Drawer)** — ซอยข้อย่อยสำหรับงานแล็บ การบ้าน และ Quiz หลายครั้ง
- **นำเข้าข้อมูลจาก Excel / TSV** — คัดลอกจากตารางคะแนนแล้ววางลงระบบได้ทันที
- **บันทึกข้อมูลในเครื่อง (localStorage)** — ปลอดภัย ไม่มีการส่งคะแนนออกนอกเบราว์เซอร์

## ระบบตารางสอบและผังที่นั่งสอบ (`/exam-schedule`)

- **ค้นหาตามรหัสนักศึกษา 8 หลัก** — ดูวัน เวลา ห้องสอบ และเลขที่นั่งสอบกลางภาคและปลายภาคของทุกวิชาที่ลงทะเบียน
- **ผังที่นั่งแบบตอบสนอง (Interactive Seating Map)** — แสดงตำแหน่งที่นั่งจริงภายในห้องสอบ พร้อมข้อมูลแถวและคอลัมน์
- **ส่งออกปฏิทิน (.ics)** — เพิ่มกำหนดการสอบเข้า Apple Calendar, Google Calendar หรือ Outlook ได้ในคลิกเดียว
- **เสียงและหน้าต่างเตือน Resign Sound** — โหมดเสียงนับถอยหลังช่วยเตรียมพร้อมก่อนเริ่มสอบ

## ระบบแชทผู้ช่วยตอบคำถาม (Help Desk Chat Widget)

ผู้ช่วยอัจฉริยะแบบปุ่มลอยมุมขวาล่างทุกหน้าเว็บ (`components/chat-widget.tsx`, `app/api/chat/route.ts`):

- **ค้นหาสื่อการเรียนจากคลังได้ทันที (~40ms)** — พิมพ์ชื่อวิชา สัปดาห์ หรือประเภท เช่น "ITF week 9 สรุป" หรือ "สไลด์เน็ตเวิร์ก" ระบบจะค้นจาก catalog (`lib/chat/file-search.ts`) และส่งปุ่มเปิดพรีวิวไฟล์ทันทีโดยไม่ต้องเรียก LLM
- **คลังคำตอบสำเร็จรูป (~75 ข้อ)** — ครอบคลุมการเข้าสู่ระบบ, การใช้เครื่องมือ PSCP, กำหนดการสอบ, ขอบเขตวิชา (`lib/chat/faq.ts`)
- **โมเดลภาษาแบบ Streaming (ทางเลือก)** — หากตั้งค่า `AI_BASE_URL` / `AI_MODEL` / `AI_API_KEY` ระบบจะส่งต่อคำถามทั่วไปที่ไม่ตรงกับ FAQ ไปยัง LLM แบบสตรีมมิ่ง
- **ความปลอดภัยสูงสุด** — ข้อสอบเก่าถูกคัดออกจากการค้นหา 100% ไม่รั่วไหลไปยังแชท พร้อมระบบป้องกัน Prompt Injection (`lib/chat/guard.ts`) และ Rate Limit ตาม IP

## PG IJUDGE Pro (`/pro`)

หน้า Landing Page แนะนำส่วนขยาย [PG IJUDGE](https://github.com/PGTHEGOD) สำหรับ VS Code โดย Akarapach Yootsukprasert:

- ส่งโค้ดตรวจเข้า iJudge ตรงจากตัวโปรแกรมแก้ไขโค้ด
- รันและเทียบเทสเคสตัวอย่างในเครื่องอย่างรวดเร็วด้วยคีย์ลัด
- ตรวจสอบผลลัพธ์ Pass / Fail แยกรายเทสต์เคส

## พื้นที่อ่านหนังสือสอบปลายภาค (`/profile/[student_id]/study`)

Personal Study Space ส่วนตัวสำหรับเจ้าของแผนอ่านหนังสือ:
- ตารางอ่าน 22 วันแบบโควตาชั่วโมงครอบคลุมวิชาหลัก
- หน้าจอโฟกัสพร้อมตัวจับเวลาและโหมดเต็มจอ
- ข้อมูลจัดเก็บปลอดภัยบนเบราว์เซอร์ของเจ้าของบัญชี (localStorage)

## Tech stack

ทุกตัวในนี้ใช้งานจริง — คืออะไร และทำอะไรใน codebase นี้

### Framework & ภาษา

| เทคโนโลยี | เวอร์ชัน / บทบาท | รายละเอียดการใช้งานใน iHelp |
|---|---|---|
| **Next.js** | Next.js 16 (App Router) | App Router รันบน Node (ห้าม `bun --bun next` — build crash SIGTRAP บน Bun 1.2.x) หลาย route เป็น `force-static` เพื่ออยู่ในโควตา 12 serverless function ของ Vercel Hobby · `proxy.ts` refresh session Supabase และกักกัน `/onboarding` `/upload` `/exams` · dev รันบน Turbopack |
| **React** | React 19.2 | เรนเดอร์ทั้งหมด ส่วนใหญ่เป็น Server Component — หน้า `/pscp` โหลด registry ตอน build, ฝั่ง client มีเฉพาะตัวกรอง มุมมองตาราง/การ์ด และ workspace drawer |
| **TypeScript** | TypeScript 5 | ควบคุม Type ความปลอดภัยทั้ง codebase · `lib/schemas/content.ts` + `bun run content:check` ตรวจคลังข้อสอบตอน build ทุกข้อ |

### UI & Styling

| เทคโนโลยี | เวอร์ชัน / เครื่องมือ | รายละเอียดการใช้งานใน iHelp |
|---|---|---|
| **Tailwind CSS** | Tailwind CSS 4 | Styling ทั้งเว็บผ่าน `@tailwindcss/postcss` ไม่มี `tailwind.config` · Design Token ทั้งหมดอยู่ใน `app/globals.css` · ธีม Dark ได้รับแรงบันดาลใจจาก Figma Neutral Charcoal (`#141416`, `#1c1c1f`, `#222226`) และขอบโปร่งแสง (`oklch(1 0 0 / 8.5%)`) |
| **Radix UI** | Primitives | UI Primitives ใน `components/ui/` (dialog, select, dropdown-menu, tooltip) รองรับ focus trap และ accessibility |
| **shadcn/ui** | Components | สถาปัตยกรรม Component ที่ generate ลง repo ใน `components/ui/` ควบคุมผ่าน `cn()` + `cva` |
| **Lucide Icons** | Icons | ชุดไอคอนมาตรฐาน (`lucide-react`) สำหรับการแสดงผลทั่วทั้งเว็บไซต์ |

### เนื้อหา & Markdown

| เทคโนโลยี | บทบาท | รายละเอียดการใช้งานใน iHelp |
|---|---|---|
| **react-markdown** | Markdown Engine | เรนเดอร์สรุปเนื้อหา ชีท หน้ารายสัปดาห์ และคลังเอกสาร Pipeline: `remark-frontmatter` + `remark-gfm` + `remark-math` + `remarkNotebook` สารบัญ ScrollSpy ด้านข้างสร้างจาก heading |
| **KaTeX** | Math Rendering | แสดงสูตรคณิตศาสตร์ใน markdown (MFIT, PSTAT, DL) รองรับทั้ง inline `$…$` และ block `$$…$$` หลายบรรทัด · โหลดผ่าน `app/globals.css` |
| **Pyodide** | WebAssembly Python | รัน Python ตรวจโจทย์ในเบราว์เซอร์ผ่าน WebAssembly Web Worker สำหรับ `/pscp/[slug]` และ `/recommended/[slug]` ไม่ส่งโค้ดขึ้น server และไม่ยิงอะไรไป OJ |

### ข้อมูล & แพลตฟอร์ม

| เทคโนโลยี | บริการ / เครื่องมือ | รายละเอียดการใช้งานใน iHelp |
|---|---|---|
| **Supabase** | Auth & Storage | Google OAuth จำกัด `@kmitl.ac.th` คณะไอที (รหัส 07) ผ่าน `@supabase/ssr` และ Storage จัดเก็บสื่อใน Bucket `ihelp-library`, `ihelp-resources`, `ihelp-avatars` |
| **Drizzle ORM** | Database ORM | Schema ใน `db/` เชื่อมต่อ Postgres เก็บโปรไฟล์ผู้ใช้ ข้อมูลข้อสอบเก่า (`ihelp.exams`) ทรัพยากรที่แชร์ และตัวนับผู้เข้าชม (ใช้ schema `ihelp`) |
| **Zod** | Schema Validation | Schema ของ content contract และ payload ฟอร์ม ตรวจสอบความถูกต้องทั้ง Client และ API |
| **Vercel** | Deployment | โฮสต์หลัก (Hobby) พร้อม `@vercel/analytics` และ `@vercel/speed-insights` |
| **Bun** | Package Manager | ตัวจัดการแพ็กเกจและรันสคริปต์หลัก (`bun.lock`, สคริปต์ใน `scripts/` ผ่าน `tsx`) |
| **ESLint** | Code Quality | Flat config (`eslint.config.mjs`) ตรวจสอบความถูกต้องร่วมกับ `tsc --noEmit` |

**ไลบรารีเสริม:** `react-easy-crop` (ครอบรูปโปรไฟล์ในเบราว์เซอร์ ย่อเป็น WebP 512px) · `class-variance-authority` + `tailwind-merge` + `clsx` (ตัวช่วย `cn()`) · `katex` (CSS โหลดผ่าน `app/globals.css`)

## Scripts

| คำสั่ง | ทำอะไร |
| --- | --- |
| `bun run dev` · `build` · `start` | dev server · production build · รัน build ที่ build แล้ว |
| `bun run lint` | eslint |
| `bun run content:check` | ตรวจ spine/binding, คลังข้อสอบ, registry ของ `/recommended` และ `summary.md` ตามมาตรฐาน — รันก่อน build อัตโนมัติ (`prebuild`) |
| `bun run readiness` | แต่ละวิชาเติมได้กี่โมดูลจาก 11 และโมดูลไหนยังไม่มีวิชาไหนเติม |
| `bun run library:build` | = `library:manifest` + `library:stats` + `library:index` — ต้องรันทุกครั้งที่เพิ่ม/ลบ/เปลี่ยนชื่อไฟล์ใน `public/assets/` หรือแก้การ์ด/binding/ตารางสัปดาห์/เอกสาร |
| `bun run library:manifest` · `library:stats` · `library:index` | สร้างทีละตัว → `library-manifest.json` (การ์ดจากไฟล์จริง) · `library-stats.json` (ขนาด/จำนวนหน้า) · `resource-index.json` (ดัชนีรวมวิชา โมดูล สัปดาห์ เอกสาร การ์ด — โครงสร้างอธิบายใน `resource-index.schema.json`) |
| `bun run library:audit` | รายงานความสอดคล้องของคลัง (error / warning / info — รายการกฎใน [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) §4) · exit 1 ถ้ามี error (2 = รันไม่ได้) · `-- --remote` เทียบกับ bucket แบบอ่านอย่างเดียว · `-- --json` · `-- --course ITF` |
| `bun run library:find -- <คำค้น> [--course ITF] [--week 13] [--kind exercise] [--docs] [--json]` | ค้นการ์ด (หรือเอกสารด้วย `--docs`) จากดัชนี |
| `bun run assets:sync` | อัปโหลดไฟล์ใน `public/assets/` ที่ bucket ยังไม่มีขึ้น Supabase Storage (`-- --force` = ทั้งหมด) และแยกข้อสอบเก่าเข้า bucket แบบปิดตามกติกาเดียวกับ `isRestrictedAsset()` — ไม่ลบ object ใน bucket · ต้องใช้ `SUPABASE_SERVICE_ROLE_KEY` |
| `bun run assets:compress` | บีบ PDF ทุกไฟล์ใน `public/assets/` ด้วย Ghostscript (ต้องมี `gs` กับ `magick`; เขียนทับไฟล์เดิมเมื่อผ่านเกณฑ์) — อ่านเกณฑ์และคำเตือน "ห้ามบีบซ้ำ" ใน [docs/DROPZONE_SOP.md](./docs/DROPZONE_SOP.md) ก่อนใช้ |
| `bun run pscp:build` | = `pscp:registry` + `pscp:edges` + `pscp:verify` — สร้าง `data/pscp/problems.json` จาก branch `OP` ของ repo archive (ต้องมี Python 3 และ worktree `.op`) |
| `bun run compro:labs` | สร้าง `data/en-kmitl/compro/labs.json` จากข้อมูลที่ scrape ของ ComPro |
| `bun run db:generate` · `db:push` · `db:studio` | drizzle-kit (ดูคำเตือนเรื่อง schema ที่ใช้ร่วมกับ itgg-2026 ใน `drizzle.config.ts`) |

ไฟล์ที่ generate ขึ้นมา (`library-manifest.json`, `library-stats.json`, `resource-index.json`,
`data/pscp/problems.json`, `data/en-kmitl/compro/labs.json`) ห้ามแก้มือ — แก้ที่ต้นทางแล้วรันคำสั่งข้างบน

## ร่วมพัฒนา

Open source — อยากเพิ่มวิชาใหม่ เขียนสรุป อัปเดตโจทย์ แก้บั๊ก หรือเพิ่มฟีเจอร์
อ่าน [CONTRIBUTING.md](./CONTRIBUTING.md) และ [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)

> **Workflow กิ่ง `staging`:** โปรเจกต์ใช้กิ่ง `staging` เป็นสาขาหลักในการรวบรวมงานและทดสอบความเข้ากันได้
> ก่อนที่จะเปิด PR หรือผสานเข้าสู่ `main` กรุณาสร้าง feature branch จาก `staging` และเปิด PR มุ่งเป้าไปที่ `staging`

| เอกสาร | ไว้ทำอะไร |
| --- | --- |
| [AGENTS.md](./AGENTS.md) | จุดเริ่มต้นของ AI agent — กฎที่พลาดง่าย ตาราง "แก้ที่ไหน" วิธีค้นหาในคลัง (`CLAUDE.md` แค่ include ไฟล์นี้) |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | ขั้นตอนทีละงาน: เพิ่มวิชา เขียนสรุป เพิ่มไฟล์ โจทย์ PSCP CHANGELOG และ PR |
| [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) | แหล่งความจริงของแต่ละอย่าง path กติกาตั้งชื่อ taxonomy กลางภาค/ปลายภาค ไฟล์ที่ generate |
| [docs/DROPZONE_SOP.md](./docs/DROPZONE_SOP.md) | จัดไฟล์กองใหญ่ใน `_dropzone/` เข้าคลัง |
| [docs/COURSE_OVERVIEW_STANDARD.md](./docs/COURSE_OVERVIEW_STANDARD.md) · [docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md) | มาตรฐาน `summary.md` · สัญญาของ 11 โมดูล |
| [lib/README.md](./lib/README.md) · [content/courses/README.md](./content/courses/README.md) | โครง `lib/` และขอบเขตการนำเข้า · สถานะเนื้อหาแต่ละวิชา |

## ที่มาของสื่อการเรียน และข้อควรระวัง

ไฟล์สื่อการเรียนคัดมาจากคลัง `kmitl-archive` ซึ่งเป็นที่เก็บสื่อการเรียน
ของหลักสูตรตั้งแต่ปี 1 ถึงปี 4 — โปรเจกต์นี้ใช้เฉพาะส่วนปี 1 — และไฟล์ภาค 1/2569
ส่วนหนึ่งดาวน์โหลดจาก OnLearn (ต้องล็อกอิน) ตัวไฟล์อยู่บน Supabase Storage ไม่ได้อยู่ใน repo

- **ลิขสิทธิ์สื่อการสอน (ยังไม่ได้ตัดสินใจ)** — `summary.md` ของ Foundation English ระบุว่า workbook
  เป็นของ Edusoft Ltd. และให้ *เก็บไว้หลังระบบล็อกอินเท่านั้น* ส่วน IT-Fundamentals ระบุว่าสไลด์บรรยาย
  เป็นเอกสารของผู้สอน *ห้ามเผยแพร่สาธารณะ* — ตอนนี้ล็อกอินกั้นแค่รายการบนหน้าคลัง ตัวไฟล์ยังอยู่ใน
  bucket สาธารณะ (ดูตารางสิทธิ์ข้างบน) ถ้าจะให้ตรงตามที่ `summary.md` ระบุ ต้องย้ายไฟล์กลุ่มนี้ไป
  bucket แบบปิด หรือแก้หมายเหตุใน `summary.md`
- **ข้อมูลส่วนบุคคล** — เอกสารที่ผู้สอนแจกทั้งชั้นเรียนใน OnLearn (สไลด์ ใบงานแล็บ) เพิ่มได้ แม้ภาพหน้าจอ
  จะมีชื่อ/รหัสของ TA หรือนักศึกษาตัวอย่าง ส่วนงานของนักศึกษาคนอื่น งานกลุ่มที่มีชื่อเพื่อน ไฟล์ที่ตรวจ
  ให้คะแนนแล้ว และหน้าเว็บที่บันทึกจากบัญชีส่วนตัวห้ามเพิ่ม — เช็คลิสต์เต็มใน
  [CONTRIBUTING.md](./CONTRIBUTING.md) ข้อ 3)

## 👥 ทีมผู้พัฒนาและผู้ร่วมสนับสนุน (Core Team & Contributors)

โปรเจกต์นี้เริ่มต้น ดูแล และออกแบบสถาปัตยกรรมหลักโดย **Chatan Petry** ([@Jesselpetry](https://github.com/Jesselpetry) · Instagram: [@chatann\_](https://instagram.com/chatann_))

ขอขอบคุณเพื่อน ๆ และผู้ร่วมพัฒนาทุกท่านที่ร่วมสร้างสรรค์และแบ่งปันสื่อการเรียนรู้:

| โปรไฟล์ | ชื่อ-นามสกุล | รหัสนักศึกษา | อีเมลนักศึกษา (KMITL) | บทบาทและความรับผิดชอบหลัก | ช่องทางติดต่อ |
|:---:|:---|:---:|:---|:---|:---:|
| [![Chatan Petry](https://github.com/Jesselpetry.png)](https://github.com/Jesselpetry) | **Chatan Petry**<br>`@Jesselpetry` | `69070027` | `69070027@kmitl.ac.th` | **ผู้ก่อตั้งและผู้ดูแลหลัก (Lead Maintainer)**<br>สถาปัตยกรรมหลักของ iHelp, ระบบตัดเกรด, ธีมมืด Figma, คลังเอกสาร และเครื่องมือเตรียมสอบ | [GitHub](https://github.com/Jesselpetry)<br>[IG: @chatann_](https://instagram.com/chatann_) |
| [![Punnavit Tangkolchan](https://github.com/PhuPunnavit.png)](https://github.com/PhuPunnavit) | **Punnavit Tangkolchan**<br>`@PhuPunnavit` | `69070119` | `69070119@kmitl.ac.th` | **ผู้ร่วมพัฒนาหลัก (Core Contributor)**<br>ระบบ Help Desk Chat Widget และสรุปสไลด์บรรยาย ITF ฉบับแปลไทย Week 08–15 | [GitHub](https://github.com/PhuPunnavit)<br>[IG: @priiu_i](https://instagram.com/priiu_i) |
| [![Akarapach Yootsukprasert](https://github.com/PGTHEGOD.png)](https://github.com/PGTHEGOD) | **Akarapach Yootsukprasert**<br>`@PGTHEGOD` | `69070225` | `69070225@kmitl.ac.th` | **ผู้ร่วมพัฒนา (Contributor)**<br>หน้า Landing Page และระบบเชื่อมต่อ PG IJUDGE Extension (`/pro`) | [GitHub](https://github.com/PGTHEGOD)<br>[IG: @pgthegod_x](https://instagram.com/pgthegod_x) |
| [![Kittinan Atthasiri](https://github.com/Meaookung144.png)](https://github.com/Meaookung144) | **Kittinan Atthasiri**<br>`@Meaookung144` | `6907xxxx` | `6907xxxx@kmitl.ac.th` | **ผู้ร่วมพัฒนา (Contributor)**<br>ระบบฟอร์มแก้ไขไฟล์ส่งงาน PSCP และการเชื่อมต่อ GitHub | [GitHub](https://github.com/Meaookung144)<br>[IG: @meaookung144](https://instagram.com/meaookung144) |
| ![Tammadon Suksa](https://github.com/identicons/tammadon.png) | **Tammadon Suksa** | `69070082` | `69070082@kmitl.ac.th` | **ผู้ร่วมแบ่งปันเนื้อหา (Content Contributor)**<br>บันทึกสรุปการเรียน Notion วิชา ITF สัปดาห์ที่ 08–15 พร้อมภาพประกอบคำอธิบาย | [Notion Notes](https://app.notion.com/p/ITF-407363d85cea806abdc6c9ec2254f668) |

> 💡 **สำหรับผู้ร่วมพัฒนารายใหม่:** สามารถส่ง Pull Request เพื่อเพิ่มหรือปรับปรุงข้อมูลโปรไฟล์ รหัสนักศึกษา และอีเมลสถาบันของตนเองในตารางนี้ได้เมื่อมีส่วนร่วมในโครงการ

## License

[MIT License](./LICENSE) — © 2026 Chatan Petry

MIT ครอบเฉพาะ **โค้ด** สื่อการเรียน (สไลด์ ชีท ข้อสอบเก่า workbook) เป็นลิขสิทธิ์
ของผู้สอนและผู้จัดพิมพ์ตามเดิม **ไม่ได้อยู่ภายใต้ MIT** และไม่ได้อยู่ใน repo นี้ —
การ clone repo จึงไม่ได้สิทธิ์ในสื่อเหล่านั้นมาด้วย

ตราสัญลักษณ์ KMITL (`public/kmitl-seal.svg`, `public/kmitl-emblem.svg`,
`public/it-kmitl-logo.*`) เป็นเครื่องหมายของสถาบัน อยู่นอกขอบเขต MIT เช่นกัน
