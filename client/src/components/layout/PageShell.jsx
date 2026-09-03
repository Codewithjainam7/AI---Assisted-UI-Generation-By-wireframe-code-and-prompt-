import React from 'react';
import Navbar from './Navbar';

export default function PageShell({ children, showNav = true, className = '' }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-red-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[150px]"></div>
      </div>

      {showNav && <Navbar />}
      
      <main className={`relative z-10 ${showNav ? 'pt-24' : ''} pb-12 ${className}`}>
        {children}
      </main>
    </div>
  );
}
