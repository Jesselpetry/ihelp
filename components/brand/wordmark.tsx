import { SITE } from "@/lib/site";

export interface WordmarkProps {
  /** If true, renders unformatted string without colored tag markup: `<i>Help` */
  plain?: boolean;
  /** If true, renders natural prose text: `iHelp` */
  asProse?: boolean;
  /** Custom wrapper class */
  className?: string;
  /** Accent color class for `<i>`, defaults to `text-primary` */
  accentClassName?: string;
}

/**
 * Standard iHelp Wordmark component.
 *
 * Renders the brand logo with the code syntax metaphor:
 * The angle brackets `<` and `>` enclose ONLY the letter `i` (`<i>`),
 * highlighted in iHelp Signature Blue (`text-primary`), followed by `Help` in foreground text.
 *
 * Font family should be monospace (`font-mono`) and bold.
 */
export function Wordmark({
  plain = false,
  asProse = false,
  className = "",
  accentClassName = "text-primary",
}: WordmarkProps) {
  if (asProse) return <>{SITE.wordmark.prose}</>;
  if (plain) return <>{SITE.wordmark.plain}</>;

  const { tagOpen, tagText, tagClose, text } = SITE.wordmark;

  return (
    <span className={className}>
      <span className={accentClassName}>{tagOpen}</span>
      <span className={accentClassName}>{tagText}</span>
      <span className={accentClassName}>{tagClose}</span>
      <span>{text}</span>
    </span>
  );
}
