import React from 'react';

interface FuturisticLoaderProps {
  label?: string;
  divisionSlug?: string;
}

export const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({
  label = 'SYNCING ACADEMIC DATA',
  divisionSlug,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {/* Hexagonal HUD Nexus Ring Animation */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-25" />
        
        {/* Rotating Outer Hexagon Grid */}
        <div className="absolute inset-2 rounded-2xl border border-dashed border-cyan-400/40 animate-spin duration-10000" />
        
        {/* Counter-rotating Inner Ring */}
        <div className="absolute inset-4 rounded-xl border-t-2 border-r-2 border-cyan-400 animate-spin duration-1000" />

        {/* Center Glyphs */}
        <div className="flex flex-col items-center justify-center font-mono font-black text-cyan-300 text-sm tracking-widest">
          <span>VN</span>
          <span className="h-1 w-1 rounded-full bg-emerald-400 mt-0.5" />
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <div className="font-['Cabinet_Grotesk'] text-base font-extrabold tracking-widest text-slate-100 uppercase">
          VIT <span className="text-cyan-400">NEXUS</span>
        </div>
        <p className="font-mono text-xs text-cyan-400/80 tracking-wider">
          {label}
        </p>
        {divisionSlug && (
          <p className="font-mono text-[10px] text-slate-400">
            Querying verified schedule for {divisionSlug}...
          </p>
        )}
      </div>
    </div>
  );
};
