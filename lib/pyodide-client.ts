"use client";

// Main-thread wrapper around public/workers/python-runner.worker.js.
//
// IMPORTANT — lazy loading contract:
// Nothing in this file triggers a Pyodide load as a side effect of import or
// module evaluation. Pyodide's runtime is a ~16MB one-time download (WASM
// binary + stdlib zip + package wheels), so it must only start downloading
// when a user explicitly takes an action that needs it (e.g. clicking "Run"
// or "Lint"). Do NOT call preloadPyodide() / runTestCase() / lintCode() from
// a component's render body, a useEffect on mount, or any module-level code.
// The UI layer is responsible for wiring these to an explicit user gesture.

const WORKER_URL = "/workers/python-runner.worker.js";

export interface RunOptions {
  /** Wall-clock budget for a single test case run. Defaults to 5000ms. */
  timeoutMs?: number;
}

export interface RunResult {
  stdout: string;
  error: string | null;
  durationMs: number;
  timedOut: boolean;
}

export interface RawLintViolation {
  line: number;
  col: number;
  code: string;
  message: string;
}

type PreloadStatus = "loading" | "ready" | "error";

// ---------------------------------------------------------------------------
// Worker lifecycle
// ---------------------------------------------------------------------------
//
// Design: reuse a single worker across calls instead of spawning one per run.
// Rationale: each fresh worker has to re-run loadPyodide() (parse+instantiate
// a ~10MB wasm module, unpack the stdlib zip, install micropip + pycodestyle
// via micropip) from scratch, which takes several seconds even when every
// asset is a same-origin cache hit. Reusing the same worker means that cost
// is paid once per page session instead of once per "Run" click, which is
// the difference between a grader that feels instant on the 2nd+ test case
// and one that re-pays a multi-second tax every time.
//
// The tradeoff (documented per the task spec, this is the trickiest part of
// this module): a worker that has been `.terminate()`-d — which is exactly
// what happens when a run times out — is permanently dead. You cannot
// `postMessage` to a terminated worker and get a response; the browser just
// silently drops it. So every timeout path below nulls out the shared worker
// reference, forcing the *next* call (whether it's another runTestCase, a
// lintCode, or a preloadPyodide) to spawn a brand-new worker and pay the full
// Pyodide cold-start cost again. This is the correct tradeoff: correctness
// (never hand back a dead worker) beats performance (avoiding one reload)
// here, because reusing a terminated worker doesn't degrade gracefully — it
// hangs forever with no response, which is strictly worse than a slow but
// working reload.
let sharedWorker: Worker | null = null;
let sharedWorkerReady: Promise<void> | null = null;

function spawnWorker(): Worker {
  return new Worker(WORKER_URL, { type: "module" });
}

/** Returns the shared worker, spawning one if none exists (or the previous one died/timed out). */
function getWorker(): Worker {
  if (!sharedWorker) {
    sharedWorker = spawnWorker();
  }
  return sharedWorker;
}

/** Drops the shared worker reference after termination so the next call respawns. */
function discardWorker() {
  sharedWorker = null;
  sharedWorkerReady = null;
}

// ---------------------------------------------------------------------------
// preloadPyodide
// ---------------------------------------------------------------------------

/**
 * Explicitly triggers the (lazy) Pyodide load inside the worker and reports
 * progress via the optional callback. Call this ONLY in response to an
 * explicit user action (e.g. the first "Run" click) — never automatically on
 * mount, since it kicks off a large one-time download.
 *
 * Safe to call multiple times; concurrent/subsequent calls resolve once the
 * in-flight load completes rather than starting a second load.
 */
export function preloadPyodide(
  onProgress?: (status: PreloadStatus) => void,
): Promise<void> {
  if (sharedWorkerReady) return sharedWorkerReady;

  onProgress?.("loading");

  sharedWorkerReady = new Promise<void>((resolve, reject) => {
    const worker = getWorker();

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as { status?: string; type?: string; message?: string };
      if (data.type !== "preload") return;
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      if (data.status === "ok") {
        onProgress?.("ready");
        resolve();
      } else {
        onProgress?.("error");
        discardWorker();
        reject(new Error(data.message ?? "Pyodide failed to load"));
      }
    };

    const handleError = (event: ErrorEvent) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      onProgress?.("error");
      discardWorker();
      reject(new Error(event.message || "Worker failed to load"));
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);
    worker.postMessage({ type: "preload" });
  });

  return sharedWorkerReady;
}

