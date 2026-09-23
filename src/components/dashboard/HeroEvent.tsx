import React from 'react';
import { TimelineOccurrence, TimetableSession } from '../../types/timetable';
import { getSubjectTheme } from '../../utils/colorUtils';
import { formatTimeRange, formatCountdown, getDurationString } from '../../utils/timeUtils';
import { Clock, MapPin, User, ArrowRight, Sparkles, CheckCircle2, UploadCloud, Zap, FileText } from 'lucide-react';

interface HeroEventProps {
  currentClass: TimelineOccurrence | null;
  nextClass: TimelineOccurrence | null;
  afterClass?: TimelineOccurrence | null;
  todaySpecial?: { kind: 'holiday' | 'exam' | null; label: string | null };
  now: Date;
  onOpenDetails: (session: TimetableSession, dateMs: number) => void;
  userBatch: string;
  totalEventsCount?: number;
  onOpenUpload?: () => void;
  onLoadDemoEvents?: () => void;
  divisionSlug?: string;
}

export const HeroEvent: React.FC<HeroEventProps> = ({
  currentClass,
  nextClass,
  afterClass,
  todaySpecial,
  now,
  onOpenDetails,
  userBatch,
  totalEventsCount = 0,
  onOpenUpload,
  onLoadDemoEvents,
  divisionSlug = 'FY-CSAI-B',
}) => {
  // 1. Holiday State
  if (todaySpecial?.kind === 'holiday' && !currentClass) {
    return (
      <div className="glass-surface rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-rose-500/20 bg-rose-950/10 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-rose-300 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" />
          <span>Academic Recess</span>
        </div>

        <h2 className="mt-2 font-['Cabinet_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white">
          {todaySpecial.label}
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Official institutional recess specified in the VIT Academic Calendar.
        </p>

        {nextClass && (
          <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <div className="text-xs text-zinc-400">
              Next scheduled session:{' '}
              <span className="font-semibold text-zinc-200">
                {nextClass.subjectName} ({nextClass.dateString})
              </span>
            </div>
            <button
              onClick={() => onOpenDetails(nextClass, nextClass.date.getTime())}
              className="flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
            >
              <span>View Details</span> <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. Empty Schedule / Awaiting PDF Upload State
  if (totalEventsCount === 0) {
    return (
      <div className="glass-surface rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-white/[0.08] backdrop-blur-2xl transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-[11px] font-mono tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Division {divisionSlug} · Batch {userBatch}</span>
            </div>

            <h2 className="font-['Cabinet_Grotesk'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Upload Timetable PDF
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              All seed events have been reset. Upload your official departmental <span className="text-zinc-200 font-medium">Form FF957</span> timetable PDF to initialize real-time session tracking, batch filters, and classroom routing.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-medium text-xs sm:text-sm hover:bg-zinc-200 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Timetable PDF</span>
                </button>
              )}

              {onLoadDemoEvents && (
                <button
                  onClick={onLoadDemoEvents}
                  className="glass-button flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 transition-all cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Load Division Template</span>
                </button>
              )}
            </div>
          </div>

          {/* Minimalist Glass Summary Card */}
          <div className="shrink-0 w-full lg:w-72 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-2.5">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06]">
              Verified Parameters
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Division:</span>
              <span className="text-zinc-200 font-semibold">{divisionSlug}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Selected Batch:</span>
              <span className="text-zinc-200 font-semibold">Batch {userBatch}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Institution:</span>
              <span className="text-zinc-200 font-semibold">VIT Pune</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Format:</span>
              <span className="text-emerald-400 font-semibold">Form FF957</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Timetable State (Live Class or Next Class)
  const target = currentClass || nextClass;

  if (!target) {
    return (
      <div className="glass-surface rounded-2xl sm:rounded-3xl p-8 text-center backdrop-blur-2xl">
        <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400 mb-2 opacity-90" />
        <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white">
          All Sessions Complete
        </h3>
        <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
          No remaining sessions scheduled in the upcoming window for Batch {userBatch}. Check your weekly grid for subsequent days.
        </p>
      </div>
    );
  }

  const isLive = Boolean(currentClass);
  const theme = getSubjectTheme(target.subjectCode);

  const startMs = target.startDate.getTime();
  const endMs = target.endDate.getTime();
  const nowMs = now.getTime();

  let countdownText = '00:00:00';
  let progressPercent = 0;

  if (isLive) {
    const remainingMs = Math.max(0, endMs - nowMs);
    countdownText = formatCountdown(remainingMs);
    const totalDuration = endMs - startMs;
    const elapsed = nowMs - startMs;
    progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  } else {
    const untilMs = Math.max(0, startMs - nowMs);
    countdownText = formatCountdown(untilMs);
  }

  const durationMin = target.endTime - target.startTime;

  return (
    <div className="glass-surface glass-surface-hover rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Subject, Faculty, Room */}
        <div className="flex-1 space-y-3.5">
          {/* Status Kicker with unboxed typographic separators */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {isLive ? (
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                Upcoming Session
              </span>
            )}
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">{target.sessionType}</span>
            {target.batch && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300">Batch {target.batch}</span>
              </>
            )}
          </div>

          {/* Subject Title */}
          <div>
            <h1 className="font-['Cabinet_Grotesk'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {target.subjectName}
            </h1>
            <div className="mt-1 flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="text-zinc-200 font-semibold">{target.subjectCode}</span>
              <span>·</span>
              <span>{formatTimeRange(target.startTime, target.endTime)}</span>
              <span>·</span>
              <span>{getDurationString(durationMin)}</span>
            </div>
          </div>

          {/* Metadata Row: Room & Faculty */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {/* Minimalist Glass Door Plate */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white font-mono font-medium shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <span>Room {target.room}</span>
            </div>

            {/* Faculty */}
            <div className="flex items-center gap-1.5 text-zinc-400">
              <User className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-zinc-300">{target.facultyName || `Faculty (${target.facultyInitials})`}</span>
            </div>
          </div>

          {/* Progress bar if class is currently in progress */}
          {isLive && (
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>Progress</span>
                <span className="text-emerald-400 font-semibold">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05] border border-white/[0.08]">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Refined Minimal Timer */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end justify-between lg:justify-center gap-4 shrink-0 border-t sm:border-t-0 lg:border-l border-white/[0.08] pt-4 sm:pt-0 lg:pl-8">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
              {isLive ? 'Time Remaining' : 'Starts In'}
            </span>
            <div className="font-mono text-3xl sm:text-5xl font-light text-white tabular-nums tracking-tight">
              {countdownText}
            </div>
            <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">
              HH : MM : SS
            </span>
          </div>

          <button
            onClick={() => onOpenDetails(target, target.date.getTime())}
            className="glass-button flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
          >
            <span>Session Details</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* Lookahead Strip */}
      {afterClass && (
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium uppercase text-[10px] tracking-wider">Next:</span>
            <span className="text-zinc-200 font-medium">{afterClass.subjectName}</span>
            <span className="text-zinc-500">({afterClass.subjectCode})</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>{formatTimeRange(afterClass.startTime, afterClass.endTime)}</span>
            <span className="text-zinc-200">Room {afterClass.room}</span>
          </div>
        </div>
      )}
    </div>
  );
};
