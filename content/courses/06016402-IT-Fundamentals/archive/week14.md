# สัปดาห์ที่ 14 · Web Technology

> บรรยายออนไลน์ผ่าน Zoom อ. 6 ต.ค. 2569 (Sec 1, 3 เวลา 13:45–15:45 · Sec 2 เวลา 16:00–18:00) · แล็บ 14 ศ. 16 ต.ค. 2569 (มีคลิปย้อนหลังในหัวข้อแล็บ)
>
> สไลด์ Lecture 14 *Introduction to Web Technology* ฉบับ 1/2569 และคลิปบันทึกการสอนอยู่ใน OnLearn แต่ยังไม่อยู่ในคลัง —
> สรุปด้านล่างมาจากสไลด์ปีก่อน *Focus on Web Technology* ของ รศ.ดร. ปานวิทย์ ธุวะนุติ (74 หน้า) ถ้าเนื้อหาต่างกันให้ยึดฉบับใน OnLearn

## อ่านจบแล้วต้องตอบได้

- แยกเครื่องมือสร้างเว็บ: text editor · code editor · CMS
- บอกหน้าที่ของ **HTML · CSS · JavaScript**
- เขียนโครงหน้าเว็บพื้นฐานและใช้แท็ก heading · paragraph · image · link · list
- แยกการใส่ CSS 3 แบบ และ selector แต่ละชนิด
- อธิบายการทำงานของ web client-server และ browser (DOM · CSSOM · JS runtime)

---

## เอกสารประจำสัปดาห์

| เอกสาร | หน้า | ไฟล์ในคลัง |
|---|:---:|---|
| สไลด์บรรยาย — Introduction to Web Technology (ฉบับ 2569) | 96 | `itf-lec-week14-web-technology-2569.pdf` |
| สไลด์ประกอบแล็บ — Web App 2 (JavaScript) | 27 | `itf-lab-week14-web-app-2-slide.pdf` |
| ใบงานแล็บ — Web App 2 · JavaScript & DOM | 13 | `itf-lab-week14-web-app-2-sheet.pdf` |
| สไลด์ฉบับปีก่อน — Focus on Web Technology | 74 | `itf-lec-week15-web.pdf` |
| สไลด์ Focus on Web Development (Discovering Computers ©2017) | 95 | `itf-lec-focuson-web.pdf` |
| ชีททบทวน Web Technology | 54 | `itf-sheet-reviews-web-app.pdf` |

> **มีใน OnLearn แต่ยังไม่อยู่ในคลัง** — คลิปบันทึกการสอน (OnLearn id 27632, 27716)

---

## สรุปอ่านสอบ (จากสไลด์ปีก่อน)

### 1. เครื่องมือและเทคโนโลยีของเว็บ

- **Text editor** คล้าย word processor แต่ไม่มีการจัดรูปแบบ · **code editor** เพิ่มฟีเจอร์ช่วยเขียนโค้ด
- **CMS** = ระบบจัดการเผยแพร่และแก้ไขเนื้อหา · นักพัฒนาทำ theme แล้วผู้ดูแลใส่เนื้อหาเอง เช่น WordPress
- **HTML** ใช้ **tag** บอกโครงสร้างหน้า · **CSS** กำหนดฟอนต์ สี เลย์เอาต์ · **JavaScript** เป็นภาษาโปรแกรมที่ browser รันได้
- **Responsive** = ปรับขนาดเนื้อหาตามจอของอุปกรณ์
- **W3C** ดูแลมาตรฐาน HTML และมี validator ตรวจ HTML5

### 2. โครงหน้าเว็บ

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website Title</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>ย่อหน้าแรก</p>
  <img src="img/dog.jpg" alt="dog" width="384">
  <a href="https://www.kmitl.ac.th">KMITL</a>
</body>
</html>
```

- heading มี 6 ระดับ `<h1>`–`<h6>` · `<p>` แบ่งย่อหน้า — browser ไม่สนการขึ้นบรรทัดในไฟล์
- `<img src>` อ้างไฟล์ภาพแยกต่างหาก · ไฟล์อยู่โฟลเดอร์เดียวกันใช้ `cat.jpg` · อยู่ในโฟลเดอร์ย่อยใช้ `img/dog.jpg`
- **Link (hyperlink)** เป็นได้ทั้งข้อความและภาพ · รายการใช้ `<ul>` (ไม่มีลำดับ) และ `<ol>` (มีลำดับ)

### 3. CSS

| วิธีใส่ | ที่อยู่ |
|---|---|
| **Inline** | attribute `style` ในแท็ก |
| **Internal** | แท็ก `<style>` ในส่วน `<head>` — มีผลทั้งหน้า |
| **External** | ไฟล์ `.css` แยก |

- Rule = **selector** + declaration block `{ property: value; }`

| Selector | ตัวอย่าง |
|---|---|
| Element | `p { … }` |
| **Id** | `#para1 { … }` — ใช้ได้กับ element เดียวในหน้า |
| **Class** | `.center { … }` — ใช้ได้หลาย element |
| Universal | `* { … }` |
| Group | `h1, h2, p { … }` |

