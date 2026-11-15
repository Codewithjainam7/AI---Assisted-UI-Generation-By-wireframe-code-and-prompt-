import React from 'react';
import Navbar from './Navbar';

export default function PageShell({ children, showNav = true, className = '' }) {
  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* iOS 26 Atmospheric Liquid Lighting Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-15%] right-[-5%] w-[650px] h-[650px] rounded-full bg-blue-600/15 blur-[160px] animate-pulse-subtle" />
        <div className="absolute top-[25%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/12 blur-[170px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[180px]" />
        {/* Subtle noise grid texture overlay for physical glass grain */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {showNav && <Navbar />}

      <main className={`relative z-10 ${showNav ? 'pt-28 pb-16' : ''} ${className}`}>
        {children}
      </main>
    </div>
  );
}
