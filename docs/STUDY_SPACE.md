# Study Space — พื้นที่อ่านหนังสือสอบปลายภาค (`/profile/<รหัส>/study`)

เอกสารกำกับฟีเจอร์: ใครเห็นอะไร หน้าจอทำงานอย่างไร ข้อมูลอยู่ไหน component แต่ละตัวมีหน้าที่อะไร
และต้องแก้ตรงไหนเมื่อแผนหรือเทอมเปลี่ยน ตรวจล่าสุด: 21 ต.ค. 2569

---

## 1. ภาพรวม

หน้าส่วนตัวสำหรับอ่านหนังสือสอบปลายภาค 1/2569 ของ IT ปี 1 — ตัวจับเวลาโฟกัส/พัก กับสิ่งที่ต้องอ่านในวันนั้น
บนหน้าจอเดียวที่เปิดทิ้งไว้ได้ แผนปัจจุบัน (`FINAL_1_2569`) มี 22 วัน (21 ต.ค. – 11 พ.ย. 2569) รวม 112 ชม.

| วิชา | รหัส | สอบ | ชม. ในแผน |
|---|---|---|---:|
| ITF | 06016402 | อ. 3 พ.ย. 13:30–16:30 | 24.5 |
| ICS | 06016411 | ศ. 6 พ.ย. 09:30–12:30 | 31 |
| PSCP | 06066303 | จ. 9 พ.ย. 13:30–16:30 | 21.5 |
| Math IT (MFIT) | 06016401 | พ. 11 พ.ย. 13:30–16:30 | 35 |

วันและเวลาสอบมาจาก `data/exams/final-exams.json` (ตารางสอบส่วนกลาง) **ห้องสอบปลายภาคยังไม่ประกาศ**
หน้าจึงขึ้นว่า "ห้องสอบยังไม่ประกาศ" และลิงก์ไป `/exam-schedule` แทนการเดาห้อง

### หลักการ

1. **ส่วนตัวจริง ไม่ใช่แค่ซ่อน** — แผนเป็นของคนคนเดียว ตรวจสิทธิ์ฝั่งเซิร์ฟเวอร์ก่อนส่งข้อมูลใด ๆ (§2)
2. **หน้าหลักมีแค่ "ตอนนี้"** — ตัวจับเวลากับสิ่งที่ต้องอ่านวันนี้ ส่วนวันสอบ แผนทั้งหมด เช็คลิสต์ และบันทึกเวลา
   อยู่ในแผงด้านข้าง "แผน" ที่เปิดเมื่อต้องการ
3. **เปิดทิ้งไว้ได้** — เต็มจอ หน้าจอไม่ดับ ปุ่มจางหายเมื่อไม่ได้ขยับ (§4)
4. **โควตา ไม่ใช่ตารางเวลา** — แต่ละวันบอกว่าวิชาไหนได้กี่ชั่วโมง อ่านตอนไหนก็ได้
5. **ลิงก์ไปถึงหน้าสัปดาห์จริง** และเปิดในแท็บใหม่ เพื่อไม่ให้หน้าที่จับเวลาอยู่ถูกปิดไป
6. **เนื้อหามีที่มา** — ขอบเขตจาก `summary.md` §2 ของแต่ละวิชา (AGENTS.md ข้อ 7) ส่วน "ต้องตอบได้"
   ย่อจากหัวข้อ *อ่านจบแล้วต้องตอบได้* / *เป้าหมายของคาบนี้* ของหน้าสัปดาห์
7. **สองภาษา** — ข้อความ UI ทุกคำเป็น `LText` ใน `components/study-space/strings.ts`

---

## 2. ความเป็นส่วนตัว — ใครเห็นอะไร

| ผู้เข้าชม | `/profile/<id>` | `/profile/<id>/study` |
|---|---|---|
| เจ้าของ — ล็อกอินด้วยรหัสเดียวกับ URL และมีแผนใน `plans/index.ts` | เห็นการ์ด "พื้นที่อ่านสอบปลายภาค" 🔒 เห็นเฉพาะคุณ | เปิดได้ |
| เจ้าของโปรไฟล์ที่ไม่มีแผน | ไม่มีการ์ด | 404 |
| นักศึกษาคนอื่นที่ล็อกอินอยู่ | ไม่มีการ์ด | 404 |
| ไม่ได้ล็อกอิน (รวม crawler) | ไม่มีการ์ด | redirect ไป `/` |

ลำดับการตรวจใน `app/profile/[student_id]/study/page.tsx` (แบบเดียวกับหน้า `/edit`):

```
viewer = currentStudentId()          // session Supabase → verifyKmitlIt() → รหัส 8 หลักของ IT
!viewer                → redirect("/")
viewer !== student_id  → notFound()  // URL ไม่ใช่ตัวตัดสิน
studyPlanFor(viewer)   → null ⇒ notFound()
render <StudySpaceView plan={plan} studentId={viewer} />
```

- **แผนอยู่ฝั่งเซิร์ฟเวอร์เท่านั้น** — `lib/study-space/plans/*.ts` ขึ้นต้นด้วย `import "server-only"`
  ถ้ามี client component ไหน import ไฟล์เหล่านี้ build จะพังทันที แผนไปถึงเบราว์เซอร์ทางเดียวคือเป็น prop
  ของ `StudySpaceView` หลังผ่านการตรวจด้านบน — อยู่ใน RSC payload ของคำขอนั้นเท่านั้น ไม่อยู่ใน JS chunk สาธารณะ
- **การ์ดบนโปรไฟล์** — `app/profile/[student_id]/page.tsx` เรียก `studyPlanFor()` เฉพาะเมื่อ `isOwner`
  แล้วส่ง `planSummary(plan)` (เฉพาะงานของวันนี้) ให้ `StudySpaceCard` payload ของคนอื่นจึงไม่มีแม้แต่สรุปของวันนี้
- หน้านี้ตั้ง `robots: { index: false, follow: false }` และไม่มีลิงก์ใน navbar อีกต่อไป
  (`/study-space` ของรุ่นแรกถูกลบแล้ว)
- **Service worker ไม่เก็บหน้านี้** — `public/sw.js` (v3) ไม่ใส่ cache หน้าที่ server ตอบ `Cache-Control`
  แบบ `no-store` / `private` ซึ่ง Next ส่งกับทุกหน้า dynamic (หน้านี้ หน้าโปรไฟล์มุมมองเจ้าของ หน้าแก้ไข)
  v2 เคยเก็บทุกหน้า สำเนาหน้าส่วนตัวจึงค้างอยู่หลังออกจากระบบและเปิดได้ตอนออฟไลน์ การขึ้นเวอร์ชันทำให้
  `activate` ลบ cache เก่าทิ้ง
