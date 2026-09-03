import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) => 
    `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="text-red-500">✦</span> UIGen Studio
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/generate" className={navLinkClass}>Generate</NavLink>
          <NavLink to="/preview/Home" className={navLinkClass}>Preview</NavLink>
        </div>

        <div className="hidden md:flex items-center">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
            PS7 Hackathon
          </span>
        </div>

        <button 
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`pi ${mobileMenuOpen ? 'pi-times' : 'pi-bars'} text-xl`}></i>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
          <NavLink to="/generate" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Generate</NavLink>
          <NavLink to="/preview/Home" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Preview</NavLink>
        </div>
      )}
    </nav>
  );
}
