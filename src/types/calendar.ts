/**
 * Calendar Integration Interface
 * 
 * ARCHITECTURAL SPECIFICATION:
 * Google Calendar / External Calendar sync interface.
 * Designed to cleanly decouple calendar synchronization from the core timetable engine.
 * No OAuth or client secrets are required at this stage.
 */

export interface CalendarEventPayload {
  id?: string;
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  colorId?: string;
  recurrenceRule?: string; // e.g. 'RRULE:FREQ=WEEKLY;BYDAY=MO'
  metadata?: {
    courseCode: string;
    sessionType: string;
    batch?: string;
    faculty: string;
    division: string;
  };
}

export interface ExternalCalendarInfo {
  id: string;
  name: string;
  primary: boolean;
  accessRole: 'owner' | 'writer' | 'reader';
  colorHex?: string;
}

export interface CalendarSyncResult {
  totalRequested: number;
  synced: number;
  skippedDuplicates: number;
  failed: number;
  errors?: string[];
}

export interface CalendarProvider {
  readonly providerName: string;
  isConnected(): boolean;
  
  /** Connects / requests authentication (will use OAuth in future implementation) */
  connect(): Promise<{ success: boolean; userEmail?: string; error?: string }>;
  
  /** Disconnects the calendar provider and clears stored tokens */
  disconnect(): Promise<void>;
  
  /** Retrieves available calendars for the connected user */
  getCalendars(): Promise<ExternalCalendarInfo[]>;
  
  /** Creates a single academic event */
  createEvent(calendarId: string, event: CalendarEventPayload): Promise<{ success: boolean; eventId?: string; error?: string }>;
  
  /** Creates multiple events in batch with duplicate avoidance */
  createEvents(calendarId: string, events: CalendarEventPayload[]): Promise<CalendarSyncResult>;
  
  /** Checks if a matching timetable event already exists in the given calendar */
  checkDuplicate(calendarId: string, event: CalendarEventPayload): Promise<boolean>;
}
