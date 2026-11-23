# iHelp Brand Identity & Style Guide (คู่มือมาตรฐานแบรนด์ iHelp)

คู่มือนี้กำหนดมาตรฐานการใช้งานชื่อ เครื่องหมายคำสัญลักษณ์ (Wordmark) และอัตลักษณ์ทางภาพของ **iHelp** เพื่อให้การสื่อสาร โค้ด และ UI ทั้งหมดบนเว็บไซต์ สื่อประชาสัมพันธ์ และเอกสาร เป็นมาตรฐานเดียวกันอย่างเป็นมืออาชีพ

> [!NOTE]
> สำหรับคู่มือเชิงลึก รายการคอมโพเนนต์ ตัวอย่างโค้ด และระบบดีไซน์ซิสเต็มทั้งหมด สามารถดูได้ที่ [docs/branding/README.md](./branding/README.md)

---

## 1. กฎการเขียนชื่อแบรนด์ (Naming & Typography in Prose)

| รูปแบบ | ตัวอย่าง | บริบทการใช้งาน | ข้อควรระวัง |
|---|---|---|---|
| **`<i>Help`** (Brand Wordmark & Display) | `<Wordmark />`, แท็บเบราว์เซอร์ (`%s · <i>Help`), หน้า Splash, แบนเนอร์หัวเรื่อง | โลโก้แสดงผลใน UI, ส่วนหัวของหน้าเว็บ, ชื่อระบบในหัวเรื่องทางการ | ไม่ใส่ในประโยคเนื้อหาบทความทั่วไป เพื่อป้องกันการสับสนกับ HTML tag |
| **`iHelp`** (Canonical Prose Name) | "ยินดีต้อนรับสู่ iHelp", "ผู้ช่วย iHelp", "ร่วมแชร์เข้าคลัง iHelp", ปุ่ม "ทำโจทย์ใน iHelp" | **ประโยคทั่วไปทุกที่**: เนื้อหาบรรยาย, เอกสาร, FAQ, ข้อความแจ้งเตือน (Toasts/Alerts), ปุ่มกด, บทสนทนาของ Chatbot | **ห้าม** เขียน `IHelp`, `Ihelp`, หรือใส่เครื่องหมาย `< >` ในประโยคภาษาไทย/อังกฤษ |
| **`ihelp`** (Technical Identifier) | `ihelp.chatan.in.th`, `Jesselpetry/ihelp`, `ihelp.users`, LocalStorage `ihelp-*`, CSS `.bg-ihelp-gradient` | โดเมน, URL path, ชื่อ Repository, Schema ฐานข้อมูล, Storage bucket (`ihelp-library`), LocalStorage keys | ใช้ตัวพิมพ์เล็กทั้งหมด ไม่มีวรรคหรือสัญลักษณ์พิเศษ |
| **`%s · <i>Help`** (Metadata Standard) | `<title>ผลการเรียนและคะแนนสะสม Y1·S1 · <i>Help</title>` | Page Title ในแท็บเบราว์เซอร์ และ OpenGraph Title | ให้ Root layout จัดการ template โดยอัตโนมัติ ห้ามเขียนต่อท้ายซ้ำซ้อนในหน้ารายวิชา |

---

## 2. การใช้งานเครื่องหมาย `<` และ `>` (Angle Brackets Metaphor)

แนวคิดของแบรนด์ iHelp ได้รับแรงบันดาลใจจากแท็ก HTML และไวยากรณ์การเขียนโค้ด (Code Syntax):
- ตัว **`i`** มาจากทั้งคำว่า **Information Technology (IT)**, **Information**, และแท็ก HTML `<i>` (Italic)
- คำว่า **`Help`** สื่อถึงการช่วยเหลือ แบ่งปัน และสนับสนุนการเรียนรู้ของเพื่อนๆ พี่น้องนักศึกษา