- **ข้อจำกัดสำคัญ: repo นี้เป็น open source** — การตรวจสิทธิ์กันได้แค่ "หน้าเว็บ" ไฟล์แผนใน `plans/`
  (และตารางรายวันใน §11 ของเอกสารนี้) เป็นซอร์สโค้ด ถ้า push ขึ้น GitHub ใครก็อ่านได้ ถ้าต้องการให้แผนเป็น
  ความลับจริง ต้องย้ายแผนออกจาก repo ไปไว้ที่ที่อ่านได้เฉพาะฝั่งเซิร์ฟเวอร์ (bucket ส่วนตัวของ Supabase
  หรือ table) แล้วให้ `studyPlanFor()` อ่านจากที่นั่นหลังตรวจสิทธิ์ — จุดอื่นไม่ต้องแก้
- **สิ่งที่ไม่ได้เป็นความลับ** — ขอบเขตรายสัปดาห์ (`units.ts`) ลิงก์ (`links.ts`) และวันสอบ (`subjects.ts`)
  เป็นข้อมูลรายวิชาที่ทุกคนเห็นได้อยู่แล้ว จึง import ฝั่ง client ได้ ส่วนเวลาที่บันทึกกับเช็คลิสต์อยู่ใน
  localStorage ของเบราว์เซอร์ที่ใช้ (§8) ใครใช้เบราว์เซอร์โปรไฟล์เดียวกันก็เห็น

**ให้คนอื่นมีแผน:** สร้างไฟล์ใหม่ใน `lib/study-space/plans/` (ขึ้นต้นด้วย `import "server-only"`,
export `StudyPlan` แบบเดียวกับ `final-1-2569.ts`) แล้วเพิ่ม `"<รหัส>": <PLAN>` ใน `PLANS_BY_STUDENT`
ของ `plans/index.ts` การ์ดบนโปรไฟล์และหน้า `/profile/<รหัส>/study` จะใช้ได้ทันทีสำหรับเจ้าของรหัสนั้น

---

## 3. หน้าจอ

```
┌ top bar (จางเมื่อ idle) ──────────────────────────────────────────────────────┐
│ ← โปรไฟล์   วันพุธที่ 21 ตุลาคม · วันที่ 1/22 [กลับวันนี้]   14:32  แผน  ⚙  ⛶ │
├ TimerHero ─────────────────────────────┬ TodayList ──────────────────────────────┤
│        [ โฟกัส 25′ | พัก 5′ ]           │ วันนี้อ่าน                  เป้า 5 ชม. ‹ › │
│          ╭───────────╮                 │ ┌─────────────────────────────────────┐ │
│         │   24:13    │                 │ │○ ● Math IT สัปดาห์ที่ 8   45 นาที / 3 ชม.│ │
│         │ ● Math IT ▾│                 │ │  ฟังก์ชัน ลิมิต และความต่อเนื่อง          │ │
│         │ ฟังก์ชัน ลิมิต…│                │ │  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬               │ │
│          ╰───────────╯                 │ │  ต้องตอบได้  • …  • …  • …            │ │
│      ↺   [ ⏸ หยุด ]   ✓                │ │  (สรุปสัปดาห์ที่ 8) (แบบฝึก…) หน้าวิชา → │ │
│      บันทึก 12 นาที                     │ └─────────────────────────────────────┘ │
│   อ่านแล้ว 1 ชม. 20 นาที / 5 ชม.  ▬▬▬    │ ┌ ○ ● ICS คาบที่ 1      0 นาที / 2 ชม. ┐ │
│                                        │ └ ภาพรวมระบบคอมพิวเตอร์ · มัลติมิเตอร์ ┘ │
└────────────────────────────────────────┴────────────────────────────────────────┘
แผงด้านข้าง "แผน" (Sheet ขวา): ภาพรวม | รายวัน | รายวิชา | บันทึก — ปุ่มแผนและปุ่ม `P` เปิดกลับมาที่แท็บล่าสุด (ครั้งแรกคือภาพรวม)
```

- **ไม่มี navbar และ footer** — หน้านี้มีแถบบนของตัวเอง `components/footer.tsx` ซ่อน footer เมื่อ
  pathname ตรง `/^\/profile\/[^/]+\/study$/` เพื่อให้หน้าพอดีความสูงจอ (`min-h-dvh`)
- **แถบบน** — กลับโปรไฟล์ · วันที่ที่ดูอยู่ + "วันที่ n/22" (≥640 px) · ชิป "กลับวันนี้" เมื่อดูวันอื่น ·
  นาฬิกาเวลากรุงเทพ (≥768 px, อัปเดตทุก 15 วินาที) · แผน · ตั้งค่า · เต็มจอ (เฉพาะเบราว์เซอร์ที่รองรับ)
- **TimerHero (ซ้าย)** — สลับโหมดโฟกัส/พัก · วงแหวนความคืบหน้าของรอบ · ตัวเลขเวลาใหญ่ ·
  ปุ่มเลือกวิชา (dropdown เรียงวิชาที่อยู่ในแผนวันนั้นก่อน พร้อมชั่วโมง วิชาอื่นขึ้น "ไม่มีในแผนวันนี้"
  ล็อกเฉพาะระหว่างรอบโฟกัส ตอนพักเปลี่ยนได้) · ชื่อหัวข้อของวิชานั้นในวันนั้น · ปุ่ม ↺ รีเซ็ต / เริ่ม-หยุด / ✓ บันทึกก่อนครบรอบ ·
  ข้อความช่วย ("บันทึก n นาที" หรือ "บันทึกเข้าแผนวันที่ …" เมื่อรอบเป็นของอีกวัน) · เวลาที่อ่านแล้วของวัน
- **TodayList (ขวา)** — หัวข้อ "วันนี้อ่าน" (หรือ "อ่านของวันที่ …") เป้าชั่วโมง และ ‹ › เลื่อนวัน ·
  ป้ายวันสอบเมื่อวันนั้นมีสอบ · หนึ่งแถวต่อวิชาแบบ accordion: แถวที่เปิดอยู่ = วิชาที่ตัวจับเวลาตั้งไว้
  (มีแถบความคืบหน้า "ต้องตอบได้" และลิงก์เป็นชิป) แถวอื่นเหลือบรรทัดเดียว คลิกแถวอื่น = เปิดแถวนั้น
  และชี้ตัวจับเวลาไปวิชานั้นถ้าไม่ได้อยู่ระหว่างรอบโฟกัส คลิกแถวที่เปิดอยู่ = ปิด · วงกลมซ้ายมือ = ติ๊กอ่านจบ
- **แผงด้านข้าง "แผน"** (`PlanSheet`) — หัวแผงมี 🔒 เห็นเฉพาะคุณ
  - *ภาพรวม* — ชั่วโมงที่อ่านแล้ว / ทั้งแผน, หัวข้อที่จบ / ทั้งหมด, การ์ดนับถอยหลังวันสอบ 4 วิชา
    (พร้อมชั่วโมงสะสมเทียบเป้าของวิชา)
  - *รายวัน* — แผนทั้งหมดแบ่งช่วงตามวิชาที่จะสอบถัดไป คลิกวัน = ปิดแผงแล้วเปิดวันนั้น ติ๊กจบได้จากแถว
  - *รายวิชา* — เช็คลิสต์ขอบเขตปลายภาครายสัปดาห์ของแต่ละวิชา พร้อมลิงก์ และชิป "อยู่ในแผนวันที่ …"
  - *บันทึก* — รายการเวลาของวันที่ดูอยู่ เพิ่มเวลาเอง (เลือกวิชา, 1–600 นาที) และลบรายการได้
