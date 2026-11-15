import React from 'react';
import Navbar from './Navbar';

export default function PageShell({ children, showNav = true, className = '' }) {
  return (
    <div className="min-h-screen bg-[#03060c] text-slate-100 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* iOS 26 Atmospheric Luminous Liquid Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Electric Indigo/Cobalt Orb */}
        <div className="absolute top-[-10%] right-[-5%] w-[750px] h-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-blue-600/20 to-transparent blur-[140px] animate-pulse-subtle" />
        
        {/* Luminous Cyan Orb */}
        <div className="absolute top-[20%] left-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-cyan-500/22 via-sky-600/18 to-transparent blur-[140px]" />
        
        {/* Deep Violet / Rose Orb */}
        <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-purple-600/20 via-rose-500/12 to-transparent blur-[160px]" />
        
        {/* Subtle center ambient light highlight */}
        <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[170px]" />

        {/* Physical glass fine noise overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px] opacity-35 pointer-events-none" />
      </div>

      {showNav && <Navbar />}

      <main className={`relative z-10 ${showNav ? 'pt-28 pb-16' : ''} ${className}`}>
        {children}
      </main>
    </div>
  );
}
