import React from 'react';

export default function GlassCard({ children, className = '', glow = false }) {
  return (
    <div className={`rounded-3xl glass border shadow-glass p-6 ${glow ? 'shadow-glow-red' : ''} ${className}`}>
      {children}
    </div>
  );
}
