# สัปดาห์ที่ 15 · Focus on Web Technology

> ยังไม่เปิดใน OnLearn · สรุปล่วงหน้าจากสไลด์ปีก่อนของ รศ.ดร. ปานวิทย์ ธุวะนุติ (74 หน้า)
>
> หน้านี้จะอัปเดตเมื่อสไลด์ 1/2569 ออก — ใช้อ่านนำก่อนเข้าเรียน ไม่ใช่ขอบเขตสอบที่ยืนยันแล้ว

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
| สไลด์ปีก่อน — Focus on Web Technology | 74 | `itf-lec-week15-web.pdf` |

---

## สรุปอ่านล่วงหน้า

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