- **ตอบสนองตามจอ** — ≥1024 px สองคอลัมน์จัดกลางแนวตั้ง รายการขวาเลื่อนภายในเองถ้ายาวเกินจอ
  (`lg:max-h-[calc(100dvh-8rem)]`) จอแคบกว่านั้นเรียงตัวจับเวลาก่อนแล้วตามด้วยรายการ
- **วันที่ที่ดู** — ไม่มี `?day=` = ตามปฏิทิน (เปลี่ยนวันเองตอนเที่ยงคืนเวลากรุงเทพแม้เปิดค้างไว้)
  เลือกวันอื่น = เขียน `?day=YYYY-MM-DD` ด้วย `history.replaceState` รีโหลดแล้วยังอยู่วันเดิม
  สิ่งที่เลือกไว้ในวันหนึ่ง — วันที่ปักไว้ และวิชาที่เลือกให้ตัวจับเวลา — หมดอายุเมื่อขึ้นวันใหม่
  (`?day=` ถูกลบด้วย) หน้าที่เปิดค้างข้ามคืนจึงตื่นมาที่แผนของวันใหม่ ไม่ค้างอยู่ที่วันที่เคยเลือก
- **ลิงก์เปิดแท็บใหม่ทั้งหมด** (`target="_blank"`) — ถ้าเปิดในแท็บเดิม หน้านี้จะถูกปิดไป ตัวจับเวลา
  ก็ไม่ส่งเสียงตอนครบรอบ (session ยังถูกจำไว้และทำต่อได้เมื่อกลับมา แต่จะไม่มีเสียงเตือนระหว่างนั้น)

---

## 4. Standby — เปิดทิ้งไว้เป็นหน้าจอพัก (`use-standby.ts`)

| เรื่อง | ทำงานอย่างไร |
|---|---|
| เต็มจอ | `document.documentElement.requestFullscreen()` — ทั้งเอกสาร ไม่ใช่ element เดียว เพราะ dialog และ sheet ของ Radix render ใน portal บน `<body>` ถ้าทำ element เดียวเต็มจอ แผงเหล่านั้นจะมองไม่เห็น ปุ่มแสดงเฉพาะเมื่อ `document.fullscreenEnabled` (iPhone Safari ไม่รองรับ) |
| หน้าจอไม่ดับ | Screen Wake Lock (`navigator.wakeLock.request("screen")`) ขณะ **ตัวจับเวลาเดิน หรืออยู่ในโหมดเต็มจอ** และแท็บมองเห็นอยู่ เบราว์เซอร์ปล่อย lock เมื่อแท็บถูกซ่อน จึงขอใหม่ใน `visibilitychange` ถ้าถูกปฏิเสธ หน้ายังใช้งานได้ปกติ |
| จางเมื่อไม่ได้ขยับ | เงื่อนไขเดียวกัน (เดินอยู่ หรือเต็มจอ) + ไม่มี `pointermove` / `pointerdown` / `keydown` / `wheel` / `touchstart` นาน 5 วินาที → root ได้ `data-idle="true"` ทุก element ที่มีคลาส `CHROME` จางหายและกดไม่ได้ เคอร์เซอร์ถูกซ่อน (`cursor-none`) ขยับเมื่อไหร่ก็กลับมา |
| สิ่งที่ยังอยู่ตอน idle | วงแหวน ตัวเลขเวลา วิชาและหัวข้อ เวลาที่อ่านแล้วของวัน และรายการที่ต้องอ่าน (ปุ่ม ‹ › ของรายการจางไปด้วย) |
| คีย์ลัด | `Space` เริ่ม/หยุด · `F` เต็มจอ · `P` เปิดแผน — จับจาก `KeyboardEvent.code` (ปุ่มจริงบนคีย์บอร์ด) จึงใช้ได้แม้แป้นพิมพ์เป็นภาษาไทย ไม่ทำงานขณะพิมพ์ในช่องกรอก อยู่ใน dialog/เมนู กดค้าง หรือกดร่วมกับ ⌘/Ctrl/Alt — Space เป็นของปุ่มที่ **คีย์บอร์ด** ย้ายโฟกัสไป (Tab แล้ว Space = กดปุ่มนั้น) ปุ่มที่มีโฟกัสเพราะเพิ่งถูกคลิก (วงกลมติ๊กจบ แถวรายการ) ไม่แย่ง Space จากตัวจับเวลา |
| โฟกัสหลังปิดแผง | ปุ่มแผนและปุ่มตั้งค่าเป็น `SheetTrigger` / `DialogTrigger` ปิดด้วย Esc แล้วโฟกัสกลับมาที่ปุ่มเดิม |
| เสียงหลังรีโหลด | `chime.arm()` สร้าง/ปลุก AudioContext ตอนคลิกหรือกดปุ่มครั้งแรกหลังโหลดหน้า (เบราว์เซอร์อนุญาตเฉพาะใน gesture) ถ้ารีโหลดกลางรอบแล้วไม่แตะหน้าเลยจนครบรอบ เสียงจะไม่ดัง |
| ชื่อแท็บ | ระหว่างเดิน ชื่อแท็บเป็นเวลาที่เหลือ เช่น `18:42 · Focus` (จาก `use-study-timer.ts`) |

---

## 5. แผนผังไฟล์

