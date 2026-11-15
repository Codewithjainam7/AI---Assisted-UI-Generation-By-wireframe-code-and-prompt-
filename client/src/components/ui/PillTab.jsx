import React from 'react';

export default function PillTab({ tabs, active, onChange }) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-2xl p-1.5 rounded-full border border-white/10 shadow-inner inline-flex items-center gap-1 w-full sm:w-auto relative overflow-hidden">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.iconComponent;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
              isActive
                ? 'text-white bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_14px_rgba(0,0,0,0.5)] border border-white/15'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
