import React from 'react';

export default function GlassCard({ children, className = '', glow = false, onClick = null }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[28px] glass-liquid-card relative overflow-hidden p-6 sm:p-7 ${
        glow ? 'border-blue-500/40 shadow-liquid-glow' : ''
      } ${className}`}
    >
      {/* Specular edge sheen */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
