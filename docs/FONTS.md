# ฟอนต์ใน \<i\>Help

เอกสารนี้ตอบสองคำถาม: **แต่ละ family มีน้ำหนักอะไรให้ใช้จริง** และ
**ควรใช้อันไหนตอนไหน**

ทุก family ลงทะเบียนที่เดียวคือ [`app/layout.tsx`](../app/layout.tsx) ผ่าน `next/font`
ซึ่ง self-host ให้ทั้งหมด (ไม่มี request ออกไป Google ตอนผู้ใช้เปิดเว็บ)
และ map เป็น theme token ใน [`app/globals.css`](../app/globals.css)

---

## 1. สี่ family ที่มีในเว็บ

| Family | Tailwind | CSS variable | ใช้กับ |
| --- | --- | --- | --- |
| IBM Plex Sans Thai | `font-sans` | `--font-sans` | **ค่าเริ่มต้นของทั้งเว็บ** (`html { @apply font-sans }`) — UI, ปุ่ม, nav, label, ตัวเลข |
| Geist Mono | `font-mono` | `--font-geist-mono` | code, `<pre>`, output ของ iJudge |
| Mali | `font-[family-name:var(--font-mali)]` | `--font-mali` | ข้อความ accent ลายมือ ใช้อยู่ที่เดียวใน [`recommended-hub.tsx`](../components/recommended-hub.tsx) |
| THSarabunNew | `font-sarabun` | `--font-sarabun` | **เนื้อความ Markdown ทุกที่** (ใส่ให้อัตโนมัติโดย `MdView`) — ดูข้อ 3 |

> Mali ยังไม่มี theme token เลยต้องเขียนแบบ arbitrary `font-[family-name:…]`
> ส่วน Sarabun มี token แล้ว ใช้ `font-sarabun` ได้ตรงๆ

---

## 2. THSarabunNew มีน้ำหนักอะไรบ้าง

**มีแค่ 4 face นี้ ไม่มีมากกว่านี้**

| น้ำหนัก | style | ไฟล์ | เขียนใน Tailwind |
| --- | --- | --- | --- |
| 400 | normal | `THSarabunNew-Regular.woff2` | `font-normal` (หรือไม่ต้องเขียน) |
| 400 | italic | `THSarabunNew-Italic.woff2` | `italic` |
| 700 | normal | `THSarabunNew-Bold.woff2` | `font-bold` |
| 700 | italic | `THSarabunNew-BoldItalic.woff2` | `font-bold italic` |

ไม่มี 100 / 200 / 300 / 500 / 600 / 800 / 900

### กับดัก: `font-medium` เงียบสนิท

