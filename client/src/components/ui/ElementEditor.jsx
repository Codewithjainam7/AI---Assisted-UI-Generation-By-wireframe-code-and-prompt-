import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchElement } from '../../features/cms/cmsSlice';

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
  };

  const handleBlur = (fieldId) => {
    const originalEl = elements.find(e => e.fieldId === fieldId);
    const currentValue = localValues[fieldId];
    const originalValue = originalEl?.contentType === 'Cards' ? originalEl.loop : originalEl?.content;
    
    if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
      dispatch(patchElement({ fieldId, pageName, content: currentValue }))
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
      <div className="text-gray-500 text-sm text-center py-8">
        <i className="pi pi-info-circle text-2xl mb-2 block text-gray-600" />
        No editable elements found for this section.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {elements.map((el, idx) => (
        <div key={`${el.fieldId}-${idx}`} className="flex flex-col gap-2 relative group bg-black/20 p-3.5 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                {el.elementName || el.fieldId}
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-gray-500">{el.fieldId}</span>
              {saveStatus[el.fieldId] === 'saved' && <i className="pi pi-check text-green-400 text-xs animate-fade-up" />}
              {saveStatus[el.fieldId] === 'error' && <i className="pi pi-times text-red-400 text-xs animate-fade-up" />}
            </div>
          </div>
          
          {(el.contentType === 'Text' || el.contentType === 'Textfield' || el.contentType === 'Button') && (
            <textarea
              rows={el.contentType === 'Textfield' ? 3 : 2}
              value={localValues[el.fieldId] || ''}
              onChange={(e) => handleChange(el.fieldId, e.target.value)}
              onBlur={() => handleBlur(el.fieldId)}
              className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white w-full resize-none focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 leading-relaxed font-sans"
            />
          )}

          {el.contentType === 'Image' && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={localValues[el.fieldId] || ''}
                onChange={(e) => handleChange(el.fieldId, e.target.value)}
                onBlur={() => handleBlur(el.fieldId)}
                placeholder="Image path or URL"
                className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white w-full focus:outline-none focus:border-red-500/60"
              />
            </div>
          )}

          {el.contentType === 'Cards' && Array.isArray(localValues[el.fieldId]) && (
            <div className="flex flex-col gap-2.5 pt-1">
              {localValues[el.fieldId].map((item, cIdx) => (
                <div key={item.fieldId1 || cIdx} className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Card {cIdx + 1}</span>
                  <input
                    type="text"
                    value={item.field1 || ''}
                    placeholder="Stat Value (e.g. 1000+)"
                    onChange={(e) => {
                      const newArray = [...localValues[el.fieldId]];
                      newArray[cIdx] = { ...newArray[cIdx], field1: e.target.value };
                      handleChange(el.fieldId, newArray);
                    }}
                    onBlur={() => handleBlur(el.fieldId)}
                    className="bg-black/30 border border-white/10 rounded-lg p-1.5 text-xs text-white font-bold focus:border-red-500/60 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.field2 || ''}
                    placeholder="Stat Label"
                    onChange={(e) => {
                      const newArray = [...localValues[el.fieldId]];
                      newArray[cIdx] = { ...newArray[cIdx], field2: e.target.value };
                      handleChange(el.fieldId, newArray);
                    }}
                    onBlur={() => handleBlur(el.fieldId)}
                    className="bg-black/30 border border-white/10 rounded-lg p-1.5 text-xs text-gray-300 focus:border-red-500/60 focus:outline-none"
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
