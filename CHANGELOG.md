# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = breaking change, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อย)

## [Unreleased]

### Security

- **ข้อสอบเก่าในคลังทรัพยากรจำกัดสิทธิ์เฉพาะ insider** — ไฟล์ข้อสอบ 169 ไฟล์
  (10 วิชา) ย้ายจาก bucket สาธารณะไปอยู่ใน `ihelp-library-exams` แบบปิด เสิร์ฟผ่าน
  signed URL อายุ 10 นาที หลังผ่าน `isInsider()` แล้วเท่านั้น URL สาธารณะเดิม
  ตอบ 400 แล้ว การจัดประเภทดูจาก `category` ไม่ใช่ path — หน้าข้อสอบที่ถ่ายเก็บไว้
  ใน `ics/pages/` อยู่นอกโฟลเดอร์ `exams/` ถ้าใช้ path ตัดสินจะหลุดสาธารณะ
- **ชื่อไฟล์และ metadata ของสื่อไม่หลุดไป browser อีกต่อไป** — เดิม client
  component import จาก `lib/subject-library.ts` ซึ่ง import manifest ที่ระดับ
  module ทำให้ชื่อไฟล์ทุกชิ้นรวมข้อสอบเก่าติดไปใน JS bundle ตอนนี้ค่าที่ UI ใช้
  ย้ายไป `lib/subject-library-ui.ts` ที่ไม่ import ข้อมูลใด ๆ

### Added

- **คลังเรียนรู้ต้องเข้าสู่ระบบก่อน** — `/courses/<วิชา>/library` เปิดให้เฉพาะ
  นักศึกษาคณะ IT ที่ล็อกอินด้วยอีเมล `@kmitl.ac.th` แล้วเท่านั้น ยังไม่ล็อกอิน
  จะเห็นหน้าให้เข้าสู่ระบบแทน กันจริงฝั่ง server — หน้านี้ไม่มีข้อมูลไฟล์อยู่เลย
  รายการสื่อมาจาก `/api/library/assets` ที่ตอบ 401 ถ้าไม่มี session
  ตรงตามที่ `summary.md` ของ FE และ ITF กำกับไว้ว่าห้ามเผยแพร่สาธารณะ
- **`npm run assets:sync`** — อัปโหลดไฟล์ใน `public/assets/` ขึ้น Supabase Storage
  อัปเฉพาะไฟล์ที่ยังไม่มี และแยกข้อสอบเก่าเข้า bucket แบบปิดให้อัตโนมัติ

### Changed

- **สื่อการเรียนย้ายออกจาก repo ไปอยู่บน Supabase Storage** — ไฟล์ 670 ชิ้น
  (~908 MB) ไม่ได้อยู่ใน git อีกต่อไป `public/assets/` ถูก gitignore แล้ว
  การ clone repo จึงไม่ได้สื่อการเรียนติดไปด้วย

### Fixed

- **build บน Vercel ล้มเพราะเนื้อที่หมด (ENOSPC)** — file tracer ของ Turbopack
  ลาก ทั้งโปรเจกต์ (รวม `.git`) เข้า bundle เพราะมี `fs` call บน path ที่
  resolve ไม่ได้ตอน build ตอนนี้ override ทุกตัวถูก gate ด้วย `NODE_ENV` แล้ว
  trace ของ route `sitemap` ลดจาก 938 MB เหลือ 14.8 MB และ build output
  ลดจาก 1047 MB เหลือ 155 MB

## [0.6.0] - 2026-08-30

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- **บัญชีผู้ใช้และการยืนยันตัวตนนักศึกษา IT** — เข้าสู่ระบบด้วย Google บัญชี
  `@kmitl.ac.th` ระบบตรวจรหัสนักศึกษา 8 หลักและรหัสคณะ (หลักที่ 3–4 ต้องเป็น `07`)
  บัญชีที่ไม่ผ่านจะถูกออกจากระบบทันทีและแจ้งว่า "เฉพาะนักศึกษาคณะ IT เท่านั้น"
