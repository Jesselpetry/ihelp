"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoogleMark } from "@/components/account/google-mark";
import { createClient } from "@/lib/supabase/client";
import { verifyKmitlIt } from "@/lib/auth/verify";
import type { MeResponse } from "@/app/api/me/route";


/**
 * Session-aware account control for the navbar.
 *
 * <Navbar /> is rendered from many server pages without props, so the session
 * is read in the browser and the profile summary fetched from /api/me.
 */
export function AccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function apply(email: string | null | undefined) {
      const verified = verifyKmitlIt(email);
      if (cancelled) return;

      setSignedIn(verified.ok);
      setReady(true);

      if (!verified.ok) {
        setMe(null);
        return;
      }

      const res = await fetch("/api/me");
      if (cancelled) return;
      setMe(res.ok ? await res.json() : null);
    }

    supabase.auth.getUser().then(({ data }) => apply(data.user?.email));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      apply(session?.user.email),
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // Narrows Google's account chooser to KMITL accounts. The real gate is
        // still server-side in app/auth/callback/route.ts.
        queryParams: { hd: "kmitl.ac.th" },
      },
    });
  }

  async function signOut() {
    await createClient().auth.signOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  // Hold the space until the session is known, so the control does not flip.
  if (!ready) return <div className="h-8 w-8" aria-hidden="true" />;

  if (!signedIn) {
    return (
      <Button variant="outline" size="sm" onClick={signIn}>
        <GoogleMark className="size-4" />
        เข้าสู่ระบบ
      </Button>
    );
  }

  const href = me?.onboarded ? `/profile/${me.studentId}` : "/onboarding";
  const label = me?.displayName ?? "โปรไฟล์";

  return (
    <div className="flex items-center gap-1.5">
      <Button asChild variant="ghost" size="sm">
        <Link href="/upload" onClick={onNavigate}>
          <UploadCloud />
          {/*
            Hidden only between md and lg, where the nav links, both toggles
            and this cluster share one row. Below md this renders inside the
            mobile panel, which has room for the label.
          */}
          <span className="md:max-lg:sr-only">แชร์</span>
        </Link>
      </Button>

      <Badge asChild variant="outline" className="h-8 min-w-0 gap-1.5 pl-1 pr-2.5">
        <Link href={href} onClick={onNavigate}>
          <Avatar className="size-6">
            {me?.avatarUrl ? <AvatarImage src={me.avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
              {me?.initial ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-20 truncate lg:max-w-28">{label}</span>
        </Link>
      </Badge>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={signOut}
        aria-label="ออกจากระบบ"
      >
        <LogOut />
      </Button>
    </div>
  );
}
