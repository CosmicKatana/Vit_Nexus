import React from 'react';
import { LayoutDashboard, Search, CalendarDays, Clock, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface MobileNavigationProps {
  activeTab: 'command' | 'timetable' | 'week' | 'calendar';
  onSelectTab: (tab: 'command' | 'timetable' | 'week' | 'calendar') => void;
  onOpenMobileInstall: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenMobileInstall,
}) => {
  const { isInstalled } = usePWAInstall();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-[#0b0d11]/90 backdrop-blur-2xl px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Tab 1: Command */}
        <button
          onClick={() => onSelectTab('command')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'command'
              ? 'text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'command' ? 'bg-white/[0.1]' : ''}`}>
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Command</span>
        </button>

        {/* Tab 2: Timeline */}
        <button
          onClick={() => onSelectTab('timetable')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'timetable'
              ? 'text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'timetable' ? 'bg-white/[0.1]' : ''}`}>
            <Search className="h-4 w-4" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Timeline</span>
        </button>

        {/* Tab 3: Weekly Grid */}
        <button
          onClick={() => onSelectTab('week')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'week'
              ? 'text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'week' ? 'bg-white/[0.1]' : ''}`}>
            <CalendarDays className="h-4 w-4" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Weekly</span>
        </button>

        {/* Tab 4: Calendar */}
        <button
          onClick={() => onSelectTab('calendar')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'calendar'
              ? 'text-white font-semibold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'calendar' ? 'bg-white/[0.1]' : ''}`}>
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Calendar</span>
        </button>

        {/* Action: Save to Home Screen */}
        <button
          onClick={onOpenMobileInstall}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer group"
          title="Add to Home Screen"
        >
          <div className="relative p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:bg-white/[0.1] text-emerald-400">
            <Smartphone className="h-4 w-4" />
            {!isInstalled && (
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0d11] animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-mono text-zinc-400 group-hover:text-zinc-200">
            {isInstalled ? 'App Mode' : 'Save App'}
          </span>
        </button>
      </div>
    </nav>
  );
};
