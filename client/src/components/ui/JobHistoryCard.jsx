import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      default: return 'red';
    }
  };

  return (
    <div className="glass p-4 rounded-2xl mb-3 flex flex-col gap-3 hover:border-gray-500 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-200">{sectionName || 'Unnamed Section'}</h4>
          <p className="text-xs text-gray-500 mt-1">{pageName}</p>
        </div>
        <Badge label={mode} color={getModeColor(mode)} />
      </div>
      
      <div className="text-xs text-gray-500">
        {new Date(timestamp).toLocaleString()}
      </div>
      
      <div className="flex gap-2 mt-1">
        <button 
          onClick={() => navigate(`/preview/${pageName}`)}
          className="flex-1 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Preview
        </button>
        <button 
          className="flex-1 py-1.5 text-xs font-medium text-gray-400 bg-transparent border border-gray-700 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
        >
          Re-open
        </button>
      </div>
    </div>
  );
}
