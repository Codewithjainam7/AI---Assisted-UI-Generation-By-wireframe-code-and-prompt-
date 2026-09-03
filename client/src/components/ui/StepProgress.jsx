import React from 'react';

export default function StepProgress({ currentStep, steps }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-800 -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 transition-all duration-500 -z-10"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isPast = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isPast ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                  isActive ? 'bg-red-500 shadow-glow-sm animate-pulse-slow ring-4 ring-red-500/30' :
                  'bg-gray-800 border-2 border-gray-700'
                }`}
              ></div>
              <span className={`text-xs mt-2 font-medium transition-colors ${
                isActive ? 'text-red-400' : isPast ? 'text-green-400' : 'text-gray-500'
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
