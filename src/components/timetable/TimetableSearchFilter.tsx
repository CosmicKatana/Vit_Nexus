import React from 'react';
import { BatchFilter, SessionType } from '../../types/timetable';
import { Search, Filter, X } from 'lucide-react';

interface TimetableSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSessionType: string;
  onSessionTypeChange: (type: string) => void;
  selectedBatchFilter: BatchFilter;
  onBatchFilterChange: (batch: BatchFilter) => void;
  userBatch: string;
}

export const TimetableSearchFilter: React.FC<TimetableSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedSessionType,
  onSessionTypeChange,
  selectedBatchFilter,
  onBatchFilterChange,
  userBatch,
}) => {
  const sessionTypes: ('ALL' | SessionType)[] = ['ALL', 'Theory', 'Lab', 'Tutorial', 'Activity'];

  return (
    <div className="studio-card p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3.5">
      {/* Search Input Field */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by course code (e.g. CS2001), subject, faculty initials or room..."
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-white/[0.3] focus:outline-none focus:ring-1 focus:ring-white/[0.2] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Session Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-zinc-400 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {sessionTypes.map((type) => (
              <button
                key={type}
                onClick={() => onSessionTypeChange(type)}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedSessionType === type
                    ? 'bg-white text-zinc-950 shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Batch Filter Buttons */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
          <span className="text-zinc-400 text-[10px] font-mono px-1">Batch:</span>
          {(['1', '2', '3', '4', 'ALL'] as BatchFilter[]).map((b) => (
            <button
              key={b}
              onClick={() => onBatchFilterChange(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedBatchFilter === b
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {b === 'ALL' ? 'All' : `B${b}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
