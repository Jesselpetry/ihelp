"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FileText, Loader2, MessageCircle, SendHorizontal, X } from "lucide-react";

import { useLocale, t, type LText } from "@/lib/i18n";
import type { ChatMessage, ChatResponse } from "@/app/api/chat/route";
import { FILES_HEADER } from "@/lib/chat/protocol";

type ChatFile = ChatResponse["files"][number];

/** A message as shown: assistant replies may carry "open file" buttons. */
type UiMessage = ChatMessage & { files?: ChatFile[] };

const L = {
  open: { th: "เปิดแชทผู้ช่วย", en: "Open help chat" },
  close: { th: "ปิดแชท", en: "Close chat" },
  title: { th: "ผู้ช่วย iHelp", en: "iHelp Assistant" },
  subtitle: { th: "ถามวิธีใช้เว็บ หรือให้ช่วยหาไฟล์เรียน", en: "Ask how to use the site or find files" },
  greeting: {
    th: "สวัสดีครับ 👋 อยากหาไฟล์วิชาไหน หรือมีอะไรให้ช่วยเรื่องการใช้งานเว็บ iHelp ถามได้เลยครับ",
    en: "Hi 👋 Looking for a course file, or need help using iHelp? Just ask.",
  },
  placeholder: { th: "พิมพ์คำถาม...", en: "Type a question..." },
  send: { th: "ส่ง", en: "Send" },
  error: {
    th: "ขอโทษครับ ตอนนี้ตอบคำถามทั่วไปไม่ได้ 🙏\n\nแต่ยังหาไฟล์ให้ได้นะครับ ลองพิมพ์ชื่อวิชา + week เช่น \"ITF week 10\" หรือ \"ICS week 12\"",
    en: "Sorry, I can't answer general questions right now 🙏\n\nI can still find files — try a course plus a week, e.g. \"ITF week 10\" or \"ICS week 12\".",
  },
  rateLimited: {
    th: "ถามถี่ไปนิดครับ รอสักครู่แล้วลองใหม่นะครับ ⏳",
    en: "Too many messages — please wait a moment ⏳",
  },
  openFile: { th: "เปิด", en: "Open" },
  offline: {
    th: "ผู้ช่วยตอบคำถามทั่วไปยังไม่พร้อมครับ 🙏\n\nแต่ยังหาไฟล์ให้ได้นะครับ ลองพิมพ์ เช่น \"ITF week 10\"",
    en: "General answers aren't available yet 🙏\n\nI can still find files — try e.g. \"ITF week 10\".",
  },
} satisfies Record<string, LText>;

