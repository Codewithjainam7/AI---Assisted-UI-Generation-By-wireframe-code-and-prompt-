import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Check, X, Info, Sliders, Type, Image as ImageIcon, Layers } from 'lucide-react';
import { patchElement, updateLiveCmsValue } from '../../features/cms/cmsSlice';

export default function ElementEditor({ elements = [], pageName }) {
  const dispatch = useDispatch();
  const [localValues, setLocalValues] = useState({});
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    const initialValues = {};
    elements.forEach(el => {
      initialValues[el.fieldId] = el.contentType === 'Cards' ? el.loop : el.content;
    });
    setLocalValues(initialValues);
  }, [elements]);

  const handleChange = (fieldId, value) => {
    setLocalValues(prev => ({ ...prev, [fieldId]: value }));
    dispatch(updateLiveCmsValue({ fieldId, pageName, value }));
  };

  const handleCardFieldChange = (parentFieldId, cIdx, key, val) => {
    const parentCards = Array.isArray(localValues[parentFieldId]) ? [...localValues[parentFieldId]] : [];
    const updatedCards = parentCards.map((c, i) => i === cIdx ? { ...c, [key]: val } : c);
    setLocalValues(prev => ({ ...prev, [parentFieldId]: updatedCards }));
    
    dispatch(updateLiveCmsValue({ fieldId: parentFieldId, pageName, value: updatedCards }));
    
    const targetCard = updatedCards[cIdx];
    const specificId = key === 'field1' ? targetCard?.fieldId1 : targetCard?.fieldId2;
    if (specificId) {
      dispatch(updateLiveCmsValue({ fieldId: specificId, pageName, value: val }));
    }
  };

  const handleBlur = (fieldId) => {
    const originalEl = elements.find(e => e.fieldId === fieldId);
    const currentValue = localValues[fieldId];
    const originalValue = originalEl?.contentType === 'Cards' ? originalEl.loop : originalEl?.content;
    
    if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
      const payload = { fieldId, pageName, content: currentValue };
      if (Array.isArray(currentValue)) {
        payload.loop = currentValue;
      }
      dispatch(patchElement(payload))
        .unwrap()
        .then(() => {
          setSaveStatus(prev => ({ ...prev, [fieldId]: 'saved' }));
          setTimeout(() => setSaveStatus(prev => ({ ...prev, [fieldId]: null })), 2000);
        })
        .catch(() => setSaveStatus(prev => ({ ...prev, [fieldId]: 'error' })));
    }
  };

  if (!elements || elements.length === 0) {
    return (
      <div className="text-slate-400 text-sm text-center py-12 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400">
          <Info className="w-5 h-5 text-cyan-400" />
        </div>
        <p className="text-xs font-mono text-slate-400">No editable CMS elements registered for this view.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {elements.map((el, idx) => (
        <div
          key={`${el.fieldId}-${idx}`}
          className="flex flex-col gap-2.5 relative group bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/8 hover:border-cyan-500/30 transition-all shadow-xs"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-xs" />
              <label className="text-xs font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
                {el.contentType === 'Image' ? <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> : el.contentType === 'Cards' ? <Layers className="w-3.5 h-3.5 text-indigo-400" /> : <Type className="w-3.5 h-3.5 text-slate-400" />}
                <span>{el.elementName || el.fieldId}</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/5">{el.fieldId}</span>
              {saveStatus[el.fieldId] === 'saved' && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 animate-fade-up">
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Synced</span>
                </span>
              )}
              {saveStatus[el.fieldId] === 'error' && (
                <span className="text-rose-400 text-xs flex items-center gap-1 animate-fade-up">
                  <X className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Error</span>
                </span>
              )}
            </div>
          </div>
          
          {(el.contentType === 'Text' || el.contentType === 'Textfield' || el.contentType === 'Button') && (
            <textarea
              rows={el.contentType === 'Textfield' ? 3 : 2}
              value={localValues[el.fieldId] || ''}
              onChange={(e) => handleChange(el.fieldId, e.target.value)}
              onBlur={() => handleBlur(el.fieldId)}
              className="bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-white w-full resize-none focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/15 leading-relaxed font-sans shadow-inner transition-all placeholder-slate-600"
              placeholder={`Enter ${el.elementName || 'content'}...`}
            />
          )}

          {el.contentType === 'Image' && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={localValues[el.fieldId] || ''}
                onChange={(e) => handleChange(el.fieldId, e.target.value)}
                onBlur={() => handleBlur(el.fieldId)}
                placeholder="Image path or https:// URL"
                className="bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-white w-full focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/15 shadow-inner transition-all placeholder-slate-600 font-mono"
              />
            </div>
          )}

          {el.contentType === 'Cards' && Array.isArray(localValues[el.fieldId]) && (
            <div className="flex flex-col gap-2.5 pt-1">
              {localValues[el.fieldId].map((item, cIdx) => (
                <div key={item.fieldId1 || cIdx} className="bg-black/30 p-3 rounded-xl border border-white/8 flex flex-col gap-2 shadow-inner">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Card {cIdx + 1}</span>
                  <input
                    type="text"
                    value={item.field1 || ''}
                    placeholder="Stat Metric (e.g. 1999 Calories, 1000+)"
                    onChange={(e) => handleCardFieldChange(el.fieldId, cIdx, 'field1', e.target.value)}
                    onBlur={() => handleBlur(el.fieldId)}
                    className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white font-bold focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                  <input
                    type="text"
                    value={item.field2 || ''}
                    placeholder="Stat Label or Title"
                    onChange={(e) => handleCardFieldChange(el.fieldId, cIdx, 'field2', e.target.value)}
                    onBlur={() => handleBlur(el.fieldId)}
                    className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-slate-300 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
