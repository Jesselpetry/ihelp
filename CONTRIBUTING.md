# ร่วมพัฒนา \<i\>Help

โปรเจกต์นี้เป็น open source ([MIT](./LICENSE)) — ยินดีรับทุก contribution
จากนักศึกษา ไม่ว่าจะอัปเดตรายการโจทย์ แก้บั๊ก หรือเพิ่มฟีเจอร์ใหม่

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

## 1) อัปเดตรายการโจทย์ (มีโจทย์สัปดาห์ใหม่)

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

## 2) ปรับปรุงระบบ (แก้บั๊ก / เพิ่มฟีเจอร์)

โครงสร้างหลัก:

| ที่           | คืออะไร                                                       |
| ------------- | ------------------------------------------------------------- |
| `app/`        | หน้าเว็บ (App Router) + API routes สร้างไฟล์ md               |
| `components/` | React components (`components/ui/` = shadcn-style primitives) |
| `lib/`        | logic: โหลดโจทย์, สร้าง markdown, ประวัติ, i18n, ฯลฯ          |
| `data/`       | ข้อมูลรายวิชา: โจทย์, template ทางการ, เอกสาร AI guidelines   |

ธรรมเนียมของโค้ดเบสนี้:

- TypeScript + Tailwind ทั้งหมด ตามสไตล์ไฟล์ข้างเคียง
- ข้อความ UI ทุกชิ้นต้องมีสองภาษา ผ่าน pattern `LText` (`{ th, en }`)
  แล้วเรียก `t(L.key, locale)` — ห้าม hardcode ภาษาเดียว
- ข้อมูลผู้ใช้ (แบบร่าง, ประวัติ) เก็บใน localStorage เท่านั้น
  ห้ามส่งขึ้น server
- หลักการสำคัญ: เว็บนี้ **ไม่เขียนเนื้อหาแทนนักศึกษา** —
  ฟีเจอร์ใหม่ต้องไม่ generate คำตอบ ไม่ solve โจทย์ และไม่ส่งอะไรไป OJ

ก่อนเปิด PR:

```bash
bun run lint    # ต้องผ่าน ไม่มี error
bun run build   # ต้อง build ผ่าน
```

## 3) อัปเดต Changelog / Version History

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
4. แก้ `CHANGELOG.md` ตามข้อ 3) ด้านบนไว้ในรอบ PR เดียวกัน
5. เจอบั๊กแต่ยังไม่มีเวลาแก้ — เปิด GitHub Issue ไว้ก็ช่วยมากแล้ว

ขอบคุณที่ช่วยกันทำให้เครื่องมือนี้ดีขึ้น 🙌
