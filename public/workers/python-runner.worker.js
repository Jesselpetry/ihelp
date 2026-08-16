// python-runner.worker.js
//
// Plain ES module Web Worker (no bundler step, no TypeScript, no imports from
// lib/*.ts) that hosts a Pyodide (Python-in-WASM) runtime and executes ONE
// piece of student code per "run" message, or lints code with pycodestyle per
// "lint" message.
//
// Loaded by the main thread as:
//   new Worker('/workers/python-runner.worker.js', { type: 'module' })
//
// Why pyodide.mjs (not pyodide.js) via static `import`: pyodide.js is the
// classic/UMD build that expects `importScripts` to exist, which is only
// true in *classic* (non-module) workers. This file is loaded with
// `{ type: 'module' }` (so we can use top-level `import`/ESM syntax at all),
// and `importScripts` is not reliably available inside module workers across
// browsers. pyodide.mjs is Pyodide's real ESM build and is the
// officially-supported way to load Pyodide from a module worker.
//
// ---------------------------------------------------------------------------
// TIMEOUT SAFETY (READ THIS FIRST)
// ---------------------------------------------------------------------------
// This worker does NOT and CANNOT enforce a time limit on the code it runs.
// A single-threaded WASM interpreter executing `while True: pass` cannot be
// interrupted from the inside — there is no cooperative yield point for us to
// hook, and Atomics.wait-based interrupts require SharedArrayBuffer + a
// second worker/thread setup that Pyodide's synchronous run path expects,
// which is out of scope here. If we tried to enforce a timer on this side
// (e.g. via setTimeout), the timer callback would never fire anyway, because
// the single JS event loop this worker runs on is itself blocked by the
// infinite Python loop.
//
// The ONLY reliable way to stop runaway student code is from OUTSIDE this
// worker: the main thread (lib/pyodide-client.ts) races the worker's response
// against its own setTimeout and calls `worker.terminate()` if the timeout
// wins. Terminating a worker is a hard OS-level kill of its thread, which
// works even if the worker's JS is fully wedged. That is why this file
// contains no timeout logic of its own — it would be dead code at best and
// misleading at worst.
// ---------------------------------------------------------------------------

import { loadPyodide } from "/pyodide/pyodide.mjs";

const PYODIDE_INDEX_URL = "/pyodide/";
const WHEELS_BASE_URL = "/pyodide/wheels/";

/** @type {Promise<any> | null} */
let pyodideReadyPromise = null;
/** @type {any} */
let pyodide = null;

// Pin exact wheel filenames so a version bump to public/pyodide/wheels/ is a
// deliberate, visible change here rather than a silent "whatever's newest".
// Keep in sync with scripts/copy-pyodide-assets.mjs.
const MICROPIP_WHEEL = `${WHEELS_BASE_URL}micropip-0.9.0-py3-none-any.whl`;
const PACKAGING_WHEEL = `${WHEELS_BASE_URL}packaging-24.2-py3-none-any.whl`;
const PYCODESTYLE_WHEEL = `${WHEELS_BASE_URL}pycodestyle-2.14.0-py2.py3-none-any.whl`;

async function initPyodide() {
  if (pyodideReadyPromise) return pyodideReadyPromise;

  pyodideReadyPromise = (async () => {
    pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });

    // Load micropip itself from a locally hosted wheel (its dependency
    // "packaging" too) rather than letting micropip's own bootstrap reach
    // out to a CDN, so the whole chain stays same-origin.
    await pyodide.loadPackage([PACKAGING_WHEEL, MICROPIP_WHEEL]);

    // pycodestyle is pure Python and is NOT part of Pyodide's package index
    // (it's not one of the packages pyodide-lock.json tracks), so it's
    // installed via micropip from our locally hosted wheel instead of
    // PyPI/CDN. Passing a local URL to micropip.install keeps this fully
    // offline-capable after first load.
    await pyodide.runPythonAsync(`
import micropip
await micropip.install("${PYCODESTYLE_WHEEL}")
    `);

    return pyodide;
  })();

  return pyodideReadyPromise;
}

/**
 * Runs one test case: sets up stdin/stdout capture, executes the student's
 * code, and returns captured output + any traceback.
 * @param {string} code
 * @param {string} stdin
 */