- **โปรไฟล์สาธารณะ `/profile/[รหัสนักศึกษา]`** — ชื่อเล่น ชื่อจริง สาขา ลิงก์
  Facebook/Instagram และรายการทรัพยากรทั้งหมดที่เจ้าของโปรไฟล์แชร์เข้าคลัง
- **รูปโปรไฟล์** — อัปโหลดเองพร้อมเครื่องมือครอบรูปและบีบอัดในเบราว์เซอร์
  (ย่อเป็น WebP 512px) หรือใช้รูปจากบัญชี Google เป็นค่าเริ่มต้น
- **หน้าตั้งค่าโปรไฟล์ครั้งแรก `/onboarding`** — เติมชื่อ-นามสกุลอัตโนมัติจาก
  ทะเบียนนักศึกษาที่ใช้ร่วมกับระบบ ITGG
- **แชร์เข้าคลัง `/upload`** — อัปโหลดสไลด์ สรุป หรือโน้ต ระบุวิชา ประเภท และ
  ช่วงสอบ (กลางภาค/ปลายภาค) ไฟล์เก็บใน Supabase Storage และให้เครดิตผู้แชร์
- **คลังข้อสอบเก่า `/exams`** — จำกัดสิทธิ์เฉพาะบทบาท insider/admin ไฟล์อยู่ใน
  ที่เก็บแบบปิด เข้าถึงผ่านลิงก์ที่หมดอายุใน 10 นาที
- **ตัวนับผู้เข้าชมที่ footer** — วันนี้ / 7 วัน / ทั้งหมด นับตามวันเวลาไทย
  เก็บเป็นค่าแฮชที่เปลี่ยนทุกวัน ไม่เก็บ IP และไม่ใช้คุกกี้ติดตาม
- **ไดอะล็อกต้อนรับแบบเลือกปลายทาง** — ถามผู้ใช้ใหม่ว่าอยากเริ่มที่ห้องแลป PSCP
  หรือคลังทรัพยากร

- **ฮับวิชา EN-KMITL (คอมโปร)** — หน้าสารบัญก่อนเริ่มทำแบบทดสอบ ปุ่มกระโดดไปข้อที่ต้องการ
  พร้อมสถานะตอบแล้ว/ถูก/ผิด และข้อสอบจำลอง 60 ข้อ รวมกับ 10 ข้อคัดสรรเป็น 70 ข้อ
- **หมวดวิชา IT-KMITL** — ฮับ ICS/Digital Logic (สรุป, แบบทดสอบ 50 ข้อ, ข้อสอบฝึกพร้อม
  เฉลยละเอียด, บทวิเคราะห์โครงข้อสอบ, คลังทรัพยากร) และฮับ MFIT คณิตศาสตร์สำหรับ IT
  (สรุป, แบบทดสอบ 45 ข้อ, ข้อสอบจำลอง, คลังทรัพยากร) ครอบคลุมพีชคณิตเชิงเส้นสัปดาห์ 1–7
- **เตรียมสอบ MFIT ตามโครงข้อสอบจริง** — สรุปเร่งด่วนเรียงตามข้อสอบ 10 ข้อจริง แผนอ่าน
  6 ชั่วโมงตามน้ำหนักคะแนน และชุดฝึกจับเวลา (ปรนัย 20 + คำนวณ 5) รวมคลังข้อสอบเป็น 65 ข้อ
- ฮับ EN-KMITL แบบหลายวิชา พร้อมข้อสอบจำลองเคมีทั่วไป 60 ข้อ และคลังทรัพยากรของตัวเอง
- **สารบัญด้านข้างแบบโต้ตอบ** ในทุกหน้าอ่าน — ไล่ตามตำแหน่งที่อ่าน แถบความคืบหน้า
  ค้นหาหัวข้อ พับ/ขยายได้ และเลื่อนแยกอิสระจากเนื้อหา
- **route เดียว `/courses/[dir]`** รองรับทุกวิชา แทนโครง en-kmitl และ it-kmitl ที่แยกกัน
  คนละต้นไม้ และ route `/pscp` — ฮับห้องแลป Python พร้อมหน้าย่อยแยกตามโมดูล
