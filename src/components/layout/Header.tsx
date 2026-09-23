import React from 'react';
import { UserAcademicConfig } from '../../types/timetable';
import { BRANCHES } from '../../data/programsAndBranches';
import { PWAInstallButton } from '../ui/PWAInstallButton';
import { SlidersHorizontal, Info, Clock, CalendarDays, LayoutDashboard, Search, UploadCloud } from 'lucide-react';

interface HeaderProps {
  config: UserAcademicConfig;
  activeTab: 'command' | 'timetable' | 'week' | 'calendar';
  onSelectTab: (tab: 'command' | 'timetable' | 'week' | 'calendar') => void;
  onOpenIdentityPicker: () => void;
  onOpenAbout: () => void;
  onOpenUpload?: () => void;
  liveTimeIST: string;
  liveDateIST: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  activeTab,
  onSelectTab,
  onOpenIdentityPicker,
  onOpenAbout,
  onOpenUpload,
  liveTimeIST,
  liveDateIST,
}) => {
  const branchInfo = BRANCHES[config.branch];
  const branchLabel = branchInfo ? branchInfo.shortLabel : config.branch;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0b0d11]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-3">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('command')}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-white shadow-inner transition-transform group-hover:scale-105">
              <span className="font-mono text-xs font-bold tracking-wider">VN</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0d11]" />
            </div>
            <div>
              <span className="font-['Cabinet_Grotesk'] text-base font-extrabold tracking-tight text-white">
                VIT <span className="text-zinc-400 font-normal">NEXUS</span>
              </span>
              <span className="hidden sm:block text-[9px] tracking-widest text-zinc-500 font-mono -mt-0.5 uppercase">
                Academic Operations
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Tabs (Minimal Glass Segmented) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-medium">
          <button
            onClick={() => onSelectTab('command')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'command'
                ? 'bg-white/[0.09] text-white border border-white/[0.12] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 opacity-80" />
            <span>Command</span>
          </button>

          <button
            onClick={() => onSelectTab('timetable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timetable'
                ? 'bg-white/[0.09] text-white border border-white/[0.12] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Search className="h-3.5 w-3.5 opacity-80" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => onSelectTab('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'week'
                ? 'bg-white/[0.09] text-white border border-white/[0.12] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5 opacity-80" />
            <span>Weekly Grid</span>
          </button>

          <button
            onClick={() => onSelectTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white/[0.09] text-white border border-white/[0.12] shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Clock className="h-3.5 w-3.5 opacity-80" />
            <span>Calendar</span>
          </button>
        </nav>

        {/* Actions + Clock & Configuration identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Clock Display in IST */}
          <div className="hidden md:flex flex-col items-end text-right border-r border-white/[0.08] pr-3">
            <span className="font-mono text-xs font-semibold text-zinc-200 tabular-nums tracking-wider">
              {liveTimeIST}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {liveDateIST} · IST
            </span>
          </div>

          {/* Academic Identity Glass Capsule */}
          <button
            onClick={onOpenIdentityPicker}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.09] bg-white/[0.03] px-2.5 sm:px-3 py-1.5 text-xs text-zinc-200 hover:border-white/[0.18] hover:bg-white/[0.06] transition-all cursor-pointer group"
            title="Configure Division & Batch"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:rotate-45" />
            <div className="flex items-center gap-1 font-mono text-xs font-medium">
              <span className="text-white">{branchLabel}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">Div {config.division}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-emerald-400 font-bold">B{config.batch}</span>
            </div>
          </button>

          {/* Upload Timetable PDF Action */}
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.06] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.12] hover:border-white/[0.2] transition-all cursor-pointer whitespace-nowrap shadow-sm"
              title="Upload official Form FF957 timetable PDF"
            >
              <UploadCloud className="h-3.5 w-3.5 text-zinc-300" />
              <span className="hidden sm:inline">Upload PDF</span>
            </button>
          )}

          {/* PWA Install */}
          <PWAInstallButton />

          {/* About / Info */}
          <button
            onClick={onOpenAbout}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="About System"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
