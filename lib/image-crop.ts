import {
  AVATAR_QUALITY,
  AVATAR_SIZE,
  ACCEPTED_AVATAR_TYPES,
  MAX_AVATAR_INPUT_BYTES,
} from "@/lib/avatar";

/** Pixel rectangle react-easy-crop reports, in the source image's own scale. */
export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    // The source is always a same-origin blob: URL, but setting this keeps the
    // canvas untainted if that ever changes.
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("ไม่สามารถอ่านไฟล์รูปได้")),
    );
    image.src = src;
  });
}

/**
 * Crops to the selected square and re-encodes it small.
 *
 * Two things happen at once here, and both matter: the crop box is drawn onto
 * a fixed AVATAR_SIZE canvas, which downscales a 12 MP phone photo to 512px,
 * and the canvas is encoded as WebP, which typically lands a portrait under
 * 100 KB. A 5 MB original therefore reaches Storage as a small file.
 */
export async function cropToAvatarBlob(
  imageSrc: string,
  crop: CropArea,
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("เบราว์เซอร์ไม่รองรับการแก้ไขรูป");

  // Better resampling when shrinking a large photo into 512px.
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", AVATAR_QUALITY),
  );

  // Safari only gained canvas WebP encoding in 14; older engines hand back a
  // PNG instead of null, but guard the null case regardless.
  if (!blob) throw new Error("บันทึกรูปไม่สำเร็จ");
  return blob;
}

/** Client-side gate matching the accept attribute and the bucket's limits. */
export function validateAvatarFile(file: File): string | null {
  if (!ACCEPTED_AVATAR_TYPES.includes(file.type as never)) {
    return "รองรับเฉพาะไฟล์ JPG, PNG, WebP หรือ GIF";
  }
  if (file.size > MAX_AVATAR_INPUT_BYTES) {
    return `ไฟล์ใหญ่เกิน ${Math.round(MAX_AVATAR_INPUT_BYTES / 1024 / 1024)} MB`;
  }
  return null;
}