async function runOne(code, stdin) {
  const py = await initPyodide();

  // --- stdin: native setStdin with a line-feeding callback -----------------
  // Pyodide 0.27's setStdin({ stdin }) calls our function once per line the
  // Python side requests via input()/sys.stdin.readline(). We pre-split on
  // "\n" and hand back one line at a time; returning null signals EOF once
  // exhausted (matches InFuncType: () => string | null | undefined).
  const lines = stdin.length > 0 ? stdin.split("\n") : [];
  let lineIndex = 0;
  py.setStdin({
    stdin: () => {
      if (lineIndex < lines.length) {
        return lines[lineIndex++];
      }
      return null; // EOF
    },
  });

  // --- stdout: native setStdout, batched callback ---------------------------
  let stdoutBuf = "";
  py.setStdout({
    batched: (output) => {
      stdoutBuf += output + "\n";
    },
  });

  let error = null;
  try {
    await py.runPythonAsync(code);
  } catch (err) {
    // Pyodide surfaces Python exceptions (including SyntaxError raised while
    // compiling `code`) as JS errors whose message contains the formatted
    // Python traceback. Stringify defensively in case something throws a
    // non-Error value.
    error = err && err.message ? String(err.message) : String(err);
  } finally {
    // Reset stdio hooks so they don't leak into the next run on a reused
    // worker (see lib/pyodide-client.ts for the worker-reuse policy).
    py.setStdin({});
    py.setStdout({});
  }

  return { stdout: stdoutBuf, error };
}

/**
 * Runs pycodestyle over the given code and returns raw violations.
 * pycodestyle's Checker/StyleGuide writes its report as
 * "stdin:line:col: CODE message" lines to stdout by default, so we redirect
 * stdout during the check and parse that text back out, since pycodestyle's
 * public API is report-object-oriented rather than returning structured data
 * directly.
 * @param {string} code
 */
async function lint(code) {
  const py = await initPyodide();

  py.globals.set("__pscp_lint_source", code);

  const raw = await py.runPythonAsync(`
import io
import contextlib
import pycodestyle

_buf = io.StringIO()
with contextlib.redirect_stdout(_buf):
    _checker = pycodestyle.Checker(
        filename="submission.py",
        lines=__pscp_lint_source.splitlines(keepends=True),
        show_source=False,
    )
    _checker.check_all()
_buf.getvalue()
  `);

  return parsePycodestyleOutput(String(raw));
}

/**
 * Parses lines shaped like:
 *   submission.py:3:1: E302 expected 2 blank lines, got 1
 * into { line, col, code, message } objects.
 * @param {string} text
 */
function parsePycodestyleOutput(text) {
  /** @type {Array<{line: number, col: number, code: string, message: string}>} */
  const violations = [];
  const lineRe = /^.*?:(\d+):(\d+):\s+([A-Z]\d+)\s+(.*)$/;
  for (const rawLine of text.split("\n")) {
    if (!rawLine.trim()) continue;
    const m = lineRe.exec(rawLine);
    if (!m) continue;
    violations.push({
      line: Number(m[1]),
      col: Number(m[2]),
      code: m[3],
      message: m[4].trim(),
    });
  }
  return violations;
}

self.onmessage = async (event) => {
  const data = event.data || {};

  try {
    if (data.type === "lint") {
      const violations = await lint(data.code ?? "");
      self.postMessage({ status: "ok", type: "lint", violations });
      return;
    }

    if (data.type === "preload") {
      await initPyodide();
      self.postMessage({ status: "ok", type: "preload" });
      return;
    }

    // Default message shape: { code, stdin } => run one test case.
    const { code = "", stdin = "" } = data;
    const { stdout, error } = await runOne(code, stdin);
    self.postMessage({ status: "ok", type: "run", stdout, error });
  } catch (err) {
    // Worker-level failure (e.g. Pyodide itself failing to load, a network
    // error fetching the wasm binary, micropip install failure, etc.) — NOT
    // a student-code error. Distinguished from the per-run `error` field by
    // the top-level `status: 'error'`.
    const message = err && err.message ? String(err.message) : String(err);
    self.postMessage({ status: "error", message });
  }
};
