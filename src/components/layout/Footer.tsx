import React from 'react';
import { ShieldCheck, RotateCcw, Building2 } from 'lucide-react';
import { FooterSignature } from './FooterSignature';

interface FooterProps {
  onOpenAbout: () => void;
  onResetConfig: () => void;
  version: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onResetConfig,
  version,
}) => {
  return (
    <footer className="mt-12 border-t border-white/[0.08] bg-[#0b0d11]/90 backdrop-blur-2xl pt-6 pb-24 lg:pb-12 text-xs text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Prominent Graphic Attribution Badge */}
        <FooterSignature onOpenAbout={onOpenAbout} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-b border-white/[0.06]">
          {/* Column 1: System Info */}
          <div>
            <div className="flex items-center gap-2 mb-2 font-['Cabinet_Grotesk'] text-sm font-bold text-white">
              <span>VIT NEXUS</span>
              <span className="font-mono text-[10px] text-zinc-400 font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                v{version}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Minimal glass academic command center and timetable schedule engine for Vishwakarma Institute of Technology students. Designed with deterministic filtering, verified data integrity, and zero-guesswork architecture.
            </p>
          </div>

          {/* Column 2: Data Source & Integrity Transparency */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Data Source Transparency</span>
            </div>
            <ul className="space-y-1.5 text-zinc-400 text-xs font-mono">
              <li>• Source: Official VIT Form FF957 (Departmental Schedules)</li>
              <li>• Calendar: FY Academic Calendar 2026–27 (Sem I)</li>
              <li>• Engine: Deterministic batch-aware schedule router</li>
              <li>• Standard: Verified Zero-Fabrication Architecture</li>
            </ul>
          </div>

          {/* Column 3: Attribution & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-2">
                <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                <span>Engineering Attribution</span>
              </div>
              <p className="text-white font-semibold text-xs">
                Developed By Daksh Mehan
              </p>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Nexivia Solutions LLP · FY CSE-AI
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px]">
              <button
                onClick={onOpenAbout}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
              >
                About Project
              </button>
              <span className="text-zinc-700">·</span>
              <button
                onClick={onResetConfig}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reset local academic configuration"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Switch Class</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>
            Unofficial, independent student-built tool. Form FF957 timetable engine.
          </p>
          <p className="font-mono text-zinc-500">
            VIT Pune · All Divisions & Batches Supported
          </p>
        </div>
      </div>
    </footer>
  );
};
