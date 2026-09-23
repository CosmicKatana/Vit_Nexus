import { getSupabaseClient } from './supabaseClient';
import {
  TimetableDivisionRecord,
  TimetableSession,
  BatchNumber,
  BatchFilter,
  TimelineOccurrence,
  FreePeriodSlot,
} from '../types/timetable';
import { VERIFIED_DIVISIONS, getVerifiedScheduleForDivision } from '../data/verifiedTimetableData';
import { getCachedTimetable, setCachedTimetable } from '../utils/storage';
import { toMinutes, getTodayDateString, isSameDay } from '../utils/timeUtils';
import { getSpecialDayStatus, getDayOrderForDate } from '../data/academicCalendarData';

export interface TimetableLoadResult {
  division: TimetableDivisionRecord;
  sessions: TimetableSession[];
  filteredSessions: TimetableSession[];
  isCached: boolean;
  cachedAt?: string;
  sourceVersion: string;
  dataSource: string;
  error?: string;
}

export async function fetchDivisions(): Promise<TimetableDivisionRecord[]> {
  const supa = getSupabaseClient();
  if (!supa) {
    return VERIFIED_DIVISIONS;
  }

  try {
    const { data, error } = await supa
      .from('tt_divisions')
      .select('slug, branch, division, pdf_label, version, academic_year, effective_from, effective_to')
      .order('branch', { ascending: true })
      .order('division', { ascending: true });

    if (error || !data || data.length === 0) {
      return VERIFIED_DIVISIONS;
    }

    return data.map((r, i) => {
      const divLetter = r.division.split('-').pop()?.trim() || 'A';
      return {
        id: `supa-div-${i}`,
        slug: r.slug,
        program: 'BTECH',
        branch: r.branch,
        division: divLetter,
        academicYear: r.academic_year || '2026-27',
        pdfLabel: r.pdf_label || `FY ${r.branch}-${r.division}`,
        version: String(r.version || '1.0'),
        effectiveFrom: r.effective_from || '2026-09-01',
        effectiveTo: r.effective_to || '2027-01-20',
        campus: ['CS', 'IT', 'CSAI', 'CSAIML'].includes(r.branch)
          ? 'Bibwewadi Campus'
          : 'Kondhwa Campus',
      };
    });
  } catch (err) {
    console.warn('Failed querying Supabase tt_divisions, using verified master catalog:', err);
    return VERIFIED_DIVISIONS;
  }
}

export async function loadTimetableForDivision(
  divisionSlug: string,
  userBatch: BatchNumber,
  batchFilter: BatchFilter = userBatch
): Promise<TimetableLoadResult> {
  const divisions = await fetchDivisions();
  const division =
    divisions.find((d) => d.slug.toUpperCase() === divisionSlug.toUpperCase()) ||
    VERIFIED_DIVISIONS.find((d) => d.slug.toUpperCase() === divisionSlug.toUpperCase()) || {
      id: `div-${divisionSlug}`,
      slug: divisionSlug,
      program: 'BTECH',
      branch: divisionSlug.split('-')[1] as any,
      division: divisionSlug.split('-')[2] as any,
      academicYear: '2026-27',
      pdfLabel: divisionSlug,
      version: '1.0',
      effectiveFrom: '2026-09-01',
      effectiveTo: '2027-01-20',
      campus: 'Bibwewadi Campus',
    };

  const supa = getSupabaseClient();
  let liveSessions: TimetableSession[] | null = null;
  let dataSource = 'Supabase REST (Live Database)';
  let isCached = false;
  let cachedAt: string | undefined;

  // 1. Attempt Supabase live query if available
  if (supa) {
    try {
      const { data, error } = await supa
        .from('tt_sessions')
        .select('weekday, start_time, end_time, subject_code, subject_name, session_type, batch, room, faculty_initials, faculty_name, faculty_id')
        .eq('division', divisionSlug)
        .order('weekday', { ascending: true })
        .order('start_time', { ascending: true });

      if (!error && data && data.length > 0) {
        liveSessions = data.map((r, i) => {
          let batchNum: BatchNumber | undefined = undefined;
          if (r.batch) {
            const cleanBatch = String(r.batch).replace(/^B/i, '');
            if (['1', '2', '3'].includes(cleanBatch)) {
              batchNum = cleanBatch as BatchNumber;
            }
          }

          return {
            id: `supa-sess-${i}`,
            divisionSlug,
            weekday: Number(r.weekday),
            startTime: toMinutes(r.start_time),
            endTime: toMinutes(r.end_time),
            subjectCode: r.subject_code,
            subjectName: r.subject_name,
            sessionType: r.session_type || 'Theory',
            batch: batchNum,
            room: r.room || 'TBD',
            facultyInitials: r.faculty_initials || 'FAC',
            facultyName: r.faculty_name,
            facultyId: r.faculty_id,
          };
        });

        // Persist to local verified cache
        setCachedTimetable(divisionSlug, liveSessions, division.version);
        cachedAt = new Date().toISOString();
      }
    } catch (e) {
      console.warn('Supabase query error, falling back to cache:', e);
    }
  }

  // 2. If no live sessions, check local verified cache
  if (!liveSessions) {
    const cached = getCachedTimetable<TimetableSession[]>(divisionSlug);
    if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
      liveSessions = cached.data;
      isCached = true;
      cachedAt = cached.cachedAt;
      dataSource = 'Local Cache (Verified Offline Data)';
    }
  }

  // 3. Fallback to bundled verified dataset
  if (!liveSessions) {
    liveSessions = getVerifiedScheduleForDivision(divisionSlug);
    isCached = true;
    cachedAt = new Date().toISOString();
    dataSource = 'Bundled Official Timetable Dataset';
  }

  // Deterministic batch filtering
  const filteredSessions = liveSessions.filter((s) => {
    if (batchFilter === 'ALL') return true;
    // Sessions with no specific batch apply to the whole division (ALL batches)
    if (!s.batch) return true;
    return s.batch === batchFilter;
  });

  return {
    division,
    sessions: liveSessions,
    filteredSessions,
    isCached,
    cachedAt,
    sourceVersion: division.version,
    dataSource,
  };
}

