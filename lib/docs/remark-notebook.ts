import type { Nodes, PhrasingContent, Root, Text } from "mdast";

/**
 * Two inline marks the notebook reader needs that Markdown has no syntax for:
 * a highlighter stroke and a hand-drawn underline.
 *
 * They cannot be written as `<mark>` or `<u>`. This project renders content
 * with react-markdown and no `rehype-raw`, so raw HTML in a document is
 * dropped before it ever reaches a renderer — the same reason a ```youtube
 * fence exists instead of an <iframe>.
 *
 * The delimiters are CriticMarkup's, `{==highlight==}` and `{++underline++}`,
 * chosen because the obvious pair is unusable here. A course about programming
 * writes `==` and `++` in ordinary prose: data/en-kmitl/สรุปคอมโปร-Midterm.md
 * alone mentions `C/C++` twice in one table, so a bare `++…++` rule would
 * swallow everything between them. Wrapping in braces takes the collision
 * count across content/, data/ and lib/ from 928 to zero.
 *
 * Only `text` nodes are rewritten. Code spans, fenced code and math carry a
 * `value` rather than `children`, so the walk never descends into them and
 * `if __name__ == "__main__"` is safe by construction.
 */

const TOKEN = /\{(==|\+\+)([\s\S]+?)\1\}/g;

const TAG = { "==": "mark", "++": "u" } as const;

/** Splits one text node around its marks, or null when it holds none. */
function splitMarks(node: Text): PhrasingContent[] | null {
  TOKEN.lastIndex = 0;
  if (!TOKEN.test(node.value)) return null;

  TOKEN.lastIndex = 0;
  const parts: PhrasingContent[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN.exec(node.value)) !== null) {
    if (match.index > cursor) {
      parts.push({ type: "text", value: node.value.slice(cursor, match.index) });
    }
    // mdast-util-to-hast rewrites the tag name from data.hName, so an
    // emphasis node is the cheapest carrier for an arbitrary element.
    parts.push({
      type: "emphasis",
      data: { hName: TAG[match[1] as keyof typeof TAG] },
      children: [{ type: "text", value: match[2] }],
    });
    cursor = match.index + match[0].length;
  }

  if (cursor < node.value.length) {
    parts.push({ type: "text", value: node.value.slice(cursor) });
  }
  return parts;
}

/**
 * mdast's Parent is generic over a dozen child unions, so a type predicate
 * onto it will not narrow. This shape is all the walk needs.
 */
type AnyParent = { children: Nodes[] };

function hasChildren(node: unknown): node is AnyParent {
  return (
    typeof node === "object" &&
    node !== null &&
    Array.isArray((node as AnyParent).children)
  );
}

function walk(parent: AnyParent): void {
  const next: Nodes[] = [];
  let rewrote = false;

  for (const child of parent.children) {
    if (child.type === "text") {
      const parts = splitMarks(child);
      if (parts) {
        next.push(...parts);
        rewrote = true;
        continue;
      }
    } else if (hasChildren(child)) {
      walk(child);
    }
    next.push(child);
  }

  if (rewrote) parent.children = next;
}

export function remarkNotebook() {
  return (tree: Root): void => {
    walk(tree as unknown as AnyParent);
  };
}
