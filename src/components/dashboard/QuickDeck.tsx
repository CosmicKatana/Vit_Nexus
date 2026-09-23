import React from 'react';
import { UserAcademicConfig, TimetableSession, BatchNumber } from '../../types/timetable';
import { BRANCHES } from '../../data/programsAndBranches';
import { VERIFIED_EXAM_WINDOWS, VERIFIED_HOLIDAYS } from '../../data/academicCalendarData';
import { MapPin, Calendar, Clock, SlidersHorizontal, ChevronRight, Sparkles, Building } from 'lucide-react';

interface QuickDeckProps {
  config: UserAcademicConfig;
  userBatch: BatchNumber;
  onChangeBatch: (batch: BatchNumber) => void;
  todaySessions: TimetableSession[];
  onOpenIdentityPicker: () => void;
  onOpenUpload?: () => void;
  onOpenCalendar: () => void;
  currentDate: Date;
}

export const QuickDeck: React.FC<QuickDeckProps> = ({
  config,
  userBatch,
  onChangeBatch,
  todaySessions,
  onOpenIdentityPicker,
  onOpenUpload,
  onOpenCalendar,
  currentDate,
}) => {
  const branchInfo = BRANCHES[config.branch];
  const branchLabel = branchInfo ? branchInfo.shortLabel : config.branch;

  // Calculate day metrics
  const totalMinutes = todaySessions.reduce((acc, s) => acc + (s.endTime - s.startTime), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const labCount = todaySessions.filter((s) => s.sessionType.toUpperCase().includes('LAB') || s.sessionType.toUpperCase().includes('PRAC')).length;
  const theoryCount = todaySessions.length - labCount;

  // Find next upcoming milestone in Academic Calendar
  const todayIso = currentDate.toISOString().split('T')[0];
  const nextExam = VERIFIED_EXAM_WINDOWS
    .filter((w) => w.from >= todayIso)
    .sort((a, b) => a.from.localeCompare(b.from))[0];

  let daysUntilMilestone: number | null = null;
  if (nextExam) {
    const targetDate = new Date(nextExam.from);
    const diffTime = targetDate.getTime() - currentDate.getTime();
    daysUntilMilestone = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const batchList: BatchNumber[] = ['1', '2', '3', '4'];

  return (
    <div className="space-y-4">
      {/* Widget 1: Instant 1-Tap Batch Switcher */}
      <div className="studio-card rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Active Batch Filter</span>
          </div>
          <button
            onClick={onOpenIdentityPicker}
            className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Div {config.division} →
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {batchList.map((b) => {
            const isActive = userBatch === b;
            return (
              <button
                key={b}
                onClick={() => onChangeBatch(b)}
                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-md scale-[1.03]'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                B{b}
              </button>
            );
          })}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>{branchLabel} · Div {config.division}</span>
          <span className="text-zinc-400">1-tap batch switch</span>
        </div>
      </div>

      {/* Widget 2: Today's Academic Load Breakdown */}
      <div className="studio-card rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
          <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Day Load Analysis
          </span>
          <span className="font-mono text-xs text-emerald-400 font-bold">
            {totalHours} hrs scheduled
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="block text-lg font-bold text-white">{todaySessions.length}</span>
            <span className="text-[10px] text-zinc-500 uppercase">Sessions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="block text-lg font-bold text-zinc-200">{theoryCount}</span>
            <span className="text-[10px] text-zinc-500 uppercase">Theory</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="block text-lg font-bold text-emerald-400">{labCount}</span>
            <span className="text-[10px] text-zinc-500 uppercase">Lab/Prac</span>
          </div>
        </div>
      </div>

      {/* Widget 3: Academic Milestone Radar */}
      {nextExam && (
        <div 
          onClick={onOpenCalendar}
          className="studio-card studio-card-hover rounded-2xl p-4 sm:p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              <Calendar className="h-3 w-3" />
              <span>Upcoming Assessment</span>
            </div>
            {daysUntilMilestone !== null && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-medium">
                in {daysUntilMilestone} days
              </span>
            )}
          </div>

          <h4 className="font-['Cabinet_Grotesk'] text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
            {nextExam.label}
          </h4>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {nextExam.from} · Official Academic Calendar
          </p>
        </div>
      )}

      {/* Widget 4: VIT Campus Building & Room Locator */}
      <div className="studio-card rounded-2xl p-4 sm:p-5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-200 mb-2.5">
          <Building className="h-3.5 w-3.5 text-zinc-400" />
          <span>Campus Room Key</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px] text-zinc-400">
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-zinc-300 font-medium">Room 5xxx:</span>
            <span>Bldg 5 · Computer & AI Wing</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/[0.04]">
            <span className="text-zinc-300 font-medium">Room 1xxx / 2xxx:</span>
            <span>Bldg 1 & 2 · Central Classrooms</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-zinc-300 font-medium">Room 3xxx / 4xxx:</span>
            <span>Bldg 3 & 4 · Labs & Workshops</span>
          </div>
        </div>
      </div>
    </div>
  );
};

