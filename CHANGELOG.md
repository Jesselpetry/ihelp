# Changelog

ทุกการเปลี่ยนแปลงที่มีผลต่อผู้ใช้ของโปรเจกต์นี้จะถูกบันทึกไว้ในไฟล์นี้

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
และเลขเวอร์ชันอ้างอิงจาก [Semantic Versioning](https://semver.org/lang/th/)
(`MAJOR.MINOR.PATCH` — MAJOR = breaking change, MINOR = ฟีเจอร์ใหม่, PATCH = แก้บั๊ก/ปรับเล็กน้อย)

## [Unreleased]

ยังไม่มีการเปลี่ยนแปลงที่รอปล่อยเวอร์ชันถัดไป

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

[Unreleased]: https://github.com/Jesselpetry/ihelp/compare/e2f4b32...HEAD
[0.3.0]: https://github.com/Jesselpetry/ihelp/compare/9f653a5...e2f4b32
[0.2.0]: https://github.com/Jesselpetry/ihelp/compare/1c1136f...9f653a5
[0.1.1]: https://github.com/Jesselpetry/ihelp/compare/c288176...1c1136f
[0.1.0]: https://github.com/Jesselpetry/ihelp/releases/tag/v0.1.0
