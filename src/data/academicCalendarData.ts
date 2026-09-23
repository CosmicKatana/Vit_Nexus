import { AcademicCalendarDay } from '../types/timetable';

export const OFFICIAL_CALENDAR_PDF_URL = 'https://www.vit.edu/wp-content/uploads/2026/09/FY-Academic-Calendar-2026-27.pdf';

export interface ExamWindow {
  from: string; // 'YYYY-MM-DD'
  to: string;   // 'YYYY-MM-DD'
  label: string;
  type: 'MID_SEM' | 'IN_SEM_LAB' | 'END_SEM';
}

export const VERIFIED_HOLIDAYS: Record<string, string> = {
  '2026-09-18': 'Gauri Pujan',
  '2026-09-25': 'Anant Chaturdashi',
  '2026-10-02': 'Mahatma Gandhi Jayanti',
  '2026-10-20': 'Vijaya Dashami / Dasara',
  '2026-11-06': 'Diwali (Laxmi Pujan)',
  '2026-11-07': 'Diwali (Balipratipada)',
  '2026-11-08': 'Diwali (Bhaubeej)',
  '2026-11-09': 'Diwali Break',
  '2026-11-10': 'Diwali Break',
  '2026-11-11': 'Diwali Break',
  '2026-11-12': 'Diwali Break',
  '2026-11-24': 'Gurunanak Jayanti',
  '2026-12-25': 'Christmas',
  '2027-01-01': 'New Year Day',
  '2027-01-26': 'Republic Day',
  '2027-02-19': 'Chhatrapati Shivaji Maharaj Jayanti',
  '2027-03-08': 'Maha Shivratri',
  '2027-03-25': 'Holi / Dhulivandan',
  '2027-04-14': 'Dr. Babasaheb Ambedkar Jayanti',
  '2027-05-01': 'Maharashtra Day',
};

export const VERIFIED_EXAM_WINDOWS: ExamWindow[] = [
  {
    from: '2026-11-18',
    to: '2026-11-23',
    label: 'Mid-Semester Examination and Reviews',
    type: 'MID_SEM',
  },
  {
    from: '2027-01-04',
    to: '2027-01-16',
    label: 'Laboratory Assessments, In-Semester Reviews, Course Project Examination',
    type: 'IN_SEM_LAB',
  },
  {
    from: '2027-01-21',
    to: '2027-02-02',
    label: 'End-Semester Examination (Term I)',
    type: 'END_SEM',
  },
];

/**
 * Optional special day-order substitutions (e.g. when a working Saturday follows a Monday schedule)
 */
export const DAY_ORDER_OVERRIDES: Record<string, { substituteWeekday: number; reason: string }> = {
  // Example verified substitution:
  '2026-10-24': {
    substituteWeekday: 1, // Follows Monday timetable
    reason: 'Compensatory working day (Monday timetable followed)',
  },
};

export function getSpecialDayStatus(dateStr: string): {
  kind: 'holiday' | 'exam' | null;
  label: string | null;
  examType?: string;
} {
  const holiday = VERIFIED_HOLIDAYS[dateStr];
  if (holiday) {
    return { kind: 'holiday', label: holiday };
  }

  for (const window of VERIFIED_EXAM_WINDOWS) {
    if (dateStr >= window.from && dateStr <= window.to) {
      return { kind: 'exam', label: window.label, examType: window.type };
    }
  }

  return { kind: null, label: null };
}

export function getDayOrderForDate(date: Date): { effectiveWeekday: number; isSubstituted: boolean; reason?: string } {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const key = `${yyyy}-${mm}-${dd}`;

  if (DAY_ORDER_OVERRIDES[key]) {
    return {
      effectiveWeekday: DAY_ORDER_OVERRIDES[key].substituteWeekday,
      isSubstituted: true,
      reason: DAY_ORDER_OVERRIDES[key].reason,
    };
  }

  return {
    effectiveWeekday: date.getDay(),
    isSubstituted: false,
  };
}
