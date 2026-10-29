import { NextResponse } from "next/server";

import { currentStudentId } from "@/lib/auth/guards";
import { faqReply } from "@/lib/chat/faq";
import { fileContext, type ChatFile } from "@/lib/chat/file-search";
import { blockedReply } from "@/lib/chat/guard";
import { FILES_HEADER } from "@/lib/chat/protocol";
import { chatSystemPrompt } from "@/lib/chat/system-prompt";

export const dynamic = "force-dynamic";

export type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * A finished reply, sent as JSON when the course catalog answers on its own.
 * Model replies are streamed as plain text instead, with the buttons in the
 * FILES_HEADER header (URI-encoded JSON).
 */
export type ChatResponse = { reply: string; files: ChatFile[] };

// The endpoint is public and every call costs money, so the request is kept
// small: a short history, short messages, short replies, and a per-IP limit.
const MAX_HISTORY = 10;
const MAX_CHARS = 1000;
const MAX_REPLY_TOKENS = 350;
const RATE_LIMIT = 15; // requests per IP per window
const RATE_WINDOW_MS = 60_000;
const MAX_BUTTONS = 4;
const MAX_BODY_BYTES = 32_000;

// Per-instance only (serverless instances do not share it), which is enough
// to stop one tab hammering the endpoint.
const hits = new Map<string, number[]>();

/**
 * The caller's address, as the hosting platform reports it.
 *
 * `x-forwarded-for` is a client-settable header that each proxy *appends* to,
 * so the first entry is whatever the caller claimed. Reading it let anyone
 * reset their own rate-limit bucket by rotating a fake value.
 *
 * Headers the edge sets itself are used first: Vercel's
 * `x-vercel-forwarded-for` (this app's deployment target) and Cloudflare's
 * `cf-connecting-ip`. Otherwise the last XFF hop, which is written by the
 * nearest proxy — accurate behind one trusted proxy, and no worse than the
 * first entry anywhere else.
 */
function clientIp(request: Request): string {
  const trusted =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip");
  if (trusted?.trim()) return trusted.trim().split(",")[0].trim();
  const hops = (request.headers.get("x-forwarded-for") ?? "").split(",").filter((h) => h.trim());
  return hops.at(-1)?.trim() || "local";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

/** True unless the browser says the request came from another site. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** The request body as text, or null once it exceeds MAX_BODY_BYTES. */
async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-MAX_HISTORY).map((m) => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: typeof m?.content === "string" ? m.content.slice(0, MAX_CHARS) : "",
  })) satisfies ChatMessage[];
  return messages.at(-1)?.role === "user" && messages.at(-1)?.content.trim()
    ? messages
    : null;
}

/**
 * Re-emits an OpenAI-style SSE stream (`data: {choices:[{delta:{content}}]}`)
 * as bare text. Lines can split across chunks, so a partial one is carried
 * over. Reasoning deltas are dropped.
 */
function textStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:") || data === "data: [DONE]") continue;
          try {
            const delta = JSON.parse(data.slice(5)).choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // keep-alive comments and malformed lines carry no text
          }
        }
      },
    }),
  );
}

/**
 * Help-desk chat for the floating widget.
 *
 * Questions the course catalog can answer outright (a named course plus a
 * week, chapter or kind of file) get an instant, fixed-format reply with "open
 * file" buttons and never reach the model. Everything else streams from any
 * OpenAI-compatible `/chat/completions` endpoint (AI_BASE_URL / AI_MODEL /
 * AI_API_KEY), so the first words appear as soon as the model writes them.
 */
export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // Another site can point a visitor's browser at this endpoint and spend the
  // AI budget from their address. Same-origin POSTs always carry Origin, and
  // it must match the Host the browser asked for — `request.url` is the
  // internal address on a hosted platform, so it cannot be compared against.
  // Requests with no Origin (curl, tests, native apps) are left alone.
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Ten 1000-character messages fit well under this; anything bigger is not
  // the widget talking. Counted while reading, because a chunked request
  // sends no content-length to check.
  const raw = await readBody(request);
  if (raw === null) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  const body = ((): unknown => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();
  const messages = parseMessages(body);
  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const locale = (body as { locale?: unknown }).locale === "en" ? "en" : "th";

  // Attack, tampering and prompt-injection requests get a fixed refusal and
  // never reach the model. Every turn is checked, not just the last: the
  // client replays the history, so an injection planted earlier would
  // otherwise ride along behind an innocent question (see lib/chat/guard.ts).
  const blocked = blockedReply(messages);
  if (blocked) {
    const reply: ChatResponse = { reply: blocked[locale], files: [] };
    return NextResponse.json(reply);
  }

  // Files are searched for the latest question only, under the library's own
  // sign-in rule. Past exams are left out for everyone (see FileAccess).
  const question = messages.at(-1)!.content;
  const found = fileContext(
    question,
    {
      signedIn: Boolean(await currentStudentId()),
      production: process.env.NODE_ENV === "production",
    },
    locale,
  );

  // Instant answers, most specific first: a confident file match or a week
  // count, then a pre-written FAQ answer, then the catalog's softer replies
  // (a sign-in notice, a course overview). Only what none of them covers
  // reaches the model.
  if (found?.quick && (found.kind === "match" || found.kind === "weeks")) {
    const reply: ChatResponse = { reply: found.quick[locale], files: found.files };
    return NextResponse.json(reply);
  }
  const faq = faqReply(question, locale);
  if (faq) {
    const reply: ChatResponse = faq;
    return NextResponse.json(reply);
  }
  if (found?.quick) {
    const reply: ChatResponse = { reply: found.quick[locale], files: found.files };
    return NextResponse.json(reply);
  }

  const { AI_API_KEY, AI_BASE_URL, AI_MODEL } = process.env;
  if (!AI_API_KEY || !AI_BASE_URL || !AI_MODEL) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const system = found ? `${chatSystemPrompt()}\n\n${found.text}` : chatSystemPrompt();

  try {
    const res = await fetch(`${AI_BASE_URL.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: MAX_REPLY_TOKENS,
        temperature: 0.3,
        stream: true,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok || !res.body) {
      console.error("[chat] provider error", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ error: "provider_error" }, { status: 502 });
    }

    const files = (found?.files ?? []).slice(0, MAX_BUTTONS);
    return new Response(textStream(res.body), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        [FILES_HEADER]: encodeURIComponent(JSON.stringify(files)),
      },
    });
  } catch (err) {
    console.error("[chat] request failed", err);
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
