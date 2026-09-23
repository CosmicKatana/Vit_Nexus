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
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by course code, subject name, faculty or room..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Session Type Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-slate-400 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {sessionTypes.map((type) => (
            <button
              key={type}
              onClick={() => onSessionTypeChange(type)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedSessionType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Batch Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[10px] font-mono px-1">Batch:</span>
          {(['1', '2', '3', 'ALL'] as BatchFilter[]).map((b) => (
            <button
              key={b}
              onClick={() => onBatchFilterChange(b)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                selectedBatchFilter === b
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