/**
 * Filter sessions for a given weekday and batch
 */
export function getSessionsForDay(
  sessions: TimetableSession[],
  weekday: number,
  batch: BatchNumber
): TimetableSession[] {
  return sessions
    .filter((s) => s.weekday === weekday && (!s.batch || s.batch === batch))
    .sort((a, b) => a.startTime - b.startTime);
}

/**
 * Calculate upcoming timeline occurrences over the next N days
 */
export function calculateOccurrences(
  sessions: TimetableSession[],
  userBatch: BatchNumber,
  now: Date,
  lookaheadDays: number = 14
): TimelineOccurrence[] {
  const occurrences: TimelineOccurrence[] = [];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < lookaheadDays; offset++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const dateStr = getTodayDateString(targetDate);
    const special = getSpecialDayStatus(dateStr);

    // No classes on verified holidays
    if (special.kind === 'holiday') {
      continue;
    }

    const dayOrder = getDayOrderForDate(targetDate);
    const weekday = dayOrder.effectiveWeekday;

    // Filter day's sessions
    const daySessions = sessions
      .filter((s) => s.weekday === weekday && (!s.batch || s.batch === userBatch))
      .sort((a, b) => a.startTime - b.startTime);

    for (const sess of daySessions) {
      const startDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        Math.floor(sess.startTime / 60),
        sess.startTime % 60,
        0
      );
      const endDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        Math.floor(sess.endTime / 60),
        sess.endTime % 60,
        0
      );

      let state: 'PAST' | 'CURRENT' | 'NEXT' | 'UPCOMING' = 'UPCOMING';

      if (offset === 0) {
        if (sess.endTime <= currentMinutes) {
          state = 'PAST';
        } else if (sess.startTime <= currentMinutes && currentMinutes < sess.endTime) {
          state = 'CURRENT';
        }
      }

      occurrences.push({
        ...sess,
        date: targetDate,
        dateString: dateStr,
        dayOffset: offset,
        startDate,
        endDate,
        state,
      });
    }
  }

  // Determine which is NEXT
  let nextMarked = false;
  for (const occ of occurrences) {
    if (occ.startDate.getTime() > now.getTime() && !nextMarked) {
      occ.state = 'NEXT';
      nextMarked = true;
      break;
    }
  }

  return occurrences;
}

/**
 * Detect free periods between classes for a given day
 */
export function calculateFreePeriods(
  sessions: TimetableSession[],
  dayStartMinutes: number = 540, // 09:00
  dayEndMinutes: number = 1040    // 17:20
): FreePeriodSlot[] {
  if (sessions.length === 0) {
    return [
      {
        weekday: 0,
        startTime: dayStartMinutes,
        endTime: dayEndMinutes,
        durationMinutes: dayEndMinutes - dayStartMinutes,
      },
    ];
  }

  const sorted = [...sessions].sort((a, b) => a.startTime - b.startTime);
  const freeSlots: FreePeriodSlot[] = [];

  let currentPointer = sorted[0].startTime;

  // Gap before first class if significant (> 30 mins after day start)
  if (sorted[0].startTime - dayStartMinutes >= 30) {
    freeSlots.push({
      weekday: sorted[0].weekday,
      startTime: dayStartMinutes,
      endTime: sorted[0].startTime,
      durationMinutes: sorted[0].startTime - dayStartMinutes,
    });
  }

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    if (i > 0) {
      const prev = sorted[i - 1];
      const gap = current.startTime - prev.endTime;
      if (gap >= 20) {
        // Gaps of 20 mins or more are considered explicit free periods / lunch breaks
        freeSlots.push({
          weekday: current.weekday,
          startTime: prev.endTime,
          endTime: current.startTime,
          durationMinutes: gap,
        });
      }
    }
    currentPointer = Math.max(currentPointer, current.endTime);
  }

  return freeSlots;
}
