import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PG IJUDGE",
  description:
    "ส่งโค้ดเข้า IJUDGE จาก VS Code ได้เลย ไม่ต้องเปิดเว็บ — เขียน รัน ส่ง เห็นผล pass/fail รายเทสต์เคส พร้อม hidden testcase, เตือนกำหนดส่ง, และอื่น ๆ ครบในเอดิเตอร์เดียว",
  alternates: { canonical: "/pro" },
  openGraph: {
    type: "website",
    url: "/pro",
    title: "PG IJUDGE — ส่งโค้ดเข้า IJUDGE จาก VS Code",
    description:
      "เขียน รัน ส่ง เห็นผล pass/fail ครบในเอดิเตอร์เดียว ไม่ต้องเปิดเว็บ IJUDGE อีกต่อไป",
  },
};

export default function ProLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
