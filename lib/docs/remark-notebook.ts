import type { Nodes, PhrasingContent, Root, Text } from "mdast";

/**
 * Three inline marks the reader needs that plain Markdown cannot express: a
 * highlighter stroke, a hand-drawn underline, and subscript/superscript.
 *
 * None of them can be written as raw HTML. This project renders content with
 * react-markdown and no `rehype-raw`, so `<mark>` and `<u>` never reach a
 * renderer — the same reason a ```youtube fence exists instead of an <iframe>.
 *
 * Highlight and underline use CriticMarkup's delimiters, `{==like this==}`
 * and `{++like this++}`, because the obvious pair is unusable here. A course
 * about programming writes `==` and `++` in ordinary prose:
 * data/en-kmitl/สรุปคอมโปร-Midterm.md alone mentions `C/C++` twice in one
 * table, so a bare `++…++` rule would swallow everything between them. The
 * braces take the collision count across content/, data/ and lib/ from 928 to
 * zero. Pandoc's `~sub~` and `^sup^` were rejected on the same evidence: all
 * 60 stray `~` in content are URLs like it.kmitl.ac.th/~it65070089/, and `^`
 * appears 1901 times, almost all of it `x^{3}` inside math.
 *
 * Subscript and superscript instead keep the `<sub>`/`<sup>` spelling the
 * content already uses. 88 of them sit in content/ and data/ today —
 * `Z<sub>eff</sub>` and `n<sub>f</sub>` in the chemistry summary among them —
 * all currently rendering as literal angle brackets on the page. They are
 * repaired here without editing a single document.
 *
 * Two passes are needed because remark splits the two cases differently.
 * Braces live inside a single `text` node. A raw tag does not: remark emits
 * `html` nodes for `<sub>` and `</sub>` as siblings around the text between
 * them, so that pair has to be matched across a child list rather than inside
 * a string.
 *
 * Neither pass descends into code spans, fenced code or math, which carry a
 * `value` rather than `children`, so `if __name__ == "__main__"` and `e^{x}`
 * are safe by construction.
 */

const BRACE = /\{(==|\+\+)([\s\S]+?)\1\}/g;

const BRACE_TAG = { "==": "mark", "++": "u" } as const;

const OPEN_TAG = /^<(sub|sup)>$/;
const CLOSE_TAG = /^<\/(sub|sup)>$/;

/** mdast-util-to-hast takes the tag name from data.hName, so an emphasis
 *  node is the cheapest carrier for an arbitrary element. */
function element(hName: string, children: PhrasingContent[]): PhrasingContent {
  return { type: "emphasis", data: { hName }, children };
}

/** Splits one text node around its brace marks, or null when it holds none. */
function splitBraces(node: Text): PhrasingContent[] | null {
  BRACE.lastIndex = 0;
  if (!BRACE.test(node.value)) return null;

  BRACE.lastIndex = 0;
  const parts: PhrasingContent[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = BRACE.exec(node.value)) !== null) {
    if (match.index > cursor) {
      parts.push({ type: "text", value: node.value.slice(cursor, match.index) });
    }
    parts.push(
      element(BRACE_TAG[match[1] as keyof typeof BRACE_TAG], [
        { type: "text", value: match[2] },
      ]),
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < node.value.length) {
    parts.push({ type: "text", value: node.value.slice(cursor) });
  }
  return parts;
}

function tagOf(node: Nodes, pattern: RegExp): string | null {
  if (node.type !== "html") return null;
  return pattern.exec(node.value)?.[1] ?? null;
}

/**
 * Folds `<sub>` … `</sub>` sibling runs into one element. An unmatched opener
 * is left exactly as it was, so a stray tag cannot swallow the rest of the
 * paragraph.
 */
function foldTagPairs(children: Nodes[]): { out: Nodes[]; folded: boolean } {
  const out: Nodes[] = [];
  let folded = false;

  for (let i = 0; i < children.length; i++) {
    const open = tagOf(children[i], OPEN_TAG);
    if (open) {
      let depth = 1;
      let end = -1;
      for (let j = i + 1; j < children.length; j++) {
        if (tagOf(children[j], OPEN_TAG) === open) depth++;
        else if (tagOf(children[j], CLOSE_TAG) === open && --depth === 0) {
          end = j;
          break;
        }
      }
      if (end !== -1) {
        out.push(
          element(open, children.slice(i + 1, end) as PhrasingContent[]),
        );
        i = end;
        folded = true;
        continue;
      }
    }
    out.push(children[i]);
  }

  return { out, folded };
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
      const parts = splitBraces(child);
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

  const { out, folded } = foldTagPairs(next);
  if (rewrote || folded) parent.children = out;
}

export function remarkNotebook() {
  return (tree: Root): void => {
    walk(tree as unknown as AnyParent);
  };
}
