import React from 'react';

export default function PillTab({ tabs, active, onChange }) {
  return (
    <div className="bg-black/40 backdrop-blur-3xl p-1.5 rounded-full border border-white/12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.5)] inline-flex items-center gap-1 w-full sm:w-auto relative overflow-hidden">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.iconComponent;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex-1 sm:flex-none px-4.5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 select-none ${
              isActive
                ? 'text-white bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-cyan-500/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_16px_rgba(37,99,235,0.5)] border border-white/25 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-cyan-200 scale-110' : 'text-slate-400'}`} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
