import type { LText } from "@/lib/ltext";

/** Every UI string in the study space. Content (key points) stays in lib/study-space. */
export const L = {
  // page
  appName: { th: "พื้นที่อ่าน", en: "Study space" },
  backToProfile: { th: "โปรไฟล์", en: "Profile" },
  onlyYou: { th: "เห็นเฉพาะคุณ", en: "Only you can see this" },
  dayOf: { th: "วันที่ {n}/{t}", en: "Day {n}/{t}" },
  backToToday: { th: "กลับวันนี้", en: "Back to today" },
  settings: { th: "ตั้งค่า", en: "Settings" },
  logged: { th: "อ่านแล้ว", en: "Logged" },
  tasksDone: { th: "หัวข้อที่จบ", en: "Topics done" },
  hoursShort: { th: "ชม.", en: "h" },
  prevDay: { th: "วันก่อน", en: "Previous day" },
  nextDay: { th: "วันถัดไป", en: "Next day" },
  viewLabel: { th: "มุมมอง", en: "View" },
  planDays: { th: "วันในแผน", en: "Plan days" },
  tabToday: { th: "วันนี้", en: "Today" },
  tabPlan: { th: "แผนทั้งหมด", en: "Full plan" },
  tabCourses: { th: "รายวิชา", en: "Courses" },
  tabLog: { th: "บันทึกเวลา", en: "Time log" },
  courseLabel: { th: "วิชา", en: "Course" },

  // focus mode
  focusMode: { th: "โหมดโฟกัส", en: "Focus mode" },
  exitFocus: { th: "ออกจากโหมดโฟกัส", en: "Exit focus mode" },
  showList: { th: "แสดงรายการวันนี้", en: "Show today's list" },
  hideList: { th: "ซ่อนรายการ เหลือแค่ตัวจับเวลา", en: "Hide the list — timer only" },
  browserFullscreen: { th: "เต็มจอทั้งเครื่อง", en: "Browser full screen" },
  exitBrowserFullscreen: { th: "ออกจากเต็มจอ", en: "Exit full screen" },

  // timer
  timer: { th: "ตัวจับเวลา", en: "Timer" },
  modeLabel: { th: "โหมดจับเวลา", en: "Timer mode" },
  focus: { th: "โฟกัส", en: "Focus" },
  break: { th: "พัก", en: "Break" },
  start: { th: "เริ่ม", en: "Start" },
  resume: { th: "ต่อ", en: "Resume" },
  pause: { th: "หยุด", en: "Pause" },
  reset: { th: "รีเซ็ต", en: "Reset" },
  saveNow: { th: "บันทึก {m} นาที", en: "Log {m} min" },
  sound: { th: "เสียงแจ้งเตือน", en: "Sound" },
  soundOn: { th: "ปิดเสียง", en: "Mute" },
  soundOff: { th: "เปิดเสียง", en: "Unmute" },
  chooseSubject: { th: "เลือกวิชาที่จับเวลา", en: "Course to time" },
  notToday: { th: "ไม่มีในแผนวันนี้", en: "not planned today" },
  lockedWhileRunning: { th: "เปลี่ยนวิชาได้เมื่อจบหรือรีเซ็ตรอบนี้", en: "Finish or reset this block to switch" },
  creditTo: { th: "บันทึกเข้าแผนวันที่ {d}", en: "Logged to {d}" },
  todayProgress: { th: "อ่านแล้ว", en: "Read" },
  quotaFor: { th: "โควตาของวัน", en: "Day's quota" },
  quotaMet: { th: "ครบแล้ว", en: "Done" },
  left: { th: "เหลือ {t}", en: "{t} left" },

  // today list
  todayHeading: { th: "วันนี้อ่าน", en: "Today's reading" },
  dayHeading: { th: "อ่านของวันที่ {d}", en: "Reading for {d}" },
  dayTarget: { th: "เป้า {h} ชม.", en: "{h} h target" },
  examToday: { th: "สอบ {c} วันนี้", en: "{c} exam today" },
  examThatDay: { th: "วันสอบ {c}", en: "{c} exam day" },
  roomPending: { th: "ห้องสอบยังไม่ประกาศ", en: "Room not announced" },
  seeTimetable: { th: "ตารางสอบ", en: "Timetable" },
  keyPoints: { th: "ต้องตอบได้", en: "Be able to" },
  markDone: { th: "อ่านจบแล้ว", en: "Mark done" },
  markedDone: { th: "จบแล้ว", en: "Done" },
  timing: { th: "กำลังจับเวลา", en: "Timing" },
  timeThis: { th: "จับเวลาวิชานี้", en: "Time this" },
  allDone: { th: "อ่านครบทุกหัวข้อของวันนี้แล้ว", en: "Everything for today is done" },
  openCourse: { th: "หน้าวิชา", en: "Course page" },

  // exams, plan, courses
  examTodayShort: { th: "สอบวันนี้", en: "Today" },
  examDone: { th: "สอบแล้ว", en: "Done" },
  daysLeft: { th: "อีก {n} วัน", en: "{n} days" },
  dayLeft: { th: "พรุ่งนี้", en: "Tomorrow" },
  untilExam: { th: "ก่อนสอบ {c}", en: "Before {c}" },
  daysCount: { th: "{n} วัน", en: "{n} days" },
  unitsDone: { th: "{d}/{t} สัปดาห์", en: "{d}/{t} weeks" },
  plannedOn: { th: "อยู่ในแผนวันที่", en: "Planned on" },
  finalScope: { th: "ขอบเขตสอบปลายภาค", en: "Final-exam scope" },

  // time log
  sessionsFor: { th: "บันทึกของวันที่ {d}", en: "Log for {d}" },
  noSessions: { th: "ยังไม่มีบันทึก", en: "Nothing logged yet" },
  addManual: { th: "เพิ่มเวลาเอง", en: "Add time" },
  minutes: { th: "นาที", en: "min" },
  add: { th: "เพิ่ม", en: "Add" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  remove: { th: "ลบ", en: "Remove" },
  manual: { th: "กรอกเอง", en: "manual" },

  // settings
  settingsTitle: { th: "ตั้งค่าพื้นที่อ่าน", en: "Study space settings" },
  settingsDesc: {
    th: "เก็บไว้ในเบราว์เซอร์นี้ พร้อมเวลาที่บันทึกและเช็คลิสต์",
    en: "Kept in this browser, with your logged time and checklists",
  },
  custom: { th: "กำหนดเอง", en: "Custom" },
  studyMin: { th: "อ่าน (นาที)", en: "Focus (min)" },
  breakMin: { th: "พัก (นาที)", en: "Break (min)" },
  autoAdvance: { th: "เริ่มรอบถัดไปอัตโนมัติ", en: "Auto-start next phase" },
  shortcuts: { th: "คีย์ลัด", en: "Shortcuts" },
  scStartPause: { th: "เริ่ม / หยุด", en: "Start / pause" },
  scFocus: { th: "เข้า / ออกโหมดโฟกัส", en: "Enter / leave focus mode" },
  scExit: { th: "ออกจากโหมดโฟกัส", en: "Leave focus mode" },
  save: { th: "บันทึก", en: "Save" },
  danger: { th: "ล้างข้อมูล", en: "Reset" },
  resetAll: { th: "ล้างเวลาและเช็คลิสต์ทั้งหมด", en: "Clear all time and checklists" },
  resetConfirm: { th: "ยืนยันล้าง — ย้อนกลับไม่ได้", en: "Confirm — this can't be undone" },

  // profile card
  cardTitle: { th: "พื้นที่อ่านสอบปลายภาค", en: "Finals study space" },
  cardToday: { th: "วันนี้", en: "Today" },
  cardNoTasks: { th: "ไม่มีแผนอ่านวันนี้", en: "Nothing planned today" },
  cardNextExam: { th: "สอบถัดไป {c} · {when}", en: "Next: {c} · {when}" },
  open: { th: "เปิด", en: "Open" },
} satisfies Record<string, LText>;

/** Fills `{key}` placeholders. */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}
