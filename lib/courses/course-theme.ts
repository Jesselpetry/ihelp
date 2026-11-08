/**
 * iHelp Signature Tri-Stop Blue Gradient & Visual Theme System.
 *
 * 135° diagonal from vibrant cerulean (#3a72c8) through IT KMITL royal sapphire (#2357A5)
 * to deep prussian navy (#163980). Paired with a translucent white hairline border
 * (`border border-white/10`) and ambient micro-shadow (`shadow-sm`).
 */

export const IHELP_GRADIENT = {
  from: "#3a72c8",
  via: "#2357A5",
  to: "#163980",
} as const;

export const IHELP_GRADIENT_CSS =
  `linear-gradient(135deg, ${IHELP_GRADIENT.from}, ${IHELP_GRADIENT.via}, ${IHELP_GRADIENT.to})`;

/** Checks whether a course belongs to General Education (GE) */
export function isGeCourse(code: string, officialCode?: string): boolean {
  const c = code.toUpperCase();
  return (
    c === "CHARM" ||
    c === "FE" ||
    c === "FE2" ||
    c === "SPORT" ||
    c === "DL" ||
    Boolean(officialCode?.startsWith("9064"))
  );
}

/** Checks whether a course belongs to Engineering Faculty (EN-KMITL) */
export function isEnKmitlCourse(
  code: string,
  group?: string,
  officialCode?: string,
): boolean {
  const c = code.toUpperCase();
  return (
    group === "EN-KMITL" ||
    c === "COMPRO" ||
    c === "CHEM" ||
    Boolean(officialCode?.startsWith("01"))
  );
}