- `<div>` แบ่งส่วนของหน้าเพื่อจัดรูปแบบ อ้างด้วย id หรือ class

### 4. Web Client–Server และ Browser

- Browser ขอไฟล์ → **web server** หาไฟล์ อ่าน แล้วตอบกลับ · web server software เช่น Apache · Nginx · Caddy · Microsoft IIS
- ใน browser: **HTML parser** สร้าง **DOM** · **CSS parser** สร้าง **CSSOM** · **JS runtime** รัน JavaScript ที่แก้ HTML และ CSS ได้
- **Node.js** = JavaScript runtime สร้างบน Chrome V8 ทำให้ JavaScript รันนอก browser ได้ (backend)
- ท้ายสไลด์: single page application และแนวคิด **API** (เปรียบกับปลั๊กไฟที่ให้ใช้ไฟจากโรงไฟฟ้า)

---

## จุดที่มักพลาด

- **Id ใช้ `#` · class ใช้ `.`** — id ใช้ได้ element เดียว class ใช้ได้หลายตัว
- Internal CSS อยู่ใน `<head>` ไม่ใช่ `<body>`
- HTML เป็น markup language ไม่ใช่ภาษาโปรแกรม · JavaScript เป็นภาษาโปรแกรม

---

## ทดสอบตัวเอง

1. แท็กใดกำหนดข้อความบนแท็บของ browser
2. CSS แบบใดเขียนไว้ในไฟล์ `.css` แยก
3. selector `.center` เป็นชนิดใด
4. องค์กรใดดูแลมาตรฐาน HTML
5. ส่วนใดของ browser สร้าง DOM

**เฉลย** — 1. `<title>` · 2. external · 3. class selector · 4. W3C · 5. HTML parser

---

## แล็บ — Web App 2 · JavaScript & DOM (ศ. 16 ต.ค. 2569)

> ต่อยอดจาก Lab 13 นำ To-do List มาเขียน JavaScript จัดการ DOM และบันทึกข้อมูลลง Local Storage เพื่อไม่ให้ข้อมูลหายเมื่อรีเฟรชหน้าเว็บ โดยแบ่งการทำเป็น 2 ส่วน: เขียนโค้ดด้วยตนเอง (`week14`) และใช้ AI CLI Agent (`week14-ai`)

```youtube
uGbbBMKC10Q | คลิปย้อนหลัง Lab 14 (ศ. 16 ต.ค. 69)
```

### สรุปเนื้อหาและคำสั่งสำคัญจากใบงาน

1. **การเชื่อมโยงไฟล์ JavaScript**
   - ใส่ `<script src="script.js"></script>` ไว้**ท้ายสุดของ `<body>`** ก่อนปิดแท็ก เพื่อรอให้เบราว์เซอร์สร้าง DOM elements ให้เสร็จสมบูรณ์ก่อนสคริปต์เริ่มทำงาน (หากใส่ใน `<head>` สคริปต์จะหาปุ่มหรือ element ไม่เจอ)

2. **DOM (Document Object Model) & คำสั่งที่ใช้**
   - แปลงเอกสาร HTML เป็นโครงสร้างต้นไม้ (Window → Document → HTML → Head / Body)
   - `const input = document.getElementById("id")` — เชื่อมตัวแปรไปยัง Element
   - `document.createElement("li")` — สร้างแท็ก HTML ใหม่
   - `element.textContent = "..."` — ใส่ข้อความในแท็ก
   - `container.appendChild(newElement)` — นำ Element ที่สร้างไปต่อท้ายใน Container
   - `button.addEventListener("click", () => { ... })` — ดักจับ Event คลิกปุ่ม
   - `input.value` — อ่านหรือล้างข้อความในช่องกรอก (`input.value = ""`)

3. **Local Storage**
   - เก็บข้อมูลฝั่ง Client ข้อมูลไม่หายเมื่อรีเฟรชหรือปิดเบราว์เซอร์
   - `localStorage.setItem("todos", JSON.stringify(items))` — บันทึก Array เป็น JSON string
   - `JSON.parse(localStorage.getItem("todos")) || []` — ดึง JSON string แปลงกลับเป็น Array

4. **การต่อยอด To-do List และ AI CLI Agent**
   - **โฟลเดอร์ `week14` (ทำเอง):** ผูกปุ่มเพิ่มรายการสร้าง `<li>` พร้อมปุ่มลบ, กดปุ่มลบแล้วลบ `<li>` ออกจากหน้า, บันทึกสถานะลง Local Storage ทุกครั้งที่มีการเปลี่ยนแปลง
   - **โฟลเดอร์ `week14-ai` (ใช้ AI):** ก๊อปปี้ไฟล์จาก `week13-ai` สั่งงานผ่าน CLI Agent (OpenCode) ด้วย Prompt ระบุ **เป้าหมาย · ข้อจำกัด · โครงสร้าง id · การทำงาน** พร้อมแคปภาพหน้าจอคำสั่ง Prompt
   - **ส่งงาน:** ZIP `lab14-รหัสนักศึกษา.zip` (ประกอบด้วยโฟลเดอร์ `week14`, `week14-ai` และภาพ prompt)
