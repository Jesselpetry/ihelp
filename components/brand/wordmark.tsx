import { SITE } from "@/lib/site";

/**
 * The wordmark as inline content: the brackets in the primary colour around
 * plain text.
 *
 * It renders no wrapper element on purpose. Every call site already owns the
 * element that sets its font, size and layout (a link in the navbar, a <p> in
 * the disclaimer, the typing span in the splash), so this emits only the three
 * children and each of them keeps the markup it had when it spelled the
 * wordmark out by hand.
 *
 * `plain` is for the one place that sets it inside a sentence, where the
 * brackets are ordinary text: the heading on the onboarding page.
 */
export function Wordmark({ plain = false }: { plain?: boolean }) {
  if (plain) return <>{SITE.wordmark.plain}</>;

  const { open, text, close } = SITE.wordmark;
  return (
    <>
      <span className="text-primary">{open}</span>
      {text}
      <span className="text-primary">{close}</span>
    </>
  );
}
