import React, { useState } from 'react';
import { TimetableSession, BatchNumber } from '../../types/timetable';
import { getSubjectTheme } from '../../utils/colorUtils';
import { toTimeString, formatTimeRange, WEEKDAY_NAMES, getDurationString } from '../../utils/timeUtils';
import { getSpecialDayStatus } from '../../data/academicCalendarData';
import { Sparkles, Calendar, BookOpen, Clock } from 'lucide-react';

interface WeekGridProps {
  sessions: TimetableSession[];
  userBatch: BatchNumber;
  now: Date;
  onOpenDetails: (session: TimetableSession, dateMs: number) => void;
  timeFormat: '12' | '24';
}

export const WeekGrid: React.FC<WeekGridProps> = ({
  sessions,
  userBatch,
  now,
  onOpenDetails,
  timeFormat,
}) => {
  const [selectedMobileDay, setSelectedMobileDay] = useState<number>(() => {
    const current = now.getDay();
    return current >= 1 && current <= 6 ? current : 1;
  });

  const weekDays = [1, 2, 3, 4, 5, 6]; // Monday to Saturday

  // Calculate week hour metrics
  const weekSessions = sessions.filter(
    (s) => weekDays.includes(s.weekday) && (!s.batch || s.batch === userBatch)
  );

  let theoryMins = 0;
  let labMins = 0;
  let tutorialMins = 0;

  weekSessions.forEach((s) => {
    const dur = s.endTime - s.startTime;
    if (s.sessionType === 'Theory') theoryMins += dur;
    else if (s.sessionType === 'Lab') labMins += dur;
    else if (s.sessionType === 'Tutorial') tutorialMins += dur;
  });

  // Calculate earliest and latest hour in the week
  const startHour = 9; // 09:00
  const endHour = 17;  // 17:00
  const hours = [9, 10, 11, 12, 13, 14, 15, 16];

  if (sessions.length === 0) {
    return (
      <div className="glass-surface rounded-2xl sm:rounded-3xl p-12 text-center backdrop-blur-xl">
        <Calendar className="mx-auto h-8 w-8 text-zinc-400 mb-3 opacity-80" />
        <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white">
          No Timetable Events Loaded
        </h3>
        <p className="mt-1.5 text-xs text-zinc-400 max-w-sm mx-auto">
          All seed events have been reset. Upload your official Form FF957 timetable PDF to populate your weekly matrix.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weekly Stats Bar */}
      <div className="glass-surface flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-400" />
          <span className="font-['Cabinet_Grotesk'] text-sm font-bold text-white">
            Weekly Schedule Matrix
          </span>
          <span className="text-xs font-mono text-zinc-300 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            Batch {userBatch}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="text-zinc-400">Theory:</span>
            <span className="font-bold text-zinc-200">{Math.round((theoryMins / 60) * 10) / 10}h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">Labs:</span>
            <span className="font-bold text-zinc-200">{Math.round((labMins / 60) * 10) / 10}h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span className="text-zinc-400">Tutorials:</span>
            <span className="font-bold text-zinc-200">{Math.round((tutorialMins / 60) * 10) / 10}h</span>
          </div>
        </div>
      </div>

      {/* Desktop Weekly Multi-Column View */}
      <div className="hidden md:block overflow-x-auto glass-surface rounded-2xl sm:rounded-3xl p-4 backdrop-blur-xl">
        <div className="min-w-[780px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 pb-3 border-b border-white/[0.06] text-xs font-mono">
            <div className="text-center font-semibold text-zinc-500 py-1 uppercase">Time</div>
            {weekDays.map((day) => {
              const isToday = now.getDay() === day;
              return (
                <div
                  key={day}
                  className={`text-center py-1.5 px-2 rounded-lg font-semibold transition-colors ${
                    isToday
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'text-zinc-400'
                  }`}
                >
                  {WEEKDAY_NAMES[day]}
                </div>
              );
            })}
          </div>

          {/* Time Gutter and Day Columns */}
          <div className="grid grid-cols-7 gap-2 pt-3">
            {/* Time markers column */}
            <div className="space-y-4 pt-1">
              {hours.map((h) => (
                <div
                  key={h}
                  className="h-20 border-t border-slate-800/80 text-right pr-2 font-mono text-[11px] text-slate-400 tabular-nums"
                >
                  {toTimeString(h * 60, timeFormat)}
                </div>
              ))}
            </div>

            {/* Daily Class Columns */}
            {weekDays.map((day) => {
              const isToday = now.getDay() === day;
              const dayClasses = sessions
                .filter((s) => s.weekday === day && (!s.batch || s.batch === userBatch))
                .sort((a, b) => a.startTime - b.startTime);

              return (
                <div
                  key={day}
                  className={`space-y-2 rounded-xl p-1.5 min-h-[580px] transition-colors ${
                    isToday ? 'bg-cyan-950/15 border border-cyan-500/20' : 'bg-slate-900/20'
                  }`}
                >
                  {dayClasses.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4">
                      <span className="text-[11px] text-slate-400 font-mono">No Classes</span>
                    </div>
                  ) : (
                    dayClasses.map((s) => {
                      const theme = getSubjectTheme(s.subjectCode);
                      return (
                        <div
                          key={s.id}
                          onClick={() => onOpenDetails(s, now.getTime())}
                          className="group relative p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            borderColor: theme.border,
                            borderLeftWidth: '3px',
                            borderLeftColor: theme.primary,
                          }}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                            <span className="tabular-nums font-semibold text-slate-300">
                              {formatTimeRange(s.startTime, s.endTime, '24')}
                            </span>
                            <span className="px-1 rounded bg-slate-800 text-slate-200">
                              {s.room}
                            </span>
                          </div>

                          <div className="font-['Cabinet_Grotesk'] text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {s.subjectName}
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-mono text-cyan-400 font-medium">
                              {s.subjectCode}
                            </span>
                            <span className="truncate max-w-[65px] font-mono text-slate-400">
                              {s.facultyInitials}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Weekly View (Compact Day Switcher + Cards) */}
      <div className="block md:hidden space-y-3">
        {/* Day selection tabs */}
        <div className="flex gap-1.5 overflow-x-auto p-1 rounded-xl bg-slate-900 border border-slate-800 no-scrollbar">
          {weekDays.map((day) => {
            const isSelected = selectedMobileDay === day;
            const isToday = now.getDay() === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedMobileDay(day)}
                className={`flex-1 min-w-[50px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : isToday
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {WEEKDAY_NAMES[day].slice(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Selected day's session list */}
        <div className="space-y-2">
          {sessions
            .filter((s) => s.weekday === selectedMobileDay && (!s.batch || s.batch === userBatch))
            .sort((a, b) => a.startTime - b.startTime)
            .map((s) => {
              const theme = getSubjectTheme(s.subjectCode);
              return (
                <div
                  key={s.id}
                  onClick={() => onOpenDetails(s, now.getTime())}
                  className="flex items-center justify-between p-3.5 rounded-xl border bg-slate-900/80 cursor-pointer"
                  style={{
                    borderColor: theme.border,
                    borderLeftWidth: '4px',
                    borderLeftColor: theme.primary,
                  }}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5">
                      <span className="font-bold text-slate-300">
                        {formatTimeRange(s.startTime, s.endTime, timeFormat)}
                      </span>
                      <span>·</span>
                      <span className="text-cyan-400 font-semibold">{s.subjectCode}</span>
                      {s.batch && <span>· Batch {s.batch}</span>}
                    </div>

                    <h4 className="font-bold text-sm text-slate-100 truncate">
                      {s.subjectName}
                    </h4>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {s.facultyName || `Faculty ${s.facultyInitials}`}
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-slate-200 shrink-0 text-center">
                    {s.room}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
