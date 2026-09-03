import React from 'react';

export default function PillTab({ tabs, active, onChange }) {
  return (
    <div className="glass rounded-full p-1 inline-flex relative w-full sm:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative z-10 flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
            active === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
          {active === tab.id && (
            <div className="absolute inset-0 bg-red-500 rounded-full -z-10 shadow-glow-sm" layoutId="activeTab" />
          )}
        </button>
      ))}
    </div>
  );
}