```
app/profile/[student_id]/study/page.tsx   ตรวจสิทธิ์ (§2) แล้ว render StudySpaceView — server
app/profile/[student_id]/page.tsx         การ์ด StudySpaceCard เฉพาะเจ้าของที่มีแผน
components/footer.tsx                     ซ่อน footer บน /profile/<id>/study
components/ui/sheet.tsx                   primitive ใหม่แบบ shadcn (Radix Dialog เป็นแผงข้าง)
components/problems-view.tsx              รองรับ /pscp?week=N (กรองสัปดาห์ให้ตอนเปิด)

lib/study-space/
  types.ts                 type ทั้งหมด (StudyPlan, DailyPlan, StudyTask, StudyUnit, StudySettings, …)
  subjects.ts              4 วิชา: ชื่อ/รหัส/โฟลเดอร์จาก catalog + วันสอบ + สีประจำวิชา   — สาธารณะ
  links.ts                 ตัวสร้าง href ทุกตัว (href.*) และ resource สำเร็จรูป (res.*)     — สาธารณะ
  units.ts                 ขอบเขตปลายภาครายสัปดาห์ + ลิงก์ของสัปดาห์ (UNITS, unitById)    — สาธารณะ
  plan.ts                  ฟังก์ชันอ่านแผน: planDay, isPlanDate, defaultPlanDate, dayHours,
                           planHours, planHoursFor, taskResources, plannedOn, planSummary
  plans/index.ts           server-only — PLANS_BY_STUDENT และ studyPlanFor(studentId)
  plans/final-1-2569.ts    server-only — แผน 22 วัน (FINAL_1_2569)
  presets.ts               preset ตัวจับเวลา + DEFAULT_SETTINGS + activePreset()
  dates.ts                 วันที่ "YYYY-MM-DD" เวลากรุงเทพ, นาฬิกา, formatDay, daysBetween
  progress.ts              นาทีที่บันทึก/เป้า/สัดส่วน/ฟอร์แมต
  storage.ts               "use client" — store บน localStorage ต่อรหัส + useStudyProgress()

components/study-space/
  study-space-view.tsx     StudySpaceView (รอ mount) → StudySpaceProvider → FocusScreen
                           (แถบบน, state ของวันที่ดู/วิชา/แถวที่เปิด, คีย์ลัด, ?day=)
  context.tsx              StudySpaceProvider / useStudySpace — { plan, studentId, store, data }
  timer-hero.tsx           ตัวจับเวลาฝั่งซ้าย + คลาส CHROME
  today-list.tsx           รายการที่ต้องอ่านฝั่งขวา (accordion, ป้ายวันสอบ)
  plan-sheet.tsx           แผงด้านข้าง 4 แท็บ
  exam-countdown.tsx       การ์ดนับถอยหลังวันสอบ + examStatus()
  plan-board.tsx           แผนทั้งหมดแบ่งช่วงก่อนสอบแต่ละวิชา
  course-units.tsx         เช็คลิสต์รายสัปดาห์ของแต่ละวิชา
  session-log.tsx          บันทึกเวลาของวัน + เพิ่มเอง/ลบ
  settings-dialog.tsx      preset เสียง เริ่มรอบถัดไปอัตโนมัติ คีย์ลัด ล้างข้อมูล
  profile-card.tsx         StudySpaceCard บนโปรไฟล์ (client เพื่อสลับภาษาได้)
  primitives.tsx           SubjectDot/Tag, ProgressBar, Stat, Segmented, ResourceLink, DoneToggle
  strings.ts               ข้อความ UI ทั้งหมด (LText) + fill()
  use-study-timer.ts       hook นาฬิกา (§9)
  use-standby.ts           useStandby (เต็มจอ, wake lock, idle) + useShortcuts
  audio-chime.ts           เสียงแจ้งเตือนจาก Web Audio API (ไม่มีไฟล์เสียง)
```

**ทิศทาง import**

- สาธารณะ: `subjects ← links ← units ← plan ← progress` (`plan` ใช้ `dates` ด้วย)
- `plans/*` (server-only) ใช้ได้แค่ `links` และ `types` และถูก import ได้จาก **server page สองไฟล์เท่านั้น**:
  `app/profile/[student_id]/study/page.tsx` กับ `app/profile/[student_id]/page.tsx`
- component ฝั่ง client อ่านแผนจาก `useStudySpace()` เท่านั้น ห้าม import `plans/` (build จะพังเพราะ `server-only`)

---

## 6. โมเดลข้อมูล

```
StudyPlan         id, title, days: DailyPlan[]                              ← ส่วนตัว (plans/)
DailyPlan         date "YYYY-MM-DD", tasks[], exam?
StudyTask         id "<date>-<code>", subject, hours, title, units[], keyPoints[], extras?[]
StudyUnit         id "<CODE>-week-<n>", subject, week, label, topic, resources[] ← สาธารณะ (units.ts)
StudyResource     kind, label, href
SubjectMeta       code, officialCode, dir, name, shortName, accent{dot,bar,text,soft},
                  exam{startsAt,time,date,room|null}                          ← สาธารณะ (subjects.ts)
StudyPlanSummary  today, tasks[{subject,hours,title}]                          ← การ์ดบนโปรไฟล์
```

- **unit** = หนึ่งสัปดาห์ของขอบเขตปลายภาคของวิชา ประกาศครั้งเดียวใน `units.ts` พร้อมลิงก์ของมัน
- **task** = หนึ่งวิชาในหนึ่งวันของแผน อ้าง unit ด้วย id ลิงก์ของ task = ลิงก์ของทุก unit + `extras`
  โดยตัดตัวซ้ำ (`taskResources()`) วันทบทวนหลายสัปดาห์จึงได้ทุกหน้าสัปดาห์ แต่คลังไฟล์ขึ้นครั้งเดียว
- `planSummary(plan, now)` ให้เฉพาะงานของวันนี้ (เวลากรุงเทพ) วันที่อยู่นอกแผนได้รายการว่าง
  การ์ดจึงขึ้น "ไม่มีแผนอ่านวันนี้"
- `ResourceKind` กำหนดไอคอน: `week` หน้าสัปดาห์ · `summary` สรุป · `quiz` แบบฝึก · `mock` ข้อสอบจำลอง ·
  `problems` โจทย์ iJudge · `library` คลังไฟล์ (ต้องล็อกอิน) · `overview` ภาพรวม/ขอบเขต · `exam` ตารางสอบ

### ขอบเขตปลายภาคของแต่ละวิชา (`units.ts`)

| วิชา | unit | ที่มา |
|---|---|---|
| ITF | สัปดาห์ที่ 8–15 | `summary.md` §2.2 |
| ICS | คาบที่ 1–7 ของครึ่งหลัง (ฮาร์ดแวร์) | `summary.md` §2.2 — "ข้อสอบปลายภาคออกเฉพาะเนื้อหาครึ่งหลัง" |
| PSCP | สัปดาห์ที่ 8–14 | `summary.md` §2.2 · จำนวนโจทย์จาก `data/pscp/problems.json` |
| MFIT | สัปดาห์ที่ 8–15 (เลขของคลัง = สัปดาห์ 9–16 ในตารางเรียน) | `summary.md` §2.2 หมายเหตุท้ายตาราง |

**สิ่งที่ไม่ได้ลิงก์โดยตั้งใจ:** คลังควิซ ITF, คลังควิซ ICS และข้อสอบชุดฝึก ICS เป็นขอบเขต *กลางภาค*
(`course-bindings.ts` ประกาศ `scope: "midterm"`) วันไหนในแผนก็ไม่ชี้ไปที่นั่น ITF ใช้ "ทดสอบตัวเอง"
ท้ายหน้าสัปดาห์ 8–15 แทน

---

## 7. สัญญาของลิงก์ (`links.ts`)

ทุก href สร้างจาก `href.*` เท่านั้น ห้ามเขียน path ตรง ๆ ใน component หรือในแผน