// Paths on this site ("/courses/...") in a reply become links; everything else,
// external URLs included, stays plain text. Nothing from the model is parsed
// as HTML, and a model talked into posting a phishing link cannot make it
// clickable. "//host" is protocol-relative (off-site), so it never counts.
const LINK_RE = /((?<![\w/:])\/(?!\/)[A-Za-z0-9\-._~%/?=&#]+)/g;

// Models add Markdown despite the prompt. Reduce it to plain text: links keep
// their target, emphasis markers go, "* " bullets become "•". Links to this
// site are made relative so they navigate in-app.
function plain(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, url: string) =>
      label.trim() === url.trim() ? url : `${label} ${url}`,
    )
    .replace(/https?:\/\/ihelp\.chatan\.in\.th(?=\/)/g, "")
    .replace(/\*\*|__|`/g, "")
    .replace(/^(\s*)[*-]\s+/gm, "$1• ")
    .replace(/^#{1,6}\s+/gm, "");
}

function linkify(text: string): ReactNode[] {
  return plain(text).split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.replace(/[.,!?]+$/, "");
    const tail = part.slice(href.length);
    const className = "text-primary underline underline-offset-2 break-all";
    return (
      <span key={i}>
        <Link href={href} className={className}>
          {href}
        </Link>
        {tail}
      </span>
    );
  });
}

function parseFiles(header: string | null): ChatFile[] {
  try {
    const files: unknown = header ? JSON.parse(decodeURIComponent(header)) : [];
    return Array.isArray(files) ? files : [];
  } catch {
    return [];
  }
}

/**
 * The buttons a streamed reply earns: found files it names (full title, or the
 * part before " — ", e.g. "Lecture 10"), else all of them. Always from the
 * server's search, never from the model's text.
 */
function namedFiles(reply: string, files: ChatFile[]): ChatFile[] {
  const named = files.filter((f) => {
    const short = f.title.split(" — ")[0].trim();
    return reply.includes(f.title) || (short.length >= 4 && reply.includes(short));
  });
  return named.length ? named : files;
}

/** Floating help-desk chat, bottom-right on every page. */
export function ChatWidget() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [pscpTheme, setPscpTheme] = useState(false);

  // The widget lives in the root layout, outside the `.pscp-theme` wrapper the
  // PSCP pages (/pscp, /recommended, /make, …) put around themselves, so it
  // would stay blue there. Follow the page instead: wear the class whenever
  // the current page does. Checked after each navigation commits.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the newly committed page's DOM
    setPscpTheme(document.querySelector(".pscp-theme:not([data-chat-widget])") !== null);
  }, [pathname]);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, pending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const content = input.trim();
    if (!content || pending) return;

    const next: UiMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setPending(true);

    // Writes the reply into the assistant message at index `at`, creating it
    // on first call, so a streamed answer grows in place.
    const at = next.length;
    const put = (patch: Partial<UiMessage>) =>
      setMessages((m) => {
        const copy = [...m];
        copy[at] = { ...(copy[at] ?? { role: "assistant", content: "" }), ...patch };
        return copy;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (res.headers.get("Content-Type")?.startsWith("text/plain") && res.body) {
        // Model reply: stream it, then keep the buttons the text actually names.
        const files = parseFiles(res.headers.get(FILES_HEADER));
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          setPending(false);
          put({ content: reply });
        }
        put({ content: reply.trim() || t(L.error, locale), files: namedFiles(reply, files) });
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.ok && typeof data.reply === "string") {
          put({ content: data.reply, files: Array.isArray(data.files) ? data.files : [] });
        } else if (res.status === 429) put({ content: t(L.rateLimited, locale) });
        else if (res.status === 503) put({ content: t(L.offline, locale) });
        else put({ content: t(L.error, locale) });
      }
    } catch {
      put({ content: t(L.error, locale) });
    }
    setPending(false);
  }

  return (
    <div
      data-chat-widget
      className={
        "fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" +
        (pscpTheme ? " pscp-theme" : "")
      }
    >
      {open && (
        <div
          role="dialog"
          aria-label={t(L.title, locale)}
          className="flex h-[min(32rem,calc(100dvh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-xl shadow-black/10 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{t(L.title, locale)}</p>
              <p className="text-xs text-muted-foreground">{t(L.subtitle, locale)}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t(L.close, locale)}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {[{ role: "assistant", content: t(L.greeting, locale) } as UiMessage, ...messages].map(
              (m, i) => (
                <div key={i} className={m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start gap-1.5"}>
                  <div
                    className={
                      "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 leading-relaxed " +
                      (m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted")
                    }
                  >
                    {m.role === "assistant" ? linkify(m.content) : m.content}
                  </div>
                  {m.files?.map((file) => (
                    <Link
                      key={file.href}
                      href={file.href}
                      className="flex max-w-[85%] items-center gap-2 rounded-xl border bg-card px-3 py-2 text-left text-xs transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{file.title}</span>
                        <span className="text-muted-foreground">{file.course}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground">
                        {t(L.openFile, locale)}
                      </span>
                    </Link>
                  ))}
                </div>
              ),
            )}
            {pending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2 border-t p-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends; Shift+Enter (and IME composition for Thai) adds a line.
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder={t(L.placeholder, locale)}
              className="max-h-28 min-h-9 flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label={t(L.send, locale)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <SendHorizontal className="size-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t(open ? L.close : L.open, locale)}
        aria-expanded={open}
        className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95 motion-reduce:hover:scale-100"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
