import React from 'react';
import { ArrowRight, ShieldCheck, Clock, CalendarDays } from 'lucide-react';

interface LandingHeroProps {
  onInitialize: () => void;
  onExploreDefault: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onInitialize,
  onExploreDefault,
}) => {
  return (
    <div className="glass-surface rounded-3xl p-8 sm:p-14 backdrop-blur-2xl relative overflow-hidden transition-all">
      {/* Subtle ambient light gradient */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/[0.03] blur-3xl" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        <div className="flex-1 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-mono tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>VIT Pune · Academic Timetable Platform</span>
          </div>

          <h1 className="font-['Cabinet_Grotesk'] text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            VIT <span className="text-zinc-400 font-light">NEXUS</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
            A minimal, glass-crafted academic workspace for Vishwakarma Institute of Technology. Real-time class countdowns, batch-aware laboratory schedules, institutional holiday intelligence, and Form FF957 timetable ingestion.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Form FF957 Verified</span>
            </div>
            <span className="text-zinc-600">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-300" />
              <span>Real-Time Countdown</span>
            </div>
            <span className="text-zinc-600">·</span>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-zinc-300" />
              <span>Batch Filtering</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onInitialize}
              className="flex items-center gap-2 rounded-xl bg-white text-zinc-950 px-6 py-3 text-xs sm:text-sm font-semibold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>Initialize My Division</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreDefault}
              className="glass-button flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <span>Explore Demo (CSAI Div B)</span>
            </button>
          </div>
        </div>

        {/* Minimalist Specs Card */}
        <div className="shrink-0 w-full lg:w-80 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs font-mono space-y-3 shadow-inner">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pb-2 border-b border-white/[0.06]">
            System Architecture
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Interface:</span>
            <span className="text-zinc-200 font-semibold">Minimal Glass</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Format Standard:</span>
            <span className="text-zinc-200 font-semibold">Form FF957</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Offline Support:</span>
            <span className="text-emerald-400 font-semibold">PWA Local Storage</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Time Zone:</span>
            <span className="text-zinc-200 font-semibold">Asia/Kolkata (IST)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
