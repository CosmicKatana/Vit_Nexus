import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { X, Smartphone, Share2, PlusSquare, Download, Check, ExternalLink, Bookmark, Sparkles } from 'lucide-react';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileInstallModal: React.FC<MobileInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-2xl p-0 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="glass-surface relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0d0f14]/95 border border-white/[0.1] shadow-2xl p-6 sm:p-8 text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/[0.08]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] border border-white/[0.14] text-white shadow-inner">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Progressive Web App
              </span>
            </div>
            <h3 className="font-['Cabinet_Grotesk'] text-xl font-extrabold text-white">
              Save to Home Screen
            </h3>
            <p className="text-xs text-zinc-400">
              Run VIT Nexus as a native standalone web app
            </p>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="block text-white font-semibold">Fullscreen</span>
            <span className="text-[10px] text-zinc-500">No URL bar</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="block text-emerald-400 font-semibold">Offline</span>
            <span className="text-[10px] text-zinc-500">Cached slots</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="block text-white font-semibold">1-Tap Open</span>
            <span className="text-[10px] text-zinc-500">From home screen</span>
          </div>
        </div>

        {/* Device-Specific Instructions */}
        {isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-3.5 my-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              iPhone / iPad Safari Instructions:
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white font-mono text-xs font-bold">
                  1
                </span>
                <div className="flex-1">
                  <span>Tap the </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.12] text-white font-medium">
                    <Share2 className="h-3 w-3" /> Share
                  </span>
                  <span> button in Safari's bottom toolbar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white font-mono text-xs font-bold">
                  2
                </span>
                <div className="flex-1">
                  <span>Scroll down and tap </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.12] text-white font-medium">
                    <PlusSquare className="h-3 w-3" /> Add to Home Screen
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white font-mono text-xs font-bold">
                  3
                </span>
                <div className="flex-1">
                  <span>Tap </span>
                  <span className="text-white font-semibold">"Add"</span>
                  <span> in the top right corner. The VIT Nexus icon will now appear on your phone screen!</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Android / Desktop / Chrome Guide */
          <div className="space-y-4 my-4">
            {isInstallable && (
              <button
                onClick={async () => {
                  const success = await install();
                  if (success) onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all cursor-pointer shadow-lg active:scale-98"
              >
                <Download className="h-4 w-4" />
                <span>Install Web App Directly</span>
              </button>
            )}

            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Android Chrome / Browser Instructions:
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white font-mono text-xs font-bold">
                  1
                </span>
                <div className="flex-1">
                  <span>Tap the </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.12] text-white font-mono font-bold">
                    ⋮
                  </span>
                  <span> (three dots menu) in Chrome / Edge.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-white font-mono text-xs font-bold">
                  2
                </span>
                <div className="flex-1">
                  <span>Select </span>
                  <span className="text-white font-semibold">"Add to Home screen"</span>
                  <span> or </span>
                  <span className="text-white font-semibold">"Install app"</span>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">
            Works 100% offline once added
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
