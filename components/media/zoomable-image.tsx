"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useLocale, t, type LText } from "@/lib/i18n";

/**
 * Zoom and pan for a single image, split three ways because the pieces sit in
 * different places: the controls live in a window's header, the gestures on a
 * stage that may also hold a PDF or a paging arrow, and the image inside it.
 * `useZoomPan` owns the one piece of state they share; the components below
 * only read it.
 *
 *     const zoom = useZoomPan(isImage, itemIndex);
 *     <ZoomControls zoom={zoom} />
 *     <ZoomStage zoom={zoom} className="relative …">
 *       {isImage && <ZoomableImage zoom={zoom} src={url} alt={name} />}
 *     </ZoomStage>
 */

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };
const MIN_SCALE = 1;
const MAX_SCALE = 6;

const clampScale = (scale: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

const L = {
  zoomIn: { th: "ขยาย", en: "Zoom in" },
  zoomOut: { th: "ย่อ", en: "Zoom out" },
  resetZoom: { th: "รีเซ็ตการซูม", en: "Reset zoom" },
  panHint: { th: "ลากเพื่อเลื่อน · เลื่อนล้อเพื่อซูม", en: "Drag to pan · scroll to zoom" },
} satisfies Record<string, LText>;

export interface ZoomPan {
  /** False when the stage is showing something that is not an image: it then ignores every gesture. */
  enabled: boolean;
  scale: number;
  x: number;
  y: number;
  dragging: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  cursor: "zoom-in" | "grab" | "grabbing" | undefined;
  zoomBy: (factor: number) => void;
  reset: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  endDrag: () => void;
}

/**
 * The wheel zooms, a drag pans once the image is larger than the stage, and a
 * double-click puts it back. The view also resets whenever `resetKey` changes —
 * pass the item's index, so paging never carries one scan's zoom to the next.
 */
export function useZoomPan(enabled: boolean, resetKey: string | number): ZoomPan {
  const stageRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>(IDENTITY);
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  // Reset while rendering, not in an effect: React re-renders at once, before
  // anything paints, where an effect would show the new item at the old zoom
  // for a frame.
  const [shownKey, setShownKey] = useState(resetKey);
  if (shownKey !== resetKey) {
    setShownKey(resetKey);
    setTransform(IDENTITY);
  }

  // A native listener, because React registers wheel handlers as passive and a
  // passive one cannot preventDefault — the page would scroll under the stage.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !enabled) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setTransform((current) => {
        const next = clampScale(current.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
        if (next === MIN_SCALE) return IDENTITY;
        return { ...current, scale: next };
      });
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [enabled]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || transform.scale === MIN_SCALE) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX - transform.x, y: event.clientY - transform.y };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current;
    if (!origin) return;
    setTransform((current) => ({
      ...current,
      x: event.clientX - origin.x,
      y: event.clientY - origin.y,
    }));
  };

  const endDrag = () => {
    dragOrigin.current = null;
    setDragging(false);
  };

  const zoomBy = (factor: number) =>
    setTransform((current) => {
      const next = clampScale(current.scale * factor);
      return next === MIN_SCALE ? IDENTITY : { ...current, scale: next };
    });

  return {
    enabled,
    scale: transform.scale,
    x: transform.x,
    y: transform.y,
    dragging,
    stageRef,
    cursor: enabled
      ? transform.scale > MIN_SCALE
        ? dragging
          ? "grabbing"
          : "grab"
        : "zoom-in"
      : undefined,
    zoomBy,
    reset: () => setTransform(IDENTITY),
    onPointerDown,
    onPointerMove,
    endDrag,
  };
}

/**
 * The element that takes the gestures. It must be positioned (the hint is
 * absolutely placed inside it) and it may hold anything: with zoom disabled it
 * is an ordinary div.
 */
export function ZoomStage({
  zoom,
  className,
  children,
}: {
  zoom: ZoomPan;
  className: string;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  // Taken apart up front: with the ref read straight off `zoom` in the JSX, the
  // react-hooks/refs rule treats every other field of `zoom` as a ref read too.
  const { stageRef, onPointerDown, onPointerMove, endDrag, reset, enabled, cursor } = zoom;
  return (
    <div
      ref={stageRef}
      className={className}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={() => enabled && reset()}
      style={{ cursor }}
    >
      {children}
      {enabled && (
        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] text-muted-foreground">
          {t(L.panHint, locale)}
        </p>
      )}
    </div>
  );
}

/** The picture itself, moved by a CSS transform so the file is shown at full resolution. */
export function ZoomableImage({ zoom, src, alt }: { zoom: ZoomPan; src: string; alt: string }) {
  return (
    <div className="flex size-full items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="max-h-full max-w-full select-none object-contain"
        style={{
          transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
          // Follow the finger exactly while dragging; ease only the zoom steps.
          transition: zoom.dragging ? "none" : "transform 120ms ease-out",
        }}
      />
    </div>
  );
}

/** − 100% + ↺ — the buttons for the same state. Renders nothing while zoom is disabled. */
export function ZoomControls({ zoom }: { zoom: ZoomPan }) {
  const { locale } = useLocale();
  if (!zoom.enabled) return null;
  return (
    <div className="hidden items-center gap-1 rounded-full border bg-card p-1 sm:flex">
      <button
        type="button"
        onClick={() => zoom.zoomBy(1 / 1.4)}
        aria-label={t(L.zoomOut, locale)}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-10 text-center text-[11px] font-medium tabular-nums text-muted-foreground">
        {Math.round(zoom.scale * 100)}%
      </span>
      <button
        type="button"
        onClick={() => zoom.zoomBy(1.4)}
        aria-label={t(L.zoomIn, locale)}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Plus className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={zoom.reset}
        aria-label={t(L.resetZoom, locale)}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <RotateCcw className="size-3.5" />
      </button>
    </div>
  );
}