เบราว์เซอร์ไม่ error เวลาขอน้ำหนักที่ไม่มี — มันเลือกตัวใกล้เคียงให้ตาม
[CSS Fonts Level 4 font matching](https://www.w3.org/TR/css-fonts-4/#font-style-matching)
ซึ่งกับ THSarabunNew (มีแค่ 400 กับ 700) ออกมาเป็นแบบนี้:

| ที่เขียน | ที่ได้จริง | ผลที่เห็น |
| --- | --- | --- |
| `font-thin` / `font-light` (100–300) | **400** | เหมือนปกติเป๊ะ |
| `font-normal` (400) | 400 | ✅ ตามที่ขอ |
| `font-medium` (500) | **400** | ⚠️ **เหมือนปกติเป๊ะ — เขียนไปก็ไม่มีอะไรเกิดขึ้น** |
| `font-semibold` (600) | **700** | ⚠️ ได้ bold เต็ม ไม่ใช่ semibold |
| `font-bold` (700) | 700 | ✅ ตามที่ขอ |
| `font-extrabold` / `font-black` (800–900) | **700** | เหมือน bold |

เหตุผลที่ 500 ตกลงล่างแต่ 600 ขึ้นบน: spec บอกว่าถ้าน้ำหนักที่ขออยู่ในช่วง 400–500
ให้ไล่หาขึ้นไปถึง 500 ก่อน **แล้วค่อยไล่ลง** — 500 เลยเจอ 400 ก่อน 700
ส่วนถ้าขอเกิน 500 ให้ไล่ขึ้นก่อน — 600 เลยเจอ 700

**สรุป: ในบล็อกที่เป็น `font-sarabun` ให้ใช้แค่ `font-normal` กับ `font-bold`**
ถ้าต้องการน้ำหนักกลางๆ (500/600) แปลว่าที่ตรงนั้นไม่ควรใช้ Sarabun ตั้งแต่แรก — ใช้ `font-sans`

---

## 3. ใช้ตอนไหน

### อัตโนมัติ — เนื้อหา Markdown ทุกที่

[`MdView`](../components/md-view.tsx) เป็น renderer ของ Markdown ตัวเดียวในเว็บนี้
(ที่เดียวที่ import `react-markdown`) และมันใส่ `font-sarabun` ที่ root ให้เสมอ
**ไม่มี prop ให้เปิด/ปิด** — เนื้อหา Markdown ทุกที่จึงเป็น THSarabunNew อัตโนมัติ

ที่ได้รับผลทั้งหมด:

| ไฟล์ | คือ |
| --- | --- |
| [`library-reader.tsx`](../components/library-reader.tsx) | เอกสารเต็มฉบับในคลัง |
| [`module-reader.tsx`](../components/module-reader.tsx) | เนื้อหารายสัปดาห์ |
| [`en-kmitl-summary-reader.tsx`](../components/en-kmitl-summary-reader.tsx) | สรุปรายวิชา |
| [`recommended-reader.tsx`](../components/recommended-reader.tsx) | โจทย์แนะนำฉบับเต็ม |
| [`course-summary-panel.tsx`](../components/course-summary-panel.tsx) | พาเนลสรุปรายวิชา |
| [`md-preview.tsx`](../components/md-preview.tsx) | แท็บ "แบบอ่านง่าย" ของ wizard |
| [`technique-quiz.tsx`](../components/technique-quiz.tsx) | เฉลยข้อสอบ |
| [`pscp-workspace.tsx`](../components/pscp-workspace.tsx) | โจทย์ PSCP ข้าง editor |
| [`compro-lab-hub.tsx`](../components/compro-lab-hub.tsx) | คำอธิบาย lab |
| [`recommended-hub.tsx`](../components/recommended-hub.tsx) | การ์ดในกริด |

ถ้าจะเพิ่มที่ใหม่ ก็แค่ใช้ `MdView` ตามปกติ ไม่ต้องทำอะไรเพิ่ม:

```tsx
<MdView markdown={content} />
```

### ❌ อย่าใส่ `font-sarabun` เองนอก `MdView`

ปุ่ม, nav, badge, tab, label ในฟอร์ม, ตัวเลขสถิติ — ปล่อยให้เป็น `font-sans`
ตามค่าเริ่มต้น พวกนี้เป็นข้อความสั้นขนาดเล็ก ซึ่งเป็นจุดอ่อนของ Sarabun พอดี

### เหตุผลที่ใช้กับ Markdown

THSarabunNew ตัวแคบกว่า IBM Plex Sans Thai (ความกว้าง `ก` = 0.386em เทียบกับ 0.611em)
ย่อหน้าภาษาไทยยาวๆ เลยจุตัวอักษรได้มากกว่าต่อบรรทัด และอ่านรวดเร็วกว่า —
นั่นคือสิ่งที่ฟอนต์นี้ถูกออกแบบมาทำ

แต่ความแคบเดียวกันนี้ทำให้ label สั้นๆ ตัวเล็กๆ ดูบีบและอ่านยาก
และวรรณยุกต์ที่ซ้อนบนสระ (เช่น "ที่") มีที่ว่างน้อยกว่า ซึ่งสำคัญมากกับข้อความขนาดเล็ก
**ถ้าจุดไหนใน `MdView` อ่านแล้วอึดอัด (เช่น เฉลยสั้นๆ หรือการ์ดในกริด) วิธีแก้คือใส่
`font-sans` ทับที่จุดนั้น ไม่ใช่ถอด `font-sarabun` ออกจาก `MdView`**

---

## 4. ทำไมไม่ต้องบวกขนาดเอง — `size-adjust: 140%`

THSarabunNew วาดตัวอักษรเล็กกว่าฟอนต์อื่นในเว็บนี้มาก ที่ `font-size` เท่ากัน:

| | ความสูง `ก` | x-height (ละติน) |
| --- | --- | --- |
| THSarabunNew | 0.400em | 0.340em |
| IBM Plex Sans Thai | 0.558em | 0.516em |

ถ้าปล่อยไว้ดิบๆ `text-base` ของ Sarabun จะดูเล็กกว่าข้อความรอบๆ ราว 30%
`app/layout.tsx` เลยใส่ `size-adjust: 140%` ลงใน `@font-face` (140% ≈ 0.558 / 0.400)

**ผลคือใช้ `text-sm` / `text-base` / `text-lg` ตามปกติได้เลย ไม่ต้องบวกขนาดชดเชย**
ขนาดที่เห็นจะเท่ากับ `font-sans` ที่ค่าเดียวกัน

> **ถ้าวันหนึ่งต้องทำหน้าที่เลียนแบบเอกสารราชการ** (THSarabunNew 16pt ตามระเบียบงานสารบรรณ)
> จำไว้ว่าขนาดถูกขยาย 1.4 เท่าไปแล้ว — ต้องหารกลับ
> 16pt = 21.33px → ตั้ง `font-size: 15.24px` ถึงจะได้ 16pt จริง

---

## 4b. line-height ต้อง 1.9 — ไม่ใช่เรื่องรสนิยม

THSarabunNew ไม่มี GPOS mark positioning สำหรับภาษาไทยเลย
(`GPOS: scripts=['latn'] features=['kern']` — ไม่มี `mark` / `mkmk`)
ตำแหน่งวรรณยุกต์มาจากการสลับ glyph สำเร็จรูปผ่าน GSUB `ccmp` + Thai shaper ของ HarfBuzz
ซึ่ง **ทำงานถูกต้อง** — `ก่` ได้ `uni0E48.alt2` (ตัวต่ำ เพราะไม่มีสระบน),
`ที่` ได้ `uni0E48` (ตัวสูง เพราะมีสระอีอยู่ใต้), `ปี` ได้ `uni0E35.alt1` (ยกหลบ ป)

ปัญหาไม่ได้อยู่ที่การวางวรรณยุกต์ แต่อยู่ที่ **ความสูงรวมของกองสระ/วรรณยุกต์**
หลังคูณ `size-adjust: 140%` แล้ว:

| | THSarabunNew ×1.4 | IBM Plex Sans Thai |
| --- | --- | --- |
| ยอดวรรณยุกต์สูงสุด | +1.170em | +0.889em |
| หางสระ/พยัญชนะต่ำสุด | −0.343em | −0.350em |
| **ช่วงหมึกรวม** | **1.513em** | **1.239em** |
| เหลือระหว่างบรรทัดที่ `leading-relaxed` (1.625) | **0.112em** ⚠️ | 0.386em |

เหลือ 0.112em แปลว่าวรรณยุกต์ของบรรทัดล่างเกือบชนหางของบรรทัดบน
สายตาเลยจับคู่วรรณยุกต์ผิดบรรทัด — **นี่คืออาการ "สระลอย"** ไม่ใช่ฟอนต์วางสระผิด

`1.9` คือค่าที่ทำให้ THSarabunNew ได้ที่ว่างระหว่างบรรทัดเท่ากับที่ `--font-sans` ได้ที่ 1.625
(1.625 − 1.239 + 1.513 ≈ 1.9)

**ถ้าจะแก้ leading ใน `MdView` ต้องแก้ 3 ที่พร้อมกัน** — root, `p` และ `li`
เพราะ `p`/`li` ตั้ง leading ของตัวเองทับ root อยู่ ส่วน `pre` คง `leading-relaxed` ไว้
เพราะเป็น Geist Mono ไม่มีกองวรรณยุกต์ และหัวข้อใช้ `leading-[1.6]`
(เดิม `leading-snug` = 1.375 ซึ่งต่ำกว่าช่วงหมึก 1.513 หัวข้อไทยที่ตัดบรรทัดจะทับกัน)

### สีต้องเต็ม ไม่ใช่ `/90`

เส้นอักษร THSarabunNew บางกว่า IBM Plex Sans Thai มาก พอเจอ `text-foreground/90`
บวกกับ `antialiased` บน `<html>` แล้วอ่านแล้วจาง `MdView` จึงใช้ `text-foreground` เต็ม

---

## 5. อะไรที่ไม่เป็น Sarabun ถึงจะอยู่ใน `MdView`

| ส่วน | ฟอนต์ที่ได้ | เพราะ |
| --- | --- | --- |
| `` `code` `` และ `<pre>` | Geist Mono | `mdComponents` ใส่ `font-mono` ทับไว้แล้ว |
| สูตร KaTeX | KaTeX fonts | มาจาก `katex.min.css` |
| ข้อความไทยในสูตร | IBM Plex Sans Thai | `globals.css` บังคับ `.katex .text { font-family: var(--font-sans) !important }` |
| **ตาราง** | **THSarabunNew** | ⚠️ ไม่มี override — สืบทอดมาด้วย ถ้าตารางไหนอ่านยากให้ใส่ `font-sans` ที่ `<table>` |

---

## 6. โหลดยังไง

ตั้งค่าไว้ใน [`app/layout.tsx`](../app/layout.tsx):

| option | ค่า | เหตุผล |
| --- | --- | --- |
| `preload` | `false` | 4 face รวม ~295 KB `variable` อยู่บน `<html>` ทุกหน้า ถ้าเปิด preload จะไปบล็อกหน้าที่ไม่มี Markdown เลยด้วย (หน้า login, โปรไฟล์, อัปโหลด) ปล่อยให้โหลดตอนเจอ `font-sarabun` จริงคุ้มกว่า |
| `display` | `"swap"` | ระหว่างโหลดให้เห็น fallback ไปก่อน ไม่ปล่อยข้อความว่าง |
| `adjustFontFallback` | `false` | Next.js คำนวณ metrics ของ fallback จากไฟล์ดิบ **โดยไม่รู้เรื่อง `size-adjust: 140%`** ถ้าเปิดไว้ ตัวอักษรจะกระโดด 40% ตอน swap (CLS) |
| `fallback` | `IBM Plex Sans Thai, Sarabun, Tahoma, sans-serif` | ถ้าโหลดไม่สำเร็จ ตกไปที่ฟอนต์ไทยที่มีอยู่แล้วในเว็บก่อน |
| `variable` | `--font-sarabun` | ประกาศตัวแปรบน `<html>` เฉยๆ — **ไม่ได้เปลี่ยนฟอนต์ของอะไรเลย** จนกว่าจะมีคนเขียน `font-sarabun` |

ชื่อ family ที่ Next.js สร้างให้มาจากชื่อตัวแปร (`thSarabun`) — **อย่าเปลี่ยนชื่อตัวแปรนี้เป็น
`sarabun`** เพราะ CSS เทียบชื่อ family แบบไม่สนตัวพิมพ์ใหญ่เล็ก มันจะไปชนกับ `Sarabun`
ใน `fallback` แล้วทำให้ fallback ตัวนั้นตายไปเลย

---

## 7. ไฟล์ และวิธีสร้างใหม่

ไฟล์ที่ใช้จริงอยู่ใน [`app/fonts/`](../app/fonts/) เป็น WOFF2:

| ไฟล์ | ขนาด |
| --- | --- |
| `THSarabunNew-Regular.woff2` | 123 KB |
| `THSarabunNew-Bold.woff2` | 99 KB |
| `THSarabunNew-Italic.woff2` | 36 KB |
| `THSarabunNew-BoldItalic.woff2` | 36 KB |

แปลงมาจาก TTF ต้นฉบับ (510 glyph, `unitsPerEm` 1000) ด้วย `fonttools`:

```bash
pip install 'fonttools[woff]'

fonttools ttLib.woff2 compress -o app/fonts/THSarabunNew-Regular.woff2    'THSarabunNew.ttf'
fonttools ttLib.woff2 compress -o app/fonts/THSarabunNew-Bold.woff2       'THSarabunNew Bold.ttf'
fonttools ttLib.woff2 compress -o app/fonts/THSarabunNew-Italic.woff2     'THSarabunNew Italic.ttf'
fonttools ttLib.woff2 compress -o app/fonts/THSarabunNew-BoldItalic.woff2 'THSarabunNew BoldItalic.ttf'
```

TTF ต้นฉบับไม่ได้อยู่ใน repo — WOFF2 ครอบคลุมทุกเบราว์เซอร์ที่เว็บนี้รองรับแล้ว
ถ้าวันหลังต้อง gen PDF ฝั่ง server ค่อยเอา TTF กลับเข้ามา

> **เรื่อง license:** THSarabunNew เป็นฟอนต์ในชุด "ฟอนต์แห่งชาติ" ที่ SIPA สนับสนุน
> (ออกแบบโดย ศุภกิจ เฉลิมลาภ) เผยแพร่ให้ใช้ฟรี — แต่โฟลเดอร์ต้นฉบับที่รับมา
> **ไม่มีไฟล์ license แนบมาด้วย** ถ้าจะแจกจ่ายต่อหรือใช้เชิงพาณิชย์ ควรไปดึงตัวฉบับ
> พร้อม license จากแหล่งทางการ ([f0nt.com](https://www.f0nt.com/release/th-sarabun-new/)) มาเก็บไว้ก่อน