### กฎการใช้เครื่องหมาย `<` และ `>`:
1. **เครื่องหมายเปิด `<` และเครื่องหมายปิด `>` ต้องครอบคลุมเฉพาะตัว `i` เท่านั้น (`<i>`)**:
   - `open`: `<`
   - `tag`: `i`
   - `close`: `>`
   - `text`: `Help` (ตัว H พิมพ์ใหญ่)
   - ห้ามปิดเครื่องหมายที่ท้ายคำ (ห้ามเขียน `<ihelp>`)
2. **อนุญาตให้ใช้ `< >` เฉพาะเมื่อ:**
   - แสดงผลเป็นโลโก้ / Wordmark ใน UI ด้วยคอมโพเนนต์ `<Wordmark />` (`components/brand/wordmark.tsx`)
   - แสดงในหน้า Splash Screen (อนิเมชันพิมพ์ 7 ตัวอักษร `<i>Help`)
   - แสดงในแท็บเบราว์เซอร์ (`SITE.name = "<i>Help"`) หรือหัวข้อหน้าเอกสาร
3. **ไม่อนุญาตให้ใช้ `< >` เมื่อ:**
   - เขียนในประโยคข้อความทั่วไป (เช่น *ห้าม* เขียนว่า `"ยินดีต้อนรับสู่ <i>help"` หรือ `"ระบบ <i>help พัฒนาโดย..."`)
   - ข้อความแจ้งเตือนผู้ใช้ (Error / Toast / Dialog message) ให้ใช้คำว่า **`iHelp`** เสมอ

---

## 3. องค์ประกอบ Wordmark Component (`<Wordmark />`)

ใน `components/brand/wordmark.tsx` กำหนดการเรนเดอร์ไว้ดังนี้:
```tsx
const { tagOpen, tagText, tagClose, text } = SITE.wordmark; 
// tagOpen: "<", tagText: "i", tagClose: ">", text: "Help"

return (
  <span className={className}>
    <span className={accentClassName}>{tagOpen}</span>
    <span className={accentClassName}>{tagText}</span>
    <span className={accentClassName}>{tagClose}</span>
    <span>{text}</span>
  </span>
);
```
- `<i>` = สีหลักของเว็บไซต์ (`text-primary` หรือ `#2357A5` / Tailwind cyan-blue)
- `Help` = สีตัวอักษรปกติ (`text-foreground`)
- ฟอนต์ = Monospace เสมอ (`font-mono`)

---

## 4. สีประจำแบรนด์ (Brand Color Palette)

- **iHelp Signature Royal Blue Gradient**:
  - Start (Cerulean): `#3a72c8`
  - Via (Sapphire): `#2357A5` (KMITL Blue Accent)
  - End (Navy): `#163980`
  - Gradient มาตรฐาน: `linear-gradient(135deg, #3a72c8, #2357A5, #163980)` หรือคลาส `.bg-ihelp-gradient`
- **Dark Theme Charcoal Palette** (อ้างอิงจาก `AGENTS.md` และ `app/globals.css`):
  - Canvas / Background: `#141416`
  - Card Surface: `#1c1c1f`
  - Popover / Dialog: `#222226`
  - Border: Subtle white opacity `oklch(1 0 0 / 8.5%)` / `border-white/10`
- **การแยกแยะสีวิชาเฉพาะ**:
  - สีชมพู **PSCP Pink** (`#db2777` / `#ec4899`) เป็นสีเฉพาะรายวิชา PSCP ไม่ใช่สีประจำแบรนด์ iHelp ส่วนกลาง

---

## 5. ตราสัญลักษณ์คณะ IT KMITL (Watermark / Badge)

- ในการ์ดหรือแบนเนอร์ เมื่อใช้โลโก้ IT KMITL เป็นลายน้ำ (Watermark) ให้ใช้แบบ **สีขาวล้วน (Monochrome White)** ด้วยการส่ง `monochrome="currentColor"` ร่วมกับคลาส `text-white`
- กำหนดค่าความโปร่งแสง (Opacity) อยู่ที่ **`opacity-25` (25%)**
- ไม่ใส่ drop-shadow ในตัวลายน้ำ เพื่อคงความสะอาด สบายตา และไม่แย่งสายตาจากเนื้อหาหลัก
