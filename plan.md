# Master Plan: New Index Page Architecture & PSCP Course Hub Portal

> **Status:** Approved Architecture & Implementation Plan  
> **Lead Frontend Architect & Orchestrator:** Antigravity  
> **Branch Target:** `staging`  
> **Version:** 1.1.0  
> **Rule Compliance:** Strictly conforms to AGENTS.md, Zero Emojis, White Icons Standard, and Shadow Cap.

---

## 1. Executive Overview & Goals

The iHelp platform is evolving from a passive course directory into an **Academic Command Center & Specialized Course Hub Ecosystem**. Through codebase exploration and user feedback, two core architectural enhancements have been finalized:

1. **New Index Page (`app/page.tsx`)**:
   - **Hero Banner Carousel**: 3 high-impact slides highlighting active semester coursework, the Grade & Score Calculator, and Timetable / Exam Seating tools.
   - **Quick Navigation**: Symmetrical 6-tool discovery grid connecting first-year students directly to high-value features.
   - **Learning Library (`คลังเรียนรู้ IT KMITL`)**: Standardized section header with aligned instant search, filter pills, custom sorting (defaulting to _"Current Semester First"_), pinned Year 1 Semester 2 (`Y1-S2`) open by default, and collapsible older semesters (`Y1-S1`, `EN-KMITL`) that auto-expand upon searching.
2. **PSCP Course Hub Specialized Portal (`/courses/06066303-Problem-Solving-and-Computer-Programming`)**:
   - The Problem Solving and Computer Programming (PSCP) course has a unique interactive ecosystem: an in-browser Python IDE, OJ problem set, 14 recommended exam problems, and the PG IJUDGE VS Code Extension.
   - Currently, the PSCP course page lacks direct entry points to these tools.
   - We introduce a dedicated **Top Portal Section (`<PscpPortalSection />`)** placed right at the top of the course stream (using existing Classroom patterns: `TopicHeader`, Section Separator, `SURFACE` cards, Title + Description) providing 3 clear gateways:
     1. **คลังโจทย์และพื้นที่เขียนโค้ด (PSCP Problems & Online Workspace)** -> `/pscp`
     2. **14 โจทย์แนะนำเตรียมสอบ (14 Recommended Problems Hub)** -> `/recommended`
     3. **PG IJUDGE Pro (VS Code Extension)** -> In-app Guide & Quick Setup Modal

---

## 2. Codebase Audit Findings

### 2.1 Design Tokens & Tailwind v4 Architecture

- **Framework**: Tailwind v4 with `@theme inline` in `app/globals.css`.
- **Light Theme**:
  - Background: `#f4f6f8` (`--background`)
  - Cards: `#ffffff` (`--card`)
  - Primary Brand: `#2357A5` (KMITL Royal Sapphire, `--primary`)
  - Borders: `#e2e8f0` (`--border`)
  - Text: `#111827` (`--foreground`), `#6a6a6a` (`--muted-foreground`)
- **Dark Theme (Figma-Inspired Neutral Charcoal)**:
  - Background: `#141416` (`--background`)
  - Cards: `#1c1c1f` (`--card`)
  - Popovers: `#222226` (`--popover`)
  - Accent / Hover Surface: `#2a2a30` (`--accent`)
  - Hairline Borders: `oklch(1 0 0 / 8.5%)` (`--border`)
  - Primary Brand (Accessible Sky Cobalt): `#4c93ff` (`--primary`)
  - Text: `#f4f4f6` (`--foreground`), `#9ca3af` (`--muted-foreground`)
- **Signature Gradient (`lib/courses/course-theme.ts`)**:
  - `IHELP_GRADIENT`: `from: #3a72c8` via `#2357A5` to `#163980` (135° diagonal).

### 2.2 Container Alignment Standard

- Both the floating Navbar and all Index page sections inherit a strict **Single Vertical Rail**:
  `<main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8 space-y-10 sm:space-y-12">`.

### 2.3 Course Hub Patterns (`components/course-hub-shared.tsx` & `components/subject-hub.tsx`)

- Standard 2-Panel Classroom Layout:
  - Left: Sticky `CourseSidebar` with exam scope filter and topic jump list.
  - Right: Main stream with `TopicHeader` (`border-b border-primary/25 pb-2`, bold primary title, description, and aside badge) and `SURFACE` cards (`rounded-2xl bg-card border border-border/70 dark:border-white/10 shadow-sm`).

