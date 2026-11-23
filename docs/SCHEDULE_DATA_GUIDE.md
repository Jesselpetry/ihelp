# คู่มือการจัดการข้อมูลตารางเรียนและการส่งต่อระบบ (Schedule & Timetable Data Guide)

เอกสารนี้เป็นคู่มือมาตรฐาน (Standard Operating Procedure) สำหรับการดูแล ปรับปรุง และเพิ่มข้อมูลภาคการศึกษาใหม่ (เช่น ขึ้นปี 2 เทอม 1 หรือส่งต่อให้รุ่นน้องปี 1 ในปีการศึกษาถัดไป 2570, 2571...) ของระบบจำลองตารางเรียนส่วนบุคคล `/schedule` ใน iHelp

---

## 1. โครงสร้างสถาปัตยกรรมข้อมูล (Data Architecture)

ระบบตารางเรียนถูกออกแบบให้เป็น **White-label & Multi-term Dynamic Registry** โดยแยกความรับผิดชอบอย่างชัดเจนระหว่าง ข้อมูลดิบ (Data), ตรรกะแบบมี Type (Logic), และส่วนแสดงผล (UI):

```
├── data/schedule/                         # แหล่งจัดเก็บข้อมูลดิบและ JSON Snapshot
│   ├── teach-table-2569-2.json            # ไฟล์ดิบที่ดึงมาจากสำนักทะเบียน KMITL
│   ├── y1s2-meeting-dates.json            # รายการวัน-เวลาเรียนจริงทั้ง 118 คาบ
│   └── y1s2-student-groups.json           # โควตากลุ่มนักศึกษาตามช่วงรหัส 6907xxxx
│
├── lib/schedule/                          # Business Logic & Single Source of Truth
│   ├── types.ts                           # Interface ทั้งหมด (Term, Course, Section, Slot)
│   ├── registry.ts                        # Central Registry ศูนย์รวมภาคการศึกษาทั้งหมด
│   ├── y1s2-data.ts                       # ข้อมูลรายวิชาและกลุ่มเรียนของปี 1 เทอม 2
│   └── semester-dates.ts                  # Helper ตรวจสอบปฏิทินวันเรียนจริง 15 สัปดาห์
│
├── scripts/                               # เครื่องมือตรวจสอบอัตโนมัติ
│   └── audit-schedule.ts                  # Script ตรวจสอบความถูกต้องของข้อมูล (`bun run schedule:audit`)
│
└── components/schedule/                   # ส่วนแสดงผล UI (Dynamic, Zero-hardcode)
    ├── schedule-hub.tsx                   # State Orchestrator & Auto-hide Accordion
    ├── schedule-banner.tsx                # IT Banner พร้อมป้ายปีการศึกษาอัตโนมัติ
    ├── schedule-sidebar.tsx               # เมนูด้านข้างและ Jump Navigation
    ├── schedule-grid.tsx                  # ตารางเรียน Fixed-size (Weekly & Daily View)
    ├── schedule-course-accordion.tsx      # การ์ดรายวิชาและตารางเลือก Section
    └── schedule-export-card.tsx           # เครื่องมือส่งออก JSON / CSV
```

---

## 2. ขั้นตอนการเพิ่มภาคเรียนใหม่ (SOP: Adding a New Semester)

เมื่อขึ้นชั้นปีใหม่ (เช่น **ปี 2 เทอม 1 / 2570-1**) หรือต้องการเพิ่มตารางสำหรับรุ่นน้องรุ่นถัดไป ให้ปฏิบัติตาม 5 ขั้นตอนนี้:

