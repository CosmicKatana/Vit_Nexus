import React from 'react';
import { TimetableSession, BatchNumber } from '../../types/timetable';
import { getSubjectTheme } from '../../utils/colorUtils';
import { formatTimeRange, toTimeString, getDurationString } from '../../utils/timeUtils';
import { getSpecialDayStatus } from '../../data/academicCalendarData';
import { User, Sparkles, Coffee, MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface DayTimelineProps {
  sessions: TimetableSession[];
  userBatch: BatchNumber;
  date: Date;
  now: Date;
  isToday: boolean;
  onOpenDetails: (session: TimetableSession, dateMs: number) => void;
  timeFormat: '12' | '24';
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  sessions,
  userBatch,
  date,
  now,
  isToday,
  onOpenDetails,
  timeFormat,
}) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;
  const special = getSpecialDayStatus(dateStr);

  // If holiday
  if (special.kind === 'holiday') {
    return (
      <div className="studio-card rounded-2xl p-8 text-center border-rose-500/20 bg-rose-950/10">
        <Sparkles className="mx-auto h-7 w-7 text-rose-400 mb-2.5 opacity-90" />
        <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white">
          Recess: {special.label}
        </h3>
        <p className="mt-1 text-xs text-zinc-400">
          Classes suspended per the official VIT Academic Calendar.
        </p>
      </div>
    );
  }

  // Filter day's sessions for user batch
  const daySessions = sessions
    .filter((s) => s.weekday === date.getDay() && (!s.batch || s.batch === userBatch))
    .sort((a, b) => a.startTime - b.startTime);

  if (daySessions.length === 0) {
    return (
      <div className="studio-card rounded-2xl p-8 text-center">
        <Coffee className="mx-auto h-7 w-7 text-zinc-400 mb-2.5 opacity-80" />
        <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white">
          No Sessions Scheduled
        </h3>
        <p className="mt-1 text-xs text-zinc-400">
          No lectures or practicals configured for Batch {userBatch} on this day.
        </p>
      </div>
    );
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find NEXT session if today
  let nextSessionId: string | number | null = null;
  if (isToday) {
    const upcoming = daySessions.filter((s) => s.startTime > currentMinutes);
    if (upcoming.length > 0) {
      nextSessionId = upcoming[0].id;
    }
  }

  // Timeline items with free intervals
  interface TimelineItem {
    type: 'class' | 'free';
    session?: TimetableSession;
    startTime: number;
    endTime: number;
    duration: number;
  }

  const timelineItems: TimelineItem[] = [];

  for (let i = 0; i < daySessions.length; i++) {
    const curr = daySessions[i];

    // Gap before first class
    if (i === 0 && curr.startTime > 540) {
      const gap = curr.startTime - 540;
      if (gap >= 20) {
        timelineItems.push({
          type: 'free',
          startTime: 540,
          endTime: curr.startTime,
          duration: gap,
        });
      }
    }

    // Gap from previous class
    if (i > 0) {
      const prev = daySessions[i - 1];
      const gap = curr.startTime - prev.endTime;
      if (gap >= 15) {
        timelineItems.push({
          type: 'free',
          startTime: prev.endTime,
          endTime: curr.startTime,
          duration: gap,
        });
      }
    }

    timelineItems.push({
      type: 'class',
      session: curr,
      startTime: curr.startTime,
      endTime: curr.endTime,
      duration: curr.endTime - curr.startTime,
    });
  }

  // Check if laser line has been rendered
  let laserLineRendered = false;

  return (
    <div className="relative pl-3 sm:pl-6 space-y-3.5 before:absolute before:left-0 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.08]">
      {timelineItems.map((item, index) => {
        // Laser line injection logic: If today and current time falls before this item
        const showLaserBeforeThis =
          isToday &&
          !laserLineRendered &&
          currentMinutes < item.startTime;

        if (showLaserBeforeThis) {
          laserLineRendered = true;
        }

        return (
          <React.Fragment key={`group-${index}`}>
            {showLaserBeforeThis && (
              <div className="relative -ml-3 sm:-ml-6 py-2 z-20">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping absolute" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400 relative" />
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-400 font-bold whitespace-nowrap shadow-sm">
                    <span>NOW</span>
                    <span className="text-zinc-500">·</span>
                    <span>{toTimeString(currentMinutes, timeFormat)} IST</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-500/60 via-emerald-500/20 to-transparent" />
                </div>
              </div>
            )}

            {item.type === 'free' ? (
              <div className="relative flex items-center gap-3 py-2 px-4 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.015] text-xs text-zinc-500">
                <div className="w-20 sm:w-24 shrink-0 font-mono text-[11px] text-zinc-400 tabular-nums">
                  {toTimeString(item.startTime, timeFormat)}
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="font-medium text-zinc-300">
                    {item.duration >= 45 ? 'Lunch Recess / Free Period' : 'Transition Break'}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    ({getDurationString(item.duration)})
                  </span>
                </div>
              </div>
            ) : (
              (() => {
                const s = item.session!;
                let state: 'PAST' | 'CURRENT' | 'NEXT' | 'UPCOMING' = 'UPCOMING';
                if (isToday) {
                  if (s.endTime <= currentMinutes) {
                    state = 'PAST';
                  } else if (s.startTime <= currentMinutes && currentMinutes < s.endTime) {
                    state = 'CURRENT';
                  } else if (s.id === nextSessionId) {
                    state = 'NEXT';
                  }
                }

                const isLive = state === 'CURRENT';
                const isPast = state === 'PAST';
                const isNext = state === 'NEXT';
                const isLab = s.sessionType.toUpperCase().includes('LAB') || s.sessionType.toUpperCase().includes('PRAC');

                return (
                  <div
                    onClick={() => onOpenDetails(s, date.getTime())}
                    className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isLive
                        ? 'studio-card-active shadow-[0_0_30px_rgba(16,185,129,0.12)]'
                        : isNext
                        ? 'studio-card border-white/[0.2] bg-white/[0.04]'
                        : isPast
                        ? 'studio-card opacity-50 hover:opacity-90'
                        : 'studio-card studio-card-hover'
                    }`}
                  >
                    {/* Time Column */}
                    <div className="flex sm:flex-col sm:w-28 shrink-0 justify-between sm:justify-center items-start sm:border-r sm:border-white/[0.08] sm:pr-4">
                      <div className="font-mono text-xs font-bold text-white tabular-nums tracking-tight">
                        {formatTimeRange(s.startTime, s.endTime, timeFormat)}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {getDurationString(item.duration)}
                      </div>

                      {isLive && (
                        <span className="mt-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                      {isNext && (
                        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300 font-mono px-1.5 py-0.2 rounded bg-white/[0.06]">
                          NEXT
                        </span>
                      )}
                    </div>

                    {/* Middle: Subject, Type & Faculty */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-mono text-[11px] font-bold text-white bg-white/[0.06] px-1.5 py-0.2 rounded border border-white/[0.08]">
                          {s.subjectCode}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className={`font-mono text-[11px] font-semibold ${
                          isLab ? 'text-emerald-400' : 'text-zinc-300'
                        }`}>
                          {s.sessionType}
                        </span>
                        {s.batch && (
                          <>
                            <span className="text-zinc-600">·</span>
                            <span className="font-mono text-[11px] text-zinc-400">
                              B{s.batch}
                            </span>
                          </>
                        )}
                      </div>

                      <h4 className="font-['Cabinet_Grotesk'] text-base sm:text-lg font-extrabold text-white group-hover:text-zinc-200 transition-colors truncate">
                        {s.subjectName}
                      </h4>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                        <User className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="truncate">
                          {s.facultyName || `Faculty (${s.facultyInitials})`}
                        </span>
                      </div>
                    </div>

                    {/* Right: Room Door Tag */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center p-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-center shrink-0 group-hover:border-white/[0.2] transition-colors">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">ROOM</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                        {s.room}
                      </span>
                    </div>
                  </div>
                );
              })()
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