- นำเข้าสื่อการเรียนปี 1 ทั้งหมดจากคลัง `kmitl-archive` — เพิ่มไฟล์ 507 ไฟล์
  (รวมเป็น 662 ไฟล์ / 1.4 GB) ครอบคลุม 13 รายวิชาทั้งเทอม 1 และเทอม 2
  ตัดไฟล์ซ้ำด้วย content hash และข้ามไฟล์ที่ใหญ่เกิน 20 MB
- **manifest คลังทรัพยากรแบบสร้างอัตโนมัติ** (`lib/library-manifest.json`) —
  ไฟล์ที่วางลง `public/assets/` ตามกติกา path จะขึ้นการ์ดในเว็บทันที
  ไม่ต้องรอเขียน entry มือ เพิ่มการ์ดจาก 173 เป็น 679 ใบ
- script `library:manifest` และ `library:build` สำหรับสร้าง manifest + stats
- `fileType: "file"` สำหรับไฟล์ที่เบราว์เซอร์เปิดไม่ได้ (`.circ` `.xlsx` `.docx`)
  แสดงเป็นการ์ดดาวน์โหลดแทนการ preview
- เอกสาร **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** — กติกา path การตั้งชื่อไฟล์
  และ taxonomy กลางภาค/ปลายภาค
- **workflow `_dropzone/`** — วางไฟล์ที่ยังไม่ได้จัดหมวดลงโฟลเดอร์นี้ แล้วชี้ AI agent
  ไปที่ [`docs/DROPZONE_SOP.md`](./docs/DROPZONE_SOP.md) เพื่อให้จัดวิชา/หมวด/ขอบเขตสอบ
  เปลี่ยนชื่อเป็น kebab-case ย้ายเข้าที่ อัปเดต catalog แล้วล้างโฟลเดอร์ให้อัตโนมัติ
  เนื้อหาใน `_dropzone/` ถูก gitignore ไฟล์ที่จัดหมวดไม่ได้จะถูกพักไว้ที่
  `_dropzone/_hold/` พร้อมเหตุผลแทนที่จะเดา
- `content/courses/06016402-IT-Fundamentals/midterm-study-guide.md` และ
  `content/courses/README.md` นำเข้าจาก iLearn
- **พิมพ์เขียวการเรียนรู้ 11 โมดูล** (`lib/spine.ts` — `STANDARD_SPINE`) — สัญญาเดียว
  ว่า "หนึ่งวิชา" ประกอบด้วยอะไรบ้าง ใช้ร่วมกันทุกวิชา แทนที่ track 6 แบบเดิมที่มีอีก
  4 แบบแอบอยู่นอกระบบ ทุกวิชาแสดงครบทั้ง 11 ช่องเสมอ ช่องที่ยังไม่มีเนื้อหาแสดงเป็น
  ช่องล็อกพร้อมบอกว่าขาดอะไร
- `lib/course-bindings.ts` — จุดเดียวที่ประกาศว่าแต่ละวิชาเติมโมดูลไหนได้บ้าง
  เชื่อมกับ spine ผ่าน `lib/course-spine.ts` (`resolveCourseSpine`)
- route เดียว `app/courses/[dir]/[module]/page.tsx` แทนที่ไฟล์หน้าเว็บ 7 ไฟล์ที่
  เกือบซ้ำกันทั้งหมด (`summary` `exam` `mock` `cram` `plan` `analysis` `quiz`
  `library` `labs`) — เพิ่มวิชาใหม่หรือโมดูลใหม่ไม่ต้องแตะ route อีกต่อไป
- ต่อไฟล์ที่ถูกทิ้งไว้ใน `content/courses/*/archive/` เข้า route — โดยเฉพาะ MFIT
  สัปดาห์ 8–15 (เนื้อหาปลายภาคชุดเดียวที่มีอยู่ทั้งระบบ) และ `study-guide-curriculum.json`
  ผ่าน loader ใหม่ `lib/curriculum.ts`
