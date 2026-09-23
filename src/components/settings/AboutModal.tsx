import React from 'react';
import { X, ShieldCheck, Sparkles, Building2, User, Award } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 overflow-y-auto">
      <div className="glass-surface relative w-full max-w-lg rounded-3xl bg-[#0d0f14]/95 border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-auto text-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Profile / Attribution Card */}
        <div className="flex items-center gap-4 pb-5 border-b border-white/[0.08]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.12] text-white font-['Cabinet_Grotesk'] text-xl font-bold shadow-inner">
            DM
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-300 uppercase">
                Creator & Developer
              </span>
            </div>
            <h3 className="font-['Cabinet_Grotesk'] text-xl font-bold text-white mt-1">
              Daksh Mehan
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Nexivia Solutions LLP · FY CSE-AI
            </p>
          </div>
        </div>

        {/* Attribution Badge Graphic */}
        <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3.5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.08] border border-white/[0.14] flex items-center justify-center text-white">
            <Building2 className="h-5 w-5 opacity-90" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
              Organization & Division
            </span>
            <div className="text-sm font-semibold text-white">
              Nexivia Solutions LLP
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              FY CSE-AI · Vishwakarma Institute of Technology
            </div>
          </div>
        </div>

        {/* Mission / Context */}
        <div className="space-y-3.5 my-5 text-xs text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-white">VIT Nexus</strong> is a high-precision academic command center engineered to replace cumbersome PDF schedules with an intelligent, deterministic, and live class tracking workspace.
          </p>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero-Fabrication Data Standard</span>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Every session, room, time slot, holiday, and exam window is verified against official Form FF957 departmental timetables and Dean of Academics circulars.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
