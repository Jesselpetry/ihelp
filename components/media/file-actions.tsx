"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, Download, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assetDownloadUrl } from "@/lib/library/asset-url";
import { useLocale, t, type Locale, type LText } from "@/lib/i18n";

/**
 * The slice of a file record the action buttons read. SubjectAsset satisfies
 * it structurally, but nothing here depends on the library — any list of files
 * with a title, a URL and a name can offer the same buttons.
 */
export interface FileLike {
  title: LText;
  url: string;
  fileName: string;
  /** "md" marks an in-app page: it has a reader, not a preview, and nothing to download. */
  fileType?: string;
  /** Where the file was first posted. The ต้นทาง link renders only when this is set. */
  sourceUrl?: string;
}

const L = {
  preview: { th: "ดูตัวอย่าง", en: "Preview" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  viewContent: { th: "ดูเนื้อหา", en: "View Content" },
  openInTab: { th: "เปิดในแท็บใหม่", en: "Open in new tab" },
  copyLink: { th: "คัดลอกลิงก์", en: "Copy link" },
  linkCopied: { th: "คัดลอกแล้ว!", en: "Link copied!" },
  source: { th: "ต้นทาง", en: "Source" },
  sourceHint: { th: "เปิดไฟล์ต้นทางใน OnLearn", en: "Open the original on OnLearn" },
} satisfies Record<string, LText>;

/**
 * The surfaces that offer file actions. Each one pins its own classes, so the
 * markup is exactly what that surface rendered before the buttons were shared:
 * add a variant rather than bending an existing one.
 *
 * - `card`          footer of a gallery card — labelled Preview, bordered icons
 * - `compact`       trailing buttons of a compact list row (the title opens the preview)
 * - `week`          actions cell of the week-by-week table
 * - `table`         actions cell of the library table
 * - `subrow`        a page row under an expanded stack in the library table
 * - `edition`       an edition card inside an opened stack
 * - `session-table` actions cell of a session's document table (≥ sm)
 * - `session-card`  touch buttons of a session's document cards (< sm)
 * - `header`        the preview modal's header
 */
export type FileActionsVariant =
  | "card"
  | "compact"
  | "week"
  | "table"
  | "subrow"
  | "edition"
  | "session-table"
  | "session-card"
  | "header";

type ControlId = "preview" | "download" | "source" | "copy" | "open";

/** Every surface but the modal header reads left to right in this order. */
const STANDARD_ORDER: readonly ControlId[] = ["preview", "download", "source", "copy", "open"];

/** How one control looks on one surface. */
interface Look {
  /** Classes on the button or link itself. */
  className: string;
  /** Classes on the icon inside it. */
  glyph: string;
  /** Text beside the icon: bare, or in a <span> carrying this class ("" for none). Absent = icon only. */
  text?: true | { span: string };
  /**
   * Which of aria-label and title the control carries. Icon-only controls need
   * an aria-label; ones with visible text are named by it, and a title would
   * only repeat it.
   */
  hints?: "aria" | "title" | "both" | "none";
  /** Draw it through the shared Button, which brings the focus ring and data attributes. */
  button?: { variant: "outline" | "ghost"; size: "sm" };
  /** Preview only: add the file's title to the aria-label, so a row of identical icons stays distinguishable. */
  named?: boolean;
}

interface Skin {
  /** Class of the element the controls sit in. null = bare siblings in a row that already spaces them. */
  wrap: string | null;
  /**
   * What an in-app page (`fileType: "md"`) gets here. "alone": one wide link
   * and nothing else. "link": the reader link stands where Preview would, and
   * the download goes. Absent: it is treated like any other file.
   */
  inApp?: "alone" | "link";
  order?: readonly ControlId[];
  preview?: Look;
  /** Link to an in-app page's reader. */
  view?: Look;
  download?: Look;
  source?: { className: string; withLabel?: boolean };
  copy?: Look;
  /** Open the file itself in a new tab. */
  open?: Look;
}

// Class tails shared by several surfaces, kept whole so each token stays
// greppable and visible to Tailwind's scanner.
const GHOST = "text-muted-foreground transition-colors hover:bg-muted hover:text-primary";
const OUTLINE = "text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary";

const ROUND = `rounded-full p-1.5 ${GHOST}`;
const COMPACT_ICON: Look = { className: `shrink-0 ${ROUND}`, glyph: "size-3.5" };
// Table cells need the explicit inline-flex that bare flex children do not.
const WEEK_ICON: Look = { className: `inline-flex ${ROUND}`, glyph: "size-3.5" };
const TABLE_ICON: Look = { className: ROUND, glyph: "size-3.5" };
const SUBROW_ICON: Look = { className: `rounded-full p-1 ${GHOST}`, glyph: "size-3" };
const EDITION_ICON: Look = {
  className:
    "rounded-full border bg-muted/40 p-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors",
  glyph: "size-3.5",
};
const SESSION_ICON: Look = { ...TABLE_ICON, hints: "both" };

/**
 * The icon button the week table's other rows (a stack's preview, a lecture
 * video link) share with its file rows, so they sit in the cell identically.
 */
export const WEEK_ICON_BUTTON = WEEK_ICON.className;

const SKINS: Record<FileActionsVariant, Skin> = {
  card: {
    wrap: "mt-1.5 flex gap-1.5",
    inApp: "alone",
    view: {
      className: `mt-1.5 inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium ${OUTLINE}`,
      glyph: "size-3",
      text: true,
      hints: "none",
    },
    preview: {
      className: `inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-[11px] font-medium ${OUTLINE}`,
      glyph: "size-3",
      text: true,
      hints: "none",
    },
    download: {
      className: `inline-flex items-center justify-center rounded-full border px-2.5 py-1.5 ${OUTLINE}`,
      glyph: "size-3",
    },
    source: { className: "border px-2.5 py-1.5 hover:border-primary/40 hover:bg-transparent [&_svg]:size-3" },
  },
  compact: {
    wrap: null,
    inApp: "link",
    view: COMPACT_ICON,
    download: COMPACT_ICON,
    source: { className: "shrink-0" },
  },
  week: {
    wrap: "flex items-center justify-end gap-0.5",
    inApp: "link",
    view: WEEK_ICON,
    preview: WEEK_ICON,
    download: WEEK_ICON,
    source: { className: "" },
  },
  table: {
    wrap: "flex items-center justify-end gap-1",
    inApp: "link",
    view: TABLE_ICON,
    preview: TABLE_ICON,
    download: TABLE_ICON,
    source: { className: "" },
    copy: { ...TABLE_ICON, hints: "both" },
  },
  subrow: {
    wrap: "flex items-center justify-end gap-1",
    preview: SUBROW_ICON,
    download: SUBROW_ICON,
    copy: SUBROW_ICON,
  },
  edition: {
    wrap: "flex items-center gap-1 shrink-0",
    preview: { ...EDITION_ICON, named: true },
    download: EDITION_ICON,
  },
  "session-table": {
    wrap: "flex items-center justify-end gap-1",
    preview: { ...SESSION_ICON, className: `${ROUND} cursor-pointer` },
    download: SESSION_ICON,
    open: SESSION_ICON,
  },
  "session-card": {
    wrap: "flex items-center gap-1.5 pt-2 border-t border-border/40",
    preview: {
      className: "h-8 px-2.5 text-xs gap-1.5 rounded-xl flex-1 shadow-2xs cursor-pointer",
      glyph: "size-3.5 text-primary",
      text: { span: "" },
      hints: "none",
      button: { variant: "outline", size: "sm" },
    },
    download: {
      className: "h-8 px-2.5 text-xs gap-1.5 rounded-xl flex-1 shadow-2xs",
      glyph: "size-3.5 text-muted-foreground",
      text: { span: "" },
      hints: "none",
      button: { variant: "outline", size: "sm" },
    },
    open: {
      className: "h-8 w-8 p-0 rounded-xl text-muted-foreground shrink-0",
      glyph: "size-3.5",
      hints: "title",
      button: { variant: "ghost", size: "sm" },
    },
  },
  header: {
    wrap: null,
    // The source link leads here: it is the quieter of the two, and the
    // primary Download pill belongs next to the window controls.
    order: ["source", "download"],
    // The footer already carries the reader link, so an in-app page only
    // loses its Download here.
    inApp: "link",
    source: { className: "border px-3 py-1.5", withLabel: true },
    download: {
      className:
        "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90",
      glyph: "size-3.5",
      text: { span: "hidden sm:inline" },
    },
  },
};

/** aria-label and title as the look asks for them; both say the same unless a title is given. */
function hintAttrs(look: Look, label: string, title: string = label) {
  const mode = look.hints ?? "aria";
  return {
    "aria-label": mode === "aria" || mode === "both" ? label : undefined,
    title: mode === "title" || mode === "both" ? title : undefined,
  };
}

/**
 * The class belongs on the Button when the look has one. A child anchor that
 * also carried a `className` key — even undefined — makes Slot place the
 * merged class among the anchor's own attributes instead of after the data-*
 * ones, which changes the markup.
 */
const ownClass = (look: Look) => (look.button ? {} : { className: look.className });

/** The icon, plus the label when the look shows one. */
function face(look: Look, icon: ReactNode, label: string): ReactNode {
  if (!look.text) return icon;
  return (
    <>
      {icon}
      {look.text === true ? label : <span className={look.text.span || undefined}>{label}</span>}
    </>
  );
}

type ControlProps = { look: Look; locale: Locale };

function PreviewButton({
  look,
  locale,
  file,
  onClick,
}: ControlProps & { file?: FileLike; onClick: () => void }) {
  const label = t(L.preview, locale);
  if (look.button) {
    return (
      <Button
        type="button"
        variant={look.button.variant}
        size={look.button.size}
        onClick={onClick}
        className={look.className}
      >
        {face(look, <Eye className={look.glyph} />, label)}
      </Button>
    );
  }
  const named = look.named && file ? `${label}: ${t(file.title, locale)}` : label;
  return (
    <button type="button" onClick={onClick} {...hintAttrs(look, named, label)} className={look.className}>
      {face(look, <Eye className={look.glyph} />, label)}
    </button>
  );
}

function ViewLink({ look, locale, file }: ControlProps & { file: FileLike }) {
  const label = t(L.viewContent, locale);
  return (
    <Link href={file.url} {...hintAttrs(look, label)} className={look.className}>
      {face(look, <Eye className={look.glyph} />, label)}
    </Link>
  );
}

function DownloadLink({ look, locale, file }: ControlProps & { file: FileLike }) {
  const label = t(L.download, locale);
  const anchor = (
    <a
      href={assetDownloadUrl(file.url, file.fileName)}
      download={file.fileName}
      {...hintAttrs(look, `${label}: ${file.fileName}`, label)}
      {...ownClass(look)}
    >
      {face(look, <Download className={look.glyph} />, label)}
    </a>
  );
  if (!look.button) return anchor;
  return (
    <Button asChild variant={look.button.variant} size={look.button.size} className={look.className}>
      {anchor}
    </Button>
  );
}

function OpenLink({ look, locale, file }: ControlProps & { file: FileLike }) {
  const anchor = (
    <a
      href={file.url}
      target="_blank"
      rel="noreferrer"
      {...hintAttrs(look, t(L.openInTab, locale))}
      {...ownClass(look)}
    >
      <ExternalLink className={look.glyph} />
    </a>
  );
  if (!look.button) return anchor;
  return (
    <Button asChild variant={look.button.variant} size={look.button.size} className={look.className}>
      {anchor}
    </Button>
  );
}

function CopyButton({
  look,
  locale,
  copied,
  onCopy,
}: ControlProps & { copied: boolean; onCopy: () => void }) {
  const label = t(L.copyLink, locale);
  return (
    <button
      type="button"
      onClick={onCopy}
      {...hintAttrs(look, label, copied ? t(L.linkCopied, locale) : label)}
      className={look.className}
    >
      {copied ? (
        <Check className={`${look.glyph} text-emerald-600`} />
      ) : (
        <Copy className={look.glyph} />
      )}
    </button>
  );
}

/**
 * ต้นทาง — the file's original page on the course site. Rendered only for files
 * that carry a `sourceUrl`, so older-year material simply has no link rather
 * than a dead one.
 */
function SourceLink({
  file,
  withLabel = false,
  className = "",
}: {
  file: FileLike;
  withLabel?: boolean;
  className?: string;
}) {
  const { locale } = useLocale();
  if (!file.sourceUrl) return null;
  return (
    <a
      href={file.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={t(L.sourceHint, locale)}
      aria-label={`${t(L.sourceHint, locale)}: ${t(file.title, locale)}`}
      className={`inline-flex items-center gap-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary ${className}`}
    >
      <ExternalLink className="size-3.5" />
      {withLabel && <span className="text-xs font-medium">{t(L.source, locale)}</span>}
    </a>
  );
}

export interface FileActionsProps {
  /**
   * The file the buttons act on. Leave it out for something that is not one
   * file — a stack of scans — and only Preview and Copy can show.
   */
  file?: FileLike;
  variant: FileActionsVariant;
  /**
   * Opens the in-app preview. Surfaces whose file name already opens it
   * (compact rows) leave this out and get no Preview button.
   */
  onPreview?: () => void;
  /** The copy-link button: `copied` swaps its icon and tooltip, `onCopy` does the copying. */
  copy?: { copied: boolean; onCopy: () => void };
}

/**
 * Preview · Download · Source (· Copy link · Open in new tab) for one file —
 * the cluster every list of library files ends in. Which buttons appear, and
 * how they look, is fixed per `variant`; what they act on comes from `file`.
 */
export function FileActions({ file, variant, onPreview, copy }: FileActionsProps) {
  const { locale } = useLocale();
  const skin = SKINS[variant];
  // The file again, but only when it is an in-app page on a surface that sets
  // those apart; everything else goes down the ordinary path.
  const page = file?.fileType === "md" && skin.inApp ? file : undefined;

  if (page && skin.inApp === "alone" && skin.view) {
    return <ViewLink look={skin.view} locale={locale} file={page} />;
  }

  let preview: ReactNode = null;
  if (page) {
    if (skin.view) preview = <ViewLink look={skin.view} locale={locale} file={page} />;
  } else if (onPreview && skin.preview) {
    preview = <PreviewButton look={skin.preview} locale={locale} file={file} onClick={onPreview} />;
  }

  const controls: Record<ControlId, ReactNode> = {
    preview,
    download:
      file && skin.download && !page ? (
        <DownloadLink look={skin.download} locale={locale} file={file} />
      ) : null,
    source: file && skin.source ? <SourceLink file={file} {...skin.source} /> : null,
    copy:
      copy && skin.copy ? (
        <CopyButton look={skin.copy} locale={locale} copied={copy.copied} onCopy={copy.onCopy} />
      ) : null,
    open: file && skin.open ? <OpenLink look={skin.open} locale={locale} file={file} /> : null,
  };

  const body = (skin.order ?? STANDARD_ORDER).map((id) => (
    <Fragment key={id}>{controls[id]}</Fragment>
  ));
  return skin.wrap === null ? <>{body}</> : <div className={skin.wrap}>{body}</div>;
}
