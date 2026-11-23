# iHelp Brand Components (`components/brand/`)

โฟลเดอร์นี้รวบรวมคอมโพเนนต์ประจำแบรนด์ **iHelp** ตามข้อกำหนดมาตรฐานอัตลักษณ์และระบบดีไซน์ (Brand Identity & Design System)

> ดูคู่มือฉบับเต็ม: [docs/branding/README.md](../../docs/branding/README.md)

---

## คอมโพเนนต์ที่มีให้ใช้งาน

### 1. `<Wordmark />` (`wordmark.tsx`)
คอมโพเนนต์แสดงผลสัญลักษณ์คำ iHelp โดยเครื่องหมายเปิด-ปิด `< >` จะครอบคลุมเฉพาะตัว `i` (`<i>`) ในสีฟ้า Primary และตามด้วย `Help` ในสีตัวอักษรปกติ

```tsx
import { Wordmark } from "@/components/brand/wordmark";

// แสดงผลแบบเต็มพร้อมสี (สำหรับ Navbar / Header)
<Wordmark />

// แสดงผลแบบข้อความธรรมดา (<i>Help)
<Wordmark plain />

// แสดงผลแบบสำนวนบทความ (iHelp)
<Wordmark asProse />
```

### 2. `<BrandBanner />` (`brand-banner.tsx`)
คอนเทนเนอร์แบนเนอร์มาตรฐานของ iHelp ที่ไล่เฉดสีฟ้า Royal Blue Gradient (`IHELP_GRADIENT_CSS`), มีเส้นขอบโปร่งแสง (`border-white/10`), ลายน้ำสัญลักษณ์ IT KMITL โปร่งแสง 25% และสล็อตสำหรับปุ่มกดหรือป้ายตัวตนนักศึกษา

```tsx
import { BrandBanner } from "@/components/brand/brand-banner";

<BrandBanner
  watermarkCode="IT"
  title="ผลการเรียนและคะแนนสะสม"
  subtitle="สรุปคะแนนและ GPA รายวิชาทั้งหมด"
  action={<button>ดูรายละเอียด</button>}
/>
```

### 3. `<BrandBadge />` (`brand-badge.tsx`)
ป้ายสัญลักษณ์ / ชิป แสดงรหัสวิชา หมวดหมู่ หรือสถานะ

```tsx
import { BrandBadge } from "@/components/brand/brand-badge";

<BrandBadge variant="gradient">ITF</BrandBadge>
<BrandBadge variant="glass">Y1·S2</BrandBadge>
<BrandBadge variant="solid">Active</BrandBadge>
```
