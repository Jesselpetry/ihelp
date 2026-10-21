import { ExternalLink, FileLock2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CARD =
  "flex h-full flex-col gap-2 rounded-lg border bg-card p-4 transition-colors";

export interface FileLinkCardProps {
  /**
   * Where the card goes. For a `restricted` card a missing link is a state, not
   * a mistake: the signed URL could not be made, so the card stays on the page
   * but goes inert.
   */
  href: string | null | undefined;
  /**
   * `restricted` — a file in the private bucket behind a signed link (past
   * exams): a padlock, and no hint that it leaves the site.
   * `shared` — a community upload in the public bucket: a file glyph, and an
   * external-link mark that appears on hover.
   */
  kind: "restricted" | "shared";
  title: string;
  /** The course code, in the outlined badge. */
  code: string;
  /** Further badges after the code; empty entries are skipped. */
  labels?: ReadonlyArray<string | null | undefined>;
  /** Right-aligned small print: an exam year, an upload date. */
  note: string | number;
}

/**
 * One stored file, as a card, for the pages that list files outside the
 * library UI (/exams and /profile). Both are Thai-only server pages, so every
 * string arrives already resolved — no locale, no hooks, nothing here needs
 * the client.
 */
export function FileLinkCard({
  href,
  kind,
  title,
  code,
  labels = [],
  note,
}: FileLinkCardProps) {
  const live = Boolean(href);
  return (
    <a
      href={href ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={kind === "restricted" ? !live : undefined}
      className={[
        // `group` lets the shared card's external-link mark react to the whole card.
        kind === "shared" && "group",
        CARD,
        live ? "hover:border-primary/40 hover:bg-muted/40" : "pointer-events-none opacity-50",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {kind === "restricted" ? (
        <FileLock2 className="size-4 text-muted-foreground" />
      ) : (
        <div className="flex items-start justify-between gap-2">
          <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      )}

      <p className="font-medium leading-snug text-pretty">{title}</p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <Badge variant="outline">{code}</Badge>
        {labels.map((label) =>
          label ? (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ) : null,
        )}
        <span className="ml-auto text-xs text-muted-foreground">{note}</span>
      </div>
    </a>
  );
}
