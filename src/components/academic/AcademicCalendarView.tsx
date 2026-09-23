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
      <div className="studio-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Calendar className="h-4 w-4" />
            <span>VIT Official Academic Schedule</span>
          </div>
          <h2 className="mt-1 font-['Cabinet_Grotesk'] text-xl sm:text-2xl font-black text-white">
            First Year Academic Calendar 2026–27
          </h2>
          <p className="mt-1 text-xs text-zinc-400 max-w-xl leading-relaxed">
            Sourced and verified from the official Vishwakarma Institute of Technology Dean of Academics circular. All dates strictly adhere to the academic council schedule.
          </p>
        </div>

        <a
          href={OFFICIAL_CALENDAR_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-lg whitespace-nowrap cursor-pointer active:scale-95"
        >
          <span>Official Circular PDF</span>
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
              className="studio-card p-5 rounded-2xl border-amber-500/20 bg-amber-950/10 relative overflow-hidden"
            >
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {window.type.replace('_', ' ')}
              </span>

              <h3 className="mt-2.5 font-['Cabinet_Grotesk'] text-base font-bold text-white">
                {window.label}
              </h3>

              <div className="mt-3.5 pt-3 border-t border-white/[0.08] text-xs font-mono text-amber-300 flex items-center justify-between">
                <span>{formatDateLong(window.from)}</span>
                <span className="text-zinc-500">→</span>
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
              className="studio-card flex items-center justify-between p-3.5 rounded-2xl"
            >
              <div>
                <p className="font-bold text-xs sm:text-sm text-white">{h.name}</p>
                <p className="text-[11px] font-mono text-rose-400 mt-0.5">
                  {formatDateLong(h.date)}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Recess
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day Order Notice */}
      <div className="studio-card p-4 sm:p-5 rounded-2xl text-xs text-zinc-400 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-zinc-200 font-mono">
            Day Order & Schedule Invariant Policy
          </p>
          <p className="leading-relaxed">
            When VIT announces compensatory working days (such as Saturday following a Monday schedule), VIT Nexus dynamically maps the target day-order without guessing or fabricating lectures.
          </p>
        </div>
      </div>
    </div>
  );
};
