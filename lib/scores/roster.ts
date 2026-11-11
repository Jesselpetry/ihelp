import "server-only";

import { eq, inArray } from "drizzle-orm";

import { db, itggStudents, users } from "@/db";
import { readStudentNamesRegistry } from "./registry";

export interface StudentIdentity {
  fullName: string | null;
  nickname: string | null;
}

function collapseSpaces(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

function formatThaiParts(
  first: string | null | undefined,
  last: string | null | undefined,
  prefix?: string | null,
): string | null {
  const f = collapseSpaces(first);
  const l = collapseSpaces(last);
  const p = collapseSpaces(prefix);
  if (!f && !l) return null;
  const front = p && f ? `${p}${f}` : f;
  return collapseSpaces([front, l].filter(Boolean).join(" "));
}

/**
 * Resolves full names and iHelp nicknames for a set of student IDs using
 * score sheets/names fallback plus DB `ihelp.users` and `itgg_2026.students`.
 */
export async function buildStudentRoster(
  studentIds: string[],
  sheetNames?: Record<string, string>,
): Promise<Map<string, StudentIdentity>> {
  const roster = new Map<string, StudentIdentity>();
  const fileNames = await readStudentNamesRegistry();

  const missingForFullName: string[] = [];
  for (const id of studentIds) {
    const cleanName =
      collapseSpaces(sheetNames?.[id]) ?? collapseSpaces(fileNames[id]);
    roster.set(id, { fullName: cleanName, nickname: null });
    if (!cleanName) {
      missingForFullName.push(id);
    }
  }

  try {
    const userRows = await db
      .select({
        studentId: users.studentId,
        firstName: users.firstName,
        lastName: users.lastName,
        nickname: users.nickname,
      })
      .from(users);

    for (const u of userRows) {
      const nick = collapseSpaces(u.nickname);
      const userFull = formatThaiParts(u.firstName, u.lastName);
      const existing = roster.get(u.studentId);
      if (existing) {
        existing.nickname = nick ?? existing.nickname;
        if (!existing.fullName && userFull) {
          existing.fullName = userFull;
        }
      } else {
        roster.set(u.studentId, { fullName: userFull, nickname: nick });
      }
    }

    const stillMissing = missingForFullName.filter(
      (id) => !roster.get(id)?.fullName,
    );
    if (stillMissing.length > 0) {
      const itggRows = await db
        .select({
          studentId: itggStudents.studentId,
          prefix: itggStudents.prefix,
          frontName: itggStudents.frontName,
          surName: itggStudents.surName,
        })
        .from(itggStudents)
        .where(inArray(itggStudents.studentId, stillMissing));

      for (const s of itggRows) {
        const full = formatThaiParts(s.frontName, s.surName, s.prefix);
        const existing = roster.get(s.studentId);
        if (existing && !existing.fullName && full) {
          existing.fullName = full;
        }
      }
    }
  } catch {
    // Database optional in offline/local preview; sheet/storage names remain populated.
  }

  return roster;
}

export async function resolveStudentIdentity(
  studentId: string,
  sheetNames?: Record<string, string>,
): Promise<StudentIdentity> {
  const fileNames = await readStudentNamesRegistry();
  let fullName =
    collapseSpaces(sheetNames?.[studentId]) ??
    collapseSpaces(fileNames[studentId]);
  let nickname: string | null = null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.studentId, studentId),
      columns: {
        firstName: true,
        lastName: true,
        nickname: true,
      },
    });
    if (user) {
      nickname = collapseSpaces(user.nickname);
      if (!fullName) {
        fullName = formatThaiParts(user.firstName, user.lastName);
      }
    }

    if (!fullName) {
      const [itgg] = await db
        .select({
          prefix: itggStudents.prefix,
          frontName: itggStudents.frontName,
          surName: itggStudents.surName,
        })
        .from(itggStudents)
        .where(eq(itggStudents.studentId, studentId))
        .limit(1);
      if (itgg) {
        fullName = formatThaiParts(itgg.frontName, itgg.surName, itgg.prefix);
      }
    }
  } catch {
    // Offline/DB fallback
  }

  return { fullName, nickname };
}

