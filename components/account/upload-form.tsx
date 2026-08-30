"use client";

import { useActionState, useRef, useState } from "react";
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COURSES } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/client";
import { createResource } from "@/lib/actions/upload";
import {
  ACCEPTED_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  RESOURCE_BUCKET,
  type UploadState,
} from "@/lib/resources";

const TYPES = [
  { value: "slide", label: "สไลด์เรียน" },
  { value: "summary", label: "สรุปเนื้อหา" },
  { value: "note", label: "โน้ตส่วนตัว" },
] as const;

const SCOPES = [
  { value: "midterm", label: "กลางภาค" },
  { value: "final", label: "ปลายภาค" },
] as const;

const ACCEPT = ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(",");

export function UploadForm({ studentId }: { studentId: string }) {
  const [state, formAction, isPending] = useActionState<UploadState, FormData>(
    createResource,
    {},
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = state.fieldErrors ?? {};
  const busy = uploading || isPending;

  /**
   * Push the file to Storage first, then hand the resulting object path to the
   * server action. The bucket policy only accepts writes under this student's
   * own id prefix, so the path the action receives is already trustworthy —
   * and it re-checks anyway.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    if (!file) {
      setUploadError("กรุณาเลือกไฟล์");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(
        `ไฟล์ใหญ่เกิน ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB`,
      );
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ACCEPTED_EXTENSIONS.includes(extension as never)) {
      setUploadError(`รองรับเฉพาะไฟล์ ${ACCEPTED_EXTENSIONS.join(", ")}`);
      return;
    }

    setUploading(true);
    try {
      const path = `${studentId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await createClient()
        .storage.from(RESOURCE_BUCKET)
        .upload(path, file, { contentType: file.type || undefined });

      if (error) {
        setUploadError("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่");
        return;
      }

      data.set("storagePath", path);
      formAction(data);
      form.reset();
      setFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {state.ok ? (
        <p className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          <CheckCircle2 className="size-4" />
          แชร์เข้าคลังเรียบร้อยแล้ว ขอบคุณมาก!
        </p>
      ) : null}

      {(state.error ?? uploadError) ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error ?? uploadError}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="subjectCode">วิชา</Label>
        <Select name="subjectCode" required>
          <SelectTrigger id="subjectCode" className="w-full">
            <SelectValue placeholder="เลือกวิชา" />
          </SelectTrigger>
          <SelectContent>
            {COURSES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} — {c.nameTh}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subjectCode ? (
          <p className="text-xs text-destructive">{errors.subjectCode}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">ชื่อเรื่อง</Label>
        <Input
          id="title"
          name="title"
          maxLength={200}
          placeholder="เช่น สรุปบทที่ 1–4 ก่อนสอบกลางภาค"
          required
        />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="type">ประเภท</Label>
          <Select name="type" required>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type ? (
            <p className="text-xs text-destructive">{errors.type}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="scope">ช่วงสอบ</Label>
          <Select name="scope">
            <SelectTrigger id="scope" className="w-full">
              <SelectValue placeholder="ไม่ระบุ" />
            </SelectTrigger>
            <SelectContent>
              {SCOPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">ไม่บังคับ</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file">ไฟล์</Label>
        <Input
          id="file"
          type="file"
          accept={ACCEPT}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
        <p className="text-xs text-muted-foreground">
          {ACCEPTED_EXTENSIONS.join(", ")} · ไม่เกิน{" "}
          {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          <Loader2 className="animate-spin" />
        ) : (
          <UploadCloud />
        )}
        {uploading ? "กำลังอัปโหลด..." : "แชร์เข้าคลัง"}
      </Button>
    </form>
  );
}
