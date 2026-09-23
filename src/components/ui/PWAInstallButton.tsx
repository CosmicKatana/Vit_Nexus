import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { MobileInstallModal } from './MobileInstallModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white hover:bg-white/[0.09] hover:border-white/[0.18] transition-all cursor-pointer whitespace-nowrap shadow-sm group"
        title="Save to Home Screen as a Web App"
      >
        <Smartphone className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Save WebApp</span>
      </button>

      <MobileInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