---

## 3. Strict UI Token Contract

| Rule                       | Specification                                                          | Acceptance Criteria                                                                                      |
| :------------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Brand Colors Only**      | Use only tokens in `app/globals.css` and `lib/courses/course-theme.ts` | `#2357A5`, `#4c93ff`, `IHELP_GRADIENT_CSS`, neutral dark `#141416`/`#1c1c1f`. Zero foreign colors.       |
| **Zero Emojis**            | Absolutely 0 Unicode emojis                                            | All icons must be Lucide SVG components. Zero emojis in UI, headers, pills, or badges.                   |
| **White Icons Standard**   | `text-white` on brand containers                                       | Primary icon boxes use `#2357A5` (light) / `#1e4a8a` (dark) or `IHELP_GRADIENT`. High contrast (>5.2:1). |
| **Shadow Cap**             | Capped at `shadow-sm` and `hover:shadow-md`                            | Absolute ban on `shadow-lg`, `shadow-xl`, `shadow-2xl`, and diffuse neon glow halos.                     |
| **Single Vertical Rail**   | `max-w-6xl px-3 sm:px-6`                                               | Navbar, Hero, Quick Nav, Learning Library, and Footer share identical horizontal boundaries.             |
| **Bilingual Localization** | `LText` (`{ th: string, en: string }`)                                 | Every UI string is wrapped in `LText` and rendered through `t(..., locale)`.                             |

---

## 4. Component Architecture & File Ownership Map

```
app/
└── page.tsx                         [Track 5] New Server Shell & Assembly
components/
├── home/
│   ├── hero-carousel.tsx            [Track 2] Hero Banner Carousel
│   ├── quick-nav-section.tsx        [Track 3] Quick Nav Grid & Cards
│   ├── library-header.tsx           [Track 4] Section Header & Aligned Search
│   ├── library-toolbar.tsx          [Track 4] Filter Pills, Sort Dropdown & Empty State
│   ├── semester-group.tsx           [Track 5] Semester Accordion & Active Highlight
│   └── learning-library.tsx         [Track 5] Library Container Wrapper
├── section-header.tsx               [Track 1] Central Shared Header Primitive
├── course-book-card.tsx             [Track 5] Instructor Truncate & Shadow Polish
├── pscp/
│   ├── pscp-portal-section.tsx      [Track 6] PSCP Top Portal Section (Workspace, Recommended, Pro)
│   └── pg-ijudge-modal.tsx          [Track 6] PG IJUDGE Extension Details & Setup Modal
└── subject-hub.tsx                  [Track 6] Integration of PscpPortalSection for PSCP
lib/
└── home/
    ├── hero-slides.ts               [Track 2] Slide Data, Interfaces & Visuals
    ├── quick-nav-data.ts            [Track 3] Feature Matrix & Metadata
    └── course-filter.ts             [Track 4] Filter, Sort & Match Logic (SSR-safe)
```

---

## 5. Detailed Specifications

### Track 1: Shared Primitives (`components/section-header.tsx`)

- Props: `icon: LucideIcon`, `title: LText | string`, `description?: LText | string`, `badge?: ReactNode`, `rightSlot?: ReactNode`.
- White Icon Box: `size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0`.
- Responsive: Horizontal flex on desktop (`sm:flex-row sm:items-center sm:justify-between`), vertical stack on mobile.

### Track 2: Hero Banner Carousel (`components/home/hero-carousel.tsx`)

- Height: Fixed `h-[280px]` on desktop (`md:`), responsive min-height `360px` on mobile stacked.
- Background: `IHELP_GRADIENT_CSS` with `border border-white/10 shadow-sm`.
- 3 Slides in `lib/home/hero-slides.ts`:
  1. Active Semester Y1-S2 Study Hub (BFIT, DSA, OOP, PSTAT).
  2. Grade & Score Calculator (`/grades`).
  3. Class Timetable & Room Seating (`/schedule` & `/exam-schedule/archive`).
- Controls: Expanding pill indicators (`w-6` active / `size-2` inactive), pure white chevron arrows on `bg-black/40` glass circles, 6000ms autoplay pausing on hover/focus, touch swipe & arrow key navigation.

### Track 3: Quick Navigation Pills & Student Profile Capsule

**Owner:** Sub-Agent 3  
**Target Files:** `lib/home/quick-nav-data.ts`, `components/home/quick-nav-pills.tsx`, `components/home/student-profile-capsule.tsx`

