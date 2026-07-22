# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = breaking change, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อย)

## [Unreleased]

### Changed

- เปลี่ยนป้ายประกาศหน้าโจทย์จาก Week 3 เป็น Code Interview

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

### Changed

- ต้องกดยืนยันว่าอ่านเนื้อหาแล้วก่อนดาวน์โหลดไฟล์ `submission.md` / `ai_reflection.md`
  (กันดาวน์โหลดไฟล์โดยไม่ได้ตรวจก่อน)

## [0.1.0] - 2026-07-12

เปิดตัวโปรเจกต์ครั้งแรก — \<i\>Help: PSCP Learning-Log Maker

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry))

### Added

- Wizard ทีละขั้นตอนสำหรับสร้าง `submission.md` / `ai_reflection.md` ตาม template ทางการ
- รายการโจทย์จาก `data/oj_problems.json` พร้อมระดับความยาก วันหมดเขต และแท็บกรองรายสัปดาห์
- หน้า `/library` — อ่านเอกสาร AI-Guidelines-PSCP
- หน้า `/history` — เก็บประวัติไฟล์ที่เคยสร้างไว้ใน browser (localStorage)
- แบบร่างบันทึกอัตโนมัติแยกตามโจทย์
- Splash screen และไฟล์ `CONTRIBUTING.md`
- การตรวจสอบฟอร์ม (validation) ก่อนไปขั้นตอนถัดไปของ wizard
- Open Graph image สำหรับแชร์ลิงก์

### Changed

- ปรับสีทั่วเว็บให้ผ่านมาตรฐาน WCAG AA contrast
- รีเฟรช navbar และ Open Graph image ให้เป็นเวอร์ชัน HD

### Fixed

- แก้ไอคอน Instagram
- แก้ case ของข้อความในบางจุด

[Unreleased]: https://github.com/Jesselpetry/ihelp/compare/06e3f6e...HEAD
[0.4.0]: https://github.com/Jesselpetry/ihelp/compare/e2f4b32...06e3f6e
[0.3.0]: https://github.com/Jesselpetry/ihelp/compare/9f653a5...e2f4b32
[0.2.0]: https://github.com/Jesselpetry/ihelp/compare/1c1136f...9f653a5
[0.1.1]: https://github.com/Jesselpetry/ihelp/compare/c288176...1c1136f
[0.1.0]: https://github.com/Jesselpetry/ihelp/releases/tag/v0.1.0