| ฟังก์ชัน | URL | อิงจาก |
|---|---|---|
| `href.hub(code)` | `/courses/<dir>` | หน้าวิชา |
| `href.overview(code)` | `/courses/<dir>/overview` | โมดูล orientation |
| `href.library(code)` | `/courses/<dir>/library` | โมดูล archive (ต้องล็อกอิน IT KMITL) |
| `href.weekPage("ITF"\|"ICS", n)` | `/courses/<dir>/map?doc=weekNN` | โมดูล syllabus_map, slug `weekNN` |
| `href.mfitSummary(n)` | `/courses/<dir>/summary?doc=weekNN-summary` | โมดูล deep_summary |
| `href.mfitQuiz(n)` | `/courses/<dir>/quiz?doc=weekNN-quiz` | โมดูล drill |
| `href.mfitSyllabus()` | `/courses/<dir>/map?doc=syllabus` | โมดูล syllabus_map |
| `href.mfitFinalMock()` | `/courses/<dir>/mock?doc=final-paper` | โมดูล mock_exam |
| `href.pscpWeek(n)` | `/pscp?week=N` | `ProblemsView` อ่าน `?week=` ตอน mount |
| `href.pscpProblem(slug)` | `/pscp/<slug>` | หน้าโจทย์ |
| `href.examSchedule()` | `/exam-schedule` | ตารางสอบ |

`?doc=` คือ `DOC_PARAM` ของ `ModuleReader` slug ต้องตรงกับที่ประกาศใน `lib/courses/course-bindings.ts`
ถ้า binding เปลี่ยนชื่อ slug ให้แก้ที่ `links.ts` ที่เดียว ถ้า slug ไม่ตรง หน้าจะไม่ 404 แต่จะเปิดเอกสารแรก
ของโมดูลแทนแบบเงียบ ๆ จึงต้องเปิดตรวจทีละลิงก์ (§13)

---

## 8. การเก็บข้อมูล

| key ใน localStorage | เนื้อหา | ไฟล์ |
|---|---|---|
| `ihelp_study_space_v1_student-<รหัส>` | `UserProgressData` เป็น JSON | `lib/study-space/storage.ts` |
| `ihelp_study_space_timer_v1_<รหัส>` | `{ session, idleMode }` — รอบที่เริ่มแล้ว (ถ้ามี) และโหมดของรอบถัดไป | `components/study-space/use-study-timer.ts` |

```
UserProgressData
  settings           selectedPresetId, customPreset{studyMinutes,breakMinutes}, soundEnabled, autoStartBreak
  completedTasks     { "<date>-<code>" | "<CODE>-week-<n>": boolean }
  dailyStudyMinutes  { "<date>": { "<CODE>": minutes } }
  sessionLogs        [{ id, date, subjectCode, durationMinutes, timestamp, source: "timer"|"manual" }]  ≤ 500 รายการ
```

- รหัสมาจาก session (หน้า server ส่ง `studentId` ลงมา) **ไม่มีตัวเลือกโปรไฟล์แล้ว** — การตั้งค่าเหลือแค่ตัวจับเวลา
- **เข้ากันได้กับรุ่นแรก** — รุ่นแรกเก็บโปรไฟล์ตั้งต้นไว้ที่ `ihelp_study_space_v1_student-69070027` ซึ่งเป็น key
  เดียวกับตอนนี้ เวลาที่เคยบันทึกจึงยังอยู่ การตั้งค่าที่รุ่นแรกเก็บไว้ใต้ field `profile` จะถูกอ่านครั้งเดียว
  แล้วเขียนกลับเป็น `settings` · session ตัวจับเวลาที่รุ่นก่อนเก็บไว้ที่ `ihelp_study_space_timer_v1`
  (ไม่มีรหัสต่อท้าย) ถูกอ่านต่อครั้งเดียวแล้วลบ · key อื่นที่เลิกใช้ (`ihelp_study_space_active_profile`,
  `ihelp_study_space_v1_guest`) ไม่ถูกอ่านและไม่ถูกลบ
- หนึ่ง store ต่อรหัส (`studyStoreFor(id)`) อ่านด้วย `useStudyProgress(store)` (`useSyncExternalStore`)
  เขียนผ่าน action ของ store เท่านั้น: `logSession` · `removeSession` · `toggleDone` · `updateSettings` · `resetProgress`
  component เข้าถึงทั้งหมดผ่าน `useStudySpace()`
- **หลายแท็บ** — แท็บอื่นที่เปิดหน้าเดียวกันอัปเดตตามผ่าน `storage` event ทั้งความคืบหน้าและตัวจับเวลา
  (เริ่ม/หยุดในแท็บหนึ่ง อีกแท็บก็ตาม) `logSession(..., id)` ที่มี id จะอ่าน localStorage ใหม่ก่อนเขียน
  และไม่ทำอะไรถ้า id นั้นมีอยู่แล้ว รอบเดียวกันที่จบพร้อมกันในสองแท็บจึงถูกบันทึกครั้งเดียว
- ถ้า localStorage ใช้ไม่ได้ (private mode, ถูกบล็อก) หน้ายังทำงานได้ในหน่วยความจำ แค่ไม่จำข้ามรีโหลด

---

## 9. ตัวจับเวลา (`use-study-timer.ts`)

- นับจาก **เวลาสิ้นสุดจริง** (`endsAt`) ไม่ได้นับจำนวน tick (repaint ทุก 250 ms) แท็บเบื้องหลังจึงไม่ทำให้เวลาเพี้ยน
- session ที่เริ่มแล้วจำไว้ใน localStorage ต่อรหัส รีโหลดหรือปิดแท็บแล้วเปิดใหม่ก็ทำต่อได้ ถ้ารอบโฟกัสหมดเวลา
  ไปตอนปิดแท็บก็ยังบันทึกให้ เว้นแต่หมดไปนานเกิน 12 ชม.
- การจบรอบจัดการใน callback ของ interval ไม่ได้อยู่ใน state updater (updater ถูกเรียกซ้ำใน Strict Mode)
- ทุกรอบมี `id` และถูกบันทึกในชื่อ `timer-<id>` (ดู "หลายแท็บ" ใน §8)
- วิชาและวันในแผน **ล็อกตลอดรอบโฟกัส** เปลี่ยนวันที่ดูระหว่างจับเวลา เวลาก็ยังเข้าวันเดิม
  เลือกวันที่ผ่านมาแล้วจับเวลา = เก็บโควตาย้อนหลังของวันนั้น ระหว่างพักเลือกวิชาของรอบถัดไปได้
- โฟกัสครบรอบ → บันทึกเต็มรอบ → เสียงพัก → โหมดพัก ปุ่ม ✓ = บันทึกเท่าที่อ่านไป (ปัดลงเป็นนาที ขั้นต่ำ 1)
  แล้วพร้อมเริ่มพัก
