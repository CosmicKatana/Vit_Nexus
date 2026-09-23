import React, { useState } from 'react';
import {
  UserAcademicConfig,
  BranchCode,
  DivisionLetter,
  BatchNumber,
  ProgramCode,
} from '../../types/timetable';
import { PROGRAMS, BRANCHES, DIVISIONS, BATCHES } from '../../data/programsAndBranches';
import { X, CheckCircle, Sparkles, SlidersHorizontal, BookOpen, Compass } from 'lucide-react';

interface IdentityPickerModalProps {
  currentConfig?: UserAcademicConfig | null;
  onSave: (config: UserAcademicConfig) => void;
  onClose?: () => void;
  isFirstVisit: boolean;
}

export const IdentityPickerModal: React.FC<IdentityPickerModalProps> = ({
  currentConfig,
  onSave,
  onClose,
  isFirstVisit,
}) => {
  const [program, setProgram] = useState<ProgramCode>(
    currentConfig?.program || 'BTECH'
  );
  const [branch, setBranch] = useState<BranchCode>(
    currentConfig?.branch || 'CSAI'
  );
  const [academicYear, setAcademicYear] = useState<string>(
    currentConfig?.academicYear || '2026-27'
  );
  const [division, setDivision] = useState<DivisionLetter>(
    currentConfig?.division || 'B'
  );
  const [batch, setBatch] = useState<BatchNumber>(
    currentConfig?.batch || '1'
  );
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>(
    currentConfig?.timeFormat || '12'
  );

  const selectedBranchInfo = BRANCHES[branch];
  const availableDivisions = selectedBranchInfo?.defaultDivisions || DIVISIONS;

  // Auto-adjust division if current selection not available in new branch
  const handleBranchSelect = (b: BranchCode) => {
    setBranch(b);
    const divs = BRANCHES[b]?.defaultDivisions || DIVISIONS;
    if (!divs.includes(division)) {
      setDivision(divs[0]);
    }
  };

  const handleInitialize = () => {
    const newConfig: UserAcademicConfig = {
      version: '1.0',
      program,
      branch,
      academicYear,
      semester: 1,
      division,
      batch,
      timeFormat,
      lastUpdated: new Date().toISOString(),
    };
    onSave(newConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan-500/40 bg-slate-900/95 shadow-[0_0_50px_rgba(6,182,212,0.18)] p-6 sm:p-8 my-auto text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button if not first visit */}
        {!isFirstVisit && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Header HUD Branding */}
        <div className="text-center pb-4 border-b border-slate-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <Sparkles className="h-3 w-3" />
            <span>ACADEMIC COMMAND INITIALIZATION</span>
          </div>

          <h2 className="font-['Cabinet_Grotesk'] text-2xl sm:text-3xl font-black tracking-tight text-slate-100 uppercase">
            VIT <span className="text-cyan-400">NEXUS</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            Select your academic profile to load and customize your timetable engine. Saved locally on your device with offline caching.
          </p>
        </div>

        {/* Configuration Steps Form */}
        <div className="space-y-5 my-6 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          {/* Step 1: Program */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              1. ACADEMIC PROGRAM
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PROGRAMS.map((prog) => (
                <button
                  key={prog.code}
                  type="button"
                  onClick={() => setProgram(prog.code)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    program === prog.code
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {prog.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Branch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                2. ACADEMIC BRANCH
              </label>
              <span className="text-[10px] font-mono text-cyan-400">
                {selectedBranchInfo.campus}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(BRANCHES) as BranchCode[]).map((bCode) => {
                const b = BRANCHES[bCode];
                const isSelected = branch === bCode;
                return (
                  <button
                    key={bCode}
                    type="button"
                    onClick={() => handleBranchSelect(bCode)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/40'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">
                      {b.shortLabel}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                      {b.code}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Division Selection */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              3. DIVISION / SECTION
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDivisions.map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setDivision(div)}
                  className={`min-w-[46px] h-11 flex items-center justify-center rounded-xl border font-mono text-sm font-black transition-all cursor-pointer ${
                    division === div
                      ? 'border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Batch Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                4. LABORATORY & TUTORIAL BATCH
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Deterministic practical slot
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BATCHES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBatch(b)}
                  className={`py-2.5 px-3 rounded-xl border text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                    batch === b
                      ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  BATCH {b}
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Clock Display Format */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              5. CLOCK TIME FORMAT
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTimeFormat('12')}
                className={`flex-1 py-2 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timeFormat === '12'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 ring-1 ring-cyan-400/40'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                12-Hour (AM / PM)
              </button>
              <button
                type="button"
                onClick={() => setTimeFormat('24')}
                className={`flex-1 py-2 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timeFormat === '24'
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 ring-1 ring-cyan-400/40'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                24-Hour (Military)
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleInitialize}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 px-6 font-['Cabinet_Grotesk'] text-base font-black tracking-wide text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer active:scale-[0.98]"
          >
            <CheckCircle className="h-5 w-5" />
            <span>INITIALIZE MY TIMETABLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
