/**
 * Majors in the Faculty of IT. Keys match `ihelp.users.major` and are kept in
 * sync with the neighbouring itgg-2026 app so a student's major means the same
 * thing in both.
 */
export const MAJORS = [
  { key: "IT", label: "เทคโนโลยีสารสนเทศ (IT)" },
  { key: "DSBA", label: "วิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ (DSBA)" },
  { key: "AIT", label: "เทคโนโลยีสารสนเทศทางธุรกิจ นานาชาติ (AIT)" },
  { key: "BIT", label: "เทคโนโลยีสารสนเทศทางธุรกิจ (BIT)" },
] as const;

export type MajorKey = (typeof MAJORS)[number]["key"];

export const MAJOR_KEYS = MAJORS.map((m) => m.key) as readonly MajorKey[];

export function isMajorKey(value: unknown): value is MajorKey {
  return typeof value === "string" && MAJOR_KEYS.includes(value as MajorKey);
}

export function majorLabel(key: string | null | undefined): string | null {
  return MAJORS.find((m) => m.key === key)?.label ?? null;
}
