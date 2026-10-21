/**
 * A PDF in the browser's own viewer. The URL goes in untouched: a `#page=3`
 * fragment from assetUrl() is how a link lands on the right page.
 *
 * Fills its parent, with a floor so a short stage still shows a readable
 * page. The backdrop is white because a PDF page is white paper whatever the
 * site's theme — the frame should not read as dark while the viewer loads.
 */
export function PdfFrame({ src, title }: { src: string; title: string }) {
  return (
    <iframe
      // Keyed by URL so every file gets a fresh frame. Re-pointing a live one
      // at a URL that differs only in its #page fragment is a same-document
      // navigation, and the viewer may not act on it.
      key={src}
      src={src}
      title={title}
      className="h-full min-h-[60vh] w-full border-0 bg-white"
    />
  );
}
