import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Layers, Eye, Menu, X, Cpu, Compass } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      <div className="glass-dock rounded-full px-5 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
              UIGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-extrabold">Studio</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">iOS 26 Liquid Edition</span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/8 shadow-inner">
          <NavLink to="/" className={navLinkClass}>
            <Compass className="w-3.5 h-3.5" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/generate" className={navLinkClass}>
            <Layers className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </NavLink>
          <NavLink to="/preview/Home" className={navLinkClass}>
            <Eye className="w-3.5 h-3.5" />
            <span>Studio Preview</span>
          </NavLink>
        </nav>

        {/* Engine Status Beacon */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium text-slate-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Neural Engine Active</span>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-dock rounded-3xl p-4 flex flex-col gap-2 shadow-2xl border border-white/15 animate-fade-up">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/generate" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            <Layers className="w-4 h-4" />
            <span>Workspace</span>
          </NavLink>
          <NavLink to="/preview/Home" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>
            <Eye className="w-4 h-4" />
            <span>Studio Preview</span>
          </NavLink>
        </div>
      )}
    </header>
  );
}
