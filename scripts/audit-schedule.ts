/**
 * scripts/audit-schedule.ts
 *
 * Automated audit suite for the iHelp timetable and schedule subsystem.
 * Verifies data integrity across term registry, course catalogs, section times,
 * room allocations, exam dates, presets, class meeting calendars, and student quotas.
 *
 * Usage:
 *   bun run schedule:audit
 *   npx tsx scripts/audit-schedule.ts
 */

import { DAYS_OF_WEEK, detectScheduleClashes, getScheduledSlots } from "../lib/schedule/y1s2-data";
import {
  getAllRegisteredTerms,
  getTermSchedule,
  REGISTERED_TERMS,
} from "../lib/schedule/registry";
import { SEMESTER_CONFIG_2_2569, SEMESTER_MEETINGS } from "../lib/schedule/semester-dates";
import studentGroupsData from "../data/schedule/y1s2-student-groups.json";

interface AuditResult {
  category: string;
  checks: number;
  passed: number;
  warnings: string[];
  errors: string[];
}

const results: AuditResult[] = [];

function createCategory(category: string): AuditResult {
  const r: AuditResult = { category, checks: 0, passed: 0, warnings: [], errors: [] };
  results.push(r);
  return r;
}

console.log("===============================================================");
console.log("  iHelp Timetable & Schedule Data Integrity Audit");
console.log("===============================================================\n");

// ── Check 1: Term Registry & Metadata ───────────────────────────────────────
const catTerms = createCategory("1. Term Registry & Metadata");
catTerms.checks += 1;
if (REGISTERED_TERMS.length === 0) {
  catTerms.errors.push("No academic terms registered in REGISTERED_TERMS.");
} else {
  catTerms.passed += 1;
}

const activeTerms = REGISTERED_TERMS.filter((t) => t.isActive);
catTerms.checks += 1;
if (activeTerms.length !== 1) {
  catTerms.errors.push(`Expected exactly 1 active term, but found ${activeTerms.length}.`);
} else {
  catTerms.passed += 1;
}

for (const term of REGISTERED_TERMS) {
  catTerms.checks += 1;
  if (!term.id || !term.academicYear || !term.semester || !term.yearLevel) {
    catTerms.errors.push(`Term ${term.id || "unknown"} is missing required metadata.`);
  } else if (!term.startDateTh || !term.endDateTh || !term.startIsoDate || !term.endIsoDate) {
    catTerms.errors.push(`Term ${term.id} is missing semester date bounds.`);
  } else {
    catTerms.passed += 1;
  }
}

// ── Check 2: Course Catalog & Section Consistency ────────────────────────────
const catCourses = createCategory("2. Course Catalog & Sections");
const allTerms = getAllRegisteredTerms();

for (const term of allTerms) {
  const scheduleData = getTermSchedule(term.id);
  const courses = scheduleData.courses;

  catCourses.checks += 1;
  if (courses.length === 0) {
    catCourses.errors.push(`Term ${term.id} has 0 courses.`);
    continue;
  }
  catCourses.passed += 1;

  const seenCodes = new Set<string>();

  for (const course of courses) {
    catCourses.checks += 1;
    if (seenCodes.has(course.code)) {
      catCourses.errors.push(`Duplicate course code "${course.code}" in term ${term.id}.`);
    } else {
      seenCodes.add(course.code);
      catCourses.passed += 1;
    }

    catCourses.checks += 1;
    if (!course.nameTh || !course.nameEn || !course.credits || course.creditHours <= 0) {
      catCourses.errors.push(`Course ${course.code} has invalid name or credit hours.`);
    } else {
      catCourses.passed += 1;
    }

    // Check sections
    catCourses.checks += 1;
    if (course.sections.length === 0) {
      catCourses.errors.push(`Course ${course.code} has 0 sections.`);
    } else {
      catCourses.passed += 1;
    }

    if (course.hasLab) {
      catCourses.checks += 1;
      const hasTheory = course.sections.some((s) => s.type === "ทฤษฎี");
      const hasLab = course.sections.some((s) => s.type === "ปฏิบัติ");
      if (!hasTheory || !hasLab) {
        catCourses.errors.push(`Course ${course.code} declared hasLab=true but is missing theory or lab sections.`);
      } else {
        catCourses.passed += 1;
      }
    }

    for (const sec of course.sections) {
      catCourses.checks += 1;
      const slot = sec.timeSlot;
      if (!DAYS_OF_WEEK.includes(slot.day)) {
        catCourses.errors.push(`Course ${course.code} Sec ${sec.section} has invalid day "${slot.day}".`);
      } else if (!slot.room || !slot.building) {
        catCourses.errors.push(`Course ${course.code} Sec ${sec.section} is missing room or building.`);
      } else if (
        slot.startHour > slot.endHour ||
        (slot.startHour === slot.endHour && slot.startMinute >= slot.endMinute)
      ) {
        catCourses.errors.push(`Course ${course.code} Sec ${sec.section} has invalid time range ${slot.timeStr}.`);
      } else {
        catCourses.passed += 1;
      }

      // Check seats
      catCourses.checks += 1;
      if (sec.seats.total < 0 || sec.seats.used < 0 || sec.seats.remain < 0) {
        catCourses.errors.push(`Course ${course.code} Sec ${sec.section} has negative seat numbers.`);
      } else {
        catCourses.passed += 1;
      }
    }

    // Check exam info
    catCourses.checks += 1;
    if (!course.midterm.date || !course.final.date) {
      catCourses.errors.push(`Course ${course.code} is missing midterm or final exam date.`);
    } else {
      catCourses.passed += 1;
    }
  }
}

