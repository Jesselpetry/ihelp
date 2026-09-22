import type { LText } from "@/lib/i18n";
import staffJson from "@/lib/courses/it-kmitl-staff.json";

/**
 * The faculty's academic staff, as its own directory prints them.
 *
 * Instructor names used to be retyped into every course summary, which is how
 * the same person ended up as "Dr. Praphan Pavarangkoon" in one file and
 * "ผศ. ดร.ประพันธ์ ภาวรังกูล" in another — wrong rank in the first, wrong
 * surname in the second. One roster, copied from the source of truth, so a
 * name is looked up rather than remembered.
 *
 * Rank is part of the name here, never dropped: ศ.ดร. (Professor), รศ.ดร.
 * (Associate), ผศ.ดร. (Assistant), ดร. (lecturer with a doctorate). Titles are
 * spaced consistently even where the directory prints "Asst.Prof.Dr.".
 */
export interface StaffMember {
  /** URL slug on it.kmitl.ac.th, derived from the English name. */
  slug: string;
  titleTh: string;
  nameTh: string;
  titleEn: string;
  nameEn: string;
  /** Administrative post, for the few who hold one. */
  roleTh?: string;
  roleEn?: string;
}

export const STAFF: StaffMember[] = staffJson.staff;

/** Where the roster came from, so the next person can re-check it. */
export const STAFF_SOURCE = {
  url: staffJson.source,
  retrieved: staffJson.retrieved,
};

/** Full name with rank, the form every document should print. */
export function staffName(member: StaffMember): LText {
  return {
    th: `${member.titleTh} ${member.nameTh}`,
    en: `${member.titleEn} ${member.nameEn}`,
  };
}

/** Administrative post, when there is one. */
export function staffRole(member: StaffMember): LText | undefined {
  if (!member.roleTh || !member.roleEn) return undefined;
  return { th: member.roleTh, en: member.roleEn };
}

/**
 * Profile page on the faculty site.
 *
 * The path is `/th/staffs/s/<slug>`, which is what the two hand-written links
 * in lib/course.ts already point at. Slugs for the rest are derived from the
 * English name the same way and are not individually verified.
 */
export function staffProfileUrl(member: StaffMember): string {
  return `https://www.it.kmitl.ac.th/th/staffs/s/${member.slug}`;
}

/**
 * Find one member by slug, or by any part of either name — "supakit",
 * "นุตยะสกุล" and "Supakit Nootyaskool" all resolve to the same record.
 * Returns undefined rather than guessing when the query matches several.
 */
export function findStaff(query: string): StaffMember | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  const exact = STAFF.find(
    (m) =>
      m.slug === q ||
      m.nameEn.toLowerCase() === q ||
      m.nameTh === query.trim(),
  );
  if (exact) return exact;

  const matches = STAFF.filter(
    (m) => m.nameEn.toLowerCase().includes(q) || m.nameTh.includes(query.trim()),
  );
  return matches.length === 1 ? matches[0] : undefined;
}
