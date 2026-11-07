import { NextResponse, type NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { COURSES } from "@/lib/courses/catalog";
import { assetUrl } from "@/lib/library/asset-url";
import { assetsForCourse } from "@/lib/library/subject-library";
import { isRestrictedAsset, type AssetCategory, type AssetScope } from "@/lib/library/subject-library-ui";

export const dynamic = "force-dynamic";

/** Shelves a card can be on (excluding past exams which are strictly private). */
export const PUBLIC_KINDS = ["lecture", "cheatsheet", "exercise", "note", "reference"] as const;
export type PublicKind = (typeof PUBLIC_KINDS)[number];

export interface PublicCatalogItem {
  id: string;
  course: string;
  title: { th: string; en: string };
  description: { th: string; en: string } | null;
  category: string;
  fileType: string;
  url: string;
  fileName: string;
  week: number | null;
  scope: AssetScope | null;
  edition: string | null;
  status: string | null;
  isCurrentYear: boolean;
  sourceUrl: string | null;
  groupId: string | null;
  tags: string[];
  sizeBytes: number | null;
  pages: number | null;
}

interface RawAssetEntry {
  id: string;
  course: string;
  origin?: "curated" | "generated";
  title: { th: string; en: string };
  description: { th: string; en: string } | null;
  category: string | null;
  fileType: "pdf" | "image" | "md" | "file";
  url: string;
  path: string | null;
  fileName: string;
  storage: { bucket: string; key: string } | null;
  access: "member" | "insider";
  week: number | null;
  scope: AssetScope | null;
  edition: string | null;
  status: string | null;
  isCurrentYear: boolean;
  duplicateOf: string | null;
  sourceUrl: string | null;
  groupId: string | null;
  tags: string[];
  sizeBytes: number | null;
  pages: number | null;
  onDisk?: boolean;
}

interface RawResourceIndex {
  version: number;
  courses: Record<string, { code: string; name: { th: string; en: string } }>;
  assets: Record<string, RawAssetEntry>;
}

interface CatalogCache {
  items: PublicCatalogItem[];
  byCourse: Record<string, number>;
  byCategory: Record<string, number>;
  availableCourses: string[];
}

let cachedData: CatalogCache | null = null;

/**
 * Validates that an asset is 100% public-safe and contains no restricted exam content.
 * Enforces zero-trust defense in depth across 5 independent checks.
 */
function isPublicSafeAsset(asset: {
  access?: string;
  category?: string | null;
  url: string;
  storage?: { bucket: string } | null;
}): boolean {
  // 1. Explicit insider access flag
  if (asset.access === "insider") return false;

  // 2. Category check
  if (asset.category === "exam") return false;

  // 3. URL path check
  const cleanUrl = asset.url.split("#")[0].toLowerCase();
  if (cleanUrl.includes("/exams/")) return false;

  // 4. Storage bucket check: non-public exam bucket is strictly forbidden
  if (asset.storage?.bucket && asset.storage.bucket !== "ihelp-library") return false;

  // 5. Canonical restricted asset helper from subject-library-ui
  if (isRestrictedAsset({ url: asset.url, category: (asset.category as AssetCategory) ?? undefined })) {
    return false;
  }

  return true;
}

/**
 * Loads the public catalog dictionary either from `lib/library/resource-index.json`
 * or via fallback through `lib/library/subject-library.ts`.
 */
async function loadPublicCatalog(): Promise<CatalogCache> {
  if (cachedData) return cachedData;

  const knownCourseCodes = COURSES.map((c) => c.code);

  try {
    const indexPath = path.join(process.cwd(), "lib", "library", "resource-index.json");
    const raw = await fs.readFile(indexPath, "utf-8");
    const parsed = JSON.parse(raw) as RawResourceIndex;

    const publicItems: PublicCatalogItem[] = Object.values(parsed.assets)
      .filter(isPublicSafeAsset)
      .map((asset) => ({
        id: asset.id,
        course: asset.course,
        title: asset.title,
        description: asset.description,
        category: asset.category ?? "reference",
        fileType: asset.fileType,
        url: assetUrl(asset.url),
        fileName: asset.fileName,
        week: asset.week,
        scope: asset.scope,
        edition: asset.edition,
        status: asset.status,
        isCurrentYear: asset.isCurrentYear === true,
        sourceUrl: asset.sourceUrl,
        groupId: asset.groupId,
        tags: asset.tags,
        sizeBytes: asset.sizeBytes,
        pages: asset.pages,
      }));

    const byCourse: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const item of publicItems) {
      byCourse[item.course] = (byCourse[item.course] ?? 0) + 1;
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
    }

    cachedData = {
      items: publicItems,
      byCourse,
      byCategory,
      availableCourses: Object.keys(byCourse).sort(),
    };
    return cachedData;
  } catch {
    // Resilient fallback: build from subject-library directly
    const fallbackItems: PublicCatalogItem[] = [];
    const byCourse: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const course of COURSES) {
      const assets = assetsForCourse(course.code);
      if (!assets) continue;

      for (const asset of assets) {
        if (!isPublicSafeAsset(asset)) continue;

        const item: PublicCatalogItem = {
          id: asset.id,
          course: course.code,
          title: {
            th: asset.title.th,
            en: asset.title.en ?? asset.title.th,
          },
          description: asset.description
            ? {
                th: asset.description.th,
                en: asset.description.en ?? asset.description.th,
              }
            : null,
          category: asset.category ?? "reference",
          fileType: asset.fileType,
          url: asset.url,
          fileName: asset.fileName,
          week: asset.week ?? asset.chapter ?? null,
          scope: asset.scope ?? null,
          edition: asset.edition ?? null,
          status: asset.status ?? null,
          isCurrentYear: asset.isCurrentYear === true,
          sourceUrl: asset.sourceUrl ?? null,
          groupId: asset.groupId ?? null,
          tags: asset.tags,
          sizeBytes: asset.sizeBytes ?? null,
          pages: asset.pages ?? null,
        };
        fallbackItems.push(item);
        byCourse[item.course] = (byCourse[item.course] ?? 0) + 1;
        byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
      }
    }

    cachedData = {
      items: fallbackItems,
      byCourse,
      byCategory,
      availableCourses: knownCourseCodes.filter((c) => (byCourse[c] ?? 0) > 0),
    };
    return cachedData;
  }
}

