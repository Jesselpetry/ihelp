"use client";

import React, { useMemo } from "react";
import katex from "katex";

export interface MathTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  block?: boolean;
}

const MATH_PATTERN =
  "(\\$\\$[\\s\\S]+?\\$\\$|\\\\\\[[\\s\\S]+?\\\\\\]|\\\\\\([\\s\\S]+?\\\\\\)|\\$(?:[^\\s\\$]|[^\\s\\$][^\\$\\n]*?[^\\s\\$])\\$)";

/**
 * Renders mathematical expressions ($...$, $$...$$, \(...\), \[...\]) embedded
 * inside text using KaTeX, leaving all surrounding natural text intact.
 */
export function MathText({
  text,
  className,
  as: Component,
  block,
}: MathTextProps) {
  const renderedElements = useMemo(() => {
    if (!text || typeof text !== "string") return null;

    // Fast-path: if there's no math indicator ($ or \), return plain text
    if (!text.includes("$") && !text.includes("\\(") && !text.includes("\\[")) {
      return text;
    }

    const regex = new RegExp(MATH_PATTERN, "g");
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      const raw = match[0];
      let isDisplay = block ?? false;
      let math = raw;

      if (raw.startsWith("$$") && raw.endsWith("$$")) {
        isDisplay = true;
        math = raw.slice(2, -2).trim();
      } else if (raw.startsWith("\\[") && raw.endsWith("\\]")) {
        isDisplay = true;
        math = raw.slice(2, -2).trim();
      } else if (raw.startsWith("$") && raw.endsWith("$")) {
        math = raw.slice(1, -1).trim();
      } else if (raw.startsWith("\\(") && raw.endsWith("\\)")) {
        math = raw.slice(2, -2).trim();
      }

      let html: string | null = null;
      try {
        html = katex.renderToString(math, {
          displayMode: isDisplay,
          throwOnError: false,
          strict: false,
          trust: false,
          output: "htmlAndMathml",
        });
      } catch {
        html = null;
      }

      if (html !== null) {
        elements.push(
          <span
            key={`math-${match.index}`}
            className={
              isDisplay
                ? "katex-display my-2 overflow-x-auto text-center"
                : "inline-katex inline-block align-baseline font-normal"
            }
            dangerouslySetInnerHTML={{ __html: html }}
          />,
        );
      } else {
        elements.push(raw);
      }

      lastIndex = match.index + raw.length;
    }

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  }, [text, block]);

  if (!renderedElements) return null;

  if (Component) {
    return <Component className={className}>{renderedElements}</Component>;
  }

  if (className) {
    return <span className={className}>{renderedElements}</span>;
  }

  return <>{renderedElements}</>;
}
