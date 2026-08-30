"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper, { type Area } from "react-easy-crop";
import { Camera, Loader2, RotateCcw, ZoomIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { resetAvatar, setAvatar } from "@/lib/actions/profile";
import { AVATAR_BUCKET, ACCEPTED_AVATAR_TYPES } from "@/lib/avatar";
import { cropToAvatarBlob, validateAvatarFile } from "@/lib/image-crop";

const ACCEPT = ACCEPTED_AVATAR_TYPES.join(",");

export function AvatarUploader({
  studentId,
  hasCustomAvatar,
  hasGoogleAvatar,
}: {
  studentId: string;
  hasCustomAvatar: boolean;
  hasGoogleAvatar: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The object URL backs the cropper preview; revoke it so a few edits in one
  // session do not pin several megabytes of decoded image in memory.
  useEffect(() => {
    if (!imageSrc) return;
    return () => URL.revokeObjectURL(imageSrc);
  }, [imageSrc]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  function pickFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset immediately so picking the same file twice still fires onChange.
    event.target.value = "";
    if (!file) return;

    const problem = validateAvatarFile(file);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setImageSrc(URL.createObjectURL(file));
  }

  async function save() {
    if (!imageSrc || !croppedArea) return;
    setBusy(true);
    setError(null);

    try {
      const blob = await cropToAvatarBlob(imageSrc, croppedArea);

      // The bucket policy only accepts writes under this student's own prefix,
      // and the server action re-checks the path before trusting it.
      const path = `${studentId}/${crypto.randomUUID()}.webp`;
      const upload = await createClient()
        .storage.from(AVATAR_BUCKET)
        .upload(path, blob, { contentType: "image/webp" });

      if (upload.error) {
        setError("อัปโหลดไม่สำเร็จ กรุณาลองใหม่");
        return;
      }

      const result = await setAvatar(path);
      if ("error" in result) {
        setError(result.error);
        return;
      }

      setImageSrc(null);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "เกิดข้อผิดพลาด");
    } finally {
      setBusy(false);
    }
  }

  async function useGooglePhoto() {
    setBusy(true);
    setError(null);
    const result = await resetAvatar();
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={pickFile}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Camera />
          อัพโหลดโปรไฟล์
        </Button>

        {hasCustomAvatar && hasGoogleAvatar ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={useGooglePhoto}
            disabled={busy}
          >
            <RotateCcw />
            ใช้รูปจาก Google
          </Button>
        ) : null}
      </div>

      {error && !imageSrc ? (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      ) : null}

      <Dialog
        open={imageSrc !== null}
        onOpenChange={(open) => {
          if (!open && !busy) setImageSrc(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ปรับรูปโปรไฟล์</DialogTitle>
            <DialogDescription>
              ลากเพื่อเลื่อน และใช้แถบด้านล่างเพื่อซูม
              รูปจะถูกย่อและบีบอัดให้อัตโนมัติ
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="ซูม"
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />
          </div>

          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setImageSrc(null)}
              disabled={busy}
            >
              ยกเลิก
            </Button>
            <Button type="button" onClick={save} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : null}
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