- ฟิลด์ `chapter` บน `SubjectAsset` และ `QuizQuestion` — เชื่อมสไลด์เข้ากับสัปดาห์ที่มัน
  สอน `scripts/build-library-manifest.mjs` อ่านจากชื่อไฟล์ที่ระบุตรงๆ (`week08` `ch3`
  `lec02`) เท่านั้น backfill ได้ 264/670 ไฟล์ พร้อม chip กรองตามบทในคลังทรัพยากร
- **สัญญาคลังข้อสอบที่ตรวจได้ด้วยเครื่อง** (`lib/schemas/content.ts` + `npm run
  content:check`, รันใน `prebuild`) — ตรวจ `sourceRef` ต้องมี, option id ห้ามซ้ำ,
  `quizId` ต้องไม่ชนกัน และอื่นๆ พบหนี้เนื้อหา 223 รายการ (คำอธิบายตัวลวงซ้ำ/กลวง,
  ประกาศสองภาษาปลอม) บันทึกเป็น warning รอซ่อม
- `npm run readiness` — รายงาน Readiness Index (x/11) ของทุกวิชา
- เอกสาร **[docs/LEARNING_BLUEPRINT.md](./docs/LEARNING_BLUEPRINT.md)** — สัญญาเต็มของ
  พิมพ์เขียว 11 โมดูล และ **[Current_Architecture_Report.md](./Current_Architecture_Report.md)**
  รายงานสถาปัตยกรรมที่พิมพ์เขียวนี้อ้างอิง

### Changed

- **แท็บช่วงสอบในหน้ารายวิชาเป็นดรอปดาวน์บนมือถือ** — ปุ่มสามตัว
  (ทั้งหมด/ก่อนมิดเทอม/หลังมิดเทอม) พร้อมไอคอนและตัวเลขล้นแถวเดียวบนจอ 360px
  จนข้อความถูกตัดจนอ่านไม่ออก
- **แสดงบัญชีผู้ใช้บนแถบนำทาง** — รูปโปรไฟล์พร้อมชื่อเล่นแทนวงกลมตัวอักษรเปล่า
- นำลิงก์ iJudge ออกจากแถบนำทาง (ยังอยู่ที่ footer)
- **คลังทรัพยากรขึ้นหน้า "เร็วๆ นี้" ชั่วคราว** — ควบคุมด้วยตัวแปรสภาพแวดล้อม
  `NEXT_PUBLIC_LIBRARY_COMING_SOON` ระหว่างจัดหมวดหมู่เอกสารให้เรียบร้อย
- **ออกแบบใหม่** — navbar, footer, splash screen, subject hub และหน้าต่างพรีวิวคลัง
  ทรัพยากร พร้อมคอมโพเนนต์ร่วมชุดใหม่ (course directory, module/track grid,
  การ์ดโมดูล PSCP, lab hub, badge ของแต่ละวิชา)
- **บีบอัด PDF ทุกไฟล์** ผ่านการตรวจสอบภาพก่อน-หลัง (visual regression gate) —
  จาก 1,328 MB เหลือ 908 MB (ลด 32%) ใน 475 จาก 621 ไฟล์ ส่วน 101 ไฟล์ที่ภาพจะเสีย
  ถูกกันไว้ที่ขนาดเดิม
- แปลงหลาย route จาก force-dynamic เป็น static generation เพื่อให้อยู่ในโควตา
  12 serverless function ของ Vercel Hobby
- **เปลี่ยนชื่อไฟล์ใน `public/assets/` ทั้งหมดเป็น kebab-case** (145 ไฟล์) —
  ไฟล์เคมี 11 ไฟล์ที่มีช่องว่างในชื่อไม่ต้อง escape ใน URL อีกต่อไป
- จัดไฟล์เคมีเข้าโฟลเดอร์หมวด (`lectures/` `exercises/` `sheets/`) ให้ทุกวิชา
  ใช้โครง `<namespace>/<subject>/<category>/` เหมือนกันหมด
