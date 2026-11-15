import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, Code2, Wand2, ArrowRight, Eye, Cpu, ShieldCheck, Zap } from 'lucide-react';
import PageShell from '../components/layout/PageShell';
import GlassCard from '../components/ui/GlassCard';

export default function LandingPage() {
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center py-20 lg:py-32 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 text-xs font-semibold text-cyan-300 mb-8 animate-fade-up shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>iOS 26 Liquid Glass Architecture</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-white mb-6 animate-fade-up leading-[1.08]" style={{ animationDelay: '0.1s' }}>
            Transform Vision Into <br className="hidden md:block"/>
            <span className="gradient-text-liquid">Live React Interfaces</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Turn wireframe sketches, existing JSX, or natural intent into high-fidelity production React components bound to live Redux CMS state in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up w-full sm:w-auto justify-center" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/generate"
              className="liquid-button px-8 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-liquid-glow"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/preview/Home"
              className="px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-2xl border border-white/12 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Eye className="w-4 h-4 text-slate-300" />
              <span>Explore Live Preview</span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-6 py-12">
          
          <GlassCard className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
              <Layers className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Vision Wireframe Engine</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Upload rough sketches or digital mockups. Our universal vision parser extracts exact containers, navigation sidebars, and card layouts without rigid template forcing.
            </p>
          </GlassCard>

          <GlassCard className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Redux CMS Synchronization</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every synthesized component adheres strictly to contract rules R1–R14, automatically allocating field IDs and binding to dynamic Redux state and CSS overrides.
            </p>
          </GlassCard>

          <GlassCard className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
              <Wand2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Prompt & Combined Synthesis</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Express design intent in plain English or fuse a wireframe sketch with detailed copy overrides to craft tailored, pixel-accurate responsive interfaces.
            </p>
          </GlassCard>

        </div>

        {/* Tech Stack Banner */}
        <div className="py-16 border-t border-white/8 flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-500" />
            <span>Architecture & Core Frameworks</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            {['React 18', 'Redux Toolkit', 'Tailwind CSS', 'Google Gemini Vision 3.1', 'PrimeReact', 'Vite', 'Babel Standalone', 'Express / Node.js'].map(tech => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 text-xs font-semibold text-slate-300 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
