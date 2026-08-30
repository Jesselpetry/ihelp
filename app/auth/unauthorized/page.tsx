import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { VERIFY_MESSAGES, type VerifyFailure } from "@/lib/auth/verify";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบไม่สำเร็จ",
  robots: { index: false, follow: false },
};

const FALLBACK = "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";

const DETAIL: Record<string, string> = {
  faculty:
    "รหัสนักศึกษาของคุณไม่ได้ขึ้นต้นด้วยรหัสคณะ 07 <i>help เปิดให้เฉพาะนักศึกษาคณะเทคโนโลยีสารสนเทศ สจล. เท่านั้น",
  domain:
    "ระบบรองรับเฉพาะบัญชี Google ของ สจล. ที่ลงท้ายด้วย @kmitl.ac.th เท่านั้น กรุณาออกจากระบบบัญชีอื่นแล้วลองใหม่",
  id_format:
    "ชื่ออีเมลก่อนเครื่องหมาย @ ต้องเป็นรหัสนักศึกษา 8 หลัก บัญชีบุคลากรยังไม่รองรับ",
};

function isVerifyFailure(value: string): value is VerifyFailure {
  return value in VERIFY_MESSAGES;
}

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason = "" } = await searchParams;
  const headline = isVerifyFailure(reason) ? VERIFY_MESSAGES[reason] : FALLBACK;
  const detail = DETAIL[reason];

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-balance">{headline}</h1>
          {detail ? (
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {detail}
            </p>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground">
          คุณถูกออกจากระบบเรียบร้อยแล้ว
        </p>

        <Button asChild size="lg">
          <Link href="/">กลับไปหน้าแรก</Link>
        </Button>
      </main>
    </>
  );
}
