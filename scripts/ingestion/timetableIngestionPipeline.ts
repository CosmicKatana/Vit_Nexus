/**
 * Timetable Ingestion Pipeline Script
 * 
 * Executes the ingestion and validation workflow:
 * 1. Takes raw extraction records from PDF extractors
 * 2. Runs strict rule validation (No Fabrication policy)
 * 3. Segregates valid vs rejected records with clear diagnostics
 * 4. Produces insertable database payloads for 'tt_divisions' and 'tt_sessions'
 */

import { RawExtractedSessionRecord, IngestionReport } from './pdfExtractionSchema';
import { validateTimetableRecords } from '../validation/validateTimetableRecords';

export interface IngestionResult {
  report: IngestionReport;
  sqlStatements: string[];
}

export function runIngestionPipeline(
  sourceFile: string,
  rawRecords: RawExtractedSessionRecord[]
): IngestionResult {
  // 1. Enforce strict validation
  const report = validateTimetableRecords(sourceFile, rawRecords);

  // 2. Generate idempotent Supabase SQL statements for accepted records
  const sqlStatements: string[] = [];

  for (const record of report.acceptedRecords) {
    const startStr = `${String(Math.floor(record.startTime / 60)).padStart(2, '0')}:${String(record.startTime % 60).padStart(2, '0')}:00`;
    const endStr = `${String(Math.floor(record.endTime / 60)).padStart(2, '0')}:${String(record.endTime % 60).padStart(2, '0')}:00`;

    const sql = `
INSERT INTO tt_sessions (
  division, weekday, start_time, end_time, subject_code, subject_name,
  session_type, batch, room, faculty_initials, faculty_name, faculty_id
) VALUES (
  '${record.divisionSlug}',
  ${record.weekday},
  '${startStr}',
  '${endStr}',
  '${record.subjectCode.replace(/'/g, "''")}',
  '${record.subjectName.replace(/'/g, "''")}',
  '${record.sessionType}',
  ${record.batch ? `'${record.batch}'` : 'NULL'},
  '${record.room.replace(/'/g, "''")}',
  '${record.facultyInitials.replace(/'/g, "''")}',
  ${record.facultyName ? `'${record.facultyName.replace(/'/g, "''")}'` : 'NULL'},
  ${record.facultyId ? `'${record.facultyId.replace(/'/g, "''")}'` : 'NULL'}
);`.trim();

    sqlStatements.push(sql);
  }

  return {
    report,
    sqlStatements,
  };
}
