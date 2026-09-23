import { CalendarProvider, CalendarEventPayload, ExternalCalendarInfo, CalendarSyncResult } from '../../types/calendar';

/**
 * Placeholder / Architecture implementation for Future Google Calendar sync.
 * Does not make live OAuth calls yet, but provides a fully typed and functional contract.
 */
export class DeferredGoogleCalendarProvider implements CalendarProvider {
  readonly providerName = 'Google Calendar (Planned Sync)';
  private connected = false;
  private userEmail: string | null = null;

  isConnected(): boolean {
    return this.connected;
  }

  async connect(): Promise<{ success: boolean; userEmail?: string; error?: string }> {
    // When enabled in a future release, this will trigger the standard Google OAuth client flow
    return {
      success: false,
      error: 'Google Calendar integration is scheduled for an upcoming release. Core timetable functionality is available offline and live.'
    };
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.userEmail = null;
  }

  async getCalendars(): Promise<ExternalCalendarInfo[]> {
    if (!this.connected) return [];
    return [
      {
        id: 'primary',
        name: 'VIT Academic Schedule',
        primary: true,
        accessRole: 'owner',
        colorHex: '#06b6d4'
      }
    ];
  }

  async createEvent(_calendarId: string, _event: CalendarEventPayload): Promise<{ success: boolean; eventId?: string; error?: string }> {
    return {
      success: false,
      error: 'Calendar provider not connected.'
    };
  }

  async createEvents(_calendarId: string, events: CalendarEventPayload[]): Promise<CalendarSyncResult> {
    return {
      totalRequested: events.length,
      synced: 0,
      skippedDuplicates: 0,
      failed: events.length,
      errors: ['Calendar integration pending OAuth authorization.']
    };
  }

  async checkDuplicate(_calendarId: string, _event: CalendarEventPayload): Promise<boolean> {
    return false;
  }
}

export const defaultCalendarProvider = new DeferredGoogleCalendarProvider();
