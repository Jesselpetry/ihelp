/**
 * Strict KMITL Faculty-of-IT gate. Pure and dependency-free so it can be unit
 * tested and reused from the auth callback, the proxy, and server actions.
 */

export const KMITL_DOMAIN = "@kmitl.ac.th";

/** Digits 3-4 of a KMITL student id are the faculty code. IT is 07. */
export const IT_FACULTY_CODE = "07";

export type VerifyFailure = "domain" | "id_format" | "faculty";

export type VerifyResult =
  | { ok: true; studentId: string }
  | { ok: false; reason: VerifyFailure };

/**
 * Accepts only a campus student mailbox belonging to the IT faculty, e.g.
 * `69070027@kmitl.ac.th`.
 *
 * The `endsWith("@kmitl.ac.th")` test deliberately rejects `@it.kmitl.ac.th`:
 * Google accounts are always the campus mailbox, and the faculty domain is an
 * IdP-only alias that would otherwise slip past the id parsing below.
 */
export function verifyKmitlIt(email: string | null | undefined): VerifyResult {
  const address = email?.trim().toLowerCase();
  if (!address || !address.endsWith(KMITL_DOMAIN)) {
    return { ok: false, reason: "domain" };
  }

  const studentId = address.slice(0, -KMITL_DOMAIN.length);
  if (!/^\d{8}$/.test(studentId)) {
    return { ok: false, reason: "id_format" };
  }

  if (studentId.substring(2, 4) !== IT_FACULTY_CODE) {
    return { ok: false, reason: "faculty" };
  }

  return { ok: true, studentId };
}

/** Thai copy for each rejection, shown on /auth/unauthorized. */
export const VERIFY_MESSAGES: Record<VerifyFailure, string> = {
  faculty: "เฉพาะนักศึกษาคณะ IT เท่านั้น",
  domain: "ต้องเข้าสู่ระบบด้วยอีเมล @kmitl.ac.th ของนักศึกษาเท่านั้น",
  id_format: "อีเมลนี้ไม่ใช่รหัสนักศึกษา 8 หลัก",
};