// ── Check 3: Preset Selections & Clash Integrity ─────────────────────────────
const catPresets = createCategory("3. Presets & Time Clashes");

for (const term of allTerms) {
  const scheduleData = getTermSchedule(term.id);
  const courses = scheduleData.courses;
  const presets = scheduleData.presets;

  catPresets.checks += 1;
  if (presets.length === 0) {
    catPresets.warnings.push(`Term ${term.id} has no presets defined.`);
  } else {
    catPresets.passed += 1;
  }

  for (const preset of presets) {
    catPresets.checks += 1;
    let validPreset = true;

    // Check theory sections exist
    for (const [code, secNum] of Object.entries(preset.selections.theory)) {
      const course = courses.find((c) => c.code === code);
      if (!course) {
        catPresets.errors.push(`Preset "${preset.name}" references non-existent course ${code}.`);
        validPreset = false;
        continue;
      }
      const sec = course.sections.find((s) => s.section === secNum && s.type === "ทฤษฎี");
      if (!sec) {
        catPresets.errors.push(`Preset "${preset.name}" references invalid theory section ${secNum} for ${code}.`);
        validPreset = false;
      }
    }

    // Check lab sections exist
    for (const [code, secNum] of Object.entries(preset.selections.lab)) {
      const course = courses.find((c) => c.code === code);
      if (!course) {
        catPresets.errors.push(`Preset "${preset.name}" references non-existent lab course ${code}.`);
        validPreset = false;
        continue;
      }
      const sec = course.sections.find((s) => s.section === secNum && s.type === "ปฏิบัติ");
      if (!sec) {
        catPresets.errors.push(`Preset "${preset.name}" references invalid lab section ${secNum} for ${code}.`);
        validPreset = false;
      }
    }

    if (validPreset) {
      const slots = getScheduledSlots(preset.selections, courses);
      const clashes = detectScheduleClashes(slots);
      if (clashes.length > 0) {
        catPresets.warnings.push(
          `Preset "${preset.name}" contains ${clashes.length} time clash(es): ${clashes.map((c) => c.details).join("; ")}`,
        );
      }
      catPresets.passed += 1;
    }
  }
}

// ── Check 4: Class Meeting Dates Calendar ────────────────────────────────────
const catMeetings = createCategory("4. Class Meeting Dates & Calendar (118 Meetings)");

catMeetings.checks += 1;
if (SEMESTER_MEETINGS.length === 0) {
  catMeetings.errors.push("No semester meetings loaded from dataset.");
} else {
  catMeetings.passed += 1;
}

const thaiDayToWeekday: Record<string, number> = {
  จันทร์: 1,
  อังคาร: 2,
  พุธ: 3,
  พฤหัสบดี: 4,
  ศุกร์: 5,
};