- เปลี่ยนโหมดได้เฉพาะตอนไม่มีรอบค้าง (ไม่ให้เวลาหายเงียบ ๆ)
- "เริ่มรอบถัดไปอัตโนมัติ" ในการตั้งค่า = วนโฟกัส/พักต่อเองโดยไม่หยุดที่รอยต่อ เฉพาะเมื่อมีแท็บเปิดอยู่ตอนถึง
  รอยต่อ (เลยมาไม่เกิน 60 วินาที) — พักที่จบไปตอนปิดหน้าไม่ทำให้รอบโฟกัสเริ่มเองตอนเปิดกลับมา รอบถัดไปนับจาก
  เวลาจบของรอบก่อน (ทุกแท็บจึงได้รอบเดียวกัน) และรอบโฟกัสใหม่ใช้วิชา/วันที่เลือกอยู่ตอนนั้น ไม่ใช่ของรอบแรก
- preset: Pomodoro 25/5 · สบาย ๆ 30/10 · โฟกัสลึก 50/10 · เต็มชั่วโมง 60/15 · กำหนดเอง (อ่าน 5–180, พัก 1–60 นาที)

---

## 10. มาตรฐานการออกแบบ

ใช้ token ของเว็บ (`app/globals.css`) ทั้งหมด ไม่มีสีหรือเงาเฉพาะหน้า ยกเว้นสีประจำวิชา

| เรื่อง | ค่า |
|---|---|
| พื้นผิวบนหน้าจอโฟกัส | `rounded-2xl border bg-card` ไม่มีเงา ไม่มี blur |
| พื้นผิวในแผงด้านข้าง | `rounded-xl border bg-card` (แน่นกว่าเล็กน้อย) |
| ตัวเลขเวลา | `font-mono font-light tabular-nums` ขนาดตามความกว้างจอ (`clamp(...)` และใหญ่ขึ้นที่ `2xl`) — ค่าจริงอยู่ใน `Clock` ของ `timer-hero.tsx` |
| วงแหวน | เส้น 2.5 บน viewBox 200 · ราง `stroke-border` · โฟกัส `stroke-primary` · พัก `stroke-emerald-500` · ความกว้างคือ `RING_SIZE` ใน `timer-hero.tsx` (จอกว้างถูกจำกัดด้วยความสูงจอด้วย เพื่อให้ทั้งหน้าพอดีจอ 1280×720 โดยไม่ต้องเลื่อน) |
| ปุ่มหลัก | `h-12 rounded-full` · ปุ่มรอง icon `size-11 rounded-full` |
| ข้อความรอง | `text-xs text-muted-foreground` · ตัวเลข `tabular-nums` ทุกที่ |
| สีหลัก | `primary` (น้ำเงิน KMITL) สำหรับสถานะ active, ปุ่มหลัก, วันสอบ |
| สีประจำวิชา | ใช้แค่ **จุด** และ **แถบความคืบหน้า**: ITF violet · ICS emerald · PSCP amber · Math IT sky (`SUBJECTS[code].accent`) |
| ส่วนที่จางตอน idle | ใส่คลาส `CHROME` (export จาก `timer-hero.tsx`) — ทำงานกับ `group/focus` + `data-idle` บน root |
| โฟกัสคีย์บอร์ด | `focus-visible:ring-2 focus-visible:ring-ring/50` ทุกปุ่มที่สร้างเอง |
| ลิงก์เนื้อหา | `ResourceLink` เปิดแท็บใหม่เสมอ |

primitive ใน `primitives.tsx` ต้องใช้ซ้ำ ไม่สร้างใหม่ในแต่ละไฟล์:
`SubjectDot` / `SubjectTag` · `ProgressBar` (`role="progressbar"`) · `Stat` · `Segmented` (`role="group"` + ปุ่ม `aria-pressed` — ไม่ใช่ tablist เพราะไม่มี tabpanel/ลูกศร) ·
`ResourceLink` (`variant="row"` แถวเต็มกว้าง / `"chip"` เม็ดยาสำหรับรายการวันนี้) · `DoneToggle` (`role="checkbox"`)

