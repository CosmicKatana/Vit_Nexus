import React, { useEffect } from 'react';
import { TimetableSession, BatchNumber } from '../../types/timetable';
import { getSubjectTheme } from '../../utils/colorUtils';
import { formatTimeRange, formatDateLong, toTimeString, getDurationString } from '../../utils/timeUtils';
import { X, Calendar, Clock, MapPin, User, Layers, BookOpen, Users } from 'lucide-react';

interface ClassDetailModalProps {
  session: TimetableSession | null;
  dateMs?: number;
  allSessions: TimetableSession[];
  onClose: () => void;
  userBatch: BatchNumber;
  divisionSlug: string;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  session,
  dateMs,
  allSessions,
  onClose,
  userBatch,
  divisionSlug,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!session) return null;

  const theme = getSubjectTheme(session.subjectCode);
  const dateObj = dateMs ? new Date(dateMs) : null;
  const duration = session.endTime - session.startTime;

  // Other batches in this exact same time slot
  const otherBatchSessions = allSessions.filter(
    (s) =>
      s.weekday === session.weekday &&
      s.startTime < session.endTime &&
      session.startTime < s.endTime &&
      s.id !== session.id
  );

  // Other sessions for this same subject code throughout the week
  const otherSessionsForCourse = allSessions
    .filter((s) => s.subjectCode === session.subjectCode && s.id !== session.id)
    .sort((a, b) => a.weekday - b.weekday || a.startTime - b.startTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-2xl border bg-slate-900 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: theme.border }}
      >
        {/* Modal Header */}
        <div
          className="p-5 sm:p-6 border-b text-slate-100"
          style={{
            background: `linear-gradient(135deg, ${theme.bgLight} 0%, rgba(15, 23, 42, 0.98) 100%)`,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="font-mono font-bold text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: theme.primary, color: '#030712' }}
                >
                  {session.subjectCode}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {session.sessionType}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-mono text-cyan-300">
                  {session.batch ? `Batch ${session.batch}` : 'Whole Division'}
                </span>
              </div>
              <h2 className="font-['Cabinet_Grotesk'] text-xl sm:text-2xl font-black text-slate-100 leading-snug">
                {session.subjectName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Key Facts Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <Clock className="h-3 w-3 text-cyan-400" />
                <span>TIME & LENGTH</span>
              </div>
              <div className="mt-1 font-mono text-xs font-bold text-slate-200">
                {formatTimeRange(session.startTime, session.endTime)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {getDurationString(duration)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>ROOM LOCATION</span>
              </div>
              <div className="mt-1 font-mono text-sm font-black text-cyan-300">
                {session.room}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Division {divisionSlug}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <Calendar className="h-3 w-3 text-cyan-400" />
                <span>DATE CONTEXT</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-200">
                {dateObj ? formatDateLong(dateObj) : `Weekday ${session.weekday}`}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Academic Year 2026-27
              </div>
            </div>
          </div>

          {/* Faculty Detail */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>Assigned Faculty Member</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-100">
                  {session.facultyName || `Faculty (${session.facultyInitials})`}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Initials: <span className="text-slate-200 font-bold">{session.facultyInitials}</span>
                  {session.facultyId && <span> · ID: {session.facultyId}</span>}
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                Staff Verified
              </span>
            </div>
          </div>

          {/* Other Batches in this time slot */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>Other Batches in this Slot</span>
            </div>

            {session.batch ? (
              otherBatchSessions.length > 0 ? (
                <div className="space-y-2">
                  {otherBatchSessions.map((ob) => (
                    <div
                      key={ob.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-slate-800">
                          {ob.batch ? `Batch ${ob.batch}` : 'ALL'}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-200">{ob.subjectName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {ob.sessionType} · {ob.facultyName || ob.facultyInitials}
                          </p>
                        </div>
                      </div>
                      <div className="font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {ob.room}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 font-mono">
                  Other batches (B1/B2/B3) have free periods during this laboratory slot.
                </p>
              )
            ) : (
              <p className="text-xs text-slate-400 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                This is a whole-division theory lecture; all batches (Batch 1, 2, and 3) attend collectively in Room {session.room}.
              </p>
            )}
          </div>

          {/* Weekly Schedule for this Subject */}
          {otherSessionsForCourse.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                <span>Other Weekly Sessions for {session.subjectCode}</span>
              </div>
              <div className="space-y-1.5">
                {otherSessionsForCourse.map((os) => {
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  return (
                    <div
                      key={os.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 w-10">{dayNames[os.weekday]}</span>
                        <span>{formatTimeRange(os.startTime, os.endTime)}</span>
                        <span className="text-slate-400">({os.sessionType})</span>
                        {os.batch && <span className="text-cyan-400 font-bold">B{os.batch}</span>}
                      </div>
                      <span className="text-slate-400">Room {os.room}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            Division {divisionSlug} · Verified Record
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
