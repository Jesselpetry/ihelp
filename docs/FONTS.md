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
| THSarabunNew | 0.612em | 0.520em |
| IBM Plex Sans Thai | 0.558em | 0.516em |

ถ้าปล่อยไว้ดิบๆ `text-base` ของ Sarabun จะดูเล็กกว่าข้อความรอบๆ ราว 9%
`app/layout.tsx` เลยใส่ `size-adjust: 91%` ลงใน `@font-face` (91% ≈ 0.558 / 0.612)

**ผลคือใช้ `text-sm` / `text-base` / `text-lg` ตามปกติได้เลย ไม่ต้องบวกขนาดชดเชย**
ขนาดที่เห็นจะเท่ากับ `font-sans` ที่ค่าเดียวกัน

> **ถ้าวันหนึ่งต้องทำหน้าที่เลียนแบบเอกสารราชการ** (THSarabunNew 16pt ตามระเบียบงานสารบรรณ)
> จำไว้ว่าขนาดถูกปรับ 0.91 เท่าไปแล้ว — ต้องหารกลับ
> 16pt = 21.33px → ตั้ง `font-size: 23.44px` ถึงจะได้ 16pt จริง

---

## 4b. line-height ต้อง 1.9 — ไม่ใช่เรื่องรสนิยม

THSarabunNew ไม่มี GPOS mark positioning สำหรับภาษาไทยเลย
(`GPOS: scripts=['latn'] features=['kern']` — ไม่มี `mark` / `mkmk`)
ตำแหน่งวรรณยุกต์มาจากการสลับ glyph สำเร็จรูปผ่าน GSUB `ccmp` + Thai shaper ของ HarfBuzz
ซึ่ง **ทำงานถูกต้อง** — `ก่` ได้ `uni0E48.alt2` (ตัวต่ำ เพราะไม่มีสระบน),
`ที่` ได้ `uni0E48` (ตัวสูง เพราะมีสระอีอยู่ใต้), `ปี` ได้ `uni0E35.alt1` (ยกหลบ ป)

ปัญหาไม่ได้อยู่ที่การวางวรรณยุกต์ แต่อยู่ที่ **ความสูงรวมของกองสระ/วรรณยุกต์**
หลังคูณ `size-adjust: 140%` แล้ว:

| | THSarabunNew ×0.91 | IBM Plex Sans Thai |
| --- | --- | --- |
| ยอดวรรณยุกต์สูงสุด | +1.164em | +0.889em |
| หางสระ/พยัญชนะต่ำสุด | −0.341em | −0.350em |
| **ช่วงหมึกรวม** | **1.505em** | **1.239em** |
| เหลือระหว่างบรรทัดที่ `leading-relaxed` (1.625) | **0.120em** ⚠️ | 0.386em |

เหลือ 0.112em แปลว่าวรรณยุกต์ของบรรทัดล่างเกือบชนหางของบรรทัดบน
สายตาเลยจับคู่วรรณยุกต์ผิดบรรทัด — **นี่คืออาการ "สระลอย"** ไม่ใช่ฟอนต์วางสระผิด

`1.9` คือค่าที่ทำให้ THSarabunNew ได้ที่ว่างระหว่างบรรทัดเท่ากับที่ `--font-sans` ได้ที่ 1.625
(1.625 − 1.239 + 1.505 ≈ 1.9)

**ถ้าจะแก้ leading ใน `MdView` ต้องแก้ 3 ที่พร้อมกัน** — root, `p` และ `li`
เพราะ `p`/`li` ตั้ง leading ของตัวเองทับ root อยู่ ส่วน `pre` คง `leading-relaxed` ไว้
เพราะเป็น Geist Mono ไม่มีกองวรรณยุกต์ และหัวข้อใช้ `leading-[1.6]`
(เดิม `leading-snug` = 1.375 ซึ่งต่ำกว่าช่วงหมึก 1.505 หัวข้อไทยที่ตัดบรรทัดจะทับกัน)

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
| `preload` | `false` | 4 face รวม ~163 KB `variable` อยู่บน `<html>` ทุกหน้า ถ้าเปิด preload จะไปบล็อกหน้าที่ไม่มี Markdown เลยด้วย (หน้า login, โปรไฟล์, อัปโหลด) ปล่อยให้โหลดตอนเจอ `font-sarabun` จริงคุ้มกว่า |
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
| `THSarabunNew-Regular.woff2` | 39 KB |
| `THSarabunNew-Bold.woff2` | 39 KB |
| `THSarabunNew-Italic.woff2` | 43 KB |
| `THSarabunNew-BoldItalic.woff2` | 42 KB |

