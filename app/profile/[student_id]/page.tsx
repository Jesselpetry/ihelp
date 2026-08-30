import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { ExternalLink, FileText, Pencil } from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/social-icons";

import { db, resources, users, type Resource } from "@/db";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { AvatarUploader } from "@/components/account/avatar-uploader";
import { currentStudentId } from "@/lib/auth/guards";
import { avatarInitial, resolveAvatarUrl } from "@/lib/avatar";
import { resourcePublicUrl } from "@/lib/resources";
import { findCourseByCode } from "@/lib/catalog";
import { majorLabel } from "@/lib/majors";

const TYPE_LABELS: Record<Resource["type"], string> = {
  slide: "สไลด์",
  summary: "สรุป",
  note: "โน้ต",
};

const SCOPE_LABELS: Record<NonNullable<Resource["scope"]>, string> = {
  midterm: "กลางภาค",
  final: "ปลายภาค",
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const getProfile = async (studentId: string) =>
  db.query.users.findFirst({
    where: eq(users.studentId, studentId),
    with: {
      resources: { orderBy: [desc(resources.createdAt)] },
    },
  });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ student_id: string }>;
}): Promise<Metadata> {
  const { student_id } = await params;
  const profile = await getProfile(student_id);
  if (!profile) return { title: "ไม่พบโปรไฟล์" };

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  return {
    title: profile.nickname ?? name ?? student_id,
    description: `ผลงานที่ ${name || student_id} แชร์ให้เพื่อนๆ คณะ IT สจล.`,
    alternates: { canonical: `/profile/${student_id}` },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id } = await params;
  const profile = await getProfile(student_id);
  if (!profile) notFound();

  const isOwner = (await currentStudentId()) === profile.studentId;

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null;
  const avatarSrc = resolveAvatarUrl(profile);
  const major = majorLabel(profile.major);
  const socials = [
    { href: profile.facebookUrl, icon: FacebookIcon, label: "Facebook" },
    { href: profile.igUrl, icon: InstagramIcon, label: "Instagram" },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
          <Avatar className="size-20 shrink-0">
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={fullName ?? profile.studentId} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
              {avatarInitial(profile)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">
                {profile.nickname ?? fullName ?? profile.studentId}
              </h1>
              {profile.role !== "student" ? (
                <Badge variant="secondary">
                  {profile.role === "admin" ? "แอดมิน" : "ทีมงาน"}
                </Badge>
              ) : null}
            </div>

            {fullName ? (
              <p className="text-sm text-muted-foreground">{fullName}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">{profile.studentId}</span>
              {major ? <span>{major}</span> : null}
            </div>

            {socials.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {socials.map(({ href, icon: Icon, label }) => (
                  <Badge key={label} asChild variant="outline">
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <Icon />
                      {label}
                    </a>
                  </Badge>
                ))}
              </div>
            ) : null}

            {isOwner ? (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <AvatarUploader
                  studentId={profile.studentId}
                  hasCustomAvatar={Boolean(profile.avatarUrl)}
                  hasGoogleAvatar={Boolean(profile.googleAvatarUrl)}
                />
                <Button asChild variant="outline" size="sm">
                  <Link href={`/profile/${profile.studentId}/edit`}>
                    <Pencil />
                    แก้ไขโปรไฟล์
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            แชร์เข้าคลังแล้ว {profile.resources.length} รายการ
          </h2>

          {profile.resources.length === 0 ? (
            <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              ยังไม่ได้แชร์อะไรเข้าคลัง
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {profile.resources.map((item) => {
                const course = findCourseByCode(item.subjectCode);
                return (
                  <li key={item.id}>
                    <a
                      href={resourcePublicUrl(item.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      <p className="font-medium leading-snug text-pretty">
                        {item.title}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                        <Badge variant="outline">
                          {course?.code ?? item.subjectCode}
                        </Badge>
                        <Badge variant="secondary">
                          {TYPE_LABELS[item.type]}
                        </Badge>
                        {item.scope ? (
                          <Badge variant="secondary">
                            {SCOPE_LABELS[item.scope]}
                          </Badge>
                        ) : null}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {dateFormatter.format(item.createdAt)}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
