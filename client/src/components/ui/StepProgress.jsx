import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export default function StepProgress({ currentStep, steps }) {
  const total = Math.max(steps.length - 1, 1);
  const percentage = Math.min(100, Math.round((currentStep / total) * 100));

  return (
    <div className="w-full py-3">
      {/* Percentage and active node label */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Stage {Math.min(currentStep + 1, steps.length)} of {steps.length}: {steps[Math.min(currentStep, steps.length - 1)]}</span>
        </span>
        <span className="text-xs font-mono text-slate-400 font-bold">{percentage}%</span>
      </div>

      <div className="flex items-center justify-between relative px-2">
        {/* Background track line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[3px] bg-white/10 -z-10 rounded-full" />
        
        {/* Active fill line with glowing head */}
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500 ease-out -z-10 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.7)]"
          style={{ width: `calc(${(currentStep / total) * 100}% - 16px)` }}
        />
        
        {steps.map((step, index) => {
          const isPast = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPast 
                    ? 'bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.6)] scale-90' 
                    : isActive 
                    ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white ring-4 ring-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-110' 
                    : 'bg-slate-900 border border-white/20 text-slate-500'
                }`}
              >
                {isPast ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="text-[11px] font-mono font-bold">{index + 1}</span>
                )}
              </div>
              <span className={`text-[10px] mt-2 font-semibold tracking-tight transition-colors hidden sm:block ${
                isActive ? 'text-cyan-300 font-bold' : isPast ? 'text-slate-300' : 'text-slate-500'
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