ปุ่มทั่วไปใช้ `components/ui/button.tsx` dialog ใช้ `components/ui/dialog.tsx` แผงด้านข้างใช้
`components/ui/sheet.tsx` (primitive ใหม่แบบ shadcn style `radix-nova` บน Radix Dialog: `Sheet`, `SheetContent`
`side="right|left|top|bottom"`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetClose`)
dropdown เลือกวิชาใช้ `components/ui/dropdown-menu.tsx`

---

## 11. แผนรายวัน

สร้างจาก `FINAL_1_2569` (`lib/study-space/plans/final-1-2569.ts`) โดยตรง (ชม. ต่อวิชาตามหลังชื่อ)
ลิงก์ของแต่ละแถวดูได้ในหน้า หรือจาก `taskResources()`

| วันที่ | ชม. | วิชา | หัวข้อ |
|---|:---:|---|---|
| พ. 21 ต.ค. | 5 | Math IT 3 · ICS 2 | **Math IT** สัปดาห์ที่ 8 — ฟังก์ชัน ลิมิต และความต่อเนื่อง<br>**ICS** คาบที่ 1 — ภาพรวมระบบคอมพิวเตอร์ · มัลติมิเตอร์ |
| พฤ. 22 ต.ค. | 5 | Math IT 3 · ITF 2 | **Math IT** สัปดาห์ที่ 9 — อนุพันธ์ ภาค 1<br>**ITF** สัปดาห์ที่ 8 — Database |
| ศ. 23 ต.ค. | 5 | ICS 3 · PSCP 2 | **ICS** คาบที่ 2 — Memory & I/O addressing · ออสซิลโลสโคป<br>**PSCP** สัปดาห์ที่ 8 — Nested Loops & Pattern Printing |
| ส. 24 ต.ค. | 7.5 | Math IT 3 · ICS 2.5 · PSCP 2 | **Math IT** สัปดาห์ที่ 10 — อนุพันธ์ ภาค 2<br>**ICS** คาบที่ 3 — Latch, Buffer, Tristate · LED และ RC<br>**PSCP** สัปดาห์ที่ 9 — Lists, Sequence Processing & Simulation |
| อา. 25 ต.ค. | 6 | Math IT 3.5 · ITF 2.5 | **Math IT** สัปดาห์ที่ 11 — การประยุกต์ของอนุพันธ์<br>**ITF** สัปดาห์ที่ 9 — Ethical, Social & Legal Aspects of IT |
| จ. 26 ต.ค. | 5 | ICS 3 · PSCP 2 | **ICS** คาบที่ 4 — Flip-flop และวงจรนับ · ออสซิลเลเตอร์<br>**PSCP** สัปดาห์ที่ 10 — Nested Lists & Matrices (1) |
| อ. 27 ต.ค. | 5 | Math IT 3 · ITF 2 | **Math IT** สัปดาห์ที่ 12 — ปริพันธ์ ภาค 1<br>**ITF** สัปดาห์ที่ 10 — Working in the Enterprise |
| พ. 28 ต.ค. | 5 | ICS 3 · PSCP 2 | **ICS** คาบที่ 5 — DAC และ ADC · MUX จาก NAND<br>**PSCP** สัปดาห์ที่ 11 — Nested Lists & Matrices (2) |
| พฤ. 29 ต.ค. | 5.5 | Math IT 3 · ITF 2.5 | **Math IT** สัปดาห์ที่ 13 — ปริพันธ์ ภาค 2 — u-substitution<br>**ITF** สัปดาห์ที่ 11 — Internet & Computer Networks 1 |
| ศ. 30 ต.ค. | 5.5 | ITF 3.5 · ICS 2 | **ITF** สัปดาห์ที่ 12 — Computer Networks 2<br>**ICS** คาบที่ 6 — Memory unit · FPGA Basys2 |
| ส. 31 ต.ค. | 6 | ITF 4 · Math IT 2 | **ITF** สัปดาห์ที่ 13–14 — Wireless Networks + Web Technology<br>**Math IT** สัปดาห์ที่ 14 — ปริพันธ์ทีละส่วน · พื้นที่ · ปริมาตร |
| อา. 1 พ.ย. | 6 | ITF 4 · ICS 2 | **ITF** สัปดาห์ที่ 15 — IT Skills and System + ทดสอบตัวเองทุกสัปดาห์<br>**ICS** คาบที่ 7 — ALU และการสร้างซีพียู |
| จ. 2 พ.ย. | 4 | ITF 4 | **ITF** สัปดาห์ที่ 8–15 — ทบทวน ITF รอบสุดท้าย |
| อ. 3 พ.ย. | 2.5 | 🎯 สอบ ITF 13:30–16:30<br>ICS 2.5 | **ICS** ทบทวน — เปิดภาพรวม ICS ครึ่งหลัง |
| พ. 4 พ.ย. | 6.5 | ICS 6.5 | **ICS** คาบที่ 1–7 — ไล่ ICS คาบ 1–7 เต็มวัน |
| พฤ. 5 พ.ย. | 4.5 | ICS 4.5 | **ICS** คาบที่ 2–7 — สรุป ICS ก่อนสอบเช้า |
| ศ. 6 พ.ย. | 4 | 🎯 สอบ ICS 09:30–12:30<br>PSCP 4 | **PSCP** สัปดาห์ที่ 12–13 — Dictionary, Sets และ File I/O |
| ส. 7 พ.ย. | 7 | PSCP 5 · Math IT 2 | **PSCP** สัปดาห์ที่ 14 — Sorting & Searching<br>**Math IT** สัปดาห์ที่ 15 — โมเมนต์ · อนุพันธ์ย่อย |
| อา. 8 พ.ย. | 4.5 | PSCP 4.5 | **PSCP** สัปดาห์ที่ 8–14 — ซ้อมจับเวลาเขียนโค้ด |
| จ. 9 พ.ย. | 3 | 🎯 สอบ PSCP 13:30–16:30<br>Math IT 3 | **Math IT** สัปดาห์ที่ 8–11 — ทบทวนลิมิตและอนุพันธ์ |
| อ. 10 พ.ย. | 7.5 | Math IT 7.5 | **Math IT** สัปดาห์ที่ 12–15 — ปริพันธ์ทั้งหมด + ข้อสอบจำลอง |
| พ. 11 พ.ย. | 2 | 🎯 สอบ Math IT 13:30–16:30<br>Math IT 2 | **Math IT** สัปดาห์ที่ 8–15 — วอร์มสูตรก่อนสอบ |

> วันที่ 5 พ.ย. แถวหัวข้อแสดง "คาบที่ 2–7" เพราะ task อ้าง unit คาบ 2, 4, 5, 6, 7 (ข้ามคาบ 3)

### สิ่งที่แก้จากแผนรุ่นแรก (เนื้อหา)

| เรื่อง | รุ่นแรก | ตอนนี้ |
|---|---|---|
| ลิงก์ | ชี้ไปหน้ารวม `/archive` `/summary` `/library` ของวิชา (และ `/archive` ไม่ใช่ segment ที่มีจริง) | ชี้ไปหน้าสัปดาห์/สรุป/แบบฝึก/โจทย์ของสัปดาห์นั้น |
| ห้องสอบ | "M 22 IT", "Audi IT", "slope IT" (เดาจากห้องเรียน/ห้องสอบกลางภาค) | `null` → "ห้องสอบยังไม่ประกาศ" + ลิงก์ตารางสอบ |
| ควิซ ITF / ICS | "ตะลุยคลังควิซ ITF ครอบคลุม Week 8–15", "สรุปภาพรวม ICS + ควิซ" | คลังเหล่านั้นเป็นของกลางภาค ใช้ "ทดสอบตัวเอง" ท้ายหน้าสัปดาห์แทน |
| ICS คาบ 3–7 | 555 timer, 74161, 74181, 74244/74373 | ตามหัวข้อบทและใบงานจริงใน `summary.md` §2.2 และหน้าคาบ |
| ITF สัปดาห์ 8–15 | หัวข้อย่อยที่ไม่ตรงกับหน้าสัปดาห์ (OSI 7 layers, PDPA, Make.com เป็นเนื้อหาบรรยาย ฯลฯ) | ย่อจาก "อ่านจบแล้วต้องตอบได้" ของแต่ละหน้า |
| Math IT สัปดาห์ 14–15 | ปริมาตรอยู่สัปดาห์ 15 | ปริมาตรอยู่สัปดาห์ 14, สัปดาห์ 15 คือโมเมนต์/centroid + อนุพันธ์ย่อย (ตามหัวข้อสรุป) |
| PSCP สัปดาห์ 8 | "Hollow Square, Pyramid, Diamond" (ไม่มีในคลัง) | โจทย์ Learning Log ⭐ จริงจาก `summary.md` §2.2 พร้อมลิงก์ |

### สิ่งที่เปลี่ยนจากหน้ารุ่นแรก (การเข้าถึงและหน้าจอ)

| เรื่อง | รุ่นแรก | ตอนนี้ |
|---|---|---|
| ที่อยู่ | `/study-space` + ลิงก์ใน navbar ใครเปิดก็เห็น | `/profile/<รหัส>/study` เฉพาะเจ้าของ เข้าจากการ์ดบนโปรไฟล์ |
| แผนในเบราว์เซอร์ | import ใน client component — อยู่ใน JS chunk สาธารณะ | `server-only` ส่งเป็น prop หลังตรวจสิทธิ์ |
| โปรไฟล์ | กรอกรหัส/ชื่อเองในหน้าตั้งค่า | ใช้รหัสจาก session |
| หน้าหลัก | การ์ดวันสอบ แถบ 22 วัน ตัวจับเวลา และแท็บ 3 แบบในหน้าเดียว | ตัวจับเวลา + สิ่งที่ต้องอ่านวันนี้ เต็มความสูงจอ ที่เหลืออยู่ในแผงด้านข้าง |
| เปิดทิ้งไว้ | — | เต็มจอ, wake lock, ปุ่มจางเมื่อ idle, คีย์ลัด |

---

## 12. งานที่ทำบ่อย

**แก้แผนรายวัน** — แก้ `DAYS` ใน `lib/study-space/plans/final-1-2569.ts` ใช้ `u("ITF", 8)` อ้าง unit และ
`extras` สำหรับลิงก์พิเศษ (`res.*`) id ของ task สร้างจากวันที่ + วิชาเอง ห้ามมีวิชาซ้ำในวันเดียว
เพราะ id จะชนกัน แล้วอัปเดตตาราง §11

**ให้คนอื่นมีแผน** — ดู §2

**เพิ่มลิงก์ชนิดใหม่** — เพิ่มฟังก์ชันใน `href` (และ `res` ถ้าใช้ซ้ำ) ใน `links.ts` ถ้าเป็นชนิดใหม่
ให้เพิ่มใน `ResourceKind` และไอคอนใน `RESOURCE_ICON` (`primitives.tsx`)

**ห้องสอบประกาศแล้ว** — ใส่ `exam.room` ใน `subjects.ts` (ตรวจกับ `data/exams/` ก่อน)

**เทอมใหม่** — เพิ่มไฟล์แผนใหม่ใน `plans/` แล้วชี้รหัสไปที่แผนนั้นใน `PLANS_BY_STUDENT` แก้ `subjects.ts`
(วิชา วันสอบ) และ `units.ts` (ขอบเขต) `SubjectCode` ใน `types.ts` เป็น union ของวิชา ถ้าวิชาเปลี่ยนให้แก้ที่นั่นก่อน
TypeScript จะชี้จุดที่เหลือให้ ถ้าเปลี่ยนรูปร่างของ `UserProgressData` แบบไม่เข้ากัน ให้เปลี่ยน `KEY_PREFIX`
ใน `storage.ts` เป็น `_v2_`

**ข้อความ UI** — เพิ่มใน `strings.ts` เป็น `{ th, en }` เสมอ ใช้ `fill()` กับ placeholder `{n}`

---

## 13. การตรวจสอบ

```bash
npx tsc --noEmit -p .
npx eslint components/study-space/ lib/study-space/ "app/profile/[student_id]/" \
  components/footer.tsx components/navbar.tsx components/ui/sheet.tsx components/problems-view.tsx
bun run build
```

**เปิดตรวจทุกลิงก์** (dev server รันอยู่) — ลิงก์ `?doc=` ที่ slug ผิดจะไม่ 404 ต้องดูว่าเปิดเอกสารที่ถูก
ไฟล์แผนขึ้นต้นด้วย `import "server-only"` ซึ่งเป็น alias ภายในของ Next (ไม่มีแพ็กเกจนี้ใน `node_modules`)
สคริปต์จึงต้อง stub มันด้วย Bun plugin ก่อน import:

```bash
bun -e '
Bun.plugin({ name: "server-only-stub", setup(b) { b.module("server-only", () => ({ exports: {}, loader: "object" })); } });
const { FINAL_1_2569 } = await import("./lib/study-space/plans/final-1-2569.ts");
const { taskResources } = await import("./lib/study-space/plan.ts");
const { UNITS } = await import("./lib/study-space/units.ts");
const s = new Set();
UNITS.forEach((u) => u.resources.forEach((r) => s.add(r.href)));
FINAL_1_2569.days.forEach((d) => d.tasks.forEach((t) => taskResources(t).forEach((r) => s.add(r.href))));
console.log([...s].join("\n"));' | while read p; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3000$p") $p"; done | grep -v '^200'
```

ไม่มีผลลัพธ์ = ทุกลิงก์ตอบ 200 (ตรวจ 21 ต.ค. 2569: 50 ลิงก์ ผ่านทั้งหมด)

**ตรวจความเป็นส่วนตัว**

```bash
# ไม่ได้ล็อกอิน → 307 ไป / (ล็อกอินเป็นคนอื่น → 404)
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/profile/69070027/study
# หลัง `bun run build` ใหม่: ข้อความในแผนต้องไม่อยู่ใน JS สาธารณะ — ต้องไม่มีผลลัพธ์
grep -rl "วอร์มสูตรก่อนสอบ" .next/static
```

ข้อควรระวัง: `.next/` อาจยังมี chunk จาก build หรือ dev session รุ่นแรก (ตอนที่แผนยังถูก import ฝั่ง client)
ให้ตรวจหลัง build ใหม่เท่านั้น

---

## 14. ข้อจำกัดและงานต่อ

- **ข้อมูลอยู่ในเบราว์เซอร์เดียว** — เปลี่ยนเครื่องแล้วเวลาและเช็คลิสต์ไม่ตามไป ถ้าจะ sync ข้ามเครื่อง
  ทำ table ใน Supabase ผูกกับรหัสนักศึกษา เขียนผ่าน server action ที่เรียก `requireStudentId()` และให้ store
  เขียนสองที่ (รูปร่าง `UserProgressData` ใช้เป็น schema ได้เลย)
- **แผนเป็นโค้ด** — เปลี่ยนแผนต้อง deploy ใหม่ ถ้าจะให้แก้แผนเองได้ ย้ายแผนไปเก็บในฐานข้อมูลพร้อมคอลัมน์เจ้าของ
  และยังอ่านฝั่งเซิร์ฟเวอร์หลังตรวจสิทธิ์เหมือนเดิม
- **iPhone Safari** ไม่มี Fullscreen API สำหรับทั้งเอกสาร ปุ่มเต็มจอจึงไม่แสดง (ใช้ "เพิ่มลงหน้าจอโฮม" แทนได้)
  Wake Lock ต้องใช้ iOS 16.4 ขึ้นไป
- **เสียง** — เบราว์เซอร์บล็อกเสียงจนกว่าจะมีการกดครั้งแรก (autoplay policy) `chime.arm()` ปลุกเสียงตอนแตะหน้า
  ครั้งแรก ถ้ารีโหลดกลางรอบแล้วไม่แตะหน้าเลยจนครบรอบ เสียงจบรอบจะไม่ดัง
- **ICS ครึ่งหลัง** ยังไม่มีคลังข้อสอบหรือข้อสอบจำลอง ถ้าเพิ่มใน `course-bindings.ts` แล้ว ให้เพิ่ม `href`
  และผูกเข้าวันที่ 4–5 พ.ย.
- **คลังไฟล์** (`/library`) ยังไม่รองรับการกระโดดไปสัปดาห์ด้วย URL ลิงก์จึงเปิดหน้าคลังทั้งวิชา
  ไฟล์ของแต่ละสัปดาห์ดูได้ในตาราง "เอกสารประจำสัปดาห์" ของหน้าสัปดาห์อยู่แล้ว
- **key เก่าใน localStorage** จากรุ่นแรก (§8) บางตัวไม่ถูกลบ ไม่มีผลต่อการทำงาน
- **แผนอยู่ใน repo สาธารณะ** (§2) — ต้องย้ายออกก่อน push ถ้าต้องการให้เป็นความลับ
