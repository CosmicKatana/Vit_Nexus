import React from 'react';
import { Database, ShieldCheck, WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isCached: boolean;
  cachedAt?: string;
  sourceVersion?: string;
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isCached,
  cachedAt,
  sourceVersion,
  isOnline,
}) => {
  if (isOnline && !isCached) {
    return null;
  }

  const formatTimestamp = (iso?: string) => {
    if (!iso) return 'Recent sync';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST';
    } catch {
      return iso;
    }
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2.5 text-xs text-amber-200 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <WifiOff className="h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
        ) : (
          <Database className="h-4 w-4 shrink-0 text-amber-400" />
        )}
        <span className="font-semibold tracking-wide">
          {!isOnline ? 'OFFLINE MODE' : 'OFFLINE VERIFIED CACHE'}
        </span>
        <span className="hidden sm:inline text-amber-400/60">·</span>
        <span className="text-amber-300/80">
          Showing verified schedule from official Form FF957 {sourceVersion ? `(v${sourceVersion})` : ''}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 tabular-nums">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>LAST VERIFIED: {formatTimestamp(cachedAt)}</span>
      </div>
    </div>
  );
};
