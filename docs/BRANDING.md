# iHelp Brand Identity & Style Guide (คู่มือมาตรฐานแบรนด์ iHelp)

คู่มือนี้กำหนดมาตรฐานการใช้งานชื่อ เครื่องหมายคำสัญลักษณ์ (Wordmark) และอัตลักษณ์ทางภาพของ **iHelp** เพื่อให้การสื่อสาร โค้ด และ UI ทั้งหมดบนเว็บไซต์ สื่อประชาสัมพันธ์ และเอกสาร เป็นมาตรฐานเดียวกันอย่างเป็นมืออาชีพ

---

## 1. กฎการเขียนชื่อแบรนด์ (Naming & Typography in Prose)

| รูปแบบ | ตัวอย่าง | บริบทการใช้งาน | ข้อควรระวัง |
|---|---|---|---|
| **`iHelp`** (มาตรฐานหลัก) | "ยินดีต้อนรับสู่ iHelp", "ผู้ช่วย iHelp", "เกี่ยวกับ iHelp" | ใช้ในประโยคทั่วไป, เนื้อหาบทความ, FAQ, Chatbot, ปุ่ม, และการสนทนาทั้งภาษาไทยและอังกฤษ | **ห้าม** เขียน `IHelp`, `Ihelp`, หรือใส่เครื่องหมาย `< >` ในเนื้อหาบรรยาย |
| **`<i>Help`** (ชื่อในแท็บเบราว์เซอร์ & Markdown Headings) | `<title><i>Help · คลังเรียนรู้ IT KMITL</title>`, `# <i>Help` | ใช้เฉพาะใน HTML Page Title (`SITE.name`), เอกสารทางการระดับหัวเรื่องใหญ่ | ไม่ใช้ในประโยคบรรยายทั่วไป เพื่อป้องกันการสับสนกับ HTML tag |
| **`<ihelp>`** (Brand Wordmark / โลโก้แสดงผล) | Navbar โลโก้, หน้า Splash Screen, Onboarding Modal | วาดผ่านคอมโพเนนต์ `<Wordmark />` โดยมี `<i` และ `>` เป็นสี Accent ฟ้าคราม | ฟอนต์กำหนดเป็น Monospace เสมอ |
| **`ihelp`** (Technical Identifiers) | `ihelp.chatan.in.th`, `Jesselpetry/ihelp`, `ihelp.users`, `ihelp-exam-student-id` | โดเมน, Git repo, Database schema, Storage buckets, LocalStorage keys, CSS keyframes | ใช้ตัวพิมพ์เล็กทั้งหมด ไม่มีเว้นวรรคหรือสัญลักษณ์ |

---

## 2. การใช้งานเครื่องหมาย `<` และ `>` (Angle Brackets Metaphor)

แนวคิดของแบรนด์ iHelp ได้รับแรงบันดาลใจจากแท็ก HTML และไวยากรณ์การเขียนโค้ด (Code Syntax):
- ตัว **`i`** มาจากทั้งคำว่า **Information Technology (IT)**, **Information**, และแท็ก HTML `<i>` (Italic)
- คำว่า **`Help`** สื่อถึงการช่วยเหลือ แบ่งปัน และสนับสนุนการเรียนรู้ของเพื่อนๆ พี่น้องนักศึกษา

### กฎการใช้เครื่องหมาย `<` และ `>`:
1. **อนุญาตให้ใช้ `< >` เฉพาะเมื่อ:**
   - แสดงผลเป็นโลโก้ / Wordmark ใน UI ด้วยคอมโพเนนต์ `<Wordmark />` (`components/brand/wordmark.tsx`)
   - แสดงในหน้า Splash Screen (อนิเมชันพิมพ์ตัวอักษร 7 ตัว `<ihelp>`)
   - แสดงในแท็บเบราว์เซอร์ (`SITE.name = "<i>Help"`) หรือหัวข้อหน้าเอกสาร
2. **ไม่อนุญาตให้ใช้ `< >` เมื่อ:**
   - เขียนในประโยคข้อความทั่วไป (เช่น *ห้าม* เขียนว่า `"ยินดีต้อนรับสู่ <i>help"` หรือ `"ระบบ <i>help พัฒนาโดย..."`)
   - ข้อความแจ้งเตือนผู้ใช้ (Error / Toast / Dialog message) ให้ใช้คำว่า **`iHelp`** เสมอ

---

## 3. องค์ประกอบ Wordmark Component (`<Wordmark />`)

ใน `components/brand/wordmark.tsx` กำหนดการเรนเดอร์ไว้ดังนี้:
```tsx
const { open, text, close } = SITE.wordmark; // open: "<i", text: "help", close: ">"
return (
  <>
    <span className="text-primary">{open}</span>
    {text}
    <span className="text-primary">{close}</span>
  </>
);
```
- `<i` = สีหลักของเว็บไซต์ (`text-primary` หรือ `#2357A5` / Tailwind cyan-blue)
- `help` = สีตัวอักษรปกติ (`text-foreground`)
- `>` = สีหลักของเว็บไซต์ (`text-primary`)

---

## 4. สีประจำแบรนด์ (Brand Color Palette)

- **iHelp Signature Blue**:
  - Primary Base: `#2357A5` (KMITL Blue Accent)
  - Light Shimmer: `#3a72c8`
  - Dark Shade: `#163980`
  - Gradient มาตรฐาน: `linear-gradient(135deg, #3a72c8, #2357A5, #163980)`
- **Dark Theme Charcoal Palette** (อ้างอิงจาก `AGENTS.md` และ `app/globals.css`):
  - Canvas / Background: `#141416`
  - Card Surface: `#1c1c1f`
  - Popover / Dialog: `#222226`
  - Border: Subtle white opacity `oklch(1 0 0 / 8.5%)`

---

## 5. ตราสัญลักษณ์คณะ IT KMITL (Watermark / Badge)

- ในการ์ดหรือแบนเนอร์ เมื่อใช้โลโก้ IT KMITL เป็นลายน้ำ (Watermark) ให้ใช้แบบ **สีขาวล้วน (Monochrome White)** ด้วยการส่ง `monochrome="currentColor"` ร่วมกับคลาส `text-white`
- กำหนดค่าความโปร่งแสง (Opacity) อยู่ที่ **`opacity-25` (25%)**
- ไม่ใส่ drop-shadow ในตัวลายน้ำ เพื่อคงความสะอาด สบายตา และไม่แย่งสายตาจากเนื้อหาหลัก

