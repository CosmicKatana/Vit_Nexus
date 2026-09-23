import React from 'react';
import { Sparkles, Terminal, Code2, Cpu } from 'lucide-react';

interface FooterSignatureProps {
  onOpenAbout?: () => void;
}

export const FooterSignature: React.FC<FooterSignatureProps> = ({ onOpenAbout }) => {
  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div 
        onClick={onOpenAbout}
        className="glass-surface glass-surface-hover group relative max-w-xl w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/[0.1] bg-[#0d0f14]/80 backdrop-blur-2xl transition-all duration-300 cursor-pointer overflow-hidden shadow-xl"
      >
        {/* Subtle decorative hairline ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-32 bg-white/[0.03] rounded-full blur-2xl group-hover:bg-white/[0.06] transition-colors" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 text-center sm:text-left">
          {/* Graphic Crest */}
          <div className="flex items-center gap-3.5">
            {/* Custom Nexivia Architectural Emblem */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] border border-white/[0.16] shadow-inner transition-transform group-hover:scale-105">
              {/* Geometric Core */}
              <svg 
                className="h-6 w-6 text-white transition-transform group-hover:rotate-12 duration-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.75" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0d0f14]" />
            </div>

            {/* Typography Attribution */}
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <span>DEVELOPED BY</span>
                <span className="text-zinc-600">/</span>
                <span className="text-emerald-400 font-semibold">LEAD ENGINEER</span>
              </div>
              <div className="font-['Cabinet_Grotesk'] text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5 group-hover:text-zinc-100">
                Daksh Mehan
              </div>
            </div>
          </div>

          {/* Right Pillar: Organization & Batch */}
          <div className="flex flex-col items-center sm:items-end border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-zinc-200">
              <span className="text-white font-bold">Nexivia Solutions LLP</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-300 font-medium">
                FY CSE-AI
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">VIT Pune</span>
            </div>
          </div>
        </div>

        {/* Bottom micro-bar */}
        <div className="mt-3.5 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Engineered with Zero-Fabrication Accuracy</span>
          <span className="text-zinc-400 group-hover:text-white transition-colors">Tap for info →</span>
        </div>
      </div>
    </div>
  );
};