#### 1. Student Profile Capsule (`components/home/student-profile-capsule.tsx`)

- **Clean Profile Badge UI**:
  - **Signed In**: Displays the student's Avatar + Name (with nickname badge if set) + crisp white `rounded-full` Student ID badge (`bg-white dark:bg-white/10 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-900 dark:text-white shadow-2xs border border-border/60 dark:border-white/20`). Links to student profile `/profile/[studentId]`.
  - **Signed Out**: Displays clean Google Sign-in button (`<Button variant="outline" className="rounded-full">` with `GoogleMark` + `"เข้าสู่ระบบด้วย KMITL"`).
  - Can be rendered in a Welcome bar above or beside the navigation tools.

#### 2. Rounded-Full Navigation Pills (`components/home/quick-nav-pills.tsx`)

- **Pill Architecture**:
  - Shape: Clean `rounded-full border border-border/80 bg-card hover:bg-muted/50 px-3.5 sm:px-4 py-2 transition-all shadow-xs hover:shadow-sm hover:border-primary/40 hover:-translate-y-0.5`.
  - Left Element: **iHelp Royal Blue Icon (`text-primary` or `#2357A5` / Dark `#4c93ff`)**.
  - Right Element: **Normal high-contrast text (`text-foreground font-semibold text-xs sm:text-sm`)**.
  - Micro-badge or arrow: Optional subtle `ChevronRight` or compact status pill.
- **6 Curated Navigation Targets**:
  1. Grade & Score Calculator (`/grades`) — `Calculator`
  2. Timetable & Schedule Planner (`/schedule`) — `CalendarClock`
  3. PSCP Coding Workspace (`/pscp`) — `Terminal`
  4. Media & Exam Library (`/library`) — `BookOpen`
  5. Exam Seating Locator (`/exam-schedule/archive`) — `Compass`
  6. Developer Documentation (`/docs`) — `Cpu`
- **Layout**: Flexible responsive pill cluster / horizontal wrap grid that creates an unmistakable, distinctive, and clean navigational presence.

### Track 4: Learning Library Header, Search & Filter Toolbar

- **Aligned Section Header & Search**: `flex flex-col gap-4 md:flex-row md:items-end md:justify-between`. Bottom edge of search bar aligns flush with description baseline on desktop.
- **Filter Pills**: All (`ทั้งหมด`), Y1-S2 (`ปี 1 เทอม 2` with live pulsing emerald indicator), Y1-S1 (`ปี 1 เทอม 1`), EN-KMITL (`วิศวกรรมศาสตร์`).
- **Sort Dropdown**: Default: `current-first` (`เทอมปัจจุบันก่อน`), followed by `semester-asc`, `code-asc`, `name-asc`.
- **Search Logic (`lib/home/course-filter.ts`)**: Multi-term matching across `code`, `officialCode`, `nameTh`, `nameEn`, `slug`, `instructors`.
- **Empty State**: Zero emojis, `SearchX` icon in neutral rounded box, bilingual message, reset button.

### Track 5: Semester Grouping, Card Polish & Assembly

- **Active Semester (Y1-S2)**: Pinned at top, `border-primary/25 bg-card/40 dark:bg-card/25 rounded-2xl p-4 sm:p-5 ring-1 ring-primary/10`, default expanded.
- **Older Semesters (Y1-S1, EN-KMITL)**: Subdued style, default collapsed with smooth CSS Grid transition, auto-expands when search query is active.
- **Course Card Polish**: Add `min-w-0 truncate` with `title` tooltip and `aria-label` to instructors row. Cap shadow at `shadow-sm hover:shadow-md`.

### Track 6: PSCP Course Hub Specialized Portal

