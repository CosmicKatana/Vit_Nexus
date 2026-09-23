import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Lock, Unlock, UploadCloud } from 'lucide-react';
import { checkIsCreatorAdmin, setCreatorAdminState } from '../../utils/adminAuth';

interface AboutModalProps {
  onClose: () => void;
  onOpenUpload?: () => void;
  isAdmin?: boolean;
  onToggleAdmin?: (val: boolean) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  onClose,
  onOpenUpload,
  isAdmin = false,
  onToggleAdmin,
}) => {
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passInput.trim().toLowerCase();
    // Accept creator keys
    if (clean === 'daksh' || clean === 'nexivia' || clean === '2026' || clean === 'admin') {
      setCreatorAdminState(true);
      if (onToggleAdmin) onToggleAdmin(true);
      setShowAdminPass(false);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleLockAdmin = () => {
    setCreatorAdminState(false);
    if (onToggleAdmin) onToggleAdmin(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 overflow-y-auto">
      <div className="studio-card relative w-full max-w-lg rounded-3xl bg-[#0d0f14]/95 border border-white/[0.12] shadow-2xl p-6 sm:p-8 my-auto text-zinc-200">
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
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-wide">
                FY CSE-Ai B
              </span>
            </div>
            <h3 className="font-['Cabinet_Grotesk'] text-xl font-extrabold text-white mt-1">
              Daksh Mehan
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Nexivia Solutions LLP · Vishwakarma Institute of Technology
            </p>
          </div>
        </div>

        {/* Mission / Context */}
        <div className="space-y-3.5 my-5 text-xs text-zinc-300 leading-relaxed">
          <p>
            <strong className="text-white">VIT Nexus</strong> is a high-precision academic command center engineered to replace cumbersome PDF schedules with an intelligent, deterministic, and live class tracking workspace.
          </p>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-200 font-semibold font-mono text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero-Fabrication Data Standard</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Every session, room, time slot, holiday, and exam window strictly reflects official Form FF957 departmental timetables and Dean of Academics circulars.
            </p>
          </div>
        </div>

        {/* Creator Admin Mode Control */}
        <div className="pt-4 border-t border-white/[0.08]">
          {isAdmin ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Unlock className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white font-mono">Creator Mode Unlocked</div>
                  <div className="text-[10px] text-zinc-400 font-mono">You can upload & update timetable PDFs</div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onOpenUpload && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUpload();
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all cursor-pointer"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload PDF</span>
                  </button>
                )}
                <button
                  onClick={handleLockAdmin}
                  className="px-2.5 py-1.5 rounded-xl border border-white/[0.1] text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                  title="Lock creator privileges"
                >
                  Lock
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              {!showAdminPass ? (
                <button
                  onClick={() => setShowAdminPass(true)}
                  className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                  <span>Creator Portal Access</span>
                </button>
              ) : (
                <form onSubmit={handleUnlockAdmin} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Creator Passcode</span>
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(false)}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Enter passkey (e.g. daksh)..."
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      className="flex-1 rounded-xl bg-black/40 border border-white/[0.1] px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.3]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 cursor-pointer"
                    >
                      Unlock
                    </button>
                  </div>
                  {passError && (
                    <p className="text-[10px] text-rose-400 font-mono">
                      Invalid passcode. Creator access only.
                    </p>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