- ย้าย `ics-midterm-1-2564.pdf` จากรากโฟลเดอร์วิชาเข้า `exams/`
- README ขยายขอบเขตจากเครื่องมือ PSCP เป็นคลังการเรียนรู้ IT KMITL
- CONTRIBUTING เพิ่มหัวข้อเพิ่มรายวิชา เขียนสรุป และอัปโหลดสื่อการเรียน
- **COMPRO แยกข้อสอบจำลอง 60 ข้อออกจากคลังฝึก 10 ข้อ** — เดิมถูกต่อท้ายเงียบๆ ทำให้
  นักศึกษาเจอ 70 ข้อรวดตอนกด "ทำแบบทดสอบ" ตอนนี้แยกเป็นโมดูล `mock_exam` พร้อม
  progress key ของตัวเอง
- URL เก่า `/exam` `/plan` `/analysis` redirect ไปยัง segment ใหม่ (`/mock` `/cram`
  `/overview`) ที่ `next.config.ts`
- sitemap สร้างจาก spine อัตโนมัติแทนรายการ route ที่เขียนมือ
- การ์ดโมดูลในหน้าวิชาเรียงลำดับ **ที่พร้อมใช้ก่อน** ในแต่ละเฟส แทนลำดับตายตัวเดิมที่
  ทำให้การ์ดที่กดได้ปนอยู่กับการ์ดล็อกสีเทา
- **คลังทรัพยากรดึงขึ้นมาเป็นแบนเนอร์เต็มความกว้างด้านบนสุดของหน้าวิชา** พร้อม badge
  สีน้ำเงิน IT KMITL และเอฟเฟกต์ shimmer แทนที่จะเป็นการ์ดขนาดเท่ากันปนอยู่ในกริด
- ตาราง `lib/catalog.ts` เหลือหน้าที่เดียวคือ identity ของวิชา (code/officialCode/
  slug/group) ย้าย `tracks` ไปเป็น binding ใน `lib/course-bindings.ts`
- `FILE_STRUCTURE.md` หัวข้อ 7 เขียนใหม่ทั้งหมดให้ตรงกับ catalog + spine + bindings

### Fixed

- **รวมเนื้อหา EN-KMITL เข้า repo เอง** — deploy จริงไม่มี repo พี่น้องที่โค้ดเคย
  อ้างอิง ทำให้หน้าเพจ 404
- แก้การเรนเดอร์สูตรคณิตศาสตร์ (KaTeX) ใน markdown viewer
- แก้ asset ID ชนกันในตัวสร้าง library manifest
- แก้คำเตือน workspace-root ของ Turbopack และลบ lockfile ที่ไม่ตรงกับตัวจัดการ
  แพ็กเกจของโปรเจกต์อีกต่อไป
- **สูตรคณิตศาสตร์แบบ `$$...$$` หลายบรรทัดทำให้เนื้อหาที่เหลือทั้งไฟล์หายไป** —
  `remark-math` มองว่า `$$` ปิดต้องอยู่บรรทัดของตัวเองล้วนๆ ไฟล์สรุป/ข้อสอบทุกไฟล์
  ในคลังเขียนแบบ LaTeX ปกติ (`$$สูตร$$` ติดเนื้อหาทั้งสองฝั่ง) ทำให้บล็อกหลายบรรทัด
  หาจุดปิดไม่เจอและกลืนทุกอย่างที่เหลือในไฟล์เข้าไปเป็นก้อนเดียว (พบใน
  `study-guide-week08-quiz.md` ของ MFIT ที่หัวข้อ กับ 9 ใน 16 หัวข้อหายไปหลัง
  W08-Q5) แก้ที่ `MdView` จุดเดียวเพราะเป็น renderer ร่วมของทุกหน้า Markdown

