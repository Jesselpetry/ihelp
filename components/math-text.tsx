"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax/svg";
import { MATHJAX_OPTIONS, REMARK_MATH_OPTIONS } from "@/lib/docs/markdown";

export interface MathTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

const customComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
};

/**
 * Renders mathematical expressions ($...$, $$...$$, \(...\), \[...\]) embedded
 * inside text using the MathJax v3 SVG engine, leaving all surrounding natural text intact.
 */
export function MathText({ text, className, as: Component }: MathTextProps) {
  if (!text || typeof text !== "string") return null;

  // Fast-path: if there's no math indicator ($ or \), return plain text
  if (!text.includes("$") && !text.includes("\\(") && !text.includes("\\[")) {
    if (Component) {
      return <Component className={className}>{text}</Component>;
    }
    if (className) {
      return <span className={className}>{text}</span>;
    }
    return <>{text}</>;
  }

  const content = (
    <ReactMarkdown
      remarkPlugins={[[remarkMath, REMARK_MATH_OPTIONS]]}
      rehypePlugins={[[rehypeMathjax, MATHJAX_OPTIONS]]}
      components={customComponents}
    >
      {text}
    </ReactMarkdown>
  );

  if (Component) {
    return <Component className={className}>{content}</Component>;
  }

  if (className) {
    return <span className={className}>{content}</span>;
  }

  return <>{content}</>;
}
