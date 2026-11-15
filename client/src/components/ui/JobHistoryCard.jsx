import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, Layers } from 'lucide-react';
import Badge from './Badge';

export default function JobHistoryCard({ job }) {
  const navigate = useNavigate();
  const { sectionId, pageName, sectionName, mode, timestamp } = job;

  const getModeColor = (m) => {
    switch (m) {
      case 'wireframe': return 'blue';
      case 'code': return 'green';
      case 'prompt': return 'purple';
      case 'combined': return 'orange';
      default: return 'blue';
    }
  };

  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

  return (
    <div className="glass-liquid-card p-4 rounded-2xl mb-3 flex flex-col gap-3 group">
      <div className="flex justify-between items-start">
        <div className="min-w-0 pr-2">
          <h4 className="font-bold text-sm text-white truncate tracking-tight">{sectionName || 'CustomSection'}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>{pageName}</span>
          </p>
        </div>
        <Badge label={mode} color={getModeColor(mode)} />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-white/5">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{formattedTime}</span>
        </span>
        <button
          onClick={() => navigate(`/preview/${pageName}`)}
          className="px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}
