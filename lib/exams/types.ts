export interface FinalExamSection {
  section: number | string;
  day: string;
  time: string;
  room: string;
  instructors: string[];
}

export interface FinalExamItem {
  course_code: string;
  course_name: string;
  course_name_th: string;
  short_name: string;
  credits: string;
  sections?: {
    theory?: FinalExamSection;
    practice?: FinalExamSection;
  };
  final_exam: {
    date_th: string;
    date_en: string;
    date_iso: string;
    time: string;
    duration_hours?: number;
    type: string;
    status?: string;
    note?: string;
  };
}

export interface MidtermSeatingItem {
  exam_date: string;
  time: string;
  course_code: string;
  course_name: string;
  course_name_th?: string;
  short_name?: string;
  section: string;
  building: string;
  room: string;
  seat: string;
  seq: string;
}

export interface StudentExamProfile {
  student_id: string;
  name?: string;
  faculty: string;
  year?: number;
  cohort_order?: string;
  is_year1: boolean;
  midterm_exams: MidtermSeatingItem[];
  final_exams: FinalExamItem[];
  in_class_exams: FinalExamItem[];
}

export interface FacultyMasterExamItem {
  faculty_id: string;
  faculty_name: string;
  exam_date: string;
  no: string;
  time: string;
  course_code: string;
  course_name: string;
  section: string;
  student_count: string;
  building: string;
  room: string;
  seat_rows: string;
  student_id_range: string;
  detail_link?: string;
}

export interface RoomSeatStudent {
  student_id: string;
  name: string;
  seq: string;
}

export interface RoomSeatingSession {
  course_code: string;
  course_name: string;
  room: string;
  building: string;
  exam_date: string;
  time: string;
  seats: Record<string, RoomSeatStudent>;
}
