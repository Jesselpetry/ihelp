# PSCP — พิมพ์เขียวสำหรับสร้างสื่อ

> ไฟล์สำหรับคนสร้างเนื้อหา ไม่ถูก render ในเว็บ — ดู `docs/COURSE_OVERVIEW_STANDARD.md` §4
> ส่วนที่นักศึกษาอ่านอยู่ใน [`summary.md`](./summary.md)

## 1. คลังข้อสอบ

| ชนิดข้อ | สัดส่วน | ตัวอย่าง |
|---|---|---|
| **Trace output** | 35% | ให้โค้ด → เขียนผลลัพธ์ที่พิมพ์ออกมา |
| **Find the bug** | 20% | โค้ดที่ผิด 1 บรรทัด → ระบุบรรทัดและแก้ |
| **Fill in the blank** | 20% | เติมนิพจน์/เงื่อนไขที่ขาด |
| **เขียนโปรแกรม** | 25% | โจทย์สั้น ๆ เขียนได้ใน 15 บรรทัด |

**หลุมพรางที่ควรใช้ทำตัวลวง** ⭐ — `input()` คืน `str` · `range` ไม่รวม stop ·
`/` vs `//` · สตริง immutable · `list` assignment เป็น reference · การเยื้องผิดชั้น ·
`=` vs `==` · ลูปที่รันเกิน/ขาดไป 1 รอบ (off-by-one)

## 2. แบบฝึกหัด

สคีมาที่โปรเจกต์กำหนดไว้แล้วใน `docs/DEVELOPMENT.md`:

```ts
type LabChallenge = {
  id: string;                 // "pscp-lab-01"
  courseCode: "PSCP";
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  testCases: { input: string; expected: string; hidden?: boolean }[];
  hints: string[];
};
```

**ข้อกำหนดเพิ่มสำหรับการ generate**

| มิติ | ข้อกำหนด |
|---|---|
| Test case ต่อโจทย์ | อย่างน้อย 5 ชุด — ตัวอย่างจากโจทย์ 2 ชุด (เปิด) + edge case 3 ชุด (ซ่อน) |
| Edge case บังคับ | ค่าน้อยสุด/มากสุดของช่วง · ค่า 0 · ค่าติดลบ (ถ้าโจทย์อนุญาต) · อินพุตบรรทัดเดียว vs หลายบรรทัด |
| Hint | 3 ระดับ — (1) ชี้แนวคิด (2) ชี้โครงสร้างโค้ด (3) ชี้บรรทัดที่มักผิด **ห้ามให้โค้ดเฉลย** |
| การรันในเว็บ | ใช้ Pyodide (มีอยู่แล้วใน `ihelp/lib/pyodide-client.ts`) ตรวจ stdout เทียบตรง |
| สไตล์โค้ด | ตรวจ PEP8 พื้นฐาน (มี `ihelp/lib/pep8-rules.ts` ให้ใช้ซ้ำ) |

## 3. ข้อสอบจำลอง

- **กลางภาค** — 2 ส่วน (พบในคลัง `PSCP_Midterm_Part1/Part2`)
  - Part 1: อ่านโค้ด/หาผลลัพธ์/แก้บั๊ก
  - Part 2: เขียนโปรแกรมแก้โจทย์ 3–4 ข้อ
- **ปลายภาค** — เพิ่มโจทย์ list/dict/file และให้ไล่รอบการทำงานของอัลกอริทึมเรียงลำดับ
- **Mock lab** — จับเวลา 2 ชั่วโมง ให้โจทย์ OJ 4 ข้อ (Easy 2 · Medium 1 · Hard 1)

### การเชื่อมกับ iHelp

- `data/oj_problems.json` ใช้เป็นดัชนีโจทย์ได้เลย (มี id, ชื่อ, ความยาก, วันหมดเขต, ป้าย Learning Log, URL)
- เทมเพลต `submission.md` / `ai_reflection.md` อยู่ใน `AI-Guidelines-PSCP/templates`
- นโยบายการใช้ AI อยู่ใน `AI-Guidelines-PSCP/instructions/COURSE_AI_INSTRUCTIONS.md`

## 4. แหล่งที่มาในคลัง

| ประเภท | จำนวน | หมายเหตุ |
|---|---|---|
| สไลด์บรรยาย | 7 ไฟล์ (Chapter 01–05) | พิมพ์จาก markdown — ฟอนต์ไทยในไฟล์ PDF อ่านยาก ให้เปิดไฟล์จริงประกอบ |
| Quiz | Week 01, 03, 07–09, 11–14 + Quiz 02, 04, 05, 06 | **เป็นภาพสแกนทั้งหมด** ต้องทำ OCR ก่อนใช้ |
| แบบฝึกหัด/การบ้าน | 11 ไฟล์ | รวม `PSCP_Ex_SortingTest.pdf` ที่อ่านออก |
| ข้อสอบกลางภาค | Part1 (8 หน้า) + Part2 (12 หน้า) | ภาพสแกน |
| โค้ดโจทย์ OJ | 64 โจทย์ | `pscp-69070027/` — มีทั้งโค้ดที่ผ่านและ learning log |
| เครื่องมือช่วย | `ihelp/` | Next.js app สร้าง learning log + รัน Python ในเบราว์เซอร์ |

> ⚠️ **ต้อง sanitize ก่อนนำเข้า** — ไฟล์ในคลัง PSCP มีชื่อ-นามสกุลจริงและรหัสนักศึกษาอยู่หลายจุด

### ไฟล์สไลด์ต่อบท

| บท | หัวข้อ | ไฟล์อ้างอิง |
|---|---|---|
| 1 | Python เบื้องต้น — รันโปรแกรม, `print`, ชนิดข้อมูล, ตัวดำเนินการ, `input`, การจัดรูปแบบข้อความ | `PSCP_Lec_Chapter01-2022.pdf` |
| 2 | ฟังก์ชันและมอดูล — `import`, การเรียกใช้, การนิยามฟังก์ชัน, `return`, composite function | `PSCP_Lec_Chapter02-2022.pdf` |
| 3 | การทำงานแบบมีเงื่อนไข — `if` / `elif` / `else`, ตัวดำเนินการตรรกะ, nested condition | `PSCP_Lec_Chapter03-2022.pdf` |
| 4 | การทำงานซ้ำ — `for`, `range`, `while`, `break`, `continue`, nested loop | `PSCP_Lec_Chapter04-2022.pdf` |
| 5 | สตริง — index, `len`, slicing, immutability, การวนซ้ำบนสตริง | `PSCP_Lec_Chapter05-2022.pdf` |

- ต้นทาง: `kmitl-archive/archive/Y1-S1/Problem-Solving-and-Computer-Programming` · `IT-KMITL/Y1-S1/PSCP/pscp-69070027` · `IT-KMITL/Y1-S1/PSCP/ihelp`
- ดัชนีโจทย์ OJ: `data/oj_problems.json` (135 ข้อ)

## 5. ช่องว่างข้อมูล

- สัดส่วนคะแนนของ 1/2569
- Quiz/ข้อสอบหลังกลางภาคเป็นภาพสแกน — ต้องทำ OCR ก่อนใช้
