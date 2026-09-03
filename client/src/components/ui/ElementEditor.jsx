import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { patchElement } from '../../features/cms/cmsSlice';

export default function ElementEditor({ elements, pageName }) {
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
    
    // Simple deep equality check for arrays/objects
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
    return <div className="text-gray-500 text-sm text-center py-8">No editable elements found for this section.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {elements.map((el) => (
        <div key={el.fieldId} className="flex flex-col gap-2 relative group">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {el.elementName || el.fieldId}
            </label>
            {saveStatus[el.fieldId] === 'saved' && <i className="pi pi-check text-green-500 text-xs animate-fade-up"></i>}
            {saveStatus[el.fieldId] === 'error' && <i className="pi pi-times text-red-500 text-xs animate-fade-up"></i>}
          </div>
          
          {(el.contentType === 'Text' || el.contentType === 'Textfield' || el.contentType === 'Button') && (
            <textarea
              value={localValues[el.fieldId] || ''}
              onChange={(e) => handleChange(el.fieldId, e.target.value)}
              onBlur={() => handleBlur(el.fieldId)}
              className="glass-strong rounded-xl p-3 text-sm text-white w-full resize-y min-h-[40px] focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          )}

          {el.contentType === 'Image' && (
            <div className="flex gap-3">
              {localValues[el.fieldId] && (
                <img src={localValues[el.fieldId].startsWith('http') ? localValues[el.fieldId] : `${import.meta.env.VITE_STORAGE_URL || ''}${localValues[el.fieldId]}`} alt="thumb" className="w-12 h-12 rounded-lg object-cover bg-gray-800" />
              )}
              <input
                type="text"
                value={localValues[el.fieldId] || ''}
                onChange={(e) => handleChange(el.fieldId, e.target.value)}
                onBlur={() => handleBlur(el.fieldId)}
                placeholder="Image URL or path"
                className="glass-strong rounded-xl p-3 text-sm text-white flex-1 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}

          {el.contentType === 'Cards' && Array.isArray(localValues[el.fieldId]) && (
            <div className="pl-4 border-l-2 border-gray-700 flex flex-col gap-4">
              {localValues[el.fieldId].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 bg-black/20 p-3 rounded-lg">
                  <span className="text-xs text-gray-500">Item {idx + 1}</span>
                  {Object.keys(item).filter(k => k.startsWith('field') && !k.startsWith('fieldType') && !k.startsWith('fieldId')).map(key => (
                    <input
                      key={key}
                      value={item[key] || ''}
                      onChange={(e) => {
                        const newArray = [...localValues[el.fieldId]];
                        newArray[idx] = { ...newArray[idx], [key]: e.target.value };
                        handleChange(el.fieldId, newArray);
                      }}
                      onBlur={() => handleBlur(el.fieldId)}
                      className="bg-transparent border border-gray-700 rounded-md p-2 text-sm text-white focus:border-red-500 focus:outline-none"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
