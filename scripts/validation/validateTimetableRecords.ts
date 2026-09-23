import {
  RawExtractedSessionRecord,
  ValidatedSessionRecord,
  IngestionReport,
} from '../ingestion/pdfExtractionSchema';

const VALID_WEEKDAYS = new Set([1, 2, 3, 4, 5, 6]); // Mon to Sat
const VALID_SESSION_TYPES = new Set(['Theory', 'Lab', 'Tutorial', 'Activity', 'Project']);
const VALID_BATCHES = new Set(['1', '2', '3', 'ALL', '']);

function parseTimeToMinutes(t?: string): number | null {
  if (!t) return null;
  const match = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export function validateTimetableRecords(
  sourceFileName: string,
  rawRecords: RawExtractedSessionRecord[]
): IngestionReport {
  const rejections: IngestionReport['rejections'] = [];
  const acceptedRecords: ValidatedSessionRecord[] = [];
  const duplicateSignatureSet = new Set<string>();

  rawRecords.forEach((raw, idx) => {
    const reasons: string[] = [];

    // 1. Division Validation
    const division = raw.division?.trim();
    const branch = raw.branch?.trim();
    if (!division || !branch) {
      reasons.push('Ambiguous or missing branch/division identity.');
    }

    // 2. Weekday Validation
    const weekday = Number(raw.weekdayRaw);
    if (!VALID_WEEKDAYS.has(weekday)) {
      reasons.push(`Invalid weekday index: "${raw.weekdayRaw}". Must be 1 (Mon) to 6 (Sat).`);
    }

    // 3. Time Validation
    const startM = parseTimeToMinutes(raw.startTimeRaw);
    const endM = parseTimeToMinutes(raw.endTimeRaw);
    if (startM === null) {
      reasons.push(`Invalid start time format: "${raw.startTimeRaw}". Expected HH:MM.`);
    }
    if (endM === null) {
      reasons.push(`Invalid end time format: "${raw.endTimeRaw}". Expected HH:MM.`);
    }
    if (startM !== null && endM !== null) {
      if (startM >= endM) {
        reasons.push(`Start time (${raw.startTimeRaw}) must be strictly earlier than end time (${raw.endTimeRaw}).`);
      }
      if (endM - startM < 30) {
        reasons.push(`Abnormally short session duration (${endM - startM} mins). Minimum valid duration is 30 mins.`);
      }
      if (endM - startM > 240) {
        reasons.push(`Abnormally long session duration (${endM - startM} mins). Maximum valid duration is 240 mins.`);
      }
    }

    // 4. Course Identity Validation
    const courseCode = raw.courseCodeRaw?.trim();
    const courseName = raw.courseNameRaw?.trim();
    if (!courseCode || courseCode.length < 3) {
      reasons.push(`Invalid or missing subject course code: "${raw.courseCodeRaw}".`);
    }
    if (!courseName || courseName.length < 2) {
      reasons.push(`Invalid or missing subject course name: "${raw.courseNameRaw}".`);
    }

    // 5. Room Validation
    const room = raw.roomRaw?.trim();
    if (!room || room === 'UNKNOWN' || room === 'TBD') {
      reasons.push('Missing or unverified room designation.');
    }

    // 6. Faculty Validation
    const facultyInitials = raw.facultyInitialsRaw?.trim();
    if (!facultyInitials || facultyInitials.length < 2) {
      reasons.push('Missing or unverifiable faculty initials.');
    }

    // 7. Batch Validation
    const rawBatch = (raw.batchRaw || '').trim().replace(/^B/i, '');
    let validatedBatch: '1' | '2' | '3' | undefined = undefined;
    if (rawBatch && rawBatch !== 'ALL') {
      if (['1', '2', '3'].includes(rawBatch)) {
        validatedBatch = rawBatch as '1' | '2' | '3';
      } else {
        reasons.push(`Unknown batch designation: "${raw.batchRaw}". Expected 1, 2, 3, or ALL.`);
      }
    }

    // 8. Session Type Validation
    const sessionType = (raw.sessionTypeRaw || 'Theory').trim();
    if (!VALID_SESSION_TYPES.has(sessionType)) {
      reasons.push(`Invalid session type: "${raw.sessionTypeRaw}".`);
    }

    // 9. Confidence Score Check (Absolute No-Fabrication Rule)
    if (raw.confidence < 0.85) {
      reasons.push(`Low parsing confidence score (${(raw.confidence * 100).toFixed(1)}%). Manual review required.`);
    }

    // 10. Duplicate Check
    const divSlug = `FY-${branch}-${division}`;
    const signature = `${divSlug}|${weekday}|${startM}|${endM}|${validatedBatch || 'ALL'}|${courseCode}|${room}`;
    if (duplicateSignatureSet.has(signature)) {
      reasons.push('Impossible duplicate timetable session detected in same division & time slot.');
    } else {
      duplicateSignatureSet.add(signature);
    }

    if (reasons.length > 0) {
      rejections.push({
        recordIndex: idx,
        rawRecord: raw,
        reasons,
      });
    } else if (startM !== null && endM !== null && courseCode && courseName && room && facultyInitials) {
      acceptedRecords.push({
        divisionSlug: divSlug,
        weekday,
        startTime: startM,
        endTime: endM,
        subjectCode: courseCode,
        subjectName: courseName,
        sessionType: sessionType as any,
        batch: validatedBatch,
        room,
        facultyInitials,
        facultyName: raw.facultyNameRaw?.trim(),
        facultyId: raw.facultyIdRaw?.trim(),
        confidence: raw.confidence,
      });
    }
  });

  return {
    timestamp: new Date().toISOString(),
    sourceFile: sourceFileName,
    recordsDetected: rawRecords.length,
    recordsAccepted: acceptedRecords.length,
    recordsRejected: rejections.length,
    rejections,
    acceptedRecords,
  };
}
