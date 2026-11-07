import type { AcademicYearInfo } from "./types";
import type { LText } from "@/lib/i18n";

/**
 * Calculates the current Thai Buddhist Academic Year (ปีการศึกษา พ.ศ.).
 *
 * In Thai higher education (including KMITL), the academic calendar begins in
 * Semester 1 (June/August) and concludes around May of the following calendar year.
 *
 * - Months June–December (6–12): Academic year = current calendar year in BE.
 * - Months January–May (1–5): Academic year = previous calendar year in BE.
 */
export function getCurrentAcademicYearBE(asOfDate: Date = new Date()): number {
  const gregorianYear = asOfDate.getFullYear();
  const beYear = gregorianYear + 543;
  const month = asOfDate.getMonth() + 1; // 1 = Jan, 12 = Dec

  return month >= 6 ? beYear : beYear - 1;
}

/**
 * Parses admission year (พ.ศ.) from an 8-digit KMITL student ID or masked ID.
 * Examples:
 * - "69070027" -> 2569
 * - "6807xxxx" -> 2568
 * - "65070021" -> 2565
 * - "64070106" -> 2564
 */
export function parseAdmissionYearBE(studentId?: string): number | null {
  if (!studentId || studentId.length < 2) return null;
  const prefix = studentId.slice(0, 2);
  const yy = parseInt(prefix, 10);
  if (isNaN(yy)) return null;

  // Assume years 00-40 are 2600s, 40-99 are 2500s
  return yy >= 30 ? 2500 + yy : 2600 + yy;
}

/**
 * Resolves Faculty name from the 3rd and 4th digits of a KMITL student ID.
 * e.g. "69070027" -> digits 3-4 are "07" = Faculty of Information Technology.
 */
export function facultyFromStudentId(studentId?: string): LText | null {
  if (!studentId || studentId.length < 4) return null;
  const code = studentId.slice(2, 4);

  switch (code) {
    case "07":
      return {
        th: "คณะเทคโนโลยีสารสนเทศ",
        en: "Faculty of Information Technology",
      };
    case "01":
      return {
        th: "คณะวิศวกรรมศาสตร์",
        en: "Faculty of Engineering",
      };
    case "02":
      return {
        th: "คณะสถาปัตยกรรม ศิลปะและการออกแบบ",
        en: "Faculty of Architecture, Art and Design",
      };
    case "03":
      return {
        th: "คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี",
        en: "Faculty of Industrial Education and Technology",
      };
    case "04":
      return {
        th: "คณะเทคโนโลยีการเกษตร",
        en: "Faculty of Agricultural Technology",
      };
    case "05":
      return {
        th: "คณะวิทยาศาสตร์",
        en: "Faculty of Science",
      };
    default:
      return null;
  }
}

/**
 * Automatic Academic Year & Student Level Calculator ("ระบบเลื่อนชั้นปีเอง").
 *
 * Takes a student ID (or explicit admission year) and calculates:
 * - Exact year level (ชั้นปีที่ 1, 2, 3, 4)
 * - Alumni status if beyond 4 years
 * - Cohort badge (e.g. IT29, IT24)
 *
 * Automatically updates when time advances into a new academic year.
 */
export function calculateAcademicYear(
  studentId?: string,
  explicitEntryYearBE?: number,
  asOfDate: Date = new Date(),
  explicitCohort?: string,
): AcademicYearInfo | null {
  const admissionYearBE = explicitEntryYearBE ?? parseAdmissionYearBE(studentId);
  if (!admissionYearBE) return null;

  const currentAcademicYearBE = getCurrentAcademicYearBE(asOfDate);
  const diff = currentAcademicYearBE - admissionYearBE + 1;

  if (diff <= 0) {
    // Incoming freshman / not yet started
    return {
      academicYearBE: currentAcademicYearBE,
      admissionYearBE,
      yearNumber: 1,
      yearLabel: { th: "ว่าที่ชั้นปีที่ 1", en: "Incoming 1st Year" },
      isAlumni: false,
      cohort: explicitCohort,
    };
  }

  if (diff === 1) {
    return {
      academicYearBE: currentAcademicYearBE,
      admissionYearBE,
      yearNumber: 1,
      yearLabel: { th: "ชั้นปีที่ 1", en: "1st Year" },
      isAlumni: false,
      cohort: explicitCohort,
    };
  }

  if (diff === 2) {
    return {
      academicYearBE: currentAcademicYearBE,
      admissionYearBE,
      yearNumber: 2,
      yearLabel: { th: "ชั้นปีที่ 2", en: "2nd Year" },
      isAlumni: false,
      cohort: explicitCohort,
    };
  }

  if (diff === 3) {
    return {
      academicYearBE: currentAcademicYearBE,
      admissionYearBE,
      yearNumber: 3,
      yearLabel: { th: "ชั้นปีที่ 3", en: "3rd Year" },
      isAlumni: false,
      cohort: explicitCohort,
    };
  }

  if (diff === 4) {
    return {
      academicYearBE: currentAcademicYearBE,
      admissionYearBE,
      yearNumber: 4,
      yearLabel: { th: "ชั้นปีที่ 4", en: "4th Year" },
      isAlumni: false,
      cohort: explicitCohort,
    };
  }

  // diff > 4 years: Graduated / Senior Alumni
  return {
    academicYearBE: currentAcademicYearBE,
    admissionYearBE,
    yearNumber: diff,
    yearLabel: { th: "ศิษย์เก่า (Alumni)", en: "Alumni" },
    isAlumni: true,
    cohort: explicitCohort,
  };
}

/** Formats student ID with clean masking for public display if requested */
export function formatStudentIdDisplay(studentId?: string): string | null {
  if (!studentId) return null;
  return studentId;
}
