# คู่มือมาตรฐานการจัดการเวอร์ชันและบันทึกประวัติ (Version Control & Changelog Standard Guide)

คู่มือนี้กำหนดมาตรฐานการกำหนดเลขเวอร์ชัน (Versioning Scheme), การบันทึกประวัติการเปลี่ยนแปลงใน `CHANGELOG.md`, การผูกข้อมูลสองภาษาเข้ากับหน้าเว็บ `/version` (`lib/docs/changelog.ts`), และการให้เครดิตผู้ร่วมพัฒนาอย่างถูกต้องสำหรับทีมงาน \<i\>Help

---

## 1. ปรัชญาและการกำหนดเลขเวอร์ชัน (Semantic Versioning 2.0.0)

\<i\>Help ยึดหลักการของ **[Semantic Versioning 2.0.0](https://semver.org/lang/th/)** (`MAJOR.MINOR.PATCH`) ควบคู่กับไทม์ไลน์วิวัฒนาการจริงของระบบ (Milestone & Daily Evolution):

```
v MAJOR . MINOR . PATCH
   │        │       └── PATCH: แก้ไขบั๊ก (Fixed), ปรับปรุงเล็กน้อย (Improved), ซิงก์ข้อมูลโจทย์, หรือไมล์สโตนย่อย
   │        └────────── MINOR: เพิ่มฟีเจอร์ใหม่ (Added), สรุปรายวิชาใหม่, เครื่องมือช่วยสอบใหม่ โดยไม่กระทบโครงสร้างเดิม
   └─────────────────── MAJOR: การเปลี่ยนสถาปัตยกรรมใหญ่ของระบบ, ไมล์สโตนใหญ่ระดับ Production, หรือ Breaking Changes
```

### 1.1 กฎการแบ่งช่วงเวอร์ชันและการซอยย่อย (Granular Versioning Rules)
1. **ไม่รวมงานต่างช่วงเวลาไว้ในเวอร์ชันเดียว:**
   - หลีกเลี่ยงการนำงานที่พัฒนาคนละช่วงเวลา หรือผลงานของผู้พัฒนาคนละคนมารวมกองไว้ในเวอร์ชันเดียวกันเพียงเวอร์ชันเดียว
   - หากมีฟีเจอร์หรือโมดูลเด่นที่เพิ่มเข้ามา ให้ซอยเป็นไมล์สโตนย่อย เช่น `v0.4.1`, `v0.4.2`, `v0.8.1`, `v0.8.2`, `v0.8.3`, `v0.8.4` เป็นต้น เพื่อให้เห็นไทม์ไลน์และเรื่องราว (Story Timeline) การพัฒนาที่แท้จริง
2. **การจัดการ Unreleased vs Release:**
   - ในระหว่างที่งานกำลังพัฒนาอยู่ใน Branch หรือระหว่างทดสอบ สามารถใช้หัวข้อ `## [Unreleased]` ใน `CHANGELOG.md` ชั่วคราวได้
   - **เมื่อนำขึ้น Production หรือผสานเข้าสู่กิ่งหลัก (Release)** จะต้องเปลี่ยนจาก `[Unreleased]` เป็นเลขเวอร์ชันจริงและลงวันที่จริงทันที (เช่น `[1.0.0] - 8 พฤศจิกายน 2569`) ห้ามปล่อยให้ค้างเป็น Unreleased บน Production เพราะจะทำให้ผู้ใช้และระบบระบุเวอร์ชันไม่ได้ (`getCurrentVersion()` จะได้ข้อมูลไม่สมบูรณ์)
3. **การนับลำดับวิวัฒนาการหลักของ \<i\>Help:**
   - `v0.1.x` — จุดเริ่มต้น PSCP Learning-Log Maker & AI Guidelines
   - `v0.4.x` — การเชื่อมต่อ GitHub OAuth โดย Meaookung144 และหน้า `/pro` โดย PGTHEGOD
   - `v0.5.x` — ห้องแลปโจทย์แนะนำ, Client-Side WASM Grader, Technique Quiz และการขยายสู่ 11 โมดูล (Spine)
   - `v0.6.x` — ระบบสมาชิกไอที (@kmitl.ac.th), ย้ายสื่อขึ้น Supabase Storage และรีแบรนด์สู่ iHelp
   - `v0.7.x` — PWA ออฟไลน์ และคาบเรียนรายสัปดาห์ ICS พร้อมวิดีโอ YouTube
   - `v0.8.x` — คลังสื่อเปิดเต็มรูปแบบ, ตารางสอบผังที่นั่ง, Help-Desk Chat โดย PhuPunnavit, สไลด์แปลไทย และเครื่องคิดเกรด
   - `v0.9.x` — REST API คลังสื่อสาธารณะ, ยกเครื่อง Grade Calculator 3 แผง และหน้ารวมผู้พัฒนา
   - `v1.0.0` — Production Release: สถาปัตยกรรม Weekly Learning Path, ICS Track A และระบบ Contributor Credit System สมบูรณ์แบบ

---

## 2. มาตรฐานการบันทึกใน `CHANGELOG.md`

ไฟล์ `CHANGELOG.md` ที่รากของ repository อ้างอิงตาม [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) โดยปรับให้เหมาะสมกับนักศึกษาไทย:

### 2.1 โครงสร้างหัวข้อในแต่ละเวอร์ชัน
```markdown
## [1.0.0] - 8 พฤศจิกายน 2569

**ผู้ร่วมพัฒนา:** Chatan Petry ([@Jesselpetry](https://github.com/Jesselpetry), IG: [@chatann_](https://instagram.com/chatann_))

### เพิ่ม

- **ชื่อฟีเจอร์ตัวหนา** — คำอธิบายผลลัพธ์ที่ผู้ใช้หรือนักศึกษาจะได้รับ (โดย @username)

### ปรับปรุง

- **ส่วนที่ปรับปรุง** — คำอธิบายความเปลี่ยนแปลงด้าน UX, ดีไซน์ หรือประสิทธิภาพ (โดย @username)

### แก้ไข

- **บั๊กที่ได้รับการแก้ไข** — คำอธิบายข้อผิดพลาดและผลลัพธ์หลังแก้ไข (โดย @username)

### ความปลอดภัย

- **การยกระดับความปลอดภัย** — คำอธิบายโดยสรุป (ไม่เปิดเผยช่องโหว่ที่ล่อแหลม) (โดย @username)
```

### 2.2 กฎการระบุผู้พัฒนาท้ายรายการ (Contributor Attribution Syntax)
- **ทุกรายการต้องลงท้ายด้วยชื่อผู้พัฒนา:** ในรูปแบบ `(โดย @githubHandle)`
  - ตัวอย่าง: `(โดย @Jesselpetry)`, `(โดย @PhuPunnavit)`, `(โดย @PGTHEGOD)`, `(โดย @Meaookung144)`
- **เหตุผลความสำคัญ:**
  - ระบบ UI ใน `components/contributor-modal.tsx` และ `components/version-view.tsx` ใช้ Regex ตรวจจับ `\((?:โดย|by)\s+@([A-Za-z0-9_-]+)\)`
  - เมื่อระบุถูกต้อง ระบบจะแปลงข้อความท้ายรายการเป็น **Avatar Button** ขนาดเล็กโดยอัตโนมัติ และเมื่อผู้ใช้คลิกจะเปิด Modal แสดงประวัติของ Contributor คนนั้นทันที

---

## 3. การผูกข้อมูลสองภาษาเข้ากับ `lib/docs/changelog.ts`

หน้า `/version` ของเว็บไซต์ใช้ข้อมูลแบบ Static Type-safe สองภาษา (`th` / `en`) จาก `lib/docs/changelog.ts`:

```ts
export interface VersionEntry {
  version: string;          // เลขเวอร์ชัน เช่น "1.0.0", "0.9.0" (ห้ามใส่ v นำหน้า)
  date: string | null;      // ISO string เช่น "2026-11-08" (หรือ null เฉพาะระหว่าง dev)
  commit?: string;          // Short Git commit hash 7 ตัวอักษร เช่น "08aafdc"
  contributors: Contributor[];
  changes: ChangeEntry[];
}
```

### 3.1 ขั้นตอนการอัปเดตเมื่อมีเวอร์ชันใหม่ (Release Checklist)
1. **อัปเดต `CHANGELOG.md`:** เขียนบันทึกภาษาไทย พร้อมระบุวันที่และ `(โดย @username)`
2. **อัปเดต `lib/docs/changelog.ts`:**
   - เพิ่ม Entry ใหม่ไว้บนสุดของอาร์เรย์ `CHANGELOG`
   - ใส่ `version`, `date` (ISO "YYYY-MM-DD"), และ `commit` (Short SHA ล่าสุด)
   - ระบุ `contributors` ที่มีส่วนร่วมในเวอร์ชันนั้น
   - ใส่รายการ `changes` พร้อมคำแปลสองภาษา (`th` และ `en`) โดยภาษาไทยใช้ `(โดย @username)` และภาษาอังกฤษใช้ `(by @username)`
3. **ตรวจสอบความสอดคล้อง:**
   - รัน `npx tsc --noEmit -p .` เพื่อตรวจสอบ TypeScript types
   - เปิดหน้า `/version` เพื่อตรวจสอบการแสดงผลทั้งภาษาไทยและภาษาอังกฤษ
   - ทดสอบกดปุ่ม Avatar ท้ายรายการเพื่อดูว่า Contributor Modal ทำงานถูกต้อง

---

## 4. Git Branching & Promotion Workflow

```
[feature/xxx] ──── PR ────► [staging] (Integration Branch) ──── Promote ────► [main] (Production)
                               │                                                 │
                        ทดสอบฟีเจอร์รวม                                   ปล่อยขึ้นระบบจริง
                     (เช่น Grade Calculator)                             (สร้าง Git Tag vX.Y.Z)
```

1. **`staging` เป็นกิ่งหลักสำหรับการผสานงาน (Primary Integration Branch):**
   - ทุก Pull Request และการพัฒนาฟีเจอร์ใหม่ ให้ merge เข้าสู่ `staging` ก่อนเสมอเพื่อการทดสอบและตรวจสอบความปลอดภัย
2. **`main` เป็นกิ่งสำหรับ Production Stable:**
   - เมื่อผ่านการทดสอบบน `staging` เรียบร้อย จึง promote รวมเข้าสู่ `main`
   - สร้าง Git Tag เช่น `git tag v1.0.0`
3. **Conventional Commits:**
   - ใช้รูปแบบ `type(scope): message` เสมอ เช่น:
     - `feat(hub): restructure course page into weekly learning path`
     - `fix(routing): resolve week 7 MUX/DEMUX scope mismatch`
     - `docs(changelog): release v1.0.0 with learning path and contributor system`