let validMeetings = 0;
for (const m of SEMESTER_MEETINGS) {
  catMeetings.checks += 1;
  const d = new Date(m.isoDate);
  if (isNaN(d.getTime())) {
    catMeetings.errors.push(`Meeting ${m.courseCode} ${m.fullDateTh} has invalid ISO date "${m.isoDate}".`);
    continue;
  }

  // Check date within semester
  if (m.isoDate < SEMESTER_CONFIG_2_2569.startIsoDate || m.isoDate > SEMESTER_CONFIG_2_2569.endIsoDate) {
    catMeetings.errors.push(`Meeting ${m.courseCode} date ${m.isoDate} is outside semester bounds.`);
    continue;
  }

  // Check weekday matches day name
  const jsWeekday = d.getUTCDay(); // 1=Mon, 2=Tue...
  const expectedWeekday = thaiDayToWeekday[m.day];
  if (jsWeekday !== expectedWeekday) {
    catMeetings.errors.push(
      `Meeting ${m.courseCode} date ${m.isoDate} is day of week ${jsWeekday}, expected ${expectedWeekday} (${m.day}).`,
    );
    continue;
  }

  // Check teaching week is between 1 and 15
  if (m.teachingWeek < 1 || m.teachingWeek > 15) {
    catMeetings.errors.push(`Meeting ${m.courseCode} has invalid teaching week ${m.teachingWeek}.`);
    continue;
  }

  validMeetings++;
  catMeetings.passed += 1;
}

// ── Check 5: Student Group Quotas ───────────────────────────────────────────
const catGroups = createCategory("5. Student Group Rosters (KMITL 2/2569)");

const allStudents = new Set<string>();
const groups = [
  { name: "Group 1", list: studentGroupsData.group1 },
  { name: "Group 2", list: studentGroupsData.group2 },
  { name: "Group 3", list: studentGroupsData.group3 },
];

for (const g of groups) {
  catGroups.checks += 1;
  if (g.list.length === 0) {
    catGroups.warnings.push(`${g.name} has 0 student IDs.`);
  } else {
    catGroups.passed += 1;
  }

  for (const id of g.list) {
    catGroups.checks += 1;
    if (!/^\d{8}$/.test(id)) {
      catGroups.errors.push(`Invalid student ID format "${id}" in ${g.name}. Must be 8 digits.`);
      continue;
    }
    if (allStudents.has(id)) {
      catGroups.errors.push(`Student ID "${id}" appears in multiple groups.`);
    } else {
      allStudents.add(id);
      catGroups.passed += 1;
    }
  }
}

// ── Audit Summary Report ────────────────────────────────────────────────────
let hasErrors = false;
let totalChecks = 0;
let totalPassed = 0;
let totalWarnings = 0;
let totalErrors = 0;

for (const res of results) {
  totalChecks += res.checks;
  totalPassed += res.passed;
  totalWarnings += res.warnings.length;
  totalErrors += res.errors.length;

  const status =
    res.errors.length > 0 ? "FAILED" : res.warnings.length > 0 ? "WARN" : "OK";
  if (res.errors.length > 0) hasErrors = true;

  console.log(`[${status}] ${res.category}`);
  console.log(`       Checks: ${res.passed}/${res.checks} passed`);
  if (res.warnings.length > 0) {
    console.log(`       Warnings (${res.warnings.length}):`);
    for (const w of res.warnings) console.log(`         - ${w}`);
  }
  if (res.errors.length > 0) {
    console.log(`       Errors (${res.errors.length}):`);
    for (const e of res.errors) console.log(`         - ${e}`);
  }
  console.log("");
}

console.log("---------------------------------------------------------------");
console.log(
  `Total Checks: ${totalChecks} | Passed: ${totalPassed} | Warnings: ${totalWarnings} | Errors: ${totalErrors}`,
);
console.log(
  `Coverage: ${allTerms.length} terms, ${validMeetings} class meetings, ${allStudents.size} student roster IDs`,
);

if (hasErrors) {
  console.error("\n❌ SCHEDULE AUDIT FAILED — Fix errors above before releasing.");
  process.exit(1);
} else {
  console.log("\n✅ SCHEDULE AUDIT PASSED — All schedule datasets are verified and consistent.");
  process.exit(0);
}
