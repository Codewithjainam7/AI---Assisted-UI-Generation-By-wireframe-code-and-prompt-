import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import GlassCard from '../components/ui/GlassCard';

export default function LandingPage() {
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center py-20 lg:py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 text-xs font-medium text-gray-300 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            v1.0 Live Beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up" style={{animationDelay: '0.1s'}}>
            AI-Assisted <br className="hidden md:block"/>
            <span className="gradient-text">UI Generation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 animate-fade-up" style={{animationDelay: '0.2s'}}>
            From wireframe, code, or prompt — generate CMS-ready React sections instantly with iOS 26 glassmorphism and automatic Redux bindings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{animationDelay: '0.3s'}}>
            <Link to="/generate" className="px-8 py-4 rounded-full shimmer-bg text-white font-semibold text-lg hover:shadow-glow-red transition-shadow">
              Start Generating <i className="pi pi-arrow-right ml-2 text-sm"></i>
            </Link>
            <Link to="/preview/Home" className="px-8 py-4 rounded-full glass border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-colors">
              View Preview
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 py-12">
          <GlassCard className="animate-fade-up" style={{animationDelay: '0.4s'}}>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-6">
              <i className="pi pi-image"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Wireframe Mode</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Upload a rough PNG sketch. Our AI vision model analyzes regions and generates a structured React component matching your intent.
            </p>
          </GlassCard>

          <GlassCard className="animate-fade-up" style={{animationDelay: '0.5s'}}>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center text-2xl mb-6">
              <i className="pi pi-code"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Code Mode</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Paste existing static JSX. The engine extracts text and images, creates CMS bindings, and returns dynamic Redux-connected code.
            </p>
          </GlassCard>

          <GlassCard className="animate-fade-up" style={{animationDelay: '0.6s'}}>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-6">
              <i className="pi pi-pencil"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Prompt Mode</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Describe the UI in plain English. We build the AST, apply design system tokens, and output production-ready frontend code.
            </p>
          </GlassCard>
        </div>

        {/* Tech Stack */}
        <div className="py-12 border-t border-white/10 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest font-semibold">Powered By</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['React 18', 'Vite', 'Redux Toolkit', 'Tailwind CSS', 'PrimeReact', 'Node.js', 'Express', 'Google Gemini'].map(tech => (
              <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
