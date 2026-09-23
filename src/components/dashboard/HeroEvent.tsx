import React from 'react';
import { TimelineOccurrence, TimetableSession } from '../../types/timetable';
import { formatTimeRange, formatCountdown, getDurationString } from '../../utils/timeUtils';
import { Clock, MapPin, User, ArrowRight, Sparkles, CheckCircle2, UploadCloud, Zap, Building } from 'lucide-react';

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
  isAdmin?: boolean;
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
  isAdmin = false,
}) => {
  // 1. Holiday State
  if (todaySpecial?.kind === 'holiday' && !currentClass) {
    return (
      <div className="studio-card rounded-3xl p-6 sm:p-8 border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-[#0d0f15]">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-rose-300 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" />
          <span>Academic Recess Scheduled</span>
        </div>

        <h2 className="mt-2 font-['Cabinet_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white">
          {todaySpecial.label}
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Official institutional recess specified in the VIT Academic Calendar. Classes stand suspended.
        </p>

        {nextClass && (
          <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
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

  // 2. Empty Schedule / Upload Prompt State
  if (totalEventsCount === 0) {
    return (
      <div className="studio-card rounded-3xl p-6 sm:p-10 transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-[11px] font-mono tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Division {divisionSlug} · Batch {userBatch}</span>
            </div>

            <h2 className="font-['Cabinet_Grotesk'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ingest Form FF957 Schedule
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Timetable records have been initialized. Upload your official departmental <span className="text-zinc-200 font-semibold">Form FF957</span> timetable PDF or load the verified division template to activate real-time class tracking and batch filtering.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isAdmin && onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-200 shadow-lg transition-all cursor-pointer active:scale-95"
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
              <span>Standard:</span>
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
      <div className="studio-card rounded-3xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2 opacity-90" />
        <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white">
          Daily Schedule Complete
        </h3>
        <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
          No remaining sessions scheduled in the upcoming window for Batch {userBatch}. Check your weekly grid or select another day above.
        </p>
      </div>
    );
  }

  const isLive = Boolean(currentClass);
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

  // Split countdown text into hours, mins, secs for high-precision dial
  const parts = countdownText.split(':');
  const hrs = parts[0] || '00';
  const mins = parts[1] || '00';
  const secs = parts[2] || '00';

  // Circular gauge circumference math (r=48 => circumference ~301.6)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isLive
    ? circumference - (progressPercent / 100) * circumference
    : circumference * 0.25;

  return (
    <div className={`studio-card rounded-3xl p-6 sm:p-8 transition-all duration-300 relative overflow-hidden ${
      isLive ? 'border-emerald-500/30' : ''
    }`}>
      {/* Ambient background light beam */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/[0.02] blur-3xl" />
      {isLive && (
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/[0.04] blur-3xl" />
      )}

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        {/* Left Column: Subject, Timing, Faculty & Room */}
        <div className="flex-1 space-y-4">
          {/* Status Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {isLive ? (
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                SESSION IN PROGRESS
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                UPCOMING SESSION
              </span>
            )}
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium">{target.sessionType}</span>
            {target.batch && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-semibold">Batch {target.batch}</span>
              </>
            )}
          </div>

          {/* Subject Title */}
          <div>
            <h1 className="font-['Cabinet_Grotesk'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {target.subjectName}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2.5 font-mono text-xs text-zinc-400">
              <span className="text-white font-bold bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08]">
                {target.subjectCode}
              </span>
              <span>·</span>
              <span className="text-zinc-200 font-semibold">{formatTimeRange(target.startTime, target.endTime)}</span>
              <span>·</span>
              <span>{getDurationString(durationMin)}</span>
            </div>
          </div>

          {/* Physical Location Flight Plate & Faculty Monogram */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {/* Architectural Door Plate */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/[0.12] bg-gradient-to-b from-white/[0.06] to-white/[0.02] text-white font-mono font-bold shadow-sm">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span className="tracking-wide text-sm">ROOM {target.room}</span>
            </div>

            {/* Faculty Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-300 text-xs">
              <div className="h-5 w-5 rounded-full bg-white/[0.08] flex items-center justify-center font-mono text-[10px] text-white font-bold">
                {target.facultyInitials.slice(0, 2) || 'VIT'}
              </div>
              <span className="font-medium">
                {target.facultyName || `Faculty (${target.facultyInitials})`}
              </span>
            </div>
          </div>

          {/* Progress Bar (If in Progress) */}
          {isLive && (
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                <span>Session Completion</span>
                <span className="text-emerald-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06] border border-white/[0.08]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Circular Chrono Dial Gauge */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 shrink-0 border-t sm:border-t-0 lg:border-l border-white/[0.08] pt-5 sm:pt-0 lg:pl-8">
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background track circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-white/[0.05]"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress dynamic circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={isLive ? '#10b981' : 'rgba(255,255,255,0.7)'}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content of Dial */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                {isLive ? 'REMAINING' : 'STARTS IN'}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight tabular-nums mt-0.5">
                {hrs}:{mins}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
                :{secs}s
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(target, target.date.getTime())}
            className="w-full sm:w-auto glass-button flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer shadow-sm"
          >
            <span>Class Details</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* Lookahead Connector Strip */}
      {afterClass && (
        <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider">UP NEXT:</span>
            <span className="text-zinc-200 font-bold">{afterClass.subjectName}</span>
            <span className="text-zinc-500">({afterClass.subjectCode})</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>{formatTimeRange(afterClass.startTime, afterClass.endTime)}</span>
            <span className="text-emerald-400 font-semibold">Room {afterClass.room}</span>
          </div>
        </div>
      )}
    </div>
  );
};