- **Target File**: `components/pscp/pscp-portal-section.tsx`, `components/pscp/pg-ijudge-modal.tsx`.
- **Placement**: Top section in `components/subject-hub.tsx` when `code === "PSCP" && !reading`, immediately above `CourseOverview`.
- **Header Pattern**: Uses `TopicHeader` (`id="pscp-portal"`), title `"คลังโจทย์และเครื่องมือโปรแกรมมิ่ง"`, subtitle `"ศูนย์รวมเครื่องมือเขียนโค้ด ตะลุยโจทย์ iJudge โจทย์แนะนำเตรียมสอบ และส่วนขยาย VS Code"`, and aside badge `"3 เครื่องมือหลัก"`.
- **3 Portal Cards**:
  1. **PSCP Problems & Workspace (`/pscp`)**:
     - Icon: `Terminal` (White on brand solid container)
     - Title: `คลังโจทย์และพื้นที่เขียนโค้ด` / `Problems & Online Workspace`
     - Description: `คลังโจทย์ iJudge 100+ ข้อ พร้อมตัวรันโค้ด Python ในเบราว์เซอร์ เทสเคส และตัวช่วยสร้าง submission.md / ai_reflection.md`
     - Action: `เปิดคลังโจทย์และเขียนโค้ด →`
     - Badge: `iJudge OJ`
  2. **14 Recommended Problems Hub (`/recommended`)**:
     - Icon: `BrainCircuit` (White on brand solid container)
     - Title: `14 โจทย์แนะนำเตรียมสอบ` / `14 Recommended Problems`
     - Description: `ตะลุยโจทย์แนวข้อสอบจริง 14 ข้อ คัดสรรโดยรุ่นพี่ พร้อมเฉลย เทคนิค Python ทีละสเต็ป และตรวจเทสเคสอัตโนมัติ`
     - Action: `ดูโจทย์แนะนำ 14 ข้อ →`
     - Badge: `Exam Prep`
  3. **PG IJUDGE Pro (VS Code Extension)**:
     - Icon: `Code2` (White on brand solid container)
     - Title: `PG IJUDGE Pro Extension` / `VS Code Extension`
     - Description: `ส่วนขยาย VS Code ส่งโค้ดตรงเข้า iJudge จากเอดิเตอร์ รันตัวอย่างในเครื่อง ตรวจสอบ Pass/Fail ได้ทันที`
     - Action: Triggers `<PgIjudgeModal />` showing quick setup steps (VS Code Marketplace, license key request from `@pgthegod_x` on Instagram).
     - Badge: `VS Code Tool`
- **Sidebar Integration**: In `components/course-sidebar.tsx`, when `courseCode === "PSCP"`, prepend link to `#pscp-portal` in the Topic jump list.

---

## 6. Implementation Workflow

1. **Step 1: PSCP Course Hub Portal**
   - Create `components/pscp/pg-ijudge-modal.tsx`
   - Create `components/pscp/pscp-portal-section.tsx`
   - Integrate into `components/subject-hub.tsx` and `components/course-sidebar.tsx`
2. **Step 2: Shared Index Primitives**
   - Create `components/section-header.tsx`
3. **Step 3: Index Feature Modules (Parallel Tracks)**
   - Track 2: `lib/home/hero-slides.ts` + `components/home/hero-carousel.tsx`
   - Track 3: `lib/home/quick-nav-data.ts` + `components/home/quick-nav-section.tsx`
   - Track 4: `lib/home/course-filter.ts` + `components/home/library-header.tsx` + `components/home/library-toolbar.tsx`
   - Track 5: `components/course-book-card.tsx` polish + `components/home/semester-group.tsx` + `components/home/learning-library.tsx`
4. **Step 4: Index Assembly**
   - Update `app/page.tsx` with unified `max-w-6xl` rail and `<Footer />`.
5. **Step 5: Verification & QA**
   - Run `npx tsc --noEmit -p .`, `bun run lint`, and verify all items in the UI Checklist.

---

## 7. Verification & UI Audit Checklist

- [ ] Zero Unicode emojis in any text, header, badge, or visual.
- [ ] White icons (`text-white`) on solid brand / gradient containers for all primary cards and section headers.
- [ ] Shadows strictly capped at `shadow-sm` and `hover:shadow-md` (dark mode `dark:shadow-none`).
- [ ] Single vertical rail alignment: `max-w-6xl px-3 sm:px-6` across Navbar, Hero, Quick Nav, Learning Library, and Footer.
- [ ] PSCP course page renders `<PscpPortalSection />` cleanly at the top of the stream, with active links to `/pscp`, `/recommended`, and `<PgIjudgeModal />`.
- [ ] Instructor names truncate cleanly without horizontal flex overflow on mobile.
- [ ] Default collapsed state for past semesters (Y1-S1, EN-KMITL) with auto-expansion during search.
- [ ] Full bilingual support (`LText`) across all newly introduced strings.
- [ ] TypeScript compilation (`npx tsc --noEmit -p .`) passes with 0 errors.

---
