import React from 'react';
import { Check } from 'lucide-react';

export default function StepProgress({ currentStep, steps }) {
  return (
    <div className="w-full py-5">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 -z-10 rounded-full" />
        
        {/* Active fill line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500 -z-10 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          style={{ width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isPast = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPast 
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-90' 
                    : isActive 
                    ? 'bg-blue-500 text-white ring-4 ring-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105' 
                    : 'bg-slate-900 border border-white/20 text-slate-500'
                }`}
              >
                {isPast ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <span className="text-[10px] font-bold">{index + 1}</span>
                )}
              </div>
              <span className={`text-[11px] mt-2 font-medium tracking-tight transition-colors ${
                isActive ? 'text-cyan-400 font-semibold' : isPast ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
