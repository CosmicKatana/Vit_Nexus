import React from 'react';
import {
  VERIFIED_HOLIDAYS,
  VERIFIED_EXAM_WINDOWS,
  OFFICIAL_CALENDAR_PDF_URL,
  DAY_ORDER_OVERRIDES,
} from '../../data/academicCalendarData';
import { formatDateLong } from '../../utils/timeUtils';
import { Calendar, FileText, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

export const AcademicCalendarView: React.FC = () => {
  const holidaysList = Object.entries(VERIFIED_HOLIDAYS).map(([date, name]) => ({
    date,
    name,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-slate-950 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Calendar className="h-4 w-4" />
            <span>VIT Official Academic Schedule</span>
          </div>
          <h2 className="mt-1 font-['Cabinet_Grotesk'] text-xl sm:text-2xl font-black text-slate-100">
            First Year Academic Calendar 2026–27
          </h2>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            Sourced and verified from the official Vishwakarma Institute of Technology Dean of Academics circular. All dates strictly adhere to the academic council schedule.
          </p>
        </div>

        <a
          href={OFFICIAL_CALENDAR_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 whitespace-nowrap cursor-pointer"
        >
          <span>Official PDF</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Examination Windows Grid */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 font-mono">
          <FileText className="h-4 w-4" />
          <span>Examination & Assessment Windows</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VERIFIED_EXAM_WINDOWS.map((window) => (
            <div
              key={window.label}
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/15 backdrop-blur-md relative overflow-hidden"
            >
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {window.type.replace('_', ' ')}
              </span>

              <h3 className="mt-2 font-['Cabinet_Grotesk'] text-base font-bold text-slate-100">
                {window.label}
              </h3>

              <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs font-mono text-amber-300 flex items-center justify-between">
                <span>{formatDateLong(window.from)}</span>
                <span className="text-slate-400">→</span>
                <span>{formatDateLong(window.to)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Official Holidays List */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-400 mb-3 font-mono">
          <Sparkles className="h-4 w-4" />
          <span>Verified Academic Holidays (Semester I & II)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {holidaysList.map((h) => (
            <div
              key={h.date}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
            >
              <div>
                <p className="font-semibold text-xs sm:text-sm text-slate-200">{h.name}</p>
                <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                  {formatDateLong(h.date)}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800">
                Holiday
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day Order Notice & Invariant Policy */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-400 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">
            Day Order & Schedule Invariant Policy
          </p>
          <p>
            When VIT announces compensatory working days (such as Saturday following a Monday schedule), VIT Nexus dynamically maps the target day-order without guessing or fabricating lectures.
          </p>
        </div>
      </div>
    </div>
  );
};
