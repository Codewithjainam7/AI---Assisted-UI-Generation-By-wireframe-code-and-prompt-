import React from 'react';

export default function GlassInput({ label, value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/15 transition-all shadow-inner"
      />
    </div>
  );
}
