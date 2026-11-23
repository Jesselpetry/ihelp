# สถาปัตยกรรมหน้า Index โฉมใหม่ (Academic Command Center Architecture)

> **ศูนย์กลางการนำทาง การเรียนรู้ และการอำนวยความสะดวกสำหรับนักศึกษา IT KMITL**  
> สถานะเอกสาร: แม่บทระบบ (Architecture Blueprint) · กิ่งพัฒนา: `staging`  
> ปรับปรุงล่าสุด: 23 พฤศจิกายน 2569 | คณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง

---

## 1. บทนำและวิสัยทัศน์ (Overview & Vision)

หน้าแรกของ iHelp (`app/page.tsx`) ได้รับการออกแบบและพัฒนาขึ้นใหม่ในรูปแบบ **Academic Command Center** เพื่อทำหน้าที่เป็นประตูทางเข้าหลักแบบเบ็ดเสร็จ (Single Entrypoint) สำหรับนักศึกษาคณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (IT KMITL) โดยรวมศูนย์บริการเครื่องมือด่วน ไฮไลต์ภาคการศึกษาปัจจุบัน คลังเนื้อหารายวิชา และสถานะโปรไฟล์นักศึกษาไว้บนหน้าจอเดียวอย่างเป็นระเบียบ สวยงาม และรวดเร็ว

---

## 2. แผนผังโครงสร้างคอมโพเนนต์ (Component Hierarchy)

```
app/page.tsx (Server Component Entrypoint with ItemList JSON-LD)
│
├── components/navbar.tsx (Global Nav: Wordmark, Grades, Schedule, Version, Auth & Theme)
│
└── main.mx-auto.max-w-6xl (Single Vertical Rail Standard)
    │
    ├── 1. components/home/hero-carousel.tsx (Hero Highlights Carousel)
    │      ├── CourseWatermark (Large IT Bleed, scale-125..150 origin-bottom-right)
    │      ├── Dynamic Slide Content (Badge, Title, Description, CTAs with fade-in transition)
    │      └── Autoplay Loop & Touch Gesture Swipe Controller
    │
    ├── 2. components/home/quick-nav-pills.tsx (Quick Navigation & Services)
    │      ├── SectionHeader Standard (Icon box size-10, title, subtitle)
    │      ├── StudentProfileCapsule (2-line Student Identity or Google Sign-In button)
    │      └── QuickNavPill[] (5-column responsive rounded-full pill grid)
    │
    └── 3. components/home/learning-library.tsx (Interactive Course Library)
           ├── components/home/library-header.tsx (Matching Section Header with Search Bar)
           ├── components/home/library-toolbar.tsx (Term Filter Pills & Sorting Select)
           ├── components/home/semester-group.tsx[] (Card-Based Accordion Stream)
           │      ├── SemesterCalendar (Y-S Badge)
           │      ├── Current Term Live Badge
           │      └── components/course-book-card.tsx[] (Course Cards with Watermark & Tooltips)
           └── LibraryEmptyState (Zero-match fallback with filter reset)
```

---

## 3. เจาะลึกคอมโพเนนต์หลัก (Core Subsystem Components)

### 3.1 Hero Highlights Carousel (`components/home/hero-carousel.tsx`)
- **ความสูงกระชับ (Compact Viewport)**: ออกแบบความสูงให้เหมาะสม (`min-h-[200px] md:h-[205px]`) เพื่อไม่ให้ดันเนื้อหาสำคัญด้านล่างหลุดจากหน้าจอ (First Fold)
- **อัตลักษณ์แบรนด์**: ใช้พื้นหลังการ์เดียนท์หลัก `IHELP_GRADIENT_CSS` (`linear-gradient(135deg, #184282, #2357A5 45%, #3b82f6)`) พร้อมขยายโลโก้ไอทีลายน้ำมุมขวาล่าง (`scale-125 sm:scale-150 origin-bottom-right`)
- **สไลด์และการควบคุม**:
  - สไลด์ 1: Welcome & Active Term Y1-S2 Study Portal
  - สไลด์ 2: Grade & Exam Score Calculator
  - สไลด์ 3: Class Timetable & Exam Room Seating
  - มีระบบสลับสไลด์อัตโนมัติ (Autoplay 6,000ms), หยุดชั่วคราวเมื่อเมาส์ชี้ (Hover Pause), รองรับการปัดหน้าจอบนอุปกรณ์สัมผัส (Touch Swipe) และคีย์บอร์ด (ArrowLeft / ArrowRight)
  - แอนิเมชัน Fade-in เมื่อสลับสไลด์ (`animate-in fade-in-50 duration-300`)

### 3.2 แถบทางลัดบริการด่วน (`components/home/quick-nav-pills.tsx`)
- รวบรวม 5 เครื่องมือที่มีการใช้งานสูงสุดสำหรับนักศึกษา:
  1. **คำนวณเกรด & GPAX** (`/grades`)
  2. **จำลอง & จัดตารางเรียน** (`/schedule`)
  3. **คลังโจทย์ PSCP Lab** (`/pscp`)
  4. **ผังที่นั่งสอบรายบุคคล** (`/exam-schedule/archive`)
  5. **Developer Docs** (`/docs`)
