import "server-only";

import type {
  CourseScoreAllRow,
  CourseScoreColumn,
  CourseScoreViewResponse,
  ScoreCategoryItem,
  ScoreCellValue,
  ScoreSubPart,
} from "@/lib/scores/types";
import type { StudentIdentity } from "./roster";
import type { ScoreSheet } from "./sheet-types";

const round2 = (n: number) => Math.round(n * 100) / 100;

function numericOrZero(value: ScoreCellValue | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function extractStatus(
  values: (ScoreCellValue | undefined)[],
): "ลาออก" | "ขาดสอบ" | null {
  for (const val of values) {
    if (val === "ลาออก" || val === "ขาดสอบ") return val;
  }
  return null;
}

interface ComputedRow {
  categories: ScoreCategoryItem[];
  cells: Record<string, ScoreCellValue>;
  total: number;
  gradedMax: number;
  fullMax: number;
  status: "ลาออก" | "ขาดสอบ" | null;
}

function computeStudentMetrics(
  sheet: ScoreSheet,
  studentId: string,
  row: Record<string, ScoreCellValue> | undefined,
): ComputedRow {
  const scale = sheet.quizScale;
  const scaledKeys = new Set(scale?.sourceKeys ?? []);
  const categories: ScoreCategoryItem[] = [];
  const cells: Record<string, ScoreCellValue> = {};

  if (scale) {
    const subParts: ScoreSubPart[] = scale.sourceKeys.map((key) => {
      const partDef = sheet.parts.find((p) => p.key === key);
      const val = row?.[key] ?? null;
      cells[key] = val;
      return {
        key,
        label: partDef?.label ?? key,
        max: partDef?.max ?? 5,
        value: val,
      };
    });

    const rawEarned = round2(
      subParts.reduce((sum, part) => sum + numericOrZero(part.value), 0),
    );
    const quizScaled = round2((rawEarned / scale.rawMax) * scale.scaledMax);
    cells[scale.key] = row ? quizScaled : null;

    categories.push({
      key: scale.key,
      label: scale.label,
      max: scale.scaledMax,
      score: row ? quizScaled : null,
      rawSummary: { earned: rawEarned, max: scale.rawMax },
      subParts,
    });
  }

  const subRow = sheet.subScores?.[studentId];
  const rawRow = sheet.rawTotals?.[studentId];

  for (const part of sheet.parts) {
    if (scaledKeys.has(part.key)) continue;
    const val = part.pending ? null : (row?.[part.key] ?? null);
    cells[part.key] = val;

    const subParts: ScoreSubPart[] | undefined = part.subParts?.map((def) => ({
      key: def.key,
      label: def.label,
      max: def.max,
      value: subRow?.[def.key] ?? null,
      note: def.note,
    }));

    const rawEarned =
      part.rawKey && rawRow ? rawRow[part.rawKey] : undefined;
    const rawSummary =
      typeof rawEarned === "number" && typeof part.rawMax === "number"
        ? { earned: round2(rawEarned), max: part.rawMax }
        : undefined;

    categories.push({
      key: part.key,
      label: part.label,
      max: part.max,
      score: val,
      pending: Boolean(part.pending),
      rawSummary,
      subParts,
    });
  }

  if (!scale) {
    for (const pending of sheet.pending) {
      const exists = categories.some(
        (cat) =>
          cat.label === pending.label ||
          (pending.key && cat.key === pending.key),
      );
      if (!exists) {
        const key = pending.key ?? pending.label;
        cells[key] = null;
        categories.push({
          key,
          label: pending.label,
          max: pending.max,
          score: null,
          pending: true,
        });
      }
    }
  }

  const extraRow = sheet.extraCells?.[studentId];
  if (extraRow) {
    for (const [k, v] of Object.entries(extraRow)) {
      cells[k] = v;
    }
  }

  const gradedCategories = categories.filter((c) => !c.pending);
  const gradedMax = round2(gradedCategories.reduce((sum, c) => sum + c.max, 0));
  const fullMax =
    sheet.fullMax ?? round2(categories.reduce((sum, c) => sum + c.max, 0));
  const total = round2(
    gradedCategories.reduce((sum, c) => sum + numericOrZero(c.score), 0),
  );
  const status =
    sheet.studentStatuses?.[studentId] ??
    extractStatus(gradedCategories.map((c) => c.score));

  return { categories, cells, total, gradedMax, fullMax, status };
}

function buildColumns(sheet: ScoreSheet, gradedMax: number): CourseScoreColumn[] {
  if (sheet.columns && sheet.columns.length > 0) {
    return sheet.columns;
  }

  const columns: CourseScoreColumn[] = [];
  const scale = sheet.quizScale;
  const scaledKeys = new Set(scale?.sourceKeys ?? []);

  if (scale) {
    for (const key of scale.sourceKeys) {
      const partDef = sheet.parts.find((p) => p.key === key);
      columns.push({
        key,
        label: partDef?.label ?? key,
        max: partDef?.max,
        numeric: true,
      });
    }
    columns.push({
      key: scale.key,
      label: `Quiz (${scale.scaledMax})`,
      max: scale.scaledMax,
      numeric: true,
    });
  }

  for (const part of sheet.parts) {
    if (scaledKeys.has(part.key)) continue;
    columns.push({
      key: part.key,
      label: part.label,
      max: part.max,
      pending: Boolean(part.pending),
      numeric: true,
    });
  }

  columns.push({
    key: "total",
    label: `รวม (${gradedMax})`,
    max: gradedMax,
    numeric: true,
  });

  return columns;
}

export function buildHubScoreResponse(
  sheet: ScoreSheet,
  viewerId: string,
  includeAll: boolean,
  roster?: Map<string, StudentIdentity>,
): CourseScoreViewResponse {
  const viewerRow = sheet.scores[viewerId];
  const enrolled = Boolean(viewerRow);
  const mine = computeStudentMetrics(sheet, viewerId, viewerRow);
  const columns = buildColumns(sheet, mine.gradedMax);
  const viewerIdentity = roster?.get(viewerId);

  let allRows: CourseScoreAllRow[] | undefined;
  if (includeAll) {
    allRows = Object.entries(sheet.scores)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([studentId, row]) => {
        const computed = computeStudentMetrics(sheet, studentId, row);
        const identity = roster?.get(studentId);
        return {
          studentId,
          fullName: identity?.fullName ?? sheet.studentNames?.[studentId] ?? null,
          nickname: identity?.nickname ?? null,
          section: sheet.studentSections?.[studentId] ?? null,
          status: computed.status,
          cells: { ...computed.cells, total: computed.total },
          total: computed.total,
        };
      });
  }

  return {
    courseCode: sheet.courseCode,
    title: sheet.title,
    viewerId,
    viewerFullName:
      viewerIdentity?.fullName ?? sheet.studentNames?.[viewerId] ?? null,
    viewerNickname: viewerIdentity?.nickname ?? null,
    viewerSection: sheet.studentSections?.[viewerId] ?? null,
    lastUpdated: sheet.importedAt,
    updates: sheet.updates ?? [],
    notes: sheet.notes ?? [],
    totalStudents: Object.keys(sheet.scores).length,
    enrolled,
    mySummary: enrolled
      ? {
          total: mine.total,
          gradedMax: mine.gradedMax,
          fullMax: mine.fullMax,
          status: mine.status,
        }
      : {
          total: 0,
          gradedMax: mine.gradedMax,
          fullMax: mine.fullMax,
          status: null,
        },
    categories: mine.categories,
    columns,
    allRows,
  };
}

