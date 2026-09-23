import React, { useState } from 'react';
import { TimetableSession, BatchNumber } from '../../types/timetable';
import { getSubjectTheme } from '../../utils/colorUtils';
import { toTimeString, formatTimeRange, WEEKDAY_NAMES, getDurationString } from '../../utils/timeUtils';
import { Sparkles, Calendar, BookOpen, Clock, Layers } from 'lucide-react';

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
    const typeUpper = s.sessionType.toUpperCase();
    if (typeUpper.includes('THEORY') || typeUpper.includes('LEC')) theoryMins += dur;
    else if (typeUpper.includes('LAB') || typeUpper.includes('PRAC')) labMins += dur;
    else tutorialMins += dur;
  });

  const hours = [9, 10, 11, 12, 13, 14, 15, 16];

  if (sessions.length === 0) {
    return (
      <div className="studio-card rounded-3xl p-12 text-center">
        <Calendar className="mx-auto h-8 w-8 text-zinc-400 mb-3 opacity-80" />
        <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white">
          No Timetable Events Loaded
        </h3>
        <p className="mt-1.5 text-xs text-zinc-400 max-w-sm mx-auto">
          All timetable sessions have been initialized. Upload your official Form FF957 timetable PDF or load template data to populate your weekly matrix.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weekly Stats Bar */}
      <div className="studio-card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span className="font-['Cabinet_Grotesk'] text-base font-extrabold text-white">
            Weekly Schedule Matrix
          </span>
          <span className="text-xs font-mono text-white font-bold px-2 py-0.5 rounded-lg bg-white/[0.08] border border-white/[0.1]">
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
            <span className="font-bold text-emerald-400">{Math.round((labMins / 60) * 10) / 10}h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span className="text-zinc-400">Tutorials:</span>
            <span className="font-bold text-indigo-300">{Math.round((tutorialMins / 60) * 10) / 10}h</span>
          </div>
        </div>
      </div>

      {/* Desktop Weekly Multi-Column View */}
      <div className="hidden md:block overflow-x-auto studio-card rounded-3xl p-5">
        <div className="min-w-[840px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2.5 pb-3 border-b border-white/[0.08] text-xs font-mono">
            <div className="text-center font-bold text-zinc-500 py-1 uppercase tracking-wider">Time</div>
            {weekDays.map((day) => {
              const isToday = now.getDay() === day;
              return (
                <div
                  key={day}
                  className={`text-center py-2 px-2 rounded-xl font-bold transition-colors ${
                    isToday
                      ? 'bg-white text-zinc-950 font-black shadow-md'
                      : 'text-zinc-300 bg-white/[0.02] border border-white/[0.04]'
                  }`}
                >
                  {WEEKDAY_NAMES[day]}
                </div>
              );
            })}
          </div>

          {/* Time Gutter and Day Columns */}
          <div className="grid grid-cols-7 gap-2.5 pt-3">
            {/* Time markers column */}
            <div className="space-y-4 pt-1">
              {hours.map((h) => (
                <div
                  key={h}
                  className="h-20 border-t border-white/[0.06] text-right pr-2 font-mono text-[11px] text-zinc-500 tabular-nums"
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
                  className={`space-y-2 rounded-2xl p-2 min-h-[580px] transition-colors ${
                    isToday 
                      ? 'bg-emerald-500/[0.04] border border-emerald-500/20' 
                      : 'bg-white/[0.015] border border-white/[0.03]'
                  }`}
                >
                  {dayClasses.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4">
                      <span className="text-[11px] text-zinc-500 font-mono">Free Day</span>
                    </div>
                  ) : (
                    dayClasses.map((s) => {
                      const isLab = s.sessionType.toUpperCase().includes('LAB') || s.sessionType.toUpperCase().includes('PRAC');
                      return (
                        <div
                          key={s.id}
                          onClick={() => onOpenDetails(s, now.getTime())}
                          className="group relative p-2.5 rounded-xl border border-white/[0.08] bg-[#11131a] hover:border-white/[0.2] hover:bg-[#141722] text-left cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                            <span className="tabular-nums font-bold text-zinc-200">
                              {formatTimeRange(s.startTime, s.endTime, timeFormat)}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.08] font-bold text-white">
                              {s.room}
                            </span>
                          </div>

                          <div className="font-['Cabinet_Grotesk'] text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-tight">
                            {s.subjectName}
                          </div>

                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span className={`font-mono font-semibold ${isLab ? 'text-emerald-400' : 'text-zinc-400'}`}>
                              {s.subjectCode}
                            </span>
                            <span className="truncate max-w-[65px] font-mono text-zinc-500">
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

      {/* Mobile Weekly View */}
      <div className="block md:hidden space-y-3">
        {/* Day selection tabs */}
        <div className="flex gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] no-scrollbar">
          {weekDays.map((day) => {
            const isSelected = selectedMobileDay === day;
            const isToday = now.getDay() === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedMobileDay(day)}
                className={`flex-1 min-w-[50px] py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-zinc-950 shadow-md font-black'
                    : isToday
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
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
              const isLab = s.sessionType.toUpperCase().includes('LAB') || s.sessionType.toUpperCase().includes('PRAC');
              return (
                <div
                  key={s.id}
                  onClick={() => onOpenDetails(s, now.getTime())}
                  className="studio-card flex items-center justify-between p-3.5 rounded-2xl cursor-pointer"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono mb-1">
                      <span className="font-bold text-white">
                        {formatTimeRange(s.startTime, s.endTime, timeFormat)}
                      </span>
                      <span>·</span>
                      <span className={`font-semibold ${isLab ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {s.subjectCode}
                      </span>
                      {s.batch && <span>· B{s.batch}</span>}
                    </div>

                    <h4 className="font-['Cabinet_Grotesk'] font-bold text-sm text-white truncate">
                      {s.subjectName}
                    </h4>

                    <p className="text-xs text-zinc-400 mt-0.5">
                      {s.facultyName || `Faculty (${s.facultyInitials})`}
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] font-mono text-xs font-bold text-white shrink-0 text-center">
                    ROOM {s.room}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
