# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = breaking change, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อย)

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
