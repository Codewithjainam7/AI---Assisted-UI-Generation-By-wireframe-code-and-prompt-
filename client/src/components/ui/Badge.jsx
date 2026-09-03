import React from 'react';

export default function Badge({ label, color = 'red' }) {
  const colorClasses = {
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${colorClasses[color] || colorClasses.red}`}>
      {label}
    </span>
  );
}