## [0.5.0] - 2026-08-17

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- ระบบ **Technique Quiz**: แบบทดสอบ Active-Recall 60 ข้อ สำหรับ 10 โจทย์แนะนำ PSCP พร้อมคำอธิบายเฉลย 2 ภาษา (TH/EN) และบันทึกคะแนนในตัว
- ระบบ **Client-Side Grader**: ตรวจและรันโค้ด Python ด้วย WebAssembly (Pyodide) ภายใน Web Worker แบบ 100% Client-side
- หน้าจอ **Splitter Panel Workspace (`/recommended/[slug]`)**: ปรับหน้าโจทย์แนะนำเป็น Split View ลากปรับขนาดได้ ฝั่งซ้ายเป็น `problem.md` (KaTeX Math) และฝั่งขวาเป็น Code Grader
- ระบบ **Foldable Test Cases**: แสดง Expected Input / Output ของแต่ละ Testcase แบบพับ/ขยายได้ (ค่าเริ่มต้นพับไว้) พร้อมปุ่ม Unfold/Fold All และ Diff View แสดงช่องว่าง (`·`/`↵`)
- ระบบตรวจสอบสไตล์โค้ด **PEP-8 & PSCP Rules**
- คีย์ลัด `Ctrl+Enter` / `Cmd+Enter` สำหรับสั่งรันเทสโค้ดทันที

### Changed

- ปรับปรุงเลย์เอาต์หน้าโจทย์แนะนำ `/recommended/[slug]` ให้ Fit-to-Screen 100% ของความสูงหน้าจอ (เนื้อหาแต่ละฝั่งเลื่อนแยกกันอย่างอิสระ)
- ปรับปรุงการเรนเดอร์สูตรและสมการคณิตศาสตร์ด้วย KaTeX

### Fixed

- แก้ไขการ Hydrate ข้อมูลแบบ Primitive String ใน `useDraft` ป้องกันข้อผิดพลาด `[object Object]`

## [0.4.0] - 2026-07-21

**ผู้ร่วมพัฒนา:** Meaookung144 ([@Meaookung144](https://github.com/Meaookung144)), Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- ระบบเชื่อมต่อ GitHub (OAuth) และ Push ไฟล์ `submission.md` / `ai_reflection.md` เข้า Repository โดยตรง
- ตัวแก้ไขไฟล์ออนไลน์ (`/repo`) สำหรับแก้ไขและดูตัวอย่างไฟล์ใน Repository ก่อนทำการ Push
- หน้าประวัติเวอร์ชัน (`/version`) พร้อมลิงก์ใน Navbar สำหรับดูประวัติการอัปเดตระบบ
- ส่วนแสดงผล Avatar พร้อม AvatarBadge สำหรับผู้ร่วมพัฒนาในหน้า `/version`
- ไฟล์ `CHANGELOG.md`, `lib/changelog.ts` และแนวทางปฏิบัติตาม Changelog workflow ใน `CONTRIBUTING.md`

### Changed

- ปรับปรุง Navbar ให้รองรับอุปกรณ์เคลื่อนที่ (Mobile Responsive) พร้อมเมนู Hamburger
- ปรับปรุง UI ในส่วน GitHub Push และ Wizard ให้แสดงลำดับขั้นตอน (1–10) แบบคลิกได้ พร้อมปุ่มเชื่อมต่อไปยัง GitHub Repo

### Fixed

- แก้ไขการทำงานและการแสดงผลของ Folder Component ในหน้าจัดการ Repository

## [0.3.0] - 2026-07-20

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- ระบบสลับธีม (light / dark) พร้อมปุ่ม toggle แบบมี animation

## [0.2.0] - 2026-07-18

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- ประกาศเปิดโจทย์ Week 3

### Changed

- ปรับการเรียงลำดับโจทย์และทางลัดประจำสัปดาห์ (`lib/shortcuts.ts`)
- อัปเดตรายการโจทย์ใน `data/oj_problems.json`

## [0.1.1] - 2026-07-13

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Fixed

- แก้ไข Path การสร้างไฟล์ของโจทย์ใน Week 2

## [0.1.0] - 2026-07-10

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- ระบบสร้างไฟล์ `submission.md` และ `ai_reflection.md` แบบ Step-by-step
- ระบบคัดลอกและดาวน์โหลดไฟล์
- รองรับโจทย์ Week 1 และ Week 2 ของวิชา PSCP
