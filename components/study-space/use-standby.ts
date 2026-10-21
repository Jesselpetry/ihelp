"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * What lets focus mode sit open as a standby screen.
 *
 *   full screen — browser full screen of the whole document, not one element:
 *                 dialogs render in a portal on <body>, and an element-level
 *                 full screen would hide them. Optional — focus mode already
 *                 fills the window without it.
 *   wake lock   — keeps the display on while `keepAwake` holds and the tab is
 *                 visible; the browser drops the lock when the tab hides, so
 *                 it is re-requested on return.
 *   idle        — true after IDLE_MS without pointer, key, wheel or touch
 *                 input while `autoHide` holds. Focus mode fades its controls
 *                 and the cursor on it; any input brings them back.
 */

const IDLE_MS = 5000;
const ACTIVITY = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;

export function useStandby({ keepAwake, autoHide }: { keepAwake: boolean; autoHide: boolean }) {
  const [canFullscreen] = useState(() => typeof document !== "undefined" && document.fullscreenEnabled);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    if (!autoHide) return;
    let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    };
    ACTIVITY.forEach((type) => window.addEventListener(type, wake, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      ACTIVITY.forEach((type) => window.removeEventListener(type, wake));
      setIdle(false);
    };
  }, [autoHide]);

  useEffect(() => {
    if (!keepAwake || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let disposed = false;

    const acquire = async () => {
      if (document.visibilityState !== "visible" || (lock && !lock.released)) return;
      try {
        const next = await navigator.wakeLock.request("screen");
        if (disposed) void next.release();
        else lock = next;
      } catch {
        // Denied (battery saver, unsupported iframe) — the page still works.
      }
    };
    const onVisibility = () => void acquire();

    void acquire();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      void lock?.release().catch(() => {});
    };
  }, [keepAwake]);

  return { canFullscreen, isFullscreen, toggleFullscreen, exitFullscreen, idle: autoHide && idle };
}

const CONTROL = "button, a, [role=button], [role=checkbox], [role=tab], [role=radio]";

/**
 * Single-key shortcuts, matched on the physical key (`KeyF`, not "f") so they
 * work with a Thai keyboard layout too. Ignored while typing, inside a dialog
 * or menu (focus mode's own overlay excepted), and with a modifier held.
 *
 * Space belongs to a control the keyboard moved focus to (Tab, then Space
 * presses it). A control that only has focus because it was just clicked —
 * a done circle, a row — does not keep Space from starting the timer.
 */
export function useShortcuts(handlers: Partial<Record<"Space" | "KeyF", () => void>>) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    let clicked: Element | null = null;
    const onPointer = (e: PointerEvent) => {
      clicked = e.target instanceof Element ? e.target.closest(CONTROL) : null;
    };
    const onKey = (e: KeyboardEvent) => {
      // Moving focus by keyboard hands Space back to whatever gets focus.
      if (e.key === "Tab") clicked = null;
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("input, textarea, select, [contenteditable=true], [role=menu]")) return;
      if (target?.closest("[role=dialog]:not([data-focus-mode])")) return;
      if (e.code === "Space") {
        const control = target?.closest(CONTROL);
        if (control && control !== clicked) return;
      }

      const handler = ref.current[e.code as "Space" | "KeyF"];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}