// ---------------------------------------------------------------------------
// runTestCase
// ---------------------------------------------------------------------------

interface WorkerRunResponse {
  status: "ok" | "error";
  type?: "run";
  stdout?: string;
  error?: string | null;
  message?: string;
}

/**
 * Runs one test case's worth of student code against one stdin string.
 *
 * Races the worker's response against `options.timeoutMs` (default 5000ms).
 * If the timer wins, the worker is forcibly terminated (the only reliable way
 * to stop runaway code — see the worker file's top-of-file comment) and the
 * shared worker slot is cleared so the next call spawns a fresh one.
 */
export async function runTestCase(
  code: string,
  stdin: string,
  options?: RunOptions,
): Promise<RunResult> {
  const timeoutMs = options?.timeoutMs ?? 5000;
  const worker = getWorker();
  const startedAt = performance.now();

  return new Promise<RunResult>((resolve) => {
    let settled = false;

    const cleanup = () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      // Terminate is the only reliable way to interrupt code that never
      // yields control (e.g. `while True: pass`). The worker is now dead;
      // drop the shared reference so subsequent calls spawn a new one.
      worker.terminate();
      discardWorker();
      resolve({
        stdout: "",
        error: null,
        durationMs: performance.now() - startedAt,
        timedOut: true,
      });
    }, timeoutMs);

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as WorkerRunResponse;
      // Ignore messages that aren't a response to a run (e.g. a stray
      // "preload" or "lint" response landing on a shared worker).
      if (data.type && data.type !== "run") return;
      if (settled) return;
      settled = true;
      cleanup();

      if (data.status === "error") {
        // Worker-level failure (Pyodide itself failed to load, etc.) rather
        // than a student-code error. Surface it via the `error` field so
        // callers have a single place to look, and drop the worker since its
        // Pyodide instance may be in an unknown state.
        discardWorker();
        resolve({
          stdout: "",
          error: data.message ?? "Worker failed",
          durationMs: performance.now() - startedAt,
          timedOut: false,
        });
        return;
      }

      resolve({
        stdout: data.stdout ?? "",
        error: data.error ?? null,
        durationMs: performance.now() - startedAt,
        timedOut: false,
      });
    };

    const handleError = (event: ErrorEvent) => {
      if (settled) return;
      settled = true;
      cleanup();
      discardWorker();
      resolve({
        stdout: "",
        error: event.message || "Worker crashed",
        durationMs: performance.now() - startedAt,
        timedOut: false,
      });
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);
    worker.postMessage({ code, stdin });
  });
}

// ---------------------------------------------------------------------------
// lintCode
// ---------------------------------------------------------------------------

interface WorkerLintResponse {
  status: "ok" | "error";
  type?: "lint";
  violations?: RawLintViolation[];
  message?: string;
}

/**
 * Runs pycodestyle over `code` inside the worker and returns raw violations
 * (line/col/code/message — not yet the bilingual Pep8Violation shape; see
 * lib/pep8-rules.ts's translatePep8Violations for that translation layer).
 *
 * No timeout: pycodestyle performs static analysis only, it does not execute
 * the submitted code, so it cannot infinite-loop.
 */
export async function lintCode(code: string): Promise<RawLintViolation[]> {
  const worker = getWorker();

  return new Promise<RawLintViolation[]>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as WorkerLintResponse;
      if (data.type && data.type !== "lint") return;
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);

      if (data.status === "error") {
        discardWorker();
        reject(new Error(data.message ?? "Lint failed"));
        return;
      }
      resolve(data.violations ?? []);
    };

    const handleError = (event: ErrorEvent) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      discardWorker();
      reject(new Error(event.message || "Worker crashed"));
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);
    worker.postMessage({ type: "lint", code });
  });
}
