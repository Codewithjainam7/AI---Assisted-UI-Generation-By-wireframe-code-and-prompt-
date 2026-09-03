import React, { useRef, useState, useEffect } from 'react';

export default function DropZone({ onFile, accept = 'image/png,image/jpeg,image/webp', maxSizeMB = 8, currentFile = null }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const processFile = (file) => {
    setError('');
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`glass-strong border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 relative ${
        isDragging ? 'border-red-500 bg-red-500/10 shadow-glow-red' : preview ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 hover:border-red-400/60 hover:bg-white/5'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
      />
      
      {preview ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <img src={preview} alt="Wireframe Preview" className="max-h-56 rounded-2xl object-contain border border-white/10 shadow-xl" />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Click to replace
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
            <i className="pi pi-check-circle text-xs" />
            <span>{fileName || 'Wireframe Ready'}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-2xl mb-3">
            <i className="pi pi-image" />
          </div>
          <p className="text-base font-semibold text-white">Drag & drop wireframe image</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WebP up to {maxSizeMB}MB</p>
          <span className="mt-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors">
            Browse File
          </span>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-2 font-medium">⚠️ {error}</p>}
    </div>
  );
}
