import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glow' | 'accent' | 'subtle';
  className?: string;
  hasCorners?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  hasCorners = true,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glow':
        return 'bg-slate-900/80 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.12)]';
      case 'accent':
        return 'bg-slate-900/90 border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.12)]';
      case 'subtle':
        return 'bg-slate-950/60 border-slate-800/60';
      default:
        return 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80';
    }
  };

  return (
    <div
      className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-200 ${getVariantStyles()} ${className}`}
      {...props}
    >
      {/* HUD Corner Accents */}
      {hasCorners && (
        <>
          <span className="pointer-events-none absolute -top-[1px] -left-[1px] h-3 w-3 rounded-tl-[15px] border-t-2 border-l-2 border-cyan-400/50" />
          <span className="pointer-events-none absolute -top-[1px] -right-[1px] h-3 w-3 rounded-tr-[15px] border-t-2 border-r-2 border-cyan-400/50" />
          <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] h-3 w-3 rounded-bl-[15px] border-b-2 border-l-2 border-cyan-400/50" />
          <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-3 w-3 rounded-br-[15px] border-b-2 border-r-2 border-cyan-400/50" />
        </>
      )}
      {children}
    </div>
  );
};