- ใช้สไตล์ **Rounded-Full Capsule** ขอบซ้ายเป็นไอคอนสีฟ้าแบรนด์ iHelp (`bg-primary/10 text-primary`) ข้อความแสดงผลเต็มขนาดโดยตัดขึ้นบรรทัดใหม่เมื่อเนื้อหายาว (Zero Truncation) และขอบขวาเป็นลูกศรเฉียงขวาบน (`ArrowUpRight`) พร้อมป้ายสถานะ

### 3.3 แบดจ์โปรไฟล์นักศึกษา (`components/home/student-profile-capsule.tsx`)
- **กรณีเข้าสู่ระบบแล้ว (Authenticated)**:
  - แสดงผลเป็นแคปซูลมนกลม 2 บรรทัด (`rounded-full border bg-card`)
  - ด้านซ้าย: รูปประจำตัว Avatar (หรือชื่อย่อตัวอักษรแรก)
  - บรรทัดบน: ชื่อ-นามสกุลของนักศึกษา
  - บรรทัดล่าง: รหัสประจำตัวนักศึกษา 8 หลัก (`font-mono font-semibold`)
  - คลิกลิงก์ไปยังหน้าโปรไฟล์ส่วนบุคคล `/profile/<studentId>`
- **กรณียังไม่ได้เข้าสู่ระบบ (Guest)**:
  - แสดงปุ่ม "เข้าสู่ระบบด้วย @kmitl.ac.th" พร้อมไอคอน GoogleMark อย่างสุภาพและชัดเจน

### 3.4 ส่วนหัวมาตรฐาน Section Header (`components/section-header.tsx`, `library-header.tsx`)
- กำหนดสเปกความสูงและ Typographic Hierarchy ให้เท่ากันอย่างสมบูรณ์:
  - กล่องไอคอนขาวบนพื้นฟ้า: `size-10 rounded-xl bg-primary text-white shadow-xs`
  - ไอคอนภายใน: `size-5 text-white`
  - หัวข้อหลัก: `text-base sm:text-lg font-bold tracking-tight text-foreground`
  - คำอธิบายย่อย: `text-xs text-muted-foreground leading-normal`
  - เส้นขอบล่าง: `border-b border-border/80 pb-3 sm:pb-3.5`

### 3.5 คลังรายวิชาและการจัดกลุ่ม Accordion (`components/home/learning-library.tsx`, `semester-group.tsx`)
- **Filter Bar & Sorting**:
  - ตัวกรองรายวิชาแบบ Pills: ทั้งหมด, ปี 1 เทอม 2 (Y1-S2), ปี 1 เทอม 1 (Y1-S1), วิศวกรรมศาสตร์ (EN-KMITL)
  - เมนูจัดเรียง: เทอมปัจจุบันก่อน (Current semester first), ตามลำดับเทอม, รหัสวิชา ก-ฮ, ชื่อวิชา
  - ช่องค้นหาอัจฉริยะ (Search Bar): ค้นหารหัสวิชาหรือชื่อวิชาได้ทั้งสองภาษา
- **Card-Based Accordion Stream**:
  - ทุกกลุ่มภาคเรียนถูกห่อหุ้มด้วยการ์ดมาตรฐาน (`SURFACE bg-card rounded-2xl border shadow-xs`)
  - ภาคเรียนปัจจุบัน (`Y1-S2`) กางออกเป็นค่าเริ่มต้น พร้อมแสดงแบดจ์ "ภาคเรียนปัจจุบัน"
  - รองรับการกางออกอัตโนมัติทุกกลุ่มทันทีเมื่อผู้ใช้พิมพ์คำค้นหาใน Search Bar (โดยไม่ก่อให้เกิด State Re-render Loop)
  - แอนิเมชันเปิด-ปิดด้วย CSS Grid Zero-layout-shift (`grid-rows-[1fr]` สลับกับ `grid-rows-[0fr]`)

---

## 4. มาตรฐานการออกแบบและการเข้าถึง (Design & Accessibility Standards)

1. **Brand Colors Only**: ยึดสีประจำแบรนด์ iHelp (`#2357A5` Light / `#4c93ff` Dark) และพาเลตต์ชาร์โคล (`--background: #141416`, `--card: #1c1c1f`, `--popover: #222226`)
2. **Zero Emojis**: ใช้เฉพาะไอคอน SVG จากชุด Lucide React เท่านั้น
3. **White Icon Container Standard**: ไอคอนหลักบนพื้นแบรนด์ต้องเป็นสีขาว `text-white` เสมอ
4. **Single Rail Width**: ทุกส่วนในหน้าแรกจัดเรียงอยู่ภายในรางแนวตั้งเดี่ยว `max-w-6xl px-3 sm:px-6`
5. **SEO & Structured Data**: มีการแนบ ItemList Schema.org JSON-LD สำหรับรายวิชาทั้งหมดที่แคตตาล็อกไว้ในระบบ