/**
 * Public API: Learning Resource Catalog Dictionary
 *
 * Provides fast, public, structured search over all non-exam study materials.
 * Past exams are strictly filtered out (0% leakage).
 *
 * Query Params:
 * - `course`: Course short code, e.g. "ITF", "ICS", "MFIT" (case-insensitive)
 * - `week`: Syllabus week number (integer)
 * - `kind`: Category shelf: "lecture", "cheatsheet", "exercise", "note", "reference"
 * - `q`: Multi-term search query matched across id, fileName, title, tags, description
 * - `limit`: Page size limit (default 100, max 1000)
 * - `offset`: Offset for pagination (default 0)
 * - `summary`: If "true", returns catalog summary metrics without items array
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const catalog = await loadPublicCatalog();

  const courseParam = searchParams.get("course")?.trim() || null;
  const weekParam = searchParams.get("week")?.trim() || null;
  const kindParam = searchParams.get("kind")?.trim() || null;
  const qParam = searchParams.get("q")?.trim() || null;
  const summaryOnly = searchParams.get("summary") === "true";

  // Validate week param
  let parsedWeek: number | null = null;
  if (weekParam !== null) {
    if (!/^-?\d+$/.test(weekParam)) {
      return NextResponse.json(
        {
          error: "invalid_week",
          message: `The 'week' parameter must be an integer, received: "${weekParam}"`,
        },
        { status: 400 },
      );
    }
    parsedWeek = parseInt(weekParam, 10);
  }

  // Validate course param if provided
  let normalizedCourse: string | null = null;
  if (courseParam) {
    const match = catalog.availableCourses.find(
      (c) => c.toLowerCase() === courseParam.toLowerCase(),
    );
    if (!match) {
      return NextResponse.json(
        {
          error: "course_not_found",
          message: `Unknown course "${courseParam}". Available courses: ${catalog.availableCourses.join(", ")}`,
          availableCourses: catalog.availableCourses,
        },
        { status: 404 },
      );
    }
    normalizedCourse = match;
  }

  // Validate kind param if provided
  let normalizedKind: string | null = null;
  if (kindParam) {
    // If the caller asked for exam, explicitly return empty results since exams are not public
    if (kindParam.toLowerCase() === "exam") {
      normalizedKind = "exam";
    } else {
      const match = PUBLIC_KINDS.find((k) => k.toLowerCase() === kindParam.toLowerCase());
      if (!match) {
        return NextResponse.json(
          {
            error: "invalid_kind",
            message: `Unknown kind "${kindParam}". Supported kinds: ${PUBLIC_KINDS.join(", ")}`,
            supportedKinds: PUBLIC_KINDS,
          },
          { status: 400 },
        );
      }
      normalizedKind = match;
    }
  }

  // Parse limit & offset
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");

  const limit = Math.min(Math.max(parseInt(limitParam || "100", 10) || 100, 1), 1000);
  const offset = Math.max(parseInt(offsetParam || "0", 10) || 0, 0);

  // If summary requested without querying items
  if (summaryOnly) {
    return NextResponse.json(
      {
        meta: {
          totalPublicAssets: catalog.items.length,
          availableCourses: catalog.availableCourses,
          availableKinds: PUBLIC_KINDS,
          timestamp: new Date().toISOString(),
        },
        summary: {
          byCourse: catalog.byCourse,
          byCategory: catalog.byCategory,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  // Filter items
  let filtered = catalog.items;

  if (normalizedCourse) {
    filtered = filtered.filter((item) => item.course === normalizedCourse);
  }

  if (parsedWeek !== null) {
    filtered = filtered.filter((item) => item.week === parsedWeek);
  }

  if (normalizedKind) {
    if (normalizedKind === "exam") {
      filtered = []; // Exams are strictly never in public catalog
    } else {
      filtered = filtered.filter((item) => item.category === normalizedKind);
    }
  }

  if (qParam) {
    const terms = qParam
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    filtered = filtered.filter((item) => {
      const corpus = [
        item.id,
        item.fileName,
        item.title.th,
        item.title.en,
        item.description?.th ?? "",
        item.description?.en ?? "",
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();

      return terms.every((term) => corpus.includes(term));
    });
  }

  const totalMatches = filtered.length;
  const paginatedItems = filtered.slice(offset, offset + limit);

  return NextResponse.json(
    {
      meta: {
        total: totalMatches,
        totalPublicAssets: catalog.items.length,
        limit,
        offset,
        filters: {
          course: normalizedCourse,
          week: parsedWeek,
          kind: normalizedKind,
          q: qParam,
        },
        availableCourses: catalog.availableCourses,
        availableKinds: PUBLIC_KINDS,
        timestamp: new Date().toISOString(),
      },
      items: paginatedItems,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
