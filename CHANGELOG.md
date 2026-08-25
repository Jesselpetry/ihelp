# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = breaking change, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อย)

## [Unreleased]

### Added

- **นำเข้าสื่อการเรียนปี 1 ทั้งหมดจากคลัง `kmitl-archive`** — เพิ่มไฟล์ 507 ไฟล์
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

### Changed

- **เปลี่ยนชื่อไฟล์ใน `public/assets/` ทั้งหมดเป็น kebab-case** (145 ไฟล์) —
  ไฟล์เคมี 11 ไฟล์ที่มีช่องว่างในชื่อไม่ต้อง escape ใน URL อีกต่อไป
- จัดไฟล์เคมีเข้าโฟลเดอร์หมวด (`lectures/` `exercises/` `sheets/`) ให้ทุกวิชา
  ใช้โครง `<namespace>/<subject>/<category>/` เหมือนกันหมด
- ย้าย `ics-midterm-1-2564.pdf` จากรากโฟลเดอร์วิชาเข้า `exams/`
- README ขยายขอบเขตจากเครื่องมือ PSCP เป็นคลังการเรียนรู้ IT KMITL
- CONTRIBUTING เพิ่มหัวข้อเพิ่มรายวิชา เขียนสรุป และอัปโหลดสื่อการเรียน

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
