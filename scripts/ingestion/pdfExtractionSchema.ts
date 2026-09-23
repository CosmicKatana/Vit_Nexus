/**
 * VIT Nexus — PDF Extraction Schema Specification
 * 
 * Target structured representation for parsed official VIT timetable PDFs
 * (Form FF957 and Academic Calendars).
 */

export interface RawExtractedSessionRecord {
  sourceFile: string;
  sourcePage: number;
  extractedAt: string;
  
  // Academic scope
  program?: string;
  branch?: string;
  division?: string;
  academicYear?: string;
  effectiveFrom?: string;
  effectiveTo?: string;

  // Timetable session fields
  weekdayRaw?: string | number;
  timeSlotRaw?: string;
  startTimeRaw?: string;
  endTimeRaw?: string;
  courseCodeRaw?: string;
  courseNameRaw?: string;
  sessionTypeRaw?: string;
  batchRaw?: string;
  roomRaw?: string;
  facultyInitialsRaw?: string;
  facultyNameRaw?: string;
  facultyIdRaw?: string;
  
  // Extraction confidence score (0.0 to 1.0)
  confidence: number;
  extractionNotes?: string;
}

export interface IngestionValidationRuleResult {
  ruleId: string;
  passed: boolean;
  message: string;
}

export interface ValidatedSessionRecord {
  divisionSlug: string;
  weekday: number; // 1-6
  startTime: number; // minutes from midnight
  endTime: number;   // minutes from midnight
  subjectCode: string;
  subjectName: string;
  sessionType: 'Theory' | 'Lab' | 'Tutorial' | 'Activity' | 'Project';
  batch?: '1' | '2' | '3';
  room: string;
  facultyInitials: string;
  facultyName?: string;
  facultyId?: string;
  confidence: number;
}

export interface IngestionReport {
  timestamp: string;
  sourceFile: string;
  recordsDetected: number;
  recordsAccepted: number;
  recordsRejected: number;
  rejections: {
    recordIndex: number;
    rawRecord: Partial<RawExtractedSessionRecord>;
    reasons: string[];
  }[];
  acceptedRecords: ValidatedSessionRecord[];
}