### ขั้นตอนที่ 1: ดึงข้อมูลจากระบบสำนักทะเบียน KMITL
1. เข้าเว็บไซต์สำนักทะเบียน [regis.reg.kmitl.ac.th](https://regis.reg.kmitl.ac.th) เข้าเมนู **ตารางเรียน - สอบ**
2. เลือกปีการศึกษา ภาคเรียน คณะเทคโนโลยีสารสนเทศ และชั้นปีที่ต้องการ
3. บันทึกข้อมูลออกมาเป็น JSON เก็บไว้ที่ `data/schedule/teach-table-<academicYear>-<semester>.json`

### ขั้นตอนที่ 2: สร้างไฟล์ข้อมูลรายวิชา (Course Dataset)
สร้างไฟล์ข้อมูล เช่น `lib/schedule/y2s1-data.ts` (หรือสำหรับรุ่นน้อง `lib/schedule/y1s2-data.ts`) โดยประกาศโครงสร้างตาม Interface `TimetableCourse[]`:

```typescript
import type { TimetableCourse } from "./types";

export const Y2S1_COURSES: TimetableCourse[] = [
  {
    code: "060164xx",
    nameTh: "ชื่อวิชาภาษาไทย",
    nameEn: "COURSE TITLE IN ENGLISH",
    credits: "3(2-2-5)",
    creditHours: 3,
    category: "วิชาบังคับ", // หรือ "วิชาเลือก / GenEd"
    hasLab: true,
    midterm: {
      date: "จันทร์ 1 กุมภาพันธ์ 2570",
      time: "09:30 - 12:30",
    },
    final: {
      date: "จันทร์ 29 มีนาคม 2570",
      time: "13:30 - 16:30",
    },
    sections: [
      {
        section: 1,
        type: "ทฤษฎี",
        timeSlot: {
          day: "จันทร์",
          startHour: 9,
          startMinute: 0,
          endHour: 11,
          endMinute: 0,
          timeStr: "09:00 - 11:00",
          room: "M 22",
          building: "IT",
        },
        instructors: ["ผศ. ดร. ...", "รศ. ดร. ..."],
        condition: "เฉพาะรหัสนักศึกษา ...",
        seats: { total: 73, used: 70, remain: 3 },
      },
      // ... กลุ่มอื่น ๆ
    ],
  },
];
```

### ขั้นตอนที่ 3: ลงทะเบียนภาคการศึกษาใน Registry
เปิดไฟล์ `lib/schedule/registry.ts` และเพิ่มภาคการศึกษาใหม่:

```typescript
export const Y2S1_TERM_INFO: SemesterTermInfo = {
  id: "2570-1",
  academicYear: "2570",
  semester: 1,
  yearLevel: 2,
  faculty: "เทคโนโลยีสารสนเทศ",
  department: "เทคโนโลยีสารสนเทศ",
  labelTh: "ภาคเรียนที่ 1 / 2570",
  labelEn: "Semester 1 / 2027",
  subtitleTh: "ระดับปริญญาตรี ชั้นปีที่ 2",
  subtitleEn: "Undergraduate Year 2",
  startDateTh: "สิงหาคม 2570",
  endDateTh: "ธันวาคม 2570",
  startIsoDate: "2027-08-01",
  endIsoDate: "2027-12-15",
  isActive: true, // ตั้งเป็นภาคการศึกษาปัจจุบัน
};

export const REGISTERED_TERMS: SemesterTermInfo[] = [
  Y2S1_TERM_INFO,
  Y1S2_TERM_INFO, // ภาคเรียนเดิมยังคงอยู่ให้ย้อนดูได้
];
```

### ขั้นตอนที่ 4: รันการตรวจสอบความสมบูรณ์ของข้อมูล (Automated Audit)
รันคำสั่งตรวจสอบอัตโนมัติ:

```bash
bun run schedule:audit
```

ระบบจะทำการตรวจสอบ 8 หมวดหมู่ (มากกว่า 400 รายการ) โดยอัตโนมัติ:
- ✅ **Term Registry**: มีข้อมูลภาคเรียนครบถ้วน และมี Active Term เพียง 1 รายการ
- ✅ **Course Integrity**: รหัสวิชาไม่ซ้ำ, หน่วยกิตถูกต้อง, แยกกลุ่มทฤษฎีและปฏิบัติครบถ้วน
- ✅ **TimeSlots & Rooms**: ฟอร์แมตเวลาถูกต้อง, ระบุห้องเรียนและอาคารชัดเจน
- ✅ **Capacity**: จำนวนที่นั่งและยอดรับไม่ติดลบ
- ✅ **Presets & Clashes**: สูตรตารางเรียนอ้างอิง Section ที่มีอยู่จริง
- ✅ **Meeting Dates**: วันที่เรียนตรงกับวันในสัปดาห์จริงตามปฏิทินสากล
- ✅ **Student Rosters**: รูปแบบรหัสนักศึกษา 8 หลัก และไม่มีรหัสซ้ำซ้อนข้ามกลุ่ม

### ขั้นตอนที่ 5: ตรวจสอบหน้าเว็บและทดสอบ Build
```bash
npx tsc --noEmit -p .
bun run lint
bun run build
```

---

## 3. มาตรฐานการแสดงผลและ Typography (Design System Standard)

1. **ฟอนต์หลัก**: ใช้ฟอนต์ **IBM Plex Sans Thai** สำหรับข้อความภาษาไทยและตัวเลขในตารางทั้งหมด ห้ามใช้ `font-mono` บนหัวตารางหรือเนื้อหาตารางทั่วไป เพื่อความกลมกลืนกับธีมเว็บไซต์
2. **สีและพื้นผิว**:
   - พื้นหลังหลัก: Neutral Charcoal `#141416`
   - พื้นหลังการ์ด: `#1c1c1f`
   - ขอบเส้น: `border-border/40` หรือ subtle white opacity
   - ไอคอน: ใช้สีฟ้า `text-primary` เท่านั้น
3. **ห้ามใช้อีโมจิ (Zero Emojis)**: ในหัวข้อและตารางทั้งหมดตามข้อกำหนดของดีไซน์ระบบ
4. **ความเท่ากันของ Badge**: ป้ายหมวดหมู่วิชาและป้ายระบุกลุ่มเรียนต้องมีขนาดตัวอักษร (`text-xs`), ระยะขอบ (`px-2 py-0.5`), และสไตล์ความสูง (`inline-flex items-center`) เท่ากันสม่ำเสมอ

---

## 4. รายการ Checklist ส่งต่องานให้นักศึกษารุ่นถัดไป (Handoff Checklist)

- [ ] ข้อมูลรายวิชาตรงกับประกาศอย่างเป็นทางการของสำนักทะเบียน KMITL
- [ ] มีตารางสอบกลางภาคและสอบไล่ระบุไว้ในแต่ละรายวิชา
- [ ] ชื่อภาษาไทยตรงกับชื่อในระบบสารสนเทศของสถาบัน
- [ ] ตรวจสอบสูตรจัดตารางล่วงหน้า (Presets) ว่าไม่มีเวลาเรียนชนกัน
- [ ] คำสั่ง `bun run schedule:audit` ผ่าน 100% (0 errors, 0 warnings)
- [ ] คำสั่ง `bun run build` ผ่านการทดสอบระดับ Production