ที่มา: [`Phonbopit/sarabun-webfont`](https://github.com/Phonbopit/sarabun-webfont)
— TH Sarabun New **v1.3** ฉบับ webfont ที่ถอด hinting ออกแล้ว (529 glyph, `unitsPerEm` 2048)
repo แจกเป็น EOT/TTF/WOFF ซึ่งไม่มี WOFF2 จึงแปลงเองด้วย `fonttools`:

```bash
pip install 'fonttools[woff]'
git clone --depth 1 https://github.com/Phonbopit/sarabun-webfont.git
cd sarabun-webfont/fonts

C="fonttools ttLib.woff2 compress -o"
$C ../../app/fonts/THSarabunNew-Regular.woff2    thsarabunnew-webfont.ttf
$C ../../app/fonts/THSarabunNew-Bold.woff2       thsarabunnew_bold-webfont.ttf
$C ../../app/fonts/THSarabunNew-Italic.woff2     thsarabunnew_italic-webfont.ttf
$C ../../app/fonts/THSarabunNew-BoldItalic.woff2 thsarabunnew_bolditalic-webfont.ttf
```

### ทำไมใช้ v1.3 ที่เก่ากว่า v1.35

เส้นตัวอักษรเหมือนกันเป๊ะ — วัดแล้วช่วงหมึกหลังปรับ `size-adjust` ได้ 1.505em เท่ากันทั้งคู่
ต่างกันแค่ v1.3 ถอดตาราง hinting (`fpgm` `prep` `hdmx` `VDMX` `LTSH`) ออกไป
ซึ่งเบราว์เซอร์ยุคนี้ไม่อ่านอยู่แล้ว ผลคือ **163 KB แทนที่จะเป็น 295 KB**

ข้อแลกเปลี่ยนเดียว: v1.3 มี GSUB เฉพาะ script `latn` (v1.35 มี `DFLT` `latn` `thai` ด้วย)
การจัดตำแหน่งวรรณยุกต์เลยไม่ได้มาจาก GSUB `ccmp` แต่ไปพึ่ง PUA fallback ของ shaper แทน
(U+F700–U+F71D ซึ่งเป็นรหัส PUA ภาษาไทยของ Mac ดั้งเดิม — ฟอนต์นี้มีครบ 30 ตัว)
ตรวจกับ HarfBuzz แล้วได้ผลเดียวกับ v1.35 ทุกคำ:

| คำ | v1.3 (PUA) | v1.35 (GSUB thai) | ผล |
| --- | --- | --- | --- |
| `ก่` | `uniF70A` | `uni0E48.alt2` | วรรณยุกต์ต่ำ (ไม่มีสระบน) |
| `ที่` | `uni0E48` | `uni0E48` | วรรณยุกต์สูง (มีสระอีใต้) |
| `ปี` | `uniF702` | `uni0E35.alt1` | ยกหลบ ป |
| `ปื้` | `uniF704 uniF714` | `uni0E37.alt1 uni0E49.alt3` | ยกหลบทั้งคู่ |

> **เรื่อง license:** THSarabunNew ออกแบบโดย ศุภกิจ เฉลิมลาภ อยู่ในชุด "ฟอนต์แห่งชาติ"
> ที่ SIPA สนับสนุน เผยแพร่ให้ใช้ฟรี — แต่ทั้ง repo ต้นทางและโฟลเดอร์ต้นฉบับที่รับมา
> **ไม่มีไฟล์ license แนบมาด้วย** ถ้าจะแจกจ่ายต่อหรือใช้เชิงพาณิชย์ ควรไปดึงตัวฉบับ
> พร้อม license จากแหล่งทางการ ([f0nt.com](https://www.f0nt.com/release/th-sarabun-new/)) มาเก็บไว้ก่อน
>
> ปัจจุบันฟอนต์ตระกูลนี้มีฉบับที่ Cadson Demak ออกแบบใหม่อยู่บน Google Fonts ชื่อ
> [Sarabun](https://fonts.google.com/specimen/Sarabun) ซึ่งมี GPOS `mark`/`mkmk` ครบ
> (แก้อาการสระลอยได้ที่ตัวฟอนต์เลย) และมี 8 น้ำหนักจริง แต่เป็นคนละดีไซน์กับ THSarabunNew

---

## 8. Notebook variant — สไตล์สมุดจดเลคเชอร์

`MdView` มี variant ที่สอง เปิดด้วย prop:

```tsx
<MdView markdown={content} variant="notebook" />
```

ตอนนี้เปิดอยู่ที่ **module `summary` เท่านั้น** — เซตที่
[`app/courses/[dir]/[module]/page.tsx`](../app/courses/[dir]/[module]/page.tsx)
ส่งผ่าน `ModuleReader` ลงมา ดังนั้น mock exam, lab และ overview
ยังเป็นเอกสารเรียบเหมือนเดิม (28 จาก 30 หน้า summary ได้ class นี้
อีก 2 หน้าไม่มีเอกสารให้ render)

> **หมายเหตุ:** proposal เดิมระบุให้ทดสอบที่ `en-kmitl-summary-reader.tsx`
> แต่ component นั้น **ไม่มีใคร import** — เป็น dead code ไม่มี route ไหนเรียก
> เนื้อหา `data/en-kmitl/สรุปคอมโปร-Midterm.md` ที่ตั้งใจจะทดสอบ
> จริงๆ แล้ว render ผ่าน `ModuleReader` ที่ `/courses/<dir>/summary`

### สิ่งที่เปลี่ยน / ไม่เปลี่ยน

| เปลี่ยน | ไม่เปลี่ยน |
| --- | --- |
| bullet + เลขลำดับ (หมึกแดง) | เนื้อความ — ยังเป็น THSarabunNew `leading-[1.9]` |
| blockquote (เส้นกั้นหน้าคู่) | หัวข้อ h1–h4 |
| `<hr>` (เส้นประแดง คง `···` ไว้) | code / `<pre>` (Geist Mono) |
| `*italic*` → หมึกแดง | ตาราง, รูป, ลิงก์ |
| เส้นเศษส่วน + `\boxed{}` + `.mrel` ใน KaTeX | |

### สีหมึก — ใช้ token ไม่ใช่ `red-500`

นิยามที่ `:root` / `.dark` ใน [`globals.css`](../app/globals.css) แล้วลงทะเบียนใน
`@theme inline` จึงใช้เป็น utility ได้ทุกแบบ (`text-ink-red`, `marker:text-ink-red`,
`border-ink-red/70`, `decoration-ink-red`)

| token | light | dark |
| --- | --- | --- |
| `--ink-red` | `#dc2626` | `#fb7185` (คอรัล — `#dc2626` บนพื้น `#171c23` ทั้งคอนทราสต์ต่ำและแสบตา) |
| `--ink-blue` | `#2563eb` | `#7dd3fc` |
| `--ink-highlight` | `#fde68a` | `#b45309` |

### syntax ใหม่สำหรับไฮไลต์และขีดเส้นใต้

```markdown
{==ข้อความไฮไลต์==}      -> <mark>
{++ข้อความขีดเส้นใต้++}   -> <u>  (เส้นหยักหมึกแดงใน notebook variant)
```

เขียน `<mark>` / `<u>` ตรงๆ **ไม่ได้** เพราะโปรเจกต์ไม่ได้ใช้ `rehype-raw`
HTML ดิบในไฟล์ Markdown จะถูกทิ้งก่อนถึง renderer (เหตุผลเดียวกับที่มี ```` ```youtube ```` fence)

ทำไมต้องมีวงเล็บปีกกา — ถ้าใช้ `==…==` / `++…++` เปล่าๆ จะชนกับเนื้อหาวิชาโปรแกรมมิ่ง
สแกน `content/` `data/` `lib/` แล้วเจอ **919 จุดที่มี `==`** (เช่น `if __name__ == "__main__"`)
และ **9 จุดที่มี `++`** — ในนั้นมี `C/C++` สองครั้งในตารางเดียวกันของ
`สรุปคอมโปร-Midterm.md` ซึ่งจะทำให้ทุกอย่างระหว่างสองจุดนั้นถูกขีดเส้นใต้
พอใส่ปีกกาแบบ CriticMarkup แล้วเหลือ **0 จุดชน**

ตัวแปลงอยู่ที่ [`lib/docs/remark-notebook.ts`](../lib/docs/remark-notebook.ts)
แตะเฉพาะ `text` node — code span, code fence และ math เก็บค่าไว้ใน `value` ไม่ใช่ `children`
ตัว walker จึงไม่เดินเข้าไป `a == b` ในโค้ดเลยปลอดภัยโดยโครงสร้าง
plugin ทำงานทั้งสอง variant เพื่อไม่ให้ `{==…==}` โผล่เป็นตัวอักษรดิบ
ต่างกันแค่สไตล์ของ `mark`/`u` ที่ได้ออกมา
