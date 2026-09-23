export type ProgramCode = 'BTECH' | 'MTECH' | 'MCA' | 'PHD';

export type BranchCode = 
  | 'CS' 
  | 'IT' 
  | 'CSAI' 
  | 'CSAIML' 
  | 'CSSE' 
  | 'CSDS' 
  | 'CSCBI' 
  | 'AIDS' 
  | 'CV' 
  | 'IC' 
  | 'ME' 
  | 'ET';

export type DivisionLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type BatchNumber = '1' | '2' | '3' | '4';
export type BatchFilter = '1' | '2' | '3' | '4' | 'ALL';

export type SessionType = 'Theory' | 'Lab' | 'Tutorial' | 'Project' | 'Seminar' | 'Activity';

export interface UserAcademicConfig {
  version: string; // e.g. '1.0'
  program: ProgramCode;
  branch: BranchCode;
  academicYear: string; // e.g. '2026-27'
  semester: number; // e.g. 1
  division: DivisionLetter;
  batch: BatchNumber;
  timeFormat: '12' | '24';
  selectedDateMs?: number;
  lastUpdated: string;
}

export interface TimetableDivisionRecord {
  id: string;
  slug: string;
  program: string;
  branch: BranchCode;
  division: string;
  academicYear: string;
  pdfLabel: string;
  version: string;
  effectiveFrom: string; // ISO date 'YYYY-MM-DD'
  effectiveTo: string;   // ISO date 'YYYY-MM-DD'
  campus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimetableSession {
  id: number | string;
  divisionId?: string;
  divisionSlug: string;
  weekday: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: number; // Minutes from midnight (e.g. 9:00 = 540)
  endTime: number;   // Minutes from midnight (e.g. 9:50 = 590)
  subjectCode: string;
  subjectName: string;
  sessionType: SessionType;
  batch?: BatchNumber; // undefined if applies to whole division (ALL)
  room: string;
  facultyInitials: string;
  facultyName?: string;
  facultyId?: string;
  notes?: string;
}

export interface SubjectMetadata {
  code: string;
  name: string;
  shortName: string;
  color: string;
  category?: string;
}

export interface FacultyRecord {
  initials: string;
  name: string;
  id?: string;
  title?: string;
  department?: string;
}

export interface AcademicCalendarDay {
  date: string; // 'YYYY-MM-DD'
  dayOrder?: number;
  isHoliday: boolean;
  holidayName?: string;
  isExamDay: boolean;
  examName?: string;
  notes?: string;
  source: string;
  version: string;
}

export interface FreePeriodSlot {
  weekday: number;
  startTime: number;
  endTime: number;
  durationMinutes: number;
}

export interface TimelineOccurrence extends TimetableSession {
  date: Date;
  dateString: string;
  dayOffset: number; // 0 for today, 1 for tomorrow, etc.
  startDate: Date;
  endDate: Date;
  state: 'PAST' | 'CURRENT' | 'NEXT' | 'UPCOMING';
}
